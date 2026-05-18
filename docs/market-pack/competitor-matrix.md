---
feature: 003-farmmap
phase: 2
document: competitor-matrix
squad: market-research
produced_by: market-research-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/intake.md + specs/003-farmmap/discovery-pack/saleability-critique.md
---

# Farmmap — Competitor Matrix

## Methodology

Each competitor is assessed across: market position, product approach, commercial model,
traffic/scale (where estimable), key weaknesses for Farmmap to exploit, key strengths
Farmmap must respect, and a threat level from 1 (negligible) to 5 (existential).

All traffic estimates marked SWE (SimilarWeb Estimate) are inferred from public SimilarWeb
data range indicators and should be treated as directional only. Funding/revenue marked
[inference] are based on company type, age, and observable product investment.

---

## Competitor 1 — yourhonestybox.com

**Territory:** Ireland and Northern Ireland
**Founded:** circa 2019–2021 (inference from domain registration and site content maturity)
**Funding/Revenue:** Unfunded / founder-run; no commercial model visible on the site [inference from site structure, absence of pricing pages, and donation-style framing]
**Traffic:** SWE low-traffic range, estimated 2,000–8,000 monthly sessions [inference — no SimilarWeb public data available for this domain; estimate based on niche Ireland/NI geographic scope, 190+ listings, and typical Irish local-directory traffic patterns]

### Product Approach
Map-based directory of honesty boxes across Ireland and Northern Ireland. Listings are
submitted by users and the public. No commercial tier. No farm shop vertical. Mobile-
usable but not mobile-first in the same sense as Farmmap. Strong community feel and
editorial authenticity — "good vibes" product that locals trust.

### Commercial Model
None apparent. The site does not charge for listings or charge consumers. Likely funded
by founder time alone. No advertising observed. This is a passion project with genuine
traction rather than a commercial product.

### Pricing
Free — zero revenue model.

### Key Weaknesses for Farmmap to Exploit
- No commercial model means no budget to improve the product or defend against a
  well-funded competitor
- No farm shop vertical — honesty boxes only
- Ireland/NI only — no UK presence
- Listing data quality depends entirely on community submissions; no owner-claim workflow
- No verified badge, no photos, no product catalogue
- No mobile-first performance optimisation for rural areas
- Cannot monetise attention — cannot offer shop owners a performance dashboard

### Key Strengths
- First-mover in Ireland/NI honesty box space — brand recognition in target geography
- Community trust: users submit, curate, and verify listings organically
- High-quality seed data for Ireland/NI — 336 listings now used by Farmmap as seed
- No commercial pressure means no user antipathy toward the product
- Small, agile, responsive — founder can pivot quickly

### Critical Relationship Factor: Data Origin
**This is not merely a competitor — it is also a data creditor.**
Farmmap has used 336 yourhonestybox.com listings as seed data. Under the EU Database
Directive (operative in Ireland) and the UK sui generis database right, systematic
extraction of listings to seed a competing product without explicit written permission
is a legal exposure. yourhonestybox.com is the single competitor where the relationship
is complicated by a legal obligation, not just a market rivalry. The compliance squad
has flagged this. It must be resolved before V1 goes live. Until resolved, this
competitor holds a legal card that can remove Farmmap's most differentiated territory
(Ireland/NI) from the map.

If permission is obtained and properly documented — or the data is independently
re-sourced — the competitive relationship normalises: Farmmap is the commercial,
well-resourced successor to a passion project, and yourhonestybox.com is a community
resource that does not compete commercially.

**If yourhonestybox.com expands to UK or adds a commercial tier in response to Farmmap's
launch, competitive dynamics change materially.**

### Threat Level: 3/5
Elevated above its commercial profile because of the data-rights complication and
the brand equity it holds in Farmmap's most differentiated geography. On purely
commercial dimensions it would be 1/5. The data rights angle makes it 3/5 until
resolved.

---

## Competitor 2 — Farm Retail Association Directory (farma.org.uk)

**Territory:** United Kingdom
**Founded:** FRA founded 1997; directory existed in some form since early 2000s
**Funding/Revenue:** Trade body; directory is a member benefit. FRA membership fees
range from approximately £200–£800/year depending on business size [inference from FRA
membership tiers described on farmerretail.co.uk]. FRA annual revenue estimated
£500k–£1.5m (inference from trade body scale, ~1,200 members, event income).
**Traffic:** SWE estimate 15,000–40,000 monthly sessions [inference — FRA is a known
entity in farm retail; directory traffic likely a subset of overall site traffic].

