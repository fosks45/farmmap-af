---
feature: 003-farmmap
phase: 7
document: plan
produced_by: architecture-squad-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md
  + specs/003-farmmap/architecture-pack/architecture-decision.md
  + specs/003-farmmap/architecture-pack/data-model.md
  + specs/003-farmmap/architecture-pack/contracts/openapi.yaml
  + specs/003-farmmap/architecture-pack/adrs/
squads: [backend, frontend, data, infra]
sprint-count: 8
task-count: 80
---

# Farmmap — Build Plan

8-sprint build plan covering the full v1/v2/v3 Must-Have feature set (F1–F16, F17–F20, F22–F24).
Task IDs are unique and stable. Squads: `backend` | `frontend` | `data` | `infra`.
Every task links to at least one feature reference (F-NN) and at least one ADR.

---

## Sprint 0 — Foundations

**Goal:** Runnable project with CI/CD, empty database, RLS policies, multi-tenancy middleware, and seed migrations in place. No user-visible features. Everything in Sprint 1 builds on this.

| ID | Title | Squad | Features | ADRs |
|---|---|---|---|---|
| T-001 | Create Supabase project on eu-west-2 (London); enable PostGIS extension; set Supabase project secrets | infra | F14, F15 | ADR-0001, ADR-0006 |
| T-002 | Initialise Next.js 14 App Router project with TypeScript strict mode, Tailwind CSS, shadcn/ui baseline, path aliases | infra | all | ADR-0001 |
| T-003 | GitHub Actions CI: lint (ESLint + Prettier), typecheck (tsc --noEmit), Vitest unit test run on PR | infra | all | ADR-0001 |
| T-004 | Create and apply Sprint 0 Supabase migration: directories, users, account_consents, audit_log tables | data | F14, F16 | ADR-0001, ADR-0003 |
| T-005 | Create and apply Sprint 0 Supabase migration: listings table with PostGIS location column, GIST index | data | F1, F2 | ADR-0006 |
| T-006 | Create and apply Sprint 0 Supabase migration: listing_managers, manager_invitations, claim_tokens tables | data | F3, F16 | ADR-0004 |
| T-007 | Scaffold RLS policies for all Sprint 0 tables: directory_isolation policy; owner/manager policies on listing_managers | data | F14 | ADR-0003, ADR-0004 |
| T-008 | Seed `directories` table: farmmap.co.uk directory record with listing_types, product_categories, brand_config | data | F14 | ADR-0003 |
| T-009 | Implement Next.js middleware for host → directory_id resolution; cache in Vercel Edge Config with 5-minute TTL; inject x-directory-id header | backend | F14 | ADR-0003 |
| T-010 | Vercel project setup: production + staging environments; environment variables (Supabase URL/keys, encryption key, Stripe keys); domain configuration | infra | all | ADR-0001 |

---

## Sprint 1 — Core Directory + Map

**Goal:** Public-facing map with 953 seeded pins (F1), SSR listing detail pages (F2), honesty box listing type (F12), and ROI/Eircode support (F15). Consumers can browse and view listings.

