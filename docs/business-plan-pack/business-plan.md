# Farmmap — Business Plan

**Version:** 1.1.0  
**Date:** 2026-05-17  
**Prepared by:** [FOUNDER_NAME], Founder  
**Contact:** farmmap.co.uk | stuart.fosker@gmail.com  
**Confidentiality:** Commercially sensitive. Not for distribution without founder consent.

---

## Table of Contents

1. Executive Summary
2. Company Overview and Mission
3. Product and Service Description
4. Management and Organisation
5. Market Environment (PESTLE and Barriers to Entry)
6. Competitive Landscape
7. Target Market and Customer Segmentation
8. SWOT Analysis and Strategic Position
9. Commercial Strategy (Pricing, Sales, and Go-to-Market)
10. Operations and Technology
11. Financial Projections
12. Risk Register
13. Implementation Roadmap and KPIs
14. References
15. Appendices

---

## 3. Product and Service Description

### 3.1 The Core Product

Farmmap is a map-first, mobile-first directory of farm shops, honesty boxes, farm gate stalls, and roadside produce stands across the United Kingdom and the Republic of Ireland. The primary domain is farmmap.co.uk — an exact-match domain that Farmmap owns outright. [FACT — intake.md]

The fundamental consumer experience is unencumbered: a user opens the map without creating an account, sees verified listings as pins across an interactive OpenStreetMap canvas, and taps a pin to discover a farm shop or honesty box within driving or cycling distance. Mobile performance on 4G rural connections is a non-negotiable product requirement; the large majority of use cases occur while the user is away from home, typically in a car.

At launch, the map opens with 953 seeded, verified listings distributed across all five nations: 417 English farm shops, 85 Scottish farm shops, 67 Welsh farm shops, 29 Northern Ireland farm shops, 37 Republic of Ireland farm shops, 73 Northern Ireland honesty boxes, and 190 Republic of Ireland honesty boxes. [FACT — intake.md] These listings were sourced from the Farm Retail Association's data (UK farm shops) and yourhonestybox.com (336 Irish and NI honesty boxes, obtained with explicit written consent). [FACT — compliance-decision.md V1-C3] 87% carry a postcode or Eircode. [FACT — intake.md]

### 3.2 Listing Types and the Honesty Box Distinction

A first-class product decision is that honesty boxes are treated as equal listing types alongside farm shops, not as a sub-category. No UK-wide directory has made this choice before. [INFERENCE from competitor-matrix.json] A honesty box — an unstaffed roadside stall selling fresh produce on an honour payment system — is the purest form of farm-to-consumer direct sale. Farmmap's coverage of 263 Irish and NI honesty boxes at launch, combined with UK honesty box coverage, is the single most differentiated territorial asset in the product.

### 3.3 Commercial Tiers

The commercial model rests on a freemium structure with three paid tiers. The free tier is permanent; it is not a trial. A farm shop owner who claims a free listing at V1 launch retains that free listing indefinitely, without card entry or fee expiry.

**Bronze — £20/month per shop [FACT — intake.md]**

A branded shop presence within Farmmap: logo and hero photograph upload, product catalogue (display only, not purchasable at V2), enquiry form connected to the owner's email, performance analytics dashboard (monthly sessions, geographic visitor heat map, click-through to directions), and a verified badge indicating a human has confirmed the listing's data. Optional add-on: newsletter feature or social post campaign at £50 per campaign. [FACT — intake.md] Bronze positions below Yell (£50–£200+/month) and Checkatrade (£39–£72/month) [FACT — pricing-hypothesis.md] while delivering a more attributable product for a farm shop owner's needs.

**Silver — £60/month + 3% commission on orders ≥ £20 [FACT — intake.md]**

A complete online marketplace. Consumers can browse the product catalogue, add to basket, and checkout. The farm shop owner manages incoming orders through a mobile-first order management dashboard. Farmmap uses Stripe Connect Standard, which makes the farm shop the merchant of record — Farmmap takes its 3% as a platform application fee. [FACT — compliance-decision.md, financial-services-assessment.md] The Silver tier requires a pre-existing consumer ordering waitlist of 20+ sign-ups or six months of active Bronze history before activation, ensuring the marketplace launches into an audience rather than a vacuum.

**Gold — £100/month + 5% commission on orders ≥ £30 [FACT — intake.md]**x

Silver tier plus a done-for-you marketing service: monthly newsletter feature to Farmmap's subscriber base, two weekly social posts authored and published by Farmmap, quarterly blog post, homepage placement, and priority search ranking. Up to 1,000 products versus 500 on Silver. Gold is gated at three months on Silver plus 50 completed orders. [FACT — intake.md] The Gold marketing services bundle is the price justifier; comparable social media management retainers cost £500–£1,500/month. [INFERENCE — pricing-hypothesis.md §3]

### 3.4 Consumer Experience Design Principles

The product decisions in Section 3.3 are informed by four explicit consumer experience design principles that translate the P1/P2 persona research into build requirements:

**No account creation for consumers.** The consumer who opens Farmmap on a mobile phone in a car should see a map immediately. No sign-up prompt, no cookie acceptance wall, no loading spinner beyond 2 seconds. Plausible Analytics' cookieless tracking eliminates the need for a GDPR consent banner for anonymous browsing (compliance condition V1-C8). A consumer who has to create an account before seeing the map will not do so — they will use Google Maps instead.

**Map as the primary UI, not a supplementary feature.** Every farm shop directory that preceded Farmmap — BigBarn, FRA directory, LocalFoodFinder — treats the map as a secondary view accessed from a list or search result. Farmmap's design inverts this: the map is the home screen. A consumer opens the app and sees every farm shop and honesty box in their area as pins, without needing to search for anything. The impulse discovery use case (J1 — "I'm driving past a farm shop I didn't know existed") only works if the map is the first thing the consumer sees.

**Mobile-first performance on 4G rural connections.** The consumer who most needs Farmmap is the one who is already in a rural area, potentially on a slow mobile connection, looking for a farm shop within 10 minutes of their current location. The product must work at that moment or it fails its primary use case. Core Web Vitals targets (LCP <2.5s, CLS <0.1, FID <100ms) are non-negotiable build requirements, not aspirational benchmarks. Next.js SSR and edge rendering ensure listing pages load from server-rendered HTML rather than waiting for JavaScript hydration.

**Claimed listings visually distinct from unclaimed stubs.** A consumer who taps a stub listing (no photo, no verified hours, no owner-added content) must be able to tell immediately that this listing has not been verified. A stub listing that looks identical to a claimed listing creates consumer trust risk — if the consumer drives to a farm shop based on stub data that turns out to be wrong (outdated hours, incorrect location), they blame Farmmap. The verified badge on claimed listings and the "Data not verified by owner — please call before visiting" notice on stubs are the UX mechanisms that manage this expectation.

### 3.5 The Portfolio Engine

Farmmap is the first vertical in a family of map-first directories sharing one multi-tenant technology engine. Every database table is scoped to a `directory_id` from the first line of the data model. [FACT — intake.md architecture decision] Once Farmmap's engine is proven at 100 Bronze subscribers — the portfolio gate condition [FACT — viability-gate.md condition: poc-before-engine] — additional verticals require an estimated £15,000–£25,000 each in incremental investment for data acquisition, domain, and design customisation. [ASSUMPTION — value-bench.md §5] The identified pipeline includes BrewMap (craft breweries), CampingMap (campsites), BerthMap (marina berths), FishMap (coarse fisheries), ForecourtMap (independent forecourts), and TractorMap (agricultural machinery dealers). The portfolio Year 5 base-case revenue across all seven verticals is £2,205,000, a 4.9× multiplier over the single-vertical figure. [INFERENCE — value-bench.md §5]

---

## 2. Company Overview and Mission

### 2.1 Mission

Farmmap's mission is to close the discovery gap between the 22.3 million UK and Irish adults who value locally produced food [FACT — FSA Food and You 2, Wave 7, 2024] and the thousands of farm shops, honesty boxes, and farm gate stalls that are invisible to digital search. Every farm shop that loses a potential customer because that customer drove past without knowing it existed is a market failure Farmmap exists to correct. The mission is achieved when every farm shop and honesty box in the UK and Ireland is discoverable to the people who are already looking for it — not through paid advertising, but through the simple act of being on the map.

### 2.2 Vision

Farmmap's long-term ambition is to become the authoritative digital home of UK and Irish farm-direct food: the platform every consumer opens first when they want to know what is grown or made within twenty miles of where they are. Within five years, Farmmap will have expanded the farm-to-consumer discovery infrastructure beyond farm shops and honesty boxes into every segment where a discovery gap exists between producers and the consumers who would choose them if they only knew they were there. The portfolio thesis — Farmmap as the proof-of-concept for a family of map-first verticals sharing one technology engine — positions Farmmap as the infrastructure layer for local and artisan commerce in the UK and Ireland, not merely a farm shop listing service.

### 2.3 Values

Farmmap operates on five values, each with a concrete behavioural implication that governs specific product and commercial decisions.

**Honest attribution.** Farmmap shows farm shop owners their actual visitor count — not an inflated impression count, not a modelled estimate, not a figure that has been rounded up to make the dashboard look impressive. A shop owner who upgrades to Bronze on the basis of false traffic data will cancel within 90 days and tell their neighbours the platform does not work. Every number shown in the analytics dashboard must be traceable to a genuine user session recorded by Plausible Analytics.

**Evidence before money.** No farm shop is asked to pay until Farmmap can demonstrate it is delivering something measurable. The traffic-triggered email fires when genuine sessions are recorded; the 90-day trial begins when the owner can already see their dashboard. Farmmap does not ask a 61-year-old farm shop owner who was burned by BigBarn in 2020 to take a leap of faith. It asks them to look at a number.

**The shop is always the merchant.** Farmmap uses Stripe Connect Standard, not Stripe Connect Custom. The farm shop is the merchant of record on every transaction that passes through the Silver and Gold marketplace. Farmmap takes a platform application fee; it never holds consumer funds, never touches inventory, and never acts as a food retailer. This is not a legal technicality — it is a values statement about what kind of business Farmmap is.

**No black boxes.** Every model call, every material platform decision, every piece of data used to seed the directory has a documented source and a traceable decision record. The yourhonestybox.com consent documentation, the FRA data arrangements, and the compliance assessment are not filed and forgotten — they are the evidence that Farmmap is trustworthy enough to be the platform that farm shops entrust with their commercial reputation.

**Permanence over virality.** The free tier is permanent. A farm shop that claims a listing at V1 launch owns that listing indefinitely without a card on file or a fee expiry. Farmmap is building a long-term relationship with the farm retail sector, not maximising short-term conversion metrics. A product that takes away the free listing after 30 days trains its own community to distrust it.

### 2.4 Product Description

Farmmap is a web application and Progressive Web App (PWA) built on Next.js 14, Supabase/PostgreSQL with PostGIS spatial query support, MapLibre GL JS on OpenStreetMap tiles, and Stripe Connect Standard for marketplace payments. The product operates across three versions:

**V1 (free directory, map-first):** 953 seeded listings on an interactive map; consumers browse without account creation; farm shop owners can claim their listing for free via an email-verified workflow. Development status: specification signed off, eight-sprint build plan with 80 tasks ready to execute, architecture complete across ten ADRs.

**V2 (Bronze subscriptions, branded shop pages):** Stripe Billing subscription payments; branded listing with photos, product catalogue display, and analytics dashboard; 90-day trial for first 50 subscribers; content moderation queue for uploaded photos.