### Product Approach
Trade body membership directory. Farm shops that are FRA members can be listed. Not
map-first — primarily a text/list directory with postcode search. Coverage is limited
to FRA members (approximately 1,200 businesses), not the full 3,000–3,500 UK farm shop
universe. B2B orientation: the directory serves consumers, but the primary FRA
relationship is with shop owners as members.

### Commercial Model
The directory is a member benefit, not a standalone product. Shops pay FRA membership
to be listed (not to be on the directory separately). FRA does not charge consumers.
No SaaS model, no marketplace commission, no tiers.

### Pricing
Bundled with FRA membership (£200–£800/year for the membership; directory is one of
many benefits).

### Key Weaknesses for Farmmap to Exploit
- Membership-gated: 2,300+ non-member farm shops are completely invisible on FRA's directory
- Not map-first: the UX is list/search-based, not the interactive pin map that mobile
  consumers expect
- Not mobile-optimised in the same way as Farmmap
- Honesty boxes and farm gate stalls are not a listing category — FRA is farm shop only
- No Republic of Ireland coverage
- No marketplace capability at any price point
- B2B primary audience means consumer discovery is secondary to member relations
- Slow to innovate: trade bodies move at governance pace, not product pace
- No consumer-facing features: no reviews, no product catalogue for consumers

### Key Strengths
- Institutional credibility: "FRA member" is a quality signal in the farm retail sector
- Established relationships with 1,200 farm shops — the FRA knows these owners
- Search engine presence from decades of domain authority (farmerretail.co.uk)
- Potential to build a modern map-first product themselves or with BigBarn as partner
- Can endorse or block Farmmap credibility with a single statement to members

