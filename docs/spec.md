---
feature: 003-farmmap
spec_id: 003-farmmap-v1
version: 1.0.0
status: approved-pending-human-sign-off
phase: 3
produced_by: personas-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/viability-gate.md + specs/003-farmmap/personas-pack/
technology-references: none — this document is implementation-free
feeds: specs/003-farmmap/architecture-pack/ + specs/003-farmmap/compliance-pack/
---

# Farmmap — Product Specification v1.0.0

**Important:** This document is the canonical, implementation-free product specification.
It describes what Farmmap does and why, not how it is built. Technology stack, database
schema, hosting choices, and framework selections are architecture decisions. They are
not in this document. Any reference to a technology in this specification is a violation
of spec-build discipline and must be removed.

---

## Problem

Farm shops and honesty boxes across the United Kingdom and the Republic of Ireland are
invisible to digital discovery despite a growing and documented consumer appetite for
local food.

The Farm Retail Association's own consumer research identifies "don't know where to
find one" as the primary barrier to farm shop purchases among UK adults who already
want to buy local food. The Food Standards Agency's Food and You 2 survey (Wave 7,
2024) places 43% of UK adults — approximately 22.3 million people — in a segment that
actively values local food. An estimated 3.6 million of these adults have never visited
a farm shop specifically because of discovery friction.

2,310 UK farm shops have no website. Many more have a website that does not appear in
local search results for the queries their potential customers are using. Honesty boxes
and roadside farm gate stalls are almost entirely absent from any digital directory —
there is no authoritative, current, browsable index of them anywhere in the UK.

The gap is not one of supply. Farm shops exist. Honesty boxes are operating. Consumers
want local food. The problem is a missing information layer: there is no single place
a consumer can go to browse a map of everything near them, filter by what they are
looking for, and trust that the listing is current and accurate.

The economic cost of this gap is substantial. At base case, the discovery problem
suppresses approximately £137 million in annual consumer spend that would otherwise
reach farm shops — not because those shops lack the product but because consumers
cannot find them.

---

## Solution

A map-first, mobile-first directory covering every farm shop and honesty box across
England, Scotland, Wales, Northern Ireland, and the Republic of Ireland.

**Free to browse.** No login required to use the map or view listing details. The
browsing experience is the product. Paywalling basic discovery contradicts the entire
value proposition.

**Free to list.** A farm shop or honesty box listing costs the owner nothing. Visibility
is not a paid privilege. The permanent free listing is the foundation of the supply-side
network effect.

**Optional paid tiers for owners who want more.** Bronze tier (£20/month) adds a
branded shop presence, photos, product catalogue, performance analytics, and a verified
badge. Silver tier (£60/month plus commission) adds a full online marketplace with
ordering, delivery configuration, and stock management. Gold tier (£100/month plus
commission) adds Farmmap's managed marketing service on top of Silver.

**Launches with density.** 953 seeded, verified listings across all five nations means
the map is useful from day one. A new consumer who opens Farmmap for the first time
in any rural area of the UK or Ireland should see listings within a reasonable radius.
Density at launch is the essential precondition for every other metric — consumer
traffic, claimed listing growth, Bronze conversion, Silver GMV.

**Multi-tenant from day one.** The platform engine serves multiple directories from
a single shared infrastructure. Farmmap is the first; TractorMap, BerthMap, and
CampingMap follow once Farmmap proves its unit economics. The directory identity is
determined by the domain the consumer visits. An admin for Farmmap cannot see data
for any other directory in the portfolio.

---

## Must-Have Features (F1–F16)

These features define the minimum viable product across all three product versions
(V1 Free, V2 Bronze, V3 Silver/Gold). No version may launch without the features
designated for that version being complete and acceptance-tested.

---

### F1 — Interactive Map

**Description:** The primary interface for consumers. All listings appear as pins on
a map. Users navigate by dragging, zooming, and searching by location. Pin type is
visually distinct by listing_type. Filtering is available without a page reload.

**Available from:** V1

**Filters supported:**
- Listing type: farm shop, honesty box, farm gate stall, roadside stand
- Product type: vegetables, meat, dairy, eggs, baked goods, and other configurable
  categories per directory
- Open/closed status where known (based on declared opening hours and the current
  time; not real-time)

**Acceptance criteria:**
- Map displays all active listings as distinct pin types by listing_type at all zoom
  levels above a configurable minimum (pins cluster at low zoom to avoid overplotting)
- Location-based search returns listings within a configurable radius from a place
  name, postcode, or Eircode
- Filters narrow the visible pins without full page reload; filter state is reflected
  in the page URL for shareability
- Map is usable without login or account creation
- Map with the full listing dataset loads within the performance budget stated in
  non-functional requirements (3 seconds on a 4G mobile connection)
- Directions link is available from each pin; opens in the device's native navigation
  application

**Linked JTBDs:** J1, J2

---

### F2 — Listing Browse and Detail

**Description:** Every listing has a detail page accessible from the map pin and from
direct URL. The detail page is the primary information surface for a consumer deciding
whether to visit.

**Available from:** V1 (basic data), V2 Bronze (claimed listings with owner content)

**Detail page content:**
- Name, address, listing type
- Opening hours where known, including support for irregular patterns
- Product types available (structured tags, not free text)
- Photos (for claimed listings where the owner has uploaded them; moderated before
  display)
- Contact information (phone, website, email — where available and owner-consented)
- Directions link (opens native maps application)
- Reviews and aggregate star rating (once F5 is live)
- Ordering waitlist sign-up (once F6 is live)
- Claim this listing prompt (for unclaimed listings)

**Acceptance criteria:**
- Detail page renders correctly on mobile without horizontal scroll at 320px CSS width
- Directions link opens the device's native maps application with the listing address
  pre-filled
- Unclaimed listings display seeded data with a visible "claim this listing" call
  to action
- Claimed listings display owner-managed content including any approved photos
- Listing detail page is indexable by search engines (structured data markup included)

**Linked JTBDs:** J1, J2, J3

---

### F3 — Free Listing Claim

**Description:** Any farm shop or honesty box owner can claim their seeded listing for
free. Verification is via email to an address linked to the business. Once claimed, the
owner can edit all listing fields.

**Available from:** V1

**Claim flow:**
1. Consumer or owner arrives on listing detail page
2. Selects "claim this listing"
3. Provides their name, business role, and an email address for the business
4. Receives a verification email with a claim link
5. Confirms via the link; listing is transferred to their account
6. Owner is directed to the listing management interface (F4)

**Acceptance criteria:**
- Claim flow is completable in under 5 minutes by a non-technical user
- Email verification is required; the listing is not transferred until the
  verification link is clicked
- A single listing cannot be claimed by more than one owner simultaneously
- If a listing is already claimed, the claim prompt changes to a "contact us" path
  so disputed claims can be escalated to admin (F11)
- Owner receives a confirmation with a link to their management dashboard
- The claim flow works on mobile without requiring a desktop browser

