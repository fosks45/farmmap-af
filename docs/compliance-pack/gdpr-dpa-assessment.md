---
feature: 003-farmmap
phase: 4
document: gdpr-dpa-assessment
specialist: gdpr-dpa-specialist
produced_by: compliance-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md + specs/003-farmmap/intake.md
regimes:
  - UK GDPR (UK Data Protection Act 2018)
  - EU GDPR (Regulation (EU) 2016/679)
  - Irish Data Protection Act 2018
enforcers:
  - ICO (UK)
  - DPC (Ireland)
status: conditions-required
---

# GDPR / DPA Assessment — Farmmap

## 1. Jurisdiction Scope

Farmmap processes personal data of two distinct categories of data subject in two distinct legal jurisdictions:

**UK data subjects** (England, Scotland, Wales, Northern Ireland): governed by UK GDPR (as retained by the European Union (Withdrawal) Act 2018 and amended by the Data Protection Act 2018). Enforcer: Information Commissioner's Office (ICO).

**Republic of Ireland data subjects**: governed by EU GDPR (Regulation (EU) 2016/679) as implemented by the Irish Data Protection Act 2018. Enforcer: Data Protection Commission (DPC). UK GDPR does not apply in the Republic of Ireland.

This dual-jurisdiction structure is not optional. It arises automatically from the product's geographic scope. A single privacy policy that references only the ICO is non-compliant for ROI users. A single privacy policy that references only the DPC is non-compliant for UK users.

---

## 2. Data Controller Status

Farmmap is the **data controller** for all personal data processed on its platform. This includes:

- Consumer account data (name, email, verified email status)
- Farm shop owner / manager account data (name, email, business role, billing information via Stripe token)
- Waitlist subscriber email addresses (F6)
- Consumer review text and star ratings (F5) — linked to verified accounts
- Photo upload metadata (owner identity, upload timestamp)
- Session and analytics data for logged-in users
- Audit trail data (admin actions, impersonation logs)

Farmmap is **not** the data controller for:
- Payment card data (held by Stripe as independent data controller/processor)
- Farm shop customer order data at Silver/Gold tier where the farm shop is the merchant of record (the farm shop is the controller; Farmmap is a data processor for this data)

---

## 3. Lawful Basis Analysis

### 3.1 Consumer Account Data

| Processing Activity | Lawful Basis (UK GDPR) | Lawful Basis (EU GDPR) |
|---|---|---|
| Account registration (email, password) | Article 6(1)(b) — performance of contract | Article 6(1)(b) |
| Email verification for reviews | Article 6(1)(b) — performance of contract | Article 6(1)(b) |
| Session management | Article 6(1)(b) — performance of contract | Article 6(1)(b) |
| Saved favourites | Article 6(1)(b) — performance of contract | Article 6(1)(b) |
| Order history (V3) | Article 6(1)(b) — performance of contract | Article 6(1)(b) |

### 3.2 Farm Shop Owner / Manager Account Data

| Processing Activity | Lawful Basis (UK GDPR) | Lawful Basis (EU GDPR) |
|---|---|---|
| Account registration and listing management | Article 6(1)(b) — performance of contract | Article 6(1)(b) |
| Subscription billing (Stripe token) | Article 6(1)(b) — performance of contract | Article 6(1)(b) |
| Verification email for claim flow (F3) | Article 6(1)(b) — performance of contract | Article 6(1)(b) |
| Performance analytics dashboard | Article 6(1)(b) — performance of contract | Article 6(1)(b) |
| Admin audit trail records | Article 6(1)(c) — legal obligation (audit integrity per Constitution Principle 10) | Article 6(1)(c) |
| Impersonation session logs | Article 6(1)(f) — legitimate interests (platform security and support) | Article 6(1)(f) |

### 3.3 Waitlist Subscribers (F6)

| Processing Activity | Lawful Basis |
|---|---|
| Storing email for waitlist notification | **Article 6(1)(a) — Consent** — the subscriber voluntarily provides their email for a specific purpose (notification when ordering goes live). Consent must be specific, informed, and revocable. The spec (F6) already requires unsubscribe capability: compliant. |
| Sending the waitlist notification | Consent (same basis — the consent was given for this specific notification) |
| Bulk export to shop owner at Silver upgrade | **Requires separate consent or a clear disclosure at point of collection.** The waitlist subscriber consented to receive a notification from Farmmap; they did not consent to their email being shared with the shop operator. This is a **condition** — see Section 7. |

### 3.4 Marketing Emails to Bronze/Silver/Gold Subscribers

Marketing communications to paying subscribers about Farmmap's own services may be sent under:
- **Soft opt-in** (PECR Regulation 22(3)) where the subscriber has purchased a Farmmap service and the communication relates to similar services — no separate opt-in required provided opt-out is available in every communication.
- **Consent** as an alternative basis where soft opt-in does not apply (e.g., marketing to free-tier claimants who have not purchased).