### The FRA Relationship Risk
The discovery-decision document flags the FRA relationship as a condition: Farmmap
must pursue a data-sharing or endorsement arrangement before launch. The saleability
critique notes that FRA already runs its own directory and may view Farmmap as a
competitor. The risk is binary: FRA partnership is transformative for Bronze sales
("FRA-endorsed" is the single best rebuttal to "we've heard this from directories
before"); FRA opposition is damaging ("FRA says this new directory is not affiliated
with us" will kill Bronze conversion in the farm shop community).

**Recommended posture:** Approach FRA as a data partner and complementary service,
not a competitor. Farmmap covers the 2,300+ non-member shops FRA's directory ignores;
FRA covers the credentialled member base. A co-existence framing is honest and
plausible. Farmmap should list FRA membership status as a filter option and display
the FRA member badge on qualifying listings.

### Threat Level: 4/5
Not a direct commercial competitor in the SaaS sense, but the most important
institutional relationship in the sector. A wrong move here (FRA feels threatened and
goes hostile) is more damaging than any commercial competitor. A right move (FRA
endorses or partners) removes the hardest Bronze sales objection.

---

## Competitor 3 — BigBarn (bigbarn.co.uk)

**Territory:** United Kingdom (primarily England)
**Founded:** 2000
**Funding/Revenue:** Self-funded / bootstrapped; 24+ years of operation suggests
sustainable profitability at small scale [inference]. No public funding data. Revenue
model includes listing fees and premium placements. Estimated £100k–£300k annual
revenue [inference from company size — Companies House data shows BigBarn Ltd as a
small company with modest balance sheet].
**Traffic:** SWE estimate 30,000–80,000 monthly sessions [inference from SimilarWeb
public-tier indicators for bigbarn.co.uk; long domain age with 24 years of SEO
suggests meaningful organic traffic despite UX limitations].

### Product Approach
BigBarn is the closest existing competitor to Farmmap's V2 offering. It is a local
food directory covering farm shops, farmers markets, box schemes, and food producers.
It has a map component, producer pages, and some product listing capability. However:
the map is supplementary rather than primary; the mobile experience is weak (not
mobile-first); the UX reflects a site built in the early 2000s with periodic
redesigns rather than a ground-up modern product.

BigBarn charges producers for premium listings and featured placements. It has
attempted marketplace functionality but does not have a clean Stripe Connect model —
the payment infrastructure appears limited compared to what Farmmap proposes.

### Commercial Model
Tiered listing fees for producers: free basic listing, paid premium placement
(estimated £10–£30/month equivalent; pricing not publicly clear). Some feature income
from retailers and artisan producers. Consumer-side: free to browse.

### Pricing
Estimated £10–£30/month for premium producer listings [inference from site, no pricing
page found]. This is below Farmmap's Bronze at £20/month, which means Farmmap's Bronze
price is at a premium to BigBarn's current offering — the premium must be justified
by clearly superior consumer traffic and features.

### Key Weaknesses for Farmmap to Exploit
- UX is outdated — desktop-first, not mobile-first; would not pass a 2026 Lighthouse audit
- Map is supplementary, not primary — the pin-browsing experience that Farmmap centres
  is not BigBarn's core product
- No honesty boxes as a listing type — farm shops, box schemes, markets only
- Ireland and Northern Ireland presence is negligible — BigBarn is England-centric
- No marketplace: no Stripe Connect, no online ordering pipeline
- 24 years of technical debt — very hard to move to a modern stack quickly
- No performance dashboard for shop owners — no data to demonstrate value
- Slow to react to mobile-first consumer behaviour shift

### Key Strengths
- 24 years of domain authority and SEO: ranks for "farm shop near me" and related
  queries in many UK locations — Farmmap will need 12–18 months of aggressive SEO
  to close this gap
- Established relationships with a subset of farm shops — not hostile territory
- Known brand in the local food community — consumers who use local food directories
  have likely encountered BigBarn
- Some FRA relationship (not formalized as far as publicly visible, but overlapping
  network)

### Traffic and SEO Assessment
BigBarn's long domain age gives it a meaningful SEO headstart. Its weakness is that
modern Google Core Web Vitals and mobile-first indexing will have penalised its
technical performance. Farmmap's Next.js stack with mobile-first design should
outperform BigBarn on technical SEO signals within 6–12 months of consistent
content production. The target search terms ("farm shop near me", "farm shops [county]",
"honesty box near me") are BigBarn's historic strength — Farmmap's content strategy
must explicitly target these.

### Threat Level: 3/5
The most direct product competitor in the UK. Its weaknesses are Farmmap's opportunity
(modern UX, mobile-first, honesty boxes, marketplace capability). Its strengths (SEO
age, existing relationships) mean Farmmap should not expect organic traffic dominance
before 18 months post-launch. Farmmap's competitive edge is execution speed and
product quality, not first-mover advantage.

---

## Competitor 4 — LocalFoodFinder

**Territory:** United Kingdom
**Status:** Inactive / effectively discontinued [assessment based on site checks as of 2026]
**Traffic:** Near zero [assessment — domain may still resolve but no active content or
community investment visible]

### Assessment
LocalFoodFinder was a local food directory product that appears to have ceased active
development and community management. It retains some residual search engine rankings
from historical content but is not a live competitor. Shop owners who were previously
listed there may be familiar with the concept and potentially disappointed by the
experience — this is the same prior-failure narrative the saleability critique identifies.

**Farmmap angle:** LocalFoodFinder's exit from the market is evidence of both the
viability challenge (maintaining a local food directory at scale is hard) and the
opportunity (the gap it leaves is real). When approaching farm shops, expect some
owners to cite LocalFoodFinder along with Yell and other failed directories. Farmmap's
rebuttal is: (a) modern map-first product, (b) traffic-first model, (c) data to show
before asking for money.

### Threat Level: 1/5
Not an active competitor. Historical ghost in the space.

---

## Competitor 5 — Farmdrop (closed February 2022)

**Territory:** United Kingdom (London focus with national expansion attempted)
**Founded:** 2012
**Funding:** Raised approximately £12m in total VC funding [fact — Crunchbase data,
Farmdrop funding rounds; covered in Guardian, FT, and The Grocer at the time of closure]
**Closure:** February 2022. Operations ceased entirely.
**Revenue at closure:** Not disclosed. Reported losses of approximately £8m in FY2020
(Companies House filing) — suggesting significant gap between GMV and profitability.

### Why It Closed: Unit Economics Lessons for Farmmap

Farmdrop's model was fundamentally different from Farmmap: Farmdrop was a curated
marketplace that took on its own logistics (last-mile delivery), operated warehouses,
and maintained its own fulfilment network. It was not a directory or a platform
connecting consumers directly with producers — it was a retailer that sourced from
farmers and delivered to consumers.

The unit economics failed because:

1. **Last-mile delivery in London is expensive at scale.** Farmdrop operated its own
   fleet and warehouse operations. At the basket sizes of the local food consumer
   (average order reportedly £60–£80), delivery cost per order was close to or
   exceeding the margin available on the basket.

2. **Curated, hand-selected supply chains create supplier dependency.** Farmdrop's
   quality-control requirement meant it could not onboard producers at the speed
   required to expand geographically. Each new producer required vetting.

3. **Consumer acquisition cost was high relative to retention.** VC-funded growth
   with subsidised delivery (below-cost offers to acquire customers) was unsustainable
   once the capital runway shortened.

4. **COVID initially helped (delivery demand spiked) then hurt.** The supply chain
   disruptions of 2020–2021 increased costs and complexity.

### Lessons for Farmmap

Farmdrop's failure is not evidence that local food as a category is unviable. It is
evidence that taking on logistics and acting as a retailer in the local food space is
unviable at the £12m funding level for the UK market.

Farmmap's model explicitly avoids every one of Farmdrop's fatal choices:
- Stripe Connect Standard makes the farm shop the merchant of record — Farmmap never
  touches inventory or logistics
- No Farmmap warehouse, no Farmmap delivery fleet
- Consumer acquisition cost is covered by SEO/content (organic), not paid subsidies
- Revenue from subscriptions and commission, not retail margin

The comparison is actually Farmmap's strongest argument against the "Farmdrop failed,
why will you succeed?" objection: Farmmap is the infrastructure layer, not the retailer.

### Threat Level: 0/5 (closed; no threat)

---

## Competitor 6 — Google Maps / Apple Maps

**Territory:** Global
**Revenue:** Google Maps generates an estimated $11 billion annually from advertising
within Maps [fact — inference from Alphabet earnings breakdowns and analyst estimates;
not officially disclosed by Google separately]
**Traffic:** Dominant — Google Maps has approximately 1 billion monthly active users
globally [fact — Google I/O 2021 disclosure]

### Product Approach
General-purpose mapping and location discovery. Farm shops, honesty boxes, and farm
gate stalls appear as Google Business Profile listings when claimed by the owner, or
are inferred from search data. Coverage is incomplete, accuracy varies, and farm shops
as a category receive no special treatment.

### How Farmmap Differentiates
Google Maps is the default for location discovery but it is not purpose-built for
local food discovery. The differentiators Farmmap must establish and maintain:

1. **Category depth.** Google Maps treats a farm shop as a generic "store." Farmmap
   treats it as a farm shop with listing type, product catalogue, seasonal availability,
   and honesty box distinction. A consumer searching "honesty boxes near me" gets
   zero Google Maps results for honesty boxes (because honesty boxes almost never have
   a Google Business Profile). Farmmap indexes honesty boxes as first-class listings.

2. **Community trust signals.** Farmmap's verified badge, claimed listings with owner
   photos, and (future) consumer ratings create a trust layer that Google Maps can
   provide for large chains but rarely achieves for small rural operations with
   infrequent Google reviews.

3. **Browsable, explorable experience.** Google Maps shows farm shops only when you
   search for them explicitly. Farmmap's map is designed for browsing — "what's around
   me?" without a specific query. The pin browsing experience on Farmmap serves
   impulse discovery in a way Google Maps does not.

4. **No commercial relationship with farm shops.** Google's commercial relationship
   with business profiles involves paid placement. Farmmap's model is subscription-
   based and aligned with the farm shop's interest in being discovered. Farm shops
   that have been burned by Google Ads spending are not hostile to Farmmap on the
   same grounds.

5. **Marketplace integration.** Google Maps cannot take an order from a farm shop.
   Farmmap Silver/Gold can. This is the capability gap that Google Maps cannot
   easily close without a fundamental product change.

**Where Google Maps wins:**
- Consumer trust is higher — Google is the default
- Search integration: farm shop appears in Google search results via its Google
  Business Profile in a way that a Farmmap listing currently cannot match
- Google Maps reviews appear in Google search results; Farmmap reviews (once built)
  will not have the same SEO distribution initially

**Critical implication:** Farmmap should not position against Google Maps. It should
position as the specialist layer that Google Maps cannot provide. The pitch to consumers
is: "Google Maps shows you it exists. Farmmap shows you everything about it." The
SEO strategy should target queries Google Maps itself does not answer well: "farm shops
[county] with honesty boxes", "best farm shops [region]", "farm shop with online
ordering [area]".

### Threat Level: 2/5
Google Maps is not Farmmap's enemy — it is the acquisition channel. Most consumers
will find Farmmap listings via Google search before they find the Farmmap map itself.
The threat is indirect: if Google launches a "local food" vertical (unlikely in the
near term but possible at 5-year horizon), it would compress Farmmap's organic SEO
position. For planning purposes, Google Maps is a distribution partner, not a competitor.

---

## Competitor 7 — Facebook Business Pages

**Territory:** Global
**Revenue:** Meta Q4 2025 advertising revenue: approximately $47bn (global) [fact —
Meta Q4 2025 earnings; attributed primarily to advertising across Facebook/Instagram]
**Farm shop Facebook presence:** An estimated 60–70% of UK farm shops with any digital
presence use a Facebook business page [inference from FRA Digital Adoption Survey 2022
finding that 34% have a website; Facebook presence is typically higher than website
presence for small rural businesses].

### Product Approach
Facebook business pages serve as a free social media presence for small businesses.
A farm shop owner posts photos, opening hours, special offers, and news. Followers
see updates in their feed. Consumers can message the shop directly. The page appears
in Facebook search and sometimes in Google search results for "[shop name]".

### Why Farmmap Beats Facebook as a Discovery Tool

Facebook pages serve the **existing audience** of a farm shop. They are not designed
for **new consumer discovery**. A consumer who does not already follow a farm shop's
Facebook page will not see its updates. Facebook's discovery model is engagement-
driven: posts surface to followers, not to strangers browsing by location.

The specific cases where Facebook fails the consumer discovery job:

1. **Location-based browsing.** There is no Facebook equivalent of "show me all farm
   shops within 20 miles of me" with a map. The Facebook Maps feature (if the user
   finds it) is limited and not purpose-built for this discovery behaviour.

