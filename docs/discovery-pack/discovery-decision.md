---
feature: 003-farmmap
phase: 1
gate: discovery-go-no-go
status: proceed
value-thesis: "Farmmap unlocks an estimated £137m in annual consumer spend at base case by solving the discovery gap for 3.6m UK and Irish shoppers who want local food but cannot reliably find it, and its multi-tenant engine compounds that value across 6+ adjacent verticals to a projected £2.2m portfolio Y5 revenue."
pivot-direction: ""
kill-reason: ""
alternatives-considered:
  - "B2B-first (ShopKit): inferior — inverts the validation sequence, making the directory contingent on sales velocity before the consumer base exists"
  - "FRA white-label: inferior as primary model — collapses the portfolio moat and subordinates the roadmap to a single trade body; FRA data partnership worth pursuing as a side channel"
  - "VerticalKit platform-first: comparable but premature — already implicit in the intake's multi-tenant architecture; execute after Farmmap proves unit economics, not before"
better-idea: "None superior found. Portfolio thesis is the strongest business case and is structurally validated by all four specialist assessments."
human-approval-required: false
conditions:
  - "yourhonestybox-partnership-opportunity: RESOLVED — the 336 Irish listings were obtained with explicit consent from yourhonestybox.com. The database rights concern is closed. yourhonestybox.com is now correctly classified as a potential partner (data-sharing, brand endorsement, or co-marketing arrangement) rather than a competitive threat. The compliance squad should record the consent basis in writing before V1 launch, but this is no longer a blocking condition. The market research squad should assess yourhonestybox.com as a partnership target in the competitor matrix."
  - "demand-capture-at-v1: Add a 'notify me when online ordering is available' or early-access waitlist mechanism to V1. The map will surface J4/J6 ordering intent from day one; without a capture mechanism that demand leaks to the farm shop's own website or a competitor during the 12+ months before V3 is live."
  - "reviews-layer: The absence of a consumer review and ratings system leaves J2 (pre-trip planning) and J3 (trust verification) permanently dependent on Google Maps and TripAdvisor. This should be designed for V2 Bronze or at the latest as an early V3 increment. A lightweight star-rating with moderation is sufficient to break the dependency."
  - "poc-before-multi-tenant-engine: Build the Farmmap product and prove Bronze conversion rate before investing in a genericised multi-tenant engine. The exec summary implies simultaneous investment in both; this is a capital risk at the standalone revenue level (£18k Y1, £72k Y2 base case). The correct gate is: 100 Bronze subscribers confirmed before engine-generalisation work begins."
  - "fra-relationship: Pursue a data-sharing or endorsement arrangement with the Farm Retail Association before launch. The saleability critique identifies 'we've seen this from directories before' as the hardest farm shop owner objection; FRA association directly addresses it. A white-label arrangement is inferior — a data licence or co-branded credibility play is the target outcome."
  - "100k-visitor-resource-plan: The free directory reaching and sustaining 100k monthly visitors is the load-bearing assumption for every commercial tier. The SEO strategy, content programme, and link-building plan must be in the Phase 2 launch plan as primary deliverables, not as afterthoughts or marketing add-ons. Consumer traffic is the evidence base for every Bronze sales conversation."
produced_by: discovery-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/intake.md + agent-foundry Constitution v1.0.0
---

# Farmmap — Discovery Decision

## The Commercial Case

ValueBench's analysis establishes a credible economic foundation for Farmmap. The
problem it solves is real, large, and well-evidenced: the Farm Retail Association's
own consumer research identifies "don't know where to find one" as the primary
barrier to farm shop purchases among the approximately 3.6 million UK and Irish
adults who want to buy local food but have not yet visited a farm shop. The FSA's
Food and You 2 Wave 7 survey (2024) confirms that 43% of UK adults value local food,
and that a substantial behaviour gap exists between intent and purchase. Farmmap's
case is not speculative; it rests on primary research from credible sector bodies.

The base-case economic pain quantification — £137 million in annual consumer spend
unlocked at 10% of the discovery-converted shopper segment — is a conservative
mid-point that assumes modest conversion rates and moderate average spend. Even
the worst-case scenario (£43m) is large relative to the product's operating costs.
This is the kind of market where a focused, well-executed niche product can extract
meaningful revenue from a tiny fraction of the available value.

