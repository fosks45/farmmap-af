---
spec_id: 003-farmmap
document: problem-solution-fit
squad: discovery-and-validation
agent: problem-solution-fit-analyst
status: complete
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/intake.md
---

# Farmmap — Problem-Solution Fit Analysis

## Purpose

This document maps each identified Job-to-be-Done (JTBD) to the features proposed in
the Farmmap intake (`specs/003-farmmap/intake.md`) and assesses the strength of fit.
Where gaps exist they are named precisely. Where features have no corresponding job
they are flagged as scope-creep signals. The analysis covers all three versions
(V1 Free, V2 Bronze, V3 Silver, Gold) and the portfolio model.

---

## JTBD Mapping

---

### J1 — Impulse discovery while driving

> "When I'm driving through rural areas, I want to know if there's a farm shop or
> honesty box nearby, so I can buy fresh local produce without planning ahead."

**Fit: STRONG**

The V1 Free tier directly addresses this job. The product is explicitly designed as a
"map-first directory" with "mobile-first design because most users will be browsing
while out in the car." The launch dataset includes 953 verified listings with postcodes
or Eircodes, covering farm shops and honesty boxes as first-class listing types.
Location-based search is confirmed. No login required to browse removes all friction
for a passing driver. MapLibre GL JS on OpenStreetMap tiles supports the geospatial
interaction needed for this job.

**Residual risk:** Map performance on mobile networks in rural areas is untested.
Slow tile loading could frustrate the impulse use case. The tech stack choice (MapLibre
with OSM tiles) is sound but Vercel edge caching strategy for map tiles should be
validated in the architecture phase.

---

### J2 — Pre-trip research and planning

> "When I'm planning a weekend in the countryside, I want to find all the farm shops
> worth visiting, so I can support local and stock up on quality food."

**Fit: PARTIAL**

V1 supplies the map browse and location/type filtering needed for trip planning. The
gap is **reviews and social proof**: a consumer planning a trip wants to know which
shops are worth the detour. The intake specifies no review or ratings feature in any
version. V2 Bronze adds photos and a product catalogue (display only), which partially
addresses quality signals, but there is no mechanism for consumers to leave reviews
or ratings.

**Gap:** Consumer review and rating system is absent across all versions. A prospective
visitor cannot verify quality from the directory alone — they must seek third-party
sources (Google Maps, TripAdvisor). This weakens the planning use case and leaves
the product dependent on external platforms for the trust layer.

**Note:** This gap may be intentional at V1/V2 to avoid review moderation complexity,
but it should be named and sequenced into the roadmap or explicitly deferred.

---

### J3 — Trust and legitimacy verification

> "When I care about where my food comes from, I want to verify that a producer I've
> heard of is legitimate and has good reviews, so I can buy with confidence."

**Fit: PARTIAL**

V2 Bronze introduces a **verified badge** and a shop page with logo, hero photo, and
product catalogue. This directly addresses legitimacy verification for listings where
the owner has claimed and verified their profile. The enquiry form allows a consumer
to contact the producer directly.

**Gap 1: Unverified listings.** V1 launches with 953 seeded listings, not all of which
will have been claimed. An unclaimed listing has no photos, no product information, and
no verified badge. A consumer trying to verify a specific producer may land on a
low-quality stub listing that undermines confidence rather than building it.

**Gap 2: No reviews.** The verification job explicitly asks for "good reviews" — the
solution supplies only operator-controlled content (logo, photos, description). A
verified badge confirms the owner has claimed the listing; it does not confirm quality
from an independent source.

**Gap 3: Product provenance detail.** "Where my food comes from" implies supply chain
transparency (own-grown vs. resold, free-range, organic certification). None of the
tiers specify structured provenance fields. A product catalogue entry does not
necessarily communicate provenance.

---

### J4 — Online ordering from a favourite shop

> "When I discover a farm shop I love, I want to order from them online for delivery,
> so I don't have to drive there every time."

**Fit: MISSING in V1/V2 — STRONG in V3 Silver**

This job is explicitly and completely deferred to Version 3 (Silver tier). Online
ordering, delivery zone configuration, order management, stock management, and Stripe
Connect are all V3 features. The free directory and Bronze tier are delivery-free by
design.

**This is intentional sequencing, not an architectural gap.** The V1→V2→V3 progression
is a deliberate build-up of value: attract audience first (V1), give shops a presence
(V2), enable commerce (V3). However, the consumer who discovers a shop via the map in
V1 and wants to order online has nowhere to go until V3 is live. This creates a window
— potentially 12+ months post-launch — during which the directory surfaces demand that
it cannot fulfil. The risk is that the consumer turns to the shop's direct website,
Google, or a competitor for ordering.

**Critical V1 gap to name explicitly:** No "notify me when online ordering is available"
or waitlist mechanism exists in the spec. Capturing that demand at V1 would materially
improve V3 conversion.

---

### J5 — Capture passing trade without advertising spend

> "When I rely on passing trade, I want people who are already driving past to know I
> exist, so I get more walk-in customers without spending on advertising."

