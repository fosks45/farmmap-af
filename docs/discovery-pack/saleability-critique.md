---
spec_id: 003-farmmap
squad: discovery-and-validation
agent: saleability-critic
model: claude-sonnet-4-6
authored_at: 2026-05-16T00:00:00Z
status: complete
---

# Farmmap — Saleability Critique

**Lens: adversarial. Not balanced. Every reason this fails to sell.**

---

## 1. Farm Shop Owner Acquisition Problem

The 953 seeded listings are a Trojan horse for a painful reality: passive seeding is not acquisition. A pin on a map that the owner does not know exists is not a business asset — it is a liability if the data is wrong, the phone number is stale, or the opening hours are outdated. The owner finds out about Farmmap when a confused customer arrives on a Monday when the shop is shut.

**The realistic farmer/shop adoption curve is slow and expensive.**

Farm shops in the UK are heavily skewed toward owner-operators aged 50–70. Many have been approached by Yell, Yelp, Google Business Profile, BigBarn, the Farm Retail Association directory, and a dozen local "buy local" campaigns. The consistent experience is: spend time, see no measurable return, stop engaging. This creates a prior belief in the category that directories do not deliver. Farmmap is not entering a trusting market — it is entering a hostile one.

The outreach programme required to get meaningful claim rates is not acknowledged in the exec summary. A realistic estimate:

- Cold email to an owner with no digital presence has a sub-5% open rate.
- Cold call to a farm shop reaches the owner approximately 1 in 4 attempts (seasonal, outdoor work, no admin staff).
- Personal visit from a local rep converts at roughly 20–30% but costs £80–£150 per visit including travel and time.
- Partnership with Farm Retail Association could accelerate this — but FRA already runs its own directory. Why would they promote Farmmap over their own asset?

To claim 100 listings in the first 90 days through passive outreach (email alone) is optimistic. A 3–5% claim rate on 953 listings in year one is the realistic floor, yielding 28–48 active listings. That is not enough to demonstrate value to consumers, which means no organic word-of-mouth, which means claim rate stays flat.

**The acquisition problem is existential at launch and is not addressed in the exec summary.**

---

## 2. Free-to-Paid Conversion Chasm

The exec summary assumes farm shops will upgrade to Bronze (£20/month) once they see visitor numbers. Two objections that will kill this conversion:

**Objection 1 — "I'm already on Facebook and it's free, why would I pay?"**

This is not a bad-faith objection. Farm shops with Facebook pages have a genuine, working, zero-cost marketing channel that their existing customers already follow. Facebook provides: photos, opening hours, real-time updates, direct messaging, event announcements, and a comment section that serves as social proof. The demographic that shops at farm shops (ABC1, 40–65, rural) is active on Facebook. A Bronze Farmmap listing gives a branded page and an enquiry form. Facebook already does this. The owner does not perceive the gap.

**Objection 2 — "I don't know who is visiting and I can't prove it drives sales."**

The performance dashboard (Bronze tier) shows visitor numbers. But farm shop owners need to know if Farmmap visitors actually buy. The attribution gap between a map view and a till receipt is unbridgeable without a coupon system or booking mechanism. An owner who sees 47 profile views in a month and cannot trace a single purchase back to Farmmap will cancel at month three. This is not scepticism — this is rational business reasoning. The value proposition of Bronze collapses unless Farmmap can demonstrate conversion, not just traffic.

The second objection is harder than the first because it cannot be solved with better marketing copy. It requires a product change: a mechanism that connects directory traffic to farm shop revenue. No such mechanism is described in the intake.

---

## 3. Network Effects Chicken-and-Egg

The exec summary claims 953 seeded listings solves the cold-start problem. It does not.

**Seeded listings are not active listings.** A seeded listing is a pin with a name, a postcode, and possibly a phone number. It has no photos, no product catalogue, no verified hours, no owner engagement. From a consumer perspective, a seeded listing is indistinguishable from an abandoned directory. If a user clicks 3 pins and finds no photos, stale phone numbers, and no indication the business is still operating, they will not return.

