/**
 * GET /api/listings/[slug]/analytics
 * Listing analytics dashboard data for the owner. Owner/manager auth required.
 * Returns: pageViews30d, mapImpressions30d, enquiries30d, waitlistCount, reviewCount, avgRating.
 *
 * F12 — Analytics dashboard
 * ADR-0004 (auth), ADR-0008 (analytics)
 * Data classification: C0 (aggregated, no PII)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireListingManager, resolveListingBySlug } from '@/lib/auth';
import { getListingAnalyticsSummary } from '@/lib/analytics';

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

  const authResult = await requireListingManager(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;

  const supabase = await createClient();

  // Fetch analytics summary from analytics_events
  const analytics = await getListingAnalyticsSummary(listing.id, '30d');

  // Waitlist count
  const { count: waitlistCount } = await supabase
    .from('order_waitlist')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', listing.id)
    .is('unsubscribed_at', null);

  // Review count and avg rating (from denormalised fields on listings)
  const { data: listingStats } = await supabase
    .from('listings')
    .select('review_count, review_rating_avg')
    .eq('id', listing.id)
    .single();

  return NextResponse.json({
    pageViews30d: analytics.listing_page_views,
    mapImpressions30d: analytics.map_pin_clicks,
    enquiries30d: analytics.enquiry_submissions,
    waitlistSignups30d: analytics.waitlist_signups,
    waitlistCount: waitlistCount ?? 0,
    reviewCount: listingStats?.review_count ?? 0,
    avgRating: listingStats?.review_rating_avg
      ? Number(listingStats.review_rating_avg)
      : null,
    period: {
      start: analytics.period_start,
      end: analytics.period_end,
    },
    last_updated_at: analytics.last_updated_at,
  });
}
