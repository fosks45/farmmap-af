---
feature: 003-farmmap
phase: 5
document: cookie-policy-requirements
squad: platform-strategy
produced_by: platform-strategy-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md
  + specs/003-farmmap/compliance-pack/compliance-decision.md
  + specs/003-farmmap/compliance-pack/pecr-assessment.md
  + specs/003-farmmap/compliance-pack/gdpr-dpa-assessment.md
---

# Farmmap — Cookie Policy and Legal Page Requirements

All pages listed below must be published before v1 launch. Their absence is a
hard compliance blocker (conditions V1-C1, V1-C7, V1-C8 from compliance-decision.md).

---

## Cookie Consent Banner

### Trigger

The cookie consent banner is displayed on first visit to any Farmmap page by a
visitor who has no existing consent cookie. It is displayed to all visitors regardless
of whether they are logged in or anonymous.

**Exception:** The banner is not displayed in the admin console (`/admin/*`). Admin
users are authenticated and covered by a separate consent notice in their account
terms.

### Behaviour

- The banner appears at the bottom of the viewport (not a full-screen takeover)
- Focus is moved to the first interactive element of the banner on display (WCAG
  2.4.3 Focus Order — compliance condition V1-C11)
- Focus is trapped within the banner until the visitor makes a choice (WCAG 2.1.2
  No Keyboard Trap — allows Escape to dismiss without accepting, which is treated
  as reject-all)
- The banner must not auto-dismiss, time out, or treat page scroll as implicit consent
- No pre-ticked checkboxes. No "by continuing you agree" language
- Cookie preferences must be withdrawable as easily as they were given — "Cookie
  settings" link in the footer opens the same consent panel at any time

### Categories

| Category | Description | Consent Required |
|---|---|---|
| Strictly Necessary | Session management cookie, CSRF protection token, cookie consent preference record | No — these are essential for the service to function |
| Analytics | Plausible Analytics session tracking (if cookieless mode is not used), GA4 (if deployed) | Yes — explicit opt-in required |