| ID | Title | Squad | Features | ADRs |
|---|---|---|---|---|
| T-011 | Write seed data import script: parse 953 listings from CSV/JSON, geocode UK postcodes via postcodes.io, insert into listings table | data | F1, F12, F15 | ADR-0006 |
| T-012 | Geocode ROI addresses: Eircode via ECAD API; text-only addresses via Nominatim; set geocoding_approximate = true for text-geocoded pins | data | F15 | ADR-0006 |
| T-013 | Implement GET /api/listings/geojson endpoint: returns GeoJSON FeatureCollection of active listings filtered by directory_id and optional bbox/listing_type | backend | F1, F12 | ADR-0003, ADR-0006 |
| T-014 | Implement MapLibre GL JS map page (Client Component): load GeoJSON source, four distinct pin layer styles per listing_type, clustering at low zoom, OSM attribution control enabled | frontend | F1, F12 | ADR-0002 |
| T-015 | Map filter controls (listing type, product category, open now): client-side filter state; filter state reflected in URL query params for shareability | frontend | F1 | ADR-0002 |
| T-016 | Map pin click → mini-card (listing name, type badge, star rating placeholder, "View details" CTA); keyboard-accessible mini-card dismiss | frontend | F1 | ADR-0002 |
| T-017 | Implement GET /api/listings endpoint: search/filter with lat/lon radius (ST_DWithin), listing_type, county, free text (ILIKE), pagination | backend | F2 | ADR-0003, ADR-0006 |
| T-018 | Implement GET /api/listings/{slug} endpoint: returns full listing detail with approved photos, opening_hours, listing_type_meta | backend | F2 | ADR-0003 |
| T-019 | Build Listing Detail RSC page at /listings/[type]/[country]/[county]/[slug]: SSR with generateMetadata() for title/description/OG/Twitter; JSON-LD LocalBusiness schema | frontend | F2 | ADR-0007 |
| T-020 | Listing detail page components: address, opening hours, payment method badges (honesty box), directions link (deep link to native maps), temporarily_closed banner, claim CTA for unclaimed listings | frontend | F2, F12 | ADR-0007 |
| T-021 | Static map image on listing detail page: MapLibre Static API call server-side with listing coordinates; cached in Vercel CDN | frontend | F2 | ADR-0007 |
| T-022 | County landing pages at /county/[country]/[county]: SSR paginated listing list; breadcrumb navigation; JSON-LD BreadcrumbList | frontend | F2 | ADR-0007 |
| T-023 | Country landing pages at /[country]: county grid with listing counts from GET /api/counties | frontend | F2 | ADR-0007 |
| T-024 | Listing type pages at /farm-shops/ and /honesty-boxes/: SSR paginated lists | frontend | F2, F12 | ADR-0007 |
| T-025 | Implement GET /api/counties and GET /api/counties/{country}/{county} endpoints | backend | F2 | ADR-0003 |
| T-026 | WCAG 2.2 AA: map accessible list fallback (HTML listing of nearby listings visible on map page without MapLibre); skip link; keyboard navigation of filter controls | frontend | F1 | ADR-0002 |

---

## Sprint 2 — Claim + Auth + Reviews + Waitlist

**Goal:** Supabase Auth (F16), listing claim flow (F3), consumer reviews (F5), ordering waitlist (F6), multi-manager invite flow.

| ID | Title | Squad | Features | ADRs |
|---|---|---|---|---|
| T-027 | Supabase Auth integration: email/password + magic link; JWT custom claims hook (injects directory_id, account_type, admin_role); session management in Next.js (server-side cookie) | backend | F16 | ADR-0004 |
| T-028 | Auth pages: Sign In, Sign Up, Password Reset, Magic Link sent screen — all WCAG 2.2 AA compliant | frontend | F16 | ADR-0004 |
| T-029 | account_consents: record terms_v1 consent on account creation with ip_hash and mechanism; consent record stored before account is created | backend | F16 | ADR-0004 |
| T-030 | Implement POST /api/listings/{slug}/claim: validate listing not claimed, create claim_token, send claim-verify email via Resend | backend | F3 | ADR-0009 |
| T-031 | Implement POST /api/listings/{slug}/claim/verify: validate token hash, associate listing with authenticated user, create listing_managers row with role=owner, update listing status to claimed | backend | F3 | ADR-0004 |
| T-032 | Claim flow UI: 3-step pages (Email entry, Verify pending, Edit listing); error states (expired link, already claimed, resend option) | frontend | F3 | ADR-0004 |
| T-033 | Supabase migration: reviews, reported_content tables; RLS policies for reviews | data | F5 | ADR-0004 |
| T-034 | Implement POST /api/listings/{slug}/reviews: validate auth, one-review-per-user constraint, insert with moderation_status=pending | backend | F5 | ADR-0004 |
| T-035 | Implement GET /api/listings/{slug}/reviews: paginated approved reviews; aggregate_rating (null if < 3 reviews) | backend | F5 | ADR-0003 |
| T-036 | Review submission modal (accessible radio group for star rating per V2-C9, character counter, submit, optimistic "pending moderation" state); focus trap in modal | frontend | F5 | ADR-0004 |
| T-037 | Supabase migration: order_waitlist table; RLS policy | data | F6 | ADR-0003 |
| T-038 | Implement POST /api/listings/{slug}/waitlist: email hash de-duplication, insert waitlist row, send waitlist-confirm email via Resend with one-click unsubscribe link | backend | F6 | ADR-0009 |
| T-039 | Waitlist widget component on listing detail page: always visible; email input; optimistic confirmation; unsubscribe link in confirmation email | frontend | F6 | — |
| T-040 | Multi-manager invite flow: POST /api/listings/{slug}/managers; send manager-invite email via Resend; manager_invitations record with token_hash; DELETE /api/listings/{slug}/managers/{userId} | backend | F16 | ADR-0004, ADR-0009 |
| T-041 | Manager invite acceptance: GET /api/managers/accept?token=[token] — validates token_hash, creates listing_managers row with accepted_at | backend | F16 | ADR-0004 |
| T-042 | Owner dashboard: Managers page at /dashboard/listing/managers; invite form; managers table; remove manager button (owner only) | frontend | F16 | ADR-0004 |

