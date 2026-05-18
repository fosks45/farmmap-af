---
feature: 003-farmmap
phase: 2.5-viability
gate: viability-go-no-go
verdict: go
weighted-score: 3.80
human-override: false
human-override-reason: ""
scores:
  problem-severity: 5
  market-size: 4
  problem-solution-fit: 3
  saleability: 3
  differentiation: 4
  timing: 4
scoring-weights:
  problem-severity: 0.20
  market-size: 0.15
  problem-solution-fit: 0.20
  saleability: 0.20
  differentiation: 0.15
  timing: 0.10
scoring-detail:
  problem-severity: "5 × 0.20 = 1.00 — 2,310 UK farm shops with zero web presence; FSA confirms 22.3m adults value local food; £137m base-case consumer unlock; acute, documented, growing gap"
  market-size: "4 × 0.15 = 0.60 — TAM £1.77bn; saturation index 2/10; SAM ~5,700 listings; SOM £164k Y3 standalone / £2.2m Y5 portfolio; standalone revenue is thin but portfolio prize is material"
  problem-solution-fit: "3 × 0.20 = 0.60 — PSF partial: 4 strong, 4 partial, 1 missing at V1/V2; V1 correctly sequences traffic-first jobs; reviews and ordering demand-capture gaps are named and addressable"
  saleability: "3 × 0.20 = 0.60 — Hard demographic (50–70, prior directory scepticism); CAC £120–250 blended; yourhonestybox.com consent now confirmed, removing legal overhang and opening partnership; FRA + traffic-triggered email are viable acquisition channels; not a kill signal but requires execution discipline"
  differentiation: "4 × 0.15 = 0.60 — farmmap.co.uk exact-match domain; 953-listing head start; yourhonestybox.com confirmed partner (not threat); multi-tenant engine; FRA endorsement opportunity; BigBarn £45k net assets / 24yr technical debt; moat is real and compounding"
  timing: "4 × 0.10 = 0.40 — ELM scheme forcing farm diversification (PESTEL P1 High tailwind); post-COVID local food trend structural not cyclical; cost-of-living 'intentional spend' pattern; yourhonestybox.com growing 20–25%/yr with no UK expansion signals; 12–18 month window before well-funded entrant replicates V1"
weighted-score-calculation: "(5×0.20) + (4×0.15) + (3×0.20) + (3×0.20) + (4×0.15) + (4×0.10) = 1.00 + 0.60 + 0.60 + 0.60 + 0.60 + 0.40 = 3.80"
verdict-threshold: "GO ≥ 3.50 | MARGINAL 2.75–3.49 | NO-GO < 2.75"
conditions-carried-forward:
  - yourhonestybox-consent: "CONFIRMED — 336 Irish listings obtained with explicit consent from yourhonestybox.com. Legal threat is closed. Compliance squad must record the consent basis in writing before V1 launch. A formal partnership agreement (data licence, co-branding, or data-sharing arrangement) is strongly recommended before V1 launch to convert a confirmed cooperative relationship into a structural moat."
  - fra-relationship: "CRITICAL — Pursue FRA data-sharing or endorsement arrangement before V1 launch. FRA association is the single highest-leverage Bronze acquisition channel (warm referral conversion approximately 3× cold outreach) and directly defeats the hardest sales objection ('we've heard this before'). A white-label arrangement is inferior; target a data licence or co-branded credibility play. Without FRA alignment, every cold outreach to an FRA member shop must overcome the implicit question: 'Why not just use the FRA directory?' This is the condition most likely to determine whether Y1 Bronze targets are achievable."
  - demand-capture: "Add a 'notify me when online ordering is available' or early-access waitlist mechanism to V1. The map surfaces J4/J6 ordering intent from day one; without a capture mechanism that demand leaks to the farm shop's own website or a competitor during the 12+ months before V3 is live. Engineering cost is negligible; V3 conversion value is material."
  - reviews-layer: "Design for V2 Bronze. Consumer review and ratings system absence leaves J2 (pre-trip planning) and J3 (trust verification) permanently dependent on Google Maps and TripAdvisor. A lightweight star-rating with moderation is sufficient to break the dependency and begin accumulating the review network effect moat (estimated 36–60 months to close for any future competitor)."
  - poc-before-engine: "Build Farmmap POC, prove 100 Bronze subscribers, then invest in multi-tenant engine generalisation. Premature engine investment before Farmmap unit economics are proven is a capital risk at the standalone revenue level (£18k Y1 base case). The correct gate is: 100 Bronze subscribers confirmed before engine-generalisation work begins."
  - gold-commission-cap: "Design a commission cap or sliding scale for Gold tier above £8,000/month GMV before V3 commercial model is finalised. Gold at 5% commission on a high-GMV shop is a retention and churn risk. This should be in the V3 commercial model specification."
  - natasha-law-allergens: "Allergen fields (14 regulated allergens, structured multi-select) are Must-Have in the V3 Silver/Gold product catalogue schema. Natasha's Law (UK) and EU Regulation 1169/2011 (Ireland) require full allergen declaration on pre-packed food sold online. Non-compliance creates criminal liability for food business operators and reputational liability for Farmmap. The FSA's online marketplace compliance monitoring programme (2024) targets platforms explicitly."
  - seo-content-programme: "The 100k monthly visitor target must be accompanied by a dedicated SEO strategy, content programme (county guide articles, schema.org LocalBusiness markup, long-tail landing pages), and editorial calendar in the Phase 3 launch spec. Consumer traffic is the load-bearing assumption for every Bronze sales conversation. Without traffic evidence, the Bronze pitch is an unsupported claim."