**Fit: STRONG**

This is the core value proposition of the V1 Free tier and the job it is most directly
designed to serve. The free, permanent directory listing means a farm shop owner pays
nothing to be discoverable by passing consumers. The mobile-first map experience
specifically targets consumers who are already in the area. The 953-listing seed dataset
means the directory has immediate density at launch, so even an unclaimed listing serves
this job for the shop owner.

**No significant gap.** The free listing is permanent (confirmed decision), which removes
the risk of this job being paywalled away.

---

### J6 — Retain remote regular customers via online sales

> "When I have regular customers who've moved away, I want to sell online for delivery,
> so I don't lose their business."

**Fit: MISSING in V1/V2 — STRONG in V3 Silver**

Same sequencing situation as J4. This job is fully addressed by V3 Silver (online
ordering, delivery zones, Stripe Connect) but is entirely absent from V1 and V2.

**Important distinction from J4:** J6 is a farm shop owner job, not a consumer job.
A shop owner who discovers Farmmap at V1 and whose primary need is to sell online will
not convert to a paying customer until V3 is available. Bronze at £20/month offers them
a branded page and enquiry form but no transactional capability.

**V1/V2 partial mitigation:** Bronze's enquiry form (V2) could theoretically support
informal order-by-email, but this is not a structured solution and will not satisfy
an owner looking for a professional online shop experience.

---

### J7 — Outsourced marketing for a time-poor farmer

> "When I'm too busy running the farm to do marketing, I want someone to do it for me
> affordably, so I can focus on farming."

**Fit: PARTIAL**

The Gold tier (£100/month + 5% commission) explicitly bundles Farmmap's marketing
service: monthly newsletter feature, weekly social posts, homepage placement, blog
post, and priority search ranking. This directly addresses the "do it for me" job.

**Gap 1: Gold tier is V3+.** Gold is positioned after Silver in the tier hierarchy.
A farm shop owner with J7 as their primary job must first acquire a Silver subscription
before being eligible for Gold (and the intake notes a possible 3+ months Silver
gating criterion). A time-poor farmer who simply wants affordable marketing cannot
go straight to Gold at launch.

**Gap 2: Bronze add-ons are opt-in, not done-for-you.** V2 Bronze offers newsletter
and social features as paid add-ons at £50/campaign, but these appear to be
self-serve tools rather than a managed service. The "done for me" element only arrives
at Gold.

**Gap 3: Affordability is not yet validated.** £100/month is the Gold price. Whether
this is "affordable" relative to a farm shop's typical marketing budget is an
assumption that requires validation (competitor pricing benchmarking is needed).

---

### J8 — Showcase stock to reduce lost sales to supermarkets

> "When a customer can't find something specific, I want to show what I stock and
> when, so I lose fewer customers to supermarkets."

**Fit: PARTIAL**

V2 Bronze includes a **product catalogue (display only, not purchasable)**, which
directly addresses the need to show what is stocked. V3 Silver adds stock management
with up to 500 products, and Gold allows up to 1,000 products.

**Gap 1: Display-only catalogue in V2 requires human enquiry.** A consumer browsing
the Bronze shop page can see what is stocked but must use the enquiry form to check
availability. There is no real-time stock status (in stock / out of stock / seasonal)
in V2. A "shows what I stock" is not the same as "shows when I have it."

**Gap 2: No seasonal or availability signals in V1 or V2.** The intake does not
specify product availability dates, seasonal flags, or "available now" indicators
at any tier below Silver. A customer looking for strawberries in May needs to know
they are in season now, not just that the shop sells them.

**Gap 3: Honesty boxes have no stock catalogue.** Honesty boxes are a first-class
listing type, but there is no mention of product information for honesty box listings
in any tier. An honesty box typically has a limited and rotating selection; a simple
"what's out today" field would address this job for that listing type.

---

### J9 — Portfolio replication without rebuilding technology

> "When the founder has proven the directory model with Farmmap, they want to replicate
> it to adjacent verticals without rebuilding the technology, so they can scale the
> portfolio efficiently."

**Fit: STRONG**

The multi-tenant architecture is a confirmed day-one design decision. Every database
table is scoped to a `directory_id`. The intake explicitly names six adjacent verticals:
TractorMap, BerthMap, CampingMap, ForecourtMap, FishMap, BrewMap. Each is described
as "a configuration file, a domain name, and a seed dataset once the engine is built."

This is a strong architectural fit for J9. The solution is not just designed to support
this job — it is structurally organised around it from the data model up.

**Residual risk:** The "configuration file + domain + seed data" promise is a
simplification. Each vertical may require custom listing fields (e.g., FishMap needs
tidal access times; BerthMap needs berth dimensions). A rigid schema will create
friction. The architecture phase should validate that the listing schema supports
per-directory custom fields without table proliferation.

---

## Scope Creep Signals (Features Without a Clear Job)

The following features from the intake do not map cleanly to any of the nine stated jobs.
They may be justified, but each requires a job-level rationale before build.

