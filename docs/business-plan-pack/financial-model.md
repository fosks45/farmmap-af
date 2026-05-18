---
feature: 003-farmmap
phase: 4.5
document: financial-model
squad: business-plan
produced_by: business-plan-lead
produced_at: 2026-05-16T00:00:00Z
authority: >
  specs/003-farmmap/market-pack/tam-sam-som.md
  + specs/003-farmmap/market-pack/pricing-hypothesis.md
  + specs/003-farmmap/discovery-pack/value-bench.md
  + specs/003-farmmap/viability-gate.md
---

# Farmmap — Financial Model

## Notation

All figures labelled with their evidential status:
- **[FACT]** — from a named, verifiable primary source
- **[INFERENCE]** — arithmetic derived from cited facts
- **[ASSUMPTION]** — stated estimate where primary data is unavailable

---

## Revenue Streams

| Stream | Rate | Trigger |
|---|---|---|
| Free tier | £0 | Essential for directory density; no revenue |
| Bronze subscription | £20/month per shop | Monthly, recurring |
| Silver subscription | £60/month per shop | Monthly, recurring |
| Silver commission | 3% of order subtotal where ≥ £20 | Per transaction |
| Gold subscription | £100/month per shop | Monthly, recurring |
| Gold commission | 5% of order subtotal where ≥ £30 | Per transaction |
| Newsletter add-on (Bronze) | £50 per campaign | Infrequent, one-off |
| Social post add-on (Bronze) | £50 per campaign | Infrequent, one-off |
| Newsletter add-on (Silver) | £100 per campaign | Infrequent, one-off |

Campaign add-on frequency modelled at 2 campaigns per Bronze shop per year and 1 per Silver shop per year — [ASSUMPTION] based on typical SMB promotional cadence for seasonal businesses.

---

## Funnel Assumptions

### Supply-Side Universe

- Total UK + Ireland farm shops and honesty boxes: ~5,700 [FACT — derived from FRA member and non-member estimate of 3,000–3,500 UK farm shops, ~700 Ireland/NI farm shops and honesty boxes, and ~1,500–2,000 UK honesty boxes; see tam-sam-som.md]
- Listings seeded at launch: 953 [FACT — intake.md]

### Claim Rate Progression

| Milestone | Month | Claimed listings | Rate |
|---|---|---|---|
| Month 12 | 12 | ~143 | 15% of 953 [ASSUMPTION — realistic for organic claim + traffic-triggered outreach; saleability-critique.md modelled 10–15% as base case at month 12] |
| Month 18 | 18 | ~238 | 25% of 953 [ASSUMPTION] |
| Month 24 | 24 | ~333 | 35% of 953 [ASSUMPTION] |
| Month 36 | 36 | ~477 | 50% of 953 [ASSUMPTION — value-bench.md used 50% as the mature claim rate assumption] |

### Paid Conversion: Base Case

| Month | Claimed | Bronze shops | Silver shops | Gold shops |
|---|---|---|---|---|
| 12 | 143 | ~9 (6% of claimed) | 0 | 0 |
| 18 | 238 | ~19 (8%) | 0 | 0 |
| 24 | 333 | ~33 (10%) | ~17 (5%) | 0 |
| 36 | 477 | ~57 (12%) | ~33 (7%) | ~10 (2%) |

Conversion percentages are [ASSUMPTION]. Basis: saleability-critique.md modelled free-to-paid conversion at 4–8% within 12 months of claim; progression to 10–12% by Year 3 is consistent with Bronze proving value via the analytics dashboard (F22) and traffic-triggered email programme.

Silver opens at Month 18 per the spec (Silver unlocks when a Bronze shop has a waitlist of 20+ sign-ups — F6). Gold is gated at 3 months on Silver + 50+ completed orders (spec open question 5 decision).

### GMV Assumptions

