---
feature: 003-farmmap
phase: 6
document: information-architecture
squad: ux-design
produced_by: ux-design-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md
  + specs/003-farmmap/personas-pack/personas.md
  + specs/003-farmmap/platform-pack/device-matrix.md
  + specs/003-farmmap/platform-pack/seo-requirements.md
---

# Farmmap — Information Architecture

---

## Primary Navigation

### Mobile — Bottom Tab Bar (fixed, always visible)

| Tab | Icon | Label | Default State |
|---|---|---|---|
| 1. Map | map-pin icon | Map | Active on app load |
| 2. Near me | location-arrow icon | Near me | Requires geolocation permission on first tap |
| 3. Discover | grid icon | Discover | Static browse interface |
| 4. My listings | storefront icon | My listings | Hidden if not authenticated; replaced by "Sign in" tab |
| 5. Account | person icon | Account | Login/signup if unauthenticated |

**Tab 4 (My listings) visibility:**
- Anonymous visitor: Tab 4 is hidden; the tab bar shows 4 items
- Authenticated consumer account: Tab 4 is hidden; shows 4 items
- Authenticated owner account: Tab 4 is visible; shows 5 items
- Admin account: Tab 4 label changes to "Admin"; shows 5 items

### Desktop — Top Navigation Bar (sticky header)

Left: Farmmap wordmark + logo
Centre: [Map] [Near me] [Discover] [Farm shops] [Honesty boxes]
Right: [My listings / Admin] [Account / Sign in]

The top nav collapses to a hamburger menu at viewport widths below 768px (where
the bottom tab bar takes over).

---

## Screen Inventory

Every named screen in the product. Screen name = the canonical name used in all
design artefacts, wireframes, and user flows.

### Consumer-Facing Screens

| Screen Name | URL Pattern | Purpose | Available |
|---|---|---|---|
| Home / Map | `/` | Primary map interface; all listing pins | V1 |
| Near Me | `/near-me` | Geolocation-triggered list of nearby listings | V1 |
| Discover | `/discover` | Browse by county, region, or product type | V1 |
| Country Landing | `/[country]` | All counties in a country with listing counts | V1 |
| County Landing | `/county/[country]/[county]` | Paginated list of all listings in a county | V1 |
| Listing Type Page | `/farm-shops/` etc. | All listings of a given type | V1 |
| Listing Detail — Farm Shop | `/listings/farm-shop/[country]/[county]/[slug]` | Full farm shop listing detail | V1 |
| Listing Detail — Honesty Box | `/listings/honesty-box/[country]/[county]/[slug]` | Honesty box detail (distinct layout) | V1 |
| Listing Detail — Farm Gate Stall | `/listings/farm-gate-stall/[country]/[county]/[slug]` | Farm gate stall detail | V1 |
| Listing Detail — Roadside Stand | `/listings/roadside-stand/[country]/[county]/[slug]` | Roadside stand detail | V1 |
| Bronze Shop Page | `/shops/[slug]` | Branded shop page for Bronze tier | V2 |
| Silver/Gold Shop Page | `/shops/[slug]` | Bronze page + ordering capability | V3 |
| Waitlist Signup Modal | Overlay on listing detail | Email capture for ordering waitlist (F6) | V1 |
| Review Submission Modal | Overlay on listing detail | Star rating + text review (F5) | V2 |
| Search Results | `/search?q=[query]&lat=[lat]&lng=[lng]` | Text + location search results | V1 |
| Privacy Policy | `/privacy` | GDPR + DPC privacy policy | V1 |
| Cookie Policy | `/privacy/cookies` | Cookie inventory + consent management | V1 |
| Terms of Service | `/terms` | Platform terms of service | V1 |

### Owner-Facing Screens