produced_by: viability-gate
produced_at: 2026-05-16T00:00:00Z
authority: "specs/003-farmmap/discovery-pack/ + specs/003-farmmap/market-pack/ + agent-foundry Constitution v1.0.0"
evidence-pack-references:
  - specs/003-farmmap/discovery-pack/discovery-decision.md
  - specs/003-farmmap/discovery-pack/problem-solution-fit.md
  - specs/003-farmmap/discovery-pack/saleability-critique.md
  - specs/003-farmmap/discovery-pack/value-bench.md
  - specs/003-farmmap/discovery-pack/value-thesis.md
  - specs/003-farmmap/market-pack/market-decision.md
  - specs/003-farmmap/market-pack/tam-sam-som.md
  - specs/003-farmmap/market-pack/swot/swot-analysis.md
  - specs/003-farmmap/market-pack/swot/swot-decision.md
  - specs/003-farmmap/market-pack/pestel-analysis.md
  - specs/003-farmmap/market-pack/barriers-to-entry.md
  - specs/003-farmmap/market-pack/pricing-hypothesis.md
---

# Farmmap — Viability Gate Decision

## Verdict: GO (3.80 / 5.00)

Farmmap clears the GO threshold with a weighted viability score of 3.80 against a 3.50 pass mark. Every dimension scores at or above the midpoint. No single dimension returns a score low enough to require a formal exception or human override. This is a clean GO.

---

## Why This Is a GO

The evidence base for this verdict is unusually strong for an early-phase product. It does not rest on founder ambition or market sizing arithmetic alone; it rests on named primary sources — FRA consumer research, FSA Food and You 2 Wave 7 (2024), DEFRA farm business surveys, Companies House filings on BigBarn — and on a discovery pack that has been stress-tested by an adversarial saleability critique as well as a problem-solution fit analysis. The GO verdict survives the most sceptical read of the evidence.

The problem severity score of 5 is the highest in the range and it is earned. Two thousand, three hundred and ten UK farm shops with no web presence is not an inference; it is a fact drawn from the FRA's own digital adoption survey. The FSA's survey placing 43% of UK adults — approximately 22.3 million people — in the "local food matters" segment is independently corroborated by IGD and WRAP post-COVID studies. The consumer demand exists. The supply of discoverable farm shops does not. The gap is documented, growing, and generates real economic loss: a conservative £137 million in annual consumer spend that fails to reach farm shops not because those shops lack the product but because consumers cannot find them. A market gap of that magnitude, corroborated by multiple independent primary sources, does not happen often in a phase-gate process. The problem severity score is not generous; it is accurate.

The market size score of 4 reflects genuine strength with an honest caveat. The TAM at £1.77 billion and the saturation index at 2/10 are structurally attractive. The caveat is that standalone Y3 revenue at £164k is modest — it supports a lifestyle business, not a founding team at market salaries in year one or two. This is not hidden: the value-bench analysis names it directly. The market size score awards the point for what the evidence shows, not what the narrative hopes for. The portfolio model changes the calculus to a score-5 business case, but the gate must assess the product as currently specified, not as a future portfolio. Score 4 is the honest read.