- Average Silver GMV per shop per month: **£800** (conservative) [ASSUMPTION — value-bench.md modelled base case at £1,800/month; this model uses £800 in the early phase, rising to £1,200 by Year 3 as marketplace matures. £800/month approximates a farm shop processing 40 orders at £20 average basket — consistent with a Silver shop in early marketplace operation]
- Average Silver GMV by Year 3: **£1,200/month per shop** [ASSUMPTION]
- Average Gold GMV per shop per month: **£2,500** [ASSUMPTION — value-bench.md modelled base at £5,000; £2,500 is the conservative early-phase figure for Gold shops (gated at 50+ completed Silver orders before Gold eligibility, so Gold shops are genuinely active before upgrade)]
- Average Gold GMV by Year 3: **£3,500/month per shop** [ASSUMPTION]

---

## Year 1, 2, 3 Summary P&L

### Direct Cost Assumptions

**Stripe fees** [FACT — Stripe UK published pricing 2025]:
- Subscription payments: 2.9% + £0.30 per transaction
- Stripe Connect payouts (commission on marketplace orders): 0.25% per transfer

**Hosting**:
- Supabase: free tier at launch; ~£50/month by end of Year 2 when active paying subscribers and marketplace transactions warrant the Pro plan [ASSUMPTION]
- Vercel: free tier at launch; ~£20/month by Year 2 at meaningful traffic [ASSUMPTION]

**Stripe cost model detail:**
For a Bronze subscriber charged £20/month: Stripe fee = £0.88 (2.9% + £0.30). Net subscription revenue per Bronze shop = £19.12/month.
For commission payouts: Stripe charges 0.25% of the transfer amount. On a £1,000 GMV basket of Silver orders, Farmmap's 3% commission = £30; Stripe's 0.25% on the payout = £2.50. Net commission contribution = £27.50.

---

### Year 1 P&L (Month 1–12)

**Funnel state at Year 1 end (Month 12):**
- Bronze shops: 9 paying (reaching ~9 by December) — modelled as 4 average across Year 1 given ramp
- Average Bronze shops active during Year 1: 4 [ASSUMPTION — ramp from 0 at launch to 9 by month 12; mid-point approximation]
- Silver shops: 0 (Silver not yet live)
- Gold shops: 0

**Year 1 Revenue:**

| Line | Calculation | Amount |
|---|---|---|
| Bronze subscriptions | 4 avg shops × £20/mo × 12 months | £960 |
| Campaign add-ons | 4 shops × 2 campaigns × £50 | £400 |
| **Total Revenue** | | **£1,360** |

**Year 1 Direct Costs:**

| Line | Amount |
|---|---|
| Stripe subscription fees (2.9%+£0.30 on £960 subscriptions) | ~£120 |
| Hosting (Supabase free → basic; Vercel free) | £0–£100 |
| **Total Direct Costs** | **~£220** |

**Year 1 Gross Profit: ~£1,140**

**Year 1 Operating Costs:**

| Line | Amount |
|---|---|
| Founder salary | £0 (Year 1: bootstrapped; personal capital injection covers living costs) [ASSUMPTION] |
| Content/marketing budget | £3,000 (SEO content: county guide articles, schema markup, PR outreach) [ASSUMPTION] |
| Legal/accounting | £3,000 (ToS, privacy policy, FRA partnership legal, yourhonestybox.com agreement) [ASSUMPTION] |
| Other (tools, domains, misc) | £500 |
| **Total Operating Costs** | **£6,500** |

**Year 1 EBITDA: –£5,360**

**Year 1 Cash Flow (starting with £5,000 personal capital injection):**
Opening balance: £5,000
Revenue received: £1,360
Costs paid: £6,500 + £220 = £6,720
**Closing Year 1 balance: –£360**

Note: The £5,000 personal capital injection is consumed during Year 1 on content and legal costs. The business is technically cash-negative by £360 at Year 1 end on the base case. This is manageable if the £3,000 content spend is staged across the year and the £3,000 legal budget is partially deferred to Q3–Q4 when compliance gating requires it.

---

### Year 2 P&L (Month 13–24)

**Funnel state during Year 2:**
- Bronze shops: average 19 (reaching 33 by Month 24, growing from 9 at Month 12)
- Silver shops: live from approximately Month 18; average 8 active during Year 2 [INFERENCE from funnel]
- Gold shops: 0 in Year 2 (Gold requires Silver tenure; not achievable before early Year 3)
- Average GMV per Silver shop: £800/month

**Year 2 Revenue:**