---

## Sprint 3 — Owner Dashboard + Bronze Tier

**Goal:** Owner management dashboard (F4), Bronze subscription (F7), Bronze shop page (F8), display-only product catalogue (F13), listing analytics (F22).

| ID | Title | Squad | Features | ADRs |
|---|---|---|---|---|
| T-043 | Supabase migration: listing_subscriptions, listing_photos, analytics_events (monthly partitioned), products tables; RLS policies | data | F7, F13, F22 | ADR-0005, ADR-0010 |
| T-044 | Owner dashboard home at /dashboard: listing status card, subscription tier badge, quick-action links; session expiry (8h for owner) | frontend | F4 | ADR-0004 |
| T-045 | Edit listing page at /dashboard/listing/edit: all listing fields editable; form validation; immediate save for text fields | frontend | F4 | — |
| T-046 | Opening hours editor at /dashboard/listing/hours: irregular hours support; bank holiday override toggle; seasonal closure ranges | frontend | F4 | — |
| T-047 | Photo upload page at /dashboard/listing/photos: drag-and-drop + file picker; JPEG/PNG validation; 5MB limit; moderation pending state per photo; display_order drag-to-reorder | frontend | F4 | ADR-0010 |
| T-048 | Implement POST /api/listings/{slug}/photos: multipart validation, Sharp resize to 1200×900 WebP + 400×300 thumbnail, upload to Supabase Storage, insert listing_photos row with moderation_status=pending | backend | F4 | ADR-0010 |
| T-049 | Implement DELETE /api/listings/{slug}/photos/{photoId}: soft-delete with deleted_at timestamp | backend | F4 | ADR-0010 |
| T-050 | Stripe Billing setup: create farmmap-bronze Price in Stripe; implement POST /api/subscriptions/{slug}/checkout (bronze); implement POST /api/subscriptions/{slug}/portal | backend | F7 | ADR-0005 |
| T-051 | Stripe webhook handler at /api/webhooks/stripe: process invoice.paid (bronze — activate Bronze features, update tier column), invoice.payment_failed (send grace-day1 email), customer.subscription.updated (handle downgrade/cancel), customer.subscription.deleted | backend | F7, F10 | ADR-0005 |
| T-052 | Bronze upgrade flow pages: /upgrade/bronze (pricing + 14-day cancellation right display per V2-C1), /upgrade/bronze/payment (Stripe Elements per V2-C10), /upgrade/bronze/done (confirmation + shop page link) | frontend | F7 | ADR-0005 |
| T-053 | Bronze shop page at /shops/[slug]: branded header (logo, hero, tagline, about), product grid (display-only), enquiry form (F21), verified badge | frontend | F7, F8 | ADR-0007 |
| T-054 | Subscription management page at /dashboard/subscription: current tier display, upgrade/downgrade/cancel CTAs; Gold eligibility progress bar (silver_months_count / completed_order_count) | frontend | F10 | ADR-0005 |
| T-055 | Implement GET /api/subscriptions/{slug}: return SubscriptionState including gold_eligible computed field | backend | F10 | ADR-0005 |
| T-056 | Product catalogue management at /dashboard/products: create/edit/archive products; allergen field UI; purchasable toggle gated by allergen_declaration_complete | frontend | F13 | ADR-0001 |
| T-057 | Implement GET/POST /api/listings/{slug}/products; PUT/DELETE /api/listings/{slug}/products/{productId}: allergen validation, purchasable gate, tier check | backend | F13 | ADR-0003 |
| T-058 | Server-side analytics event tracking: listing_page_view written by listing detail RSC; map_pin_click written by GeoJSON click handler; claim_cta_click; subscription_upgrade_initiated/completed | backend | F22 | ADR-0008 |
| T-059 | Analytics dashboard at /dashboard/analytics: page views, pin clicks, waitlist signups, enquiry submissions from analytics_events; period selector (7d/30d/90d/12m); "last updated" timestamp | frontend | F22 | ADR-0008 |
| T-060 | DMCC 2024 auto-renewal notification: Vercel Cron job (daily) sends subscription-grace-day1 email 7 days before renewal for all active subscriptions (V2-C2) | backend | F10 | ADR-0009 |