The problem-solution fit score of 3 is not a weakness to be explained away; it is a signal to be acted on. The PSF analysis returned PARTIAL — four jobs strongly addressed, four partially addressed, one missing at V1/V2. The four strong fits (J1 impulse discovery, J5 passing trade, J9 portfolio replication, and the structural mobile-first map proposition) are exactly the right jobs to nail first: they generate consumer traffic and shop awareness, which are the prerequisites for everything else. The four partial fits are partially intentional sequencing decisions, not design failures. The one missing fit (online ordering at V1/V2) is explicitly deferred and correctly so. A score of 3 for a phased product that has deliberately sequenced its jobs and named its gaps is not a concern; it is evidence of disciplined thinking.

The saleability score of 3 reflects a hard demographic and an uncertain acquisition model — but it is important to understand what "uncertain" means in the saleability verdict context. The saleability critic did not find that the product cannot be sold; they found that selling it requires human touchpoints, traffic evidence, and FRA credibility rather than a digital funnel. These are execution constraints, not model killers. More importantly, the yourhonestybox.com consent confirmation — the most significant news in this gate update — directly improves the saleability picture. The data was obtained with explicit consent, which transforms the entire yourhonestybox.com relationship from a legal threat to a partnership narrative. When a Farmmap salesperson approaches an Irish or NI farm shop, they can say: "We worked with yourhonestybox.com to compile this dataset." That is a credibility asset, not a liability. The consent story is a proof point for the cooperative food community that farm shop owners inhabit. Score 3 is held rather than raised because the acquisition challenge is real — the 50–70 demographic, the prior directory scepticism, the attribution gap — but the trend is upward from where it was when the yourhonestybox.com rights were an unresolved legal question.

The differentiation score of 4 reflects a genuine and compounding moat. farmmap.co.uk is an exact-match domain no competitor can acquire. The 953-listing head start requires 12–18 months for a new entrant to match on stub density and 24–36 months to match on claimed listing quality. BigBarn has £45,000 in net assets and 24 years of technical debt — it is not a threat capable of a funded relaunch within the window that matters. The multi-tenant architecture means that once Farmmap proves unit economics, it can launch adjacent verticals at £15,000–25,000 each while a competitor faces the full 6–9 month build from scratch. And FRA endorsement, if secured, is a Very High strength moat that no competitor can replicate in under 18–36 months. The fourth point is not awarded for FRA endorsement specifically because it is not yet secured — but the moat without it is still strong enough for a score of 4.

The timing score of 4 reflects a genuinely favourable window that is real but finite. ELM transition is not a narrative; it is a confirmed DEFRA policy creating a multi-year supply-side tailwind as farms diversify to compensate for the wind-down of Basic Payment Scheme subsidies. The "intentional spending" pattern documented in FRA member surveys (consumers visiting less frequently but spending more per trip and valuing experience) creates a demand-side environment that rewards discovery. yourhonestybox.com is growing at 20–25% per year in listing count with no evidence of UK expansion intent — the window before they are large enough to be a credible UK entrant is measured in months to a few years, not a decade. The 12–18 month window before a well-funded entrant can replicate V1 is the urgency signal. Score 4 rather than 5 because no timing score should be 5 unless the window is already closing — and it is not yet closing, only opening.

---

## The Two Most Important Conditions

### 1. FRA Partnership Before Launch

The Farm Retail Association condition is not a nice-to-have. It is the single item in the conditions list that determines whether the Bronze acquisition model works at the costs projected, or whether it requires a field sales operation that the standalone revenue cannot support in year one.

The saleability analysis is explicit: warm referral conversion is approximately 3× cold outreach conversion for trust-gated customer segments. The FRA's 1,200 member businesses are precisely the highest-value segment of Farmmap's Bronze addressable market — larger shops, more digitally engaged, already paying for FRA membership, predisposed to invest in sector-supported tools. An FRA data-sharing or endorsement arrangement converts the hardest acquisition problem (cold outreach to a sceptical 50–70 demographic) into a warm introduction channel where the trade body is implicitly vouching for the product.

Beyond acquisition, the FRA relationship addresses the structural competitive threat. If Farmmap does not secure the FRA relationship, the FRA retains the option to commission a modern directory (from BigBarn with investment, from an agency, or as an internal build) and deploy it with the 1,200 member relationships that Farmmap is spending £120–250 per shop to acquire cold. The first-mover advantage in securing the FRA relationship is substantial and time-sensitive: the FRA is unlikely to pursue two directory partnerships simultaneously.

