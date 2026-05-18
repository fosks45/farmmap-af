---
feature: 003-farmmap
phase: 4
gate: compliance-hard-stop
status: passed-with-conditions
risk-classification: medium
produced_by: compliance-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md + all specialist assessments below
regimes-assessed:
  - gdpr-dpa
  - consumer-rights
  - accessibility-compliance
  - pecr
  - children-data
  - pci-dss
  - online-safety
  - ip-copyright
  - financial-services
  - food-safety-allergen
regimes-skipped:
  - education-sector (not applicable — no educational institution involvement)
  - health-sector (not applicable — no healthcare data processing)
  - iso-27001 (deferred — not B2B enterprise SaaS at V1-V3 stage)
  - soc2 (deferred — same reason)
  - eu-ai-act (not applicable — no AI in user-facing decisions at V1; F24 AI photo moderation is admin-side only and does not meet the EU AI Act definition of a high-risk AI system)
dpia-required: false
special-category-data: false
data-residency-scope:
  - UK
  - ROI (Republic of Ireland)
dual-regulator: true
regulators:
  - ICO (UK GDPR)
  - DPC (EU GDPR — ROI users)
human-co-sign-required: true
human-co-sign-reasons:
  - yourhonestybox.com written consent must be confirmed by a human (founder/DPO) before the 336 listings are served publicly
  - Dual ICO/DPC regulator situation requires DPO awareness and appointment of EU GDPR representative
  - Natasha's Law allergen liability question requires human legal review before Silver/Gold marketplace launches
---

# Farmmap — Compliance Decision

## Gate: Compliance Phase (Phase 4)

**STATUS: PASSED WITH CONDITIONS**

Farmmap may proceed to architecture and build. No conditions in this assessment prevent the architecture phase from commencing. All hard-stop conditions are gated to V1, V2, or V3 launch milestones respectively, and all are achievable within a normal pre-launch timeline.

**Human co-sign is required before V1 launch** on the three issues identified below. Architecture and build may proceed; human approval is not required to start those phases.

---

## Evidence Lineage

This decision synthesises the following specialist assessments, each of which constitutes a component of the compliance evidence pack:

| Assessment File | Specialist | Status |
|---|---|---|
| `gdpr-dpa-assessment.md` | gdpr-dpa-specialist | Conditions required |
| `consumer-rights-assessment.md` | consumer-rights-specialist | Conditions required |
| `accessibility-compliance-assessment.md` | accessibility-compliance-specialist | Conditions required |
| `pecr-assessment.md` | pecr-specialist | Conditions required |
| `children-data-assessment.md` | children-data-specialist | Passed — no conditions |
| `pci-dss-assessment.md` | pci-dss-specialist | Passed — minimal conditions |
| `online-safety-assessment.md` | online-safety-specialist | Conditions required (V2 gate) |
| `ip-copyright-assessment.md` | ip-copyright-specialist | Conditions required |
| `financial-services-assessment.md` | financial-services-specialist | Passed — intake analysis confirmed correct |
| `food-safety-allergen-assessment.md` | food-safety-specialist | Conditions required — human co-sign |

---

## DPIA Determination

**A formal Data Protection Impact Assessment (DPIA) is not required at this stage.**

Rationale: Under UK GDPR Schedule 1 / ICO guidance (and EU GDPR Article 35), a DPIA is mandatory where processing is "likely to result in a high risk to the rights and freedoms of natural persons." Farmmap does not:
- Process special category data at scale
- Use systematic automated decision-making or profiling to produce legal or similarly significant effects on individuals
- Systematically monitor publicly accessible areas at large scale
- Process data of vulnerable individuals at scale

Farmmap does process personal data at scale (consumer accounts, farm shop owner data), but this is standard e-commerce/directory processing with established safeguards. The dual-jurisdiction structure (UK ICO + Irish DPC) increases governance complexity but does not cross the DPIA threshold.

**If the Silver/Gold marketplace reaches significant scale** (particularly if AI-based fraud detection or personalisation features are introduced in v2+), the DPIA requirement should be re-assessed. The Constitution's retrospective process provides the amendment mechanism for this.

---

## Special Category Data

**No special category data is processed.** Farm shop location data, product lists, and owner contact details are standard personal data. Consumer review text about farm shops is not special category data. No biometric, health, genetic, or political opinion data is processed.

---

## Dual Regulator Status

Farmmap is subject to **dual regulatory oversight**:

