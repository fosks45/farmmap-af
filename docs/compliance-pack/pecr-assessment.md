---
feature: 003-farmmap
phase: 4
document: pecr-assessment
specialist: pecr-specialist
produced_by: compliance-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md + specs/003-farmmap/intake.md
regimes:
  - Privacy and Electronic Communications Regulations 2003 (PECR) — UK
  - ePrivacy Directive 2002/58/EC (as amended) — ROI
  - ICO Cookie Guidance (2023 update)
  - DPC Cookie Guidelines
status: conditions-required
---

# PECR Assessment — Farmmap

## 1. Regime Scope

**UK users:** Privacy and Electronic Communications Regulations 2003 (PECR), as amended. Enforced by ICO. PECR governs: cookies and similar tracking technologies, electronic direct marketing (email, SMS), and unsolicited marketing calls.

**ROI/EU users:** The ePrivacy Directive 2002/58/EC as implemented in Ireland by the European Communities (Electronic Communications Networks and Services) (Privacy and Electronic Communications) Regulations 2011. For practical purposes, DPC cookie guidance and the DPC's stricter enforcement position are the operative standard for ROI users.

---

## 2. Cookie Compliance

### 2.1 Farmmap's Cookie Categories

Based on the product spec and confirmed tech stack:

| Cookie / Tracker Type | Category | Legal Basis Required |
|---|---|---|
| Session management cookie (user login state) | Strictly necessary | No consent required |
| CSRF protection tokens | Strictly necessary | No consent required |
| Map tile preferences (zoom level, last location) | Functional / preferences | Consent required (or legitimate interests with strong justification) |
| Supabase auth token (logged-in users) | Strictly necessary for logged-in functionality | No consent required for logged-in users |
| Analytics (e.g., Plausible, GA4, PostHog) | Analytics / performance | Consent required |
| Error monitoring (Sentry) | Performance/diagnostics | Consent preferred; may be arguable as strictly necessary if server-side only |
| Marketing / retargeting (if any used) | Marketing | Explicit consent required |

### 2.2 Anonymous Browsing

The spec (F16) confirms: "Map browsing and listing detail viewing require no account and set no tracking cookies beyond what is required for session management."

This is the correct compliance position. For anonymous map browsing, only strictly necessary cookies (session state, CSRF, load balancer affinity) may be set without consent. Any analytics for anonymous users must be consent-gated or implemented using cookieless analytics (server-side, IP-anonymised, no fingerprinting).

**Recommended analytics approach for V1:** Implement Plausible Analytics (cookieless, privacy-preserving, no PECR consent required for aggregate analytics without individual tracking). This eliminates the cookie consent banner requirement for the free-tier map experience, which is critical for user experience on mobile (P1 use case — impulse discovery while driving).

### 2.3 DPC vs ICO Standards

The DPC has consistently taken a stricter position than the ICO on cookie consent:
- DPC requires explicit, granular consent for analytics cookies with no pre-ticked boxes
- The DPC's "reject all" option must be as prominent and easy to use as "accept all"
- Consent walls (refusing service unless analytics cookies are accepted) are prohibited
- Soft opt-in does not apply to cookies — consent is always required for non-essential cookies

For Farmmap, which serves ROI users, the DPC standard must be the baseline for all cookie consent implementation.

### 2.4 Cookie Banner Requirements

If any non-strictly-necessary cookies are used:
- Cookie banner must appear on first visit before any non-essential cookies are set
- Banner must offer granular choice (not just "accept all" / "accept necessary")
- "Reject all" must be equally accessible as "accept all" (same number of clicks, same prominence)
- Consent must be recorded with a timestamp and version of the consent notice
- User must be able to withdraw consent as easily as it was given (via accessible cookie preference centre)

**Condition:** The cookie implementation must meet DPC standards (stricter than ICO). If cookieless analytics is used for anonymous browsing (recommended), the consent banner may be simplified or eliminated for that user class.

---

## 3. Email Marketing

### 3.1 Marketing Emails to Farm Shop Owners (Bronze/Silver/Gold Subscribers)

**UK PECR Regulation 22 — Soft opt-in:**
Farmmap may send marketing emails to existing Bronze/Silver/Gold subscribers about its own similar services without prior consent, provided:
1. The subscriber's contact details were obtained in the course of a sale or negotiation of a sale of a product or service
2. The marketing relates to similar products or services
3. Every communication provides a clear opt-out mechanism
4. The subscriber has not previously opted out

This covers: Farmmap emailing a Bronze subscriber about Silver features. It does not cover: Farmmap emailing a free-tier listing claimant who has not purchased any subscription about Bronze features (no prior sale has taken place).

**For free-tier claimants:** Explicit opt-in consent is required before sending marketing emails. The listing claim flow (F3) must include an explicit, unticked opt-in checkbox: "I'd like to receive updates about new Farmmap features and paid subscription options."

