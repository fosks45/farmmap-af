---
feature: 003-farmmap
type: new-feature
status: draft
current_phase: 1
current_squad: discovery-and-validation
submitted_at: 2026-05-16T00:00:00Z
submitted_by: stu-fosks
target_repo_url: https://github.com/fosks45/farmmap-af
---

# Farmmap — Find local. Support local.

## The idea

Farmmap is the definitive online directory of farm shops and honesty boxes across
the United Kingdom and the Republic of Ireland. The primary domain is farmmap.co.uk
(owned). The product also owns farmstor.com and farmstor.co.uk (redirecting).

Users browse an interactive, map-first directory — no login required — to discover
farm shops, honesty boxes, farm gate stalls, and roadside produce stands near them.
Every listing is a pin on the map, searchable by location, product type, and listing
type. Mobile-first design because most users will be browsing while out in the car.

The product launches with 953 seeded, verified listings across all five nations:
- England: 417 farm shops
- Republic of Ireland: 190 honesty boxes + 37 farm shops
- Northern Ireland: 73 honesty boxes + 29 farm shops
- Scotland: 85 farm shops
- Wales: 67 farm shops

Seed data sources: Farm Retail Association (farm shops), yourhonestybox.com
(Ireland/NI honesty boxes — 336 listings). **The yourhonestybox.com data was
obtained with explicit consent from yourhonestybox.com — this is a permitted data
share, not a scrape. The database rights concern raised in the discovery pack
conditions is therefore resolved. yourhonestybox.com should be treated as a
potential partner, not a competitive threat over this data.** 87% of listings
have a postcode or Eircode. Irish rural addresses without Eircodes geocoded from
address text.

## The commercial model (three versions)

**Version 1 — Free directory (launch 1):** Fully public map, no login to browse.
Farm shops can claim their listing for free. No revenue — goal is domain authority,
audience, and trust. Success metric: 100,000 monthly map visitors within 12 months.

**Version 2 — Bronze tier, £20/month:** Branded shop page within Farmmap.
Logo, hero photo, product catalogue (display only, not purchasable), enquiry form,
performance dashboard, verified badge. Optional paid add-ons: newsletter/social
features (£50/campaign).

**Version 3 — Silver tier, £60/month + 3% commission over £20:** Full marketplace.
Online ordering, delivery zone configuration, order management, stock management.
Stripe Connect Standard — shop is merchant of record, Farmmap takes a 3% fee.

**Gold tier, £100/month + 5% commission over £30:** Silver plus Farmmap's marketing
service included: monthly newsletter feature, weekly social posts, homepage placement,
blog post, priority search ranking. Up to 1,000 products vs 500 on Silver.

## The portfolio model

Farmmap is the first in a family of map-first directories sharing one multi-tenant
engine: TractorMap, BerthMap, CampingMap, ForecourtMap, FishMap, BrewMap. Each is
a configuration file, a domain name, and a seed dataset once the engine is built.
Multi-tenant from day one — every database table scoped to a `directory_id`.

## Key decisions already confirmed (squads should validate, not just accept)

1. Free directory tier is permanent — basic visibility is not paywalled
2. Stripe Connect Standard — shop is always merchant of record (avoids FCA regulation)
3. Multi-tenant architecture from day one (single shared database, directory_id scoping)
4. Honesty boxes are a first-class listing type (listing_type field in data model)
5. UK-only ordering at Launch 2 — Republic of Ireland delivery deferred
6. Sanity for editorial content only — PostgreSQL for all transactional data
7. All monetary values stored as integer pence (never floats)
8. MapLibre GL JS with OpenStreetMap tiles

## Confirmed tech stack (squads should validate and flag any concerns)

- Frontend: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- Database: PostgreSQL with PostGIS extension on Supabase
- Auth & Storage: Supabase (authentication, file storage, row-level security)
- Payments: Stripe subscriptions (tiers) + Stripe Connect Standard (marketplace)
- CMS: Sanity (headless, invisible to shop owners)
- Map: MapLibre GL JS with OpenStreetMap tiles
- Hosting: Vercel (frontend), Supabase (backend)
- Email: Resend or Postmark (transactional)
- Monitoring: Sentry (errors), Better Stack (uptime)

## Open items requiring human decision before build

1. Multi-tenancy approach — shared Supabase DB with directory_id (recommended) vs
   separate Supabase project per directory
2. Sanity scope — exactly which content types Sanity owns vs PostgreSQL
3. Multiple managers per shop — single owner only at v1 vs multi-manager from start
4. Admin vs moderator role split — full admin vs content-only moderator
5. Gold tier gating criteria — locked to 3+ months Silver + 50+ orders, or open
6. Silver → Bronze downgrade billing — immediate vs end of period
7. Idempotency pattern — application-layer keys vs database-level uniqueness constraints
8. Background job runner — Vercel Cron + serverless vs Inngest
9. Stock race condition handling — reservation during checkout, behaviour on payment failure
10. Auto-cancellation window — 24 hours for unaccepted orders (recommended) vs 12 or 48
11. Reverse image search service for product photo moderation — Google Vision API, TinEye, or SerpApi

## Important note for all squads

The exec summary is the founder's current thinking, not the ground truth. Squads
should validate every decision, correct anything that is wrong or suboptimal, and
flag where the founder's assumptions need testing. Include explicit assessments of
where the exec summary analysis is sound and where it needs revision.

Also note: yourhonestybox.com is a direct comparator in the honesty box space and
is gaining traction. The compliance squad must assess the data origin of the
336 yourhonestybox.com listings extracted for the seed dataset.
