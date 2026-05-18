/**
 * GET /api/listings/geojson
 * Returns a GeoJSON FeatureCollection of all active listings.
 * Cached 15 minutes — safe for public CDN caching.
 *
 * F1 — Map browsing
 * ADR-0006 (PostGIS ST_AsGeoJSON)
 * Data classification: C0 (all returned data is public)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId } from '@/lib/auth';

export const runtime = 'nodejs';

const QuerySchema = z.object({
  listing_type: z
    .enum(['farm_shop', 'honesty_box', 'farm_gate_stall', 'roadside_stand'])
    .optional(),
  county: z.string().max(100).optional(),
});

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const directoryId = getDirectoryId(request);

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

  const { listing_type, county } = parsed.data;

  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select(
      `
      id, slug, name, listing_type, tier, county,
      location
      `,
    )
    .eq('directory_id', directoryId)
    .eq('status', 'active')
    .not('location', 'is', null);

  if (listing_type) query = query.eq('listing_type', listing_type);
  if (county) query = query.ilike('county', county);

  const { data: listings, error } = await query;

  if (error) {
    console.error('[listings/geojson] query error:', error.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to fetch listings' } },
      { status: 500 },
    );
  }

  const features = (listings ?? []).map((l) => {
    let coordinates: [number, number] | null = null;
    if (l.location) {
      try {
        const loc =
          typeof l.location === 'string' ? JSON.parse(l.location) : l.location;
        if (
          loc?.type === 'Point' &&
          Array.isArray(loc.coordinates) &&
          loc.coordinates.length === 2
        ) {
          coordinates = loc.coordinates as [number, number];
        }
      } catch {
        coordinates = null;
      }
    }

    if (!coordinates) return null;

    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates,
      },
      properties: {
        id: l.id,
        slug: l.slug,
        name: l.name,
        listing_type: l.listing_type,
        tier: l.tier ?? 'free',
        county: l.county,
      },
    };
  }).filter(Boolean);

  const geojson = {
    type: 'FeatureCollection' as const,
    features,
  };

  return new NextResponse(JSON.stringify(geojson), {
    status: 200,
    headers: {
      'Content-Type': 'application/geo+json',
      'Cache-Control': 'public, max-age=900, stale-while-revalidate=60',
    },
  });
}