### 3.2 Marketing Emails to Farm Shop Owners (ROI — ePrivacy Directive)

Irish ePrivacy implementation mirrors the UK soft opt-in rule for business recipients. The same analysis applies: existing subscribers can receive similar-service marketing; free-tier claimants require explicit consent.

### 3.3 Waitlist Notification Emails (F6)

Waitlist notification emails (notifying subscribers that a shop has activated ordering) are **transactional**, not marketing. They are:
- Sent in direct response to the subscriber's expressed intention to be notified
- Specific to the listing the subscriber registered for
- Not promotional for Farmmap's own services

Transactional emails do not require PECR consent. However, if Farmmap includes any promotional content in these transactional emails (e.g., "While you're here, check out these other farm shops near you..."), those additions require consent or soft opt-in compliance.

**Condition:** Waitlist notification emails must remain strictly transactional. Any marketing additions within these emails require prior consent or soft opt-in qualification.

### 3.4 Newsletter Feature Emails (Bronze Campaign Add-On, Gold Included)

The Gold tier marketing service includes a "monthly newsletter feature." This newsletter is sent to Farmmap's consumer subscriber base on behalf of the shop, featuring the shop's products and content.

For Farmmap's consumer newsletter:
- Recipients must have actively opted in to receive Farmmap's consumer newsletter
- The consent must be specific to receiving marketing/newsletter content from Farmmap
- Consent must be recorded with timestamp and version
- Every newsletter must include a clear unsubscribe link
- Unsubscribe must take effect within 10 business days (ICO guidance)

**Condition:** Before launching the newsletter feature (Gold tier), Farmmap must have a compliant newsletter consent mechanism and a subscriber list where consent is properly recorded.

### 3.5 "Campaign Add-On" Emails (Bronze — F23)

Bronze tier campaign add-ons include newsletter features sold per-campaign. Same requirements as above apply to the recipients of those newsletter features.

---

## 4. Analytics for Farm Shop Owner Dashboards (F22)

The analytics dashboard showing page views, map pin impressions, and enquiry counts to Bronze/Silver/Gold subscribers is a **first-party analytics feature** — Farmmap is using its own platform usage data to generate insights for its customers. This is not PECR-regulated marketing.

However:
- The underlying data collection (page view tracking of consumer behaviour on listing pages) requires appropriate cookie/tracking compliance as analysed in Section 2
- If individual consumer identifiers are used in the analytics pipeline, this raises GDPR concerns (see GDPR assessment)
- The analytics must be aggregate (not individually identifiable) before presentation to shop owners

**Condition:** The analytics dashboard must present aggregate data only. No individually identifiable consumer data (specific visitor IP addresses, individual session trails) may be presented to shop operators.

---

## 5. Conditions

### C1 — Cookieless Analytics for Anonymous Browsing (RECOMMENDATION — improves UX)

Implement cookieless analytics (Plausible, Fathom, or equivalent) for anonymous map browsing to eliminate the need for a cookie consent banner on first load for anonymous users. This is a strong recommendation given the P1 use case (mobile, impulse discovery) where a consent banner creates friction.

### C2 — DPC-Standard Cookie Consent Implementation (BLOCKER for V1 launch if any non-necessary cookies used)

If any non-strictly-necessary cookies are used (analytics, error monitoring with browser-side tracking), the cookie consent implementation must meet DPC standards: granular choice, equal prominence for reject, recordable consent with timestamp and version.

### C3 — Free-Tier Listing Claimant Marketing Opt-In (BLOCKER for any marketing to free-tier claimants)

The listing claim flow must include an explicit, unticked opt-in checkbox for marketing emails. Free-tier claimants may not receive marketing emails without this consent.

### C4 — Newsletter Consent Mechanism (BLOCKER for Gold/newsletter launch)

Before launching the Gold tier newsletter feature or Bronze campaign add-ons, Farmmap must have a compliant consumer newsletter opt-in mechanism with recorded consent.

### C5 — Waitlist Email Transactional Purity

Waitlist notification emails must remain strictly transactional. Any marketing additions require explicit consent compliance review before implementation.

### C6 — Analytics Dashboard Aggregate Only

The analytics dashboard must present only aggregate data. No individual consumer session data or identifiable visitor data may be presented to shop operators.

---

## 6. Overall Assessment

**Status: CONDITIONS REQUIRED**

The product spec is largely consistent with PECR compliance. The main gaps are implementation-level: the cookie consent approach needs to be specified, the newsletter opt-in mechanism needs to be built, and the free-tier claimant marketing consent needs to be added to the claim flow. The recommendation to use cookieless analytics significantly simplifies the compliance position for the free-tier consumer experience.

---

*Produced by: compliance-squad-lead (invoking pecr-specialist)*
*Authority: specs/003-farmmap/spec.md + intake.md + agent-foundry Constitution v1.0.0*
*Feeds: specs/003-farmmap/compliance-pack/compliance-decision.md*
