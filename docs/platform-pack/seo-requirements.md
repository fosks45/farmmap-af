---
feature: 003-farmmap
phase: 5
document: seo-requirements
squad: platform-strategy
produced_by: platform-strategy-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md
  + specs/003-farmmap/platform-pack/device-matrix.md
  + specs/003-farmmap/platform-pack/performance-budgets.md
---

# Farmmap — SEO Requirements

The 100,000 monthly visitor target at Month 12 is the load-bearing assumption for
every commercial metric in the model. Every SEO requirement in this document is
treated as a product requirement, not a nice-to-have.

---

## URL Structure

All URLs are canonical, stable, and assigned at creation. Slugs never change once
assigned. If a listing is renamed, a 301 redirect from the old slug to the new
slug is created automatically. URL slugs are lowercase, hyphenated, ASCII-safe.

### Listing Pages

```
/listings/[type]/[country]/[county]/[slug]
```

Examples:
- `/listings/farm-shop/england/lincolnshire/hargreaves-farm-shop-sleaford`
- `/listings/honesty-box/scotland/angus/glen-dairy-honesty-box-forfar`
- `/listings/farm-gate-stall/republic-of-ireland/county-clare/burren-gate-stall`
- `/listings/roadside-stand/wales/pembrokeshire/pentre-roadside-stand`

**[type]** values: `farm-shop`, `honesty-box`, `farm-gate-stall`, `roadside-stand`

**[country]** values: `england`, `scotland`, `wales`, `northern-ireland`, `republic-of-ireland`

**[county]** values: lowercase, hyphenated county name (UK ceremonial county or
Irish county). For Northern Ireland: `county-antrim`, `county-down`, etc.
For Republic of Ireland: `county-clare`, `county-cork`, etc.

### County Landing Pages

```
/county/[country]/[county]
```

Examples:
- `/county/england/lincolnshire`
- `/county/republic-of-ireland/county-clare`

County pages render as server-side paginated HTML lists of all active listings in
the county. 20 listings per page. Pagination uses standard `/county/[country]/[county]?page=2` query parameter. The first page has no `?page` parameter.

### Country Landing Pages

```
/[country]
```

Values: `/england`, `/scotland`, `/wales`, `/northern-ireland`, `/republic-of-ireland`

Country pages provide a listing index by county with listing counts. Server-rendered.
These are the primary internal link targets from the homepage and from county pages
(breadcrumb navigation).

### Listing Type Pages

```
/farm-shops/
/honesty-boxes/
/farm-gate-stalls/
/roadside-stands/
```

Top-level listing type pages index all active listings of that type across all
countries. Server-rendered, paginated (20 per page). These pages target the queries
"farm shops UK", "UK honesty boxes", etc. — high-intent top-of-funnel queries.

---

## Non-Map HTML Fallback: MANDATORY

Every listing, county, country, and listing-type page must render as complete,
useful HTML without JavaScript. This is not a progressive enhancement — it is the
primary SEO surface.

**Rationale:** The interactive map (Leaflet/MapLibre) is not crawled by Googlebot.
A listing page that only renders in JavaScript is not indexable. All listing
information must be in the server-rendered HTML payload including: name, address,
opening hours, product types, contact details, and review summary (once F5 is live).

**Implementation requirement:** Server-side rendering (SSR) is mandatory for all
SEO-bearing pages. Client-side hydration for interactivity (map, filter state,
real-time updates) is permitted after the initial HTML is served.

**Test:** Any listing detail page, county page, or listing-type page must return
a complete and useful HTML document with all listing information when fetched with
`curl` (no JavaScript). This is a build gate, not a suggestion.

---

## Structured Data (JSON-LD)

Structured data is required on every listing page. It must be present in the
server-rendered HTML (not injected by client-side JavaScript after load).

### Listing Detail Page (all listing types)

```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "FoodEstablishment"],
  "name": "[listing name]",
  "description": "[listing description]",
  "url": "https://farmmap.co.uk/listings/[type]/[country]/[county]/[slug]",
  "image": "[primary listing photo URL if available]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[street address]",
    "addressLocality": "[town/village]",
    "addressRegion": "[county]",
    "postalCode": "[postcode or eircode]",
    "addressCountry": "[GB or IE]"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": [lat],
    "longitude": [lng]
  },
  "telephone": "[phone if available]",
  "url": "[shop website if available]",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "servesCuisine": "[product types as array — e.g., 'Vegetables', 'Dairy', 'Meat']",
  "priceRange": "£",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[average rating]",
    "reviewCount": "[review count]"
  }
}
```

Note: `aggregateRating` is omitted if the listing has fewer than 3 reviews (spec F5
requirement: no aggregate rating shown for fewer than 3 reviews).

### Bronze/Silver/Gold Listing Pages (additional Product schema)

For listings with a product catalogue (Bronze and above), add Product schema for
featured products (up to 5 products in structured data; full catalogue in HTML):

