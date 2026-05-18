---
feature: 003-farmmap
phase: 3
document: jtbd-map
squad: personas-and-requirements
produced_by: personas-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/personas-pack/personas.md + specs/003-farmmap/discovery-pack/problem-solution-fit.md
format: christensen-jtbd
---

# Farmmap — Job-to-be-Done Map

All nine jobs are written in strict Christensen format:
**When** [situation], **I want to** [motivation], **so I can** [expected outcome].

Each job is classified by primary persona, version availability, and its fit rating
from the problem-solution-fit analysis.

---

## Consumer Jobs

---

### J1 — Impulse Discovery While Driving

> When I am driving through a rural area without planning ahead, I want to see if
> there are any farm shops or honesty boxes nearby, so I can buy fresh local produce
> on impulse without going out of my way.

| Field | Value |
|---|---|
| Primary persona | P1 — Sarah Whitfield |
| Secondary personas | P2 — Marcus Okafor (cycling equivalent) |
| Version served | V1 — Free Directory |
| PSF fit rating | STRONG |
| Features serving this job | F1 (Interactive map), F2 (Listing detail), F12 (Honesty box listing type) |

**What strong fit means for this job:** The product is explicitly map-first,
mobile-first, and requires no login to browse. Honesty boxes are a first-class listing
type — the specific gap in every competing product. The 953-listing launch dataset means
the map is immediately useful in most rural UK regions.

**Residual risk:** Map performance on 4G in rural areas is untested at launch. A map
that takes 8 seconds to load on the A1 in Lincolnshire does not serve this job. The
performance budget — map with 953 pins loading within 3 seconds on a 4G connection —
must be treated as a non-negotiable acceptance criterion, not an aspiration.

---

### J2 — Pre-Trip Research and Planning

> When I am planning a weekend trip to the countryside, I want to browse all the farm
> shops and honesty boxes in that area with photos and product types visible, so I can
> plan which ones to visit and what I am likely to find.

| Field | Value |
|---|---|
| Primary persona | P1 — Sarah Whitfield, P2 — Marcus Okafor |
| Version served | V1 (basic), V2 Bronze (full — photos, catalogue) |
| PSF fit rating | PARTIAL at V1 → STRONG at V2 |
| Features serving this job | F1 (map), F2 (listing detail), F5 (reviews — added to spec), F13 (product catalogue), F15 (RoI support) |

**What partial fit means for this job:** The map and filters satisfy the "where" part
of this job at V1. The "is it worth visiting" part requires photos (available only on
claimed listings), a product catalogue (Bronze tier only), and ideally reviews. A
listing with no photos and no product information does not serve this job — it serves
J1 (you know it exists) but does not answer "is it worth the detour?"

**Gap addressed in this spec:** The reviews and ratings feature (F5) has been added to
this specification based on the viability-gate condition and PSF analysis recommendation.
Without F5, J2 remains permanently partial — consumers will depend on Google Maps and
TripAdvisor for the trust layer, creating a structural external dependency for the
product's most important planning use case.

**Gap addressed in this spec:** The ordering waitlist / demand capture feature (F6) has
been added to prevent ordering-intent demand from leaking away during the 12+ months
before V3 is live.

---

### J3 — Trust and Provenance Verification

> When I hear about a farm shop from a friend or see it mentioned online, I want to
> read verified reviews and see clear provenance information, so I can decide whether
> it is worth visiting and buy with confidence.

| Field | Value |
|---|---|
| Primary persona | P1 — Sarah Whitfield, P2 — Marcus Okafor |
| Version served | V2 Bronze (verified badge, photos, catalogue), V2+ (reviews once F5 is live) |
| PSF fit rating | PARTIAL at V1, approaching STRONG at V2 with F5 |
| Features serving this job | F2 (listing detail), F3 (free listing claim), F5 (reviews — added), F7 (Bronze verified badge), F13 (product catalogue with provenance fields) |

**What partial fit means for this job:** The verified badge (Bronze) confirms ownership
and active management. Photos and a product catalogue provide the substance a consumer
wants. Reviews are the missing element: a "verified" badge tells you the owner is
engaged, not that the produce is excellent. Until F5 is live, a consumer trying to
verify quality independently has no Farmmap-native source.

**Provenance detail note:** "Where my food comes from" implies structured provenance
fields (own-grown vs. resold, organic certification, free-range status). These are
not in scope for v1 but should be captured as a product catalogue enhancement for
v2 — the J3 job will remain partially served until provenance fields are available
for display.

---

### J4 — Online Ordering from a Favourite Shop (V3 — Deferred)

> When I have discovered a farm shop I love that is too far to visit regularly, I want
> to order their products online for delivery to my home, so I can keep buying from
> them after I move or during busy periods.

| Field | Value |
|---|---|
| Primary persona | P2 — Marcus Okafor |
| Secondary personas | P1 — Sarah Whitfield (occasional) |
| Version served | V3 — Silver tier (deferred) |
| PSF fit rating | MISSING in V1/V2 — STRONG in V3 |
| Features serving this job | F8 (Silver marketplace), F18 (delivery configuration), F19 (order management), F6 (demand capture bridge at V1/V2) |

