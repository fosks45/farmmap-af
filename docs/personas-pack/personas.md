---
feature: 003-farmmap
phase: 3
document: personas
squad: personas-and-requirements
produced_by: personas-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/viability-gate.md + specs/003-farmmap/discovery-pack/ + specs/003-farmmap/market-pack/
---

# Farmmap — Personas

Six canonical personas for Farmmap. Four are consumer-side and supply-side users of the
live product; one is the internal platform operator; one is a B2B signal persona for a
future enterprise tier. All six are grounded in the evidence assembled in the discovery
and market-research packs.

---

## P1 — Sarah Whitfield, 38, "The Weekend Forager"

### Demographics and Context

- **Location:** Harrogate, North Yorkshire (market town, rural hinterland)
- **Household:** Married, two children aged 9 and 12
- **Occupation:** Secondary school teacher (geography), full-time term-time
- **Income:** Household income approximately £68,000 combined; budget-conscious but
  allocates a deliberate "quality food" spend of roughly £80–120/month on top of a
  weekly supermarket shop
- **Digital literacy:** Confident iPhone user; uses Safari, Google Maps, Instagram,
  BBC News, Deliveroo, and Tesco's online grocery. Does not use TikTok. Has a
  Facebook account she rarely posts on but uses to follow local community groups.

### Behaviour and Attitudes

Sarah values food provenance strongly — she talks about it at school, teaches
sustainability units, and feeds it into family conversation. She is not a purist.
She does her main shop at Morrisons or an Asda click-and-collect, but she actively
wants a reason to do something different on weekends. The limiting factor is not
motivation; it is friction. She drives through rural North Yorkshire regularly —
school runs, trips to her parents in the Dales, weekend dog walks — but she has no
reliable way of knowing what is along those routes. She has driven past at least
three farm shops she later found out about from a colleague.

She browses on her iPhone in the car (while parked, typically in the 2–3 minutes
before she gets out somewhere) or on the sofa in the evenings after the children
are in bed. She does not sit at a desktop to plan anything.

### Frustrations

- Discovering a farm shop existed only after it closed for the season
- Using Google Maps for "farm shop near me" and getting results 40 miles away or
  generic supermarket listings
- Not knowing whether a farm shop she has found will have the specific things she
  wants (e.g., decent tomatoes in August, Christmas turkeys in November)
- Feeling like she is not fully "walking the talk" she teaches at school

### What She Needs from Farmmap

- To browse a map of everything within, say, 15 miles of a route or destination
  without having done any research beforehand
- To see photos and a basic product description so she can make a quick decision
- To trust that the listing is current and accurate (not abandoned)
- To find honesty boxes — she has a particular fondness for them and knows of no way
  to discover new ones

### Jobs to Be Done

Primary: **J1** (impulse discovery while driving), **J2** (pre-trip planning when she
has advance notice of a weekend away or a trip to see family)

Secondary: **J3** (trust and provenance verification — she wants to know the food is
genuinely local and see a photo that looks like a real farm, not a stock image)

### Design Implications

- Map must be instantly usable on mobile without creating an account
- Loading performance on a 4G rural connection is not optional — it is the product
- Listing pins must be visually distinct by type (honesty box vs farm shop)
- Photos are the primary trust signal for Sarah; listings without photos are largely
  worthless to her
- Directions link opening in Apple Maps is essential (she is on iOS)

---

## P2 — Marcus Okafor, 26, "The Ethical Foodie"

### Demographics and Context

- **Location:** Guildford, Surrey (recently relocated from Peckham, London, for work)
- **Household:** Single; renting a one-bedroom flat; no car
- **Occupation:** Junior UX designer at a B Corp consultancy; remote 3 days per week
- **Income:** £34,000; relatively high discretionary food spend (~£150/month on
  quality or ethical food, eating out, and meal kits)
- **Digital literacy:** Android phone (Pixel 7); power user of Google Maps, Instagram,
  TikTok, Deliveroo, Olio, Too Good To Go, and community food apps. Comfortable with
  new apps; expects them to be fast and visually polished.