```json
{
  "@type": "Product",
  "name": "[product name]",
  "description": "[product description]",
  "image": "[product photo URL]",
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": "[price]",
      "priceCurrency": "[GBP or EUR]"
    },
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "LocalBusiness",
      "name": "[listing name]"
    }
  }
}
```

### BreadcrumbList (all pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Farmmap", "item": "https://farmmap.co.uk/"},
    {"@type": "ListItem", "position": 2, "name": "England", "item": "https://farmmap.co.uk/england"},
    {"@type": "ListItem", "position": 3, "name": "Lincolnshire farm shops", "item": "https://farmmap.co.uk/county/england/lincolnshire"},
    {"@type": "ListItem", "position": 4, "name": "[Listing Name]"}
  ]
}
```

---

## Meta Tags (Every Page)

Every page must have:

```html
<title>[Listing Name], [County] — Farmmap</title>
<meta name="description" content="[150–160 char description including product types and location]" />
<link rel="canonical" href="https://farmmap.co.uk/listings/[type]/[country]/[county]/[slug]" />

<!-- Open Graph -->
<meta property="og:title" content="[Listing Name] — Farmmap" />
<meta property="og:description" content="[description]" />
<meta property="og:image" content="[listing hero image URL]" />
<meta property="og:url" content="https://farmmap.co.uk/listings/..." />
<meta property="og:type" content="place" />
<meta property="og:locale" content="en_GB" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[Listing Name] — Farmmap" />
<meta name="twitter:description" content="[description]" />
<meta name="twitter:image" content="[listing hero image URL]" />
```

**Title format by page type:**
- Listing detail: `[Name], [County] — Farmmap`
- County page: `Farm shops in [County] — Farmmap`
- Country page: `Farm shops in [Country] — Farmmap | Directory`
- Listing type page: `Farm shops across the UK — Farmmap Directory`
- Homepage: `Farmmap — Find farm shops and honesty boxes near you`

**Description rules:**
- Must be unique per page — no templated duplicates
- Must include listing's primary product types and location
- 150–160 characters
- Must not be truncated in Google's search result snippet

---

## Sitemap

- Auto-generated daily by a background job
- `sitemap.xml` at the root: references listing sitemaps, county sitemaps, static pages
- `sitemap-listings.xml`: all active listing pages (one per listing)
- `sitemap-counties.xml`: all county landing pages including paginated pages
- `sitemap-types.xml`: listing type landing pages and paginated versions
- `sitemap-static.xml`: homepage, about, privacy, terms, cookies

**Sitemap update trigger:** Any new listing going live, any listing being deactivated,
any listing slug change (redirect also created) triggers a sitemap regeneration.
Daily cron job regenerates regardless.

**Sitemap submission:** Google Search Console and Bing Webmaster Tools at v1 launch.
Both must receive the sitemap URL before the first listing goes public.

**Sitemap exclusions:**
- Admin console pages (`/admin/*`)
- Owner dashboard pages (`/dashboard/*`)
- API endpoints
- Internal redirects
- Any page with `noindex` meta tag

---

## robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /auth/

Sitemap: https://farmmap.co.uk/sitemap.xml
```

---

## Core Web Vitals Gate

All listing detail pages and county landing pages must pass Google's "Good" threshold
(LCP < 2.5s, INP < 200ms, CLS < 0.1) before v1 launch. This is a hard gate.

Measurement method: Google Search Console CrUX data (field data) supplemented by
Lighthouse CI in production. If CrUX data is not available at launch (new domain,
insufficient traffic), Lighthouse CI in a production environment with 4G throttling
serves as the qualifying measurement until CrUX data is available.

---

## Internal Linking Structure

Internal linking is as important as external backlinks for SEO on a directory product.

**Mandatory internal links:**
- Every listing page links to its county page
- Every county page links to its country page
- Every country page links to the homepage
- Every listing page links to the two nearest listings in the same county (sidebar
  or "Also in [County]" section)
- County pages cross-link to adjacent counties (e.g., Lincolnshire county page links
  to Nottinghamshire, Leicestershire, Northamptonshire, Cambridgeshire)
- Homepage features links to all 5 country landing pages and the top 10 most-viewed
  county pages by listing count

---

## Google Search Console + Bing Webmaster Tools

Both must be set up and verified before v1 launch:
- Google Search Console: property verified via HTML meta tag or DNS record
- Bing Webmaster Tools: property verified and sitemap submitted
- Both receive a sitemap submission on v1 launch day
- Both are monitored weekly for: crawl errors, manual penalties, Core Web Vitals
  issues in CrUX field data

---

*Produced by: platform-strategy-lead | squad: platform-strategy*
*Authority: specs/003-farmmap/spec.md + platform-pack/device-matrix.md + performance-budgets.md*
*Phase: 5 | Feeds: specs/003-farmmap/architecture-pack/ + design-pack/*