| Screen Name | URL Pattern | Purpose | Available |
|---|---|---|---|
| Claim Listing — Step 1 (Email) | `/claim/[listing_id]/email` | Email entry for claim verification | V1 |
| Claim Listing — Step 2 (Verify) | `/claim/[listing_id]/verify` | Email verification confirmation | V1 |
| Claim Listing — Step 3 (Edit) | `/claim/[listing_id]/edit` | First listing edit after claim | V1 |
| Claim Listing — Done | `/claim/[listing_id]/done` | Confirmation + link to dashboard | V1 |
| Owner Dashboard — Home | `/dashboard` | Performance metrics overview | V1 |
| Owner Dashboard — Edit Listing | `/dashboard/listing/edit` | Edit all listing fields | V1 |
| Owner Dashboard — Photos | `/dashboard/listing/photos` | Upload, view, delete photos | V1 |
| Owner Dashboard — Opening Hours | `/dashboard/listing/hours` | Complex opening hours editor | V1 |
| Owner Dashboard — Managers | `/dashboard/listing/managers` | Add/remove listing managers | V1 |
| Owner Dashboard — Waitlist | `/dashboard/waitlist` | View waitlist subscriber count + export | V1 |
| Owner Dashboard — Analytics | `/dashboard/analytics` | Page views, impressions, enquiries | V2 |
| Owner Dashboard — Subscription | `/dashboard/subscription` | Current tier, upgrade/downgrade/cancel | V2 |
| Owner Dashboard — Products | `/dashboard/products` | Product catalogue management | V2 |
| Owner Dashboard — Orders | `/dashboard/orders` | Order management (Silver/Gold) | V3 |
| Bronze Upgrade Flow — Pricing | `/upgrade/bronze` | Bronze pricing, trial offer, payment | V2 |
| Bronze Upgrade Flow — Payment | `/upgrade/bronze/payment` | Stripe Elements payment form | V2 |
| Bronze Upgrade Flow — Confirmation | `/upgrade/bronze/done` | Confirmation + next steps | V2 |
| Silver Upgrade Flow — Consent | `/upgrade/silver/setup` | Marketplace consent + delivery zone setup | V3 |
| Silver Upgrade Flow — Payment | `/upgrade/silver/payment` | Stripe Elements payment form | V3 |
| Gold Upgrade Flow — Eligibility | `/upgrade/gold` | Eligibility gate display + explanation | V3 |
| Gold Upgrade Flow — Payment | `/upgrade/gold/payment` | Payment + confirmation | V3 |
| Account — Profile | `/account/profile` | Name, email, password | V1 |
| Account — Sign In | `/account/signin` | Email + password or magic link | V1 |
| Account — Sign Up | `/account/signup` | Registration form | V1 |
| Account — Password Reset | `/account/reset-password` | Request reset; enter new password | V1 |

### Admin Console Screens

| Screen Name | URL Pattern | Purpose | Available |
|---|---|---|---|
| Admin Home | `/admin` | Queue counts, system status | V1 |
| Listing Queue | `/admin/listings` | New listing approval queue | V1 |
| Listing Queue — Detail | `/admin/listings/[id]` | Individual listing review | V1 |
| Photo Queue | `/admin/photos` | Photo moderation queue | V1 |
| Photo Queue — Bulk | `/admin/photos/bulk` | Bulk approve/reject interface | V1 |
| Review Queue | `/admin/reviews` | Consumer review moderation queue | V2 |
| Reported Content | `/admin/reports` | Reported content triage queue | V2 |
| User Management | `/admin/users` | Search, view, manage user accounts | V1 |
| Subscription Overview | `/admin/subscriptions` | All Bronze/Silver/Gold subscriber status | V2 |
| Order Oversight | `/admin/orders` | Platform-wide order status view | V3 |
| Audit Log | `/admin/audit` | Immutable audit trail view | V1 |

---

## Navigation Depth

**Goal: highest-frequency jobs in ≤ 2 taps from home.**

| Job | Path | Tap Count |
|---|---|---|
| Consumer: map → listing detail | Home (Map) → pin tap | 1 tap |
| Consumer: map → directions | Home (Map) → pin tap → directions | 2 taps |
| Consumer: near me → listing detail | Near Me tab → listing row tap | 2 taps |
| Consumer: discover → county → listing | Discover → county tap → listing tap | 2 taps |
| Owner: dashboard → edit listing | My listings (dashboard home) → Edit listing | 1 tap |
| Owner: subscription upgrade | Subscription tab → Upgrade button | 2 taps |
| Owner: claim a listing | Listing detail → "Claim this listing" → start | 2 taps |
| Admin: photo moderation | Admin home → Photo queue | 2 taps |
| Admin: approve listing | Listing queue → listing row → approve | 3 taps (acceptable for low-frequency admin) |

---

## SEO Page Hierarchy

The SEO content hierarchy mirrors the URL structure and the internal linking
requirements from seo-requirements.md.

```
farmmap.co.uk (homepage)
├── /england
│   ├── /county/england/lincolnshire
│   │   ├── /listings/farm-shop/england/lincolnshire/[slug]
│   │   └── /listings/honesty-box/england/lincolnshire/[slug]
│   ├── /county/england/yorkshire
│   └── ... (all English counties)
├── /scotland
│   └── ... (all Scottish council areas)
├── /wales
│   └── ... (all Welsh counties)
├── /northern-ireland
│   └── ... (all NI counties)
├── /republic-of-ireland
│   └── ... (all ROI counties)
├── /farm-shops/
└── /honesty-boxes/
```

Breadcrumb navigation on every page follows this hierarchy. Every listing page
shows: Home > [Country] > [County] farm shops > [Listing Name]

---

*Produced by: ux-design-lead | squad: ux-design*
*Authority: specs/003-farmmap/spec.md + personas-pack + platform-pack*
*Phase: 6 | Feeds: specs/003-farmmap/design-pack/user-flows.md + wireframes/*