### Behaviour and Attitudes

Marcus moved out of London specifically for the quality-of-life change he expected
from a market town. He was looking forward to farmers markets and local food. He has
been somewhat disappointed — he can find the Saturday market, but he knows there must
be more and he cannot find it without a car. He cycles up to 10 miles regularly and
is comfortable doing a weekly food run to a nearby farm shop if he knew one was within
cycling range.

He is Instagram and TikTok-influenced: he follows multiple food accounts that feature
farm produce, raw dairy, and ethical meat. He has tried to buy raw milk locally and
failed to find a source. He is not ideologically opposed to paying a premium for food
he trusts.

### Frustrations

- Not knowing what is available within cycling distance — Google Maps does not tell
  him about the honesty box 4 miles down a country road
- Unable to find raw milk, rare breed meat, or unusual seasonal vegetables locally
- The mismatch between the food content he consumes online (beautiful farm imagery)
  and the difficulty of actually buying from those producers
- Feeling like he needs a car to access local food

### What He Needs from Farmmap

- To search by location and filter by product type (specifically: dairy, rare breed
  meat, seasonal vegetables, organic)
- To see clear product information and provenance detail so he can make a purchasing
  decision before cycling somewhere
- To eventually order online from a farm shop that is too far to cycle to but whose
  produce he has discovered through Farmmap
- A review layer — he trusts Instagram recommendations but also trusts peer ratings;
  he will not make a 10-mile cycle trip without a signal that the place is genuinely
  good

### Jobs to Be Done

Primary: **J2** (pre-trip planning; for Marcus "trip" means a cycle), **J3** (trust
and provenance verification — he is particular about authenticity)

Future: **J4** (online ordering once available — he has already identified he wants
to buy from farms he cannot easily visit)

### Design Implications

- Product catalogue filter by type is high-priority for Marcus; he will abandon the
  map if he cannot filter
- Photos must be genuine farm photography, not stock art — he will notice the difference
- Review and ratings layer (even simple star ratings) would meaningfully improve his
  trust and decision-making
- The map interface on Android must perform identically to iOS — he will be an early
  adopter and vocal critic if it does not
- Walking/cycling distance mode would be valued but is not in v1 scope

---

## P3 — Janet Hargreaves, 61, "The Reluctant Digitaliser"

### Demographics and Context

- **Location:** Near Sleaford, Lincolnshire (agricultural heartland; large arable and
  livestock farm)
- **Farm:** 400-acre mixed farm with a farm shop trading for 22 years; seasonal
  opening (April–December), Tuesday and Friday only, 9am–5pm; plus a school
  holiday table on Saturdays
- **Household:** Married; two adult children (one helps with the farm occasionally;
  one maintains her Facebook page from London)
- **Digital footprint:** Facebook page with 340 followers (her daughter set it up and
  posts when she remembers). Attempted a website in 2018 via a local web designer —
  paid £600, never updated, eventually let the domain lapse. Tried BigBarn in 2020;
  saw no measurable increase in visitors, stopped paying the listing fee after six
  months.
- **Device:** iPad at home (used for banking and recipe browsing), iPhone in the shop
  (she answers WhatsApp messages from regulars)

### Behaviour and Attitudes

Janet knows she should "be online more" but she does not know how and she does not
have the time or energy to learn. She relies on word of mouth (which has worked well
for 22 years) and a roadside sign that needs repainting. She has had several regulars
tell her they found her by accident while driving past. The phrase "I didn't know you
were here" is something she hears several times a week from new visitors.

She is sceptical of directories because of the BigBarn experience. She invested time
claiming the listing, updating it, paid for six months, and could not tell if a single
customer had come from it. She cannot attribute any specific sale to BigBarn. This is
not bitterness; it is rational commercial reasoning. She will not repeat the experience
unless something is demonstrably different.

Her daughter is a potential co-user for setup and maintenance. Janet is capable of
checking a dashboard once she knows what to look for, but she will not drive the
onboarding herself.

