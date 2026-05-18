/**
 * GET /api/counties
 * List all counties with listing counts, grouped by country and county.
 * Cached 1 hour.
 *
 * F16 — County SEO pages
 * Data classification: C0 (all aggregated, public)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(request: Request): Promise<NextResponse> {
  const directoryId = getDirectoryId(request);
  const supabase = await createClient();

  const { data: listings, error } = await supabase
    .from('listings')
    .select('country, county, listing_type')
    .eq('directory_id', directoryId)
    .eq('status', 'active')
    .not('county', 'is', null);

  if (error) {
    console.error('[counties/get] query error:', error.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to fetch counties' } },
      { status: 500 },
    );
  }

  // Aggregate counts in application layer
  const countyMap = new Map<
    string,
    {
      country: string;
      county: string;
      farm_shop_count: number;
      honesty_box_count: number;
      total_count: number;
    }
  >();

  for (const listing of listings ?? []) {
    if (!listing.county) continue;
    const key = `${listing.country}:${listing.county.toLowerCase()}`;

    if (!countyMap.has(key)) {
      countyMap.set(key, {
        country: listing.country,
        county: listing.county,
        farm_shop_count: 0,
        honesty_box_count: 0,
        total_count: 0,
      });
    }

    const entry = countyMap.get(key)!;
    entry.total_count += 1;
    if (listing.listing_type === 'farm_shop') entry.farm_shop_count += 1;
    if (listing.listing_type === 'honesty_box') entry.honesty_box_count += 1;
  }

  const counties = Array.from(countyMap.values()).sort((a, b) => {
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    return a.county.localeCompare(b.county);
  });

  return new NextResponse(JSON.stringify({ data: counties }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
    },
  });
}