**Intentional sequencing:** This job is fully deferred to V3 Silver. The sequencing
decision is correct: consumer traffic must be established before a marketplace has
demand; farm shop owners must trust the platform before committing to fulfilment
operations. V3 is the correct vehicle for this job.

**V1/V2 bridge (F6):** The ordering waitlist feature added to this spec is the
demand-capture bridge that prevents J4 intent from leaking away. Consumers who arrive
with ordering intent at V1/V2 can register interest; they will be notified when Silver
is live for the specific listing. This converts a missed job into a future conversion
pipeline.

**Republic of Ireland note:** Online ordering for ROI listings is deferred beyond V3.
ROI consumers who complete J4 intent registration will wait longer than UK consumers
for fulfilment capability. This is named and accepted; it is not hidden.

---

## Farm Shop and Listing Owner Jobs

---

### J5 — Capture Passing Trade Without Advertising Spend

> When a customer drives past my farm but does not know I have a shop, I want them
> to see my listing on their phone, so I can convert passing traffic into actual
> customers without spending on traditional advertising.

| Field | Value |
|---|---|
| Primary persona | P3 — Janet Hargreaves |
| Secondary personas | P4 — Tom Ashworth |
| Version served | V1 — Free Directory (free, permanent listing) |
| PSF fit rating | STRONG |
| Features serving this job | F1 (map — consumer side), F2 (listing detail), F3 (free listing claim), F4 (listing management), F7 (Bronze: verified badge, branded page) |

**What strong fit means for this job:** The free permanent listing is the entire value
proposition for this job. A farm shop owner who claims their listing pays nothing and
gains discoverability to every consumer using the map in their area. The 953 seeded
listings mean Janet's shop is findable from day one — even before she knows Farmmap
exists.

**No significant gap.** The free tier is confirmed permanent. The listing claim is
free. The only residual risk is that seeded listing data is stale (wrong phone number,
closed shop, incorrect postcode) — which is a data quality problem, not a product
gap.

---

### J6 — Retain Remote Regular Customers via Online Sales (V3 — Deferred)

> When a loyal customer has moved away from the area, I want to sell my produce to
> them online for delivery, so I do not lose their business purely because of geography.

| Field | Value |
|---|---|
| Primary persona | P4 — Tom Ashworth |
| Secondary personas | P3 — Janet Hargreaves (less immediate; would need to be guided through setup) |
| Version served | V3 — Silver tier (deferred) |
| PSF fit rating | MISSING in V1/V2 — STRONG in V3 |
| Features serving this job | F8 (Silver marketplace), F13 (product catalogue — purchasable at Silver), F18 (delivery zones), F19 (order management) |

**Intentional sequencing:** Same structural situation as J4 — this job is a V3
delivery. Bronze tier partially addresses this through the enquiry form (F21), which
allows informal order-by-message, but that is not a structured fulfilment solution
and will not satisfy Tom Ashworth.

**Tension point:** A farm shop owner whose primary need is J6 pays Bronze at £20/month
during the V1→V3 period without their core job being served. The Bronze analytics
dashboard (showing Farmmap is driving enquiries and consumer interest) is the value
delivery during this waiting period. The onboarding flow must set expectations clearly:
"Bronze gives you visibility now; Silver adds ordering when it launches."

---

### J7 — Outsourced Marketing for a Time-Poor Farmer

> When I am too busy farming to do my own marketing, I want a platform that features
> my shop to new customers on my behalf, so I can grow my customer base without hiring
> a marketing person.

| Field | Value |
|---|---|
| Primary persona | P3 — Janet Hargreaves |
| Secondary personas | P4 — Tom Ashworth (as a "top up" to his own marketing) |
| Version served | V3 — Gold tier (fully), V2 Bronze (partially via campaign add-ons) |
| PSF fit rating | PARTIAL at V2 Bronze (add-ons available but self-initiated), STRONG at Gold |
| Features serving this job | F7 (Bronze: verified badge, branded page), F9 (Gold: marketing service bundle), F23 (newsletter/social add-ons) |

**Gap acknowledged:** Gold tier is V3+ and requires the shop to be on Silver first.
A farm shop owner whose primary job is J7 cannot access the "done for me" service
without going through Bronze → Silver → Gold. The Gold gating criteria (open to any
Silver subscriber, per the open question recommendation in this spec) should minimise
the delay, but the sequencing means J7 is partially served for 18+ months post-launch.

**Bronze add-ons as a bridge:** Campaign add-ons at Bronze (£50/campaign, done-for-you)
partially serve J7 by offering opt-in managed marketing without requiring Silver.
These are pull decisions by the owner, not the automatic monthly inclusion Gold provides.

---

### J8 — Showcase Stock to Reduce Lost Sales to Supermarkets

> When a customer comes to my shop and does not find what they wanted, I want my full
> product catalogue visible online with seasonal availability signals, so I reduce
> wasted journeys and lose fewer customers to supermarkets.