**Linked JTBDs:** J5

---

### F4 — Listing Management

**Description:** Claimed listing owners can edit all listing fields, upload photos,
manage opening hours, and mark their listing temporarily closed.

**Available from:** V1 (for claimed listings)

**Editable fields:**
- Name, description, address
- Opening hours (with support for irregular patterns such as "Tuesday and Friday
  only, 9am–5pm", seasonal closures, and bank holiday overrides)
- Product types (structured multi-select from directory category list)
- Photos (up to 10; subject to moderation before display — see F11)
- Contact details (phone, website, email)
- Payment methods accepted (particularly relevant for honesty boxes — cash,
  contactless, QR code payment link)
- Temporarily closed toggle

**Acceptance criteria:**
- Photo upload accepts JPEG and PNG formats; rejects files exceeding 5MB per image
  with a clear error message
- Photos enter the moderation queue (F11) and are not publicly displayed until
  approved
- Opening hours interface supports irregular patterns and does not force a
  Monday–Sunday uniform schedule
- Temporarily closed toggle is visible on the listing detail page as a banner;
  the listing remains findable on the map but is visually marked as temporarily
  closed
- All changes to text fields take effect immediately; photo changes take effect
  after moderation approval

**Linked JTBDs:** J5, J7

---

### F5 — Consumer Reviews and Ratings

**Description:** Logged-in consumers can leave a star rating (1–5) and text review
for any listing. Reviews are moderated before display. Shop owners can respond to
reviews. Aggregate ratings are displayed on the map pin and on the listing detail page.

**Note:** This feature was absent from the original intake. It is added to the Must-Have
list based on the viability-gate.md condition ("Consumer review and ratings system absence
leaves J2 and J3 permanently dependent on Google Maps and TripAdvisor") and the
problem-solution-fit analysis recommendation. Without this feature, J2 and J3 are
permanently partial and the platform never accumulates the review network effect that
represents a 36–60 month moat against any future competitor.

**Available from:** V2 Bronze tier launch (or as an early V2 increment)

**Review lifecycle:**
1. Logged-in consumer submits review (star rating + text)
2. Review enters moderation queue (F11); not visible until approved
3. Admin approves or rejects; rejection includes a reason sent to the reviewer
4. Approved review is published on the listing detail page
5. Owner is notified; can submit a response (also moderated before display)
6. Aggregate star rating is recalculated and displayed on the map pin

**Acceptance criteria:**
- Review submission requires a user account with a verified email address
- Anonymous browsing does not surface review submission as an option
- Reviews are not visible until approved by admin; moderation target is within 24
  hours of submission
- Review text must be between 20 and 1,000 characters; character count is visible
  during composition
- Owner response is linked to the original review; owner response is also moderated
- Aggregate star rating is visible on the map pin (as a simple numerical/star indicator)
  and on the listing detail page
- A listing with fewer than 3 reviews does not display an aggregate rating (to avoid
  misrepresentation from single-review averages)
- Consumers can report a review as inappropriate; reported reviews enter a secondary
  moderation queue (F11)

**Linked JTBDs:** J2, J3

---

### F6 — Ordering Waitlist / Demand Capture

**Description:** A single-field email capture on the listing detail page: "Get notified
when [Farm Name] starts taking online orders." No purchase flow. The waitlist captures
ordering intent that would otherwise be lost during the 12+ months before the Silver
tier marketplace goes live.

**Note:** This feature was absent from the original intake. It is added as Must-Have
based on the viability-gate.md condition: "The absence of this mechanism in the current
spec is the single easiest fix in the entire product definition, and it should be added
to the V1 spec before the architecture phase begins."

**Available from:** V1

**Waitlist mechanics:**
- Any visitor (including anonymous) can submit an email address on any listing detail
  page to join that listing's ordering waitlist
- Submission triggers a confirmation email to the subscriber; no account required
- The subscriber count for each listing is visible to the listing owner in their
  dashboard (not publicly displayed on the listing)
- When a listing activates Silver tier ordering (F8), all waitlist subscribers for that
  listing receive an automated notification email

**Acceptance criteria:**
- Email capture is visible on all listing detail pages, not gated to claimed listings
- Submission requires no account creation; confirmation email is sent within 2 minutes
- Listing owner sees waitlist subscriber count in their management dashboard
- Subscriber email addresses are only used for the specific waitlist notification
  purpose and cannot be used for other marketing without further consent (GDPR compliance)
- When Silver tier is activated for a listing, automated notification is sent to all
  subscribers within 24 hours
- Owner can bulk export the waitlist email list when they upgrade to Silver tier
- Waitlist subscribers can unsubscribe at any point via a one-click link in any
  notification email

**Linked JTBDs:** J4 (future demand capture)

---

### F7 — Bronze Tier Subscription (£20/month)

**Description:** Paid upgrade for claimed listing owners. Provides a fully branded shop
presence within Farmmap, display-only product catalogue, enquiry form, performance
analytics dashboard, and a verified owner badge.

**Available from:** V2

**Bronze features included:**
- Branded shop page at farmmap.co.uk/shops/[slug]: logo, hero image, tagline, about
  section
- Display-only product catalogue (see F13 for catalogue spec)
- Enquiry form for consumers to contact the shop directly
- Performance analytics dashboard: page views, map pin impressions, enquiry counts,
  waitlist subscriber count; updated at minimum every 24 hours
- Verified owner badge on the map pin and listing detail page
- Campaign add-ons available at additional cost: newsletter feature (£50/campaign),
  social media post (£50/campaign) — these are done-for-you outputs, not self-serve
  tools

**Acceptance criteria:**
- Bronze subscription is activated via self-serve payment without a sales conversation
  or human approval step
- Branded shop page is publicly accessible at the shop's unique slug within 15 minutes
  of payment confirmation
- Verified badge appears on the map pin and listing detail page within 15 minutes of
  payment confirmation
- Analytics dashboard updates at minimum every 24 hours; last-updated timestamp is
  visible on the dashboard
- Monthly invoice is sent automatically on the billing anniversary date
- Card failure triggers a 7-day grace period; owner is notified on day 1 of the grace
  period and again on day 5; subscription suspends (not cancels) on day 8 if payment
  is not recovered
- Suspended subscriptions restore verified badge and branded page immediately on
  successful payment recovery

**Linked JTBDs:** J5, J7

---

### F8 — Silver Tier Subscription (£60/month + 3% commission on orders ≥ £20)

**Description:** Full marketplace tier. Adds online ordering to the Bronze shop page.
The farm shop is the merchant of record via a payment platform connection; Farmmap
takes a 3% application fee on orders above £20. Includes delivery zone configuration,
order management, and stock management.

**Available from:** V3

**Commission structure:**
- 3% commission applies to the full order subtotal when that subtotal is ≥ £20
- Orders with a subtotal below £20 carry zero commission
- Commission is calculated on the order subtotal (excluding delivery fee)
- Automatic full commission reversal on full order refund
- Partial refund: commission recalculated on the adjusted subtotal; if adjusted subtotal
  falls below £20, commission is reversed to zero

**Important constraint:** The £20 commission threshold applies to the full order
subtotal, not per item. This must be disclosed clearly to shop owners during
Silver onboarding and in the subscription agreement.

**Allergen requirement:** All products made purchasable must include allergen information
fields per food labelling regulations. A product without complete allergen data cannot
be set to purchasable status.

**Acceptance criteria:**
- "Add to basket" is available on all Silver-tier product listings that have allergen
  fields completed
- Delivery zone configuration: owner sets delivery postcodes or postcode prefixes,
  product categories available for delivery, delivery fees (flat or weight-based),
  and available delivery time slots
- Order management workflow: pending → accepted → in preparation → dispatched → delivered
  (each transition requires an explicit owner action; consumer is notified on each
  transition)
- Stock quantity is reserved on checkout initiation (not on payment); reservation
  is released if payment is not completed within 15 minutes; stock is deducted on
  order acceptance by the owner
- Allergen field is mandatory for all 14 regulated allergens before a product can be
  set to purchasable status; partial completion blocks the purchasable toggle
- Commission calculation is: 3% × order subtotal where order subtotal ≥ £20; £0 where
  order subtotal < £20
- Automatic commission reversal executes within 1 hour of a full refund being processed

**Linked JTBDs:** J4, J6

---

### F9 — Gold Tier Subscription (£100/month + 5% commission on orders ≥ £30)

**Description:** All Silver features plus Farmmap's managed marketing service as part
of the subscription: monthly newsletter feature, weekly social media posts, homepage
featured placement, and a dedicated blog post. Priority ranking in search results and
map display. Up to 1,000 products versus 500 on Silver.

**Commission risk note:** At Gold tier, shops generating above £8,000/month GMV pay
£400/month or more in commission on top of the £100 subscription. At £15,000/month
GMV the commission (£750) exceeds the cost of a comparable standalone e-commerce
platform plus a freelance marketer. A commission cap or sliding scale above £8,000/month
GMV should be evaluated and confirmed in the V3 commercial model specification before
Silver/Gold launches. This is an explicit open risk in the commercial model, not a
deferred concern.

**Available from:** V3

**Marketing service deliverables (monthly, per Gold subscriber):**
- One newsletter feature: the shop is featured in Farmmap's consumer email newsletter
  with a dedicated section (photo, description, product highlight, link)
- Four social media posts per month: organic posts on Farmmap's social channels
  (channels to be confirmed in go-to-market plan) featuring the shop
- Homepage featured placement: the shop appears in a rotating featured placement
  on the Farmmap homepage for the calendar month
- One blog post per quarter: a dedicated editorial piece on Farmmap's blog featuring
  the shop's story, products, and provenance

**Priority ranking:** Gold tier listings are ranked higher than Bronze and Silver
listings in free-text search results and in the default map ordering when multiple
listings are close together. The priority ranking algorithm is documented and disclosed
to shop owners so they understand the value they are purchasing.

**Acceptance criteria:**
- All Silver features function identically at Gold tier
- Newsletter, social posts, and homepage placement are delivered monthly; a missed
  delivery in any month entitles the shop owner to a pro-rata credit equivalent to
  that deliverable's share of the monthly fee
- Blog post is delivered within the calendar quarter; the schedule is confirmed with
  the shop owner at the start of each quarter
- Priority ranking is applied in the search algorithm; a "Gold Member — Priority
  Listed" label is visible on Gold listings on the map and detail page
- Product catalogue limit is 1,000 products at Gold tier vs 500 at Silver

**Linked JTBDs:** J5, J6, J7

---

### F10 — Subscription Management

**Description:** Shop owners can upgrade, downgrade, or cancel their subscription
from their dashboard. Lifecycle rules comply with Consumer Contracts Regulations 2013.

**Available from:** V2 (Bronze activation) with upgrade/downgrade paths extending
through V3

**Lifecycle rules:**
- **Upgrade** (e.g., Bronze → Silver, Silver → Gold): Takes effect immediately.
  Charge for the remainder of the current billing period is prorated at the new tier
  rate. Next billing cycle is at the full new tier rate.
- **Downgrade** (e.g., Gold → Silver, Silver → Bronze): Takes effect at the end of
  the current billing period. Owner retains current tier features until that date.
  Owner is notified 7 days before the effective downgrade date.
- **Cancellation:** Takes effect at the end of the current billing period. Owner
  retains current tier features until that date. No partial-period refunds after the
  14-day cancellation right window.
- **14-day cancellation right** (Consumer Contracts Regulations 2013): At the initial
  signup for any paid tier, the owner has a 14-day right to cancel and receive a full
  refund. This right is disclosed prominently on the payment page and in the post-
  payment confirmation email. It applies to the initial signup only, not to upgrades
  from one tier to another.

**Acceptance criteria:**
- Upgrade flow is self-serve; completes without a support contact
- Downgrade and cancellation flows are self-serve; both require a confirmation step
  to prevent accidental actions
- 14-day cancellation right is visible on the Bronze/Silver/Gold payment page and in
  the post-payment email, in plain English (not buried in terms)
- Owner receives an email 7 days before any scheduled downgrade or cancellation
  takes effect
- If a shop is on Silver and cancels, any pending orders in the order management
  system must be fulfilled or refunded before the Silver features are removed; the
  system prevents feature removal while there are pending orders

**Linked JTBDs:** (operational — subscription lifecycle)

---

### F11 — Admin Console

**Description:** Platform admin interface for the Farmmap team. Covers all moderation,
user management, reported content handling, and subscription oversight.

**Available from:** V1 (moderation queues), V2 (subscription management), V3 (order
oversight added)

**Admin console modules:**

**Listing approval queue:** New listings submitted by users (not seeded) enter an
approval queue. Admin can: approve (listing goes live), reject with a reason (owner
notified with reason text), or request more information (listing held pending owner
response).

**Photo moderation queue:** Uploaded photos enter a queue before display. Admin can:
approve individual photos, reject with a reason, or bulk-approve a batch of obviously
compliant photos. Rejected photos trigger a notification to the listing owner.

**Review moderation queue:** Consumer reviews enter a queue before display. Admin can
approve or reject with a reason. Rejected reviews trigger a notification to the reviewer.

**Reported content queue:** Any user can flag a listing, photo, or review as
inappropriate, spam, or factually incorrect. Flagged items enter a triage queue with
a severity classification (spam, inappropriate content, incorrect information). Admin
resolves each item: dismiss (no action), edit (admin corrects factual error), hide
(pending investigation), or remove (permanent, with reason logged).

**User management:** Admin can search users by email or name, view account status,
manage subscription status, and deactivate accounts that violate platform terms.

**Subscription status overview:** Shows all Bronze/Silver/Gold subscribers with their
current status (active, grace period, cancelled, pending downgrade) and billing dates.

**Impersonation:** Admin can view the platform as any listing owner to troubleshoot
issues. Every impersonation session is logged in the audit trail with: admin identity,
impersonated account identity, timestamp, and session duration. This log is immutable.

**Acceptance criteria:**
- All admin actions that modify listing, user, or subscription data are recorded in
  the audit trail with: admin identity, action type, target entity, timestamp, and
  the previous and new values of any changed field
- Impersonation log is immutable; no admin can edit or delete their own impersonation
  records
- Bulk approve in the photo moderation queue processes up to 50 photos in a single
  action; each photo is logged individually in the audit trail
- Reported content queue shows a severity badge on each item; items classified as
  "inappropriate content" or "spam" sort to the top of the queue by default
- Admin console is scoped to the active directory; a Farmmap admin cannot see or
  modify data for any other directory in the portfolio

**Linked JTBDs:** (operational — P5 Alex Kim)

---

### F12 — Honesty Box Listing Type

**Description:** Honesty boxes are a first-class listing type with their own fields,
pin style, and owner management options. This is one of the clearest differentiators
from every existing directory in the market.

**Available from:** V1

**Honesty box-specific fields:**
- Payment methods accepted: cash, contactless card, QR code payment link, Revolut link,
  other (free text for unusual methods)
- Currently stocked toggle: owner can mark the box as stocked or empty; visible on
  the listing detail page with a timestamp ("last updated: [time]")
- Typical products available: structured tags, same category system as farm shops
- Approximate price ranges: optional free text or structured range
- Location description: free text for boxes without a precise postcode or Eircode
  (e.g., "at the end of the track past the red gate, on the left")

**Listing types (applies to all listings, not just honesty boxes):**

| listing_type | Display label | Map pin style |
|---|---|---|
| farm_shop | Farm Shop | Distinct pin colour A |
| honesty_box | Honesty Box | Distinct pin colour B |
| farm_gate_stall | Farm Gate Stall | Distinct pin colour C |
| roadside_stand | Roadside Stand | Distinct pin colour D |

(Pin colours and styles are a design-phase decision; the requirement is that all four
types are visually distinguishable from each other on the map.)

**Acceptance criteria:**
- Honesty box pins are visually distinct from farm shop pins on the map at all zoom
  levels where pins are not clustered
- Payment method badges are displayed on the honesty box listing detail page in a
  consumer-readable format
- "Currently stocked" toggle is available to claimed honesty box listing owners and
  updates the listing detail page in real time (within 5 minutes of the toggle action)
- The "currently stocked" status is visible on the map pin for honesty boxes (small
  indicator icon or colour change) to support the impulse-visit use case
- Unclaimed honesty box listings display whatever payment method and product
  information is available in the seeded data; the claim prompt is equally visible

**Linked JTBDs:** J1, J3

---

### F13 — Product Catalogue

**Description:** All paid tiers have a product catalogue, with capabilities tiered by
subscription level. Free/unclaimed listings have no catalogue.

**Available from:** V2 Bronze (display-only), V3 Silver/Gold (purchasable)

**Tier capability matrix:**

| Capability | Free / Unclaimed | Bronze | Silver | Gold |
|---|---|---|---|---|
| Product catalogue | None | Display-only (name, description, photo, price range) | Purchasable (requires allergen fields) | Purchasable (requires allergen fields) |
| Max products | 0 | 500 | 500 | 1,000 |
| Allergen fields | N/A | Optional (informational) | Mandatory for purchasable status | Mandatory for purchasable status |
| Seasonal availability flag | N/A | Yes ("usually available [month range]") | Yes | Yes |
| Stock management | N/A | N/A | Yes (F20 — Should-Have) | Yes (F20 — Should-Have) |

**Allergen fields (mandatory for all purchasable products — Natasha's Law compliance):**
- Contains allergens: structured multi-select from the 14 regulated major allergens
  (celery, cereals containing gluten, crustaceans, eggs, fish, lupin, milk,
  molluscs, mustard, peanuts, sesame, soybeans, sulphur dioxide and sulphites, tree nuts)
- May contain (cross-contamination risk): free text
- Allergen information verified: checkbox with date of verification
- Purchasable toggle is disabled until all allergen fields are completed

**Acceptance criteria:**
- Bronze product entries display name, description, photo (if uploaded), and price
  range; no "add to basket" option is available at Bronze tier under any circumstance
- Silver/Gold products require allergen completion before the purchasable toggle can
  be enabled; the incomplete-allergen state shows a clear error state on the product
  management interface, not a silent failure
- Product photos enter the moderation queue before display (same as listing photos)
- Seasonal availability flag is selectable as: year-round, a month range (e.g., "April
  to October"), or "ask us" (links to enquiry form)
- Product catalogue is importable in bulk via CSV; the CSV template is available in the
  owner management dashboard

**Linked JTBDs:** J2, J8

---

### F14 — Multi-Tenant Directory Engine

**Description:** The platform serves multiple directories from a single shared
infrastructure. All data is scoped to a directory_id. Directory identity is determined
by the host domain. This enables TractorMap, BerthMap, and other Map-family products
to run on the same engine without code changes — only configuration, domain, and seed
data differ.

**Available from:** V1 (architecture day one)

**Multi-tenancy rules:**
- Every data entity (listing, user, subscription, order, review, photo, audit log
  entry) carries a directory_id
- A user account is scoped to a directory; a consumer cannot log in to TractorMap
  with their Farmmap account (accounts are directory-scoped at v1; cross-directory
  accounts are a future enhancement)
- Admin console is directory-scoped; a Farmmap admin can only see Farmmap data;
  a super_admin can switch between directories but sees one at a time
- Listing types, product categories, filter options, and map pin styles are
  configurable per directory via a directory configuration record
- Host-based directory detection: farmmap.co.uk resolves to directory_id 1;
  tractormap.co.uk resolves to directory_id 2; the platform must not serve
  cross-directory data through any publicly accessible endpoint

**Staged investment gate:** The multi-tenant architecture is built from day one but
investment in launching a second vertical (TractorMap, BerthMap, etc.) is gated on
Farmmap reaching 100 paying Bronze subscribers. This gate exists to ensure capital is
not committed to engine generalisation before Farmmap's unit economics are proven.
Reaching the gate unlocks the second vertical launch budget.

**Acceptance criteria:**
- All listing, subscription, user, and order database records carry a directory_id
  and queries without a directory_id filter return zero results by default
- Host-based directory detection is deterministic; there is no code path that can
  serve Farmmap data to a TractorMap visitor or vice versa
- Admin console directory-scoping is enforced at the data access layer, not only at
  the UI layer; an admin cannot access out-of-scope data by manipulating API requests
- Directory configuration (listing types, product categories, pin styles, brand colours)
  is editable by super_admin without a code deployment
- The platform handles a directory configuration with zero listings without error

**Linked JTBDs:** J9

---

### F15 — Republic of Ireland Support

**Description:** The platform handles Irish addresses correctly. Eircodes are used where
available. Irish rural addresses without Eircodes are geocoded. Data protection
compliance covers both UK ICO and Irish DPC requirements for relevant users.

**Available from:** V1

**Ireland-specific requirements:**
- Eircode input field on all address forms (optional; not all Irish addresses have
  an Eircode, particularly for rural honesty boxes and farm gate stalls)
- Geocoding fallback: addresses without an Eircode are geocoded from the address text;
  the geocoded pin is placed with a visual indicator that it may not be precise
- The platform's privacy policy addresses both UK ICO (GDPR) and Irish DPC compliance
  explicitly; it is not acceptable to have a UK-only privacy policy when the product
  actively holds data about Irish users
- For Republic of Ireland users specifically, the lawful basis for data processing must
  be consistent with the Irish DPC's guidance and with the EU's GDPR as it applies
  in Ireland (the UK Retained GDPR does not apply in the Republic of Ireland)
- Currency display: product prices for ROI listings are displayed in EUR where the
  listing owner has configured EUR as their currency; the platform must support EUR
  and GBP on separate listings without conflict
- ROI online ordering (Silver/Gold marketplace) is deferred beyond V3. ROI listings
  will appear on the map and support the full Bronze feature set including the ordering
  waitlist (F6); the online ordering capability is not available for ROI listings
  until a dedicated ROI marketplace launch is planned.

**Acceptance criteria:**
- Eircode input field is present on all Irish address forms and validates the Eircode
  format (letter, digit, space, 4 alphanumeric characters)
- Geocoding fallback places the pin within 500 metres of the correct location for
  95% of Irish rural addresses tested in UAT
- ROI listings are correctly placed on the map from address text alone (no Eircode
  required)
- Platform privacy policy references both ICO and DPC; the DPC section is not
  a copy-paste of the ICO section
- EUR price display appears correctly for ROI listings; no GBP symbol is shown for
  a EUR-configured listing

**Linked JTBDs:** J1, J2 (Irish users)

---

### F16 — User Account and Authentication

**Description:** Consumers can optionally create accounts. Account creation is not
required to browse the map or view listings. It is required to leave reviews, save
favourites, or receive ordering notifications. Farm shop owners must create accounts
to claim listings.

**Available from:** V1

**Account types:**

| Account type | Required for | Optional account benefits |
|---|---|---|
| None (anonymous) | Map browsing, listing detail viewing, waitlist signup (F6) | — |
| Consumer account | Review submission (F5), saving favourites | Personalised map (saved filters, favourite listings), order history (V3) |
| Owner account | Listing claim (F3), listing management (F4), subscription (F7/F8/F9) | Analytics dashboard, order management, subscription management |
| Admin account | Admin console (F11) | Directory switching (super_admin only) |

**Authentication methods:**
- Email and password (all account types)
- Social login via one or more major identity providers (consumer accounts; specific
  providers to be confirmed in architecture phase based on what is available and
  permitted under policy)
- Email-only (magic link) authentication for consumer accounts as an alternative
  to password creation

**Password and session rules:**
- Password must meet a minimum complexity standard (length and character variety;
  specific rules to be confirmed in architecture phase)
- Sessions expire after a configurable idle timeout (default: 30 days for consumer
  accounts, 8 hours for owner and admin accounts)
- Password reset must complete within 15 minutes of the reset email being received;
  reset links expire after 15 minutes

**Acceptance criteria:**
- Map browsing and listing detail viewing require no account and set no tracking
  cookies beyond what is required for session management
- Review submission requires a verified email address (account or one-time email
  verification)
- Listing claim requires a full account with email verification
- Waitlist signup (F6) requires only an email address; no account is created
- Password reset works within 15 minutes of request; expired reset links display
  a clear "this link has expired" message with a prompt to request a new one
- Social login option is available on the consumer account registration and login pages

**Linked JTBDs:** J3 (verified account as trust signal for reviews)

---

## Should-Have Features (F17–F24)

These features are not required for V1, V2, or V3 launch but are planned for
delivery within the v1–v3 roadmap horizon. Their absence does not prevent a version
from launching; their presence materially improves the product.

**F17 — Bulk Listing Claim (Cooperative Onboarding)**
Allows an organisation (cooperative, trade body, land agent) to claim multiple
listings in a single process by providing evidence of legal authority over all
listed businesses. Includes a cooperative billing option. Primary signal: P6
Brigid O'Sullivan use case. At v1, cooperative onboarding is handled manually via
admin (F11) on request.

**F18 — Delivery Configuration**
Owner-configurable delivery zones for Silver/Gold listings: postcode prefixes served,
delivery fees (flat or weight-banded), minimum order values by zone, available
delivery time slots by day. Required for Silver tier to launch; included here as a
Should-Have to acknowledge that the configuration UX is complex and may ship in an
MVP form (simple flat-fee postcode list) before reaching the full spec.

**F19 — Order Management Dashboard**
Silver/Gold owners receive a dedicated order management interface: pending orders list,
order detail (line items, customer details, delivery address, delivery slot), and
status transition controls (accept → in preparation → dispatched → delivered). Required
for Silver tier to launch; included here to acknowledge the scope of this interface.

**F20 — Stock Management and Low-Stock Alerts**
Product-level stock quantity tracking for Silver/Gold. Stock is reserved on checkout
initiation and deducted on order acceptance. Owner receives a low-stock alert at a
configurable threshold. Products with zero stock are automatically removed from the
purchasable catalogue. This is a Should-Have rather than Must-Have because Silver can
launch without automated stock management (owners manage manually at low volume) but
the feature is required before Silver reaches meaningful GMV.

**F21 — Enquiry Form (Bronze)**
Consumer-facing contact form on Bronze-tier shop pages. Submitted enquiries are
emailed to the listing owner's registered address. No enquiry management interface
at v1 — the form is a pass-through to email. An enquiry inbox with threading is a
future enhancement.

**F22 — Listing Analytics Dashboard**
Bronze and above: page views (total and unique), map pin impressions, enquiry form
submissions, and waitlist subscriber count. Should-Have rather than Must-Have because
Bronze can launch without analytics; analytics are the conversion lever for Bronze →
Silver but not a prerequisite for the Bronze product functioning.

**F23 — Newsletter and Social Campaign Add-Ons (Bronze)**
Done-for-you campaigns available as one-off purchases at Bronze tier: a newsletter
feature and a social media post. Owner submits a request with content inputs; Farmmap
editorial team produces the deliverable. The campaign add-on is separate from the
Gold tier's included marketing service — it is opt-in and per-campaign for Bronze
subscribers.

**F24 — AI-Assisted Photo Moderation**
An automated pre-screening step in the photo moderation queue that flags obviously
inappropriate content (NSFW, non-food images, stock photography) before it reaches
the admin moderation queue. Should-Have rather than Must-Have because manual
moderation is sufficient at launch volume; AI assistance reduces admin time once
listing density grows. Reverse image search for stock photo detection is explicitly
deferred to v2.

---

## Won't Have (v1–v3 Scope Boundary)

The following are explicitly out of scope for v1 through v3. They may be reconsidered
in a future spec version with the amendment process defined in the Constitution.

- **Republic of Ireland delivery and online ordering** — Eircode logistics complexity,
  Irish consumer protection legislation differences, and the need to establish Irish
  payment processing make this a dedicated launch rather than a V3 add-on. It is
  deferred until a formal ROI marketplace release is planned.
- **Native mobile application (iOS/Android)** — A responsive, mobile-first web
  application covers the primary use case. A native app adds distribution complexity
  (App Store/Play Store), update friction, and push notification infrastructure without
  a v1–v3 use case that cannot be served by the web application.
- **Multiple managers per listing** — Single owner per claimed listing at v1. Multiple
  managers (e.g., a farmer plus their daughter, or a farm shop owner plus a marketing
  assistant) are a v2 feature. The claim flow and listing management interface are
  designed with single-owner assumptions; multi-manager requires an account permissions
  model that is out of scope for v1.
- **CMS for editorial content** — The Farmmap blog and county guide articles are
  managed using a separate editorial toolchain at v1. An integrated CMS adds
  architectural complexity without improving consumer or owner experience within the
  v1–v3 scope.
- **Scottish Gaelic language support** — Welsh language support may be considered
  as a Should-Have at v2 given the Welsh Language Act. Scottish Gaelic does not have
  equivalent legal weight for a commercial web application and is deferred.
- **Cross-directory user accounts** — Consumer and owner accounts are directory-scoped
  at v1. A single account that works across Farmmap, TractorMap, and other portfolio
  directories is a future architecture enhancement.
- **Wholesale / B2B ordering channel** — Farmmap is a consumer discovery and direct
  retail platform. B2B wholesale (e.g., a restaurant buying directly from a farm) is
  a distinct product requiring different pricing, invoicing, and credit terms. It is
  out of scope for this specification.

---

## Non-Functional Requirements

### Performance

- **Map with 953+ listings loads within 3 seconds on a 4G mobile connection.** This
  is the primary performance budget and is treated as a functional requirement for
  the J1 (impulse discovery) use case. A map that takes 8 seconds to load on the
  A1 in Lincolnshire does not serve the product's core job.
- **Listing detail page loads within 2 seconds** on a 4G mobile connection.
- **Admin console operations (listing approval, photo moderation, user management)**
  respond within 1 second for queue page loads and within 2 seconds for individual
  record operations.
- **Photo upload and processing** completes within 30 seconds for a 5MB image.
- The platform must support a minimum of 100,000 concurrent map sessions without
  degraded performance. This is the V1 traffic target; the architecture must be
  capacity-planned to handle 2× this figure during peak periods (bank holidays,
  food festival weekends) without manual intervention.

### Accessibility

- **WCAG 2.2 AA for all consumer-facing and admin-facing surfaces.** This is a
  non-negotiable requirement, not an aspiration. The European Accessibility Act is
  enforced across the EU since June 2025; the ADA Title II rule is effective for
  relevant US entities from April 2026. WCAG 2.2 AA is the standard that covers
  all current legal requirements.
- **Map interface must be keyboard-navigable.** A keyboard-only user must be able to
  search for a location, view map results, navigate to a listing detail page, and
  use the filter controls without a pointing device.
- **Screen reader support for listing information.** All listing information must be
  accessible via screen reader. Map pins must have accessible text equivalents when
  focused. Dynamic map updates must be announced to screen readers via appropriate
  live region techniques.
- Specific accessibility requirements are governed by the `.claude/rules/a11y.md`
  file in this repository, which is authoritative for all implementation decisions.

### Security

- All personal data is encrypted at rest and in transit. The definition of personal
  data follows the data classification taxonomy in the Constitution (§3).
- Payment card data never enters the platform's own systems. All card processing is
  handled by the payment platform. The platform stores only the tokens and identifiers
  provided by the payment platform.
- Farm shop owner account data is classified C3 minimum (Customer PII per Constitution
  §3). Consumer review data is classified C3. Honesty box location data is classified
  C0 (public).
- Session tokens for owner and admin accounts are rotated on every login. Admin session
  tokens expire after 8 hours of inactivity.
- All admin console actions are logged in the audit trail per Principle 10 of the
  Constitution.

### Compliance

- **UK GDPR (retained from EU GDPR)** applies to all UK users and UK-resident data.
  The platform's privacy policy discloses all data processing activities in plain
  English. Consent is not the primary lawful basis for most processing activities
  (legitimate interests or contractual necessity is more appropriate); the compliance
  pack must confirm the lawful basis for each processing activity.
- **Irish DPC (EU GDPR)** applies to all Republic of Ireland users. The platform's
  privacy policy explicitly addresses both ICO and DPC compliance. The compliance pack
  must produce a separate DPC-specific assessment.
- **Consumer Contracts Regulations 2013 (UK)** applies to all subscription sales. The
  14-day cancellation right is a legal requirement. It must be disclosed before payment
  and confirmed in the post-payment email. The cancellation right disclosure must be in
  plain language, not buried in terms and conditions.
- **Natasha's Law (UK) and EU Regulation 1169/2011 (Ireland)** require full allergen
  declaration on pre-packed food sold online. Allergen fields (F8, F13) are a legal
  requirement for all purchasable food products. A product without completed allergen
  information cannot be made purchasable. The compliance pack must confirm the specific
  allergen fields required and the declaration format.
- **Food Safety Act 1990 (UK) and Food Safety Authority of Ireland Act 1998** create
  a framework of responsibility for food sold online. Farmmap is the platform, not
  the food business operator; the farm shop is the merchant of record (Silver/Gold).
  However, the compliance pack must confirm the extent of platform liability and
  the policy requirements (seller vetting, allergen enforcement mechanism) that reduce
  regulatory exposure.

### Data Residency

All personal data is stored within the United Kingdom or a jurisdiction with an
adequacy decision under UK GDPR. For Republic of Ireland users, personal data is
stored within the EU or a jurisdiction with an EU adequacy decision. The architecture
pack must confirm that the chosen infrastructure meets these requirements for both
UK and EU/ROI users simultaneously.

### SEO and Content

The 100,000 monthly visitor target that underpins every commercial metric is not
achievable through a product launch alone. The product must be built for SEO from
day one — not retrofitted.

**URL structure (canonical and stable):**
- Listing pages: `/listings/[county-slug]/[listing-slug]`
- County landing pages: `/county/[county-slug]` (auto-generated from listing data)
- Region landing pages: `/region/[region-slug]` (England, Scotland, Wales, NI, Ireland)
- Listing type pages: `/honesty-boxes/` and `/farm-shops/` (top-level, linkable)
- URL slugs must be assigned at creation and never changed (301 redirects if renamed)

**Structured data (JSON-LD — required on every listing page):**
- `LocalBusiness` schema with: name, address, geo (latitude/longitude), telephone,
  openingHoursSpecification, image, description
- `FoodEstablishment` sub-type for farm shops selling food
- `AggregateRating` from Farmmap reviews (once F5 is live)
- `Product` schema for featured products on Bronze/Silver/Gold pages
- Structured data must validate against Google's Rich Results Test before each launch milestone

**Meta tags (every page must have):**
- `<title>`: descriptive, unique per page, includes location (e.g. "Hargreaves Farm Shop, Lincolnshire — Farmmap")
- `<meta name="description">`: unique 150–160 characters, includes product types and location
- `<link rel="canonical">`: on every page, correct self-referencing URL
- Open Graph tags: `og:title`, `og:description`, `og:image` (listing photo), `og:url`, `og:type`
- Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

**Sitemap and crawlability:**
- `sitemap.xml` covering all active listing pages, county pages, and region pages
- Sitemap submitted to Google Search Console and Bing Webmaster Tools at launch
- `robots.txt`: disallow admin console; allow all listing pages
- **Non-map fallback pages are mandatory for SEO.** The interactive map is not
  indexable by search engines. Every listing must have a standard HTML detail page
  accessible without JavaScript. County and listing-type listing pages must render
  as paginated HTML lists, not map-only views. This is the primary SEO surface.

**Core Web Vitals:**
LCP < 2.5s, INP < 200ms, CLS < 0.1 on listing detail page and county landing page
on mobile. Measured in production, not just locally. Lighthouse CI gate required.

---

### Analytics and Tracking

**Privacy-first analytics (PECR-compliant):**
- Analytics are category 2 (non-essential) and require active cookie consent before
  any tracking fires. No analytics load on page entry; they load only after consent
  is given.
- Recommended: server-side analytics or cookie-free analytics (e.g. Plausible or
  Fathom) for aggregate traffic reporting that does not require consent. Full
  behavioural analytics (e.g. Google Analytics 4) may be offered as optional under
  cookie consent for richer funnel data.
- Conversion tracking for farm shop subscription upgrades: required to measure
  the commercial funnel. Must fire only after consent.
- Search Console integration: not subject to PECR (server-side click data). Always
  enabled without consent requirement.

**Events to track (minimum):**
- Page view per listing (for farm shop analytics dashboards — aggregated, not
  individual user tracking; stored in Farmmap's own database, not a third-party)
- Map pin click (to listing detail)
- "Claim this listing" button click
- Subscription upgrade initiated / completed
- Ordering waitlist signup (F6)
- Review submission (F5)
- Enquiry form submission (Bronze F21)

**Farm shop analytics dashboard (F22):**
The analytics shown to farm shop owners in their dashboard (page views, impressions,
enquiry counts) must be derived from Farmmap's own event store, not from third-party
analytics cookies. This means the page view count shown to a shop owner is Farmmap's
own server-side count — it does not depend on the visitor having accepted analytics
cookies. This is both a PECR compliance requirement and a product quality requirement
(shop owners see accurate counts, not consent-biased undercounts).

---

### Cookie Policy and Consent

**Cookie consent (PECR Regulation 6 — mandatory):**
- A cookie consent banner must be present on all pages on first visit
- Consent must be: freely given, specific, informed, and unambiguous (no pre-ticked
  boxes, no "continuing to use this site means you consent")
- Consent categories: Strictly necessary (no consent required), Analytics/performance
  (consent required), Marketing/personalisation (consent required if used)
- Users must be able to withdraw consent as easily as they gave it — a "Cookie
  settings" link in the footer must open the consent management panel
- Consent is stored in a first-party cookie (not a third-party consent management
  platform unless necessary); consent record includes: categories accepted, timestamp,
  version of cookie policy

**Cookie policy page (mandatory — published before V1 launch):**
A dedicated `/privacy/cookies` page listing:
- Every cookie set by the platform with: name, purpose, duration, first/third party
- Which category each cookie belongs to
- How to manage cookies per browser
- Link to the full privacy policy
- Last updated date (must be updated when new cookies are added)
- Separate sections for UK users and ROI users where cookie rules differ

**Privacy policy page (mandatory):**
A dedicated `/privacy` page covering:
- Data controller identity (Farmmap / the company name)
- What personal data is collected and why (UK GDPR Article 13/14)
- Lawful basis for each processing activity
- How long data is retained
- Whether data is shared with third parties (Stripe, analytics providers, email service)
- Data subject rights (access, erasure, portability, objection)
- How to contact the Data Protection representative
- **Separate section for ROI users** referencing the Irish DPC as the supervisory
  authority for users resident in the Republic of Ireland
- Last updated date
- Version number (for audit trail purposes)

**Terms of Service (mandatory before V1 launch):**
Farm shops claiming listings and subscribers must accept ToS. Minimum content:
- Acceptable use of the platform
- Content standards for listing descriptions and photos
- Review and moderation policy
- Subscription terms (pricing, cancellation, auto-renewal disclosure)
- Limitation of liability for farm shop-provided information (including allergen data)
- Governing law: England and Wales for UK users; Republic of Ireland law for ROI users

---

## Open Questions for Spec Sign-Off

These 11 questions were identified in the intake as requiring human decision before
the architecture phase begins. Each is presented with a recommended answer and the
rationale from the evidence base. The founder must confirm or override each
recommendation before the architecture pack is commissioned.

---

**1. Multi-tenancy approach: shared database with directory_id versus separate project
per directory**

RECOMMEND: **Shared database with directory_id scoping.**

Rationale: A separate infrastructure project per directory multiplies operational
overhead (separate connection strings, separate backup configurations, separate
monitoring, separate scaling events) with no architectural benefit at the current
scale. The directory_id approach is standard for multi-tenant SaaS at this stage.
If a directory ever requires data residency in a jurisdiction incompatible with sharing
infrastructure with other directories, a migration path exists; this is not a realistic
near-term concern for TractorMap or BerthMap.

---

**2. Sanity CMS scope: exactly which content types Sanity owns versus the transactional
database**

RECOMMEND: **Defer Sanity entirely for v1. Use a file-based or markdown-based
editorial solution for blog posts and county guide articles at launch.**

Rationale: Sanity adds an API dependency, an editorial workflow, a content modelling
exercise, and a CDN layer. At v1, the blog and county guides are written by one person
(Alex Kim) and published infrequently. The overhead of Sanity is not justified by the
v1 content volume. A migration to Sanity can be done when the editorial team expands
and the content volume justifies a headless CMS. Do not over-architect the content
layer at launch.

---

**3. Multiple managers per listing**

**DECISION (spec sign-off 2026-05-16): Multi-manager from v1.**

This overrides the initial recommendation. The founder confirmed multi-manager
is required from v1.

Implementation impact: The data model must support a listing_managers join table
(listing_id, user_id, role: owner|manager) from day one. The owner role has full
access including billing; the manager role can edit listing content and manage orders
but cannot change billing or transfer ownership. Architecture must design this
permissions model before Build begins. The cooperative use case (P6 — Brigid
O'Sullivan) benefits directly: she can claim a listing and add each cooperative
member as a manager of their own honesty box entry.

F17 (Bulk Listing Claim) is promoted from Should-Have to Must-Have as a result
of this decision — multi-manager without bulk claim forces P6 to claim and manage
each listing individually, which is not workable for a 12-listing cooperative.

---

**4. Admin versus moderator role split: full admin versus content-only moderator**

RECOMMEND: **Three roles: super_admin (full access including directory switching),
directory_admin (full access within a single directory), content_moderator
(listing approval, photo moderation, and review queue only — no subscription or
user management access).**

Rationale: At launch, Alex Kim is the only user of the admin console and the
distinction is academic. However, the role model must be correct from day one
because adding a content moderator later (to handle the review moderation queue at
scale) must not require a code change. Three roles is the minimum correct model for
a multi-tenant platform with multiple content moderation responsibilities.

---

**5. Gold tier gating criteria**

**DECISION (spec sign-off 2026-05-16): Gated — 3 months on Silver + 50+ completed orders.**

The founder chose the gated model to protect the quality of the Gold marketing
service. A shop featured in the Farmmap newsletter or on social media must be active
and ordering-ready. A shop that upgrades to Gold on day one with an empty order
history would undermine the marketing channel's credibility.

Implementation: The subscription engine must track `silver_months` (count of
calendar months on Silver) and `completed_order_count` on the listing. The Gold
upgrade button in the subscription dashboard is disabled (with explanation) until
both thresholds are met. The eligibility check runs at subscription change time,
not continuously. The founder can manually override for specific shops via the
admin console (useful for anchor shops at launch).

---

**6. Silver → Bronze downgrade billing: immediate versus end of period**

RECOMMEND: **End of period.**

Rationale: Immediate downgrade creates a partial-period refund obligation that
conflicts with the Consumer Contracts Regulations 2013 position on distance contract
changes. End-of-period downgrade is legally cleaner: the subscriber has paid for
Silver for the full period and retains Silver features until the period ends. This
is also better for the subscriber experience — an owner who decides to downgrade
is not penalised by losing Silver features immediately. The implementation note is
that pending orders in the Silver order management system must be resolved before
features are removed; the system prevents feature removal while there are pending
orders.

---

**7. Idempotency pattern: application-layer idempotency keys versus database-level
uniqueness constraints**

RECOMMEND: **Application-layer idempotency keys with database-level uniqueness
constraints as a secondary defence.**

Rationale: Application-layer idempotency keys (a unique key submitted with each
order creation or payment request, checked before processing) provide the clearest
path for handling network retries and duplicate submissions from clients. Database-
level uniqueness constraints are a necessary backstop but are not sufficient on their
own because they raise an exception rather than returning the result of the original
operation. Both layers together provide defence-in-depth against duplicate order
creation and duplicate commission charges.

---

**8. Background job runner: Vercel Cron plus serverless versus Inngest**

RECOMMEND: **Vercel Cron plus serverless functions for the proof-of-concept phase.
Evaluate Inngest when job volume justifies the additional managed service dependency.**

Rationale: At v1 and v2, the background job requirements are modest: waitlist
notification emails, analytics aggregation, subscription billing events, and order
status reminders. Vercel Cron handles these without an additional service dependency.
Inngest provides event-driven orchestration, retry logic, and debugging tools that
become valuable when job volume and complexity increase (V3 marketplace, multiple
directories). The recommendation is to not introduce Inngest until the job volume
at V2/V3 clearly exceeds what Vercel Cron handles gracefully.

---

**9. Stock race condition: reservation strategy on checkout initiation versus payment
confirmation, and behaviour on payment failure**

RECOMMEND: **Reserve stock on checkout initiation. Release reservation after a
15-minute checkout timeout or on explicit payment failure. Deduct stock definitively
on order acceptance by the owner.**

Rationale: Reserving on payment confirmation (rather than checkout initiation) creates
a race condition where two customers can add the last item to their basket simultaneously
and both be shown "in stock" until one of them completes payment. This degrades the
consumer experience and creates a situation where a confirmed order cannot be fulfilled.
The 15-minute reservation timeout is long enough to complete a checkout on a slow
connection but short enough that stock is not indefinitely locked by abandoned carts.

---

**10. Auto-cancellation window for unaccepted orders: 24 hours versus 12 hours
versus 48 hours**

RECOMMEND: **24 hours.**

Rationale: 24 hours allows a farm shop owner a full working day to respond to a new
order without requiring them to be continuously online. 12 hours is too short for a
small operation whose owner may be away from their phone during the working day. 48
hours is too long from the consumer's perspective — a consumer who ordered perishable
goods and has not received confirmation after 2 days will have a poor experience.
The 24-hour auto-cancellation triggers an automatic consumer notification with an
explanation and a full refund.

---

**11. Reverse image search service for product photo moderation**

RECOMMEND: **Defer automated reverse image search for v1. Admin manual review plus a
basic automated NSFW image classifier is sufficient at launch listing volume.**

Rationale: Reverse image search (to detect stock photography or copied images from
other sources) is a useful fraud-prevention tool at scale. At launch, with 953 seeded
listings and a gradual claim rate, the photo moderation volume is manageable through
manual review. A basic NSFW classifier (to catch inappropriate content) can be
implemented at low cost and high accuracy. Reverse image search adds API dependency,
cost per image, and a classification decision that still requires human review. It
should be introduced in v2 when photo volume warrants it.

---

## Evidence Lineage

This specification is grounded in the following prior evidence packs. No feature or
requirement in this document is unsupported by the evidence chain:

- `specs/003-farmmap/intake.md` — founder's initial product definition
- `specs/003-farmmap/discovery-pack/problem-solution-fit.md` — JTBD-to-feature fit
  analysis (identified F5 and F6 as must-have additions)
- `specs/003-farmmap/discovery-pack/saleability-critique.md` — adversarial acquisition
  and commercial model analysis
- `specs/003-farmmap/discovery-pack/value-thesis.md` — economic case for the product
- `specs/003-farmmap/market-pack/pricing-hypothesis.md` — tier pricing analysis
  (source of commission risk note in F9)
- `specs/003-farmmap/market-pack/tam-sam-som.md` — market size and revenue projections
- `specs/003-farmmap/market-pack/competitor-matrix.md` — competitive landscape
- `specs/003-farmmap/viability-gate.md` — GO verdict with all eight conditions
  (primary authority for F5, F6, allergen requirements, and ROI support requirements)
- `specs/003-farmmap/personas-pack/personas.md` — six canonical personas
- `specs/003-farmmap/personas-pack/jtbd-map.md` — nine jobs in Christensen format

---

*Produced by: personas-squad-lead | squad: personas-and-requirements*
*Version: 1.0.0 | Status: approved-pending-human-sign-off*
*Authority: specs/003-farmmap/viability-gate.md + all evidence-pack references listed above*
*Feeds: specs/003-farmmap/architecture-pack/ + specs/003-farmmap/compliance-pack/*