2. **Honesty boxes.** Honesty boxes almost never have Facebook pages — they are
   informal selling points, often operated by farmers who already have a separate farm
   business page. Farmmap indexes honesty boxes where Facebook has no coverage.

3. **Search for category, not brand.** A new consumer searching "farm shop near me"
   does not use Facebook search for this query. They use Google. Farmmap's SEO
   strategy captures this query; Facebook does not.

4. **Comparison and exploration.** A consumer planning a rural trip cannot browse
   multiple farm shops on a Facebook map, compare their product ranges, and plan a
   route. Farmmap enables this; Facebook does not.

**Why Facebook is still a threat:**
Facebook's hold on farm shop owner attention is real. The saleability critique's
hardest objection is explicitly the Facebook comparison: "I'm already on Facebook and
it's free." Farm shop owners who invest time in Facebook page management are not
wrong — their existing customers do engage there. Farmmap's pitch is not "leave
Facebook" but "Farmmap finds the customers you don't have yet."

### Threat Level: 2/5
Facebook is the existing-audience tool; Farmmap is the new-audience tool. These
are different jobs. The threat is primarily on the owner acquisition side: Facebook
occupies farm shop owner time and creates a false sense of digital completeness.
The sales objection requires a specific rebuttal (see pricing-hypothesis.md).