### What She Needs from Farmmap

- To be discoverable to people who are driving past or planning to visit the area,
  without any ongoing content effort from her
- To see measurable evidence that Farmmap is bringing her new visitors (not just
  impressions)
- A setup process that her daughter can complete in under an hour, mostly without
  Janet's involvement
- To know that if she does nothing — no photos, no updates — she is still findable
  (the free listing is the minimum viable product for her)
- To understand clearly what she would get from paying £20/month that she does not
  get for free, and why it would be worth it given her BigBarn experience

### Jobs to Be Done

Primary: **J5** (capture passing trade — this is the entire value proposition for her
at free tier level)

Secondary: **J7** (someone else do the marketing — she is interested in Gold if it
genuinely means she does not have to do anything)

### Design Implications

- The claim flow must be completable by someone other than the owner (a daughter in
  London) on behalf of the owner — the verification email must be easy to forward
- Opening hours must support irregular patterns ("Tuesday and Friday only" is not
  expressible in most standard opening hours UIs)
- The "temporarily closed" toggle is essential for a seasonal shop
- The admin dashboard must be comprehensible to a non-technical user who checks it
  once a fortnight at most
- The sales pitch to Janet is: "You're already on the map for free. Here's evidence
  people are finding you." The performance dashboard is the conversion lever.

---

## P4 — Tom Ashworth, 34, "The Digital-Native Farm Entrepreneur"

### Demographics and Context

- **Location:** Near Malpas, Cheshire (third generation family farm; dairy and arable)
- **Farm:** 280 acres; converted barn shop open six days a week; added an online shop
  via Shopify two years ago; does his own email marketing (Mailchimp, approximately
  600 subscribers); posts on Instagram three times a week with genuine engagement
- **Household:** Married with one child; wife works part-time in the farm business
- **Digital literacy:** MacBook for admin, iPhone in the field; Shopify admin,
  Mailchimp, Canva, Instagram, WhatsApp. Comfortable with tech but not a developer —
  he finds workarounds when something does not work as expected.
- **Revenue:** Approximately £280,000/year through the farm shop; approximately
  £18,000/year through the Shopify online shop. The online shop serves customers
  who have previously visited and then moved to Chester or Manchester.

### Behaviour and Attitudes

Tom represents the farm shop owner who has already done the work of going digital.
He has an audience. He has an online shop. He has a content operation. His frustration
is not discoverability for existing customers — it is finding new customers who have
never heard of him. His Shopify traffic is primarily direct or from his Instagram
followers. He has tried Google Ads once (£200 budget, inconclusive results) and
abandoned the experiment. He cannot find a scalable channel that reaches local food
consumers who do not already know him.

He is not sceptical of directories in the way Janet is. He is sceptical of directories
that cannot demonstrate a consumer audience. If Farmmap can show him genuine traffic
data, he is a willing early adopter. He would pay Bronze immediately for the analytics
alone — he wants to understand who is searching for farm shops in Cheshire and whether
those people are converting.

### What He Needs from Farmmap

- A channel that reaches new customers he cannot reach through his existing Instagram
  and email list
- Online ordering capability through Farmmap so customers outside his delivery zone
  (or in areas he has not yet reached) can discover and buy from him — he is the Silver
  tier natural early adopter
- A product catalogue that serves as a public-facing showcase even before Silver-tier
  ordering is available
- Analytics that tell him where his Farmmap visitors are coming from and whether they
  are converting to physical or online customers

### Jobs to Be Done

