---
feature: 003-farmmap
phase: 4.5
document: risk-register
squad: business-plan
produced_by: business-plan-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/viability-gate.md
  + specs/003-farmmap/discovery-pack/saleability-critique.md
  + specs/003-farmmap/compliance-pack/compliance-decision.md
  + specs/003-farmmap/market-pack/competitor-matrix.md
---

# Farmmap — Risk Register

Minimum 16 risks across four categories. Each risk includes: description, likelihood
(1–5), impact (1–5), risk score (L×I), and mitigation.

---

## Category 1: Market Risks

---

### MR-01 — Farm Shop Owner Adoption Slower Than Modelled

**Description:** The base case assumes 15% of seeded listings are claimed by Month 12
and 6% of claimed listings convert to Bronze. Both rates depend on consumer traffic
proving the discovery value and farm shop owners having bandwidth to engage with a
new digital channel. The 50–70 demographic's prior directory scepticism (BigBarn
experience) is documented in the saleability critique. If organic claim rate is 5%
not 15%, and conversion is 2% not 6%, Bronze revenue is materially lower than modelled.

**Likelihood:** 3 (possible — the FRA partnership and traffic-triggered email
de-risk this; the downside is documented, not speculative)
**Impact:** 5 (critical — Bronze revenue is the foundation of every other
commercial metric; a miss here delays break-even by 18–24 months)
**Risk Score:** 15 (HIGH)

**Mitigation:**
- Traffic-triggered email as the primary acquisition mechanic (auto-fires when threshold
  is crossed; no rep required)
- FRA partnership pursuit from Month 1 (warm referral converts at 3× cold outreach)
- 90-day trial for first 50 subscribers reduces conversion barrier
- Monthly review of claim rate vs. projection; if below 10% by Month 6, accelerate
  direct outreach programme and agricultural show presence
- Downside case modelled at 3% conversion (see financial-model.md) — confirms
  bootstrap is still viable if founder defers salary to Year 3

---

### MR-02 — Google Maps Adds Native Farm Shop Filter or Category

**Description:** Google Maps introduces a "farm shops" filter, a "honesty boxes"
category, or a "local food" discovery feature that provides the core J1 use case
without requiring a visit to Farmmap. Google has the consumer install base and the
location data to replicate the map interface immediately; the question is whether the
honesty box long-tail and the SEO content surface are defensible.

**Likelihood:** 2 (unlikely in the 12–24 month window; Google Maps filters are slow to
add and require volume of verified data that Farmmap will have before Google)
**Impact:** 4 (significant — undermines the J1 impulse-discovery use case; would
reduce top-of-funnel traffic materially)
**Risk Score:** 8 (MEDIUM)

**Mitigation:**
- Build the SEO content surface (county guides, long-tail articles) as the primary
  durable traffic asset; these rank for queries Google Maps does not serve
- Establish the review and ratings layer (F5) as rapidly as possible; Google Maps
  has farm shop reviews but no curated honesty box review corpus
- The Bronze/Silver/Gold commercial stack does not depend on Google Maps not having
  a farm shop filter; it depends on Farmmap having a richer product and owner
  analytics that Google never offers
- Speed to market is the primary mitigation: establishing Farmmap's SEO authority
  in farm shop and honesty box queries before Google builds a competing product

---

### MR-03 — yourhonestybox.com Develops UK Product

**Description:** yourhonestybox.com is currently Ireland/NI focused and growing at
20–25%/year. If they decide to expand to mainland UK — either organically or with
a funding round — they become a direct competitor with an existing brand, community
trust, and a data set that partially overlaps with Farmmap's honesty box listings.

**Likelihood:** 2 (currently no UK expansion signals; partnership relationship
changes the competitive dynamic; they are more likely to remain Ireland/NI focused)
**Impact:** 3 (moderate — they would enter Farmmap's weakest segment, not
threaten the farm shop core; their brand is Irish-specific)
**Risk Score:** 6 (MEDIUM)