See PECR assessment for the full email marketing analysis.

### 3.5 Analytics and Behavioural Data

Anonymous map browsing must not set tracking cookies. The spec (F16) confirms "Map browsing and listing detail viewing require no account and set no tracking cookies beyond what is required for session management." This is compliant provided:
- Session cookies are first-party, strictly necessary, and do not persist after browser close (or are justified as strictly necessary functional cookies under PECR)
- Analytics tools (e.g., Plausible, Fathom, or GA4 with appropriate configuration) are implemented consistently with the PECR assessment

---

## 4. Data Subject Rights

Both UK GDPR and EU GDPR confer identical rights on data subjects. Farmmap must implement mechanisms for:

| Right | Implementation Requirement |
|---|---|
| Right of access (SARs) | Self-serve account data export or support-channel SAR process; response within 1 month |
| Right to erasure | Account deletion flow that removes personal data; anonymises (does not delete) approved reviews that other users have relied upon — reviewed content may be retained without the reviewer's identity |
| Right to portability | Export of account data in machine-readable format (JSON/CSV minimum) |
| Right to rectification | Account settings for name/email; owner management for listing data |
| Right to object | Opt-out of soft-opt-in marketing communications; objection to legitimate-interests processing |
| Right to restrict processing | Support channel process |

**ROI-specific:** DPC guidance on exercise of rights is substantively aligned with ICO guidance but the DPC has been more interventionist in enforcement (particularly for large-scale processors). For ROI users, Farmmap should ensure right-of-access response times are treated as hard deadlines (1 month) rather than targets.

---

## 5. Data Residency

The spec (Non-Functional Requirements — Data Residency) requires:
- UK personal data: stored in UK or jurisdiction with UK GDPR adequacy decision
- ROI/EU personal data: stored in EU or jurisdiction with EU adequacy decision

The intake confirms Supabase (PostgreSQL) as the database. Supabase offers EU region hosting (Frankfurt, AWS eu-central-1). The architecture squad must confirm that:
1. UK user data is hosted in a UK or UK-adequate jurisdiction
2. ROI user data is hosted in an EU jurisdiction (Ireland-region preferred; Frankfurt is acceptable)
3. The two datasets are either co-hosted in a jurisdiction that satisfies both requirements, or logically separated with directory_id-based routing to different hosting regions

**Condition:** The architecture pack must confirm the data residency configuration before V1 launch. If a single hosting region is used for both UK and ROI users, it must hold both UK adequacy status and EU hosting qualification simultaneously. An EU-hosted database (e.g., Frankfurt) satisfies EU GDPR; it does not automatically satisfy UK GDPR's adequacy requirements (UK-EU adequacy decision is in place as of 2026, subject to the UK government not diverging materially from EU data protection standards).

---

## 6. Multi-Manager Access and Data Sharing (Spec Sign-Off Decision)

The spec sign-off confirmed multi-manager from v1. A manager (not the listing owner) has access to:
- Consumer waitlist subscriber counts (not individual emails at display level)
- Customer order data at Silver/Gold tier (names, addresses, order details)
- Analytics data

**Legal basis issue:** When a farm shop owner adds a manager to their listing, the manager becomes an additional authorised person accessing personal data of:
1. The farm shop's customers (Silver/Gold order data)
2. Waitlist subscribers

The farm shop is the data controller for its customer order data. Farmmap is the data processor for this data. The farm shop owner's addition of a manager is an action by the data controller extending access within their own authorisation scope — this is valid under Article 6(1)(b) (contract performance with customers).

However, Farmmap must confirm this access model in its Data Processing Agreement (DPA) with farm shop operators:
- The farm shop operator is the data controller for order and customer data
- Farmmap is the data processor
- Manager access is granted by the controller (shop owner) — Farmmap is not introducing a new processing activity

**Condition:** A Data Processing Agreement (DPA) is required between Farmmap and all Silver/Gold operators before marketplace launch. This DPA must address manager access, data retention, and deletion obligations.

---

## 7. Conditions

### C1 — Dual Privacy Policy (BLOCKER for V1 launch)

The privacy policy must explicitly address both ICO (UK GDPR) and DPC (EU GDPR) compliance. The policy must:
- Name both the ICO and DPC as supervisory authorities for respective data subjects
- Confirm the lawful basis for each processing activity under both regimes
- State the data residency position for UK and EU/ROI data separately
- Provide contact information for the DPO or designated privacy contact

### C2 — EU GDPR Representative Appointment (BLOCKER for V1 ROI launch)

If Farmmap has no EU establishment, Article 27 of EU GDPR requires the appointment of a representative in an EU member state (Ireland is the natural choice given the user base). This can be a law firm or specialist GDPR representative service. Cost is typically £500–£2,000/year. This representative must be named in the privacy policy.

