/**
 * GET /api/listings/[slug]
 * Full listing detail for a single listing, including photos, reviews, tier, and manager count.
 *
 * F2 — Listing detail page
 * ADR-0004 (auth), ADR-0006 (PostGIS)
 * Data classification: C0 public fields; C3 email only if owner is requester
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireAuth } from '@/lib/auth';
import { decryptNullable } from '@/lib/encryption';
import { trackEvent, getClientIp } from '@/lib/analytics';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);
  const supabase = await createClient();

  // Optionally resolve requesting user (for owner email reveal)
  const authResult = await requireAuth(request);
  const requestingUser =
    authResult instanceof NextResponse ? null : authResult.user;

  const { data: listing, error } = await supabase
    .from('listings')
    .select(
      `
      id, slug, name, listing_type, status, tier,
      address_line1, address_line2, town, county, country,
      postcode, phone, website, email, description,
      opening_hours, temporarily_closed, temporarily_closed_updated_at,
      listing_type_meta, review_count, review_rating_avg,
      geocoding_approximate, location, created_at, updated_at
      `,
    )
    .eq('slug', slug)
    .eq('directory_id', directoryId)
    .eq('status', 'active')
    .single();

  if (error || !listing) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Listing not found' } },
      { status: 404 },
    );
  }

  // Check if requester is an owner of this listing
  let isOwner = false;
  if (requestingUser) {
    const { data: managerRow } = await supabase
      .from('listing_managers')
      .select('role')
      .eq('listing_id', listing.id)
      .eq('user_id', requestingUser.id)
      .eq('role', 'owner')
      .not('accepted_at', 'is', null)
      .single();
    isOwner = !!managerRow;
  }

  // Fetch approved photos
  const { data: photos } = await supabase
    .from('listing_photos')
    .select('id, storage_path, thumbnail_path, alt_text, display_order')
    .eq('listing_id', listing.id)
    .eq('moderation_status', 'approved')
    .is('deleted_at', null)
    .order('display_order', { ascending: true });

  // Fetch current subscription tier (join listing_subscriptions)
  const { data: subscription } = await supabase
    .from('listing_subscriptions')
    .select('tier, status, cancel_at_period_end, current_period_end')
    .eq('listing_id', listing.id)
    .single();

  // Manager count (not identities)
  const { count: managerCount } = await supabase
    .from('listing_managers')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', listing.id)
    .not('accepted_at', 'is', null);

  // Top 3 recent approved reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, rating, body, owner_response, created_at')
    .eq('listing_id', listing.id)
    .eq('moderation_status', 'approved')
    .order('created_at', { ascending: false })
    .limit(3);

  // Parse location
  let locationCoords: { lon: number; lat: number } | null = null;
  if (listing.location) {
    try {
      const loc =
        typeof listing.location === 'string'
          ? JSON.parse(listing.location)
          : listing.location;
      if (loc?.coordinates) {
        locationCoords = { lon: loc.coordinates[0], lat: loc.coordinates[1] };
      }
    } catch {
      locationCoords = null;
    }
  }

  // Track page view analytics (fire and forget)
  void trackEvent({
    eventType: 'listing_page_view',
    directoryId,
    listingId: listing.id,
    ip: getClientIp(request),
    userAgent: request.headers.get('user-agent') ?? '',
    source: null,
  });

  const currentTier = subscription?.tier ?? listing.tier ?? 'free';

  const responseBody = {
    id: listing.id,
    slug: listing.slug,
    name: listing.name,
    listing_type: listing.listing_type,
    status: listing.status,
    tier: currentTier,
    address_line2: listing.address_line2 ?? null,
    town: listing.town,
    county: listing.county,
    country: listing.country,
    phone: listing.phone ?? null,
    website: listing.website ?? null,
    // C3 email: only reveal to the owner
    email: isOwner && listing.email ? decryptNullable(listing.email) : null,
    description: listing.description,
    opening_hours: listing.opening_hours,
    temporarily_closed: listing.temporarily_closed,
    temporarily_closed_updated_at: listing.temporarily_closed_updated_at,
    listing_type_meta: listing.listing_type_meta,
    review_count: listing.review_count ?? 0,
    review_rating_avg: listing.review_rating_avg
      ? Number(listing.review_rating_avg)
      : null,
    geocoding_approximate: listing.geocoding_approximate,
    location: locationCoords,
    photos: (photos ?? []).map((p) => ({
      id: p.id,
      storage_path: p.storage_path,
      thumbnail_path: p.thumbnail_path,
      alt_text: p.alt_text,
      display_order: p.display_order,
    })),
    subscription: subscription
      ? {
          tier: subscription.tier,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_end: subscription.current_period_end,
        }
      : null,
    manager_count: managerCount ?? 0,
    recent_reviews: (reviews ?? []).map((r) => ({
      id: r.id,
      rating: r.rating,
      body: r.body,
      owner_response: r.owner_response ?? null,
      created_at: r.created_at,
    })),
    created_at: listing.created_at,
    updated_at: listing.updated_at,
  };

  return NextResponse.json(responseBody);
}