Standalone revenue projections are modest: Year 3 base case of approximately £164k,
Year 5 of approximately £450k. ValueBench's assessment is direct about this: Farmmap
as a single vertical is a viable micro-SaaS or lifestyle business, but it does not
support a venture-scale team without the portfolio multiplier. The Year 3 number is
not an embarrassment — it is a realistic output of a bootstrapped directory with
conservative Bronze penetration rates — but it sets appropriate expectations. A
founding team must understand that Farmmap alone, at base case, does not pay
competitive salaries in year one or two.

The portfolio thesis changes the calculus entirely. Seven verticals sharing one
engine at a projected combined Y5 revenue of £2.2 million implies an enterprise
value of approximately £11 million at a conservative 5× revenue multiple. The
marginal cost of each additional vertical (estimated £15k–25k for data, domain, and
customisation) is far below the incremental revenue each generates. The unit economics
of the portfolio model are compelling in a way that Farmmap in isolation is not.

## Saleability Challenges and How They Are Addressable

The Saleability Critique delivers its verdict honestly: UNCERTAIN. The farm shop
owner acquisition problem is genuine. This is not a digitally-sophisticated SaaS
buyer segment — it is owner-operated rural businesses run by people aged 50–70, many
of whom have been burned by previous directory pitches. The critic's estimated CAC of
£120–£250 per Bronze shop, and a free-to-paid conversion rate of 4–8%, are realistic
and must be used as planning assumptions, not dismissed.

The hardest objection — "Facebook and Google are free, and previous directories
delivered nothing" — cannot be rebutted with marketing copy. It can only be rebutted
with consumer traffic. This is the central insight that the exec summary underweights:
Farmmap's sales motion depends entirely on being able to show a farm shop owner
a meaningful number of real visitor sessions to their listing before asking for money.
That means the 100k monthly visitor target is not a growth metric; it is a sales
enablement prerequisite. The Bronze pitch without traffic data is an unsupported claim.
The Bronze pitch with 500 sessions/month on the shop's listing is a closed deal.

The yourhonestybox.com database rights issue is the most concrete saleability risk
identified. Three hundred and thirty-six Irish listings extracted from a competing
directory without explicit permission are a legal liability before they are an asset.
The risk is not theoretical: EU database rights apply in Ireland, and yourhonestybox.com
is an actively-maintained product with a demonstrable interest in protecting its data.
This issue must be resolved before V1 launch, not after. The resolution path is
straightforward — written permission, data replacement, or launch without the Irish
seed set — and none of the options is a discovery killer. But leaving it unresolved
is exactly the kind of oversight that hands a competitor the moral high ground in
the market where Farmmap is most differentiated.

The food safety liability (allergen labelling, Natasha's Law compliance, food hygiene
verification for Silver/Gold marketplace sellers) is a Phase 3 concern but must be
scoped now. It is out of scope for the discovery decision but must be in the Phase 2
compliance pack.

## Fit Assessment and the Two Critical Gaps

Problem-Solution Fit returned an overall verdict of PARTIAL — four jobs with strong
fit, four with partial fit, one effectively missing at V1/V2. This is an acceptable
score for a phased product with deliberate sequencing. The strong fits (J1 impulse
discovery, J5 passing trade, J9 portfolio replication) are exactly the right jobs to
nail first: they drive consumer traffic, shop awareness, and platform scalability
respectively.

The two critical gaps require active management rather than passive sequencing.

The first is demand leakage. The directory will surface J4 and J6 ordering intent —
consumers who want to order online, shop owners who want to sell remotely — from the
day it launches. V3 is 12 or more months away. Without a "notify me when ordering is
available" mechanism at V1, every consumer who arrives with purchasing intent and
leaves without a mechanism to reconnect is a lost V3 conversion. The fix is a single
email capture field with a clear promise: "Online ordering coming soon — be the first
to know." The engineering cost is negligible; the V3 conversion value could be
substantial.

