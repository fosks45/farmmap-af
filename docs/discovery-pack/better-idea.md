---
spec: 003-farmmap
squad: discovery-and-validation
agent: better-idea-generator
model: claude-sonnet-4-6
phase: 1
produced_at: 2026-05-16T00:00:00Z
---

# Better-Idea Assessment — Farmmap

## Context

Farmmap solves three layered problems: consumer discovery of farm shops and honesty
boxes, affordable digital presence for farm shops, and a portfolio engine for adjacent
verticals. Any credible alternative must address at least the first two and ideally
preserve or strengthen the third.

The founder holds farmmap.co.uk, has 953 seeded listings, and the yourhonestybox.com
Ireland/NI data is already in the seed set. Switching costs are real. The benchmark
is therefore not "could this alternative win in a vacuum" but "is this alternative
clearly superior enough to justify abandoning the domain, data, and work already done."

---

## Alternative 1 — B2B-First: Sell the Shop, Let the Directory Grow

**Name:** ShopKit-First

**Mechanism:** Instead of building the public directory first and then selling tiers
to shops, invert the funnel: approach farm shops directly with a standalone digital
shopfront product (branded page, order management, stock, Stripe). Each subscribing
shop opts in to public listing on a map. The directory is a byproduct of the B2B
install base rather than the primary product shops are recruited into. Marketing
pitch is "your online shop" not "get listed."

**Comparison vs Farmmap:**

| Dimension | ShopKit-First | Farmmap |
|---|---|---|
| Cheaper to build | No — same tech stack, less deferred | Yes — free tier is thin |
| Faster to market | Slower — must close B2B sales before directory has value | Faster — free directory is day-one |
| More defensible | Higher per-account switching cost | Lower switching cost but network defensibility |
| Fit to problem | Solves shop problem; discovery problem emerges late | Solves both simultaneously |
| Portfolio moat | Weaker — vertical engine harder to justify to B2B buyers | Stronger — multi-tenant engine is explicit |

**Assessment:** The B2B-first inversion trades the hardest part of Farmmap (cold-start
consumer discovery) for the hardest part of B2B SaaS (enterprise sales motion at low
ACV). The shop's primary pain is being invisible — which the ShopKit-First approach
also cannot solve on day one without a consumer base. The Farmmap model sequences
this correctly: build the audience on the free tier, then convert shops. ShopKit-First
makes the directory contingent on sales velocity, which slows both sides of the market.

**Rating: INFERIOR**

---

## Alternative 2 — Partnership Model: License the Engine to the Farm Retail Association

**Name:** FRA-White-Label

**Mechanism:** Rather than competing with the Farm Retail Association's existing
member directory, approach them as a technology partner. License the Farmmap engine
to the FRA as their official digital directory — they supply the member data and
trust, Farmmap supplies the product and hosts it. Revenue comes from a licence fee
plus a revenue share on Bronze/Silver tiers sold through the FRA channel. Farmmap
is an infrastructure business, not a consumer brand.

**Comparison vs Farmmap:**

| Dimension | FRA-White-Label | Farmmap |
|---|---|---|
| Cheaper to build | No — same build, different go-to-market | Comparable |
| Faster to market | Potentially faster on supply side (FRA provides data) | Slower supply-side cold start |
| More defensible | Single-customer concentration risk; FRA can renegotiate | Portfolio diversification is the moat |
| Fit to problem | Solves discovery well; reduces founder control of roadmap | Full control, full upside |
| Portfolio moat | Severely weakened — FRA owns vertical relationships | Intact |

**Assessment:** The FRA partnership collapses the portfolio thesis. If Farmmap's
value is an engine that spins up TractorMap, BerthMap, BrewMap etc., that engine's
independence is the asset. A white-label arrangement subordinates the product to a
single industry body's priorities and creates a ceiling on vertical expansion. The
partnership is worth exploring as a data supply and credibility play (FRA endorsement
or data licence), but not as the primary business model. Concretely: pursue FRA
for a data-sharing agreement, not a white-label licence.

**Rating: INFERIOR as a primary model. VALUABLE as a side channel for supply-side data.**

---

## Alternative 3 — Platform-First: Build "VerticalKit" and Launch Farmmap as Instance Zero

**Name:** VerticalKit

**Mechanism:** Reframe the pitch and the product. Instead of "we are building a farm
shop finder," build "a white-label engine for hyper-local vertical directories" and
launch Farmmap as the first, fully-owned instance that proves the model. The engine
is sold as SaaS to operators in other verticals (marina operators, campsite aggregators,
forecourt networks) who want their own branded map directory without building from
scratch. Farmmap earns from its own subscribers; the engine earns from platform
licensing fees to third-party directory operators.

**Comparison vs Farmmap:**

| Dimension | VerticalKit | Farmmap |
|---|---|---|
| Cheaper to build | No — adds a multi-tenant admin layer for external operators | Yes — internal multi-tenancy is simpler |
| Faster to market | Slower — platform sales require a proven reference case first | Faster — Farmmap is the reference case |
| More defensible | Stronger — platform lock-in across verticals | Dependent on Farmmap's own moat |
| Fit to problem | Same fit for farm shops; adds a parallel revenue stream | Focused fit |
| Portfolio moat | Highest theoretical ceiling; hardest to execute first | Portfolio model already implied in intake |

**Assessment:** This is not a better idea so much as the explicit articulation of
what the intake document already implies. The intake names six portfolio verticals
and says "each is a configuration file and a domain name once the engine is built."
VerticalKit is Farmmap with the engine productised for third parties — a logical
phase-two evolution, not a pivot. Building it as a platform from day one adds
complexity before the engine is proven. The correct sequencing is: build Farmmap,
prove the engine on Farmmap's own revenue, then offer VerticalKit as a product to
operators who want a turnkey solution. The portfolio thesis is already validated by
the intake's own reasoning — the question is whether to internalise all verticals
(current plan) or license them (VerticalKit). Licensing adds optionality at the cost
of focus.

**Rating: COMPARABLE — represents a phase-two expansion of the existing model, not
a superior alternative at this stage.**

---

## Summary Assessment

None of the three alternatives clearly dominates the Farmmap model as specified.
The B2B-first inversion creates a worse sequencing problem. The FRA white-label
collapses the portfolio moat. The VerticalKit reframe is the most compelling but
is already implicit in the intake and is better executed as a deliberate phase two
than a day-one pivot.

The Farmmap model is structurally sound: free directory attracts consumer demand,
consumer demand creates leverage to convert shops, shop revenue funds the engine,
the engine funds portfolio expansion. The sequencing is correct. The weakest point
is not the model but execution risk on cold-start consumer acquisition — which no
alternative resolves more cleanly.

**One actionable recommendation from this assessment:**
Pursue a data-sharing arrangement with the Farm Retail Association (not a white-label
licence) to accelerate supply-side data quality and confer credibility. This strengthens
Farmmap without conceding the portfolio thesis.

---

```yaml
superior-alternative-found: false
alternatives-assessed: 3
recommendation: proceed-with-proposal
strongest-alternative: VerticalKit
portfolio-strategy-validated: true
```