---

## Sprint 4 — Silver Marketplace

**Goal:** Silver subscription with Stripe Connect Standard (F9), purchasable product catalogue with allergens (F13), delivery zone configuration (F18), order management (F19), stock management (F20), auto-cancellation.

| ID | Title | Squad | Features | ADRs |
|---|---|---|---|---|
| T-061 | Supabase migration: orders, order_items, delivery_zones tables; RLS policies; idempotency_key UNIQUE constraint | data | F8, F18, F19, F20 | ADR-0005 |
| T-062 | Stripe Connect Standard: create farmmap-silver Price; implement POST /api/subscriptions/{slug}/connect (OAuth link); implement POST /api/subscriptions/{slug}/checkout (silver); handle account.updated webhook to set connect_onboarded flag | backend | F9 | ADR-0005 |
| T-063 | Silver upgrade flow pages: /upgrade/silver/setup (Connect onboarding CTA, commission disclosure V3-C4), /upgrade/silver/payment, confirmation | frontend | F9 | ADR-0005 |
| T-064 | Delivery zone configuration UI at /dashboard/listing/delivery: zone name, postcode array input, fee, min order, time slots per day | frontend | F18 | — |
| T-065 | Implement delivery zone CRUD API: POST/PUT/DELETE /api/listings/{slug}/delivery-zones; GET /api/listings/{slug}/delivery-zones/check | backend | F18 | ADR-0003 |
| T-066 | Silver/Gold shop page: product grid with allergen display (V3-C7, V3-C9), "Add to basket" on purchasable products, basket counter | frontend | F8, F13 | ADR-0007 |
| T-067 | Checkout flow: delivery postcode check, delivery slot selector, Stripe Elements payment form, stock reservation (15-min hold) on Payment Intent creation | frontend | F8 | ADR-0005 |
| T-068 | Implement POST /api/orders: validate delivery zone, reserve stock (stock_reserved increment), create Payment Intent on connected account with application_fee_amount, create order with auto_cancel_at = now() + 24h | backend | F8 | ADR-0005 |
| T-069 | Commission calculation logic: `fee = subtotal_pence < threshold_pence ? 0 : Math.round(subtotal_pence * commission_rate)`; server-side only; values from directories.commission_config | backend | F8 | ADR-0005 |
| T-070 | Order management dashboard at /dashboard/orders: pending orders list, order detail modal (line items, delivery address, slot), status transition buttons per workflow step | frontend | F19 | — |
| T-071 | Implement PATCH /api/orders/{orderId}/status: validate transition, notify consumer via Resend on each transition, increment completed_order_count on delivered transition | backend | F19 | ADR-0005, ADR-0009 |
| T-072 | Auto-cancellation Vercel Cron (runs every 30 minutes): find orders WHERE status=pending AND auto_cancel_at < now(); cancel with full refund via Stripe; send auto-cancel email to consumer | backend | F8 | ADR-0005, ADR-0009 |
| T-073 | Stock management: stock_count and stock_reserved fields; low-stock alert email when stock_count - stock_reserved <= configurable threshold; release reservation on 15-min Payment Intent expiry | backend | F20 | ADR-0003 |
| T-074 | Waitlist Silver activation: when listing_subscriptions.tier transitions to silver, send waitlist-notify email to all order_waitlist subscribers for that listing via Resend batch API | backend | F6 | ADR-0009 |
| T-075 | Food business registration field in Silver onboarding (V3-C6): food_business_registration_number field on listing for Silver/Gold; mandatory in upgrade flow | backend, frontend | F9 | — |