### C3 — yourhonestybox.com Data Consent Record (BLOCKER — see also IP assessment)

The 336 ROI/NI listings from yourhonestybox.com were obtained with explicit consent from yourhonestybox.com. However, under UK and EU database law, the "explicit consent" referred to in the intake is the consent of the organisation (yourhonestybox.com) not consent of the individual listing subjects (farm operators). Before serving these listings publicly, Farmmap must confirm:
- Whether the yourhonestybox.com consent was given in writing and what its terms were
- Whether the consent covers commercial use (i.e., serving listings as part of a monetised directory platform)
- Whether the individual listing subjects' data was originally collected with GDPR-compliant consent for onward sharing

Until the written consent is confirmed and reviewed, these 336 listings must be treated as unconfirmed for GDPR purposes. Serving them publicly without this confirmation creates a data-sharing risk.

### C4 — Waitlist Subscriber Email Disclosure to Shop Operators (BLOCKER for Silver bulk export)

The spec (F6) states: "Owner can bulk export the waitlist email list when they upgrade to Silver tier." This creates a data-sharing event: the subscriber's email (collected by Farmmap) is shared with the shop operator (a separate data controller). This requires either:
- Explicit consent from the subscriber at point of collection: "Your email will be shared with [Shop Name] when they activate online ordering" — this requires the shop name to be known at signup, which is feasible (the waitlist is per-listing)
- An alternative mechanism where Farmmap sends the notification on behalf of the shop, and the shop never receives the raw email addresses

**Recommendation:** Amend the F6 waitlist signup flow to disclose: "Your email address will be shared with [Farm Name] when they activate online ordering. You can unsubscribe at any time." This is cleaner than restricting the bulk export and aligns with user expectations.

### C5 — Data Processing Agreement for Silver/Gold Operators (BLOCKER for V3 launch)

Before marketplace launch, Farmmap must provide a DPA to all Silver/Gold operators covering:
- Farmmap's role as data processor for customer order data
- Manager access rights and the controller's responsibility for manager access
- Data retention periods
- Obligations on operator in respect of their own GDPR compliance (e.g., their own privacy notices to customers)
- Breach notification obligations (the operator must inform Farmmap of any breach affecting platform data within 72 hours)

### C6 — Breach Notification Procedures (BLOCKER for V1 launch)

Farmmap must have documented breach notification procedures covering both:
- ICO reporting (72-hour rule, UK GDPR Article 33)
- DPC reporting (72-hour rule, EU GDPR Article 33) for any breach affecting ROI user data

A single breach potentially requires notification to both regulators if it affects both UK and ROI users.

### C7 — Retention Policy

The privacy policy must state data retention periods. Recommended positions:
- Consumer account data: retained for the life of the account plus 2 years after last login, then deleted (anonymised analytics retained indefinitely)
- Owner account data: retained for the life of the subscription plus 7 years (statutory retention for financial records)
- Waitlist subscriber emails: retained until the Silver tier notification is sent, then deleted unless the subscriber creates an account
- Audit trail records: retained indefinitely (immutable per Constitution Principle 6; constitutionally compliant because this is internal operational data, not personal data provided by the subject)
- Order data at Silver/Gold: retained for 7 years (VAT and accounting obligations); the shop operator is the controller for this data

---

## 8. Risk Classification

| Risk | Likelihood | Impact | Rating |
|---|---|---|---|
| Privacy policy missing DPC reference | Medium (currently no policy) | High (regulatory action by DPC for ROI users) | High |
| EU GDPR representative not appointed | Medium | Medium (enforcement risk on technical violation) | Medium |
| yourhonestybox.com data without written consent | Low (consent was given) | High (GDPR data-sharing violation) | Medium |
| Waitlist email shared without disclosure | High (current spec does not disclose) | Medium (GDPR consent violation) | High |
| DPA missing for Silver/Gold operators | High (no current DPA) | High (processor accountability under GDPR Article 28) | High |

---

## 9. Overall Assessment

**Status: CONDITIONS REQUIRED**

Farmmap can proceed to architecture and build provided all conditions above are tracked as pre-launch gates. The product's data model and processing activities are consistent with GDPR compliance — the gaps are in governance documentation (privacy policy, DPA, representative appointment) rather than in the fundamental product design.

The dual-jurisdiction structure (ICO + DPC) is unusual for a small UK startup but is unavoidable given the ROI user base. It does not create prohibitive compliance overhead: the two regimes are substantively aligned, and a single well-drafted privacy policy can address both simultaneously.

---

*Produced by: compliance-squad-lead (invoking gdpr-dpa-specialist)*
*Authority: specs/003-farmmap/spec.md + intake.md + agent-foundry Constitution v1.0.0*
*Feeds: specs/003-farmmap/compliance-pack/compliance-decision.md*
