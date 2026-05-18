---
feature: 003-farmmap
phase: 2.5
document: swot-analysis
squad: market-research
agent: swot-analyst
produced_at: 2026-05-16T00:00:00Z
authority: >
  specs/003-farmmap/discovery-pack/problem-solution-fit.md,
  specs/003-farmmap/discovery-pack/value-bench.md,
  specs/003-farmmap/discovery-pack/saleability-critique.md,
  specs/003-farmmap/discovery-pack/value-thesis.md,
  specs/003-farmmap/discovery-pack/alternatives-considered.md,
  specs/003-farmmap/discovery-pack/discovery-decision.md,
  specs/003-farmmap/intake.md
---

# Farmmap — SWOT Analysis

## Methodology

All items in this matrix are derived from prior evidence-pack findings. Every item
carries a citation to the source file. Strengths and Weaknesses are **internal** to
Farmmap and its founder. Opportunities and Threats are **external** — from the market
landscape, regulatory environment, competitive dynamics, and macro trends evidenced
in the discovery pack.

The strategic synthesis section converts the raw matrix into four SO strategies
(deploy Strengths to capture Opportunities) and four WT mitigations (shore up
Weaknesses against incoming Threats).

---

## Strengths (Internal)

### S1 — 953 seeded listings: no cold-start problem for consumer map density

At launch, the product opens with 953 verified listings across all five nations,
covering farm shops and honesty boxes as first-class listing types. 87% carry a
postcode or Eircode. From a consumer perspective the map is populated on day one —
there are pins to click in every county. No competitor is launching against an empty
map.

**Caveat from evidence:** The Saleability Critique (saleability-critique.md §3)
distinguishes between map density (solved by seeding) and active listing quality
(not solved by seeding). Consumer satisfaction depends on claimed, owner-managed
listings with photos. This distinction matters for tracking: the strength is map
density at launch, not supply-side engagement at launch.

**Source:** intake.md — listing counts; saleability-critique.md §3 — density vs
engagement distinction.

---

### S2 — farmmap.co.uk domain ownership: durable SEO asset

