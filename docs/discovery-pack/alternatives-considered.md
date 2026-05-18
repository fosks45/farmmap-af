---
feature: 003-farmmap
phase: 1
document: alternatives-considered
squad: discovery-and-validation
produced_by: discovery-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/discovery-pack/better-idea.md
---

# Farmmap — Alternatives Considered

Three alternative business models were assessed against the Farmmap proposal during
the discovery phase. Each was evaluated on the same dimensions: build cost, time to
market, defensibility, problem fit, and portfolio moat. None was found superior.
The assessments below summarise the Better-Idea Generator's findings with squad-lead
commentary on the strategic implications.

---

## Alternative 1 — ShopKit-First (B2B-First Inversion)

The ShopKit-First model inverts Farmmap's funnel. Rather than building a public
consumer directory first and using consumer traffic as leverage to sell paid tiers
to farm shops, it approaches farm shops directly with a standalone digital shopfront
product — a branded page, order management, stock catalogue, and Stripe integration.
Each subscribing shop opts into public listing on a consumer-facing map. The directory
becomes a byproduct of the B2B install base rather than the primary vehicle for
recruiting shops.

The appeal is intuitive: avoid the cold-start consumer problem by generating revenue
before the directory has any traffic. The flaw is that it creates a different and
harder cold-start problem. The pitch to a farm shop is "your online shop" — but the
fundamental reason farm shops need digital presence is discovery. An online shop with
no directory traffic does not solve discovery. The ShopKit model asks a farm shop
owner to pay subscription fees for an e-commerce capability before any consumers
know the product exists. This is the harder sales motion, not the easier one.

More fundamentally, ShopKit-First trades network defensibility for higher per-account
switching cost. Farmmap's moat is a growing consumer base that shops need access to;
ShopKit's moat is account stickiness on a standalone B2B tool. The latter is a
narrower and more fragile moat, particularly in a market where BigBarn and the FRA
already occupy the "farm shop directory" mental model. ShopKit-First also makes the
portfolio engine harder to justify: a B2B SaaS product for farm shops does not
naturally extend to marina berths and campsites the way a consumer discovery platform
does.

**Verdict: INFERIOR.** The model inverts the correct validation sequence and trades
a network-effect moat for a less defensible B2B account relationship. Farmmap's
sequencing — build the consumer audience first, then convert shops — is the right
order. ShopKit-First makes the directory contingent on sales velocity before the
audience exists.

---

## Alternative 2 — FRA White-Label (Licence the Engine to the Trade Body)

The FRA White-Label model positions Farmmap as an infrastructure business rather than
a consumer brand. Instead of competing with the Farm Retail Association's existing
member directory, it approaches the FRA as a technology partner: licence the Farmmap
engine as their official digital directory. The FRA supplies member data and
credibility; Farmmap supplies the product and hosting. Revenue comes from a licence
fee plus a revenue share on paid tiers sold through the FRA channel.

The model has a genuine advantage on the supply side: the FRA has approximately 1,200
member businesses who trust the trade body, and an FRA-endorsed directory carries
instant credibility that an independent startup cannot replicate in year one. The
Saleability Critique identifies the "we've seen this before" farm shop owner objection
as one of the hardest barriers to Bronze conversion; an FRA endorsement would
materially soften it.

The structural problem is that the white-label arrangement collapses the portfolio
thesis. Farmmap's primary asset is an engine that can be reconfigured for any
discovery-deficient vertical market — marina berths, campsites, fishing venues,
craft breweries. That engine's value depends on its independence. A white-label
arrangement subordinates the product to a single industry body's priorities, gives
the FRA negotiating leverage at contract renewal, and creates a ceiling on vertical
expansion: the FRA's mandate does not extend to BerthMap or CampingMap.

The correct resolution, confirmed by the Better-Idea Generator, is to pursue a
data-sharing or endorsement arrangement with the FRA — not a white-label licence.
The FRA has data (member listings, benchmarking information) that would improve
Farmmap's supply-side quality. Farmmap has a modern product that the FRA cannot
easily replicate. A co-branded or endorsed relationship, in which Farmmap retains
full control of its roadmap and the FRA gains a better map product for its members,
serves both parties without conceding the portfolio asset.

**Verdict: INFERIOR as a primary model; VALUABLE as a side channel.** The white-label
model destroys the portfolio moat. A data-sharing or endorsement arrangement is
actively recommended and is listed as a carry-forward condition in the discovery
decision.

---

## Alternative 3 — VerticalKit (Platform-First Engine Licensing)

The VerticalKit model takes the most interesting analytical position of the three:
it does not propose a pivot so much as an explicit articulation of what the intake
document already implies. Rather than treating the multi-tenant engine as internal
infrastructure for Farmmap and its portfolio siblings, VerticalKit productises the
engine as a SaaS platform licensed to external operators — marina associations wanting
their own BerthMap, campsite networks wanting their own CampingMap — who run their
own branded directory instances. Farmmap earns from its own subscribers; the engine
earns from platform licensing to third-party operators.

The assessment is that this is a phase-two evolution, not a superior day-one
alternative. The intake already says that each additional vertical is "a configuration
file, a domain name, and a seed dataset once the engine is built." VerticalKit is
Farmmap with the engine productised for external use — which requires a more
sophisticated multi-tenant admin layer, external operator onboarding, and support
infrastructure that does not exist at Farmmap's stage. Building a platform from day
one adds complexity before the engine is proven, and the platform proposition requires
a reference case — a successful Farmmap — before it can be sold to third-party
operators. The sequencing is clear: Farmmap first, engine proof, then VerticalKit
as an optional phase-two revenue stream.

One nuance is worth preserving: VerticalKit represents an option on a higher ceiling.
If Farmmap proves the model and the engine is demonstrably replicable, the choice
between internalising all verticals (current plan) and licensing the engine to third
parties is a strategic decision for phase three, not phase one. The current plan to
own and operate all verticals is simpler and more capital-efficient at this stage.
Whether to license the engine later is an open question that the portfolio's success
should inform.

**Verdict: COMPARABLE — represents a phase-two expansion of the existing model, not
a superior alternative at this stage.** File for reconsideration once Farmmap and a
second internal vertical are operating.

---

## Overall Assessment

No alternative was found that is clearly superior to the Farmmap model as specified.
The three alternatives collectively affirm that the core structure — free consumer
directory driving supply-side commercial tiers, shared engine enabling portfolio
expansion — is the strongest available model for this problem and this founder's
starting position. The weakness identified by all three assessments is not the model
but execution on cold-start consumer acquisition, and none of the alternatives
resolves that problem more cleanly than Farmmap does.

---

*Produced by: discovery-squad-lead | squad: discovery-and-validation*
*Authority: specs/003-farmmap/discovery-pack/better-idea.md*