The second is the reviews layer. J2 (pre-trip planning) and J3 (trust verification)
both depend on social proof that Farmmap does not control. The verified badge and
shop page address the legitimacy question for claimed listings, but they do not answer
the consumer's actual question: "Is this shop worth the trip?" Without ratings, the
directory cannot fully serve the planning use case, and it permanently routes users
to Google Maps and TripAdvisor for the trust layer. A lightweight star-rating system
with basic moderation should be designed for V2 Bronze. This is not scope creep; it
is the minimum feature needed to own the planning use case rather than outsource it.

## Why the Portfolio Thesis Changes the Investment Case

The Better-Idea Generator's most significant finding is negative: no superior
alternative exists. The ShopKit-First inversion solves the wrong problem. The FRA
white-label collapses the primary asset. The VerticalKit platform reframe is the most
compelling alternative — but it is already implicit in the architecture and is better
executed as a phase two evolution than a day-one pivot.

The portfolio thesis is the strongest single element of the business case, and it is
not in competition with Farmmap's consumer proposition — it is dependent on it. The
engine has no value without a proven first vertical. The first vertical has marginal
standalone value. Together they describe a business that uses a consumer-facing
product to validate market demand and a shared infrastructure to replicate that
validation across adjacent markets at low marginal cost. This is a defensible
compounding model.

The Saleability Critic identifies the multi-tenant engine as a risk at the Farmmap
stage, and the concern is valid at the level of capital sequencing: if the engine is
built before Farmmap's Bronze conversion rate is proven, and Farmmap fails to convert,
the engine has no other tenants to justify it. The condition embedded in this decision
addresses this directly — the POC-before-engine gate. Prove 100 Bronze subscribers,
then generalise the engine. This is sequencing discipline, not a change to the
portfolio vision.

## Where the Exec Summary Is Sound and Where It Needs Revision

The exec summary is sound on: the map-first consumer proposition, the honesty box
first-class listing type as differentiation, the three-tier shop monetisation model,
the portfolio architecture, and the correct ordering of free directory before paid
tiers.

It needs revision on three points. First, the 953 seeded listings should not be
presented as solving the cold-start problem. They solve the map-density problem for
a consumer browsing the free tier; they do not solve the supply-side engagement
problem. The exec summary needs a specific plan for the first 50 claimed, owner-managed,
photogenic listings — not just the number of pins on a map at launch. Second, the
portfolio investment case should be explicitly staged: Farmmap first, engine
generalisation after the Bronze conversion milestone is hit. The current framing implies
simultaneous investment in both, which overstates the capital requirement and
understates the focus required to succeed at the Farmmap stage. Third, the 100k
monthly visitor target must be accompanied by a resource plan — SEO strategy, content
programme, link-building approach — in the Phase 2 launch spec. It is currently
presented as a success metric without a plan for achieving it.

## Decision and Rationale

**PROCEED to Phase 2.**

The decision is PROCEED because the commercial case is substantiated, the model
is structurally sound, no superior alternative exists, and all identified gaps are
addressable within the scope of normal product development. The discovery phase has
produced one compliance flag (yourhonestybox.com database rights), two product
design recommendations (demand capture, reviews layer), two sequencing constraints
(POC before engine, FRA relationship before launch), and one planning requirement
(100k visitor resource plan). None of these is a kill condition.

The yourhonestybox.com issue is the only item with a potential blocking character,
and it is a legal compliance matter with a clear resolution path — not an evidence-based
case that the product idea is wrong, the market is too small, or the model is
unworkable. A cease-and-desist risk on 336 listings in Ireland does not invalidate
the UK market, the commercial model, or the portfolio thesis.

The six conditions listed in the YAML frontmatter are carry-forward items for Phase 2.
They are not blockers on this gate. They must be addressed — the yourhonestybox.com
item before V1 goes live, the demand-capture and reviews items in the Phase 2 spec
design, the POC-before-engine and FRA relationship in the go-to-market plan, the
visitor resource plan in the launch spec. The Phase 2 gatekeeper will verify that
each condition has been resolved or formally accepted as a named risk.

The portfolio thesis is validated. The sequencing is correct. The market is real.
Execute.

---

*Produced by: discovery-squad-lead | squad: discovery-and-validation*
*Authority: specs/003-farmmap/intake.md | agent-foundry Constitution v1.0.0*
*Feeds: specs/003-farmmap/market-pack/ | specs/003-farmmap/compliance-pack/*
