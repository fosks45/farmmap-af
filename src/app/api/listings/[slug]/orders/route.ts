/**
 * GET /api/listings/[slug]/orders
 * List orders for a listing. Owner/manager auth required. Silver/Gold only.
 * Pagination: ?page=1&limit=20
 *
 * F11 — Order management
 * ADR-0004 (auth), ADR-0005 (tier)
 * Data classification: C3/C4 (buyer fields decrypted in response)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireListingManager, resolveListingBySlug } from '@/lib/auth';
import { decryptNullable, decryptJson } from '@/lib/encryption';

export const runtime = 'nodejs';

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z
    .enum(['pending', 'accepted', 'preparing', 'dispatched', 'delivered', 'cancelled', 'refunded'])
    .optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  // Silver/Gold only
  const tier = listing.tier ?? 'free';
  if (!['silver', 'gold'].includes(tier)) {
    return NextResponse.json(
      {
        error: {
          code: 'tier_required',
          message: 'Order management requires a Silver or Gold subscription',
        },
      },
      { status: 403 },
    );
  }

  const authResult = await requireListingManager(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'validation_error',
          message: 'Invalid query parameters',
          details: parsed.error.flatten(),
        },
      },
      { status: 422 },
    );
  }

  const { page, limit, status } = parsed.data;
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  let query = supabase
    .from('orders')
    .select(
      `
      id, idempotency_key, subtotal_pence, commission_pence, delivery_fee_pence,
      total_pence, currency, status, buyer_name, buyer_email, buyer_phone,
      delivery_address, delivery_slot, notes, cancellation_reason,
      auto_cancel_at, refunded_at, created_at, updated_at,
      order_items(id, product_id, product_name, quantity, unit_price_pence, line_total_pence)
      `,
      { count: 'exact' },
    )
    .eq('listing_id', listing.id)
    .eq('directory_id', directoryId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);

  const { data: orders, error, count } = await query;

  if (error) {
    console.error('[listing/orders/get] query error:', error.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to fetch orders' } },
      { status: 500 },
    );
  }

  // Decrypt C3 fields per order
  const decryptedOrders = (orders ?? []).map((o) => ({
    ...o,
    buyer_name: o.buyer_name ? decryptNullable(o.buyer_name) : null,
    buyer_email: o.buyer_email ? decryptNullable(o.buyer_email) : null,
    buyer_phone: o.buyer_phone ? decryptNullable(o.buyer_phone) : null,
    delivery_address: o.delivery_address
      ? (() => {
          try {
            return decryptJson(o.delivery_address as string);
          } catch {
            return null;
          }
        })()
      : null,
  }));

  const total = count ?? 0;
  const total_pages = Math.ceil(total / limit);

  return NextResponse.json({
    data: decryptedOrders,
    pagination: { page, limit, total, total_pages },
  });
}
