/**
 * POST /api/listings/[slug]/subscriptions/checkout
 * Create a Stripe Checkout session for subscription upgrade.
 * Validates Gold eligibility gate before creating.
 *
 * F13 — Subscription upgrade
 * ADR-0004 (auth), ADR-0005 (Stripe)
 * Data classification: C3 (stripe_customer_id encrypted)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireListingOwner, resolveListingBySlug } from '@/lib/auth';
import { decryptNullable } from '@/lib/encryption';
import { createSubscriptionCheckout } from '@/lib/stripe';
import { trackEvent, getClientIp } from '@/lib/analytics';

export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://farmmap.co.uk';

const CheckoutSchema = z.object({
  tier: z.enum(['bronze', 'silver', 'gold']),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

function isAllowedRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const siteUrl = new URL(SITE_URL);
    return (
      parsed.hostname === siteUrl.hostname ||
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1'
    );
  } catch {
    return false;
  }
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

  const authResult = await requireListingOwner(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;
  const { user } = authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parsed = CheckoutSchema.safeParse(body);
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

  const { tier, successUrl, cancelUrl } = parsed.data;

  // Validate redirect URLs against allowlist
  if (!isAllowedRedirectUrl(successUrl) || !isAllowedRedirectUrl(cancelUrl)) {
    return NextResponse.json(
      {
        error: {
          code: 'invalid_redirect',
          message: 'successUrl and cancelUrl must be on the Farmmap domain',
        },
      },
      { status: 422 },
    );
  }

  const supabase = await createClient();

  // For Gold: check eligibility
  if (tier === 'gold') {
    const { data: subscription } = await supabase
      .from('listing_subscriptions')
      .select('silver_months_count, completed_order_count')
      .eq('listing_id', listing.id)
      .single();

    // Check gold_eligibility_override
    const { data: listingRow } = await supabase
      .from('listings')
      .select('gold_eligibility_override')
      .eq('id', listing.id)
      .single();

    const silverMonths = subscription?.silver_months_count ?? 0;
    const completedOrders = subscription?.completed_order_count ?? 0;
    const hasOverride = listingRow?.gold_eligibility_override ?? false;

    if (!hasOverride && (silverMonths < 3 || completedOrders < 50)) {
      return NextResponse.json(
        {
          error: {
            code: 'gold_not_eligible',
            message: `Gold requires 3 months on Silver (${silverMonths}/3) and 50 completed orders (${completedOrders}/50)`,
          },
        },
        { status: 403 },
      );
    }
  }

  // Fetch existing stripe_customer_id
  const { data: subscription } = await supabase
    .from('listing_subscriptions')
    .select('stripe_customer_id')
    .eq('listing_id', listing.id)
    .single();

  const stripeCustomerId = subscription?.stripe_customer_id
    ? decryptNullable(subscription.stripe_customer_id) ?? undefined
    : undefined;

  let checkoutUrl: string;
  try {
    checkoutUrl = await createSubscriptionCheckout({
      tier,
      stripeCustomerId,
      successUrl,
      cancelUrl,
      metadata: {
        listing_id: listing.id,
        directory_id: directoryId,
        tier,
        user_id: user.id,
      },
    });
  } catch (err) {
    console.error('[subscriptions/checkout] stripe error:', err);
    return NextResponse.json(
      { error: { code: 'payment_error', message: 'Failed to create checkout session' } },
      { status: 500 },
    );
  }

  // Track analytics
  void trackEvent({
    eventType: 'subscription_upgrade_initiated',
    directoryId,
    listingId: listing.id,
    ip: getClientIp(request),
    userAgent: request.headers.get('user-agent') ?? '',
    metadata: { tier },
  });

  return NextResponse.json({ url: checkoutUrl });
}