Primary: **J5** (new customers beyond his existing audience), **J6** (online sales for
distant customers — he already has this on Shopify, but Farmmap's audience is additive)

Secondary: **J8** (product showcase — his Shopify site is comprehensive but Farmmap
reaches consumers who would never visit his Shopify site directly)

### Design Implications

- Tom will complete the claim and Bronze onboarding with no hand-holding; the flow
  must be clean and self-serve
- The product catalogue must accept a meaningful number of SKUs — Tom sells over 80
  products; Bronze's display-only catalogue should handle this without friction
- Analytics dashboard must show referral sources, not just raw page views; Tom will
  ask "where are these people coming from?"
- Silver tier conversion will happen when Tom sees his first Farmmap-originated order
  in the analytics — the pathway from Bronze analytics evidence to Silver upgrade
  must be frictionless and obvious
- API or export capability for his product catalogue would be valued but is not
  in v1 scope — the manual upload path must be good enough

---

## P5 — Alex Kim, 29, "The Farmmap Admin"

### Demographics and Context

- **Role:** Solo founder / first employee. For the purposes of this persona, also
  the first admin/moderator as the platform scales from 0 to its initial live state.
- **Context:** Alex is the person who built Farmmap, is operating it, and is doing
  every internal function until the business can support dedicated staff. At launch
  and through the first 6–12 months, Alex is simultaneously the community manager,
  the listing moderator, the customer success contact for Bronze subscribers, and the
  editorial lead for the SEO content programme.
- **Device:** MacBook as primary workstation; iPhone for mobile checks.
- **Technical capability:** Can write basic SQL, understands relational data, can
  navigate Supabase's studio interface, but is not a developer in the build-production
  sense.

### Behaviour and Attitudes

Alex's operational time is spent across four primary activities:
1. Listing moderation: reviewing new listings submitted by users, approving claimed
   listings, checking photo uploads for quality and compliance
2. Bronze subscriber support: answering questions from farm shop owners about their
   dashboards, helping with onboarding when someone gets stuck
3. Content production: writing county guide articles, updating the editorial calendar,
   scheduling social posts
4. Platform health monitoring: checking for reported listings, handling incorrect
   information flags, reviewing the order queue when Silver tier goes live

Alex's constraint is time. Every minute spent on a manual moderation task that could
be automated or batched is a minute not spent on the SEO content programme that drives
consumer traffic. The content programme is the load-bearing assumption of the entire
commercial model; Alex knows this and feels the tension acutely.

### What Alex Needs from the Admin Console

- A listing approval queue that batches decisions and allows approve/reject/request-info
  in one interface without clicking into individual records
- A photo moderation queue that allows bulk approval of obviously-acceptable photos
  and flags edge cases for individual review
- A reported content triage queue with severity classification so Alex can prioritise
  spam or dangerous content above minor factual corrections
- A subscription management overview showing which shops are in trial, active, grace
  period, or cancelled — at a glance, not buried in Stripe
- An impersonation capability to troubleshoot a Bronze subscriber's dashboard without
  asking them to screenshare
- Search and filter across all listings for data quality audits (e.g., "show me all
  unclaimed listings in Yorkshire that have had no update in 90 days")

### Jobs to Be Done

Internal JTBDs (these are operational, not consumer-facing):
- **Platform quality:** Maintaining listing accuracy and photo standards without
  it consuming all available time
- **Fraud and spam prevention:** Detecting fake farm shop listings or photo uploads
  designed to game the verified badge
- **Content moderation velocity:** Processing the review queue fast enough that
  consumer reviews (once live) are visible within 24 hours of submission, not 72 hours
- **Subscriber health monitoring:** Knowing before a Bronze subscriber cancels that
  they are at risk (low login activity, no analytics views) so Alex can intervene

### Design Implications

- The admin console is not a polished consumer-facing product; it is a productivity
  tool. It should be fast, keyboard-navigable, and optimised for batch operations.
- Every admin action that touches a listing owner's data must be logged in the audit
  trail (required by the Constitution's Principle 10 and Principle 5).
- Role-based access must be designed from day one even if Alex is the only admin at
  launch — a content moderator hired later should not see financial data.
- The impersonation capability is load-bearing for Bronze support; it must log every
  use (identity, target account, timestamp) without exception.

---

## P6 — Brigid O'Sullivan, 45, "The Irish Cooperative Manager"

### Demographics and Context

- **Location:** County Clare, Republic of Ireland
- **Role:** Manager of a rural cooperative covering approximately 40 member farms and
  smallholdings. The cooperative coordinates collective marketing, shared equipment,
  and mutual support among small-scale producers in the Burren area.
- **Relationship to Farmmap:** Twelve of the cooperative's member farms operate honesty
  boxes or farm gate stalls. Brigid has been told about Farmmap by one of the members
  who found their listing via the yourhonestybox.com seed data.
- **Digital literacy:** Confident Windows laptop user; Google Workspace, SharePoint,
  Excel. Has experience with the LEADER Rural Development Programme's digital tools.
  Not a technical user but comfortable with structured online forms and admin
  interfaces.
- **Data concerns:** The cooperative holds contact and operational data for all 40
  member farms. Brigid is responsible for GDPR/DPC compliance. She has been through
  one DPC audit and does not intend to go through another.

### Behaviour and Attitudes

Brigid is a pragmatic, organised professional. She is not an early adopter — she
evaluates before committing. When she makes a decision on behalf of the cooperative,
she needs to understand the implications for all 40 members, not just the 12 with
Farmmap-relevant operations.

She sees Farmmap's value for the honesty box members clearly: they are currently
invisible to digital discovery and the yourhonestybox.com listings are incomplete.
She is interested in claiming all 12 listings as a batch rather than as 12 individual
processes — the latter would require coordinating 12 separate email verifications,
which she does not have the bandwidth to manage.

Her compliance questions are not obstructive — she has a legal obligation to ask them.
She wants to understand: where is member data stored, what is the legal basis for
processing it, who can see it, and how she exports it if the cooperative decides to
move to a different platform in future.

The cooperative is also a signal for a future enterprise or cooperative tier: an
organisation that wants to manage multiple listings under one account, with batch
operations, data export, and a single billing relationship.

### What Brigid Needs from Farmmap

- A bulk claim workflow that allows her to verify ownership of multiple listings under
  the cooperative's legal identity without going through 12 separate email verification
  chains
- Clear, plain-English privacy documentation covering GDPR (UK) and DPC (Ireland)
  compliance so she can answer questions from member farms
- Data export capability: the ability to export all listing data for all cooperative
  members in a standard format (CSV minimum) so the cooperative is not locked in
- A single point of contact at Farmmap (or a clear support channel) if something goes
  wrong with a member's listing
- Understanding of what Bronze subscription means in the context of a cooperative —
  does each listing need its own subscription, or can the cooperative pay for a bundle?

### Jobs to Be Done

This persona's JTBDs are a B2B signal, not core v1 scope:
- **Bulk cooperative onboarding** (F17 — Should-Have, deferred from Must-Have)
- Represents the demand signal for a future enterprise or cooperative billing tier
- Compliance documentation (DPC + GDPR) is a prerequisite for the cooperative's
  engagement with the platform — not a nice-to-have

### Design Implications

- Brigid's use case cannot be fully served at v1 without F17 (bulk listing claim).
  At v1, the path for Brigid is: Alex manually processes the bulk claim via the admin
  console after receiving a cooperative-membership verification document. This is not
  scalable but it is sufficient for the initial cooperative relationship.
- The privacy policy must address both ICO (UK GDPR) and DPC (Ireland) compliance
  explicitly — Brigid will read it and she knows the difference.
- Data export for listing owners is a Should-Have feature (F17 scope) but the design
  principle should be stated now: all listing data belongs to the listing owner and
  must be exportable on request, even at free tier.
- Brigid's engagement should be documented in the evidence pack as the first formal
  B2B signal for a cooperative/enterprise tier. Her feedback during onboarding is a
  valuable input to the v2 enterprise tier specification.

---

*Produced by: personas-squad-lead | squad: personas-and-requirements*
*Authority: specs/003-farmmap/viability-gate.md + specs/003-farmmap/discovery-pack/ + specs/003-farmmap/market-pack/*
*Feeds: specs/003-farmmap/personas-pack/jtbd-map.md + specs/003-farmmap/spec.md*