The recommended approach is a data licence, not a white-label. The white-label option collapses the portfolio moat and subordinates Farmmap's roadmap to a single trade body's priorities — it is correctly rejected in alternatives-considered.md. The correct pitch is: Farmmap provides the FRA's members with a better map product than the FRA can build, the FRA provides Farmmap with member data, listing enrichment, and communication access, and both parties benefit from improved member discovery without Farmmap ceding product control.

This conversation must happen before V1 launch. If it happens after, Farmmap arrives at the FRA's door having already operated as a directory in their sector — and the FRA's negotiating position is stronger because Farmmap needs them more than vice versa at that point.

### 2. Demand Capture at V1

The demand-capture condition is the lowest-cost, highest-return item in the entire conditions list. A single email-capture field with a "Online ordering coming soon — be the first to know" prompt on listing pages and the map context adds negligible engineering time to V1 and has the potential to accumulate thousands of high-intent V3 prospects before V3 ships.

The argument is simple. The directory will surface consumer ordering intent (J4) and farm shop owner online-selling intent (J6) from the day it launches. Version 3 — where online ordering is fulfilled — is at minimum 12 months from V1 launch. Every consumer who arrives with ordering intent and leaves without a retention hook routes to the farm shop's direct website, a competitor, or nowhere. Over 12 months of V1 traffic at even the conservative 40,000 monthly visitor estimate, a modest ordering-intent capture rate of 2% generates 9,600 email addresses of consumers who have self-identified as willing to order from farm shops online. That is a V3 launch list that cannot be bought, cannot be recreated after the fact, and costs nothing to collect at V1.

For farm shop owners, the same mechanism captures J6 intent: an owner who discovers Farmmap at V1 and whose primary need is to sell online should be able to register interest in the marketplace tier. This is not just a conversion instrument; it is evidence for the V3 business case. A waitlist of 1,000 farm shop owners wanting online ordering capability is a more compelling argument for V3 investment than any market sizing document.

The absence of this mechanism in the current spec is the single easiest fix in the entire product definition, and it should be added to the V1 spec before the architecture phase begins.

---

## Where the Exec Summary Analysis Needs Revision

The exec summary produced in the discovery phase is sound on its core proposition — map-first consumer experience, honesty box as first-class listing type, permanent free tier, three-tier shop monetisation, portfolio architecture — but requires revision on three specific points that this gate process has surfaced.

**First: the Gold commission structure.** The pricing hypothesis (market-pack/pricing-hypothesis.md) identifies that Gold at 5% commission becomes a retention risk above approximately £8,000/month GMV. A farm shop generating £100,000/month through the Farmmap marketplace would pay £5,000/month in commission — a figure that a rational operator will eventually view as a misaligned cost relative to the service delivered, particularly if their Farmmap-originated revenue is a growing fraction of total sales. The exec summary presents Gold as an attractive high-margin tier without acknowledging this structural risk. The commercial model for V3 must include a commission cap or sliding scale — not as a concession, but as the designed structure. A cap at approximately £2,000/month commission (equivalent to 5% of £40,000 GMV) with a negotiated flat rate above that threshold is the appropriate design. This should be in the V3 commercial specification before build begins.

**Second: the multi-tenant engine timing.** The exec summary implies simultaneous investment in Farmmap as a product and in the multi-tenant engine as a platform from day one. This overstates the capital requirement and understates the focus required to succeed at the Farmmap stage. The discovery decision's POC gate (100 Bronze subscribers before engine generalisation) is the correct sequencing discipline, and it must be carried into the exec summary as an explicit staged commitment: Farmmap first, then engine generalisation after the Bronze conversion milestone is hit. The portfolio thesis remains valid and compelling as a framing for investment conversations; it is the capital sequencing, not the thesis itself, that needs revision.

**Third: the standalone revenue reality.** The Year 3 base case of £164,000 in standalone revenue needs to be stated honestly in the exec summary as a micro-SaaS or lifestyle business outcome, not elided by the portfolio multiplier. A founding team that has internalised the £2.2m Y5 portfolio number as their revenue target will be surprised — or worse, demoralised — by the £18k Y1 and £72k Y2 base case numbers. The honest exec summary says: "Farmmap alone supports a solo founder or small team at bootstrap salary levels through Year 3; the portfolio engine is the mechanism that makes this a viable full-team business, and it is gated on proving Farmmap's Bronze conversion first." This framing is more honest and more useful to a founding team than a narrative that papers over the standalone gap.