**Important:** If Plausible Analytics is deployed in cookieless mode (no cookies
set by Plausible's script), the Analytics category may contain zero cookies from
Plausible. In that case, the Analytics category covers only GA4 (if deployed) and
any other analytics tools introduced later. The consent banner should still present
the Analytics category so users understand what analytics are in use, even if the
category uses no cookies.

### Consent Record

When a visitor makes a consent choice, a first-party cookie is set:

```
cookie_consent={
  "v": "1",
  "ts": "[ISO8601 timestamp]",
  "accepted": ["strictly_necessary", "analytics"]  // or just ["strictly_necessary"] for reject
}
```

- `v` — policy version (bumped when new cookies are added to any category)
- `ts` — timestamp of consent
- `accepted` — array of accepted category names

**Cookie name:** `fm_consent`
**Duration:** 12 months
**Domain:** First-party only (farmmap.co.uk, farmmap.ie if applicable)
**SameSite:** Strict

When the policy version is bumped (new cookies added), any existing `fm_consent`
cookie with an older version number is treated as absent — the banner is shown again.

---

## /privacy/cookies — Cookie Policy Page

Required before v1 launch.

### Content Requirements

**Last updated date and policy version** — visible at the top of the page.

**Introduction** — explains what cookies are, why Farmmap uses them, and that the
visitor can manage their preferences.

**Cookie inventory table** — lists every cookie set by Farmmap:

| Cookie Name | Purpose | Duration | First/Third Party | Category |
|---|---|---|---|---|
| `fm_consent` | Stores cookie preference choices | 12 months | First party | Strictly Necessary |
| `fm_session` | Session management for logged-in users | Session (browser close) | First party | Strictly Necessary |
| `_csrf` | CSRF protection for form submissions | Session | First party | Strictly Necessary |
| `_pl_s` | Plausible Analytics session identifier (if using cookies) | 24 hours | First party (EU-hosted) | Analytics |
| `_ga` | Google Analytics 4 client identifier (if GA4 deployed) | 2 years | Third party (Google) | Analytics |
| `_ga_[ID]` | Google Analytics 4 session identifier (if GA4 deployed) | 2 years | Third party (Google) | Analytics |

**Note:** This table must be updated whenever a new cookie is added by any service.
The `cookie_consent` policy version is bumped when the table changes.

**How to manage cookies** — instructions for managing cookies in:
- Safari (iOS and macOS)
- Chrome (Android, Windows, macOS)
- Firefox
- Edge

**Cookie preference management** — "Change your cookie settings" button that opens
the consent panel (same as the initial banner).

**Link to full privacy policy** — required.

**Separate sections for UK users and ROI users:**
- UK users: covered by UK PECR and UK GDPR; supervisory authority is ICO
- ROI users: covered by EU PECR (ePrivacy Directive 2009/136/EC as transposed) and
  EU GDPR; supervisory authority is DPC; EU cookie consent standard applies (which
  is the stricter standard; Farmmap uses DPC standard throughout)

---

## /privacy — Privacy Policy Page

Required before v1 launch. Must address both UK GDPR (ICO) and EU GDPR (DPC)
explicitly.

### Content Requirements

**Version number and last updated date** — visible at the top.

**Data controller identity:**
```
Data Controller: [Legal company name]
Registered address: [Address]
Email: privacy@farmmap.co.uk
```

**EU GDPR Article 27 Representative:**
```
EU Representative: [Representative name and address in Ireland]
Email: [EU representative email]
```

**What personal data is collected and why:**

| Data Category | Examples | Collection Point | Lawful Basis (UK GDPR) | Lawful Basis (EU GDPR) |
|---|---|---|---|---|
| Account data | Name, email, password hash | Registration / claim flow | Contract (Art 6(1)(b)) | Contract (Art 6(1)(b)) |
| Owner listing data | Business name, address, hours, photos, product info | Listing management | Contract (Art 6(1)(b)) | Contract (Art 6(1)(b)) |
| Consumer review data | Review text, star rating, verified email | Review submission | Legitimate interests — platform trust (Art 6(1)(f)) | Legitimate interests (Art 6(1)(f)) |
| Ordering waitlist email | Email address for waitlist | F6 waitlist form | Consent (Art 6(1)(a)) | Consent (Art 6(1)(a)) |
| Payment data (token only) | Stripe payment method token | Bronze/Silver/Gold upgrade | Contract (Art 6(1)(b)) | Contract (Art 6(1)(b)) |
| Server-side page view data | Session bucket, referrer category, timestamp | All listing page loads | Legitimate interests — platform analytics (Art 6(1)(f)) | Legitimate interests (Art 6(1)(f)) |
| Cookie consent record | Categories accepted, timestamp, version | Consent banner | Legal obligation — PECR (Art 6(1)(c)) | Legal obligation — ePrivacy |

**Data sharing with third parties:**
- Stripe (payment processing) — DPA in place; Stripe's Privacy Shield replacement
  SCCs (for US data transfer); Stripe stores payment data; Farmmap stores only tokens
- Plausible Analytics (EU-hosted; no cross-site tracking; data retained 24 months)
- EU GDPR Article 27 representative (named; contact details provided)
- Hosting provider (architecture to confirm; must be within UK/EU for respective
  user data)

**Data subject rights:**
- Right of access (SAR)
- Right to erasure ("right to be forgotten")
- Right to portability (listing data exportable in CSV)
- Right to object (legitimate interests processing)
- Right to restriction
- Right to withdraw consent (cookie preferences; waitlist subscription)

Contact: privacy@farmmap.co.uk. Response within 30 days.

**Data retention:**
- Account data: retained for the life of the account + 30 days after deletion
- Review data: retained while the listing is active; deleted with account on request
- Waitlist email: until the waitlist notification is sent, or until unsubscribe
- Payment tokens: retained by Stripe per Stripe's retention policy; Farmmap stores
  the token reference until the subscription ends
- Server-side analytics: 24 months rolling

**ROI/Ireland-specific section:**

This section must not be a copy-paste of the ICO section. It must address:
- EU GDPR applies to personal data of individuals in the Republic of Ireland
- The DPC (Data Protection Commission) is the supervisory authority for ROI users
- DPC contact: info@dataprotection.ie; Phone: +353 578 684 800
- Farmmap's EU Article 27 representative in Ireland is: [Named representative]
- Any cross-border data transfers from the EU to the UK are governed by the EU-UK
  adequacy decision (in force as of Farmmap's launch date); UK data residency is
  adequate for EU personal data transfers

**Supervisory authority contact information:**
- UK: Information Commissioner's Office (ICO) — ico.org.uk
- Ireland: Data Protection Commission (DPC) — dataprotection.ie

---

## /terms — Terms of Service Page

Required before v1 launch. Must be accepted by owners at listing claim and at
subscription activation.

### Content Requirements

**Version number and last updated date.**

**Acceptable use:**
- The platform may not be used to post false, misleading, or defamatory listing
  information
- Photos and content submitted must relate to the actual farm shop or honesty box
- Listings must represent a genuine, operating food business or producer
- Platform may not be used to collect personal data of consumers beyond the purpose
  of operating the listed business

**Content standards:**
- Photos must be original images of the listed business; stock photography prohibited
- Product descriptions must be accurate; allergen information must be verified by
  the shop operator
- Reviews must represent genuine consumer experiences; fabricated reviews prohibited
- OSA 2023 illegal content categories are explicitly prohibited in all user-generated
  content (reviews, photos, listing descriptions)

**Subscription terms (Bronze/Silver/Gold):**
- Pricing and features for each tier as specified in the current pricing schedule
  (linked from subscription pages)
- Billing: monthly, on the anniversary of the subscription start date
- **14-day cancellation right:** Upon initial signup for any paid tier, you have
  the right to cancel within 14 days of the start of your subscription and receive
  a full refund. This right is exercised by emailing support@farmmap.co.uk or via
  the subscription management page in your dashboard. This cancellation right applies
  to the initial subscription only, not to upgrades from one tier to another.
- Auto-renewal: subscriptions renew automatically each month. You will receive a
  renewal reminder by email [number of days] before each renewal date.
- Downgrade: takes effect at the end of the current billing period. Silver/Gold
  features are retained until that date.
- Cancellation: takes effect at the end of the current billing period.
- Silver/Gold: cancellation does not relieve the shop of the obligation to fulfil
  outstanding customer orders. Feature removal is blocked while orders are pending.

**Allergen liability limitation:**
Allergen information displayed on Farmmap is provided by the shop operator. Farmmap
is not responsible for the accuracy of allergen information provided by shop operators.
If you have a food allergy or intolerance, you must contact the shop directly to
verify allergen status before placing an order. Shop operators warrant that all
allergen information submitted is accurate and agree to indemnify Farmmap against
claims arising from inaccurate allergen information.

**Photo and content licence:**
By submitting photos or content to Farmmap, you grant Farmmap a non-exclusive,
royalty-free, worldwide licence to display that content on the Farmmap platform
for the duration of your listing. Photos are deleted within 30 days of listing
deactivation unless you request deletion.

**Limitation of liability:**
Farmmap is a discovery and marketplace platform. We are not responsible for the
quality, safety, accuracy, or availability of goods sold through the platform.
Our total liability to you for any claim arising from use of the platform is limited
to the amount you have paid to Farmmap in the three months preceding the claim.

**Governing law:**
These terms are governed by the laws of England and Wales (for UK users). For users
in the Republic of Ireland, these terms are governed by the laws of Ireland and
subject to the jurisdiction of the Irish courts.

---

*Produced by: platform-strategy-lead | squad: platform-strategy*
*Authority: specs/003-farmmap/spec.md + compliance-decision.md + pecr-assessment.md + gdpr-dpa-assessment.md*
*Phase: 5 | Feeds: specs/003-farmmap/architecture-pack/ + design-pack/*