---

## Sprint 5 — Gold Tier + Admin Console

**Goal:** Gold subscription with eligibility gate (F10), marketing add-on campaigns (F23), full admin console with moderation queues, impersonation, and user management (F11).

| ID | Title | Squad | Features | ADRs |
|---|---|---|---|---|
| T-076 | Gold eligibility gate UI: /upgrade/gold shows eligibility status (silver_months_count, completed_order_count); disabled upgrade button with explanatory text until both thresholds met; admin override path | frontend | F10 | ADR-0005 |
| T-077 | Implement POST /api/subscriptions/{slug}/checkout (gold): server-side eligibility check; reject if not eligible and no gold_eligibility_override; create Stripe checkout with 5% commission rate | backend | F10 | ADR-0005 |
| T-078 | Gold webhook: stripe invoice.paid — increment silver_months_count (Silver invoices), update tier to gold; update directories.commission_config reference for gold rate | backend | F10 | ADR-0005 |
| T-079 | Admin console foundation: /admin home with queue counts; directory-scoped auth check (directory_admin, super_admin, content_moderator); audit_log INSERT-only RLS enforcement | backend, frontend | F11 | ADR-0004 |
| T-080 | Admin listing queue: GET /admin/listings/queue; individual listing review page with approve/reject/request_info actions; audit_log entry on each action | backend, frontend | F11 | ADR-0003 |
| T-081 | Admin photo queue: GET /admin/photos/queue grid; individual + bulk approve/reject (max 50); each photo logged individually in audit_log (F11 acceptance criteria) | backend, frontend | F11 | ADR-0010 |
| T-082 | Admin review queue at /admin/reviews: list pending reviews; approve/reject with reason; owner notified of rejection via Resend | backend, frontend | F5, F11 | ADR-0009 |
| T-083 | Reported content queue at /admin/reports: dismiss/edit/hide/remove actions; severity badge; potentially_illegal_content category prominently sorted (V2-C6) | backend, frontend | F11 | — |
| T-084 | Admin user management at /admin/users: search by email/name; view account status; deactivate account with audit_log entry | backend, frontend | F11 | ADR-0004 |
| T-085 | Admin subscription overview at /admin/subscriptions: all Bronze/Silver/Gold with status badges, billing dates, Gold eligibility override toggle | backend, frontend | F11 | ADR-0005 |
| T-086 | Admin impersonation: short-lived (1h) impersonation JWT; impersonation_started / impersonation_ended entries in audit_log (immutable); impersonating_hash visible in all actions taken during session | backend | F11 | ADR-0004 |
| T-087 | F23 marketing campaign add-ons: Bronze campaign request form (newsletter feature, social post); creates a campaign request record for editorial team; owner notified of acceptance/completion | backend, frontend | F23 | — |
| T-088 | F24 photo moderation NSFW pre-screening: integrate a lightweight NSFW classification API (e.g., Sightengine) as a pre-queue filter; auto-reject clearly NSFW photos with reason "Inappropriate content"; borderline photos pass to manual queue | backend | F24 | ADR-0010 |

