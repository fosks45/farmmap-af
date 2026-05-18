---
feature: 003-farmmap
phase: 5
document: performance-budgets
squad: platform-strategy
produced_by: platform-strategy-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md
  + specs/003-farmmap/platform-pack/device-matrix.md
---

# Farmmap — Performance Budgets

All budgets are hard gates unless marked advisory. Budgets must be measured in
production against real devices, not only in local development or Lighthouse CI
against a simulated environment.

---

## Tier 1: Standard Mobile (Primary Budget)

Target: iPhone 13 class, Chrome Android, 4G LTE connection

| Metric | Budget | Status |
|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5s | HARD GATE — Core Web Vitals "Good" threshold |
| Interaction to Next Paint (INP) | < 200ms | HARD GATE — Core Web Vitals "Good" threshold |
| Cumulative Layout Shift (CLS) | < 0.1 | HARD GATE — Core Web Vitals "Good" threshold |
| First Contentful Paint (FCP) | < 1.8s | Advisory |
| Time to First Byte (TTFB) | < 600ms | Advisory — SSR page generation target |
| Total JavaScript bundle (gzipped) | < 200kB | HARD GATE — map tile layer excluded from this budget |
| Total page weight (initial load) | < 600kB | Advisory — first contentful load including hero image |
| API response time p95 | < 400ms | HARD GATE — listing data API, measured from UK edge |

**Definition of "hard gate":** The build pipeline includes a Lighthouse CI step that
fails the build if these thresholds are not met in the CI environment. Additionally,
a production measurement is required to pass the v1 launch gate (compliance condition
V1-C11 scope extension for Core Web Vitals).

---

## Tier 2: Low-End Mobile (Rural / Owner Budget)

Target: iPhone SE (2nd gen) class, older Android mid-range, 3G or weak 4G

| Metric | Budget | Status |
|---|---|---|
| Largest Contentful Paint (LCP) | < 4.0s | HARD GATE — must not exceed "Needs Improvement" threshold at this tier |
| Total JavaScript bundle (gzipped) | < 120kB | HARD GATE — critical for parse time on low-end CPU |
| Total page weight (initial load) | < 400kB | HARD GATE |
| Interaction responsiveness | No input blocking for > 300ms | Advisory |

**Rationale:** Farm shop owners in rural areas (Janet in Lincolnshire, Tom in
a Cheshire field) use older devices on weak signals. An owner checking their
Farmmap dashboard in a barn on 3G must be able to load the page within 4 seconds.
If the dashboard is only usable on 4G or modern devices, the product fails its
core supply-side constituency.

**How this interacts with the standard budget:** The < 120kB JS budget at Tier 2
applies to the owner dashboard specifically. The consumer map page may use up to
200kB JS (within Tier 1 budget) because the Tier 1 consumer use case is the
primary volume path. Owner-facing routes must use a separate, lighter code split.
Route-level code splitting is a hard architectural requirement, not a preference.

---

## Map-Specific Budgets

The interactive map is the product's primary interface. Its performance budgets are
distinct from generic page budgets.

| Metric | Budget | Status |
|---|---|---|
| Map with 953+ pins — initial render (Tier 1 mobile) | < 3.0s from page load | HARD GATE — spec NFR §Performance |
| Map with 953+ pins — initial render (Tier 2 mobile) | < 5.0s from page load | Advisory |
| Pin cluster rendering (zoom change) | < 300ms | Advisory — no jank on pinch-zoom |
| Map tile load (first viewport) | < 1.5s on 4G | HARD GATE — tile API p95 from UK/Ireland edge |
| Filter application (narrow/widen pins) | < 150ms | HARD GATE — no full page reload; client-side filter |
| Geolocation → "Near me" pins visible | < 2.0s after permission granted | Advisory |

**Pin data delivery strategy:** 953 listing pins cannot be delivered as 953 separate
API calls. The architecture must deliver all pin coordinates, types, and tier labels
as a single GeoJSON payload from the API. Maximum payload size for the pins GeoJSON:
< 150kB gzipped for 953 listings. Each pin record in the GeoJSON carries only: id,
lat, lng, listing_type, tier, is_temporarily_closed — no body text or photos in the
map payload. Listing detail is fetched on pin tap.

---

## Listing Detail Page (Primary SEO Surface)

The listing detail page is the most important page in the product for SEO and for
consumer conversion. It must be server-rendered (SSR) and must meet the strictest
performance budgets.

| Metric | Budget | Status |
|---|---|---|
| LCP (Tier 1 mobile) | < 2.0s | HARD GATE — 0.5s stricter than Core Web Vitals "Good" |
| INP (Tier 1 mobile) | < 200ms | HARD GATE |
| CLS | < 0.05 | HARD GATE — stricter than Core Web Vitals "Good"; listing photos must have explicit dimensions to prevent layout shift |
| Time to First Byte (TTFB) | < 400ms | Advisory — SSR generation target |
| Listing hero image | < 80kB (modern format: WebP or AVIF) | Advisory |

**Why stricter than Core Web Vitals "Good":** The listing detail page is the page
that Google measures for page-experience ranking signals. Being within the "Good"
band is the minimum; being comfortably within it provides a ranking buffer against
normal production variability.

---

## County and Listing-Type Landing Pages (SEO Batch)

| Metric | Budget | Status |
|---|---|---|
| LCP (Tier 1 mobile) | < 2.5s | HARD GATE |
| INP | < 200ms | HARD GATE |
| CLS | < 0.1 | HARD GATE |

County pages render as paginated HTML lists (20 listings per page). They must be
server-rendered. No client-side pagination that would prevent indexing of page 2+.

---

## Admin Console (Desktop Broadband)

The admin console is desktop-only, used on broadband. Performance budgets are
relaxed relative to consumer-facing pages.

| Metric | Budget | Status |
|---|---|---|
| LCP (desktop) | < 2.0s | HARD GATE |
| API response time p95 | < 200ms | HARD GATE — admin operations must be fast; waiting for moderation queue to load is time the admin is not moderating |
| Bulk approve (50 photos) API call | < 2.0s | Advisory |
| Subscription status load | < 800ms | Advisory |

---

## Measurement Infrastructure

These budgets have no value if they are not measured. The following measurement
infrastructure is required before v1 launch:

1. **Lighthouse CI in build pipeline:** Fails build on LCP > 2.5s, INP > 200ms,
   CLS > 0.1 on the listing detail page and map home page using a simulated 4G
   mobile throttling profile. Uses a representative listing (one with photos) not
   an empty stub listing.

2. **Real User Monitoring (RUM):** Plausible Analytics does not provide RUM.
   Core Web Vitals RUM from production browsers is captured via the
   `web-vitals` library reporting to a `/api/vitals` endpoint stored in the database.
   This is used to detect real-world regressions that Lighthouse CI does not catch
   (carrier throttling, CDN edge variation, etc.). No PII is collected in the vitals
   payload — only page path, metric name, value, and a random session ID.

3. **API response time monitoring:** p50/p95/p99 latency per endpoint logged by the
   server-side instrumentation layer. Alert threshold: p95 > 500ms on any listing
   data endpoint triggers a Slack notification to the founder.

4. **Production measurement before v1 launch:** Minimum 100 real user sessions
   measured via RUM before the v1 launch gate is passed. Lighthouse CI alone is
   insufficient to confirm production performance.

---

*Produced by: platform-strategy-lead | squad: platform-strategy*
*Authority: specs/003-farmmap/spec.md + device-matrix.md*
*Phase: 5 | Feeds: specs/003-farmmap/architecture-pack/*