- **ICO (Information Commissioner's Office):** Governs all UK user data under UK GDPR
- **DPC (Data Protection Commission, Ireland):** Governs all ROI user data under EU GDPR

This dual status is not unique but requires:
1. A privacy policy that explicitly addresses both regimes
2. An appointed EU GDPR Article 27 representative in an EU member state (Ireland)
3. Breach notification procedures that cover both ICO (72-hour rule) and DPC (72-hour rule)
4. Data residency architecture that satisfies both UK adequacy requirements and EU hosting requirements simultaneously

The dual regulator structure adds compliance overhead but does not create prohibitive regulatory risk. The ICO and DPC regimes are substantively aligned.

---

## Risk Classification: MEDIUM

| Dimension | Rating | Rationale |
|---|---|---|
| Data protection risk | Medium | Dual jurisdiction; dual regulator; no DPIA trigger; standard data processing |
| Financial regulation risk | Low | Confirmed outside FCA perimeter (Stripe Connect Standard correctly deployed) |
| Food safety / consumer risk | Medium | Allergen liability (V3) requires legal opinion; gating mechanism in spec is correct |
| IP / database rights risk | Medium | yourhonestybox.com written consent not yet documented; FRA consent not yet documented |
| Accessibility / EAA risk | Medium | EAA in force for ROI users; map accessibility is highest-risk surface |
| Online safety risk | Low | Pre-moderation model is strong; OSA 2023 scope is limited for small platforms |
| PCI / payment risk | Low | Stripe Connect Standard outside PCI scope; SAQ-A only |
| Consumer rights risk | Low-Medium | DMCC 2024 auto-renewal provisions need implementation; CCR 2013 disclosure needed |

Overall risk is **medium** — manageable through normal legal and compliance processes. No single regime creates a blocking risk to the product concept.

---

## Conditions — Complete Consolidated Register

Conditions are organised by launch gate (V1, V2, V3). All must be satisfied before the corresponding version launches.

---

### V1 LAUNCH CONDITIONS (Free Directory + Map)

**[V1-C1] BLOCKER — Dual Privacy Policy (GDPR)**
The privacy policy must explicitly address both ICO (UK GDPR) and DPC (EU GDPR) compliance. Must name both regulators, state lawful basis for each processing activity under both regimes, and confirm data residency positions separately for UK and ROI data.
*Owner: Founder/DPO | Deadline: Before V1 launch*

**[V1-C2] BLOCKER — EU GDPR Article 27 Representative Appointment (GDPR)**
Appoint an EU representative in Ireland (law firm or specialist GDPR representative service, typically £500–£2,000/year). Representative must be named in the privacy policy.
*Owner: Founder/DPO | Deadline: Before V1 launch*

**[V1-C3] BLOCKER — yourhonestybox.com Written Consent (IP / GDPR) — HUMAN CO-SIGN REQUIRED**
Obtain written confirmation from yourhonestybox.com confirming: (a) consent to use the 336 listings commercially; (b) scope of permitted use; (c) attribution requirements; (d) date of consent. A formal data licence agreement is strongly recommended. Until written confirmation is received, the 336 yourhonestybox.com listings must not be served publicly on Farmmap.

This condition requires human (founder/DPO) sign-off — an agent may not approve this listing activation.

*Owner: Founder | Deadline: Before V1 launch — yourhonestybox.com listings specifically blocked until confirmed*

**[V1-C4] BLOCKER — FRA Data Written Confirmation (IP)**
Obtain written confirmation from the Farm Retail Association that FRA-sourced listing data may be used commercially in Farmmap's directory. Include data licensing provisions in the FRA partnership agreement.
*Owner: Founder | Deadline: Before V1 launch*

**[V1-C5] BLOCKER — OSM Attribution on All Map Views (IP / ODbL)**
MapLibre GL JS attribution control must be enabled and visible on all rendered map views. Must display "© OpenStreetMap contributors" with a link to the OpenStreetMap copyright page. This must not be hidden or overridden.
*Owner: Build squad | Deadline: Build phase*

**[V1-C6] BLOCKER — GDPR Breach Notification Procedures (GDPR)**
Document and test breach notification procedures covering both ICO (72-hour) and DPC (72-hour) reporting. Any breach affecting ROI users requires dual notification.
*Owner: Founder/DPO | Deadline: Before V1 launch*

**[V1-C7] BLOCKER — Terms of Service (IP / Consumer Rights / Food Safety)**
Terms of Service must include: (a) photo/review licence clauses (owner grants Farmmap licence to display; photo deletion on cancellation); (b) age 18+ requirement for subscription account holders; (c) community guidelines covering OSA 2023 illegal content prohibitions (required before F4 photo upload goes live, which is V1).
*Owner: Founder/legal | Deadline: Before V1 launch*

**[V1-C8] BLOCKER — Cookie Consent Implementation (PECR)**
If any non-strictly-necessary cookies are set (analytics, error monitoring with browser-side tracking), DPC-standard cookie consent must be implemented before V1 launch. Strong recommendation: use cookieless analytics (Plausible or equivalent) for anonymous browsing to eliminate consent banner requirement for the free-tier map experience.
*Owner: Build squad | Deadline: Before V1 launch*

**[V1-C9] REQUIRED — Data Residency Architecture Confirmation (GDPR)**
The architecture pack must confirm that data residency satisfies both UK adequacy requirements (for UK user data) and EU hosting requirements (for ROI user data) simultaneously.
*Owner: Architecture squad | Deadline: Architecture phase*

**[V1-C10] REQUIRED — Accessible Map Implementation Plan (Accessibility)**
Before the map component build commences, document the accessible map implementation plan: keyboard navigation model, accessible listing list fallback, screen reader announcement approach for dynamic updates, and WCAG 2.2 AA compliance strategy. Plan must be reviewed against criteria 2.1.1, 4.1.2, and 4.1.3.
*Owner: Build squad | Deadline: Before map component build starts*

**[V1-C11] REQUIRED — WCAG 2.2 AA Pre-Launch Audit (Accessibility)**
A formal accessibility audit must be completed before V1 launch covering all consumer-facing and admin-facing surfaces. Must include manual keyboard and screen reader testing of the map interface.
*Owner: Build squad / QA | Deadline: Before V1 launch*

---

### V2 LAUNCH CONDITIONS (Bronze Tier)

**[V2-C1] BLOCKER — Pre-Contractual Information on Payment Pages (Consumer Rights)**
Bronze payment page must display all required CCR 2013 pre-contractual information: main service characteristics, Farmmap's identity and address, total price, 14-day withdrawal right and how to exercise it, and data handling on cancellation.
*Owner: Build squad / legal | Deadline: Before V2 launch*

**[V2-C2] BLOCKER — DMCC 2024 Auto-Renewal Notification (Consumer Rights)**
Implement automatic pre-renewal notification for each monthly billing cycle, stating the amount to be charged and providing a clear link to cancel. This satisfies DMCC 2024 subscription renewal obligations.
*Owner: Build squad | Deadline: Before V2 launch*

**[V2-C3] LEGAL REVIEW — DMCC 2024 Pro-Rata Refund Position (Consumer Rights)**
The spec's "no partial-period refunds after 14-day window" position must be reviewed against DMCC 2024 provisions before V2 launch. If DMCC 2024 requires pro-rata refunds on cancellation, the spec must be amended.
*Owner: Founder/legal | Deadline: Before V2 launch*

**[V2-C4] BLOCKER — Free-Tier Claimant Marketing Opt-In (PECR)**
The listing claim flow (F3) must include an explicit, unticked opt-in checkbox for marketing emails. Free-tier claimants may not receive marketing emails without this consent.
*Owner: Build squad | Deadline: Before V2 launch (Bronze marketing begins)*

**[V2-C5] BLOCKER — OSA 2023 Illegal Content Risk Assessment (OSA 2023)**
Complete a written illegal content risk assessment under OSA 2023 before the review feature (F5) launches (V2). Document specific risks for a farm shop review platform and mitigations in place.
*Owner: Founder/legal | Deadline: Before F5 (reviews) launches*

**[V2-C6] BLOCKER — OSA 2023 Reporting Category Update (OSA 2023)**
The consumer review reporting mechanism must include "potentially illegal content" as a distinct report category. Admin console triage must have a protocol for potentially illegal content escalation.
*Owner: Build squad | Deadline: Before F5 (reviews) launches*

**[V2-C7] BLOCKER — ToS Illegal Content Prohibition Language (OSA 2023)**
Terms of Service must explicitly prohibit OSA 2023 priority illegal content categories.
*Owner: Founder/legal | Deadline: Before F5 (reviews) launches*

**[V2-C8] REQUIRED — Analytics Dashboard Aggregate Only (PECR / GDPR)**
The Bronze analytics dashboard must present only aggregate data. No individually identifiable consumer data may be presented to shop operators.
*Owner: Build squad | Deadline: Before V2 launch*

**[V2-C9] REQUIRED — Accessible Star Rating Widget (Accessibility)**
Review submission star rating widget must use an accessible radio button group pattern, not a custom `<div>`-based click widget. Confirm before F5 build.
*Owner: Build squad | Deadline: Before F5 component build*

**[V2-C10] REQUIRED — Stripe Elements Accessibility Configuration (Accessibility)**
The Bronze payment form must use Stripe Elements with correct accessibility configuration, tested against WCAG 1.3.1, 1.4.3, 3.3.1, and 3.3.2.
*Owner: Build squad | Deadline: Before V2 launch*

**[V2-C11] REQUIRED — WCAG 2.2 AA Audit for V2 (Accessibility)**
Repeat formal accessibility audit before V2 launch covering all new V2 surfaces (analytics dashboard, payment flow, review submission).
*Owner: QA | Deadline: Before V2 launch*

---

### V3 LAUNCH CONDITIONS (Silver/Gold Marketplace)

**[V3-C1] BLOCKER — Allergen Liability Legal Opinion (Food Safety) — HUMAN CO-SIGN REQUIRED**
A human legal review of Farmmap's allergen liability position in negligence must be completed before Silver/Gold marketplace launches. The review must address: platform liability in negligence if a shop's allergen information is incorrect, adequacy of the ToS allergen warranty clause, and whether product liability insurance is appropriate.

This condition requires human (founder/legal counsel) sign-off — it cannot be resolved by the compliance squad alone.

*Owner: Founder / external legal counsel | Deadline: Before V3 launch*

**[V3-C2] BLOCKER — Data Processing Agreement for Silver/Gold Operators (GDPR)**
A DPA must be provided to all Silver/Gold operators before marketplace launch covering: Farmmap's processor role for customer order data, manager access rights, data retention, deletion obligations, and breach notification obligations.
*Owner: Founder/legal | Deadline: Before V3 launch*

**[V3-C3] BLOCKER — Waitlist Email Disclosure to Shop Operators (GDPR)**
Amend the F6 waitlist signup flow to disclose: "Your email address will be shared with [Farm Name] when they activate online ordering. You can unsubscribe at any time." This is required before the bulk export feature is activated for Silver-upgrading shops.
*Owner: Build squad | Deadline: Before Silver upgrade bulk export activation*

**[V3-C4] BLOCKER — Commission Transparency in Subscription Agreement (Consumer Rights)**
Subscription agreement for Silver and Gold must state the commission structure unambiguously, including £20/£30 threshold mechanics and any commission cap.
*Owner: Founder/legal | Deadline: Before V3 launch*

**[V3-C5] BLOCKER — Pending Order Obligation in ToS (Consumer Rights)**
ToS must confirm that cancellation of a Silver/Gold subscription does not relieve the shop of its obligation to fulfill outstanding orders.
*Owner: Founder/legal | Deadline: Before V3 launch*

**[V3-C6] BLOCKER — Food Business Registration Declaration in Onboarding (Food Safety)**
Silver/Gold onboarding must include a mandatory food business registration number field and a ToS declaration that the operator warrants they are a registered and compliant food business.
*Owner: Build squad | Deadline: Before V3 launch*

**[V3-C7] BLOCKER — Allergen Display on Product Pages (Food Safety)**
Allergen information must be displayed prominently on Silver/Gold product pages before the consumer adds to basket. Architecture/design must specify display format and placement.
*Owner: Design/build squad | Deadline: Before V3 launch*

**[V3-C8] BLOCKER — Perishable/Non-Perishable Tagging (Food Safety / Consumer Rights)**
Product catalogue must require perishable/non-perishable tagging to determine the applicable consumer returns policy.
*Owner: Build squad | Deadline: Before V3 launch*

**[V3-C9] BLOCKER — Platform Allergen Disclaimer on Product Pages (Food Safety)**
Product pages must display: "Allergen information is provided by [Shop Name]. If you have severe allergies, please contact the shop directly to confirm allergen status before placing an order."
*Owner: Build squad | Deadline: Before V3 launch*

**[V3-C10] BLOCKER — Stripe Connect Standard Confirmation in Architecture (PCI / Financial Services)**
Architecture pack must explicitly confirm Stripe Connect Standard (not Custom or Express) is used for all marketplace payments, and that no fund-holding by Farmmap occurs.
*Owner: Architecture squad | Deadline: Architecture phase*

**[V3-C11] BLOCKER — PCI DSS SAQ-A Completion (PCI DSS)**
Complete PCI DSS SAQ-A self-assessment before Silver/Gold tier launches. Annual thereafter.
*Owner: Founder | Deadline: Before V3 launch*

**[V3-C12] REQUIRED — Newsletter Consent Mechanism (PECR)**
Before launching the Gold tier newsletter feature or Bronze campaign add-ons, implement a compliant consumer newsletter opt-in mechanism with recorded consent.
*Owner: Build squad | Deadline: Before newsletter/Gold launch*

**[V3-C13] REQUIRED — WCAG 2.2 AA Audit for V3 (Accessibility)**
Repeat formal accessibility audit before V3 launch covering all new V3 surfaces (order management, product catalogue with allergen fields, checkout flow).
*Owner: QA | Deadline: Before V3 launch*

---

## Conditions That Are Confirmed Correct (Spec Analysis)

The following positions in the spec are confirmed as correct by this assessment and require no modification:

| Spec Position | Confirmation |
|---|---|
| Stripe Connect Standard keeps Farmmap outside FCA perimeter | Confirmed correct. Financial services assessment. |
| Shop is merchant of record | Confirmed. FCA perimeter and food safety liability both rely on this. |
| 14-day cancellation right for all paid tiers | Confirmed correct (exceeds strict legal minimum; correct commercial position). |
| All 14 allergen fields mandatory for purchasable products | Confirmed correct. Natasha's Law compliant. |
| Payment card data never enters Farmmap's systems | Confirmed correct. PCI SAQ-A eligible. |
| Pre-moderation for reviews and photos before display | Confirmed as strong OSA 2023 compliance position. |
| Downgrade takes effect at end of billing period | Confirmed correct under CCR 2013. |
| Multi-manager from v1 | Legally permissible. DPA with Silver/Gold operators must address manager access. |
| ROI ordering deferred beyond V3 | Appropriate deferral. Cross-border food commerce + Irish consumer law review required before enabling. |
| Anonymous map browsing with no tracking cookies beyond session management | Confirmed correct PECR position. |

---

## Human Co-Sign Requirements

Three issues in this compliance pack **require human sign-off before the relevant version launches.** Architecture and build may proceed; human approval gates are at launch milestones.

**1. yourhonestybox.com written consent [V1-C3]**
The founder must obtain and confirm written consent from yourhonestybox.com before the 336 Irish listings go live. The compliance squad cannot approve this activation. A human (the founder) must confirm in writing that consent is documented and covers commercial use.

**2. Dual ICO/DPC regulator awareness [V1-C2]**
The appointment of the EU GDPR Article 27 representative is a formal legal act. A human (founder or designated DPO) must execute this appointment before V1 launch. This is not a build task — it is a legal/administrative task.

**3. Natasha's Law allergen liability legal opinion [V3-C1]**
The question of Farmmap's civil liability in negligence if a shop operator provides incorrect allergen information requires human legal counsel review. The compliance squad's assessment identifies the risk; the legal opinion must be obtained by a human (founder + external legal counsel). No agent may approve V3 marketplace launch without confirmation from the founder that a legal opinion has been received.

---

## Regimes Skipped — Rationale

| Regime | Reason for Skip |
|---|---|
| education-sector | Farmmap has no involvement with schools, universities, or educational institutions. Not applicable. |
| health-sector | No healthcare data, medical records, or clinical services. Not applicable. |
| iso-27001 | ISO 27001 certification is a B2B enterprise trust signal, not a legal requirement. At V1-V3 stage with no enterprise B2B contracts requiring it, the overhead is not justified. Defer to v2+ if enterprise clients require it. |
| soc2 | Same rationale as ISO 27001. |
| eu-ai-act | V1 contains no AI systems in user-facing decisions. F24 (AI photo moderation) is in the admin-side queue as a Should-Have, admin-facing feature, and does not constitute a high-risk AI system under the EU AI Act classification. If AI personalisation, fraud scoring, or automated content decisions affecting users are introduced in v2+, EU AI Act assessment is required. |

---

## Summary Statement

Farmmap is a medium-complexity compliance case. The dual-jurisdiction structure (UK + ROI) adds overhead over a UK-only product, but does not create prohibitive regulatory risk. The payment architecture (Stripe Connect Standard) is correctly designed and avoids the most significant regulatory risk (FCA authorisation). The allergen compliance model (mandatory 14-field gating) is correct. The pre-moderation model for UGC is a strong OSA 2023 compliance position.

The primary blockers are governance documentation (privacy policy, EU GDPR representative, written consent records) and one genuinely novel legal question (allergen platform liability), not architectural flaws in the product.

**Architecture and build may proceed. All hard-stop conditions are achievable within a normal pre-launch timeline.**

---

*Produced by: compliance-squad-lead*
*Authority: specs/003-farmmap/spec.md + all specialist assessments in specs/003-farmmap/compliance-pack/*
*Agent-foundry Constitution v1.0.0 — Principle 6 (Evidence Pack), Principle 7 (Promotion Gates)*
*Phase: 4 | Gate: compliance-hard-stop | Status: passed-with-conditions*
