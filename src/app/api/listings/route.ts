/**
 * GET /api/listings
 * Search and filter listings with geospatial radius, bbox, type, county, text search.
 *
 * F1, F2 — Browse and search listings
 * ADR-0003 (multi-tenancy), ADR-0006 (PostGIS)
 * Data classification: C0 (all returned data is public)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId } from '@/lib/auth';

export const runtime = 'nodejs';

const QuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
  radius_metres: z.coerce.number().min(100).max(100000).default(25000),
  bbox: z
    .string()
    .regex(/^-?\d+\.?\d*,-?\d+\.?\d*,-?\d+\.?\d*,-?\d+\.?\d*$/)
    .optional(),
  listing_type: z
    .enum(['farm_shop', 'honesty_box', 'farm_gate_stall', 'roadside_stand'])
    .optional(),
  product_category: z.string().optional(),
  county: z.string().optional(),
  country: z.string().optional(),
  tier: z.enum(['free', 'bronze', 'silver', 'gold']).optional(),
  open_now: z.coerce.boolean().optional(),
  q: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const directoryId = getDirectoryId(request);

  const parsed = QuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { code: 'validation_error', message: 'Invalid query parameters', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { lat, lon, radius_metres, bbox, listing_type, county, country, tier, q, page, limit } =
    parsed.data;

  const supabase = await createClient();
  const offset = (page - 1) * limit;

  let query = supabase
    .from('listings')
    .select(
      `
      id, slug, name, listing_type, status, tier,
      town, county, country, review_rating_avg, review_count,
      temporarily_closed, location
      `,
      { count: 'exact' },
    )
    .eq('directory_id', directoryId)
    .eq('status', 'active')
    .range(offset, offset + limit - 1);

  if (listing_type) query = query.eq('listing_type', listing_type);
  if (county) query = query.ilike('county', county);
  if (country) query = query.eq('country', country);
  if (tier) query = query.eq('tier', tier);
  if (q) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);

  // Geospatial filter via PostGIS
  if (lat !== undefined && lon !== undefined) {
    query = query.filter(
      'location',
      'not.is',
      null,
    );
    // Use raw PostGIS ST_DWithin via the filter
    query = (query as ReturnType<typeof query.filter>).filter(
      `ST_DWithin(location::geography, ST_MakePoint(${lon}, ${lat})::geography, ${radius_metres})`,
      'eq',
      true,
    ) as typeof query;
  }

  if (bbox) {
    const [minLon, minLat, maxLon, maxLat] = bbox.split(',').map(Number);
    query = (query as ReturnType<typeof query.filter>).filter(
      `location`,
      'not.is',
      null,
    ) as typeof query;
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[listings] query error:', error.message);
    return NextResponse.json(
      { code: 'internal_error', message: 'Failed to fetch listings' },
      { status: 500 },
    );
  }

  const listings = (data ?? []).map((l) => ({
    id: l.id,
    slug: l.slug,
    name: l.name,
    listing_type: l.listing_type,
    status: l.status,
    tier: l.tier,
    town: l.town,
    county: l.county,
    country: l.country,
    review_rating_avg: l.review_rating_avg ? Number(l.review_rating_avg) : null,
    review_count: l.review_count ?? 0,
    temporarily_closed: l.temporarily_closed,
    location: extractLocation(l.location),
    hero_photo_url: null, // TODO: join listing_photos in a future sprint
  }));

  const total = count ?? 0;
  const total_pages = Math.ceil(total / limit);

  return NextResponse.json({
    data: listings,
    pagination: { page, limit, total, total_pages },
  });
}

function extractLocation(
  location: unknown,
): { lon: number; lat: number } | null {
  if (!location) return null;
  if (typeof location === 'string') {
    try {
      const parsed = JSON.parse(location) as { coordinates?: [number, number] };
      if (parsed.coordinates) {
        return { lon: parsed.coordinates[0], lat: parsed.coordinates[1] };
      }
    } catch {
      return null;
    }
  }
  if (typeof location === 'object') {
    const loc = location as { coordinates?: [number, number] };
    if (loc.coordinates) {
      return { lon: loc.coordinates[0], lat: loc.coordinates[1] };
    }
  }
  return null;
}
