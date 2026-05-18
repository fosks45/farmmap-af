---
feature: 003-farmmap
phase: 4.5
document: funding-requirements
squad: business-plan
produced_by: business-plan-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/business-plan-pack/financial-model.md
  + specs/003-farmmap/viability-gate.md
  + specs/003-farmmap/market-pack/tam-sam-som.md
---

# Farmmap — Funding Requirements

## Summary Recommendation

**Bootstrap.** Farmmap can be built, launched, and operated on personal capital of
£5,000 through Year 1, with the business approaching revenue self-sufficiency on
direct costs by Year 2 and approaching break-even (including a modest founder salary)
between Month 42 and Month 48 on the base case. Angel seed is unnecessary in Year 1
and counterproductive in Year 2 unless Bronze conversion falls to the 3% downside
case. Innovate UK grant is a low-cost, non-dilutive option worth pursuing in Q2 of
Year 1 but not a dependency.

---

## Option 1: Bootstrap (Recommended)

**Funding source:** Personal capital injection of £5,000 at launch.

**Why bootstrap is viable:**

The Year 1 financial model is tight — a closing balance of approximately –£360 on
the base case — but it is tight in a manageable way. The two largest Year 1 cost
lines (content production at £3,000 and legal/compliance at £3,000) are both
controllable in timing. Content can be staged at one county guide article per
fortnight rather than commissioned in bulk. Legal costs (privacy policy, ToS drafting,
FRA agreement review) are event-triggered and can be sequenced across Q2–Q4 of Year 1
as each compliance gate is approached. The platform cost line is essentially zero in
Year 1 (Supabase free tier, Vercel free tier); infrastructure cost only materialises
at Month 6 when Bronze subscribers and marketplace traffic justify it.

The product self-funds after Month 18 on the base case. Bronze subscription revenue
(£4,560 in Year 2 before Silver launches) covers direct costs and a meaningful
fraction of the content/moderation contractor cost. Silver commission revenue (£1,152
in Year 2 H2) further reduces the gap. The Year 2 EBITDA deficit (–£52,928) is
predominantly the founder salary line (£40,000). Without a founder salary, Year 2
EBITDA is approximately –£12,928 — a gap that is bridgeable from personal savings or
a part-time consulting arrangement rather than requiring external capital.

**First hire: part-time content and moderation contractor (Month 20):**
The financial model budgets £12,000/year for a content/moderation contractor from
Year 2. At Month 20, Bronze revenue should be generating approximately £3,500/month
(30+ subscribers × £20/month × some conversion uplift from Silver launch) and Silver
commission revenue beginning. This revenue base supports a part-time contractor at
£1,000/month (roughly 2 days per week) without requiring external funding. The
contractor handles the moderation queue and content production, freeing the founder
for commercial development and Bronze-to-Silver conversion work. This is the hire
that de-risks the solo founder incapacity risk (see risk-register.md ER-01).

**Personal capital management during Year 1:**
The £5,000 injection is not all required on Day 1. Recommended staging:
- Month 1: Domain renewal, Supabase Pro (if needed immediately), legal letterhead for
  yourhonestybox.com agreement: ~£500
- Months 2–4: First six county guide articles (£600 at £100/article commissioning
  cost or founder-written): ~£600
- Months 5–8: Legal review (ToS, privacy policy, FRA agreement): ~£2,000
- Months 9–12: Remaining content spend, tools, misc: ~£1,900

This staging makes the cash position at Month 6 approximately £1,500 positive —
a meaningful buffer before the legal costs land in Q3–Q4.

---

## Option 2: Innovate UK SMART Grant

**Type:** Non-dilutive public grant. Innovate UK SMART (Small Business Research
Initiative variant) grants of £25,000–£100,000 are available for early-stage digital
innovation with a demonstrable market opportunity and a credible team.

**Applicability:** Farmmap's AgriTech angle (solving digital discovery for the
agricultural direct-sales sector; economic value recovery for farms diversifying
under ELM transition) maps directly to DEFRA's and Innovate UK's stated rural
digitalisation priorities for 2025–2027.

