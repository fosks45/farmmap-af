/**
 * GET /api/counties/[country]/[county]
 * County landing page data with paginated listings.
 * Used by SSR county pages.
 *
 * F16 — County SEO pages
 * Data classification: C0
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId } from '@/lib/auth';

export const runtime = 'nodejs';

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  listing_type: z
    .enum(['farm_shop', 'honesty_box', 'farm_gate_stall', 'roadside_stand'])
    .optional(),
});

const PAGE_SIZE = 20;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string; county: string }> },
): Promise<NextResponse> {
  const { country, county } = await params;
  const directoryId = getDirectoryId(request);
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

  const { page, listing_type } = parsed.data;
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();

  // Decode URL-encoded county name
  const decodedCounty = decodeURIComponent(county).replace(/-/g, ' ');
  const decodedCountry = decodeURIComponent(country).replace(/-/g, '_');

  let query = supabase
    .from('listings')
    .select(
      `
      id, slug, name, listing_type, tier, town, county, country,
      review_rating_avg, review_count, temporarily_closed, location
      `,
      { count: 'exact' },
    )
    .eq('directory_id', directoryId)
    .eq('status', 'active')
    .ilike('county', decodedCounty)
    .eq('country', decodedCountry)
    .order('tier', { ascending: false }) // gold first
    .order('review_rating_avg', { ascending: false, nullsFirst: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (listing_type) query = query.eq('listing_type', listing_type);

  const { data: listings, error, count } = await query;

  if (error) {
    console.error('[counties/[country]/[county]/get] query error:', error.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to fetch county listings' } },
      { status: 500 },
    );
  }

  const total = count ?? 0;
  const total_pages = Math.ceil(total / PAGE_SIZE);

  const mappedListings = (listings ?? []).map((l) => {
    let locationCoords: { lon: number; lat: number } | null = null;
    if (l.location) {
      try {
        const loc =
          typeof l.location === 'string' ? JSON.parse(l.location) : l.location;
        if (loc?.coordinates) {
          locationCoords = { lon: loc.coordinates[0], lat: loc.coordinates[1] };
        }
      } catch {
        locationCoords = null;
      }
    }
    return {
      id: l.id,
      slug: l.slug,
      name: l.name,
      listing_type: l.listing_type,
      tier: l.tier,
      town: l.town,
      county: l.county,
      country: l.country,
      review_rating_avg: l.review_rating_avg ? Number(l.review_rating_avg) : null,
      review_count: l.review_count ?? 0,
      temporarily_closed: l.temporarily_closed,
      location: locationCoords,
    };
  });

  return NextResponse.json({
    county: decodedCounty,
    country: decodedCountry,
    listings: mappedListings,
    pagination: { page, limit: PAGE_SIZE, total, total_pages },
  });
}
