/**
 * GET  /api/listings/[slug]/products — list products for a listing
 * POST /api/listings/[slug]/products — create a product (Bronze+ required)
 *
 * F8 — Product catalogue
 * ADR-0004 (auth), ADR-0005 (tier enforcement)
 * Data classification: C0/C1
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  getDirectoryId,
  requireListingManager,
  resolveListingBySlug,
  requireAuth,
} from '@/lib/auth';
import { ALLERGENS } from '@/lib/tokens';

export const runtime = 'nodejs';

const CreateProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  price_pence: z.number().int().positive().optional().nullable(),
  price_currency: z.enum(['GBP', 'EUR']).default('GBP'),
  price_display: z.string().max(50).optional().nullable(),
  category: z.string().min(1).max(100),
  allergens_contain: z
    .array(z.enum(ALLERGENS))
    .optional()
    .nullable(),
  allergens_may_contain: z.string().max(500).optional().nullable(),
  allergen_verified_at: z.string().datetime().optional().nullable(),
  is_purchasable: z.boolean().default(false),
  is_perishable: z.boolean().optional().nullable(),
  is_seasonal: z.boolean().default(false),
  seasonal_months: z.array(z.number().int().min(1).max(12)).optional().nullable(),
  stock_count: z.number().int().positive().optional().nullable(),
  max_per_order: z.number().int().positive().optional().nullable(),
  display_order: z.number().int().min(0).default(0),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);
  const supabase = await createClient();

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  // Determine if requester is owner/manager
  const authResult = await requireAuth(request);
  const requestingUser =
    authResult instanceof NextResponse ? null : authResult.user;

  let isOwnerOrManager = false;
  if (requestingUser) {
    const { data: managerRow } = await supabase
      .from('listing_managers')
      .select('role')
      .eq('listing_id', listing.id)
      .eq('user_id', requestingUser.id)
      .not('accepted_at', 'is', null)
      .single();
    isOwnerOrManager = !!managerRow;
  }

  const tier = listing.tier ?? 'free';
  const canShowPurchasable = ['silver', 'gold'].includes(tier);

  let query = supabase
    .from('products')
    .select(
      `
      id, name, description, price_pence, price_currency, price_display,
      category, allergens_contain, allergens_may_contain, allergen_declaration_complete,
      is_purchasable, is_perishable, is_seasonal, seasonal_months,
      stock_count, stock_reserved, max_per_order, status, display_order,
      created_at, updated_at
      `,
    )
    .eq('listing_id', listing.id)
    .eq('directory_id', directoryId);

  if (!isOwnerOrManager) {
    // Public: only active products; is_purchasable only if Silver/Gold
    query = query.eq('status', 'active');
    if (!canShowPurchasable) {
      query = query.eq('is_purchasable', false);
    }
  }

  query = query.order('display_order', { ascending: true });

  const { data: products, error } = await query;

  if (error) {
    console.error('[products/get] query error:', error.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to fetch products' } },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: products ?? [] });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  // Require owner or manager
  const authResult = await requireListingManager(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;

  // Require Bronze+ tier
  const tier = listing.tier ?? 'free';
  if (tier === 'free') {
    return NextResponse.json(
      {
        error: {
          code: 'tier_required',
          message: 'A Bronze subscription or higher is required to add products',
        },
      },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parsed = CreateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'validation_error',
          message: 'Invalid request body',
          details: parsed.error.flatten(),
        },
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Validate allergen_declaration_complete before allowing is_purchasable=true
  if (data.is_purchasable) {
    const allergenComplete =
      data.allergens_contain !== null &&
      data.allergens_contain !== undefined &&
      data.allergen_verified_at !== null &&
      data.allergen_verified_at !== undefined;

    if (!allergenComplete) {
      return NextResponse.json(
        {
          error: {
            code: 'allergen_declaration_incomplete',
            message:
              'allergens_contain and allergen_verified_at must be set before a product can be made purchasable',
          },
        },
        { status: 422 },
      );
    }

    // Only Silver/Gold can have purchasable products
    if (!['silver', 'gold'].includes(tier)) {
      return NextResponse.json(
        {
          error: {
            code: 'tier_required',
            message: 'A Silver or Gold subscription is required for purchasable products',
          },
        },
        { status: 403 },
      );
    }
  }

  const supabase = await createClient();

  const { data: product, error: insertError } = await supabase
    .from('products')
    .insert({
      listing_id: listing.id,
      directory_id: directoryId,
      name: data.name,
      description: data.description ?? null,
      price_pence: data.price_pence ?? null,
      price_currency: data.price_currency,
      price_display: data.price_display ?? null,
      category: data.category,
      allergens_contain: data.allergens_contain ?? null,
      allergens_may_contain: data.allergens_may_contain ?? null,
      allergen_verified_at: data.allergen_verified_at ?? null,
      is_purchasable: data.is_purchasable,
      is_perishable: data.is_perishable ?? null,
      is_seasonal: data.is_seasonal,
      seasonal_months: data.seasonal_months ?? null,
      stock_count: data.stock_count ?? null,
      max_per_order: data.max_per_order ?? null,
      display_order: data.display_order,
      status: 'draft',
    })
    .select('id, name, status')
    .single();

  if (insertError || !product) {
    console.error('[products/post] insert error:', insertError?.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to create product' } },
      { status: 500 },
    );
  }

  return NextResponse.json(product, { status: 201 });
}