**Advantages over equity:** Non-dilutive; no governance obligations; no investor
reporting; receipt within 6–9 months of application if successful.

**Disadvantages:**
- Application process is time-intensive (typically 4–6 weeks to write a strong
  application)
- No certainty; success rate on SMART applications is 15–25% for strong applicants
- Receipt timeline (6–9 months) means it cannot solve a Year 1 cash crisis; it is
  a Year 2 accelerant, not a Year 1 backstop
- If the grant is received, Innovate UK requires IP to remain UK-based and may impose
  reporting requirements; neither is problematic for Farmmap but both require
  management attention

**Recommendation:** Submit a SMART application in Q2 of Year 1 (Months 3–6) as a
parallel track, not a dependency. If successful, the grant is deployed in Year 2 to
accelerate the content programme and partially fund the founder salary, reducing
the Year 2 EBITDA deficit from –£52,928 to approximately –£28,000 (if £25,000
grant is received). Break-even advances from Month 42–48 to approximately Month 36.
If unsuccessful, the bootstrap plan is unchanged and the application effort was
bounded to 4–6 weeks.

---

## Option 3: Angel Seed Round

**Type:** Equity. Seed round of £100,000–£250,000 in exchange for approximately
10–20% equity stake. Typical UK angel seed terms in 2025/26 for pre-revenue digital
product companies.

**When angel funding makes sense:**
If Bronze conversion falls to the 3% downside case by Month 9 and traffic is below
30,000 monthly visitors, the bootstrap path closes. At that point, the model does not
break even without external funding, and a solo founder cannot cover a £40,000 salary
from £26,000 Year 3 revenue at the downside case. An angel round of £100,000 provides
approximately 18 months of extended runway to reach the base case Bronze trajectory
before considering options.

Angel funding also makes sense if the FRA partnership produces a dramatically faster
than expected Bronze uptake — a scenario where hiring a second commercial person in
Year 2 would accelerate the portfolio engine investment gate from Month 18 to
Month 12. This is a best-case scenario trigger, not a base case assumption.

**Disadvantages at this stage:**
Farmmap has not yet launched. Angel investors in AgriTech or directory SaaS will
apply significant discounts to a pre-revenue product's valuation. A £100,000 raise
at 20% equity values the business at £500,000 pre-money — achievable if the FRA
relationship, the yourhonestybox.com partnership, and the 953-listing seed database
are credibly presented as de-risking factors. However, fundraising at this stage
requires 2–3 months of the founder's time and carries real opportunity cost against
the content programme and FRA relationship that are more immediate commercial
priorities.

**Recommendation:** Defer angel funding consideration until the 3% downside case
is confirmed (Month 9 review) or until Farmmap reaches 50 Bronze subscribers
and needs to accelerate to 100+ faster than the bootstrap plan permits. Do not
raise angel seed pre-launch — the product is more fundable post-launch with traffic
data than pre-launch with projections.

---

## Funding Decision Matrix

| Scenario | Recommended Action |
|---|---|
| Base case on track (6% Bronze conversion, 40k+ traffic at Month 6) | Continue bootstrap; submit Innovate UK application Q2 Year 1 |
| Below plan but recoverable (3–4% conversion, 20k–40k traffic) | Increase outreach spend; consider Innovate UK application urgently; defer founder salary to Year 3 |
| Downside case confirmed (3% or below, < 20k traffic at Month 9) | Evaluate angel seed round immediately; or wind down and redirect to TractorMap with lessons learned |
| Outperforming plan (8%+ conversion, 80k+ traffic at Month 6) | Evaluate angel seed to accelerate portfolio engine; 100 Bronze subscriber gate may be reachable by Month 12 |

---

*Produced by: business-plan-lead | squad: business-plan*
*Authority: financial-model.md + viability-gate.md + tam-sam-som.md*
*Phase: 4.5 | Feeds: specs/003-farmmap/business-plan-pack/business-plan-decision.md*