---

## Sprint 6 — Multi-Tenancy Polish + Legal Pages + Cookie Consent

**Goal:** Multi-tenancy fully enforced (F14), cookie consent banner (V1-C8), privacy/terms pages, sitemap, robots.txt.

| ID | Title | Squad | Features | ADRs |
|---|---|---|---|---|
| T-089 | Multi-tenancy integration test: verify all RLS policies prevent cross-directory data access; automated test seeds two directories and asserts isolation for all table types | infra | F14 | ADR-0003 |
| T-090 | Cookie consent banner: PECR-compliant; two buttons (Accept all / Accept necessary only); Manage preferences expanded panel; fm_consent first-party cookie; Escape = accept necessary only (user-flows.md Flow 10); DPC-standard (V1-C8) | frontend | F14, F15 | ADR-0008 |
| T-091 | account_consents: record cookie_analytics and cookie_marketing consent with given_at, ip_hash, mechanism on banner interaction | backend | F14, F15 | ADR-0004 |
| T-092 | Privacy policy page at /privacy: ICO + DPC dual coverage (V1-C1); lawful basis table; separate ROI DPC section; Article 13/14 disclosures; data retention table | frontend | F15 | — |
| T-093 | Cookie policy page at /privacy/cookies: full cookie inventory with name/purpose/duration/first-third-party; category toggles; separate UK/ROI sections; last updated date | frontend | F15 | — |
| T-094 | Terms of Service page at /terms: acceptable use; photo/review licence clauses; allergen disclaimer; 14-day cancellation right; food business registration requirement; governing law split (England+Wales / ROI) | frontend | F7, F8 | — |
| T-095 | Sitemap.xml generation: custom app/sitemap.ts RSC that queries all active listing slugs, county slugs, region pages; 24-hour Vercel Cron regeneration | backend, frontend | F2 | ADR-0007 |
| T-096 | robots.txt: allow all /listings, /county, /shops paths; disallow /admin, /dashboard, /api; sitemap URL included | infra | F2 | ADR-0007 |
| T-097 | Plausible Analytics (cookieless) integration: script loaded on all pages without consent gate; EU-hosted endpoint configured | infra | all | ADR-0008 |
| T-098 | Sentry error monitoring (browser + server): initialise in Next.js; source maps uploaded; error boundaries on all pages; no PII in Sentry payloads (C3+ fields stripped before logging) | infra | all | ADR-0001 |
| T-099 | Better Stack (Logtail) for server-side structured logging: all API Route Handlers log request/response metadata; no PII, no prompt content, no user content (Constitution Principle 10) | infra | all | ADR-0001 |
| T-100 | OSM attribution: automated test asserts MapLibre attributionControl is present and visible on all map page renders (V1-C5) | infra | F1 | ADR-0002 |

---

## Sprint 7 — SEO Hardening + Performance + Accessibility Gates

**Goal:** All Core Web Vitals gates green; Lighthouse CI as hard build gate; WCAG 2.2 AA audit; JSON-LD validated; Search Console setup.

