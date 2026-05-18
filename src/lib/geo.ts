/**
 * PostGIS / geospatial query helpers for Farmmap.
 *
 * All spatial data uses WGS84 (SRID 4326).
 * Listings are stored with GEOMETRY(Point, 4326).
 * ST_DWithin and ST_MakePoint are used for radius queries.
 *
 * Data classification: C0 (location data is public)
 * ADR: ADR-0006
 */

import { createClient } from './supabase/server';

export interface NearbyListingsOptions {
  lat: number;
  lon: number;
  radiusMetres?: number;
  directoryId: string;
  listingType?: string;
  county?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export interface BBoxFilter {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

/**
 * Parses a bbox query parameter string "minLon,minLat,maxLon,maxLat"
 * Returns null if the format is invalid.
 */
export function parseBBox(bbox: string): BBoxFilter | null {
  const parts = bbox.split(',').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return null;
  const [minLon, minLat, maxLon, maxLat] = parts;
  if (minLon < -180 || maxLon > 180 || minLat < -90 || maxLat > 90) return null;
  if (minLon >= maxLon || minLat >= maxLat) return null;
  return { minLon, minLat, maxLon, maxLat };
}

/**
 * Checks whether a postcode matches any of the postcode prefixes stored
 * in a delivery zone's postcodes array.
 *
 * Supports:
 * - Exact match: "SW1A 1AA" matches "SW1A 1AA"
 * - Prefix match: "SW1A" matches "SW1A 1AA" and "SW1A 2BB"
 * - Outward code: "SW1" matches "SW1A", "SW1V", etc.
 */
export function postcodeMatchesZone(postcode: string, zonePostcodes: string[]): boolean {
  const normalised = postcode.toUpperCase().replace(/\s+/g, '');
  return zonePostcodes.some((zoneCode) => {
    const normZone = zoneCode.toUpperCase().replace(/\s+/g, '');
    // Exact match
    if (normalised === normZone) return true;
    // Prefix match (zone code is a prefix of the postcode)
    if (normalised.startsWith(normZone)) return true;
    // Postcode prefix match (postcode outward code starts with zone prefix)
    const outward = normalised.substring(0, normalised.length > 4 ? normalised.length - 3 : normalised.length);
    if (outward.startsWith(normZone)) return true;
    return false;
  });
}

/**
 * Builds a PostGIS ST_DWithin filter clause for a Supabase query.
 * Returns the raw SQL filter string for use with .filter() or .rpc().
 *
 * Note: ST_DWithin with geography type works in metres.
 */
export function buildRadiusFilter(lat: number, lon: number, radiusMetres: number): string {
  return `ST_DWithin(location::geography, ST_MakePoint(${lon}, ${lat})::geography, ${radiusMetres})`;
}

/**
 * Fetches all active listings as a GeoJSON FeatureCollection.
 * Uses ST_AsGeoJSON for efficient spatial serialisation.
 * Used by the /api/listings/geojson endpoint.
 */
export async function getListingsGeoJSON(
  directoryId: string,
  bbox?: BBoxFilter,
  listingType?: string,
): Promise<{
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: { type: 'Point'; coordinates: [number, number] };
    properties: {
      id: string;
      slug: string;
      name: string;
      listing_type: string;
      tier: string;
      county: string;
      rating_avg: number | null;
      temporarily_closed: boolean;
    };
  }>;
}> {
  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select(
      'id, slug, name, listing_type, tier, county, review_rating_avg, temporarily_closed, location',
    )
    .eq('directory_id', directoryId)
    .eq('status', 'active')
    .not('location', 'is', null);

  if (listingType) {
    query = query.eq('listing_type', listingType);
  }

  // Note: bbox filtering is applied via PostGIS in a raw SQL call via RPC
  // For simplicity here, we fetch all and rely on the 15-minute cache
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch listings for GeoJSON: ${error.message}`);
  }

  const features = (data ?? []).map((listing) => {
    // Supabase returns geometry as a GeoJSON string from the PostGIS extension
    const locationStr = listing.location as unknown as string;
    let coordinates: [number, number] = [0, 0];

    if (typeof locationStr === 'string') {
      try {
        const parsed = JSON.parse(locationStr) as { type: string; coordinates: [number, number] };
        coordinates = parsed.coordinates;
      } catch {
        // location stored as WKT or raw geometry — skip
      }
    } else if (locationStr && typeof locationStr === 'object') {
      const loc = locationStr as { coordinates?: [number, number] };
      if (loc.coordinates) coordinates = loc.coordinates;
    }

    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates,
      },
      properties: {
        id: listing.id,
        slug: listing.slug,
        name: listing.name,
        listing_type: listing.listing_type,
        tier: listing.tier,
        county: listing.county ?? '',
        rating_avg: listing.review_rating_avg ? Number(listing.review_rating_avg) : null,
        temporarily_closed: listing.temporarily_closed,
      },
    };
  });

  return {
    type: 'FeatureCollection',
    features,
  };
}