The product owns farmmap.co.uk and the farmstor.com and farmstor.co.uk redirects.
The primary domain is an exact-match domain for the most likely consumer search
query: "farm map." Organic search rankings for discovery queries ("farm shop near
me," "farm shops UK") will compound over time as the domain ages and accumulates
backlinks. No competitor can acquire this domain.

**Source:** intake.md §1 — domain ownership confirmed.

---

### S3 — Multi-tenant architecture: low incremental cost per additional vertical

Every database table is scoped to a `directory_id` from day one. The architecture
decision means that once Farmmap's engine is proven and the Bronze conversion milestone
is met, adding TractorMap, BerthMap, CampingMap, ForecourtMap, FishMap, and BrewMap
requires an estimated £15,000–25,000 each (data acquisition, domain, design
customisation) rather than a full rebuild. Infrastructure costs do not scale with
vertical count at expected load on Vercel and Supabase pricing.

**Source:** intake.md — multi-tenant architecture decision; value-bench.md §5 —
£15k–25k incremental cost per vertical; value-thesis.md — portfolio multiplier
narrative.

---

### S4 — yourhonestybox.com data import: strong Irish and NI coverage at launch

The 336 honesty box listings from Ireland and Northern Ireland give Farmmap immediate
and differentiated coverage in a territory no UK competitor has prioritised. No
equivalent product maps Irish and NI honesty boxes at this density. This provides
a genuine competitive moat in the Irish market IF the legal position is resolved.

**Caveat from evidence:** This strength is conditional. The Saleability Critique
(saleability-critique.md §4) and discovery decision (discovery-decision.md conditions)
both flag that these 336 listings carry database rights exposure under the EU Database
Directive and UK sui generis database right. The strength only holds if explicit
permission is obtained, the listings are replaced with independently sourced data, or
the Irish seed set is launched without the yourhonestybox.com subset.

**Source:** intake.md — 336 yourhonestybox.com listings; saleability-critique.md §4;
discovery-decision.md — yourhonestybox-database-rights condition.

---

### S5 — Free tier permanent: removes price barrier for initial farm shop adoption

The decision to make the free directory listing permanent means a farm shop owner
can claim their pin at zero cost and zero risk. There is no trial period, no credit
card required, no free-tier expiry. For a demographic that has been burned by
directories that charged fees before delivering value, permanent free is a meaningful
trust signal. It removes the single most common objection to claiming a listing.

**Source:** intake.md — "Free directory tier is permanent" confirmed decision;
saleability-critique.md §1 — "we've heard this from directories before" objection
context.

---

### S6 — Map-first, mobile-first design: matches the primary consumer use case

The J1 (impulse discovery while driving) use case is the core consumer job Farmmap
is designed for, and the product's architecture — MapLibre GL JS on OpenStreetMap
tiles, no login required, mobile-first — is precisely aligned to it. Problem-Solution
Fit rates J1 as STRONG. The product does not force consumers through a search bar and
a list of results; it puts them on the map. This is a genuine UX differentiation from
BigBarn and other legacy directories.

**Source:** problem-solution-fit.md §J1 — STRONG rating; intake.md — confirmed tech
decisions; saleability-critique.md §5 — BigBarn UX weakness identified.

---

### S7 — Stripe Connect Standard: correct legal structure for marketplace liability

The decision to use Stripe Connect Standard makes the shop the merchant of record
for all Silver/Gold tier transactions. This correctly avoids FCA regulation exposure
for Farmmap and places payment liability with the party that controls the goods and
the customer relationship. This is a structurally sound decision that removes a
regulatory risk that a less well-designed marketplace would face.

**Source:** intake.md — "Stripe Connect Standard — shop is always merchant of record
(avoids FCA regulation)" confirmed decision; saleability-critique.md §6 — food safety
and liability context.

---

### S8 — Honesty boxes as a first-class listing type: genuine market differentiation

No other UK-wide directory treats honesty boxes as a first-class listing type
alongside farm shops. This is a meaningful differentiation: honesty boxes are a
growing phenomenon in post-COVID local food culture, particularly in rural Ireland,
NI, and parts of England. Farmmap's coverage of 263 Irish and NI honesty boxes at
launch is a territorial moat that no competitor currently occupies.

**Source:** intake.md — listing types; problem-solution-fit.md §J1 — honesty boxes
as first-class type; saleability-critique.md §4 — yourhonestybox.com competitive
context.

---

## Weaknesses (Internal)

### W1 — No reviews or ratings system: permanent dependency on Google for trust layer

The product specification includes no consumer review or ratings feature at any
version. Both J2 (pre-trip planning) and J3 (trust verification) require social proof
that Farmmap does not own. A consumer planning a trip or verifying a shop's quality
is permanently routed to Google Maps or TripAdvisor for the layer of evidence that
decides whether the trip is worth making. This is a structural vulnerability: Google
could degrade, deprioritise, or monetise farm shop content at any time.

The PSF analysis rates J2 and J3 as PARTIAL precisely because of this gap. The
discovery decision carries it as a named condition for V2 design.

**Source:** problem-solution-fit.md §J2, §J3; discovery-decision.md —
reviews-layer condition.

---

### W2 — Demand leakage: ordering intent surfaced at V1 with no fulfilment or capture

The directory will generate consumer ordering intent (J4) and farm shop owner
online-selling intent (J6) from day one. Version 3 (Silver tier) — where online
ordering is fulfilled — is at minimum 12 months from launch. Without a waitlist or
"notify me when ordering is available" mechanism at V1, every consumer who arrives
wanting to order, and every shop owner wanting to sell online, leaves without a
retention hook. This demand routes to the shop's own website, a competitor, or
nowhere.

The PSF analysis rates J4 and J6 as MISSING at V1/V2. The discovery decision
carries demand-capture as a named condition.

**Source:** problem-solution-fit.md §J4, §J6; discovery-decision.md —
demand-capture-at-v1 condition.

---

### W3 — Standalone Y3 revenue ~£164k: insufficient for a founding team without portfolio execution

The base-case Year 3 revenue for Farmmap alone is approximately £164,000. ValueBench's
own verdict on standalone viability is "marginal — it works as a lifestyle/micro-SaaS
business but not as a venture-scale investment." A founding team building full-time
cannot be supported on this revenue in Years 1–2. This creates a financial pressure
on the business that either requires the founder to bootstrap personally, raise external
capital, or accelerate the portfolio engine investment — all of which carry their
own risks.

**Source:** value-bench.md §7 — "marginal" standalone verdict; value-thesis.md —
standalone constraint narrative; discovery-decision.md — executive summary revision
notes.

---

### W4 — Farm shop owner acquisition is hard and expensive

The target supply-side customer is a rural owner-operator aged 50–70 with low digital
sophistication, who has been pitched by Yell, Yelp, BigBarn, the FRA directory, and
multiple "buy local" campaigns. The Saleability Critique estimates a realistic CAC
of £120–£250 per paying Bronze shop when field sales are included, and a free-to-paid
conversion rate of 4–8%. Cold email has sub-5% open rates with this demographic.
Cold calls reach the owner approximately 1 in 4 attempts. Personal visits convert at
20–30% but cost £80–£150 each.

**Source:** saleability-critique.md §1 — acquisition cost estimates; §2 — conversion
chasm analysis; discovery-decision.md — saleability challenges narrative.

---

### W5 — Free-to-paid conversion chasm: the attribution gap

Shop owners who upgrade to Bronze (£20/month) will see visitor numbers on their
dashboard but cannot trace a page view to a till receipt without a coupon, booking,
or conversion mechanism. The Saleability Critique identifies this attribution gap as
a harder problem than the fee objection: it cannot be solved with better marketing
copy; it requires a product change. Without attribution evidence, the Bronze value
proposition depends on faith rather than data — and farm shop owners are sceptical
buyers who have experienced directories that promised traffic and delivered none.

**Source:** saleability-critique.md §2 — Objection 2 analysis.

---

### W6 — yourhonestybox.com data copyright risk: 336 Irish listings potentially compromised

The 336 honesty box listings sourced from yourhonestybox.com for the Irish and NI seed
dataset may attract a database rights claim under the EU Database Directive (operative
in Ireland) and the UK sui generis database right. The saleability risk is a
cease-and-desist that strips the entire Irish seed set before or shortly after launch,
destroying Farmmap's territorial differentiation in its most distinctive market at
the worst possible moment.

**Source:** saleability-critique.md §4; discovery-decision.md — yourhonestybox-database-
rights condition (flagged as pre-launch blocker).

---

### W7 — Multi-tenant engine investment premature before Farmmap unit economics proven

The intake specifies multi-tenant architecture from day one. The Saleability Critique
identifies this as a capital allocation risk: building a generic engine before the
first vertical has proven Bronze conversion means the engine is a sunk cost if Farmmap
fails. Engine complexity adds build time, increases the bug surface area, and diverts
focus from the specific Farmmap acquisition problem. The discovery decision addresses
this with a gate condition: 100 Bronze subscribers before engine generalisation work
begins. The weakness remains live until that gate is passed.

**Source:** saleability-critique.md — Critical Finding section; discovery-decision.md
— poc-before-multi-tenant-engine condition.

---

### W8 — No FRA relationship at launch: reliance on a trade body that is also a competitor

The Farm Retail Association runs its own member directory. Farmmap has used FRA
listing data as part of its seed set, but there is no confirmed data-sharing, co-branding,
or endorsement arrangement with the FRA. The hardest sales objection — "we've heard
this from directories before" — is most effectively countered by FRA association.
Without it, every cold outreach to an FRA member shop must overcome the implicit
question: "Why not just use the FRA directory?"

**Source:** saleability-critique.md §5; alternatives-considered.md — FRA white-label
assessment; discovery-decision.md — fra-relationship condition.

---

## Opportunities (External)

### O1 — "Know your farmer" / food provenance trend accelerating post-COVID

Consumer demand for local, traceable, and ethically produced food has structurally
accelerated since 2020. The FSA Food and You 2 Wave 7 (2024) confirms that 43% of
UK adults value locally produced food — a figure that has grown consistently over the
survey series. Farm shops are the primary beneficiary of this trend as the authentic
face of local food. Farmmap's consumer proposition — "find the farm shop near you" —
lands directly into this cultural moment. The trend creates organic search demand
that no marketing spend can buy.

**Source:** value-bench.md §1 — FSA data; value-thesis.md — discovery gap narrative.

---

### O2 — Cost of living crisis: farm shops positioned as value alternative for select categories

Counterintuitively, the cost of living pressure that began in 2022 has driven some
UK consumers toward farm shops for staple items (eggs, dairy, seasonal vegetables)
where the farm shop price is competitive with or cheaper than supermarket equivalents.
Farm shops report increased footfall for value-driven buyers alongside their traditional
quality-driven customers. Farmmap benefits from both consumer motivations appearing
in search and discovery behaviour.

**Source:** value-thesis.md — economic case narrative; saleability-critique.md §1 —
market timing context.

---

### O3 — yourhonestybox.com has no commercial model: partnership or acquisition is feasible

yourhonestybox.com is the leading honesty box directory for Ireland and NI. It has
demonstrated consumer traction, an assembled dataset of 190+ Irish listings, and a
clear brand in the honesty box niche. Its weakness is that it has no evident commercial
model — it is a passion project or non-profit operation without a subscription or
advertising revenue stream. This creates a genuine opportunity: approach
yourhonestybox.com for a partnership (data licence, co-branding, joint listing) or
ultimately an acquisition. Resolving the database rights question and the competitive
threat simultaneously through a deal is the highest-value outcome.

**Source:** saleability-critique.md §4; value-bench.md §1 — yourhonestybox.com traction
reference; discovery-decision.md — yourhonestybox-database-rights condition.

---

### O4 — FRA digital adoption gap: 66% of UK farm shops have no website

The FRA Digital Adoption Survey 2022 found that only 34% of UK farm shops have a
website of any kind, and fewer than 15% have any e-commerce capability. This means
approximately 2,310 UK farm shops have no meaningful web presence at all. These shops
are invisible online and cannot be discovered via Google. For them, a free Farmmap
listing is not a competing channel — it is their only channel. The Bronze tier (£20/month)
positions as their entire digital presence for less than a daily coffee. The addressable
market for Bronze among digitally absent shops is enormous relative to Farmmap's
current sales targets.

**Source:** value-bench.md §2 — FRA Digital Adoption Survey; value-thesis.md —
supply-side invisibility narrative.

---

### O5 — Post-Brexit ELM schemes incentivising farm diversification

England's Environmental Land Management (ELM) schemes and their equivalents in
Scotland (AECS), Wales (Sustainable Farming Scheme), and the Republic of Ireland
(ACRES) are incentivising farmers to diversify income away from direct production
subsidies toward agri-environment and diversification activities, including farm retail.
This policy environment is actively increasing the number of farm shops, farm gate
stalls, and honesty boxes being established. Farmmap's addressable listing universe
is growing, not contracting.

**Source:** value-bench.md §2 — total addressable listing universe growth inference;
intake.md — scope includes farm gate stalls and roadside produce stands.

---

### O6 — Multi-vertical portfolio: 6+ identified adjacencies with the same discovery-gap dynamic

The farm shop discovery gap is not unique to farm shops. Marinas (approximately 350
UK), campsites (~4,000), coarse fisheries (~4,000), craft breweries (~2,500), and
independent forecourts (~3,500) all share the same problem: they are locally-operated,
discovery-deficient businesses with no central digital presence. Each is a named
vertical in the portfolio plan. The portfolio Y5 base-case revenue of £2.2m at a 4.9×
multiplier over single-vertical represents an enterprise value of approximately £11m
at a 5× multiple.

**Source:** value-bench.md §5 — portfolio multiplier; value-thesis.md — portfolio
multiplier narrative; better-idea.md — VerticalKit option assessment.

---

### O7 — Organic SEO compounding from long-tail local search queries

The combination of the farmmap.co.uk exact-match domain, 953 unique location-tagged
listing pages (each a long-tail SEO asset: "farm shops in [county]", "honesty box
[village]"), and the growing consumer intent for local food discovery creates a
compounding SEO return that no paid-advertising competitor can easily replicate.
Each new claimed listing that generates photos, owner-written descriptions, and
consumer engagement is an additional indexed page. The SEO asset builds automatically
as the supply side engages.

**Source:** value-thesis.md — 100k visitor load-bearing assumption; discovery-decision.md
— 100k-visitor-resource-plan condition; intake.md — domain ownership.

---

### O8 — Regulatory tailwinds: food labelling and provenance rules increasing consumer vigilance

The UK's Natasha's Law (full ingredient and allergen labelling on pre-packed for direct
sale food, in force since October 2021) and ongoing FSA enforcement of online food
marketplace standards have increased consumer vigilance about food provenance and
labelling. This creates a tailwind for transparent, verified supply chains — exactly
the positioning Farmmap's verified badge and product catalogue features support at
V2/V3.

**Source:** saleability-critique.md §6 — Natasha's Law and allergen context;
intake.md — product catalogue feature; value-bench.md §1 — FSA survey data context.

---

## Threats (External)

### T1 — Google Maps could add a "farm shop" category filter at any time

Google Maps is the default discovery tool for the majority of UK mobile internet
users. If Google adds a "farm shop" category with enriched results, filter logic,
and opening hours from Google Business Profile, the primary discovery need Farmmap
serves is immediately commoditised. Google has the distribution, the data, the
consumer trust, and the technical capability to do this. There is no announcement
of this capability, but the threat is structurally permanent and requires no prior
warning.

**Source:** problem-solution-fit.md §J2, §J3 — dependency on Google for trust layer;
saleability-critique.md §2 — the "I'm already on Google" farm shop owner objection.

---

### T2 — yourhonestybox.com expansion to UK farm shops and honesty boxes

yourhonestybox.com is an actively maintained, consumer-trusted product in Ireland and
NI. It has 190+ Irish listings and a clear brand in the honesty box niche. Its rational
next move is UK expansion — particularly to a market it can address with its existing
brand, technology, and community. If yourhonestybox.com launches a UK product while
Farmmap is still in early growth, it arrives with incumbency advantages in honesty
box coverage and moral authority on Irish data. It also arrives with legitimate
grievance if Farmmap has used its data without permission.

**Source:** saleability-critique.md §4; discovery-decision.md — yourhonestybox.com
conditions.

---

### T3 — FRA could build or commission a modern map-first directory using its own data

The Farm Retail Association has approximately 1,200 member businesses, established
credibility with UK farm shops, and FRA listing data that it already uses for its own
directory. BigBarn has been operating since 2000 with FRA relationships and established
SEO. If the FRA commissions a modern mobile-first rebuild of its directory — whether
through BigBarn or a new agency — it combines Farmmap's UX advantage with the FRA's
pre-existing supply-side trust and the most credible endorsement in the sector.
Farmmap's tech advantage would be neutralised.

**Source:** saleability-critique.md §5 — BigBarn and FRA directory analysis;
alternatives-considered.md — FRA white-label assessment.

---

### T4 — Database rights claim from yourhonestybox.com over 336 seed listings

If yourhonestybox.com's team identifies that 336 of their listings have been
systematically extracted and used to seed a competing product, a database rights
claim under the EU Database Directive (Ireland) or UK sui generis database right is
a legally credible risk. The remedy could include an injunction to remove the contested
listings, damages, and adverse publicity in the Irish market. Given that the Irish
territory is Farmmap's most differentiated competitive position, this is the most
concrete single-event threat in the portfolio.

**Source:** saleability-critique.md §4 — legal analysis; discovery-decision.md —
yourhonestybox-database-rights as pre-launch blocker condition.

---

### T5 — Farm shop owner digital fatigue: "another directory that won't deliver"

The target supply-side customer has a prior belief built from repeated experience:
directories pitch, charge, fail to deliver measurable footfall, and are abandoned.
Yell, Yelp, BigBarn, the FRA directory, and numerous regional "buy local" platforms
all occupy the same mental slot. The Saleability Critique rates this as the single
hardest objection: "Facebook and Google are free and my customers find me there."
This is not irrational scepticism — it is an accurate description of the historic
category. Overcoming it requires consumer traffic proof before any commercial
conversation.

**Source:** saleability-critique.md §1, §5 — acquisition problem and competitive
context; discovery-decision.md — saleability challenges narrative.

---

### T6 — Food safety liability if a marketplace food sale results in illness

At Silver and Gold tier, Farmmap enables online food sales. Stripe Connect Standard
correctly places payment liability with the merchant. It does not protect Farmmap's
reputation. A food poisoning incident, an allergen reaction from non-compliant
labelling, or an FSA enforcement action against a Silver/Gold seller would damage
Farmmap's brand and suppress merchant acquisition for 12–18 months. Natasha's Law
(UK) and FIC regulations (Ireland) require full allergen disclosure on pre-packed
food sold online; the intake specification does not include allergen data fields.

**Source:** saleability-critique.md §6 — liability analysis; intake.md — Silver/Gold
marketplace specification; discovery-decision.md — food safety deferred to compliance
pack.

---

### T7 — VC-backed or media-backed competitor entering the farm shop directory space

The farm shop discovery gap is a documented, publicly available insight (FRA Consumer
Research 2023, FSA Food and You surveys). A competitor with VC backing, a media brand
(Country Living, Delicious magazine, Country File), or a supermarket's local sourcing
programme could enter the same space with substantially more capital for consumer
acquisition, SEO content, and farm shop sales teams. Farmmap's 12–18 month window
before reaching defensive scale is the window of vulnerability.

**Source:** saleability-critique.md §4 — "better-funded UK directory entrant"
scenario; value-bench.md §5 — competitive moat analysis.

---

### T8 — Macro: Consumer spending contraction reducing non-essential farm shop visits

Farm shops occupy a premium-to-neutral price point relative to supermarkets for many
product categories. A sustained consumer spending contraction (recession, prolonged
cost of living pressure) could reduce discretionary visits to farm shops, particularly
for quality-driven rather than value-driven shoppers. A smaller farm shop market means
fewer active listings, lower GMV for Silver/Gold tier, and reduced urgency for farm
shop owners to invest in digital presence.

**Source:** value-bench.md §1 — consumer spend baseline; value-thesis.md — economic
case framing.

---

## Strategic Synthesis

### SO Strategies (Strengths deployed to capture Opportunities)

**SO1: SEO land-grab using seeded listings as a 953-page long-tail asset (S1, S2 + O1, O7)**

The 953 seeded listing pages are not just map pins — each is a unique indexed URL for
a farm shop or honesty box in a specific location. With the farmmap.co.uk exact-match
domain and a systematic SEO programme (county-level landing pages, "farm shops in
[county]" editorial content, schema.org LocalBusiness markup on every listing), the
product can achieve Google ranking across hundreds of long-tail queries within 12–18
months. The "know your farmer" trend (O1) is generating growing organic search demand.
Capturing it before consumer attention is the primary traffic flywheel.

Action required: SEO strategy and content programme as primary launch deliverables
(not marketing add-ons) — consistent with discovery-decision.md 100k-visitor-resource-
plan condition.

---

**SO2: Convert yourhonestybox.com from threat to partnership using Irish coverage as leverage (S4, S8 + O3)**

Farmmap has 263 Irish and NI honesty box listings and the honesty box as a first-class
listing type. yourhonestybox.com has no commercial model but has brand equity and an
assembled dataset. Farmmap's position — first-mover on the UK side, strong Irish
coverage, a commercial model — makes it the natural acquirer or partner. Approaching
yourhonestybox.com with a joint-listing or data-sharing proposal resolves the database
rights risk (W6, T4) while converting a competitor into a supply-side asset and
blocking the UK expansion threat (T2) simultaneously.

Action required: outreach to yourhonestybox.com before V1 launch.

---

**SO3: Target digitally absent farm shops with a "your free digital presence" pitch
leveraging ELM diversification wave (S5 + O4, O5)**

The 2,310 UK farm shops with no website are a distinct and targetable segment:
they cannot be found on Google, they have no social presence, and they are actively
being encouraged by government schemes to diversify. For them, a permanent free
Farmmap listing is their entire digital presence — the correct sales frame is not
"get listed on another directory" but "we are your Google presence." The ELM
diversification wave (O5) is creating new farm shops and honesty boxes each month
who have never had to think about digital discovery before. These are the lowest-
friction early adopters.

Action required: FRA data partnership to identify digitally absent members; targeted
outreach to recently-diversified ELM recipients.

---

**SO4: Leverage portfolio multiplier to fund Farmmap's consumer acquisition at scale
(S3 + O6)**

The multi-tenant architecture means that once Farmmap proves unit economics, each
additional vertical (BrewMap, CampingMap, BerthMap etc.) costs £15k–25k incremental
investment and generates comparable standalone revenue. Portfolio Y5 base revenue of
£2.2m supports a team at a scale that £164k Y3 Farmmap-alone cannot. The portfolio
thesis provides the investment case for the marketing and sales infrastructure
Farmmap needs to reach 100k monthly visitors and 100+ Bronze shops. Framing the
ask — to the founder personally, to any seed investors — as the engine business
rather than the single directory is the correct pitch.

Action required: maintain POC gate (100 Bronze subscribers) before full engine
generalisation; use portfolio framing in all funding conversations.

---

### WT Mitigations (Weaknesses protected against Threats)

**WT1: Resolve yourhonestybox.com legal position before V1 launches to remove the
single-event catastrophe risk (W6 + T4)**

The intersection of W6 (copyright risk on 336 listings) and T4 (database rights
claim) is the only item in this matrix that represents a plausible single-event
catastrophe: a court-ordered injunction stripping the entire Irish dataset at launch
removes Farmmap's most differentiated territorial position before any recovery is
possible. The mitigation is unambiguous: obtain written permission, replace the 336
listings with independently-sourced data, or launch the Irish dataset without the
yourhonestybox.com subset and rebuild it. None of these options kills the product.
All are resolvable before V1.

Action required: legal/compliance squad resolution before V1 launch — already flagged
in discovery-decision.md as a pre-launch blocker.

---

**WT2: Add demand-capture mechanism at V1 to reduce ordering-intent leakage
before competitors capture the waitlist (W2 + T5, T7)**

The 12+ month gap between V1 launch and V3 online ordering is an open window for
competitors. Every consumer who arrives with ordering intent and finds no "notify me"
mechanism routes to the farm shop's own website, BigBarn, or a future entrant. Adding
a single email-capture field with a "Online ordering coming soon — be the first to
know" prompt costs negligible engineering time and can accumulate thousands of
high-intent V3 prospects before V3 ships. This is the lowest-cost risk mitigation
in the entire matrix.

Action required: V1 product spec — single field waitlist, no login required, triggered
by ordering intent signals on listing pages.

---

**WT3: Build and publish traffic evidence before any Bronze sales conversation begins
to defeat digital-fatigue objection (W4, W5 + T5)**

The hardest sales objection (T5 — "another directory that won't deliver") and the
attribution weakness (W5 — "I see views but not sales") both require the same
evidence: real visitor sessions on the shop's specific listing, with enough volume
to make a credible pattern. Before any commercial outreach, Farmmap must be able
to show a shop owner their listing's session count and a comparative benchmark.
The Bronze sales conversation should not begin for a given shop until that listing
has at least 100 monthly sessions. The free-tier period is not a loss-leader; it is
the evidence generation phase.

Action required: dashboard visible to unclaimed listings (showing anonymised traffic);
sales process gated on traffic threshold.

---

**WT4: Pursue FRA data-sharing arrangement before launch to preempt the
FRA-builds-its-own-directory threat and reduce CAC (W8 + T3)**

The FRA as a competitor (T3) is the structural threat to Farmmap's supply-side
defensibility: if the FRA commissions a modern directory, it has the data and the
trust that Farmmap is spending £120–£250/shop to acquire. The mitigation is to make
the FRA a partner rather than a future competitor — a data-sharing arrangement in
which Farmmap provides the FRA with a better product for its members in exchange for
listing data, member communications access, and implicit endorsement. This simultaneously
resolves W8 (no FRA relationship), reduces CAC by routing through an existing trusted
channel, and makes T3 structurally less likely because the FRA would be embedded in
Farmmap's success.

Action required: founder-level outreach to FRA leadership before or at V1 launch;
propose data licence not white-label — consistent with discovery-decision.md
fra-relationship condition.

---

## Matrix Summary

| Quadrant | Count | Most Critical Item |
|---|---|---|
| Strengths | 8 | S2 (domain) and S6 (map-first UX) are the durable core assets |
| Weaknesses | 8 | W6 (copyright risk) is the only pre-launch blocker; W1 (no reviews) is the longest-duration structural gap |
| Opportunities | 8 | O4 (66% no-website) is the largest and most immediately actionable TAM signal |
| Threats | 8 | T4 (database rights claim) is the highest-probability single-event risk; T1 (Google category expansion) is the highest-magnitude systemic risk |

---

*Produced by: swot-analyst | squad: market-research*
*Authority: all discovery-pack files listed in frontmatter | spec_id: 003-farmmap*
*Feeds: specs/003-farmmap/market-pack/swot/swot-decision.md*