| ID | Title | Squad | Features | ADRs |
|---|---|---|---|---|
| T-101 | Lighthouse CI configuration: lighthouse-ci.json with performance, accessibility, SEO, best-practices thresholds; added as required GitHub Actions check; LCP < 2.5s, INP < 200ms, CLS < 0.1 | infra | all | ADR-0007 |
| T-102 | Core Web Vitals: audit all listing detail pages and county pages; fix LCP (preload hero image, explicit image dimensions), INP (no long tasks on main thread), CLS (no layout shift from image loading or font swap) | frontend | F2 | ADR-0007 |
| T-103 | JSON-LD validation: automated test suite (via Google Rich Results Test API or schema.org validator) for LocalBusiness, AggregateRating, Product, BreadcrumbList on all page types | infra | F2 | ADR-0007 |
| T-104 | WCAG 2.2 AA automated audit: axe-core Playwright tests on all consumer-facing and admin-facing page types; zero WCAG 2.2 AA violations permitted in CI | infra | all | ADR-0002 |
| T-105 | WCAG 2.2 AA manual audit: keyboard navigation of map (search, filters, pin interaction); screen reader testing on listing detail pages and review submission modal; focus management on all modals | infra | F1, F5 | ADR-0002 |
| T-106 | Accessible map implementation plan execution (V1-C10): keyboard-accessible location search; map pin focus announces listing name via live region; accessible list view as map fallback | frontend | F1 | ADR-0002 |
| T-107 | Star rating widget WCAG compliance (V2-C9): review submission star rating uses accessible radio button group pattern (not div-based); axe-core test confirms compliance | frontend | F5 | — |
| T-108 | Stripe Elements accessibility configuration (V2-C10): correct label associations, error announcement, tested against WCAG 1.3.1, 1.4.3, 3.3.1, 3.3.2 | frontend | F7, F8, F9 | ADR-0005 |
| T-109 | Google Search Console + Bing Webmaster Tools: domain verification; sitemap submitted; Search Console integration confirmed (no PECR consent required for server-side click data) | infra | F2 | ADR-0007 |
| T-110 | Performance budget CI enforcement: bundle size budget in next.config.ts; MapLibre JS excluded from non-map page bundles via dynamic import with ssr:false | infra | F1 | ADR-0001, ADR-0002 |
| T-111 | Analytics_events table partitioning: apply monthly RANGE partitions; retention policy — archive to cold storage after 24 months; automated partition creation via Supabase pg_cron | data | F22 | ADR-0008 |
| T-112 | E2E smoke tests (Playwright): impulse discovery flow (map → pin → detail → directions link), claim flow, Bronze upgrade flow, order creation flow, admin moderation flow | infra | F1, F3, F7, F8, F11 | — |
| T-113 | Security review: OWASP Top 10 checklist; RLS policies penetration test; Stripe webhook signature validation; auth token rotation; C3+ field encryption key rotation procedure documented | infra | all | ADR-0004, ADR-0005 |

---

## Sprint Summary

| Sprint | Core Deliverable | Version Gate |
|---|---|---|
| Sprint 0 | Foundations: project, CI, DB migrations, multi-tenancy | — |
| Sprint 1 | Public map + SSR listing pages + 953 seeded pins | V1 prerequisite |
| Sprint 2 | Claim flow + auth + reviews + waitlist + multi-manager | V1 |
| Sprint 3 | Owner dashboard + Bronze subscription + analytics | V2 |
| Sprint 4 | Silver marketplace + orders + delivery + stock | V3 prerequisite |
| Sprint 5 | Gold tier + admin console + photo AI pre-screening | V3 |
| Sprint 6 | Multi-tenancy + legal pages + cookie consent | V1 gate (legal) |
| Sprint 7 | SEO hardening + CWV gates + WCAG audit + E2E tests | All version launch gates |

---

## Open Pre-Launch Human Actions (Not Build Tasks)

These are governance requirements from the compliance pack that are not code tasks and must be completed by the founder before the corresponding version launches:

| Ref | Action | Version Gate | Owner |
|---|---|---|---|
| V1-C3 | Obtain written consent from yourhonestybox.com for 336 listings | V1 | Founder |
| V1-C4 | Obtain written FRA data licence confirmation | V1 | Founder |
| V1-C2 | Appoint EU GDPR Article 27 representative in Ireland | V1 | Founder/DPO |
| V1-C6 | Document and test ICO + DPC breach notification procedures | V1 | Founder/DPO |
| V2-C3 | Legal review of DMCC 2024 pro-rata refund position | V2 | Founder/legal |
| V3-C1 | Allergen liability legal opinion from external counsel | V3 | Founder/legal |
| V3-C11 | PCI DSS SAQ-A self-assessment | V3 | Founder |

---

*Produced by: architecture-squad-lead*
*Authority: specs/003-farmmap/spec.md + architecture-pack/*
*Phase: 7 | Document: plan*
*Total tasks: 113 | Sprints: 8*
