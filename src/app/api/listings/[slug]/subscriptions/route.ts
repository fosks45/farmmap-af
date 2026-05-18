/**
 * GET /api/listings/[slug]/subscriptions
 * Current subscription details for a listing. Owner auth required.
 *
 * F13 — Subscription management
 * ADR-0004 (auth), ADR-0005 (Stripe)
 * Data classification: C0 (tier/status), C3 (stripe IDs decrypted only for owner)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireListingOwner, resolveListingBySlug } from '@/lib/auth';
import { decryptNullable } from '@/lib/encryption';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  const authResult = await requireListingOwner(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;

  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from('listing_subscriptions')
    .select(
      `
      id, tier, status, current_period_start, current_period_end,
      cancel_at_period_end, pending_tier, silver_months_count,
      completed_order_count, gold_unlock_at, trialing_until,
      stripe_subscription_id, stripe_customer_id, stripe_connect_account_id,
      created_at, updated_at, cancelled_at
      `,
    )
    .eq('listing_id', listing.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[subscriptions/get] query error:', error.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to fetch subscription' } },
      { status: 500 },
    );
  }

  if (!subscription) {
    // No subscription record means free tier
    return NextResponse.json({
      tier: 'free',
      status: 'active',
      silver_months_count: 0,
      completed_order_count: 0,
      gold_eligible: false,
      subscription: null,
    });
  }

  // Determine Gold eligibility
  const goldEligible =
    subscription.silver_months_count >= 3 &&
    subscription.completed_order_count >= 50;

  return NextResponse.json({
    tier: subscription.tier,
    status: subscription.status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    pending_tier: subscription.pending_tier,
    silver_months_count: subscription.silver_months_count,
    completed_order_count: subscription.completed_order_count,
    gold_eligible: goldEligible,
    gold_unlock_at: subscription.gold_unlock_at,
    trialing_until: subscription.trialing_until,
    // C3 Stripe IDs: return masked/confirmed presence but not raw encrypted value
    has_stripe_subscription: !!subscription.stripe_subscription_id,
    has_stripe_connect_account: !!subscription.stripe_connect_account_id,
    stripe_customer_id: subscription.stripe_customer_id
      ? decryptNullable(subscription.stripe_customer_id)
      : null,
    created_at: subscription.created_at,
    updated_at: subscription.updated_at,
    cancelled_at: subscription.cancelled_at,
  });
}