| Line | Calculation | Amount |
|---|---|---|
| Bronze subscriptions | 19 avg shops × £20/mo × 12 | £4,560 |
| Silver subscriptions | 8 avg shops × £60/mo × 6 months (H2 only) | £2,880 |
| Silver commission | 8 shops × £800 GMV × 3% × 6 months | £1,152 |
| Campaign add-ons | 19 Bronze × 2 × £50 + 8 Silver × 1 × £100 | £2,700 |
| **Total Revenue** | | **£11,292** |

**Year 2 Direct Costs:**

| Line | Amount |
|---|---|
| Stripe fees (subscriptions + commission payouts) | ~£800 |
| Hosting (Supabase Pro ~£50/mo from Q3; Vercel ~£20/mo from Q3) | ~£420 |
| **Total Direct Costs** | **~£1,220** |

**Year 2 Gross Profit: ~£10,072**

**Year 2 Operating Costs:**

| Line | Amount |
|---|---|
| Founder salary | £40,000 [ASSUMPTION — Year 2: product is generating revenue; founder takes modest salary from Year 2] |
| Content/moderation contractor | £12,000 (part-time; SEO content + moderation queue support) [ASSUMPTION] |
| Marketing/SEO | £8,000 (content programme: county guides, agricultural press) [ASSUMPTION] |
| Agricultural show presence | £0 in Year 2 — deferred to Year 3 when brand is established |
| Legal/accounting | £3,000 [ASSUMPTION] |
| **Total Operating Costs** | **£63,000** |

**Year 2 EBITDA: –£52,928**

**Year 2 Cash position:**
The Year 2 EBITDA deficit of £52,928 is the critical funding challenge. On the base case, bootstrapped operation cannot sustain a £40,000 founder salary in Year 2 without external funding or a decision to defer the salary until Year 3. See Funding Requirements document for pathway analysis.

---

### Year 3 P&L (Month 25–36)

**Funnel state during Year 3:**
- Bronze shops: average 45 (reaching 57 by Month 36, from 33 at Month 24)
- Silver shops: average 25 (reaching 33 by Month 36)
- Gold shops: average 5 (reaching 10 by Month 36, first Gold shops eligible mid-Year 3)
- Average GMV per Silver shop: £1,200/month
- Average GMV per Gold shop: £2,500/month

**Year 3 Revenue:**

| Line | Calculation | Amount |
|---|---|---|
| Bronze subscriptions | 45 avg shops × £20 × 12 | £10,800 |
| Silver subscriptions | 25 avg shops × £60 × 12 | £18,000 |
| Silver commission | 25 shops × £1,200 GMV × 3% × 12 | £10,800 |
| Gold subscriptions | 5 avg shops × £100 × 12 | £6,000 |
| Gold commission | 5 shops × £2,500 GMV × 5% × 12 | £7,500 |
| Campaign add-ons | 45 Bronze × 2 × £50 + 25 Silver × 1 × £100 | £7,000 |
| **Total Revenue** | | **£60,100** |

**Year 3 Direct Costs:**

| Line | Amount |
|---|---|
| Stripe fees (subscriptions + commission payouts) | ~£3,200 |
| Hosting (Supabase Pro + Vercel Pro) | ~£840 |
| **Total Direct Costs** | **~£4,040** |

**Year 3 Gross Profit: ~£56,060**

**Year 3 Operating Costs:**

| Line | Amount |
|---|---|
| Founder salary | £55,000 [ASSUMPTION — Year 3 increase reflecting product maturity and revenue growth] |
| Content/moderation contractor | £12,000 [ASSUMPTION] |
| Marketing/SEO | £15,000 (FRA show, county content programme, social) [ASSUMPTION] |
| Agricultural show presence | £5,000 (Royal Highland, Royal Bath & West, or county show TBD) [ASSUMPTION] |
| Legal/accounting | £3,000 [ASSUMPTION] |
| **Total Operating Costs** | **£90,000** |

**Year 3 EBITDA: –£33,940**

---

### Three-Year Summary Table

| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Bronze shops (year-end) | 9 | 33 | 57 |
| Silver shops (year-end) | 0 | 17 | 33 |
| Gold shops (year-end) | 0 | 0 | 10 |
| Total Revenue | £1,360 | £11,292 | £60,100 |
| Direct Costs | £220 | £1,220 | £4,040 |
| Gross Profit | £1,140 | £10,072 | £56,060 |
| Gross Margin | 84% | 89% | 93% |
| Operating Costs | £6,500 | £63,000 | £90,000 |
| EBITDA | –£5,360 | –£52,928 | –£33,940 |
| Founder Salary included | £0 | £40,000 | £55,000 |

---

## Break-Even Analysis

Break-even (all operating costs covered, including founder salary) requires MRR that covers the monthly operating cost run rate.

**Year 3 monthly operating cost run rate:** £90,000 ÷ 12 = £7,500/month

**MRR composition needed at break-even:**

| Tier | Unit MRR (net of Stripe) | Shops needed at break-even |
|---|---|---|
| Bronze only | ~£19/shop/month | 395 Bronze shops |
| Mixed tier (realistic) | varies | ~200 Bronze + 40 Silver + 12 Gold would yield ~£7,400 MRR [INFERENCE] |

At the base-case growth trajectory, break-even is not reached within the 3-year model horizon. Monthly revenue at Year 3 end (Month 36) is approximately £5,008/month (£60,100 / 12), against a monthly operating cost run rate of £7,500.

**Break-even month (base case): approximately Month 42–48** [INFERENCE — extrapolating the Year 3 subscriber growth trajectory; assumes Bronze reaches ~75–80, Silver ~45–50, Gold ~15–20 by Month 48].

**Break-even month (without founder salary in Year 1–2):** Approximately Month 30–34 — the business covers hosting, legal, and content costs at approximately 80 Bronze subscribers with no founder salary component.

---

## Sensitivity Analysis: Bronze Conversion at 3% (Half Base Case)

Base case assumed 6% of claimed listings convert to Bronze. If conversion is 3% — reflecting a harder demographic, slower traffic build, or absence of FRA partnership:

| Metric | Base Case | Sensitivity (3% conversion) |
|---|---|---|
| Bronze shops at Month 12 | 9 | 4 |
| Bronze shops at Month 24 | 33 | 17 |
| Bronze shops at Month 36 | 57 | 28 |
| Silver shops at Month 36 | 33 | 12 (fewer Bronze means fewer Silver-eligible shops) |
| Year 3 Revenue | £60,100 | ~£26,000 [INFERENCE] |
| Year 3 EBITDA | –£33,940 | ~–£67,000 |
| Break-even month | ~Month 42–48 | Month 60+ |

**Implication:** At 3% Bronze conversion, the product does not break even within a 5-year horizon without either reducing founder salary expectations below £40k or securing external funding to extend runway. This is the scenario where angel funding becomes non-optional rather than optional. The 3% sensitivity scenario underscores why FRA partnership (which warms cold outreach to ~3× conversion) and consumer traffic (which enables traffic-triggered email, the lowest-CAC acquisition channel) are the two most important variables in the model.

---

## Notes on Model Limitations

1. This model uses the launch listing base of 953. Organic listing growth (farm shop owners self-submitting new listings) is not modelled on the revenue side. Each new listing is a potential future claimant and subscriber; growth in total listings compounds the addressable base over time.

2. Campaign add-on revenue is treated as a rounding item (~10% of subscription revenue). In practice, seasonal campaigns (Christmas, Easter, summer) could drive higher add-on frequency.

3. The Gold commission cap risk (pricing-hypothesis.md: 5% becomes a retention risk above £8,000/month GMV) is not modelled here because Gold shops are unlikely to reach £8,000+ GMV within the 3-year horizon at the conservative GMV assumptions used. This risk materialises in Years 4–5 and should be addressed in the V3 commercial model specification.

4. Multi-tenant portfolio revenues (TractorMap, BerthMap etc.) are excluded from this model. The portfolio multiplier thesis is addressed in the Funding Requirements document.

---

*Produced by: business-plan-lead | squad: business-plan*
*Authority: market-pack/ + discovery-pack/ + viability-gate.md | Phase: 4.5*
*Feeds: specs/003-farmmap/business-plan-pack/business-plan-decision.md*