| Feature | Tier | Concern |
|---|---|---|
| Performance dashboard for shop owners | V2 Bronze | No stated job references analytics. Owners may want this, but it is not in the J5–J8 set. Low risk — likely a retention feature — but should be validated. |
| Reverse image search for product photo moderation | Open item | No job states a need for photo authenticity. This is an internal trust/fraud concern. Valid operationally but not a JTBD. Should be scoped as a platform/compliance feature, not a customer-facing one. |
| Republic of Ireland delivery deferral | V3 scoping | Not a feature — a scope boundary. Named here because J4 and J6 for Irish customers (190 honesty boxes + 37 farm shops in the seed data) are unaddressed until this is lifted. The RoI consumer base is significant given the seed data composition. |
| Admin vs moderator role split | Open item | Internal operational concern. No JTBD surfaces this. Valid governance need but not a customer value driver. |
| Gold gating criteria (3+ months Silver + 50+ orders) | Open item | Artificially delays J7 fulfilment. Needs a business rationale; it is not derived from any job. If the gate is to protect marketing service quality, that is a valid constraint but should be stated explicitly. |

---

## Critical V1 Jobs Not Addressed

The following jobs are absent or materially incomplete in the V1 Free tier. These are
the honest gaps in the launch scope.

| Job | Status at V1 | Notes |
|---|---|---|
| J2 — Planning (reviews/ratings) | Gap | No review mechanism at any version. Planning use case depends on trust signals Farmmap does not own. |
| J3 — Trust verification (reviews + provenance) | Gap | Verified badge helps; reviews and provenance fields are absent in all versions. |
| J4 — Online ordering | Deferred to V3 | Intentional sequencing. Demand is surfaced at V1 but cannot be fulfilled for 12+ months. |
| J6 — Online sales for shop owners | Deferred to V3 | Same as J4. Bronze tier holds paying shop owners without their primary job served. |
| J8 — Availability signals | Partial | Display-only catalogue in V2 does not show real-time availability or seasonal status. |

---

## Summary Assessment

```yaml
overall-fit: partial
jobs-mapped: 9
jobs-with-strong-fit: 4
jobs-with-partial-fit: 4
jobs-missing: 1
critical-v1-gaps:
  - reviews-and-ratings-absent-across-all-versions
  - consumer-ordering-deferred-to-v3-with-no-demand-capture-mechanism
  - online-sales-for-shop-owners-deferred-to-v3
  - stock-availability-signals-absent-in-v1-and-v2
  - product-provenance-fields-unspecified-at-any-tier
  - roi-consumer-ordering-deferred-indefinitely
```

### Fit ratings by job

| Job | Fit | Primary reason |
|---|---|---|
| J1 — Impulse discovery | STRONG | Map-first, mobile-first, no login, honesty boxes as first-class type |
| J2 — Pre-trip planning | PARTIAL | Map and filters present; reviews/ratings absent |
| J3 — Trust verification | PARTIAL | Verified badge and shop page help; no reviews, no provenance fields |
| J4 — Online ordering (consumer) | MISSING (V1/V2) | Intentionally deferred to V3; no demand-capture bridge |
| J5 — Capture passing trade | STRONG | Core value proposition of free permanent listing |
| J6 — Online sales (shop owner) | MISSING (V1/V2) | Intentionally deferred to V3; Bronze holds paying owners without primary job served |
| J7 — Outsourced marketing | PARTIAL | Gold fully addresses it; Gold is gated behind Silver and a possible 3-month qualifying period |
| J8 — Showcase stock | PARTIAL | Display catalogue (V2) lacks real-time availability and seasonal signals |
| J9 — Portfolio replication | STRONG | Multi-tenant from day one; six verticals named; architecture is built around this job |

### Analyst recommendation

The V1 launch scope is sound for its stated goal: traffic and domain authority. It
strongly serves J1, J5, and J9 — the jobs that underpin the growth flywheel. The
partial fits on J2, J3, J7, and J8 are acceptable at V1 given sequenced delivery.

The two critical sequencing risks are:

1. **J4/J6 demand leakage:** The directory surfaces consumer and owner demand for
   online ordering at V1 but cannot convert it until V3. Without a demand-capture
   mechanism (waitlist, "coming soon" sign-up, or early-access programme), this
   audience may route to competitors before V3 is live. A waitlist feature should
   be added to V1 or as an early V2 increment.

2. **No review layer:** J2 and J3 both depend on social proof that Farmmap does not
   own. The product is permanently exposed to Google Maps and TripAdvisor for the
   trust layer, which creates a dependency on external platforms that could degrade
   or deprioritise farm shop content. A lightweight review system — even star ratings
   with moderation — should be roadmapped for V2 or V3.

These are recommendations for the founder to consider, not blockers to V1 launch.

---

*Produced by: problem-solution-fit-analyst | squad: discovery-and-validation*
*Authority: specs/003-farmmap/intake.md | spec_id: 003-farmmap*