**Mitigation:**
- Formalise yourhonestybox.com partnership before V1 launch; a formal data licence
  or co-branding agreement creates alignment that makes UK expansion as a competitor
  economically irrational (they would be competing with their own partner)
- Establish Farmmap's UK honesty box SEO authority in the first 6 months; ranking
  for "honesty boxes near me" queries before yourhonestybox.com expands is the
  primary moat
- If partnership fails, the 336 Irish listings remain Farmmap's unique asset in
  the ROI/NI market regardless of a yourhonestybox.com UK expansion

---

### MR-04 — yourhonestybox.com Partnership Fails or Is Withdrawn

**Description:** The yourhonestybox.com partnership is a viability gate condition
and a credibility asset. If the formal agreement fails to materialise, or if
yourhonestybox.com withdraws consent for commercial use of the 336 listings, the
Irish market SEO coverage is reduced and the PR launch angle loses its most credible
partnership story.

**Likelihood:** 2 (consent is confirmed; the relationship exists; formal agreement
is a formalisation of an existing cooperative position, not a new ask)
**Impact:** 3 (moderate — the 336 listings are a subset of 953 total; UK-only
launch remains viable; the PR angle is weakened, not destroyed)
**Risk Score:** 6 (MEDIUM)

**Mitigation:**
- Prioritise the formal agreement in the first 60 days; do not approach V1 launch
  without written confirmation
- Compliance condition V1-C3 is a hard blocker: the 336 listings are not served
  publicly until written consent is documented
- Develop a UK-only PR angle in parallel: "The first complete map of Britain's farm
  shops and honesty boxes" is independently compelling without the Irish dimension
- The UK farm shop coverage (617 of 953 seeded listings) is not dependent on
  yourhonestybox.com

---

### MR-05 — Farm Retail Association Builds Its Own Directory

**Description:** The FRA currently operates a member directory that is basic and
outdated. If the FRA decides to invest in its own modern directory product — either
by commissioning a rebuild of their existing system or partnering with BigBarn — it
would deploy to 1,200 member businesses with inherent credibility, removing
Farmmap's primary warm-referral channel.

**Likelihood:** 2 (FRA has not invested in its digital product in years; its net
assets do not suggest capacity for a significant technology investment; the correct
mitigant is speed and partnership, not waiting)
**Impact:** 4 (significant — FRA members are the highest-value Bronze addressable
segment; losing warm-referral access forces all acquisition to cold outreach)
**Risk Score:** 8 (MEDIUM)