**The critical mass question:**

- A consumer map needs enough active, photogenic, recently-updated listings to make a browsing session feel rewarding. The minimum viable experience for a map-first product in a specific region is approximately 15–20 rich listings within a 20-mile radius. In rural areas, a 20-mile radius may contain 2–3 listings total.
- Seeded-only listings contribute zero to consumer satisfaction. Only claimed, owner-managed listings with photos and up-to-date information create the experience that generates return visits and word-of-mouth.
- 953 seeded listings distributed across the UK and Ireland yields a sparse map. The density problem is worst in the areas with the most farm shops (rural England, not cities) because those owners are the hardest to reach digitally.

**The network effect never starts if claimed listings stay below 50.** The exec summary needs a specific plan for getting the first 50 claimed, active, photogenic listings — not a plan for getting 953 pins onto a map.

---

## 4. yourhonestybox.com Competitive Response

The intake notes that 336 of the 953 seed listings originate from yourhonestybox.com. This is the single most significant legal and competitive risk in the product, and it is underweighted in the intake.

**Legal exposure:**

yourhonestybox.com's listing data is not public domain. It was assembled through a combination of user submissions, manual research, and editorial curation. Even if the underlying facts (a name, a location) are not copyrightable, the database as a whole may attract database rights under the EU Database Directive (which remains in effect in Ireland) and the UK's sui generis database right. Extracting 336 listings systematically — as a seed dataset for a competing product — is exactly the use case these rights were designed to prevent.

The compliance squad has flagged this. The saleability risk is: if yourhonestybox.com sends a cease-and-desist before Farmmap launches, the entire Irish dataset is poisoned. If they send it after launch, the reputational damage in the Irish market — which is Farmmap's most differentiated territory — is severe. Launch with your own data or with explicit permission. Anything else is a ticking clock.

**Competitive response:**

yourhonestybox.com is gaining traction and is currently Ireland/NI focused. If Farmmap launches with 300+ Irish honesty box listings and starts appearing in Irish Google searches for "honesty box near me," the yourhonestybox.com team will notice within 30–90 days. Their rational response is to accelerate UK expansion, which they may be planning regardless. They have the brand, the data, the existing user base, and — critically — the moral high ground if Farmmap has used their data without permission.

A better-funded UK directory entrant (BigBarn, Farm Retail Association, a VC-backed startup) has a realistic 12–18 month window to launch before Farmmap achieves defensive scale. That window closes only if Farmmap executes the acquisition programme at speed, which requires capital not described in the exec summary.

---

## 5. BigBarn and the Existing Directories

The exec summary does not name BigBarn, the Farm Retail Association directory, or LocalFoodFinder as competitors. This is not an oversight — it is a strategic blind spot.

**BigBarn** has been operating since 2000. It has FRA relationships, established SEO, and a known brand in the farm shop community. Its UX is poor and its mobile experience is weak. This is Farmmap's genuine opportunity. However, BigBarn has inertia: farm shops that have been listed there for ten years are not going to claim a Farmmap listing because a new directory launched. They will stay where they are until Farmmap proves traffic.

**The Farm Retail Association directory** is the trusted source for farm shops because the FRA is the trade body. An FRA-endorsed directory carries credibility that no independent startup can replicate. The exec summary uses FRA data as a seed source. If FRA decides that Farmmap is a competitor to their own directory (which it is), they will stop cooperating. If they decide to build their own modern map-first product (which BigBarn could do for them), Farmmap's defensibility collapses.

**The go-to-market credibility problem:**

Farmmap's advantage is: map-first design, modern tech stack, honesty boxes as a first-class listing type, and speed of execution. These are real advantages. But the go-to-market proposition to a farm shop owner is: "list on our new directory." The farm shop owner's question is: "how many people are using it?" The answer at launch is zero. Farmmap needs to reach consumer critical mass before it can make a credible pitch to paying shops. The exec summary inverts this: it assumes paying shops will join before consumers arrive in volume.