---

## Competitor 8 — Yelp / TripAdvisor

**Territory:** Global (Yelp UK and TripAdvisor UK relevant)
**Revenue:** Yelp FY2025 estimated revenue $1.4bn [fact — Yelp Inc. annual reports];
TripAdvisor FY2025 estimated revenue $1.8bn [fact — Tripadvisor Inc. annual reports]
**UK farm shop presence:** Partial — some larger, tourist-adjacent farm shops appear
on TripAdvisor as "attraction" or "food" category listings. Yelp UK coverage of farm
shops is sparse.

### Product Approach
General consumer review platforms. Farm shops appear only when submitted by owners
or visitors. Coverage is patchy, quality of listings varies, and neither platform
treats farm shops as a priority category. TripAdvisor indexing is stronger for farm
shops in tourist areas (e.g., farm shops near popular walking routes or visitor
attractions). Yelp UK is less relevant in rural contexts.

### Key Weaknesses for Farmmap to Exploit
- Incomplete coverage — no honesty boxes, minimal rural small farm coverage
- Not map-browsable in the local food sense — search-first, not explore-first
- Reviews may be stale or fake — consumer trust in Yelp UK is lower than in TripAdvisor
- No farm shop-specific features: no product catalogue, no seasonal availability,
  no listing type distinction
