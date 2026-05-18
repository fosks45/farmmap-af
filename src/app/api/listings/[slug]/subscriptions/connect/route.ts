/**
 * POST /api/listings/[slug]/subscriptions/connect
 * Initiate Stripe Connect Standard OAuth for Silver/Gold listings.
 * Returns the Stripe Connect OAuth URL.
 *
 * F14 — Stripe Connect onboarding
 * ADR-0004 (auth), ADR-0005 (Stripe Connect)
 * Data classification: C3 (connect_account_id encrypted at storage)
 */

import { NextResponse } from 'next/server';
import { getDirectoryId, requireListingOwner, resolveListingBySlug } from '@/lib/auth';
import { createConnectOAuthLink } from '@/lib/stripe';

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

  // Silver/Gold only
  const tier = listing.tier ?? 'free';
  if (!['silver', 'gold'].includes(tier)) {
    return NextResponse.json(
      {
        error: {
          code: 'tier_required',
          message: 'Stripe Connect is only available for Silver and Gold listings',
        },
      },
      { status: 403 },
    );
  }

  const authResult = await requireListingOwner(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;

  const redirectUri = `${SITE_URL}/api/listings/${slug}/subscriptions/connect/callback`;

  let oauthUrl: string;
  try {
    oauthUrl = await createConnectOAuthLink(slug, redirectUri);
  } catch (err) {
    console.error('[subscriptions/connect] stripe error:', err);
    return NextResponse.json(
      { error: { code: 'payment_error', message: 'Failed to create Connect OAuth link' } },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: oauthUrl });
}