---

## 6. The Marketplace Liability

At Silver and Gold tier, Farmmap enables food sales. The exec summary uses Stripe Connect Standard to make the shop the merchant of record. This is the correct legal structure for payment liability. It does not resolve the reputational and operational liability.

**Food poisoning scenario:**

A customer orders raw milk, unpasteurised cheese, or homemade pâté from a farm shop via Farmmap. The product causes illness. The customer's first action is to find the platform where they purchased it and post a one-star review. The farm shop is the merchant of record — legally, the claim runs against them. But the media story is "food bought on Farmmap made me ill." Farmmap has no food safety audit of its Silver/Gold sellers. It has no mechanism to verify that a shop holds the correct food hygiene certificates. It has no product approval workflow. Any farm shop can list any product.

The legal liability is the shop's. The reputational liability is Farmmap's. One food safety incident in year one, at the scale of a Silver/Gold merchant, will suppress merchant acquisition for 12–18 months.

**Allergen scenario:**

A customer with a nut allergy orders a product described as "handmade flapjack." The product contains traces of nuts. The shop owner did not complete allergen labelling correctly. The customer has a reaction. Under the Natasha's Law requirements (UK) and FIC regulations (Ireland), pre-packed food sold online must carry full allergen information. Farmmap's product listing form must enforce allergen declaration or it is enabling non-compliant sales. There is no mention of allergen data fields in the intake.

This is not a hypothetical. It is a foreseeable event in a food marketplace with low-sophistication sellers. The exec summary does not address it.

**The liability compounding factor:**

Farmmap operates in a sector (food retail) and a channel (online marketplace) that regulators are actively scrutinising. The Food Standards Agency and Food Safety Authority of Ireland have both increased online marketplace enforcement since 2023. A new entrant in this space that does not have a documented food safety policy, seller vetting process, and allergen enforcement mechanism will attract regulatory attention after the first incident.

---

## Summary YAML

```yaml
hardest-objection: "I'm already on Facebook and Google — it's free, my customers find me there, and I've heard this pitch from three other directories that delivered nothing."
second-hardest-objection: "I can see how many people visited my page but I have no way to know if any of them actually came to the shop, so I cannot justify £20 a month."
third-hardest-objection: "I'm the farmer, not the web person — if I claim this thing I'll have to keep it updated and I don't have time for that on top of everything else."
primary-channel: direct outreach by a regional rep with a personal visit — cold email and social media will not achieve meaningful claim rates with this demographic
realistic-cac-estimate: "£120–£250 per paying Bronze shop when including rep time, travel, follow-up, and the free-tier period before conversion"
free-to-paid-conversion-estimate: "4–8% of claimed listings will upgrade to Bronze within 12 months; 1–2% will reach Silver"
saleability-verdict: uncertain
key-risk: "The 336 yourhonestybox.com listings used as seed data expose Farmmap to a database rights claim that could strip the entire Irish dataset and hand a better-funded competitor the moral high ground before launch"
```

---

## Critical Finding Not in the Intake

The portfolio model (TractorMap, BerthMap, etc.) is presented as a strength because the multi-tenant engine amortises development cost. From a saleability perspective, it is a weakness at the Farmmap stage. Building a multi-tenant engine when you have not yet proven the first directory is profitable is a capital misallocation risk. The engine complexity adds build time, increases the surface area for bugs, and means the team is solving a generic problem instead of the specific Farmmap acquisition problem. If Farmmap fails to reach Bronze conversion targets in year one, the multi-tenant engine is a sunk cost with no other tenants to justify it. The portfolio model should be an option, not a commitment, until Farmmap demonstrates unit economics.

---

*Agent: saleability-critic | Squad: discovery-and-validation | Spec: 003-farmmap | Authored: 2026-05-16*