**Mitigation:**
- Pursue FRA partnership before V1 launch; offer data-sharing or co-branding
  rather than a white-label arrangement (white-label subordinates Farmmap's roadmap)
- The correct FRA pitch: "We will build the modern directory your members deserve,
  and credit the FRA on every listing" — make the FRA a partner, not a competitor
- Speed to market: the FRA's decision to build its own product is unlikely within
  18 months; getting to 100 Bronze subscribers before that decision is made proves
  Farmmap's credibility as the sector's preferred digital partner

---

### MR-06 — Consumer Traffic Fails to Reach 100k Monthly Visitors by Month 12

**Description:** The 100,000 monthly visitor target underpins every Bronze sales
conversation. If SEO execution is weak, content programme is under-resourced, or
Core Web Vitals penalties suppress ranking, traffic may stall at 20,000–40,000
monthly visitors. At that level, the Bronze pitch cannot demonstrate meaningful
consumer reach and conversion drops to the 1–2% range.

**Likelihood:** 3 (realistic risk; comparable new-entrant directories reach
20,000–40,000 in 12 months without a dedicated content programme; 100k requires
execution discipline that may exceed a solo founder's bandwidth)
**Impact:** 4 (significant — the entire commercial model requires traffic as the
prerequisite for every paid conversion)
**Risk Score:** 12 (HIGH)

**Mitigation:**
- Content/marketing budget (£3,000 in Year 1) is allocated to county guide SEO
  articles from Month 1, not Month 6
- Technical SEO (Core Web Vitals, JSON-LD markup, sitemap) at launch as hard gate
- PR campaign timed to launch to generate backlinks and brand awareness simultaneously
- If traffic is below 30,000 by Month 6, consider a funded content programme via
  Innovate UK content grant application or angel seed to accelerate
- Plausible Analytics installed from Day 1 to track progress against monthly targets
  and identify underperforming pages before they are published

---

## Category 2: Execution Risks

---

### ER-01 — Solo Founder Incapacity

**Description:** Farmmap is a solo founder business through at least Year 2. If the
founder experiences a health event, family emergency, or extended inability to work,
the entire operation (development, moderation, customer support, content programme)
halts. There is no redundancy in any operational function.

**Likelihood:** 2 (any individual faces this risk; it is not elevated for this
business specifically)
**Impact:** 5 (critical — the business has no operational continuity without the
founder; a 3-month incapacity in Year 1 could be fatal to the Bronze trajectory)
**Risk Score:** 10 (HIGH)

**Mitigation:**
- Document all operational procedures before V1 launch (moderation workflows,
  customer email templates, Bronze onboarding steps)
- Maintain a 90-day operational playbook that a trusted contractor or co-founder
  candidate could use to keep the business running during a founder absence
- Content/moderation contractor (budgeted from Year 2) de-risks the operational
  functions once Bronze revenue justifies the hire
- Insurance: key person income protection insurance from Year 1; cost typically
  £30–60/month for the age range; modelled in Year 2 operating costs

---

### ER-02 — Bronze Conversion at 3% Not 6% (Sensitivity Case)

**Description:** The financial model is built on 6% Bronze conversion of claimed
listings. This requires the analytics dashboard to demonstrate visible ROI to
risk-averse farm shop owners. If the dashboard does not convert evidence into
upgrades — either because traffic is insufficient, the UI is not compelling, or
the demographic is too resistant — conversion stalls at the 3% downside case.

**Likelihood:** 3 (the demographic resistance is documented; the 90-day trial
de-risks conversion; the 3% scenario is the published downside case, not a tail
risk)
**Impact:** 4 (significant — see financial-model.md sensitivity; Year 3 revenue
falls to ~£26,000 at 3% conversion; break-even moves to Month 60+)
**Risk Score:** 12 (HIGH)

**Mitigation:**
- Analytics dashboard design optimised for the "I didn't know you were here"
  moment — show owners their page views before asking for money
- 90-day trial reduces the conversion decision to a renewal decision; renewal
  from a position of evidence is significantly easier than cold conversion
- Traffic-triggered email times the outreach to peak receptivity (when the owner
  has just seen X visitors this month)
- FRA partnership converts cold outreach to warm referral at 3× conversion rate
- Monthly Bronze conversion rate tracked as a primary KPI; if below 4% at Month 9,
  A/B test trial offer extension and pricing alternatives before assuming model
  failure

---

### ER-03 — SEO Algorithm Update Penalises Listing Sites

**Description:** Google's ranking algorithm changes have historically penalised
certain types of directory and listing sites (particularly thin, duplicate, or
low-quality content). A Helpful Content Update or a Core Algorithm Update after
launch could materially suppress Farmmap's organic rankings, particularly for
county-level landing pages.

**Likelihood:** 3 (Google algorithm updates are routine; a major update affecting
local directory sites is not a theoretical risk — BigBarn's historical traffic
decline is partly attributable to algorithm changes)
**Impact:** 4 (significant — traffic recovery from a major algorithm penalty
takes 3–6 months minimum; Bronze sales conversations are interrupted for the
duration)
**Risk Score:** 12 (HIGH)

**Mitigation:**
- Build for quality from day one: original, non-duplicate listing content; rich
  JSON-LD structured data; genuine consumer reviews (F5); editorial county guides
  that are substantively useful, not keyword-stuffed stubs
- Diversify traffic sources: while SEO is primary, build an email list from
  waitlist signups and ordering notifications from the first month; email is
  algorithm-proof
- Monitor Core Web Vitals in production on a weekly basis; a technical regression
  that drops below the "Good" threshold is flagged and fixed before Google
  measures it
- Google Search Console alerts configured from Day 1 for manual penalties

---

### ER-04 — Photo and Review Moderation Volume Overwhelms Solo Admin

**Description:** At 953 seeded listings with a 25% claim rate at Month 18, the
moderation queue (photos and reviews) could generate 200+ items per month by
Year 2. Alex Kim (P5) as the solo admin cannot moderate this volume while also
operating the content programme. If the moderation backlog grows, review
publication is delayed beyond the 24-hour target and photo quality degrades.

**Likelihood:** 3 (volume is predictable; the question is whether AI-assisted
pre-screening (F24 Should-Have) is implemented before it becomes a bottleneck)
**Impact:** 3 (moderate — slow moderation degrades trust in reviews and owner
experience; does not directly cause revenue loss unless Bronze shop photos are
delayed)
**Risk Score:** 9 (MEDIUM)

**Mitigation:**
- AI-assisted photo pre-screening (F24) prioritised as early Should-Have feature
  post-V1 launch
- Content/moderation contractor budgeted from Month 18 (financial model)
- Moderation queue design (F11) includes bulk-approve for obvious passes; single
  click on batches of clearly acceptable photos
- Review moderation SLA set at 24 hours and monitored; escalation to founder
  when queue exceeds 48-hour age on any item

---

## Category 3: Financial Risks

---

### FR-01 — Year 1 Cash Position: Personal Capital Exhausted

**Description:** The financial model projects a closing Year 1 cash balance of
–£360 (starting from £5,000 personal capital). This is a marginal cash position
that depends on timing content and legal spend carefully across the year. If any
significant unbudgeted cost emerges in Year 1 (legal fee for FRA agreement, a
compliance issue, or higher-than-expected content costs), the business is
technically cash-negative before Year 2 revenue begins.

**Likelihood:** 3 (the model is tight; any overage in legal or content spend
triggers the deficit)
**Impact:** 4 (significant — personal capital is the only source of funds at
this stage; a cash crisis in Year 1 forces a choice between reducing spend and
slowing development, or seeking emergency funding)
**Risk Score:** 12 (HIGH)

**Mitigation:**
- Stage all discretionary spend: content production in tranches (one county guide
  per fortnight, not a bulk commission); legal review only when specific compliance
  gates require it
- Identify Innovate UK SMART grant opportunity (typically £25,000–100,000 for
  early-stage digital businesses in rural/AgriTech sectors); application target Q2
  of Year 1
- Personal credit facility as emergency backstop (not preferred but available);
  the maximum exposure is a short-term loan to bridge to Year 2 Bronze revenue
- Monitor monthly cash position against the model; if below £1,000 at Month 9,
  trigger funding decision immediately rather than at the point of crisis

---

### FR-02 — Silver Marketplace GMV Lower Than Modelled

**Description:** The financial model assumes average Silver GMV of £800/month per
shop in the early phase, rising to £1,200. This requires farm shop owners to
actively market their Farmmap ordering capability to their existing audiences and
for Farmmap's consumer base to discover and use it. If GMV is £400/month per shop
(half the base case), Silver commission revenue falls to approximately 50% of the
model, pushing break-even from Month 42–48 to Month 54+.

**Likelihood:** 3 (early marketplace adoption is typically slower than projected;
the waitlist mechanism (F6) is the key variable — accumulated waitlist subscribers
converting on Silver activation is the most important GMV driver)
**Impact:** 3 (moderate — the model's EBITDA is already negative; lower GMV
extends the break-even horizon but does not prevent the business from operating
on subscription revenue alone)
**Risk Score:** 9 (MEDIUM)

**Mitigation:**
- F6 ordering waitlist captures demand intent from V1 launch; shops launching
  Silver with a pre-existing waitlist list start with a customer base not from zero
- Silver onboarding includes an automated announcement email to all waitlist
  subscribers (spec requirement); this is the primary GMV-day-one mechanism
- Target Silver launch for shops with demonstrated Farmmap traffic (20+ waitlist
  sign-ups gate); shops with no ordering evidence are not pushed to Silver
- Monitor Silver GMV per shop weekly in Year 2; if average is below £500/month
  after 3 months, invest in consumer-facing content marketing specifically for
  the marketplace (recipes, seasonal produce features)

---

### FR-03 — Stripe Fee Structure Changes

**Description:** Farmmap's financial model uses current Stripe UK pricing (2.9% + £0.30
for subscription payments; 0.25% for Connect payouts). Stripe has historically
adjusted pricing; if the payout fee increases or a marketplace-specific fee is
introduced, the commission economics on Silver/Gold deteriorate.

**Likelihood:** 2 (Stripe fee changes are infrequent and usually signalled in advance;
the 0.25% payout fee is competitive and not under near-term pressure)
**Impact:** 2 (limited — at Year 3 GMV levels, a 0.1% fee increase is approximately
£360/year; not a model-level risk at this scale)
**Risk Score:** 4 (LOW)

**Mitigation:**
- Monitor Stripe pricing announcements and update the financial model quarterly
- Evaluate Stripe alternatives (GoCardless, Adyen) at Year 2 if Stripe pricing
  diverges materially; switching cost is low at this GMV level

---

### FR-04 — Gold Commission Cap Negotiation Erodes Revenue

**Description:** The viability gate and pricing hypothesis both identify that Gold
at 5% becomes economically rational to escape above £8,000/month GMV. If the first
Gold shops reach this threshold within the 3-year model and Farmmap cannot retain
them without a commission cap, Gold revenue is not as durable as modelled.

**Likelihood:** 2 (Gold shops are unlikely to reach £8,000/month GMV within the
3-year model at the conservative GMV assumptions used; this risk materialises in
Years 4–5)
**Impact:** 3 (moderate — loss of a high-GMV Gold shop is a meaningful revenue event
at the Year 3 scale)
**Risk Score:** 6 (MEDIUM)

**Mitigation:**
- Design the Gold commission cap before V3 commercial model is finalised (viability
  gate condition gold-commission-cap)
- Proposed cap: 5% on first £8,000 GMV/month, 3% above that; cap at £2,000/month
  commission per shop — transparent in subscription agreement
- The cap protects retention of the highest-value shops; the £2,000/month cap still
  represents £24,000/year per Gold shop — a strong unit economic even capped
- Review quarterly: if no Gold shop approaches the £8,000 threshold in Year 3,
  defer cap implementation

---

## Category 4: Legal and Compliance Risks

---

### LR-01 — Food Safety Incident Linked to a Farmmap-Listed Shop

**Description:** A consumer purchases food via a Farmmap Silver/Gold listing and
suffers an allergic reaction or food poisoning. If the incident is linked to
incorrect or incomplete allergen information on a Farmmap listing, there is potential
for regulatory action and reputational damage, even where Farmmap is not the
food business operator.

**Likelihood:** 2 (the allergen gating mechanism (F8/F13) makes it technically
impossible for a product to be purchasable without allergen fields completed;
the risk arises from incorrect information provided by the shop operator)
**Impact:** 5 (critical — a death or serious injury linked to an allergen incident
on a Farmmap listing is an existential reputational risk regardless of legal
liability determination)
**Risk Score:** 10 (HIGH)

**Mitigation:**
- Allergen fields mandatory and gated before purchasable status (F8 spec requirement)
- Allergen disclaimer on all product pages: "Allergen information is provided by
  [Shop Name]. If you have severe allergies, contact the shop directly."
- ToS allergen warranty clause: shop operators warrant allergen information is
  accurate and indemnify Farmmap against claims arising from incorrect information
- Human legal review of allergen liability position before V3 launch (compliance
  condition V3-C1 — mandatory human co-sign)
- Product liability insurance assessment as part of the legal review

---

### LR-02 — Natasha's Law Non-Compliance by a Shop Operator

**Description:** A Silver/Gold shop operator sells pre-packed food through Farmmap's
marketplace without completing allergen fields, either by circumventing the gate or
because the allergen information is genuinely incorrect (not a technical omission but
a substantive error). This creates liability for the food business operator (criminal
under Natasha's Law) and potential liability for Farmmap as the platform.

**Likelihood:** 2 (the technical gate should prevent the omission scenario; the
incorrect-information scenario is not preventable by Farmmap's controls)
**Impact:** 4 (significant — FSA's online marketplace compliance monitoring
programme targets platforms explicitly)
**Risk Score:** 8 (MEDIUM)

**Mitigation:**
- Food business registration number mandatory in Silver/Gold onboarding (compliance
  condition V3-C6)
- ToS declaration that operators warrant compliance with all applicable food safety
  legislation
- Platform allergen disclaimer on all product pages (compliance condition V3-C9)
- Allergen information verification checkbox with date (F13 spec requirement);
  operators affirm accuracy at point of product creation
- Regular audit of Silver/Gold product listings: quarterly review of allergen field
  completion by admin (F11)

---

### LR-03 — UK GDPR / Irish DPC Data Breach

**Description:** A data breach exposing farm shop owner account data (classified C3 —
Customer PII per the Constitution) or consumer account data would trigger dual
notification obligations (ICO within 72 hours; DPC within 72 hours for ROI user
data). A breach affecting a significant number of records could result in regulatory
investigation and fine.

**Likelihood:** 2 (Farmmap uses a managed infrastructure stack; the attack surface
at V1-V3 scale is limited; most SMB-scale SaaS data breaches arise from credential
stuffing or third-party service compromise, both of which are mitigable)
**Impact:** 4 (significant — a breach fine from ICO/DPC and the operational
disruption of dual-regulator notification are material for a bootstrap business)
**Risk Score:** 8 (MEDIUM)

**Mitigation:**
- EU GDPR Article 27 representative appointed before V1 launch (compliance
  condition V1-C2)
- Breach notification procedures documented and tested before V1 launch (compliance
  condition V1-C6)
- Password hashing at rest, session token rotation on login, 8-hour admin session
  expiry (spec non-functional requirements)
- Supabase's managed infrastructure provides encryption at rest; row-level security
  policies enforced at the database layer for directory scoping
- Admin impersonation log immutable and auditable (F11 spec requirement)

---

### LR-04 — Consumer Contracts Regulations 2013 / DMCC 2024 Subscription Dispute

**Description:** A farm shop owner exercises their 14-day cancellation right or
disputes an auto-renewal charge under DMCC 2024. If the pre-contractual information
was not displayed correctly or the auto-renewal notice was not sent, the subscription
charge is not enforceable and Farmmap faces a refund obligation and potential
regulatory referral.

**Likelihood:** 2 (CCR 2013 and DMCC 2024 compliance conditions are straightforward
to implement; the risk arises from build failure to implement them correctly, not
from a novel legal uncertainty)
**Impact:** 3 (moderate — individual refund obligations are low value; systemic
non-compliance with DMCC 2024 auto-renewal notice requirements could attract CMA
attention)
**Risk Score:** 6 (MEDIUM)

**Mitigation:**
- Pre-contractual information on payment pages is a V2 blocker (compliance
  condition V2-C1)
- DMCC 2024 auto-renewal notification is a V2 blocker (compliance condition V2-C2)
- 14-day cancellation right in plain English on payment page and in post-payment email
  (spec requirement F10)
- Legal review of pro-rata refund position before V2 launch (compliance condition
  V2-C3)
- Dispute resolution process documented in ToS; first-line resolution is founder
  review within 5 working days

---

*Produced by: business-plan-lead | squad: business-plan*
*Authority: viability-gate.md + compliance-decision.md + saleability-critique.md*
*Phase: 4.5 | Feeds: specs/003-farmmap/business-plan-pack/business-plan-decision.md*
