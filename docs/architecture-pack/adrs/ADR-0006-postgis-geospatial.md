---
adr: ADR-0006
title: Geospatial Queries — PostGIS Extension on Supabase PostgreSQL
status: accepted
date: 2026-05-17
feature: 003-farmmap
authority: specs/003-farmmap/spec.md (F1, F15) + specs/003-farmmap/platform-pack/platform-decision.md
deciders:
  - architecture-squad-lead
---

# ADR-0006: Geospatial Queries — PostGIS Extension on Supabase PostgreSQL

## Context

Farmmap's core functionality requires geospatial data operations:
- **953+ listing pins** with precise coordinates for map display.
- **"Near me" queries**: return all listings within a radius from the user's current location or searched location.
- **Eircode and UK postcode geocoding**: latitude/longitude must be derived from address data at import time and stored persistently.
- **Bounding box queries**: the map requests visible listings for the current viewport as the user pans/zooms.
- **F15 (ROI support)**: Irish addresses with no Eircode must be geocoded from address text; geocoded pin marked as approximate.

## Decision

**Enable PostGIS extension on Supabase PostgreSQL. Store all listing coordinates as `GEOMETRY(Point, 4326)` column with a GIST spatial index. Use `ST_DWithin` for radius queries and `ST_MakeEnvelope` for bounding box queries. Geocode Eircodes and UK postcodes at import time via an external geocoding API; store result permanently in the `listings.location` column.**

Schema:
```sql
-- On the listings table:
location GEOMETRY(Point, 4326) NOT NULL,

-- Spatial index:
CREATE INDEX listings_location_gist ON listings USING GIST(location);

-- Near-me query (radius in metres):
SELECT * FROM listings
WHERE directory_id = $1
  AND ST_DWithin(
    location::geography,
    ST_MakePoint($lon, $lat)::geography,
    $radius_metres
  )
ORDER BY ST_Distance(location::geography, ST_MakePoint($lon, $lat)::geography);

-- Bounding box query (map viewport):
SELECT * FROM listings
WHERE directory_id = $1
  AND location && ST_MakeEnvelope($minLon, $minLat, $maxLon, $maxLat, 4326);
```

Geocoding strategy:
- UK postcodes: geocoded at seed data import time using the free postcodes.io API (covers all UK postcodes, no API key required).
- Eircodes: geocoded at import time using Eircode's ECAD API or geocode.earth with Irish address data.
- Addresses with no postcode/Eircode (Irish rural addresses): geocoded from address text via Nominatim (OSM geocoder, free) or geocode.earth. Pin stored with `geocoding_method: text_approximate` flag; listing detail page shows a visual indicator ("approximate location").
- All geocoding performed server-side at listing creation/import time. The `location` field is never null for active listings.

GeoJSON endpoint for MapLibre:
```
GET /api/listings/geojson?directory_id=[uuid]&bbox=[minLon,minLat,maxLon,maxLat]
```
Returns a GeoJSON FeatureCollection with lightweight properties per feature: `id`, `slug`, `listing_type`, `tier`, `status`, `name`, `rating_avg`. Full listing data is loaded separately when a pin is clicked.

## Consequences

**Positive:**
- PostGIS is the industry standard for geospatial PostgreSQL operations. All common operations (radius, bounding box, distance ordering) are native SQL with spatial indexing.
- The GIST spatial index on `location` makes radius queries O(log n) regardless of listing count — performs correctly at 1,000 or 100,000 listings.
- PostGIS is available on Supabase with a single `CREATE EXTENSION postgis;` command in Sprint 0.
- Using `GEOMETRY(Point, 4326)` (WGS84) matches the coordinate system used by MapLibre GL JS natively — no coordinate projection conversion required.

**Negative / Risks:**
- Geocoding ~953 listings at import time requires ~953 API calls. Postcodes.io is free and rate-limited at 100 requests/second — the seed import will take ~10 seconds. Acceptable.
- Irish rural address geocoding accuracy depends on Nominatim/geocode.earth quality for ROI rural addresses. The spec requires "within 500 metres for 95% of Irish rural addresses tested in UAT" (F15 acceptance criteria). A QA step must verify geocoding accuracy for the ROI seed listings before V1 launch.
- `ST_DWithin` with `::geography` cast performs spherical distance calculation (accurate for any distance). Without the cast it uses planar distance (inaccurate at larger scales). All queries must use the geography cast.

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| Store lat/lng as two FLOAT columns + application-layer distance | No spatial indexing; distance calculation is O(n) table scan at query time. Scales poorly to 10,000+ listings. PostGIS is the correct tool. |
| Elasticsearch with geo_point | Adds a separate search infrastructure component. PostGIS handles all required geospatial operations within the existing Supabase database. No justification for additional service at v1. |
| PostGIS on a separate RDS instance | Adds infrastructure complexity. Supabase provides PostGIS natively. |
