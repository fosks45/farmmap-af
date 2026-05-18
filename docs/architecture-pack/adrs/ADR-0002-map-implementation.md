---
adr: ADR-0002
title: Map Implementation — MapLibre GL JS + OpenStreetMap
status: accepted
date: 2026-05-17
feature: 003-farmmap
authority: specs/003-farmmap/spec.md (F1, F12) + specs/003-farmmap/compliance-pack/compliance-decision.md (V1-C5) + specs/003-farmmap/platform-pack/platform-decision.md
deciders:
  - architecture-squad-lead
  - platform-strategy-lead
---

# ADR-0002: Map Implementation — MapLibre GL JS + OpenStreetMap

## Context

The primary consumer interface is an interactive map displaying 953+ listing pins with clustering, filtering, and real-time interaction. The following constraints apply:

- **Performance budget:** Map with 953+ listings must load within 3 seconds on a 4G mobile connection (spec NFR). Vector tiles load progressively and perform significantly better than raster tiles at this dataset size.
- **SEO requirement:** The interactive map is not indexable by search engines. All listing pages must have server-rendered HTML fallbacks. The map is a client-side enhancement over the SSR base. This is both a spec requirement and a platform-pack hard constraint.
- **ODbL licence:** OpenStreetMap data is licensed under ODbL. Commercial use is permitted but requires attribution: "© OpenStreetMap contributors" with a link to the copyright page. This is an unconditional requirement per compliance-pack [V1-C5].
- **Cost constraints:** A solo founder at launch cannot absorb $500+/month in map tile API fees. The solution must have a viable free or low-cost tier.
- **Accessibility:** WCAG 2.2 AA requires keyboard navigation of the map and accessible text equivalents for pins. MapLibre GL JS provides hook points for custom accessible overlays.
- **Four listing types** must produce visually distinct pin styles per F12.

## Decision

**MapLibre GL JS (open-source, Apache 2.0) with OpenStreetMap vector tiles via MapTiler free tier (or Stadia Maps as fallback).**

- MapLibre GL JS is the actively maintained fork of Mapbox GL JS v1 (before the Mapbox licence change). It is free and open-source with no per-request pricing.
- Vector tiles from MapTiler's free tier (50,000 map loads/month free, then pay-as-you-go) or Stadia Maps (suitable free tier for UK + Ireland). The specific tile provider is confirmed in Sprint 0; the architecture is tile-provider-agnostic via the MapLibre style configuration.
- OSM attribution rendered via MapLibre's built-in `attributionControl` — "© OpenStreetMap contributors" with link — satisfying compliance-pack V1-C5. This control must not be disabled or hidden.
- All 953+ pins loaded as a GeoJSON source on a dedicated `/api/listings/geojson?directory_id=...` endpoint. Clustering via MapLibre's built-in cluster feature (`cluster: true` on the source) handles low-zoom overplotting.
- Four pin styles implemented as separate `symbol` layers with distinct icons/colours per listing_type (farm_shop, honesty_box, farm_gate_stall, roadside_stand). Pin colours confirmed in design phase.
- **Non-map HTML fallback is mandatory.** Every listing, county, and region page has a complete SSR-rendered HTML version that does not depend on MapLibre loading. MapLibre is loaded only as a client-side progressive enhancement. The GeoJSON endpoint also serves the listing data that feeds the HTML list view.
- Accessible pin behaviour: each pin emits a click event that updates a live region with the listing name and type, and opens the listing mini-card. Keyboard users can navigate to the listing list view as a full alternative.

## Consequences

**Positive:**
- Zero marginal cost at v1 scale (within MapTiler free tier). Tile provider can be swapped without code changes.
- MapLibre GL JS is actively maintained and has identical API surface to the widely-known Mapbox GL JS, simplifying developer onboarding.
- Vector tiles load once and render at all zoom levels client-side — meeting the 3-second performance budget without server-side per-request tile generation.
- ODbL attribution is satisfied by the built-in control; no bespoke attribution implementation required.

**Negative / Risks:**
- MapTiler free tier limit (50,000 map loads/month) will be reached at modest traffic. Tile serving costs must be budgeted at scale. At 100,000 monthly visitors with ~50% loading the map, cost is ~$100–$200/month on MapTiler's pay-as-you-go. This is within the cost model.
- MapLibre has no native accessible map navigation — the accessibility overlay (WCAG 2.1.1 keyboard, 4.1.2 name/role/value) requires custom implementation. Mitigated by the mandatory HTML list fallback which is the primary accessible path.

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| Google Maps Platform | $7/1,000 map loads; at 100K monthly visitors = $700+/month. Data terms restrict storing coordinates derived from Google Maps data. Rejected on cost and data terms. |
| Mapbox GL JS (v2+) | Proprietary licence; per-request pricing at $0.50/1,000 map loads above free tier. Rejected — MapLibre provides identical functionality at zero cost. |
| Leaflet + OSM raster tiles | Raster tiles are heavier per zoom level, worse for mobile performance. Leaflet has no built-in clustering at the quality of MapLibre. Vector tiles are the correct choice for 1,000+ pins. |
| HERE Maps | Cost and API complexity not justified over free OSM alternatives. |
| Self-hosted tile server (OpenMapTiles) | Operational overhead (server maintenance, tile generation pipeline, storage) is not appropriate for a solo founder at launch. Deferred to v2+ if tile costs become prohibitive. |