---

## The Farmdrop Lesson

Farmdrop raised £12 million in venture capital, built a logistics and warehouse operation to support direct farm-to-consumer grocery delivery, and closed in January 2022 having never reached profitability. The failure is directly relevant to Farmmap's model because it describes what happens when a local food business takes on the unit economics of logistics.

Farmdrop's model required: refrigerated delivery fleet, warehouse stock holding, per-delivery last-mile cost (approximately £8–12/delivery at volume), and food waste absorption for unsold perishable stock. At the scale it operated, it could never achieve the delivery density per postcode required for last-mile economics to work at consumer-acceptable price points. It needed to be in enough postcodes to cover fixed costs but every new postcode added before achieving density in existing postcodes made the economics worse. This is the density-and-logistics trap that has closed every farm-direct delivery service that has tried to build it at scale without a captive customer base.

Farmmap's platform model structurally avoids this trap by not touching logistics. Farmmap never owns the produce, never operates a warehouse, never manages a delivery route. The farm shop is the merchant of record (Stripe Connect Standard), and the farm shop manages its own delivery. Farmmap's unit economics are pure SaaS: subscription revenue and commission on GMV, with zero variable cost per order. The marginal cost of Farmmap facilitating the 10,000th order through its platform is not meaningfully different from the cost of facilitating the 100th order.

The Farmdrop lesson is not that direct farm-to-consumer food is a bad business. It is that the logistics layer is where capital goes to die. Every pound Farmmap does not spend on logistics is a pound that can compound into SEO, listing quality, and FRA relationship — the activities that build durable defensibility. The platform model does not require a supply chain; it requires a supply side and a demand side, connected by discovery. That is a structurally different (and structurally better) business.

---

## The yourhonestybox.com Consent News: What It Means for Partnership Strategy

The confirmation that yourhonestybox.com provided the 336 Irish listings with explicit consent changes the Farmmap picture materially and in several distinct ways.

The most immediate change is legal. The PESTEL analysis (L5) classified the yourhonestybox.com database rights question as a CRITICAL headwind and a pre-launch blocker. That classification no longer applies. The legal risk is closed. There is no database rights claim to defend, no injunction risk, no Irish-market credibility damage from being seen as a data infringer. The 336 listings are clean, consented data. The compliance squad needs to record the consent basis in writing — this is standard due-diligence housekeeping, not a remediation action.

The second change is competitive. The saleability critique's most concrete near-term competitive threat was the scenario in which yourhonestybox.com discovers Farmmap has used their data without permission and responds by accelerating UK expansion while holding the moral high ground. That scenario is closed. yourhonestybox.com gave the data willingly. They are aware of Farmmap, or at minimum aware that their data was used for a purpose they consented to. This is not a hostile relationship — it is the beginning of a cooperative one.

The third change is strategic, and it is the most significant. yourhonestybox.com provided data consent, which means they were willing to engage with Farmmap at the level of data sharing. A team willing to share data is a team willing to talk about a commercial relationship. The partnership conversation that was previously framed as "approach yourhonestybox.com to resolve the legal risk" is now correctly framed as "approach yourhonestybox.com to formalise and deepen a relationship that has already started." The starting position for that conversation is far stronger because there is no debt to repay and no damage to repair.

The recommended partnership structure remains a data licence or co-marketing arrangement rather than an acquisition. yourhonestybox.com's value to Farmmap is their Irish and NI honesty box coverage and their community trust in that market. Farmmap's value to yourhonestybox.com is a commercial model, a modern technology platform, and UK reach they do not have and are not building. A formal data-sharing or co-branding agreement — "Farmmap's Irish honesty box listings are powered in partnership with yourhonestybox.com" — turns a consented data relationship into a named partnership that carries credibility with the Irish food community and creates a soft barrier to any future competitor trying to enter the Irish honesty box market without the same community endorsement.

This should be actioned before V1 launch. The consent confirmation is the opening; formalising the relationship before launch is how Farmmap converts a legal resolution into a structural moat.

---

*Produced by: viability-gate | phase: 2.5-viability*
*Authority: All evidence-pack references listed in YAML frontmatter | agent-foundry Constitution v1.0.0*
*Verdict: GO | Weighted score: 3.80 / 5.00 | Threshold: 3.50*
*Feeds: specs/003-farmmap/architecture-pack/ | specs/003-farmmap/compliance-pack/*
