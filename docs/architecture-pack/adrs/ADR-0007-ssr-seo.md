---
adr: ADR-0007
title: SEO Strategy — SSR + Non-Map HTML Fallback
status: accepted
date: 2026-05-17
feature: 003-farmmap
authority: specs/003-farmmap/spec.md (NFR SEO section) + specs/003-farmmap/platform-pack/platform-decision.md + specs/003-farmmap/design-pack/information-architecture.md
deciders:
  - architecture-squad-lead
  - platform-strategy-lead
---

# ADR-0007: SEO Strategy — Server-Side Rendering + Mandatory Non-Map HTML Fallback

## Context

The spec's 100,000 monthly visitor target is entirely dependent on organic search. The interactive map is not indexable by search engines. The spec explicitly states: "Non-map fallback pages are mandatory for SEO. Every listing must have a standard HTML detail page accessible without JavaScript."

Platform-pack hard constraints:
- All listing detail pages and county pages must be server-rendered (not client-rendered).
- JS bundle must not block map rendering — progressive enhancement required.
- Core Web Vitals gate: LCP < 2.5s, INP < 200ms, CLS < 0.1 on listing detail and county pages on mobile.

The information architecture (IA) defines the URL structure and SEO hierarchy:
```
/listings/[listing_type]/[country]/[county]/[slug]
/county/[country]/[county]
/[country]
/farm-shops/
/honesty-boxes/
```

All pages in the SEO hierarchy must have structured data (JSON-LD), unique meta tags, canonical URLs, Open Graph tags, and Twitter Card tags.

## Decision

**All SEO surfaces (listing detail, county, region, listing-type pages) are React Server Components (RSC) in Next.js 14 App Router. MapLibre GL JS is loaded only as a Client Component on the `/` (map) page, wrapped in `dynamic({ ssr: false })`. Listing detail pages do not embed the interactive map — they embed a static map image.**

Architecture:

### Page rendering matrix:

| Page | Rendering | Map |
|---|---|---|
| `/` (Home / Map) | Server shell + Client map | MapLibre GL JS, loaded client-side |
| `/near-me` | Server shell + Client map | MapLibre GL JS |
| `/listings/[type]/[country]/[county]/[slug]` | Full SSR (RSC) | Static map image (MapLibre Static API or Leaflet embed with no JS) |
| `/county/[country]/[county]` | Full SSR (RSC) | No map; HTML list only |
| `/[country]` | Full SSR (RSC) | No map; county grid |
| `/farm-shops/`, `/honesty-boxes/` | Full SSR (RSC) | No map; listing list |
| `/shops/[slug]` (Bronze/Silver/Gold) | Full SSR + Client hydration | Static map image |
| `/search` | SSR + Client hydration | MapLibre GL JS |

### Listing detail page (SSR RSC):
- Name, address, listing type, opening hours, photos, product list: all server-rendered.
- `generateMetadata()` exports unique `<title>`, `<meta name="description">`, canonical, OG, Twitter Card.
- JSON-LD `LocalBusiness` schema injected via `<script type="application/ld+json">` in the RSC.
- `AggregateRating` JSON-LD added when listing has 3+ approved reviews.
- `Product` JSON-LD for Bronze/Silver/Gold listings with a product catalogue.
- Static map image: rendered server-side using MapLibre Static Images API or a lightweight Leaflet static embed. The pin location is the only dynamic element; the image is cacheable.

### Sitemap generation:
- `app/sitemap.ts` fetches all active listing slugs, county slugs, and region slugs from Supabase and generates `sitemap.xml` dynamically.
- `next-sitemap` is not used (too opinionated); custom generation ensures directory_id scoping.
- Sitemap is regenerated on a 24-hour cron via Vercel Cron.

### Core Web Vitals compliance:
- Listing detail pages: no MapLibre JS loaded. LCP is the listing hero photo (preloaded with `<link rel="preload">`). No layout shift from image loading (explicit width/height on all `<Image>` components).
- County pages: no images above the fold. LCP is the `<h1>`. INP < 200ms achievable with no heavy client JS.
- Lighthouse CI gate configured in Sprint 7 as a hard build gate.

## Consequences

**Positive:**
- Every listing page is fully indexable with complete structured data. No JavaScript required for Googlebot to parse the listing content.
- LCP on listing detail pages is the hero photo (preloaded), not a font or layout paint. Consistently achieves LCP < 2.0s on mobile with Next.js Image optimisation.
- The non-map listing page architecture is also the accessibility fallback — keyboard-only and screen reader users get the full listing content without MapLibre.

**Negative / Risks:**
- The `/` map page is a hybrid: SSR shell (header, footer, filter controls rendered server-side) + client-side MapLibre. First Contentful Paint on the map page is the SSR shell; MapLibre loads after hydration. The listing list is available as an SSR fallback if MapLibre fails to load.
- Static map images on listing detail pages require either a MapLibre Static API call or a server-side rendering of a headless Leaflet instance. The MapLibre Static API is the simpler path; confirmed in Sprint 1.

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| Client-side only rendering (CSR) | Not indexable by search engines. Explicitly rejected by spec. |
| Static Site Generation (SSG) at build time | 953+ listings would require a very long build time. Adding a new listing would require a rebuild. ISR (Incremental Static Regeneration) is a viable alternative but RSC with on-demand revalidation provides more control over cache invalidation. |
| Separate static site generator (Gatsby, Astro) | Additional codebase to maintain. Next.js App Router handles SSR and CSR in a single framework. |
| Embed MapLibre on listing detail pages | MapLibre JS adds ~500KB to the bundle. Listing detail pages must be lightweight (LCP < 2.5s). A static map image is sufficient for a detail page; the full interactive map is on the `/` page. |
