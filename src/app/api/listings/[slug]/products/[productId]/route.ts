/**
 * PUT    /api/listings/[slug]/products/[productId] — update product (owner/manager)
 * DELETE /api/listings/[slug]/products/[productId] — soft delete product (owner)
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
  requireListingOwner,
  resolveListingBySlug,
} from '@/lib/auth';
import { ALLERGENS } from '@/lib/tokens';

export const runtime = 'nodejs';

const UpdateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  price_pence: z.number().int().positive().optional().nullable(),
  price_currency: z.enum(['GBP', 'EUR']).optional(),
  price_display: z.string().max(50).optional().nullable(),
  category: z.string().min(1).max(100).optional(),
  allergens_contain: z
    .array(z.enum(ALLERGENS))
    .optional()
    .nullable(),
  allergens_may_contain: z.string().max(500).optional().nullable(),
  allergen_verified_at: z.string().datetime().optional().nullable(),
  is_purchasable: z.boolean().optional(),
  is_perishable: z.boolean().optional().nullable(),
  is_seasonal: z.boolean().optional(),
  seasonal_months: z.array(z.number().int().min(1).max(12)).optional().nullable(),
  stock_count: z.number().int().positive().optional().nullable(),
  max_per_order: z.number().int().positive().optional().nullable(),
  display_order: z.number().int().min(0).optional(),
  status: z.enum(['active', 'draft']).optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string; productId: string }> },
): Promise<NextResponse> {
  const { slug, productId } = await params;
  const directoryId = getDirectoryId(request);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  const authResult = await requireListingManager(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parsed = UpdateProductSchema.safeParse(body);
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

  // Validate purchasable constraint if being enabled
  if (data.is_purchasable === true) {
    const supabase = await createClient();
    const { data: existingProduct } = await supabase
      .from('products')
      .select('allergens_contain, allergen_verified_at, allergen_declaration_complete')
      .eq('id', productId)
      .eq('listing_id', listing.id)
      .single();

    const effectiveAllergenComplete =
      (data.allergens_contain !== undefined
        ? data.allergens_contain !== null
        : existingProduct?.allergens_contain !== null) &&
      (data.allergen_verified_at !== undefined
        ? data.allergen_verified_at !== null
        : existingProduct?.allergen_verified_at !== null);

    if (!effectiveAllergenComplete) {
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

    const tier = listing.tier ?? 'free';
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

  // Build update payload (only include defined keys)
  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      updatePayload[key] = value;
    }
  }

  const { data: updated, error: updateError } = await supabase
    .from('products')
    .update(updatePayload)
    .eq('id', productId)
    .eq('listing_id', listing.id)
    .select('id, name, status, is_purchasable, updated_at')
    .single();

  if (updateError) {
    if (updateError.code === 'PGRST116') {
      return NextResponse.json(
        { error: { code: 'not_found', message: 'Product not found' } },
        { status: 404 },
      );
    }
    console.error('[products/put] update error:', updateError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to update product' } },
      { status: 500 },
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; productId: string }> },
): Promise<NextResponse> {
  const { slug, productId } = await params;
  const directoryId = getDirectoryId(request);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  // Only owner can delete
  const authResult = await requireListingOwner(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;

  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from('products')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', productId)
    .eq('listing_id', listing.id)
    .neq('status', 'archived');

  if (updateError) {
    if (updateError.code === 'PGRST116') {
      return NextResponse.json(
        { error: { code: 'not_found', message: 'Product not found or already archived' } },
        { status: 404 },
      );
    }
    console.error('[products/delete] error:', updateError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to archive product' } },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