**V3 (Silver and Gold marketplace):** Stripe Connect Standard onboarding for farm shop operators; consumer checkout; order management dashboard for shops; allergen fields mandatory (Natasha's Law compliance); Gold marketing services delivery.

The development stage as of this plan's date is pre-launch: pre-V1. The product is ready to build; it is not yet built.

### 2.5 Business Model

Farmmap's revenue structure has four components:

**Recurring subscriptions** (Bronze £20/month, Silver £60/month, Gold £100/month) provide predictable, high-margin monthly recurring revenue. Gross margin on subscription revenue after Stripe billing fees (2.9% + £0.30 per subscription) is approximately 84–88%.

**Marketplace commission** (3% on Silver orders ≥ £20; 5% on Gold orders ≥ £30) generates revenue proportional to GMV processed through the platform. Stripe Connect Standard's 0.25% payout fee and the domestic card processing cost (approximately 1.5% + 20p via Stripe) are deducted from the commission. Net commission margin at Silver's 3% rate is approximately 1.3–1.5% of GMV after Stripe costs.

**Campaign add-ons** (£50/campaign at Bronze; £100/campaign at Silver) provide episodic non-recurring revenue from newsletter features and social post campaigns. These are sold on-demand, not bundled.

**Portfolio engine multiplier:** The same technology infrastructure, once proven at 100 Bronze subscribers, generates incremental revenue from adjacent verticals (TractorMap, BrewMap, CampingMap, BerthMap, FishMap, ForecourtMap) at estimated £15,000–£25,000 incremental investment per vertical.

Farm shop owner acquisition follows a consumer-traffic-first sequence: the directory builds consumer audience through SEO, which creates traffic evidence for farm shop listings, which triggers the conversion email to unclaimed listing owners, which converts free listings to paid Bronze subscriptions through the analytics dashboard. The acquisition route is demand-led, not sales-led — consumer traffic creates the Bronze sales conversation that no cold outreach can manufacture.

Retention is product-led: Bronze shops stay because their analytics dashboard builds a month-by-month evidence base for the value of the subscription; Silver shops stay because switching means rebuilding their online ordering infrastructure and losing the Farmmap consumer audience that generates their GMV; Gold shops stay because Farmmap acts as their marketing department.

### 2.6 Legal Structure

Farmmap is a sole trader business at launch. Formal limited company incorporation under the Companies Act 2006 (England and Wales) is planned before V2 Bronze subscriptions go live (approximately Month 4–6 of trading). At that point, the business enters into subscription agreements with farm shop operators and requires a company legal structure to properly execute those contracts, hold intellectual property, and manage tax obligations.

The marketplace payment architecture uses Stripe Connect Standard. Under this structure, the connected farm shop account (not Farmmap) is the merchant of record on every consumer transaction: the farm shop accepts Stripe's Terms of Service directly, receives payouts directly to its bank account, and bears primary regulatory responsibility for the payment relationship with its customers. Farmmap takes a platform application fee at the charge level within Stripe's infrastructure. This architecture correctly avoids Farmmap's classification as a payment institution under the Payment Services Regulations 2017 (SI 2017/752) and was confirmed as the appropriate structure by the pre-launch compliance assessment. [FACT — compliance-decision.md; financial-services-assessment.md]

The business owns the following domains: farmmap.co.uk (primary), farmstor.com and farmstor.co.uk (redirecting to farmmap.co.uk).

### 2.7 Objectives and Key Partners

**Commercial objectives (Years 1–3):**

1. Reach 9 paying Bronze subscribers by Month 12; 57 by Month 36.
2. Achieve £163,892 annual revenue by Year 3 (base case). [INFERENCE — financial-model.md]
3. Secure a formal data licence agreement with yourhonestybox.com before V1 launch.
4. Initiate the FRA partnership approach before V1 launch; achieve active partnership by Month 6.
5. Pass the portfolio engine gate condition (100 Bronze subscribers) and begin TractorMap planning by Month 18.

**Key partners:**

| Partner | Role | Status |
|---------|------|--------|
| yourhonestybox.com | Data partner — 336 Irish and NI honesty box listings; co-branding on all Irish/NI listings | Consent confirmed; formal data licence agreement in progress |
| Farm Retail Association (FRA) | Target endorsement partner — 1,200 member shop relationships; trade body credibility | Outreach target; not yet engaged |
| Stripe Connect Standard | Marketplace payment infrastructure; merchant-of-record architecture | Confirmed in compliance assessment |
| Supabase | PostgreSQL + PostGIS database, Auth, Storage | Confirmed stack |
| MapLibre GL JS / OpenStreetMap | Map rendering and tile serving; ODbL-licensed | Confirmed stack; OSM attribution required at V1 |
| Resend | Transactional email — traffic-triggered emails, waitlist notifications, Bronze onboarding | Confirmed stack |

---

## 4. Management and Organisation

### 4.1 Founder Profile

**[FOUNDER_NAME] — Founder**

> **TO BE COMPLETED BY FOUNDER.** Replace this section with your professional background before sharing this document externally.
> Describe: (1) your professional background in 2–3 sentences; (2) why your background specifically positions you to build and operate Farmmap; (3) 3–5 concrete credentials relevant to this product's execution challenges.

[FOUNDER_BACKGROUND — professional summary relevant to building and operating Farmmap]

Relevant execution credentials for Farmmap specifically:

- [CREDENTIAL_1 — e.g. prior product/business built, relevant technical skill, sector experience]
- [CREDENTIAL_2]
- [CREDENTIAL_3]

[FOUNDER_NAME] operates all functions at launch: product ownership, technical oversight of the build sprint, farm shop owner acquisition, content programme, and listing moderation. The first hire described in Section 4.3 is planned for Month 20, not Month 1 — the business is correctly scoped for solo operation in Year 1 given the automation-first product architecture.

### 4.2 Organisation Chart

Farmmap operates as a single-person enterprise at launch, scaling to a two-person operation at Month 20 and a three-person operation at Year 3 break-even.

```
Year 1–Month 20: Founder ([FOUNDER_NAME])
  ├── Product ownership and roadmap
  ├── Technical oversight (build sprint supervision)
  ├── Farm shop owner acquisition (FRA outreach, agricultural shows)
  ├── SEO content programme (county guides, editorial)
  ├── Listing moderation and admin console
  └── Bronze subscriber support

Month 20–Year 3: Founder + Content & Moderation Contractor
  Founder
  ├── Commercial development (Bronze-to-Silver conversion)
  ├── FRA and partner relationship management
  ├── Silver/Gold onboarding and support
  └── Financial and strategic oversight
  
  Content & Moderation Contractor (part-time, ~2 days/week)
  ├── Photo and listing moderation queue
  ├── County guide content production
  ├── Editorial calendar management
  └── Social media scheduling

Year 3 (Break-even): Founder + Contractor + Head of Farm Shop Partnerships
  Head of Farm Shop Partnerships (full-time)
  ├── Bronze acquisition (telephone and field outreach)
  ├── Agricultural show presence
  ├── FRA member relationship management
  └── Bronze-to-Silver conversion programme
```

### 4.3 Skills Gaps and Mitigations

Three skills gaps are identified for the current stage of the business:

**Content moderation at scale.** As the listing database grows and the photo and review moderation queue builds, the volume of human review work will exceed one person's capacity while also demanding the SEO content programme that drives consumer traffic. These are the two most important operational activities and cannot be managed simultaneously by a single person at scale.

*Mitigation:* Part-time content and moderation contractor from Month 20, funded from Bronze subscription revenue at approximately 30+ active subscribers. Annual cost: £12,000 (approximately 2 days per week). This hire absorbs the moderation queue and editorial content production, freeing the founder for commercial development, Bronze-to-Silver conversion work, and the FRA relationship.

**Agricultural sector relationships.** Farmmap's Bronze acquisition model requires personal relationships with farm shop owners and the Farm Retail Association. The founder does not have pre-existing relationships in the UK farm retail sector. Cold outreach to a demographic that is sceptical of digital directories requires credibility that takes time to build.

*Mitigation:* The yourhonestybox.com data relationship provides Irish market intelligence and an existing community trust signal. FRA application and outreach programme begins in Year 1. Agricultural show presence (Balmoral Show, county shows) creates the human touchpoints that the FRA route requires. The traffic-first commercial model means the first Bronze conversations happen when Farmmap can already show a shop their visitor data — reducing the credibility burden on the founder.

**Enterprise sales for B2B school and cooperative channels.** The Irish cooperative channel (identified as a P3 priority segment in Section 7.3) and any future B2B licensing arrangements with agricultural organisations require commercial skills different from consumer-facing SaaS sales.

*Mitigation:* B2B cooperative and institutional sales are deferred to Year 3 and assigned to the Head of Farm Shop Partnerships hire. This is not a Year 1 or Year 2 constraint; the Bronze individual subscription acquisition path is the correct initial focus.

### 4.4 Personnel Plan

| Period | Role | Type | Annual Cost | Trigger Condition |
|--------|------|------|-------------|-------------------|
| Launch | Founder ([FOUNDER_NAME]) | Full-time | Minimal draw (£0 Year 1, £0 Year 2) | — |
| Month 20 | Content and moderation contractor | Part-time (~2 days/week) | £12,000 | Bronze MRR sufficient to cover (~30 subscribers) |
| Year 3 | Head of Farm Shop Partnerships | Full-time | £35,000 | Break-even achieved; FRA endorsement active |

The founder salary of £40,000 in Year 2 and £55,000 in Year 3 in the financial model represents a planned draw, not an employed cost. Until break-even, founder compensation is the principal financial risk line in the P&L, not an operational overhead. The Year 2 EBITDA deficit of –£52,928 is predominantly the founder salary line; without salary, Year 2 EBITDA is approximately –£12,928.

### 4.5 Governance and Oversight

Farmmap operates under the agent-foundry Constitution v1.0.0 as its governing framework. The following decisions require human approval and cannot be delegated or automated:

- yourhonestybox.com written consent confirmation before the 336 Irish listings go live
- EU GDPR Article 27 representative appointment
- Natasha's Law allergen liability legal review before Silver/Gold marketplace launch
- Any subscription contract signed with a farm shop operator
- Any external funding round

[FACT — compliance-decision.md human-co-sign requirements; CLAUDE.md Constitution §2 Human-in-the-Loop Gates]

### 4.6 Advisory Relationships

Farmmap has two institutional relationships relevant to governance and commercial strategy:

- **yourhonestybox.com** — data partner, Republic of Ireland and Northern Ireland. Consent confirmed; formal data licence agreement in progress as of this plan's date.
- **Farm Retail Association (FRA)** — target partner (not yet confirmed). The FRA endorsement is the highest-leverage single action available to Farmmap before V1 launch.

---

## 5. Market Environment

### 5.1 Industry Overview

The UK farm retail sector encompasses approximately 3,000–3,500 farm shops operating across England, Scotland, Wales, and Northern Ireland. [FACT — FRA; competitor-matrix.md estimate] The FRA's Annual Farm Retail Survey 2023 reported an average farm shop turnover of £580,000, up from £490,000 in 2021, with 78% of shops reporting turnover growth in 2022 versus 2021. [FACT — FRA Annual Farm Retail Survey 2023] The sector's estimated aggregate UK turnover is approximately £1.3 billion annually. [FACT — FARMA Annual Survey 2022; FRA 2023]

Within that £1.3 billion, there is significant variance between the top-performing farm shops (the FRA's Benchmarking Report 2022 identifies the top 15% by turnover as increasingly investing in e-commerce, click-and-collect, and digital marketing) and the long tail of smaller operations (the 2,310 farm shops with no web presence). The top-performing shops are Farmmap's Silver and Gold tier targets; the long tail is the Bronze tier opportunity. The FRA Benchmarking data is directly useful for the Bronze sales conversation: a farm shop owner in the bottom quartile by digital investment can be shown data from the top quartile demonstrating the commercial return on that investment.

The FRA's 1,200 members represent approximately one-third of the estimated total UK farm shop population. The remaining two-thirds — approximately 1,800–2,300 non-member shops — are outside the FRA's directory and largely invisible to any institutional digital discovery product. This is the specific gap Farmmap fills that the FRA's own directory cannot: Farmmap covers the full 3,000–3,500 universe, not just the 1,200 who have chosen to join the trade body.

Farm retail is characterised by its resilience through economic pressure: farm shops grew through the 2022–2024 cost of living crisis, supported by a consumer "flight to provenance" and the premium stickiness of the core farm shop customer base. The farm shop's core customer — ABC1 adults aged 35–65 who value food provenance and have rural or semi-rural access — is the demographic least affected by cost of living pressures and most likely to maintain discretionary food spending on quality and provenance.

In the Republic of Ireland, the farm retail and direct-sales sector is smaller in absolute terms but structurally similar. Bord Bia estimates Irish farm direct sales (farm shops, farm gate, honesty boxes) at approximately €180 million annually. [FACT — Bord Bia, Direct Sales Programme 2023] yourhonestybox.com's listing database, growing at 20–25% per year, is an observable proxy for the dynamism of the Irish honesty box segment. [INFERENCE — competitor-matrix.md analysis of yourhonestybox.com growth] The Irish market benefits from EU LEADER rural digital programme funding (€180m under CAP Strategic Plan 2023–2027) that has no post-Brexit UK equivalent, providing a potential grant pathway for Irish farm shop Bronze subscriptions.

The digital infrastructure supporting farm retail discovery is materially underdeveloped. The FRA's Digital Adoption Survey 2022 found that only 34% of UK farm shops have any website and fewer than 15% have e-commerce capability. [FACT — FRA Digital Adoption Survey 2022] 2,310 farm shops have no web presence whatsoever. [FACT — FRA 2022, calculated from sector total minus 34%] This is not primarily a technology barrier — it is a value evidence gap: farm shop owners do not invest in digital tools they cannot attribute a commercial return to. The FRA survey data is also a sales asset: Farmmap can tell any farm shop owner that 66% of their peers have no website and that Farmmap's analytics dashboard is the only tool that can show them whether digital visibility is delivering customers. That is not a generic sales pitch — it is a sector-specific argument backed by the trade body's own research.

### 5.2 Industry Outlook

The most significant structural driver for Farmmap's addressable market over the 2025–2030 period is the ELM transition. England's Basic Payment Scheme (BPS) direct payments cease entirely by 2027 under the Agricultural Transition Plan. The NFU Diversification Survey 2023 found that 38% of farms planning to diversify intend to open or expand farm retail operations. [FACT — NFU Diversification Survey 2023] This is a supply-side expansion wave that is already underway: Farmmap's launch timing into 2026 positions it at the peak of this diversification curve, not before it.

The consumer demand side is equally structural. The FSA's Food and You 2 Wave 7 survey (2024) confirmed 22.3 million UK adults who value locally produced food — a segment that grew from 39% to 43% of the adult population between 2019 and 2024 and has shown resilience through the cost of living crisis. [FACT — FSA Food and You 2, Wave 7, 2024] Post-COVID food provenance concern is not reverting to 2019 levels; it has reset at a higher baseline.

The cost of living crisis (2022–2024) is moderating. UK food CPI reached 19.2% in March 2023 and has declined to approximately 3.1% by Q1 2026. [FACT — ONS CPI, March 2023; ONS CPI Q1 2026] Farmmap launches into the consumer spending recovery phase — when farm shop visit frequency and average basket values are recovering — not into the peak of economic stress.

Structural signals supporting sector growth through the 2025–2030 horizon:

- ELM wind-down of direct payments: forcing farm diversification into retail. [FACT — Defra Agricultural Transition Plan 2021–2024 Update]
- CLA Farm Diversification Report 2024: farm retail cited as the top ELM diversification activity. [FACT — CLA 2024]
- Post-COVID food provenance trend: 22.3 million adult consumer base, growing and sticky. [FACT — FSA 2024]
- yourhonestybox.com listings growing at 20–25% per year: observable proxy for Irish/NI sector dynamism. [INFERENCE — competitor-matrix analysis]
- BigBarn's commercial decline (£45,000 net assets, Companies House): the incumbent directory has no capital to invest in improving its product, creating an accelerating quality gap. [FACT — Companies House, BigBarn Network Ltd]

### 5.3 PESTLE Analysis

The following table extracts the most commercially significant factors from the full PESTLE analysis in `pestle.json`.

| Dimension | Factor | Direction | Magnitude | Implication for Farmmap |
|-----------|--------|-----------|-----------|------------------------|
| Political | P1 — ELM scheme phasing out BPS (England by 2027) | Tailwind | High | Supply-side expansion: 38% of diversifying farms intend farm retail. Farmmap launch at peak of diversification wave. |
| Political | P2 — Scotland/Wales devolved support divergence | Neutral/Headwind | Medium | Organic supply-side growth slower in devolved nations. FRA relationship more critical for Scottish and Welsh listing quality. |
| Political | P3 — UK 'Buy British' and local food policy | Tailwind | Medium | Favourable earned media environment; policy validates 'Find local. Support local.' positioning. |
| Political | P4 — Ireland LEADER rural digital grants (€180m) | Tailwind | Medium | Irish farm shops may access grant support for Bronze subscriptions; LEADER is potential outreach partner. |
| Political | P5 — Windsor Framework: NI cross-border food commerce | Neutral | Low | No material V1/V2 risk. NI–RoI ordering deferred, consistent with intake decision. |
| Economic | E1 — Cost of living crisis moderating | Headwind (moderating) | High → Medium | Farmmap launch into recovery phase. ABC1 target demographic was least affected at peak. |
| Economic | E2 — Farm shop sector health: average turnover £580k; 78% growth in 2022 | Tailwind | High | A growing sector is more willing to invest in digital tools. FRA sector health data is the first evidence in any Bronze sales conversation. |
| Economic | E3 — SME digital marketing budget constraints | Headwind | Medium | Median farm shop digital marketing spend £800–£1,500/year. Bronze at £240/year is well-calibrated. Silver and Gold require GMV evidence to justify. |
| Economic | E4 — Interest rates and rural investment | Headwind | Low | Normalising rate environment (OBR 2026–2027); not a material Farmmap risk. |
| Social | S1 — 'Know your farmer' post-COVID provenance trend | Tailwind | High | 22.3 million UK adult 'local food matters' segment (FSA 2024); structural shift, not temporary. Core demand driver for Farmmap's consumer product. |
| Social | S2 — Ageing farm owner demographic (average age 59) | Headwind | High | 27% of adults over 65 report no smartphone use (OFCOM 2024). Cold email open rates sub-5% for this demographic. Acquisition model must be human-touchpoint first. |
| Social | S3 — Younger consumer appetite for direct-from-farm | Tailwind | Medium | FARMA: farmers market footfall +12% in 2023 driven by 18–35 attendance. Viral discovery cohort for V1; optimise social sharing. |
| Social | S4 — Supermarket 'fake farm' brand trust erosion | Tailwind | Medium | Soil Association/YouGov (2022): 71% cite named farm shop as most trusted provenance. 'Real farms. Real people.' positioning has genuine resonance. |
| Technological | T1 — Google Maps dominance; niche discovery gap | Neutral/Headwind | High | 43% of farm shops have incorrect/stale Google Maps data (AHDB 2023). SEO ownership of 'farm shop near me' and 'honesty box near me' is the correct response — not map technology competition. |
| Technological | T2 — PostGIS + Stripe Connect Standard: mature stack | Tailwind | High | Confirmed fit-for-purpose by compliance assessment. No FCA registration required under Stripe Connect Standard architecture. |
| Technological | T3 — yourhonestybox.com technology gap | Neutral | Medium | WordPress/Google Maps stack; no PostGIS, no owner dashboard, no marketplace. Farmmap's technology capability advantage is genuine. Risk is geographic speed, not tech replication. |
| Technological | T4 — AI content moderation accessibility | Tailwind | Medium | Google Cloud Vision API (~$0.0035/image) for stock photo detection. Pragmatic moderation solution from Day 1 at bootstrap cost. |
| Legal | L1 — Natasha's Law allergen labelling (UK + Ireland) | Headwind | High | Mandatory 14-allergen fields in Silver/Gold product catalogue. FSA online marketplace compliance monitoring explicitly targets platforms. Pre-launch legal review (human co-sign) required before V3 launch. |
| Legal | L2 — UK GDPR / EU GDPR dual jurisdiction | Headwind | Medium | Dual privacy policy; EU GDPR Article 27 representative appointment (V1 blocker). Manageable with correct pre-launch setup. |
| Legal | L3 — yourhonestybox.com database rights (CRITICAL) | Headwind | Critical | Pre-launch blocker for all 336 Irish/NI listings. Formal data licence agreement is the highest-priority legal action before V1. |
| Legal | L4 — Consumer Contracts Regulations 2013 / DMCC 2024 | Headwind | Medium | CCR pre-contractual information at payment pages (V2 blocker). Perishable food excluded from 14-day withdrawal right — simplifies checkout design. |
| Legal | L5 — Online Safety Act 2023 | Headwind | Low | OSA illegal content risk assessment required before consumer reviews (F5) at V2. Pre-moderation model is strong compliance position. |
| Environmental | En1 — Food miles and local food sustainability | Tailwind | Medium | Consumer heuristic 'local = lower carbon' is persistent. Position around 'shorter journeys from farm to table'; avoid specific carbon claims without LCA. CMA Green Claims Code applies. |
| Environmental | En2 — Seasonal stock variability | Headwind | Medium | AHDB: UK strawberry production down 23% in 2023. Silver/Gold product catalogue must treat seasonality as first-class concept. 'Available now / Seasonal / Back in stock' product states required in V3 design. |

**Binding strategic conclusions from the PESTLE:**

The two PESTLE factors that materially shape Farmmap's commercial strategy are **P1** (ELM-driven supply-side expansion) and **S2** (ageing farm owner demographic). ELM creates a growing supply-side addressable market through 2025–2030 — the number of farm shops is increasing, expanding Farmmap's listing universe. S2 makes digital-only acquisition economically inadequate — the core Bronze target demographic cannot be converted through email campaigns or self-serve digital funnels alone. The tension between these two factors defines the go-to-market sequence: build consumer traffic first (SEO/content, no human cost), then use traffic evidence to justify personal outreach (FRA, agricultural shows, traffic-triggered email). The PESTLE's three legal binding constraints — yourhonestybox.com data licence (V1-C3), EU GDPR Article 27 representative (V1-C2), and Natasha's Law allergen compliance for marketplace (V3-C1) — are pre-launch and pre-V3 blockers, not ongoing operational risks.

### 5.4 Barriers to Entry

Farmmap faces significant entry barriers as a new market participant and, once established, will create meaningful moats against future competitors. The table below distinguishes between barriers currently facing Farmmap (entry) and barriers Farmmap will build against future entrants (moat).

| Barrier | Type | Strength | Time to Overcome | Farmmap Mitigation / Advantage |
|---------|------|----------|-----------------|-------------------------------|
| Directory cold-start: consumer and supply-side density required | Entry | High | 12–18 months regional; 24–36 months national | 953 seeded listings solve the map density problem at launch; claimed-and-enriched target of 50+ in two high-density counties creates quality density before scale |
| FRA relationship: trade body controls primary trust channel | Entry | High | Ongoing without active resolution | FRA outreach begins in Month 1; partnership framing is complementary not competitive; FRA member filter on Farmmap listings proposed as co-branding mechanism |
| yourhonestybox.com data rights and expansion risk (Ireland/NI) | Entry + Competitive | High | Immediate — pre-launch | Formal data licence agreement (V1-C3); partnership converts the data creditor into a structural partner |
| Google Maps substitution: default consumer discovery platform | Entry (substitution) | Medium | Permanent — SEO strategy is the continuous response | SEO ownership of 'farm shop near me' and 'honesty box near me' long-tail queries; category depth (honesty boxes, product catalogue, marketplace) that Google Maps cannot provide |
| Technology build: PostGIS + Stripe Connect + multi-tenant | Entry | Medium | 6–12 months (funded); 18–24 months (bootstrapped) | Farmmap is already through the build specification phase; architecture complete; build ready to execute |
| 953 seeded listings at launch (scale moat once live) | Moat | Medium → High | 12–18 months (stub parity); 24–36 months (quality parity) | Launch head start; a competitor who wants to replicate the dataset faces the same 12–18 month data acquisition problem Farmmap has already solved |
| farmmap.co.uk exact-match domain authority (SEO moat) | Moat | High | 18–36 months | Unacquirable by a competitor; SEO value compounds with domain age and content investment |
| Claimed and enriched listings (proprietary content moat) | Moat | High | Permanent | Owner-uploaded photos, product catalogues, and current hours are Farmmap's intellectual property under its Terms of Service; no competitor can scrape them |
| yourhonestybox.com formal partnership (data moat) | Moat | Medium → High | Convertible — resolution path (1) is partnership, not replacement | Once formalised, the yourhonestybox.com partnership is a structural asset; no competitor can replicate 336+ Irish/NI listings with community trust behind them |
| FRA endorsement (if secured) | Moat | Very High | 18–36 months for any competitor | Converts the hardest acquisition environment (sceptical 50–70 year old farm shop owners) from cold outreach to warm referral; FRA has no incentive to provide the same endorsement to a second directory |
| Consumer review corpus (if added at V2) | Moat (potential) | Medium → High | 36–60 months | Directory monopolies are built on review inventory; the first platform to accumulate 5,000+ farm shop reviews owns the category trust layer |
| Multi-tenant engine: low-cost adjacent verticals | Moat | High | 6–12 months per vertical (for any competitor building from scratch) | Once engine is proven at 100 Bronze subscribers, TractorMap, BrewMap etc. deploy in weeks; a competitor building each vertical from scratch faces full technology build cost per vertical |

---

## 6. Competitive Landscape

### 6.1 Competitive Landscape Overview

The farm shop discovery and retail space in the UK and Ireland is occupied by three categories of competitor: direct (BigBarn, FRA directory), indirect (Google Maps, Facebook Business Pages), and substitutes (Yell, TripAdvisor). yourhonestybox.com — originally classified as a competitor — has been confirmed as a data partner.

No single competitor offers the full Farmmap proposition: map-first, farm shops plus honesty boxes, UK plus Ireland, free directory browse plus subscription plus marketplace. The nearest product competitor (BigBarn) has £45,000 in net assets [FACT — Companies House, BigBarn Network Ltd], 24 years of technical debt, and no capital for a major product rebuild. The most important institutional player (FRA) is more valuable as a partner than a competitor. The most structurally dangerous threat (VC-backed or media-backed new entrant) has a 12–18 month execution window before Farmmap's data moat and domain authority make entry materially harder.

### 6.2 Competitor Profiles

**BigBarn (bigbarn.co.uk)** — Founded 2000. The closest direct product competitor to Farmmap's V2 proposition. BigBarn is a UK local food directory covering farm shops, farmers markets, box schemes, and food producers. It has a map component but it is supplementary, not primary; the mobile experience fails 2026 Core Web Vitals standards; there is no honesty box category; no Ireland or Northern Ireland coverage; no Stripe Connect marketplace; no owner performance dashboard. Companies House records show BigBarn Network Ltd (CH: 05527461) as a micro-entity with approximately £45,000 in net assets and no disclosed employees as of the 2023 filing. [FACT — Companies House] Premium listing fees are estimated at £10–£30/month (no published pricing page). Estimated monthly sessions: 30,000–80,000 (inference from 24-year domain age and SimilarWeb public-tier indicators). [INFERENCE — competitor-matrix.md] BigBarn's domain age creates SEO headstart for 'farm shop near me' and related queries that Farmmap will need 12–18 months of aggressive content production to close. Threat: **3/5**.

**Farm Retail Association directory (farmerretail.co.uk)** — The UK's most authoritative farm shop directory by institutional trust. Membership-gated: covers approximately 1,200 member businesses; the 2,300+ non-member shops are invisible. Not map-first; no interactive pin browsing; no mobile-first UX; no honesty boxes; no Republic of Ireland coverage; no marketplace capability. The FRA directory is a member benefit bundled with trade body membership (£200–£800/year), not a standalone commercial product. FRA's primary relationship is B2B with member farm shops, not B2C with consumers. The FRA can endorse or block Farmmap's credibility with a single communication to its member base. Estimated monthly sessions: 15,000–40,000 (inference; FRA known brand in sector). [INFERENCE — competitor-matrix.md] The FRA cannot be defeated in the institutional credibility dimension; the correct strategy is partnership, not competition. Threat: **4/5** if hostile; converted to **primary acquisition channel** if endorsed.

**yourhonestybox.com** — Founded circa 2019–2021; Ireland and Northern Ireland only; community-contribution honesty box directory with no commercial model. 336 Irish and NI honesty box listings used as Farmmap seed data (consent confirmed). Growing at an estimated 20–25% per year in listings. [INFERENCE — competitor-matrix.md] No farm shop vertical; no UK presence; no owner dashboard; no subscription model; WordPress/Google Maps stack with no marketplace capability. Estimated monthly sessions: 2,000–8,000 (inference; niche Irish geographic scope). [INFERENCE — competitor-matrix.md] yourhonestybox.com's team has confirmed consent for Farmmap's commercial use of the 336 listings; formal data licence agreement is in progress. **Status: confirmed data partner.** Threat: converted to opportunity; **0/5** commercial threat once data licence executed.

**Google Maps** — 1 billion+ monthly active users globally (Google I/O 2021). [FACT — Google I/O 2021] Farm shops appear as Google Business Profile (GBP) listings when claimed; honesty boxes almost never have a GBP. 43% of farm shops have incorrect or stale data on Google Maps. [FACT — AHDB Farm Business Survey 2023] Google Maps has no honesty box category, no product catalogue integration, no seasonal filter, and no marketplace. Generic platform not designed for browsable local food discovery. Google Maps is Farmmap's primary consumer acquisition channel (organic search traffic), not its primary competitor. Threat: **2/5** near-term. Structural threat (Google adds a farm shop category filter) is real but not imminent; Farmmap's SEO depth and Bronze/Silver/Gold commercial stack are defensible before any such filter could be built and widely adopted.

**Facebook Business Pages** — Estimated 60–70% of UK farm shops with any digital presence use a Facebook Business Page. [INFERENCE — FRA Digital Adoption Survey 2022] Facebook serves a farm shop's *existing* audience; it does not serve new consumer discovery. A consumer searching "farm shop near me" does not use Facebook search; they use Google. Janet Hargreaves (P3 persona) has 340 Facebook followers managed by her daughter — these are existing customers, not the new customers Farmmap finds. The sales objection "I'm already on Facebook and it's free" is the hardest conversion barrier Farmmap faces; the correct rebuttal is "Farmmap finds the customers you don't have yet." Threat: **2/5** (different job served; primary obstacle is sales conversation, not market position).

**LocalFoodFinder** — Inactive; ceased active development; residual search rankings only. Historical ghost in the space; relevant only as a prior-failure reference in sales conversations. Threat: **1/5**.

**Farmdrop** — Closed February 2022. Raised £12 million in VC funding. [FACT — Crunchbase; The Grocer] Reported losses of approximately £8 million in FY2020. [FACT — Companies House filing] Farmdrop's model was structurally different from Farmmap: it was a curated marketplace with its own logistics, warehousing, and last-mile delivery fleet. It failed on last-mile unit economics, supplier dependency at scale, and unsustainable VC-funded consumer acquisition. Farmmap's model is the structural inverse of Farmdrop's fatal choices: Stripe Connect Standard makes the farm shop the merchant of record; Farmmap never touches inventory or logistics; revenue is from subscriptions and commission, not retail margin; consumer acquisition is SEO-driven (organic), not paid subsidies. Farmdrop's failure is not evidence that local food as a category is unviable — it is evidence that taking on logistics and acting as a food retailer at this scale is. Threat: **0/5** (closed; strongest differentiation narrative available).

### 6.3 Competitor Comparison Matrix

| Feature | Farmmap | BigBarn | FRA Directory | yourhonestybox.com | Google Maps | Facebook Pages |
|---------|---------|---------|---------------|-------------------|-------------|----------------|
| Map-first UX | Yes | Supplementary | No | Yes | Yes (generic) | No |
| Mobile-first | Yes | No | No | Partial | Yes | Yes |
| Honesty boxes | Yes (first-class) | No | No | Yes (Ireland/NI only) | No | Rare |
| UK coverage | Yes | Yes | Members only | No | Yes | Variable |
| Ireland/NI coverage | Yes | No | No | Yes | Yes | Variable |
| Free listing (permanent) | Yes | Partial | Members only | Yes | Free (GBP) | Free |
| Owner analytics dashboard | Yes (Bronze) | Basic | No | No | Via GBP | Basic insights |
| Online marketplace | Yes (Silver/Gold) | No | No | No | No | Limited (Shops feature) |
| Done-for-you marketing | Yes (Gold) | No | No | No | No | No |
| Allergen data fields | Yes (V3 mandatory) | No | No | No | No | No |
| Stripe Connect Standard | Yes | No | No | No | No | No |
| Product catalogue | Yes (Silver/Gold) | Basic | No | No | No | No |
| Consumer reviews | Yes (V2 planned) | Basic | No | No | Yes (GBP) | Yes |
| Threat level | — | 3/5 | 4/5 | Partner | 2/5 | 2/5 |

### 6.4 Porter's Five Forces

The following table is extracted from `porters_five_forces.json`.

| Force | Rating | Evidence | Strategic Implication |
|-------|--------|----------|-----------------------|
| Rivalry among existing competitors | Low (2/5) | BigBarn: ~£45k net assets, 24-year technical debt, no marketplace. FRA directory: member benefit, not a commercial product. yourhonestybox.com: Ireland/NI only, no commercial model, confirmed data partner. LocalFoodFinder: inactive. Farmdrop: closed. No well-funded direct competitor with a comparable product set. | 18-month execution window before a credible competitor can replicate Farmmap's listing database and SEO authority. Priority is speed to listing density and domain authority, not defensive product differentiation. |
| Threat of new entrants | Medium (3/5) | Technical barriers low: PostGIS + Next.js is achievable for a competent team. Data acquisition (3,500+ verified listings) takes 12–18 months. A VC-backed or media-backed entrant (Country Living, Countryfile) could enter with capital for consumer acquisition and farm shop sales teams. | farmmap.co.uk exact-match domain, yourhonestybox.com partnership, and 953-listing head start are assets a new entrant cannot acquire. FRA partnership pursued from Month 1 is the primary defensive action. The 12–18 month execution window is the urgency driver. |
| Threat of substitutes | Medium (3/5) | Google Maps default consumer discovery; 43% of farm shop data incorrect/stale (AHDB 2023); no honesty box category; no browsable explore experience. Facebook Business Pages serve existing audiences, not new consumer discovery. Yell/TripAdvisor appear incidentally; no category depth. Critical substitute risk: Google adds a 'farm shop' category filter. | Farmmap must reach consumers before they default to Google Maps. SEO authority for 'farm shop near me', 'honesty box near me', and county-level long-tail queries is the primary moat. Bronze/Silver/Gold commercial stack — dashboard, product catalogue, marketplace — is not threatened by any Google Maps enhancement. |
| Bargaining power of suppliers | Low (2/5) | No single farm shop controls meaningful leverage. OSM tiles free under ODbL. Supabase and Vercel are competitive providers with alternatives. Stripe Connect Standard is de facto standard for UK marketplace payments. yourhonestybox.com partnership is the one supplier relationship with meaningful leverage — loss of 336 Irish listings removes Farmmap's most differentiated territorial position. | Farmmap controls the consumer relationship and therefore controls the commercial relationship with farm shops. Formalise yourhonestybox.com as a data licence (not just consent) to convert the cooperative relationship into a structural agreement before either party's circumstances change. |
| Bargaining power of buyers | Medium (3/5) | Farm shop owners are sceptical buyers with prior bad experience from Yell, BigBarn, and regional 'buy local' campaigns. Facebook and Google are free alternatives. Bronze at £20/month is low friction but requires traffic evidence to convert. Silver and Gold buyers are more committed once marketplace GMV is established. Consumers have zero switching cost. | Traffic-triggered email and traffic-first go-to-market are the correct responses to buyer power. Analytics dashboard is the mechanism by which buyer power is neutralised — showing owners their session count before requesting subscription converts sceptical buyers. 90-day trial for first 50 subscribers reduces the commitment barrier. |

**Overall industry attractiveness: Attractive.** The farm shop directory space is structurally attractive: low existing rivalry with financially weak incumbents, a compounding data moat that takes 12–18 months to replicate, and a growing addressable market driven by ELM-scheme farm diversification. [FACT — porters_five_forces.json] The primary structural threats — Google filter addition, VC-backed entrant — are not imminent within the 18-month execution window. The medium buyer power from sceptical farm shop owners is manageable through the traffic-first commercial model. The primary execution risk is the solo founder capacity constraint, not competitive or structural market dynamics.

### 6.5 Why Farmmap Wins

Farmmap's defensible competitive position rests on five specific advantages, not generic claims:

**The data asset.** 953 seeded and verified listings across five nations, including 336 Irish and NI honesty box listings obtained with explicit written consent from yourhonestybox.com. No competitor has assembled this dataset. Building an equivalent dataset from scratch takes 12–18 months of research and the yourhonestybox.com community trust relationship is not replicable by a new entrant regardless of capital.

**The yourhonestybox.com partnership.** Farmmap is the only UK-wide directory that covers Irish and NI honesty boxes with community consent and co-branding. This is a territorial moat: no UK farm shop directory has Ireland/NI honesty box coverage, and no Irish honesty box directory has UK farm shop coverage. The partnership converts a potential competitor into an asset.

**The honesty box distinction.** Treating honesty boxes as first-class listing types — equal in discovery priority to farm shops — is a deliberate product choice no competitor has made. No UK-wide authoritative directory of honesty boxes exists. "Britain's honesty boxes, mapped" is not a marketing claim; it is a factual description of a product asset that Farmmap is uniquely positioned to own.

**Mobile-first and map-first architecture.** Farmmap's product is built for the consumer use case: opening the map in a car, on 4G rural connection, without creating an account, and making a detour decision in under 20 seconds. BigBarn's desktop-first UX fails Core Web Vitals for mobile. FRA's directory has no interactive map. Google Maps provides a generic map without the category depth that makes farm shop discovery useful.

**The Stripe Connect Standard legal architecture.** Farmmap is the only farm shop directory with a legally compliant marketplace payment architecture that correctly positions the farm shop as merchant of record, avoids FCA registration, and passes the pre-launch compliance assessment. This is not a feature — it is the legal foundation for any future marketplace tier. Any competitor building a farm shop marketplace without Stripe Connect Standard faces a more complex regulatory environment. Any competitor building with Stripe Connect Standard faces Farmmap's prior art, established merchant relationships, and SEO authority.

---

## 7. Target Market and Customer Segmentation

### 7.1 Market Size

**Total Addressable Market (TAM): £1.77 billion per year**

The TAM represents total consumer spend across UK and Ireland local food direct-sales channels. [INFERENCE — market_sizing.json; cross-checked against NFU and DEFRA estimates of £1.2–1.5bn for UK farm retail alone]

TAM calculation logic:

| Segment | UK | Ireland | Total | Basis |
|---------|-----|---------|-------|-------|
| Farm shops | £1,290m | £135m | £1,425m | FRA: ~3,000 shops × avg £430k consumer-facing turnover; Bord Bia: Irish farm retail direct sales estimate |
| Farmers markets | £225m | £30m | £255m | FARMA footfall data × average basket; Bord Bia Irish markets estimate [INFERENCE] |
| Honesty boxes and gate stalls | £72m | £15m | £87m | Estimated 2,000 UK honesty boxes × typical annual turnover £36k [INFERENCE] |
| **TAM Total** | **£1,587m** | **£180m** | **£1,767m** | |

**Serviceable Addressable Market (SAM): £250,000–£500,000 annual subscription and commission revenue potential**

The SAM represents Farmmap's revenue potential at mature penetration across 5,700 serviceable listings. [INFERENCE — market_sizing.json; tam-sam-som.md]

| Segment | Total Count | Addressable for Bronze | Addressable for Silver/Gold |
|---------|-------------|----------------------|----------------------------|
| UK farm shops | 3,000 | 3,000 | ~1,500 (those with sufficient digital engagement for marketplace) |
| UK honesty boxes | 2,000 | 400 (those with identifiable operators) | 0 (unstaffed; no marketplace applicable) |
| Ireland and NI | 700 | 500 | ~200 |
| **Total** | **5,700** | **3,900** | **~1,700** |

SAM revenue calculation: 3,900 addressable Bronze listings × 6% conversion × £20/month × 12 months = approximately £56,000 annually at base Bronze conversion; at 15% conversion (mature penetration): ~£140,000 annual Bronze revenue. Silver commission on 1,700 addressable listings at 30% Bronze conversion and £800/month GMV adds approximately £180,000. Total SAM at mature penetration: £250,000–£500,000 annually.

**Serviceable Obtainable Market (SOM): £163,892 Year 3 base case**

| Horizon | Metric | Value | Source |
|---------|--------|-------|--------|
| Month 12 | Monthly consumer visitors | 40,000–100,000 | ASSUMPTION — assumptions_register.json |
| Year 3 (base case) | Annual revenue | £163,892 | INFERENCE — value-bench.md; financial-model.md |
| Year 5 (base, single vertical) | Annual revenue | £286,320 | INFERENCE — value-bench.md |
| Year 5 (upside, GMV compounding) | Annual revenue | ~£450,000 | ASSUMPTION |
| Year 5 (portfolio, all 7 verticals) | Annual revenue | £2,205,000 | INFERENCE — value-bench.md §5 |

### 7.2 Target Market Definition

Farmmap's initial beachhead market is English farm shops within 50 miles of regional cities where young professionals are moving post-pandemic: the Home Counties (London commuter belt), East Midlands, Yorkshire, and the South West. These areas combine the highest farm shop density in England (FRA member data), the strongest consumer demographic alignment (ABC1 adults 35–65 with rural access), and the largest concentration of FRA member businesses accessible to early outreach.

The beachhead strategy is deliberately geographic and sequential: concentrate outreach to achieve 50 claimed, quality-enriched listings in two high-density counties (Surrey and Devon, or Surrey and Yorkshire) before expanding nationally. A regionally-dense launch cluster — 20–30 quality listings within a 20-mile radius — delivers a satisfying consumer browse session and creates a proof point that Farmmap works in practice. A nationally sparse distribution of 953 stub listings is a weaker consumer experience and a weaker Bronze sales argument. Density beats coverage in the first 12 months.

The case for Surrey as the primary beachhead county is specific: Surrey has one of the highest concentrations of farm shops relative to population in England; the consumer demographic (high-income, suburban, with regular rural access) is precisely Farmmap's P1/P2 consumer persona; and Surrey farm shops are within the FRA's most active membership region. A 30-mile radius from central Guildford covers over 40 listed farm shops in the seed dataset. A 20-mile radius from Harrogate in North Yorkshire covers a comparable density. These two clusters provide a credible quality-before-quantity argument in the first six months.

The secondary targets within the first 12 months are Devon and Herefordshire — both have among the highest farm shop densities in England per square mile and strong food tourism consumer demand that creates natural organic search volume for "farm shops Devon" and "farm shops Herefordshire" queries that Farmmap's county guide programme will directly address.

The third tier — digital-native early movers regardless of county — is accessible from Day 1 through the self-service claim workflow. Tom Ashworth (P4 persona) and his peers will claim their listings without outreach intervention; they are identified by an existing social media presence or a website URL in the seed listing data. The founder's outreach energy in Year 1 is correctly concentrated on the high-density beachhead counties for P3 Janet; the digital-native P4 segment will largely self-serve.

Expansion logic beyond the beachhead: Scotland and Wales via organic SEO as domain authority builds (lower FRA concentration; slower ELM-driven supply-side growth than England); Ireland via the yourhonestybox.com partnership and the LEADER community network once the data licence is formally executed; Northern Ireland via combined UK and Irish outreach leveraging the 73 NI honesty box listings and 29 NI farm shop listings already seeded. The UK-wide national expansion (Month 12–24) is the FRA partnership phase: FRA-endorsed communication to 1,200 member businesses converts the national outreach programme from cold to warm.

### 7.3 Market Segmentation

The supply-side (farm shop owner) and demand-side (consumer) segments are both required for Farmmap to work. The supply side generates the listings that create consumer value; the demand side generates the traffic that creates the commercial case for farm shop subscriptions. Neither segment can be prioritised over the other — they are interdependent. However, the sequencing is fixed: consumer traffic comes before Bronze conversion, because Bronze conversion requires traffic evidence.

| Segment | Core Need | Estimated Size | Accessibility | Priority | Rationale |
|---------|-----------|---------------|--------------|----------|-----------|
| Reluctant Digitalisers (P3 Janet) | Visibility without tech effort or financial risk | ~2,310 UK farm shops with no website | Low — requires FRA endorsement, personal rep visit, or trusted third party (e.g. daughter) as digital proxy | P2 — Bronze primary volume | Highest volume segment; highest CAC (£125–£190); needs traffic evidence before any conversation begins |
| Digital-Native Entrepreneurs (P4 Tom) | New customers beyond existing audience; online sales channel without building own infrastructure | ~690 UK farm shops with some web presence | High — self-service claim and Bronze upgrade; will complete onboarding without handholding | P1 — Bronze early movers | Lower CAC (£85–£125); higher LTV (Bronze-to-Silver progression 30%); most likely first cohort of paying Bronze shops |
| Irish cooperative managers | Multi-listing management for member farms; B2B efficiency | ~50 Irish agricultural cooperatives with direct-sales member farms | Medium — requires outreach to cooperative management and alignment with LEADER networks | P3 — V2/V3 feature; Year 2+ | Small absolute volume; high strategic value as Irish market anchor and B2B signal |
| Consumers in cars (P1 Sarah, P2 Marcus) | Impulse discovery while driving; pre-trip planning for rural excursions | 22.3 million UK adults who value locally produced food (FSA Food and You 2, Wave 7, 2024) | Very high — SEO-driven; zero acquisition cost; no account creation required to use the map | P1 — consumer (all phases) | Zero CAC; generates the traffic evidence that makes every Bronze sales conversation possible; the entire commercial model depends on this segment being reached first |

The critical sequencing rule: the consumer segment (P1 — consumers in cars) must be reached before any supply-side segment (P2 or P3) can be commercially engaged. A Bronze pitch to Janet Hargreaves without traffic data is a cold sales call that she will reject. A Bronze pitch to Janet with three months of session data showing 200 people viewed her listing is a data-led conversation she will find difficult to dismiss. The entire go-to-market model is built around getting consumer traffic to the listings first, then letting the traffic evidence do the commercial work.

The P1 consumer segment is not one monolithic group. The Saleability Critique identifies two distinct consumer sub-segments with different use patterns:

**P1 — Weekend Forager** (Sarah Whitfield, 38, Harrogate): Primary consumer; ABC1; 35–65; confident smartphone user; drives through rural areas; primary jobs are impulse discovery while driving (J1) and pre-trip planning (J2). The design implication is that the map must be instantly usable on mobile without account creation; loading performance on 4G rural connection is not optional; the listing pin must communicate enough in the tap — photo, product type, opening status — to enable a confident detour decision in under 20 seconds. This is the high-frequency use case that drives volume traffic.

**P2 — Ethical Foodie** (Marcus Okafor, 26, Guildford): Secondary consumer; 18–35; urban or peri-urban; digitally native; cycles up to 10 miles; wants rare breed meat and raw dairy he cannot find near him. Primary jobs are pre-trip planning (J2), trust verification (J3), and future online ordering (J4). The viral growth vector: shareable pins, Instagram posts of farm shop finds, TikTok honesty box discovery. This segment's social sharing behaviour amplifies Farmmap's organic reach without cost.

### 7.4 Buyer Roles

| Role | Representative Person | Decision Criteria | Primary Objection | Farmmap Response |
|------|----------------------|------------------|-------------------|------------------|
| Buyer (subscription) | Farm shop owner — P3 Janet (61, Sleaford) or P4 Tom (34, Malpas) | "Will this bring me more customers I would not otherwise have?" | "We were on BigBarn and could not attribute a single sale to it." | Show the dashboard first. "X people viewed your listing this month." Money conversation comes second. |
| User (discovery) | Consumer — P1 Sarah (38, Harrogate) or P2 Marcus (26, Guildford) | "Is this listing accurate? Can I trust I will find an open shop?" | "I drove there and it was closed." | Verified badge on claimed listings; opening hours on every claimed listing; moderation SLA of 48 hours |
| Influencer | FRA / agricultural press | "Does this benefit FRA members and the sector?" | "We already have a directory and this is a competitor." | "Farmmap covers the 2,300+ non-member shops your directory cannot. We are complementary, not competitive. Here is a co-branded FRA member filter." |
| Administrator | P5 Alex Kim (35, London) — Farmmap admin | "Is the moderation queue manageable? Is compliance maintained?" | Capacity constraint at scale (>238 listings by Month 18) | Admin console with bulk approval, severity-classified triage; content contractor from Month 20 |

### 7.5 Market Entry Sequence

The market entry sequence is fixed by the traffic-first commercial logic. Each phase is gated on the outputs of the previous phase; none can be accelerated by adding money or effort alone.

**Phase 1 — Consumer traffic first (Months 1–6):** Launch 953 listing pages with full JSON-LD structured data (LocalBusiness schema; GeoCoordinates; OpeningHoursSpecification); publish county guide SEO articles targeting high-volume long-tail queries from Week 1 of launch; establish Google Search Console monitoring and Plausible Analytics from Day 1; Core Web Vitals assessed weekly. Consumer traffic is not a commercial objective at this stage — it is the precondition for every Bronze sales conversation that follows. Target: 40,000 monthly visitors by Month 6.

The practical implication of Phase 1 is that the founder spends the majority of months 1–6 on two activities: building the SEO content programme (one county guide article per fortnight) and monitoring listing claim activity. No Bronze subscription conversations should be initiated until a cluster of listings has at least three months of session data showing meaningful consumer traffic. A Bronze pitch at Month 2 is premature; a Bronze pitch at Month 4 with data is not.

**Phase 2 — Beachhead Bronze (Months 3–12):** Concentrate active outreach on Surrey and one other high-density English county (North Yorkshire recommended for geographic diversity and FRA member density). Target 50 claimed, quality-enriched listings in these two counties before expanding nationally. First Bronze conversions via traffic-triggered email (automated); FRA outreach initiated in Month 1, target partnership active by Month 6. The 90-day trial offer for the first 50 Bronze subscribers starts only when a listing has demonstrated traffic; this ensures trial periods are not wasted on listings that are too new to have evidence. Reach 9 paying Bronze subscribers by Month 12.

**Phase 3 — National Bronze scale (Months 12–24):** Expand outreach nationally using the FRA partnership as a warm referral channel. The FRA endorsement — if secured by Month 6 — means that the national expansion in Months 12–24 is led by FRA member communications, not cold founder outreach. Agricultural show presence supplements the FRA channel: Balmoral Show (Northern Ireland, May), Great Yorkshire Show (July), county agricultural shows throughout the summer. The content and moderation contractor from Month 20 allows the SEO programme to continue at velocity while the founder concentrates on commercial development and Bronze-to-Silver conversion.

**Phase 4 — Silver marketplace and Ireland (Month 18–24):** V3 Silver marketplace live for qualifying Bronze shops (20+ ordering waitlist sign-ups or 6+ months of Bronze history). yourhonestybox.com partnership promotion in the Irish market — Farmmap's launch will be visible to Irish food communities through the yourhonestybox.com co-branding on all Irish/NI listings. LEADER outreach in the Republic of Ireland for grant-supported Bronze subscriptions. Scotland and Wales expansion via the national content programme organic SEO, supplemented by the FRA's Scottish and Welsh member base once the FRA partnership is active.

The geographic expansion is not driven by ambition but by evidence: each new county or region gets active outreach investment only when Farmmap has visible consumer traffic in that geography and a credible Bronze sales argument based on that traffic. Spreading outreach too thin before traffic exists is the single most common failure mode for directory businesses trying to scale before they have density.

---

## 8. SWOT Analysis and Strategic Position

### 8.1 SWOT Matrix

| Strengths | Weaknesses |
|-----------|------------|
| S1 — 953 seeded listings; no cold-start | W1 — No reviews/ratings system at V1/V2 |
| S2 — farmmap.co.uk exact-match domain | W2 — Demand leakage (no V3 ordering for 12+ months) |
| S3 — Map-first, mobile-first; PSF J1 STRONG | W3 — Standalone Year 3 revenue £164k; marginal without portfolio |
| S4 — Honesty boxes as first-class listing type | W4 — Farm owner acquisition slow and expensive (CAC £125 blended) |
| S5 — yourhonestybox.com data partnership confirmed | W5 — Attribution gap between page view and till receipt |
| S6 — Permanent free tier removes conversion barrier | W6 — yourhonestybox.com formal licence not yet executed |
| S7 — Stripe Connect Standard; correct legal architecture | W7 — No FRA relationship confirmed at writing |
| S8 — Multi-tenant engine (portfolio multiplier 4.9×) | W8 — Solo founder operational capacity constraint |

| Opportunities | Threats |
|---------------|---------|
| O1 — 22.3m UK adults value local food; trend structural post-COVID | T1 — Google adds native farm shop / honesty box category filter |
| O2 — 2,310 farm shops with zero web presence | T2 — VC-backed or media-backed entrant (Country Living, Countryfile) |
| O3 — ELM diversification wave growing supply-side | T3 — FRA builds or commissions its own modern directory |
| O4 — yourhonestybox.com has no commercial model; partnership deepenable | T4 — yourhonestybox.com database rights claim (highest-probability single-event risk) |
| O5 — Portfolio of 6+ verticals with same discovery-gap dynamic | T5 — Farm owner digital fatigue; 'another directory that won't deliver' objection |
| O6 — SEO compounding: 953 indexed pages + domain authority | T6 — Bronze conversion at 3% not 6% (financial sensitivity case) |
| O7 — BigBarn commercial decline; keyword position opportunity | | |

### 8.2 Strategic Implications

The SWOT matrix yields five non-obvious strategic implications that are specific to Farmmap's situation. They are stated as operational imperatives, not aspirations.

**1. Resolve the yourhonestybox.com data licence before V1 launch.** The intersection of W6 and T4 is the only item in this analysis representing a plausible single-event catastrophe. A cease-and-desist from yourhonestybox.com before launch would strip Farmmap's most differentiated territorial position — 263 Irish and NI honesty box listings — at the moment of maximum vulnerability. The cost of resolving it is low (a founder-level email and a straightforward data licence agreement); the cost of not resolving it is potentially fatal to the Irish market position. It is achievable in 30 days and costs negligible legal fees relative to the risk it removes.

**2. SEO land-grab from Day 1.** The 953 seeded listing pages are not map pins — they are 953 indexed URLs that Google can rank for long-tail farm shop and honesty box queries. Every day between V1 launch and the first county guide article is a day of SEO compounding foregone. The competitive SEO window against BigBarn is finite: BigBarn's existing domain authority gives it a 12–18 month head start on established queries. Farmmap closes that gap by owning the queries BigBarn has never targeted (honesty boxes, Ireland, specific county-level long-tail) and building content volume faster than BigBarn can with its declining commercial base. The county guide content programme must be running from launch week, not from Month 3.

**3. FRA partnership as the commercial-model unlock.** The SWOT's S1/O3 intersection (FRA relationship as opportunity) and W7/T3 intersection (FRA as threat if not engaged) represent the single binary outcome in the strategic landscape. The FRA endorsement converts cold outreach to warm referral at approximately 3× the conversion rate [ASSUMPTION — viability-gate.md condition: fra-relationship] and defeats the hardest sales objection — "we've heard this from directories before." Without it, every Bronze acquisition runs at £125 CAC and faces maximum scepticism. With it, the same acquisition runs at £45 CAC and is delivered with the trust endorsement of the trade body the farm shop already relies on. Every month without FRA alignment is a month of higher CAC and lower Bronze conversion.

**4. Traffic evidence before every Bronze conversation.** The traffic-triggered email mechanic and the analytics dashboard are not marketing tools — they are the prerequisite for any commercial conversation with a 50–70 year old farm shop owner who has already been burned by directories that did not deliver. W4 (high CAC for the Reluctant Digitaliser segment) is not solvable by spending more on acquisition; it is solvable by changing the sequence. The farm shop owner who opens Farmmap's Bronze conversation by saying "I can see that 200 people looked at my listing last month" is a fundamentally different buyer from the one who opens it saying "You're another directory trying to take my money." The former is a data-informed renewal decision; the latter is a cold sales resistance moment. Farmmap's commercial model is designed to reach every Bronze conversation in the former state.

**5. Portfolio framing in funding conversations.** The SWOT's W3 (standalone Year 3 revenue £164k is marginal without portfolio) is the single most important reframing required for any investor conversation. Standalone Year 3 revenue of £164k does not support a founding team on market salaries. The engine business — £2.2m Year 5 revenue across seven verticals with a 4.9× portfolio multiplier — is the correct framing for any investor conversation. Farmmap is not a farm shop directory business seeking funding; it is a map-first directory engine business seeking proof-of-concept validation through its first vertical. The difference in enterprise value between those two framings at Year 5 is approximately £9 million. [INFERENCE — value-bench.md]

---

## 9. Commercial Strategy

### 9.1 Pricing Model

Farmmap's pricing is structured as a three-tier freemium model. The free tier is permanent and unconditional; it is not a marketing device — it is the evidence generation phase that makes every paid conversion possible.

| Tier | Monthly Fee | Commission | Key Feature |
|------|-------------|------------|-------------|
| Free | £0 | None | Map listing, basic information, claimable |
| Bronze | £20/month | None | Branded presence, analytics dashboard, product catalogue (display) |
| Silver | £60/month | 3% on orders ≥ £20 | Online marketplace, order management, consumer waitlist activation |
| Gold | £100/month | 5% on orders ≥ £30 | Silver + done-for-you marketing service; up to 1,000 products |
| Campaign add-on | £50/campaign (Bronze); £100/campaign (Silver) | None | Newsletter feature or social post campaign |

### 9.2 Pricing and Positioning: Competitor Price Comparison

Bronze at £20/month is calibrated below the hesitation threshold for small rural businesses. [INFERENCE — pricing-hypothesis.md §1] The value-delivery ratio is defensible even in the worst modelled case: three new customers per year at £200 gross profit each exceeds the £240 annual Bronze cost by 2.5×. [INFERENCE — value-bench.md §1]

| Product / Tool | Monthly Cost | What Is Included | Value Comparison |
|----------------|-------------|-----------------|-----------------|
| Yell.com enhanced listing | £50–£200+ | Yell.com directory listing + advertising; no farm-specific audience | Farmmap: targeted local food audience at one-quarter the minimum cost |
| Checkatrade standard | £39–£72 | Tradespeople directory; lead generation; no rural/food context | Farmmap: niche farm shop audience; purpose-built product; lower cost |
| FRA membership (directory benefit) | £17–£67/month (annual divide) | Trade body benefits + directory listing; members only | Farmmap: covers non-members; map-first; honesty boxes; marketplace |
| Google Business Profile | Free | Google search + Maps listing; stale data risk (43% incorrect) | Farmmap: deeper farm shop data, analytics, verified badge, marketplace pathway |
| Facebook Business Page | Free | Existing audience only; no new consumer discovery | Farmmap: new audience discovery; consumers searching 'farm shop near me' |
| Shopify Basic | £25/month | Full e-commerce store; zero audience; owner sources traffic independently | Farmmap Silver at £60/month includes the audience Shopify cannot provide |
| BigBarn premium (estimated) | ~£10–£30/month | Directory listing; basic analytics; no mobile-first; no marketplace | Farmmap: modern UX, mobile-first, honesty boxes, Ireland, marketplace |
| **Farmmap Bronze** | **£20/month** | Branded presence + analytics dashboard + product catalogue (display) + Farmmap consumer audience | Purpose-built for farm shops at lowest-in-category cost |
| **Farmmap Silver** | **£60/month + 3%** | Above + online marketplace; audience acquisition problem bundled into subscription fee | Cheaper than Shopify + any marketing spend for shops processing £1,500+/month GMV |
| **Farmmap Gold** | **£100/month + 5%** | Above + done-for-you marketing service; newsletter, social posts, blog, homepage placement | Comparable social media agency retainer: £500–£1,500/month |

Silver's competitive case rests on the audience: Shopify Basic at £25/month provides e-commerce infrastructure with zero audience — the owner must independently drive traffic. Farmmap Silver at £60/month bundles the consumer acquisition problem into the subscription fee. For any farm shop spending more than £35/month on digital marketing to drive online orders (a low bar), Silver is cheaper than Shopify plus marketing on a total-cost basis. [INFERENCE — pricing-hypothesis.md §2]

The critical Silver decision point is approximately £1,500/month in Farmmap-processed GMV, at which point Silver cost (£60 + £45 commission) is comparable to Bronze + Shopify (£20 + £25 + ~£52 in Shopify fees). [INFERENCE — pricing-hypothesis.md §2] At GMV above £1,500/month, Silver is clearly superior because Farmmap provides the audience that generates that GMV.

### 9.3 Customer Acquisition Strategy

Farmmap's commercial model has an inbuilt sequencing requirement: consumer traffic must be established before farm shop owner acquisition can proceed credibly. A Bronze sales pitch without traffic evidence is an assertion; with traffic evidence it is proof. This sequencing is not a tactical choice — it is built into the product architecture. The traffic-triggered email does not fire until genuine sessions are recorded. The Bronze upgrade prompt does not appear on an unclaimed listing. The analytics dashboard does not exist until the listing is claimed. The entire sales funnel is traffic-gated.

**Channel 1 — Traffic-triggered email (lowest CAC, automated)**

When a listing's monthly page views cross a threshold (50 views in 30 days), the unclaimed listing owner receives an automated email: "People are finding your farm shop on Farmmap. [X] people viewed your listing this month." This reaches owners at peak receptivity — when consumer interest is fresh — and proves value before asking for money. The email design is critical: it must show a specific number (not a range), reference the shop by name, and include a single call to action ("Claim your listing to see who's visiting"). Estimated CAC: £85. [ASSUMPTION — business_intake.json]

The traffic-triggered email is the only automated channel that can reach Janet Hargreaves (P3 persona, 61, Sleaford) without requiring a third party to introduce Farmmap. Janet's daughter manages her Facebook page from London; she checks email occasionally; she does not use LinkedIn or Twitter. An email showing her that 50 people looked for her farm shop last month is the one cold message she is likely to open, because it is about something she cares about (customers) rather than something she does not (digital products).

**Channel 2 — FRA partnership (warm referral, highest leverage)**

An FRA-endorsed communication to 1,200 member businesses converts cold outreach to warm referral at approximately 3× the conversion rate. [ASSUMPTION — viability-gate.md condition: fra-relationship] The FRA pitch must be framed correctly: Farmmap is not asking the FRA to endorse a product that competes with their directory. It is asking the FRA to endorse a product that covers the 2,300+ non-member farm shops that the FRA's own directory cannot reach — shops that are invisible to consumers who would choose FRA-quality farm shops if they could find them. The FRA member badge, displayed on qualifying listings, is the co-branding mechanism that makes the partnership visible to consumers and reinforces FRA's role as the sector's quality standard.

The FRA relationship is binary in its commercial impact. With FRA endorsement: CAC falls to approximately £45, farm shop owners open emails from a trusted source, and the "we've seen this from directories before" objection is defeated by institutional credibility. Without FRA endorsement: CAC remains at £125+ and every outreach conversation begins from cold. Every month without FRA alignment is a month of higher marketing spend and lower conversion rates. Estimated CAC via FRA channel: £45. [ASSUMPTION — financial_inputs.json]

**Channel 3 — Agricultural shows (high-touch, high conversion)**

Live map demonstrations at agricultural shows (Balmoral Show, Royal Highland Show, county agricultural shows) show farm shop owners their own listing on a mobile screen in real time. This touchpoint is uniquely powerful because it converts an abstract digital product ("a map on a website") into a tangible experience ("here is your farm shop, here are your 20 nearest neighbours, and here is what a consumer sees when they tap your pin"). The conversion rate of 20–30% [INFERENCE — saleability-critique.md §1] reflects the qualitative difference between showing a farm shop owner their own listing versus explaining what a listing looks like.

Show attendance costs — stand hire, travel, materials — run to £500–£2,000 per show. At 20% conversion and £125 blended CAC per Bronze shop, a show with 50 farm shop owner conversations and 10 Bronze conversions recovers the stand cost in the first month of subscriptions. Agricultural shows are the highest-leverage single-day investment available to Farmmap outside the FRA endorsement. They are also the correct environment for the P3 Janet demographic: farm owners attend shows because they are the social and professional community events of the agricultural calendar, not because they are looking for digital products. Farmmap's presence at a show the farm owner is already attending eliminates the attention-capture problem that makes cold digital outreach so ineffective for this demographic. Estimated CAC via rep/show channel: £190. [ASSUMPTION — financial_inputs.json]

**Blended CAC target: £125 per paying Bronze shop.** [INFERENCE — assumptions_register.json ASM-013]

The blended CAC of £125 reflects a portfolio of channels weighted by volume: the majority of Bronze conversions in Year 1 come from traffic-triggered email (automated, low-cost); the minority come from FRA warm referrals and show attendance. As the FRA partnership scales and the automated email programme matures, the blended CAC is expected to decline toward £80–£100 by Year 2 as the FRA channel handles a larger proportion of conversions at its £45 unit cost.

### 9.4 Sales Funnel

The Bronze conversion pathway operates as a structured funnel with distinct stages, measurable metrics at each stage, and automated mechanics that require no manual intervention until the owner is already engaged. The design principle is that no stage of the funnel requires the founder to manually trigger an action for an individual listing owner — every touchpoint except personal follow-up is automated.

The funnel's load-bearing assumption is the 6% free-to-Bronze conversion rate applied to claimed listings. [ASSUMPTION — assumptions_register.json ASM-005] This is not a 6% conversion from all 953 seeded listings — it is 6% of the subset that have been claimed. The claim rate (15% at Month 12) and the conversion rate (6% of claimed) multiply to produce the total Bronze subscriber count: 953 × 15% × 6% = approximately 9 Bronze shops at Month 12. The funnel's sensitivity to the conversion rate is examined in Section 11.5 (break-even analysis): at 3% conversion, Year 3 revenue halves.

The funnel is designed to address the specific objection profile of the P3 Janet persona. Janet does not respond to cold email pitches. She does not subscribe to digital marketing tools based on promises. She responds to evidence — specifically, evidence that people are looking for her farm shop. The funnel is therefore structured to generate that evidence before making any request of Janet. The traffic-triggered email is not a sales email; it is a data notification. The claim workflow is not a sales workflow; it is an information update tool. The Bronze upgrade prompt does not appear until Janet has logged in to see her dashboard and viewed her session data. By the time Farmmap asks Janet for £20/month, she has already seen the product working for her specific business. That is not a sales conversation; it is a renewal decision.

| Stage | Consumer or Owner Action | System Action | Channel | Target Metric |
|-------|-------------------------|--------------|---------|---------------|
| Awareness — consumer | Consumer searches 'farm shop near me [county]' | Serve SEO-indexed listing page | Google organic search | 40,000 monthly visitors by Month 6 |
| Awareness — farm shop owner | Owner discovers Farmmap listing exists for their shop | Traffic-triggered email fires at 50 sessions/30 days | Automated email (Resend) | 50%+ open rate (peak receptivity) |
| Interest | Owner clicks email link; views their listing | Dashboard preview shown (first session); listing data displayed | In-product landing page | 30%+ click-through from email |
| Claim | Owner initiates claim ("Is this your listing?") | Email verification token sent and validated | Self-serve claim workflow | 15% claim rate by Month 12 |
| Consideration | Owner reviews analytics dashboard over 30–90 days | Accumulate and display session data; show visitor geography | Analytics dashboard | 90-day dashboard engagement |
| Conversion | Owner clicks Bronze upgrade prompt | Stripe Billing subscription created; 90-day trial begins | In-product + email | 6% of claimed → Bronze (base case) |
| Retention | Owner checks dashboard monthly; session count grows | Monthly summary email; dashboard accessible 24/7 | Email + in-product | 85% annual retention (Bronze) |
| Expansion | Bronze analytics shows consumer ordering waitlist | Silver upgrade prompt appears at 20+ waitlist sign-ups | In-product | 30% Bronze → Silver by Month 24 |

### 9.5 Promotional Strategy

Farmmap's promotional strategy uses specific, attributable channels — not generic "social media and content." Each channel has a target metric and a defined investment level.

**SEO content programme (primary, highest long-term return):**

953 listing pages are 953 indexed URLs from Day 1. Every seeded listing page carries JSON-LD LocalBusiness structured data, GeoCoordinates, and OpeningHoursSpecification — the technical SEO foundation that enables Google to surface listings in "farm shop near me" results without requiring manual SEO work for each listing. The programmatic SEO value of 953 structured listing pages, compounding with domain authority over 12–24 months, is the primary consumer traffic asset.

On top of the listing pages, the editorial content programme targets county-level and regional queries that no competitor currently owns well:
- "The best farm shops in Surrey" (estimated 1,200+ monthly searches nationally for county-level farm shop guides)
- "Honesty boxes in Yorkshire: the complete guide" (no authoritative result exists for this query)
- "Farm shops near Guildford" / "farm shops near Harrogate" (city-proximity queries with high purchase intent)
- "Where to buy raw milk in England" / "farm shops with online ordering" (specific-capability queries)
- "Natasha's Law compliant farm shops" (compliance-signal query emerging from 2021–2024 allergen awareness)

Target: 40,000 monthly visitors by Month 6; 100,000 by Month 12. The Month 6 target of 40,000 requires approximately 20 county guide articles indexed and ranking, plus the 953 listing pages serving long-tail location queries. This is achievable at one article per fortnight from launch. Metrics tracked weekly: Google Search Console impressions, clicks, average position, and CTR by query cluster; Plausible Analytics monthly visitor count and session duration.

**PR campaign at V1 launch:**

The "Britain's honesty boxes mapped for the first time" story has genuine national media value. No UK-wide authoritative map of honesty boxes has ever existed. The story angles available to Farmmap at launch:

- *The product story:* "We mapped 953 farm shops and 263 honesty boxes across the UK and Ireland. Here's what we found." (data-led feature for food media and rural press)
- *The partnership story:* "Britain and Ireland's honesty box communities come together in Farmmap's launch." (yourhonestybox.com co-announcement for Irish and NI media)
- *The founder story:* "One person. 953 farm shops. Why I spent a year mapping Britain's hidden food producers." (human interest for food writing community)
- *The data story:* "43% of UK farm shops have incorrect data on Google Maps. Farmmap fixes that." (provocation for technology media and digital farming coverage)

Target publications for launch PR: BBC Countryfile Magazine (1.6 million monthly readers), The Guardian Weekend food section, Country Living, Which? (consumer interest angle on accurate vs. stale maps), Mumsnet (family day-out discovery angle), Farmers Weekly (trade angle on digital adoption). Secondary targets: local newspaper features in beachhead counties (Surrey and North Yorkshire); Irish Times food section for yourhonestybox.com partnership angle.

Target: 3–5 national publication features in the first 60 days of launch; 200+ inbound backlinks from coverage within 90 days; 2,000+ social shares of the honesty box map story. Each backlink from an authoritative food media publication accelerates domain authority accumulation by months relative to what content-only SEO can achieve.

**Agricultural shows (Year 2+, with Year 1 regional testing):**

Royal Highland Show (Edinburgh, June — 200,000 attendees); Balmoral Show (NI, May — 120,000 attendees); Great Yorkshire Show (Harrogate, July — 130,000 attendees); Cereals (Cambridgeshire, June — trade/arable focus); county agricultural shows throughout the summer season.

At each show, Farmmap's presence is a single table with a mobile phone displaying the live map and a farm shop owner sign-up flow. The demonstration script is: "Your farm shop is on the map. Here it is. Here are the 20 nearest farm shops to yours. Here's what a consumer sees when they tap your pin. Would you like to know how many people viewed your listing this month?" The 20–30% conversion rate [INFERENCE — saleability-critique.md] is achievable because the demo bypasses the imagination barrier — the owner can see the product working for their specific business in real time.

Year 1 budget: one regional county show as a test (£500–£800 including stand, travel, materials). Evaluate conversion rate and CAC from that show before committing Year 2 budget to national show circuit.

**Email newsletter (from Month 1):**

Consumer email newsletter sign-up at V1 launch — "Get notified about farm shops and honesty boxes near you." Algorithm-proof distribution channel that compounds independently of SEO ranking changes. Target: 5,000 consumer newsletter subscribers by Month 12; 500 farm shop owner subscribers on the trade newsletter track. The consumer newsletter is the retention mechanism for the P1/P2 consumer segment: monthly "what's new on Farmmap" emails with seasonal farm shop highlights, new honesty box discoveries, and county-specific roundups keep Farmmap visible in low-intent periods when consumers are not actively searching.

**Earned food media and community:**

The 'farm shop discovery' audience is active on Instagram (countryside aesthetics, food provenance photography) and Twitter/X (food writing community, sustainable food advocates, rural affairs journalists). Content from the county guide programme is repurposed for social: a "farm shops in [county]" article becomes an Instagram carousel; an honesty box discovery becomes a Twitter thread. No paid social advertising in Year 1 — organic and earned media is the correct priority at bootstrap scale where every £100 of paid spend is better deployed on content that compounds indefinitely versus an impression that evaporates. The Eat Seasonably community (eatseasonably.co.uk) is a natural editorial alignment partner for seasonal content cross-promotion.

### 9.6 Retention Strategy

Bronze shops stay because the analytics dashboard builds a month-by-month evidence base for the value of the subscription. A shop owner who has watched their session count grow from 50 to 300 over six months has documented, attributable proof that Farmmap is delivering consumer attention they would not otherwise receive. Cancelling the subscription means losing that visibility and watching the session count fall — a visible, evidence-based cost of churn, not an abstract one.

The admin console (P5 Alex Kim persona) monitors subscriber health — low login activity and no analytics views are the leading indicators of churn — enabling a proactive retention email before cancellation. The content contractor from Month 20 ensures the county guide programme continues to grow consumer traffic to all listings, increasing the value of every Bronze subscription with each article published.

Silver shops stay because switching means rebuilding their online ordering infrastructure (migrating product catalogues, reconfiguring Stripe Connect, rebuilding the consumer ordering waitlist) and losing the Farmmap consumer audience that generates their GMV. The ordering waitlist — consumers who have signed up to be notified when a specific shop activates Silver — is an audience asset that lives on Farmmap's platform and cannot be exported by the shop operator. Silver churn means abandoning that audience.

Gold shops stay because Farmmap acts as their marketing department. The newsletter subscribers and social following cultivated through the Gold marketing service are partially dependent on Farmmap's distribution. Cancelling Gold means losing that managed marketing relationship, the homepage placement, and the priority search ranking — visible, attributable losses that the shop operator can quantify from their analytics dashboard. Gold annual churn of 12% [ASSUMPTION — assumptions_register.json ASM-020] reflects this structural stickiness.

---

## 10. Operations and Technology

### 10.1 Operating Model

Farmmap operates as a fully digital, asset-light platform with no physical retail presence, no inventory, and no logistics. The business model explicitly removes from Farmmap's operational scope every function that created the unit economics problem for previous farm-to-consumer businesses: there is no Farmmap warehouse, no Farmmap delivery fleet, no Farmmap inventory purchasing, and no Farmmap food handling. Every consumer transaction in the Silver/Gold marketplace passes through Stripe Connect Standard to the farm shop as merchant of record. Farmmap's operational scope is the platform itself — not the commerce that happens on it.

The operating model at V1 launch concentrates all functions on one person — the founder — supported by an automation-first product architecture that eliminates manual steps wherever possible. The traffic-triggered email is automated (Resend webhook from Supabase function). The listing claim workflow is self-service (email verification token → authenticated session). The Stripe Billing subscription is automated (checkout session → webhook → subscription record in Supabase). The moderation queue is batched and processed on a 48-hour SLA, not reviewed in real time. Manual human intervention is required only at exception points: a photo moderation decision that requires judgement, a Bronze subscriber support request, a reported listing that requires investigation.

This automation-first architecture is the product's economic foundation, not a convenience feature. At 57 Bronze subscribers in Year 3, a manual-process operating model would consume the founder's entire working day in support and moderation. At the same subscriber count, an automation-first model requires approximately 8–12 hours per week of operational time — the remainder is available for commercial development, content production, and the FRA relationship.

The product is UK-based in terms of legal jurisdiction, operations, and primary market, with Ireland and NI as a secondary market covered by the yourhonestybox.com partnership and the existing 336 seeded listings. The dual ICO/DPC data protection jurisdiction (UK GDPR + EU GDPR) is the most material operational compliance overhead — handled by the dual privacy policy and the EU GDPR Article 27 representative appointment (a low-cost third-party service, typically £500–£2,000/year for a small business).

### 10.2 Delivery Workflow

| Step | Consumer or Owner Action | System Action | Infrastructure Owner |
|------|-------------------------|--------------|---------------------|
| Map discovery | Consumer opens map on mobile; browses farm shop pins | Serve GeoJSON pin data from PostGIS spatial query | Next.js SSR + Supabase/PostGIS |
| Listing detail | Consumer taps a map pin | Render SSR listing page with photos, hours, product preview | Next.js RSC + Supabase |
| Waitlist sign-up | Consumer clicks 'Get notified when orders go live' | Store email against listing; increment waitlist count | Supabase + Row Level Security |
| Claim initiation | Farm shop owner clicks 'Is this your listing?' | Send email verification token to listed contact email | Supabase Auth + Resend |
| Claim verification | Owner clicks verification link | Create authenticated shop owner session; unlock claim workflow | Supabase Auth |
| Listing enrichment | Owner uploads photo, updates hours, adds products | Sharp image resize + Supabase Storage CDN; moderation queue triggered | Supabase Storage + admin queue |
| Bronze upgrade | Owner clicks upgrade prompt | Stripe Checkout session; subscription created in Stripe Billing | Stripe Billing + Supabase webhook |
| Photo moderation | — | Admin reviews uploaded photos within 24h SLA; approve/reject/request | Admin console (F11) |
| Stripe Connect onboarding (Silver) | Owner clicks 'Start taking orders' | Redirect to Stripe Connect onboarded account creation | Stripe Connect Standard |
| Consumer order | Consumer adds to basket + checkout | Stripe Connect PaymentIntent created; application fee applied | Stripe Connect Standard |
| Order notification | — | Owner receives new order email; order appears in management dashboard | Resend + Supabase webhook |
| Order fulfilment | Owner marks order as ready/dispatched | Consumer receives status update email | API route + Resend |

### 10.3 Technology Stack

| Layer | Technology | Rationale | Approximate Cost at Launch |
|-------|-----------|-----------|---------------------------|
| Frontend | Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui | SSR for SEO; App Router for streaming and edge; PWA for mobile; React Server Components | Free (Vercel hobby tier) |
| Database | Supabase PostgreSQL + PostGIS extension | Spatial queries (radius search, bounding box, delivery zone polygons); Row Level Security for multi-tenancy; mature production-grade | Free tier → ~£25/month at moderate scale |
| Auth | Supabase Auth | Integrated with DB; RLS enforced at database layer; manages C3 data per Constitution taxonomy | Included in Supabase |
| Map rendering | MapLibre GL JS + OpenStreetMap + MapTiler | Open-source; avoids Google Maps API variable cost; OSM ODbL attribution required; MapTiler free tier: 100,000 map loads/month | Free (MapTiler free tier at launch) |
| Payments (subscriptions) | Stripe Billing | Bronze/Silver/Gold recurring subscriptions; 2.9% + £0.30 per subscription | Per-transaction cost only |
| Payments (marketplace) | Stripe Connect Standard | Farm shop is merchant of record; Farmmap takes application fee; correct FCA regulatory architecture | 0.25% Connect payout fee per transaction |
| Storage | Supabase Storage + CDN | Shop photos, product images; integrated with Auth and RLS; CDN included | Free tier: 1GB → £0.02/GB above |
| Email | Resend | Transactional email: traffic-triggered emails, waitlist notifications, Bronze onboarding, order notifications | Free tier: 100 emails/day → $20/month above |
| CMS | Sanity (headless) | Editorial content only (county guides, blog posts); all transactional data in PostgreSQL | Free tier sufficient at launch |
| Hosting | Vercel (frontend, global edge) | Next.js-optimised; SSR + CDN at low variable cost | Free tier → ~£20/month at moderate traffic |
| Analytics | Plausible Analytics (privacy-respecting, cookieless) | Eliminates cookie consent banner for anonymous browsing (V1-C8); GDPR-compliant | £9/month at launch |
| Monitoring | Sentry (errors) + Better Stack (uptime) | Error tracking and uptime alerting | Free tiers adequate at launch |

### 10.4 Multi-Tenancy Architecture

Every database table in Farmmap's data model includes a `directory_id` column from Day 1. Supabase Row Level Security (RLS) policies enforce isolation at the database layer: a query against the `listings` table for the Farmmap directory returns only Farmmap listings; a query for the TractorMap directory returns only TractorMap listings. Authentication sessions are scoped to a directory. Admin console permissions are directory-scoped. No code change is required to add a new directory — only a configuration file, a new domain, and a seed dataset. The engine does the rest.

This is not an abstraction added in retrospect — it is a first-day architectural decision whose full value only materialises when the portfolio gate condition (100 Bronze subscribers) is met and the engine generalisation investment begins. The decision to bear the additional design complexity of a multi-tenant data model on Day 1 — when the business has zero subscribers and zero revenue — is justified by the portfolio multiplier: once Farmmap's engine is proven, each additional vertical requires £15,000–£25,000 to launch rather than £50,000–£100,000 to build from scratch. At Year 5, with seven verticals operating, the multi-tenant architecture's upfront cost is recovered approximately thirty times over.

Every vertical in the portfolio shares the same discovery-gap dynamic that justifies Farmmap: a niche segment of businesses that are underserved by Google Maps and have no category-specific directory. Independent craft breweries (BrewMap) are not well-served by Google's "brewery" category. Marina berths (BerthMap) have no browsable national directory. Coarse fisheries (FishMap) have no map-first day ticket discovery tool. Each vertical's data acquisition and seed dataset is the principal incremental cost; the technology, hosting, analytics, payment infrastructure, and admin tooling are already built and paid for by Farmmap.

The multi-tenant architecture means that Farmmap's £5,000 launch investment and the subsequent operating costs of running the platform are shared across all future verticals at no additional infrastructure cost.

The identified portfolio pipeline and its incremental investment per vertical:

| Vertical | Segment | Estimated Incremental Investment | Key Data Source | Dependencies |
|----------|---------|--------------------------------|----------------|-------------|
| TractorMap | Agricultural machinery dealers | £15,000–£25,000 | AHDB dealer data; regional agricultural press | Farmmap 100 Bronze gate |
| BrewMap | Independent craft breweries | £15,000–£25,000 | SIBA (Society of Independent Brewers) member data | Farmmap 100 Bronze gate |
| CampingMap | Independent campsites and glamping | £15,000–£25,000 | Pitch Up; camping club directories | Farmmap 100 Bronze gate |
| BerthMap | Marina berths and moorings | £15,000–£25,000 | RYA marina directory; Marina Developments Ltd data | Farmmap 100 Bronze gate |
| FishMap | Coarse fisheries and day-permit lakes | £15,000–£25,000 | Angling Trust; Environment Agency permit fishery lists | Farmmap 100 Bronze gate |
| ForecourtMap | Independent petrol forecourts | £15,000–£25,000 | UKPIA independent forecourt data | Farmmap 100 Bronze gate |

The portfolio gate condition (100 Bronze subscribers) is enforced as a hard business rule, not a guideline. The reason is specific: a multi-tenant engine that has not been validated by a paying subscriber base at scale has not been tested for the real-world edge cases that only production users create. Launching TractorMap on an engine with 10 paying subscribers means any architectural flaws surface at TractorMap's expense rather than being caught and fixed on Farmmap's smaller subscriber base first. The gate is a risk management mechanism, not a vanity metric.

### 10.5 Staffing and Capacity

**Launch — Month 20 (Founder only):**
The founder handles all functions. The admin console is designed as a productivity tool, not a consumer-facing product: bulk approval for obvious passes, severity-classified triage, impersonation capability for Bronze subscriber support, and immutable admin action logs. Moderation SLA targets: photos 24 hours; new submissions 48 hours; reported content 2 hours for priority illegal content.

**Month 20+ (Founder + Content and Moderation Contractor):**
Part-time contractor (approximately 2 days per week, £12,000/year) absorbs the moderation queue and editorial content production — county guide articles, editorial calendar, social scheduling. This is the single hire that de-risks the solo founder capacity constraint and allows the SEO content programme to continue at velocity while the founder focuses on commercial development and Bronze-to-Silver conversion work.

**Year 3 (Founder + Contractor + Head of Farm Shop Partnerships):**
The Head of Farm Shop Partnerships (£35,000/year) manages the telephone and field-based Bronze acquisition programme, agricultural show presence, FRA member relationship management, and the Bronze-to-Silver conversion programme. This hire unlocks the growth trajectory that founder-only Bronze acquisition cannot achieve alone.

### 10.6 Compliance Operations

The compliance framework is embedded in the product build specifications and operational procedures. Key gating conditions:

| Gate | Compliance Condition | Responsible | Deadline |
|------|---------------------|-------------|---------|
| V1 launch | yourhonestybox.com formal data licence executed (V1-C3, human co-sign) | Founder | Before V1 |
| V1 launch | Dual privacy policy (UK GDPR/ICO + EU GDPR/DPC) published | Founder / legal | Before V1 |
| V1 launch | EU GDPR Article 27 representative appointed (V1-C2) | Founder | Before V1 |
| V1 launch | FRA data written confirmation (V1-C7) | Founder | Before V1 |
| V1 launch | OSM ODbL attribution on all map views (V1-C5) | Build squad | Build phase |
| V1 launch | GDPR breach notification procedures documented and tested (V1-C6) | Founder | Before V1 |
| V2 launch | CCR 2013 pre-contractual information at payment pages | Build squad | Before V2 |
| V2 launch | DMCC 2024 auto-renewal notification implemented | Build squad | Before V2 |
| V2 launch | OSA 2023 illegal content risk assessment (before reviews F5) | Founder | Before V2 |
| V3 launch | 14 allergen fields mandatory in Silver/Gold product catalogue (V3-C1, human co-sign) | Build squad + legal | Before V3 |
| V3 launch | Food business registration declaration in Silver/Gold onboarding (V3-C6) | Build squad | Before V3 |
| V3 launch | Stripe Connect Standard PCI SAQ-A self-assessment completed | Founder | Before V3 |

Data classification: all data handled by Farmmap is classified under the agent-foundry Constitution taxonomy. Farm shop owner PII is C3; consumer PII is C3; session analytics are C1; payment tokens are handled by Stripe (never stored by Farmmap); authentication secrets are C6. C3 fields are hashed or redacted in all log output; C6 fields are never logged.

### 10.7 Operating Costs

| Cost Item | Month 1 | Month 12 | Month 24 | Month 36 |
|-----------|---------|---------|---------|---------|
| Hosting (Supabase + Vercel) | £0 | £45 | £95 | £150 |
| MapTiler tiles | £0 | £0 | £20 | £40 |
| Plausible Analytics | £9 | £9 | £9 | £9 |
| Resend email | £0 | £20 | £40 | £60 |
| Sentry / Better Stack | £0 | £0 | £26 | £26 |
| Marketing (content, shows, PR) | £150 | £400 | £800 | £1,200 |
| Legal and accounting | £300 | £250 | £500 | £600 |
| Content and moderation contractor | £0 | £0 | £1,000 | £1,000 |
| Head of Farm Shop Partnerships | £0 | £0 | £0 | £2,917 |
| Founder draw | £0 | £0 | £0 | £4,583 |
| **Monthly Total** | **£459** | **£724** | **£2,490** | **£10,585** |

Note: Founder draw is shown at annualised rates for Year 2 (£40,000) and Year 3 (£55,000) divided by 12. Month 36 reflects the full Year 3 run rate including all hires and founder salary. The Month 12 cost base (£724/month) is consistent with the financial model's Year 1 operating cost total of approximately £6,500. [FACT — financial_inputs.json]

---

## 11. Financial Projections

### 11.1 Key Assumptions

The following table lists the load-bearing assumptions in the financial model. Full register in `assumptions_register.json`.

| Assumption | Value | Status | Risk Level |
|------------|-------|--------|------------|
| Total serviceable listings (UK + Ireland) | 5,700 | Inference | Low |
| Seed listings at launch | 953 | Fact | — |
| Claim rate at Month 12 (% of 953) | 15% → 143 listings | Assumption | Medium |
| Claim rate at Month 36 (% of 953) | 50% → 477 listings | Assumption | Medium |
| Free-to-Bronze conversion — base case | 6% of claimed | Assumption | **High** |
| Free-to-Bronze conversion — downside | 3% of claimed | Assumption | — |
| Bronze-to-Silver progression (after 6+ months) | 30% of eligible Bronze | Assumption | High |
| Average Silver GMV/shop — early phase | £800/month | Assumption | **High** |
| Average Silver GMV/shop — Year 3 | £1,200/month | Assumption | High |
| Average Gold GMV/shop — early phase | £2,500/month | Assumption | High |
| Blended CAC per paying Bronze shop | £125 | Inference | Medium |
| Annual churn rate (Bronze/Silver) | 15% | Assumption | Medium |
| Annual churn rate (Gold) | 12% | Assumption | Medium |
| Monthly consumer visitors at Month 12 | 100,000 | Assumption | High |
| Stripe subscription fee | 2.9% + £0.30 | Fact | — |
| Stripe Connect payout fee | 0.25% | Fact | — |

The most sensitive assumption is the 6% free-to-Bronze conversion rate. A move to 3% halves Year 3 revenue and pushes break-even to Month 60+. [INFERENCE — financial-model.md sensitivity]

The 6% assumption is not a guess; it is based on the following reasoning chain. First, the traffic-triggered email fires only for listings that have already demonstrated consumer demand (50+ sessions in 30 days). This means the email recipient is not a cold lead — they are an owner whose listing is already generating interest. Second, the 90-day trial removes the initial commitment barrier: the conversion decision is a renewal decision made with 90 days of evidence, not a leap of faith. Third, the £20/month price point is below the median farm shop's annual digital marketing spend divided by 12, meaning the absolute cost is not the primary barrier. Fourth, the dashboard shows a specific, attributable number — not a vague "your listing is being seen" message but "X people clicked directions to your shop in the last 30 days."

The 3% downside case represents a world in which the dashboard evidence is not compelling enough — either because traffic volume is lower than modelled (contributing to the MR-05 risk), or because the 50–70 demographic is more resistant to digital spending than the model assumes, or because the 90-day trial creates a passive renewal behaviour (owners who do not engage with the dashboard and therefore do not see the evidence). The Month 9 downside review gate (Bronze conversion <4%, traffic <30,000/month) is designed to identify this failure mode before it becomes terminal.

The 100,000 monthly visitor assumption at Month 12 is the second most load-bearing figure. It underpins both the traffic-triggered email programme (a higher session count per listing accelerates the time to email trigger) and the Bronze sales conversation (a higher overall traffic number is more convincing than a lower one when shown to a farm shop owner as evidence of Farmmap's consumer reach). If the Month 6 traffic target of 40,000 is missed significantly (below 20,000), the Month 12 100,000 target is almost certainly unachievable without an acceleration investment — either in content production (which requires the Innovate UK grant or additional personal capital) or in PR and earned media (which requires founder time that may be in short supply).

### 11.2 Market to Revenue Bridge

| Step | Description | Value |
|------|-------------|-------|
| 1 | Consumer traffic at Month 12 | 100,000 monthly visitors |
| 2 | Claimed listings at Month 12 (15% of 953) | 143 listings |
| 3 | Bronze subscribers at Month 12 (6% of claimed) | 9 paying shops |
| 4 | Bronze subscribers at Month 36 | 57 shops |
| 5 | Silver shops at Month 36 | 33 shops |
| 6 | Gold shops at Month 36 | 10 shops |
| 7 | Year 3 annual revenue | £60,100 |

### 11.3 Year 1, 2, 3 P&L Summary

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Bronze shops (year-end) | 9 | 33 | 57 |
| Silver shops (year-end) | 0 | 17 | 33 |
| Gold shops (year-end) | 0 | 0 | 10 |
| Total Revenue | £1,360 | £11,292 | £60,100 |
| Direct Costs (Stripe + hosting) | £220 | £1,220 | £4,040 |
| Gross Profit | £1,140 | £10,072 | £56,060 |
| Gross Margin | 84% | 89% | 93% |
| Operating Costs | £6,500 | £63,000 | £90,000 |
| EBITDA | –£5,360 | –£52,928 | –£33,940 |
| Founder Salary Included | £0 | £40,000 | £55,000 |

[All figures from financial_inputs.json; calculations in financial-model.md]

### 11.4 Revenue Composition Year 3

| Revenue Line | Shops | Annual |
|-------------|-------|--------|
| Bronze subscriptions (45 avg × £20 × 12) | 45 avg | £10,800 |
| Silver subscriptions (25 avg × £60 × 12) | 25 avg | £18,000 |
| Silver commission (25 × £1,200 GMV × 3% × 12) | 25 avg | £10,800 |
| Gold subscriptions (5 avg × £100 × 12) | 5 avg | £6,000 |
| Gold commission (5 × £2,500 GMV × 5% × 12) | 5 avg | £7,500 |
| Campaign add-ons | — | £7,000 |
| **Year 3 Total** | | **£60,100** |

### 11.5 Break-Even Analysis

Break-even (all operating costs covered including founder salary) requires monthly revenue to cover the monthly operating cost run rate.

| Scenario | Break-even Month | Monthly Operating Cost Run Rate |
|----------|---------|------|
| Base case (6% conversion) | Month 42–48 | £7,500/month |
| Without founder salary in Years 1–2 | Month 30–34 | ~£2,500/month (infrastructure + content only) |
| Downside case (3% conversion) | Month 60+ | £7,500/month |
| With £25k Innovate UK grant in Year 2 | Month 36 | £7,500/month |

At the base-case growth trajectory, Farmmap's monthly revenue at Year 3 end is approximately £5,008/month against a monthly run rate of £7,500/month. Break-even is achieved by Month 42–48 as Bronze subscribers reach approximately 75–80, Silver approximately 45–50, and Gold approximately 15–20. [INFERENCE — financial-model.md break-even analysis]

### 11.6 Funding and Capital

**Bootstrap as primary path:**

The recommended approach is bootstrap. The £5,000 personal capital injection is sufficient to reach Bronze revenue self-sufficiency if spend is staged correctly. The technology stack's free-tier structure (Vercel free tier, Supabase free tier, Resend 100 emails/day free) means that Months 1–6 operating costs are below £500/month, dominated by legal and compliance setup rather than infrastructure. The incremental spend ramp (one county guide article per fortnight rather than a ten-article-per-week content agency) matches cash flow reality.

The month-by-month Year 1 spend plan (to be produced in Month 1 per the pre-launch checklist) must allocate capital to the four material Year 1 cost categories in priority order:
1. Pre-launch legal (yourhonestybox.com data licence, EU GDPR representative, ToS): ~£800–1,200
2. Build phase (if any third-party development assistance required beyond founder's own capability): £0–2,000
3. Content and marketing (county guides, PR, first show): £600–1,200
4. Infrastructure and tools (Plausible, occasional paid tiers): £400–600

Total Year 1 spend at base case: approximately £5,360 — slightly over the £5,000 capital. This requires either a £360+ personal supplement or careful sequencing of the legal spend to avoid simultaneous cash peaks.

**Innovate UK SMART grant (parallel track, Year 1 Q2–Q3):**

Farmmap's profile fits the AgriTech and rural digitalisation framing of multiple Innovate UK competitions. A SMART grant application (£25,000–£100,000 non-dilutive; typically 70% of eligible costs for a solo SME) would cover: data acquisition and geocoding at scale, technology development, and content programme. The grant application timeline (typically 4–8 weeks open, 8–12 weeks assessment) means a Q2 Year 1 application could deliver funds in Q4 Year 1 or Q1 Year 2 — timing that bridges the Year 1 cash constraint described in FR-01.

The Innovate UK application narrative: Farmmap is digitising farm-to-consumer discovery infrastructure for the UK farm retail sector during the most significant structural transition in English agriculture since post-war land reform (ELM BPS wind-down). The rural digitalisation angle, the AgriTech angle (spatial data + food supply chain transparency), and the SME digital adoption angle all align with current Innovate UK thematic priorities.

**Angel seed (post-launch, if required):**

Angel seed is not being sought pre-launch. A pre-revenue, pre-traffic seed raise will either fail or result in significantly dilutive terms that undervalue the product. Post-launch with traffic data — 40,000 monthly visitors, 9 paying Bronze shops, FRA partnership active — is the correct funding position. At that point, Farmmap can demonstrate: real consumer demand (traffic), commercial validation (Bronze subscribers), institutional backing (FRA), and a scalable platform architecture (multi-tenant engine). The narrative is also more fundable: "Farm-to-consumer discovery platform, 40,000 monthly users, 1,200 FRA-partner farm shop relationships" is a different conversation from "Here is a product specification and a spreadsheet."

Seed raise target if required: £150,000–£250,000 for 18–24 months of runway including founder salary and Head of Farm Shop Partnerships hire at break-even threshold. Enterprise value at seed round: approximately £1.5–3.0 million (based on 5–8× run-rate revenue at Month 12 equivalent; consistent with UK pre-revenue SaaS seed multiples). [INFERENCE — value-bench.md funding scenarios]

The Year 2 EBITDA deficit of –£52,928 is predominantly the founder salary line (£40,000). Without salary, Year 2 EBITDA is approximately –£12,928 — bridgeable from personal savings or part-time consulting income rather than requiring external capital. [INFERENCE — financial-model.md Year 2; funding-requirements.md]

---

## 12. Risk Register

### 12.1 Risk Summary

Farmmap's risk profile is shaped by two structural characteristics. First, it is a solo founder business: every risk that would be diversified across a founding team concentrates onto one person's capacity, health, and decision-making. Second, it is a traffic-dependent commercial model: every Bronze sales metric depends on consumer traffic being established, which depends on SEO execution, which depends on the content programme continuing at velocity while the founder is simultaneously conducting farm shop outreach, managing compliance obligations, and moderating the listing database.

The 17 identified risks span four categories. The Legal and Compliance category contains the highest-impact items because a legal failure (yourhonestybox.com database rights claim; food safety incident) can destroy the business in a single event regardless of commercial progress. The Market category contains the highest-likelihood items because farm shop owner adoption resistance and consumer traffic underperformance are structurally probable, not exceptional, given the prior evidence on directory failures in this sector. The Execution category contains the risks most directly under the founder's control — SEO execution quality, Bronze conversion rate optimisation — but also the one risk (solo founder incapacity) that is entirely outside it. The Financial category contains the risk that is most immediately actionable: Year 1 cash management is a planning problem that can be solved with a month-by-month spend plan, not an inherent business model flaw.

The following table presents all 17 identified risks. Full detail in `risk_register.json`.

| Risk ID | Category | Title | Likelihood | Impact | Score | Rating |
|---------|----------|-------|-----------|--------|-------|--------|
| MR-01 | Market | Farm shop owner adoption slower than modelled | 3 | 5 | 15 | HIGH |
| MR-02 | Market | Google Maps adds native farm shop category filter | 2 | 4 | 8 | MEDIUM |
| MR-03 | Market | FRA builds its own modern directory | 2 | 4 | 8 | MEDIUM |
| MR-04 | Market | VC-backed or media-backed entrant | 2 | 4 | 8 | MEDIUM |
| MR-05 | Market | Consumer traffic fails to reach 100k at Month 12 | 3 | 4 | 12 | HIGH |
| MR-06 | Market | yourhonestybox.com expands to UK | 2 | 3 | 6 | MEDIUM |
| ER-01 | Execution | Solo founder incapacity | 2 | 5 | 10 | HIGH |
| ER-02 | Execution | Bronze conversion at 3% not 6% | 3 | 4 | 12 | HIGH |
| ER-03 | Execution | SEO algorithm update penalises listing sites | 3 | 4 | 12 | HIGH |
| ER-04 | Execution | Moderation volume overwhelms solo admin | 3 | 3 | 9 | MEDIUM |
| FR-01 | Financial | Year 1 cash exhausted before Bronze revenue | 3 | 4 | 12 | HIGH |
| FR-02 | Financial | Silver marketplace GMV lower than modelled | 3 | 3 | 9 | MEDIUM |
| FR-03 | Financial | Stripe fee structure changes adversely | 2 | 2 | 4 | LOW |
| FR-04 | Financial | Gold commission cap negotiation erodes revenue | 2 | 3 | 6 | MEDIUM |
| LR-01 | Legal | yourhonestybox.com database rights claim | 2 | 5 | 10 | HIGH |
| LR-02 | Legal | Food safety incident linked to Silver/Gold shop | 2 | 5 | 10 | HIGH |
| LR-03 | Legal | GDPR data breach: dual ICO/DPC notification | 2 | 4 | 8 | MEDIUM |

### 12.2 Top Three Risks and 30-Day Mitigations

**LR-01 — yourhonestybox.com database rights claim (Score: 10 — HIGH)**

The highest-probability single-event catastrophe in the risk register. If yourhonestybox.com's team identifies that 336 of their listings have been used to seed a competing commercial directory without a formal documented agreement, a cease-and-desist is a legally credible remedy. An injunction stripping the Irish dataset at launch destroys Farmmap's most differentiated territorial position before any recovery is possible.

*30-day mitigation:* Contact yourhonestybox.com directly with a formal partnership proposal: a data licence agreement covering the 336 listings plus co-branding (Farmmap prominently credits yourhonestybox.com on all Irish/NI honesty box listings, with reciprocal linking). Target a signed agreement within 30 days. If not achievable: begin replacing the 336 listings with independently sourced Irish data as a parallel track. Do not approach V1 launch without this resolved. This requires human (founder) action — it cannot be delegated.

**MR-01 — Farm shop owner adoption slower than modelled (Score: 15 — HIGH)**

The financial model's most sensitive variable. At 3% Bronze conversion instead of 6%, Year 3 revenue falls from £60k to ~£26k and break-even moves to Month 60+. The risk is not irrational — farm shop owners aged 50–70 have prior experience of directories that promised traffic and delivered none.

*30-day mitigation:* Conduct 10–15 structured farm shop owner interviews in the first 30 days (founder-led; ~20 minutes each). Script the key question: "If Farmmap showed you that 50 people had viewed your farm shop listing in the last month, what would you do?" The response distribution determines whether the analytics dashboard is the right conversion lever or whether a different framing is required before V1 launch. Simultaneously, begin the FRA outreach process — even a preliminary positive response changes the Bronze acquisition economics significantly.

**FR-01 — Year 1 cash position exhausted before Bronze revenue (Score: 12 — HIGH)**

The £5,000 capital injection leaves a Year 1 closing balance of approximately –£360 on the base case. Any overage on legal or content spend tips the business into a negative cash position before Year 2 Bronze revenue begins.

*30-day mitigation:* Produce an explicit Month-by-Month Year 1 spend plan with committed allocations: ~£500 Month 1, ~£600 Months 2–4, ~£2,000 Months 5–8 (legal), ~£1,900 Months 9–12. Set a Month 6 cash checkpoint: if cash balance is below £1,000, stop discretionary spend and trigger either the Innovate UK grant application or a personal credit facility decision. Do not wait until the crisis point to make this decision.

---

## 13. Implementation Roadmap and KPIs

### 13.1 Launch Timeline

| Phase | Months | Milestone | Gate Condition |
|-------|--------|-----------|----------------|
| Pre-launch preparation | 1–2 | yourhonestybox.com data licence executed; FRA outreach initiated; farm shop owner interviews (15); Innovate UK grant application drafted | V1-C3 (human co-sign) |
| V1 Build | 1–4 | Eight-sprint build plan executed (80 tasks); all V1 compliance conditions met; 953 listings imported and geocoded | All V1-C1 through V1-C11 blockers resolved |
| V1 Launch | Month 4–5 | Public map live; PR campaign ('Britain's honesty boxes mapped'); yourhonestybox.com partnership announcement; JSON-LD markup on all 953 listings | farmmap.co.uk live with 953 listing pages |
| Consumer SEO | Months 1–12 | County guide articles published; Core Web Vitals monitored weekly; Google Search Console active | 40,000 monthly visitors by Month 6 |
| Bronze acquisition | Months 3–12 | Traffic-triggered email programme active; FRA partnership live; agricultural shows attended; 90-day trial for first 50 subscribers | 9 paying Bronze shops by Month 12 |
| V2 launch (Bronze public) | Month 6 | Bronze subscription payments live; CCR 2013 and DMCC 2024 compliance conditions met | All V2 blockers resolved |
| Bronze scale | Months 6–18 | Analytics dashboard optimised; 100 paying Bronze subscribers by Month 18 | 100 Bronze = portfolio engine gate |
| V3 launch (Silver) | Month 18–20 | Silver marketplace live; Stripe Connect Standard onboarding; allergen fields mandatory; allergen legal review completed | All V3 blockers resolved; human co-sign on allergen opinion |
| Portfolio signal | Month 18 | TractorMap waitlist landing page live | 500 waitlist sign-ups within 60 days |
| Silver scale | Months 18–36 | 33 Silver shops by Month 36; £15,000+ monthly GMV | Month 24: first Gold shops eligible |

### 13.2 KPI Dashboard

| KPI | Month 6 Target | Month 12 Target | Month 24 Target | Month 36 Target |
|-----|----------------|-----------------|-----------------|-----------------|
| Monthly consumer visitors | 40,000 | 100,000 | 150,000 | 200,000 |
| Total claimed listings | 50+ | 143 | 333 | 477 |
| Paying Bronze shops | 3+ | 9 | 33 | 57 |
| Paying Silver shops | 0 | 0 | 17 | 33 |
| Paying Gold shops | 0 | 0 | 0 | 10 |
| Monthly Recurring Revenue (MRR) | £60 | £180 | £660+ | £2,000+ |
| Bronze conversion rate (% of claimed) | — | 6% | 10% | 12% |
| Free-to-paid trial conversion rate | — | — | ≥60% | ≥65% |
| Silver GMV per shop (average) | — | — | £800 | £1,200 |
| Google Search Console impressions (farm shop queries) | 20,000/month | 100,000/month | 300,000/month | — |
| P3/Janet satisfaction (claim rate in target segment) | — | ≥15% of seeded UK farm shops | ≥35% | ≥50% |
| FRA partnership status | Outreach initiated | Agreement active | Active | Active |

### 13.3 Decision Gates

| Gate | Trigger | Action |
|------|---------|--------|
| Month 9 downside review | Bronze conversion < 4%, traffic < 30,000/month | Evaluate angel seed; extend trial period; revise FRA pitch |
| 100 Bronze subscribers | Bronze reaches 100 paying shops | Begin multi-tenant engine generalisation investment; launch TractorMap build |
| Silver activation per shop | Shop has 20+ ordering waitlist sign-ups OR 6+ months on Bronze | Activate Silver tier for that shop; deploy waitlist email |
| Gold activation per shop | Shop has 3+ months on Silver + 50+ completed orders | Make Gold available to that shop |
| Portfolio engine gate (portfolio) | Farmmap 100 Bronze confirmed | TractorMap V1 launch; BrewMap planning initiated |

---

## 14. References

All citations used in this business plan. Full structured record in `citation_register.json`.

1. Food Standards Agency. *Food and You 2: Wave 7 Survey*. 2024. food.gov.uk/research/food-and-you-2/food-and-you-2-wave-7

2. Farm Retail Association. *Digital Adoption Survey 2022*. Cited in FRA member newsletter Q1 2023. farmerretail.co.uk

3. Farm Retail Association. *Annual Farm Retail Survey 2023*. farmerretail.co.uk

4. Farm Retail Association. *Benchmarking Report 2022*. farmerretail.co.uk

5. Farm Retail Association. *Consumer Research 2023*. Cited in FRA Annual Review 2023. farmerretail.co.uk

6. BigBarn Network Ltd. *Micro-entity accounts*. Companies House. companieshouse.gov.uk

7. yourhonestybox.com. Public directory of honesty boxes in Ireland and Northern Ireland. Data consent confirmed by yourhonestybox.com for Farmmap commercial use of 336 listings.

8. FARMA. *Annual Survey 2022*. farmerretail.co.uk

9. Bord Bia (Irish Food Board). *Direct Sales Programme participant data 2023*. bordbia.ie

10. Country Land and Business Association. *Farm Diversification Report 2024*. cla.org.uk

11. Food Information (Amendment) (England) Regulations 2021 (*Natasha's Law*). In force: 1 October 2021. legislation.gov.uk

12. Data Protection Act 2018 incorporating UK GDPR. legislation.gov.uk/ukpga/2018/12

13. Regulation (EU) 2016/679 (General Data Protection Regulation). eur-lex.europa.eu/eli/reg/2016/679

14. Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013. SI 2013/3134. legislation.gov.uk

15. Digital Markets, Competition and Consumers Act 2024. legislation.gov.uk

16. Online Safety Act 2023. legislation.gov.uk/ukpga/2023/50

17. Directive 96/9/EC (*EU Database Directive*). eur-lex.europa.eu/eli/dir/1996/9

18. Copyright and Rights in Databases Regulations 1997. SI 1997/3032. legislation.gov.uk

19. Stripe Inc. *Connect Standard Accounts*. stripe.com/docs/connect/standard-accounts

20. Stripe Inc. *Stripe UK pricing*. stripe.com/gb/pricing. Accessed 2025.

21. Department for Environment, Food and Rural Affairs. *Agricultural Transition Plan 2021–2024 Update*. January 2024. gov.uk/government/publications/agricultural-transition-plan-2021-to-2024

22. Agriculture and Horticulture Development Board. *Farm Business Survey 2022/23*. ahdb.org.uk

23. Office for National Statistics. *Consumer Price Indices, March 2023*. ons.gov.uk

24. IGD. *Shopper Vista 2021*. igd.com

25. WRAP. *Citizen Food Futures 2022*. wrap.org.uk

26. OFCOM. *Adults' Media Use and Attitudes Report 2024*. ofcom.org.uk

27. AHDB/Defra. *Agricultural Land and Labour 2023*. ahdb.org.uk

28. Farmmap agent-foundry evidence pack: `specs/003-farmmap/` — discovery-pack/, market-pack/, personas-pack/, compliance-pack/, business-plan-pack/ (produced 2026-05-16 to 2026-05-17, agent-foundry methodology v1.0.0)

29. National Farmers' Union. *Diversification Survey 2023*. nfuonline.com

30. Crunchbase / The Grocer. *Farmdrop funding history*. Farmdrop raised approximately £12m VC funding; closed February 2022. Crunchbase, crunchbase.com; The Grocer, thegrocer.co.uk

---

## 15. Appendices

**Appendix A — Data Files (JSON)**

All structured data files supporting this business plan are located in `specs/003-farmmap/business-plan-pack/data/`:

| File | Contents |
|------|----------|
| `business_intake.json` | Core business description, known financials, open questions |
| `business_model_canvas.json` | Full Business Model Canvas |
| `competitor_matrix.json` | Eight competitor profiles with differentiators |
| `market_sizing.json` | TAM/SAM/SOM structured calculations |
| `customer_discovery.json` | Problem hypotheses, segment hypotheses, WTP, validation status, evidence gaps |
| `pestle.json` | Full PESTLE analysis by dimension and factor |
| `porters_five_forces.json` | Five forces with evidence and strategic implications |
| `swot.json` | 8 strengths, 8 weaknesses, 8 opportunities, 6 threats, strategic implications |
| `assumptions_register.json` | 26 assumptions with status, risk level, and financial model links |
| `risk_register.json` | 17 risks with likelihood, impact, score, rating, mitigation |
| `financial_inputs.json` | Full financial model handoff including revenue streams, P&L, break-even, scenarios |
| `citation_register.json` | 28 citations with full reference, key finding, and status |
| `pitch_deck_inputs.json` | All slide-level inputs for the pitch deck workflow |

**Appendix B — Supporting Evidence Pack**

Full agent-foundry evidence pack for Farmmap (feature 003-farmmap), located in `specs/003-farmmap/`:

- `intake.md` — Founder's original product brief
- `spec.md` — Full product specification v1.0.0
- `viability-gate.md` — Viability gate decision (GO; score 3.80/5.00)
- `discovery-pack/` — Problem-solution fit, value benchmark, saleability critique, value thesis, alternatives considered, discovery decision
- `market-pack/` — PESTLE analysis, competitor matrix, TAM/SAM/SOM, pricing hypothesis, barriers to entry, trend analysis, saturation index, SWOT analysis and decision, market decision
- `personas-pack/` — Six canonical personas (P1–P6), jobs-to-be-done map, requirements decision
- `compliance-pack/` — Compliance decision, 10 specialist assessment files (GDPR/DPA, consumer rights, accessibility, PECR, children's data, PCI-DSS, online safety, IP/copyright, financial services, food safety/allergen)
- `architecture-pack/` — Architecture decisions, data model, OpenAPI contract
- `build-pack/` — Eight-sprint build plan, 80 tasks
- `business-plan-pack/` — This document and all data files

**Appendix C — Key Dates and Pre-Launch Checklist**

| Item | Owner | Deadline |
|------|-------|----------|
| yourhonestybox.com data licence agreement executed | Founder | Before V1 launch |
| EU GDPR Article 27 representative appointed | Founder | Before V1 launch |
| Dual privacy policy (ICO + DPC) published | Founder/legal | Before V1 launch |
| FRA outreach initiated | Founder | Month 1 |
| FRA data written confirmation | Founder | Before V1 launch |
| GDPR breach notification procedures documented and tested | Founder | Before V1 launch |
| Terms of Service published | Founder/legal | Before V1 launch |
| Cookie consent (Plausible Analytics configuration) | Build squad | Before V1 launch |
| OSM attribution on all map views | Build squad | Build phase |
| WCAG 2.2 AA pre-launch accessibility audit | Build/QA | Before V1 launch |
| Farm shop owner interviews (15) | Founder | Month 1–2 |
| Innovate UK SMART grant application | Founder | Months 3–6 |
| Year 1 spend plan document (month-by-month) | Founder | Month 1 |

---

## 1. Executive Summary

### 1.1 Business Concept

Farmmap is a map-first, mobile-first directory of farm shops, honesty boxes, and farm gate stalls across the United Kingdom and the Republic of Ireland. Consumers browse for free without creating an account; farm shops claim their listing for free and upgrade to paid tiers for branded presence and online marketplace capability. The product launches with 953 verified listings — the largest geocoded dataset of UK and Irish farm shops and honesty boxes assembled in a single product. [FACT — intake.md]

### 1.2 The Problem

43% of UK adults value locally produced food. [FACT — FSA Food and You 2, Wave 7, 2024] 2,310 UK farm shops have no website and are invisible to digital discovery. [FACT — FRA Digital Adoption Survey 2022] Farm shops lose customers every week because those customers drive past without knowing the shop exists. No authoritative, browsable map of UK honesty boxes has ever existed. The existing commercial directory (BigBarn) has approximately £45,000 in net assets [FACT — Companies House] and 24 years of technical debt. The discovery gap is documented, large, and unoccupied by a capable product.

### 1.3 The Solution and Product

Farmmap closes this gap. The free V1 directory establishes domain authority, consumer audience, and farm shop owner trust. The V2 Bronze subscription (£20/month) converts consumer traffic evidence into a branded shop presence and analytics dashboard that farm shop owners can use to demonstrate ROI without attributing it to faith. The V3 Silver marketplace (£60/month + 3% commission) enables online ordering without requiring farm shop owners to build their own e-commerce infrastructure. Gold (£100/month + 5% commission) provides a done-for-you marketing service. The Stripe Connect Standard architecture makes the farm shop the merchant of record, correctly avoiding FCA registration for Farmmap. [FACT — compliance-decision.md]

### 1.4 Market and Financial Summary

The total addressable consumer spend across UK and Ireland local food direct sales is approximately £1.77 billion per year. [INFERENCE — market_sizing.json] The serviceable market of 5,700 digitally underserved listings represents a revenue potential of £250,000–£500,000 per year at mature subscription penetration. Year 3 base-case revenue is £163,892. [INFERENCE — value-bench.md; financial-model.md] Break-even — all operating costs covered including founder salary — is projected at Month 42–48 on the base case. Gross margin reaches 93% in Year 3 as the business scales on a predominantly software cost base.

The financial model's three critical variables are: (1) 6% free-to-Bronze conversion rate — the model's most sensitive assumption; (2) 100,000 monthly consumer visitors at Month 12 — the traffic threshold required to make the Bronze conversion pipeline work at modelled volume; (3) £800/month average Silver GMV per shop — the GMV assumption that drives commission revenue from Year 2 onwards. A simultaneous downside on all three variables produces break-even at Month 60+ and a Year 3 revenue of approximately £26,000 — survivable on bootstrap but requiring a significant pivot in commercial strategy. Each variable has a specific mitigation (see Section 12); none represents an inherent product market fit failure.

The Year 3 revenue figure of £163,892 is the Farmmap single-vertical base case. It is not the commercial thesis. The commercial thesis is the portfolio: £2,205,000 Year 5 revenue across seven verticals on the same multi-tenant engine. [INFERENCE — value-bench.md §5] At a 5× revenue multiple, the portfolio enterprise value at Year 5 is approximately £11 million. [INFERENCE — value-bench.md] Farmmap's purpose as a single vertical is to prove the engine, not to become a sustainable standalone business on Year 3 metrics alone.

### 1.5 Funding and the Portfolio Thesis

Farmmap launches on £5,000 personal capital. No external funding is required to reach break-even on the base case. Innovate UK SMART grant is the non-dilutive Year 2 option. Angel seed is not being sought pre-launch; the product is more fundable post-launch with traffic data than pre-launch with projections alone. The portfolio thesis — Farmmap as the proof-of-concept for a family of map-first directories (BrewMap, CampingMap, BerthMap, FishMap, ForecourtMap, TractorMap) sharing one multi-tenant engine — generates a Year 5 portfolio base-case revenue of £2,205,000 at a 4.9× multiplier over the single-vertical figure. [INFERENCE — value-bench.md §5] At a conservative 5× revenue multiple, the portfolio enterprise value at Year 5 is approximately £11 million. [INFERENCE — value-bench.md]

### 1.6 Status and Next Steps

Farmmap is pre-launch: specification v1.0.0 signed off, architecture complete, eight-sprint build plan with 80 tasks ready to execute, 953 listings geocoded and verified. The compliance assessment returned a Passed with Conditions verdict — all conditions are achievable within a normal pre-launch timeline.

The three actions required before V1 launch, in priority order:

**1. Execute the yourhonestybox.com data licence agreement.** This is the highest-priority legal action. Until the formal data licence is signed, the 336 Irish and NI honesty box listings cannot be served publicly without database rights exposure. The partnership proposal to yourhonestybox.com is the resolution: co-branding on all Irish/NI listings, reciprocal data licensing, and a commercial arrangement that converts their community data asset into a revenue-generating partnership. Target: signed agreement within 30 days of this plan's date.

**2. Appoint the EU GDPR Article 27 representative.** A straightforward compliance action with a predictable cost (£500–£2,000/year for a third-party representative service based in an EU member state). Required because Farmmap processes data of Irish consumers under EU GDPR jurisdiction. Target: appointed before V1 launch.

**3. Initiate the FRA data-sharing and endorsement conversation.** Not a pre-launch legal blocker, but the single highest-leverage commercial action available before V1. The FRA endorsement does not need to be confirmed before launch — but the conversation needs to be started, and the relationship needs to be warm. A cold FRA approach after Farmmap has been publicly live for six months is a weaker position than a pre-launch partnership proposal that frames Farmmap as complementary to the FRA's directory from day one.

The eight-sprint build plan (80 tasks across V1 core, V1 admin, V2 Bronze, V3 Silver foundation) is ready to execute. The four-month build timeline (Months 1–4) allows for pre-launch compliance obligations to be completed in parallel with development. V1 launch is targeted at Month 4–5 of operations.

---

*Business Plan v1.2.0 | Farmmap | [FOUNDER_NAME], Founder | 2026-05-18*
*Produced using agent-foundry methodology v1.0.0 | Evidence pack: specs/003-farmmap/*
*Authority: agent-foundry Constitution v1.0.0 | All numerical claims traceable to data files in business-plan-pack/data/*