| Field | Value |
|---|---|
| Primary persona | P4 — Tom Ashworth |
| Secondary personas | P3 — Janet Hargreaves (aspirational — she would need help setting it up) |
| Version served | V2 Bronze (display catalogue), V3 Silver/Gold (purchasable, stock management) |
| PSF fit rating | PARTIAL at V2 — STRONG at V3 |
| Features serving this job | F13 (product catalogue), F20 (stock management — Should-Have at v1), F4 (listing management including "currently stocked" toggle) |

**Gaps acknowledged:**

1. **Display-only catalogue at Bronze has no real-time availability.** A customer can
   see what the shop sells but not whether it is in stock today. The "currently stocked"
   toggle on honesty box listings (F12) is the closest v1 equivalent; farm shops need a
   per-product availability flag in v2.

2. **Seasonal availability signals are partially addressed.** The product catalogue spec
   (F13) includes a "usually available [month range]" field at all paid tiers. This
   addresses the "is it the right season?" question but not the "is it in stock now?"
   question.

3. **No honesty box stock catalogue at v1.** Honesty box listings have a "currently
   stocked" toggle (F12) but no product-level catalogue. A more detailed "what's out
   today" capability is a v2 enhancement.

---

## Portfolio Job

---

### J9 — Portfolio Replication Without Rebuilding Technology

> When I have proved the Farmmap model, I want to replicate the same engine for
> TractorMap, BerthMap, and CampingMap, so I can grow the portfolio without rebuilding
> the technology each time.

| Field | Value |
|---|---|
| Primary persona | Internal (founder / P5 — Alex Kim) |
| Version served | Architecture from day one (F14 — multi-tenant directory engine) |
| PSF fit rating | STRONG |
| Features serving this job | F14 (multi-tenant directory engine — every record scoped to directory_id) |
| Gate condition | 100 Bronze subscribers before engine-generalisation investment begins (per viability-gate.md) |

**What strong fit means for this job:** Multi-tenancy is a confirmed day-one design
principle. Every database record carries a `directory_id`. Host-based directory
detection means a second vertical is a domain configuration, not a new codebase.
Listing types, product categories, and filter options are configurable per directory.

**Staged investment gate:** Per the viability-gate.md condition, the multi-tenant
engine is built from day one but the generalisation work (second vertical launch) is
gated on 100 Bronze Farmmap subscribers. This is the correct sequencing discipline:
the architecture supports J9 but the capital commitment to build additional verticals
is deferred until Farmmap proves unit economics.

**Per-directory custom fields risk:** Each vertical may require custom listing schema
fields (e.g., BerthMap needs berth dimensions; FishMap needs tidal access times).
The architecture phase must validate that per-directory custom fields can be added
without schema migration risk for existing directories. This is a residual J9 risk
not resolved by the multi-tenant design alone.

---

## Job Coverage Matrix

| Job | Consumer/Owner/Internal | V1 | V2 Bronze | V3 Silver | V3 Gold |
|---|---|---|---|---|---|
| J1 — Impulse discovery | Consumer | STRONG | STRONG | STRONG | STRONG |
| J2 — Pre-trip planning | Consumer | PARTIAL | STRONG | STRONG | STRONG |
| J3 — Trust verification | Consumer | PARTIAL | STRONG | STRONG | STRONG |
| J4 — Online ordering | Consumer | MISSING (F6 bridge) | MISSING (F6 bridge) | STRONG | STRONG |
| J5 — Capture passing trade | Owner | STRONG | STRONG | STRONG | STRONG |
| J6 — Online sales for owner | Owner | MISSING | MISSING | STRONG | STRONG |
| J7 — Outsourced marketing | Owner | MISSING | PARTIAL (add-ons) | PARTIAL | STRONG |
| J8 — Showcase stock | Owner | PARTIAL | PARTIAL | STRONG | STRONG |
| J9 — Portfolio replication | Internal | STRONG (architecture) | — | — | — |

---

## Jobs Not Served (Explicitly Out of Scope)

The following jobs were identified during analysis but are outside the Farmmap product
scope. They are named here to prevent scope creep by making the boundary explicit.

**Agricultural equipment discovery** — finding farm machinery for sale or hire in a
rural area. This is TractorMap's job, not Farmmap's. The multi-tenant engine supports
it; Farmmap should not serve it.

**Restaurant reservation and table booking** — this is a separate market with
established players (OpenTable, Resy). Farm shops that also run cafés or farm-to-table
experiences may request this; it is not in scope for v1–v3.

**Crop yield forecasting and farm business analytics** — several farm shop owners may
use Farmmap's analytics dashboard for business intelligence beyond listing performance.
The dashboard should show listing-specific data only; it is not a farm management tool.

**B2B wholesale discovery** — the cooperative use case (P6) surfaces demand for a
B2B wholesale channel (restaurants buying direct from farms). This is a distinct
product and job set. Farmmap is a consumer discovery and direct-retail platform; B2B
wholesale is out of scope.

---

*Produced by: personas-squad-lead | squad: personas-and-requirements*
*Authority: specs/003-farmmap/personas-pack/personas.md + problem-solution-fit.md*
*Feeds: specs/003-farmmap/spec.md*
