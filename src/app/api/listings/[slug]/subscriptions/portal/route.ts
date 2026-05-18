/**
 * POST /api/listings/[slug]/subscriptions/portal
 * Create a Stripe Billing Portal session for subscription self-service. Owner auth required.
 *
 * F13 — Subscription management
 * ADR-0004 (auth), ADR-0005 (Stripe)
 * Data classification: C3 (stripe_customer_id)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireListingOwner, resolveListingBySlug } from '@/lib/auth';
import { decryptNullable } from '@/lib/encryption';
import { createBillingPortal } from '@/lib/stripe';

export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://farmmap.co.uk';

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

  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from('listing_subscriptions')
    .select('stripe_customer_id')
    .eq('listing_id', listing.id)
    .single();

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json(
      {
        error: {
          code: 'no_subscription',
          message: 'No active subscription found for this listing',
        },
      },
      { status: 404 },
    );
  }

  const stripeCustomerId = decryptNullable(subscription.stripe_customer_id);
  if (!stripeCustomerId) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_error',
          message: 'Failed to resolve subscription customer',
        },
      },
      { status: 500 },
    );
  }

  const returnUrl = `${SITE_URL}/manage/${slug}/subscription`;

  let portalUrl: string;
  try {
    portalUrl = await createBillingPortal(stripeCustomerId, returnUrl);
  } catch (err) {
    console.error('[subscriptions/portal] stripe error:', err);
    return NextResponse.json(
      { error: { code: 'payment_error', message: 'Failed to create billing portal session' } },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: portalUrl });
}
