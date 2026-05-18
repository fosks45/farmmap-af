---
feature: 003-farmmap
phase: 5
document: analytics-strategy
squad: platform-strategy
produced_by: platform-strategy-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md
  + specs/003-farmmap/compliance-pack/compliance-decision.md
  + specs/003-farmmap/compliance-pack/pecr-assessment.md
---

# Farmmap — Analytics Strategy

## Guiding Principle

Farmmap's analytics architecture has two non-negotiable constraints: (1) the farm
shop analytics dashboard (F22) must show accurate page view counts that do not
depend on consumer cookie consent; and (2) all behavioural analytics that could
identify individual consumers require consent before firing. These constraints are
not in tension — they are satisfied by a two-tier architecture.

---

## Tier 1: Consent-Free Analytics (Always On)

These analytics mechanisms fire for every session, regardless of cookie consent
state. They do not set cookies. They do not pass PII to third-party services.
They are stored in Farmmap's own database.

### Server-Side Event Store

Every listing page view is recorded server-side in the Farmmap database. The record
contains:
- `listing_id` — which listing was viewed
- `session_bucket` — a daily hash of: IP prefix (first two octets only) + date + user
  agent family. Not a unique identifier; designed to approximate unique daily visitors
  without storing PII.
- `referrer_category` — bucketed referrer: `google_organic`, `direct`, `social`,
  `email`, `farmmap_internal`, `other`. Full referrer URL is not stored.
- `timestamp` — UTC timestamp of the page view
- `is_mobile` — boolean derived from user agent

This event store is the source of truth for the shop analytics dashboard. A shop
owner's dashboard shows page views and approximate unique daily visitors derived
entirely from this server-side store, not from any third-party analytics. The count
is accurate regardless of whether the visitor accepted or declined analytics cookies.

**GDPR/PECR compliance note:** The session_bucket hash is not a persistent identifier.
The same IP prefix + date + user agent combination produces the same hash on the
same day, but the hash changes the next day. This prevents building a longitudinal
user profile while still enabling daily unique visitor approximation. The ICO and
PECR specialist assessment confirms this approach does not require consent.

### Google Search Console

Google Search Console captures click-through data from Google search results. This
is server-side click measurement (Google's side, not Farmmap's). It does not set
any cookies on Farmmap's domain. It is always active without consent requirement.

Data available: search queries that triggered Farmmap listings, click-through rates,
average position by page and query, Core Web Vitals CrUX field data.

---

## Tier 2: Consent-Required Analytics

These analytics tools fire only after the visitor has actively accepted the "Analytics"
cookie category in the Farmmap consent banner.

### Plausible Analytics (Default — Privacy-First)

Plausible Analytics is the default consent-required analytics tool.

**Why Plausible over Google Analytics 4:**
- Cookieless mode available (used for Tier 1 aggregate reporting; consent required
  for session-level data)
- EU-hosted (servers in Germany) — satisfies the Irish DPC's preference for EU data
  residency for EU user data
- Privacy by design — does not track individual users across sites or build
  cross-site profiles
- Single-page application support with minimal configuration
- Simpler than GA4 for a solo founder to interpret

**Events tracked in Plausible (consent-required):**
- Page views (automatic via Plausible script)
- Outbound link clicks (directions link, shop website link)
- Custom goals: listing_claim_initiated, subscription_upgrade_initiated,
  waitlist_signup, review_submitted

**Plausible data retention:** Set to 24 months maximum. Data export capability enabled.

### Google Analytics 4 (Optional — User Choice)

GA4 may be offered as an additional analytics layer for users who accept a third
"Marketing Analytics" consent category. It is not enabled in the default consent
configuration. Its primary value is funnel analysis and audience building for
potential future Google Ads campaigns.

**If GA4 is deployed:**
- Must fire only after explicit GA4 consent category acceptance (separate from
  Plausible consent)
- IP anonymisation enabled
- Data sharing with Google ad products disabled
- Data retention set to 14 months maximum

**Decision to deploy GA4 is deferred to Month 6+** — there is no reason to carry
the complexity of dual analytics at launch.

---

## Event Taxonomy (Server-Side — Consent-Free)

These events are recorded in the Farmmap server-side event store for operational
reporting and the shop analytics dashboard. No PII. No third-party service.

| Event | Trigger | Stored Fields | Purpose |
|---|---|---|---|
| `listing_page_view` | Any listing detail page load (SSR) | listing_id, session_bucket, referrer_category, timestamp, is_mobile | Shop dashboard page views; SEO performance |
| `map_load` | Map home page load | session_bucket, timestamp, is_mobile | Platform health monitoring |
| `listing_claim_initiated` | "Claim this listing" button click (server-side action) | listing_id, timestamp | Claim funnel measurement |
| `listing_claimed` | Successful claim verification | listing_id, timestamp | Claim funnel completion |
| `subscription_upgrade_initiated` | Stripe checkout session created | listing_id, tier, timestamp | Conversion funnel |
| `subscription_active` | Stripe webhook: payment confirmed | listing_id, tier, timestamp, billing_period_start | Revenue tracking |
| `subscription_cancelled` | Stripe webhook: cancellation confirmed | listing_id, tier, timestamp, reason | Churn monitoring |
| `waitlist_signup` | F6 waitlist form submitted | listing_id, timestamp | Demand capture measurement |
| `review_submitted` | F5 review submitted (pre-moderation) | listing_id, timestamp | Engagement metric |
| `enquiry_submitted` | F21 enquiry form submitted | listing_id, timestamp | Bronze conversion signal |

**Not stored in the server-side event store:**
- Consumer email addresses (except in dedicated waitlist and account tables)
- Full referrer URLs (bucketed only)
- Full IP addresses (only first two octets used in session_bucket; not stored)
- Individual user behaviour sequences (no session replay)

---

## Shop Analytics Dashboard (F22)

The analytics dashboard shown to Bronze and above shop owners is derived entirely
from the Tier 1 server-side event store.

**Metrics available to shop owners:**

| Metric | Source | Update Frequency | Notes |
|---|---|---|---|
| Total page views (last 30/90 days) | `listing_page_view` event store | Daily | Not consent-gated; always accurate |
| Approximate unique daily visitors | Session bucket deduplication | Daily | Approximate; methodology explained to owners |
| Top referrer categories | `referrer_category` from event store | Daily | Shows Google organic vs direct etc. |
| Map pin impressions | Separate `map_pin_shown` event (viewport-based) | Daily | Counts when a pin enters viewport |
| Enquiry form submissions | `enquiry_submitted` event | Real-time | |
| Ordering waitlist subscriber count | Waitlist table count | Real-time | |
| Subscription status | Billing table | Real-time | |

**Last-updated timestamp visible on the dashboard:** Yes — spec requirement F22.
Owners see "Data updated as of [timestamp]" so they know the analytics are not
real-time.

**What is not shown to shop owners:** Individual visitor identities, referrer
full URLs, visitor device specifics, comparison to other listings.

---

## Analytics and Privacy Policy Requirements

The privacy policy must disclose:
- Server-side listing page view counting (always on; no consent required)
- Session bucket methodology (pseudonymised; not personal data under GDPR)
- Plausible Analytics use (consent-required; EU-hosted; data retention period)
- GA4 use (if deployed; consent-required; data retention period)
- Right to withdraw analytics consent at any time via footer "Cookie settings" link

---

*Produced by: platform-strategy-lead | squad: platform-strategy*
*Authority: specs/003-farmmap/spec.md + compliance-decision.md + pecr-assessment.md*
*Phase: 5 | Feeds: specs/003-farmmap/architecture-pack/*