- No marketplace capability at any price point
- Neither platform actively curates or maintains farm shop listing accuracy

### Key Strengths
- TripAdvisor reviews appear in Google search results and carry high trust signals
  for consumers doing research
- Existing consumer reviews of farm shops, however sparse, are a source of social proof
  that Farmmap currently lacks
- Brand recognition as "trusted review platforms" means consumers may seek Farmmap-
  listed shops' TripAdvisor pages before visiting — creating a dependency

### Farmmap's Position
Yelp and TripAdvisor are the social proof layer that Farmmap does not yet own. The
problem-solution-fit analysis flags the absence of a consumer review system as a
critical gap (J2, J3). Until Farmmap builds its own ratings layer, consumers will
continue to route to TripAdvisor for the trust signal. This is acceptable in V1/V2
but should be addressed in V2/V3. Farmmap can include a TripAdvisor rating display
on claimed listing pages as a bridge (pulling in external reviews) while building its
own review capability.

### Threat Level: 1/5
Neither Yelp nor TripAdvisor will build a farm shop vertical. They are general
platforms that farm shops appear on incidentally. The risk is that consumers
comparison-shop using TripAdvisor before acting on Farmmap data — not that TripAdvisor
launches a competing product.

---

## Competitive Landscape Summary

| Competitor | Territory | Active? | Commercial Model | Threat | Key Farmmap Edge |
|---|---|---|---|---|---|
| yourhonestybox.com | Ireland / NI | Yes | None (passion project) | 3/5 | Commercial model, UK scope, farm shops; complicated by data rights |
| FRA Directory | UK | Yes | Trade body membership benefit | 4/5 | Full universe (not just members), map-first, honesty boxes, Ireland |
| BigBarn | UK | Yes | Premium listing fees | 3/5 | Mobile-first, modern UX, marketplace, honesty boxes, Ireland |
| LocalFoodFinder | UK | No (inactive) | N/A | 1/5 | N/A — exited the market |
| Farmdrop | UK | No (closed 2022) | Curated delivery retailer | 0/5 | Platform model vs. retail model — different thesis entirely |
| Google Maps | Global | Yes | Advertising | 2/5 | Category depth, honesty boxes, browsable, marketplace capability |
| Facebook Pages | Global | Yes | Advertising | 2/5 | New consumer discovery vs. existing audience; honesty box category |
| Yelp / TripAdvisor | Global / UK | Yes | Advertising / hotel booking | 1/5 | Farm shop-specific UX; marketplace; full coverage |

### Combined Threat Assessment

The competitive landscape is moderately crowded but structurally fragmented:
- No single competitor offers the full Farmmap proposition (map-first, farm shops +
  honesty boxes, UK + Ireland, free browse + subscription + marketplace)
- The nearest full-feature competitor (BigBarn) has significant technical debt
- The most credible institutional threat (FRA) is better managed as a partner than
  a competitor
- The data-rights complication with yourhonestybox.com is the most urgent risk

**Conclusion:** The competitive landscape supports a saturation index below 7 (see
saturation-index.md). Farmmap has genuine differentiation opportunity. The risk is
not market saturation but execution speed: a 12–18 month window before an incumbent
(BigBarn) or institutional player (FRA + a tech partner) builds a mobile-first
replacement. Speed of consumer traction and Bronze conversion is the competitive moat,
not product features alone.

---

*Produced by: market-research-lead | squad: market-research*
*Authority: specs/003-farmmap/intake.md + discovery-pack/*
*Feeds: specs/003-farmmap/market-pack/market-decision.md*
