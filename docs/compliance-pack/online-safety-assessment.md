---
feature: 003-farmmap
phase: 4
document: online-safety-assessment
specialist: online-safety-specialist
produced_by: compliance-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md
regimes:
  - Online Safety Act 2023 (UK)
  - Ofcom Codes of Practice
status: passed-with-conditions
---

# Online Safety Act 2023 Assessment — Farmmap

## 1. Online Safety Act 2023 — Overview

The Online Safety Act 2023 (OSA 2023) received Royal Assent on 26 October 2023. Ofcom is the regulator. The OSA creates duties for "user-to-user services" and "search services." Farmmap's user review feature (F5) and photo upload capability (F4) constitute user-generated content (UGC). The question is whether these features bring Farmmap into scope as a regulated service under the OSA.

---

## 2. Is Farmmap a "User-to-User Service"?

Under OSA 2023, a "user-to-user service" is an internet service where:
- Users can upload, post, or generate content that can be accessed by other users via the service
- The service is within the jurisdiction of the Act (UK users, or providers with significant UK user base)

**Farmmap's UGC features:**
- **Consumer reviews (F5):** Logged-in consumers post text reviews and star ratings that are visible to other users via listing detail pages
- **Photo uploads (F4):** Listing owners upload photos that are visible to consumers on listing pages
- **Owner responses to reviews (F5):** Listing owners respond to consumer reviews, visible on listing pages

These features satisfy the definition of a user-to-user service. Farmmap is **in scope** for the OSA 2023.

---

## 3. Which Category Does Farmmap Fall Into?

The OSA 2023 creates a tiered system:

**Category 1 (large platforms — explicit content duties):** Very large platforms with over 7 million UK users/month. Not applicable to Farmmap at any realistic near-term scale.

**Category 2A (large search services):** Not applicable.

**Category 2B (platforms with significant UK reach):** Platforms with over 1 million UK users/month but below Category 1. Unlikely to apply at V1-V3 scale (target is 100k monthly visitors).

**Small/micro businesses (below 1 million UK users/month):** Subject to the **core illegal content duties** but with proportionate implementation expectations.

**Farmmap's classification:** Small user-to-user service subject to core illegal content duties. Not subject to the more onerous transparency, user empowerment, or content reporting obligations that apply to larger platforms.

---

## 4. Core Illegal Content Duties (All In-Scope Services)

Under OSA 2023 (Part 3, Chapters 2-3), all regulated user-to-user services must:

### 4.1 Illegal Content Risk Assessment

Farmmap must complete a risk assessment assessing the risk of the service being used to encounter or facilitate **priority illegal content** (as defined by Schedule 7 to the OSA 2023). Priority illegal content includes:

| Category | Farmmap Relevance |
|---|---|
| Child sexual abuse material (CSAM) | Low risk — adult food directory; no direct messaging; no anonymous image sharing without moderation |
| Terrorism content | Negligible — farm shop reviews are not a credible terrorism vector |
| Hate speech (incitement to hatred) | Low but non-zero — text reviews could contain hateful language about a farm shop owner; must be detectable |
| Fraud and financial harm | Low but relevant — fake farm shop listings or fraudulent reviews are conceivable |
| Drug supply | Negligible |
| Illegal harassment and cyberstalking | Low risk — farm shop context; reviews targeted at individuals rather than businesses are possible |

**Assessment:** Farmmap has a **low risk profile** for priority illegal content. Farm shop review platforms are not credible high-risk vectors for CSAM, terrorism, or drug supply content. The realistic illegal content risks are: hate speech in reviews, fraudulent listings, and potentially harassment of individual farm shop owners via reviews.

### 4.2 Illegal Content Safety Measures

Farmmap must implement proportionate measures to:
- Prevent users from encountering priority illegal content
- Swiftly remove priority illegal content identified through reports or moderation

**Farmmap's existing moderation system (F11)** provides the core mechanism:
- Reviews are moderated before display (pre-moderation)
- Photos are moderated before display (pre-moderation)
- Reported content queue with severity classification
- Admin review of flagged items

**Pre-moderation is the gold standard** for OSA compliance for small services. By not displaying any user content until it has been approved, Farmmap minimises the exposure to illegal content that reaches consumers. This is a strong compliance position.

**Condition:** The moderation policy must explicitly document the criteria for rejecting content that constitutes priority illegal content under the OSA 2023. The "reported content" flow must include a specific escalation path for content that may be illegal (as distinct from merely offensive or factually incorrect).

### 4.3 User Reporting Mechanism

OSA 2023 requires in-scope services to provide a mechanism for users to report illegal content. The spec (F5) already includes: "Consumers can report a review as inappropriate; reported reviews enter a secondary moderation queue." This mechanism must be extended to:
- Allow reports to flag content as potentially illegal (not just "inappropriate" or "spam")
- Provide a meaningful response to reports of illegal content (acknowledging receipt, notifying the reporter of action taken)

**Condition:** The reporting mechanism must include "potentially illegal content" as a report category. Admin console triage must distinguish between standard moderation reports and potential illegal content reports.

### 4.4 OSA 2023 Terms of Service Requirements

For regulated services, terms of service must:
- State what content is not allowed on the platform
- Describe how users can report content
- Describe how Farmmap handles content that violates its terms

**Condition:** The Terms of Service and Community Guidelines must include explicit content prohibition language covering the OSA 2023 illegal content categories and describe the reporting and moderation process.

---

## 5. Photo Uploads Specific Assessment

Owner photo uploads (F4) and product photo uploads (F13) are moderated before display. The relevant risks:
- **NSFW content:** The pre-moderation workflow with admin review provides adequate protection. The Should-Have F24 (AI-assisted photo moderation) would supplement this.
- **Illegal imagery:** Vanishingly low risk in a farm shop context. No evidence of significant illegal imagery risk in agricultural directory use cases.
- **Content used to harass:** A photo could potentially be uploaded to defame or harass a farm shop owner. Pre-moderation provides the key protection.

---

## 6. Republic of Ireland — Coimisiún na Meán

The Irish Online Safety and Media Regulation (OSMR) Act 2022 and the EU Digital Services Act (DSA) apply in Ireland. Farmmap's Irish operations may fall within DSA scope.

**EU Digital Services Act (DSA):**
- Very Large Online Platforms (VLOPs): 45+ million EU monthly users — not applicable
- Micro/Small/Medium enterprises: Subject to basic DSA duties but with significant exemptions
- Farmmap qualifies as a micro enterprise at V1-V3 scale

For micro enterprises, the DSA obligations are limited: notice-and-action for illegal content and a single point of contact for member state authorities. This is materially less onerous than the OSA 2023 duties.

**Condition:** Farmmap should designate a contact point for DSA purposes (can be the same person as the EU GDPR representative contact). This is a low-effort compliance action.

---

## 7. Conditions

### C1 — Illegal Content Risk Assessment (REQUIRED before V2 launch — when reviews go live)

A written illegal content risk assessment under OSA 2023 must be completed before the review feature (F5) launches. Given Farmmap's low-risk profile, this is a proportionate assessment document (not a full Ofcom-style risk assessment framework) that identifies:
- The specific illegal content risks for a farm shop review platform
- The mitigations in place (pre-moderation, user reporting)
- Residual risks and monitoring approach

### C2 — "Potentially Illegal" Report Category in the Reporting UI (BLOCKER for F5 launch)

The consumer review reporting mechanism must include "potentially illegal content" as a specific report category, distinct from "spam" and "inappropriate."

### C3 — Moderation Policy Document for Illegal Content (BLOCKER for F5 launch)

The admin console moderation workflow documentation must include an explicit protocol for handling reports of potentially illegal content, including escalation to law enforcement if content constitutes a serious crime.

### C4 — Terms of Service Illegal Content Prohibition (BLOCKER for F5 launch)

The Terms of Service must explicitly prohibit the OSA 2023 priority illegal content categories in language accessible to users.

### C5 — DSA Contact Point for ROI/EU (RECOMMENDATION)

Designate a contact for DSA purposes (can be shared with the GDPR EU representative). Record this in the privacy policy and terms of service.

---

## 8. Overall Assessment

**Status: PASSED — CONDITIONS REQUIRED BEFORE REVIEW FEATURE LAUNCHES**

The OSA 2023 applies to Farmmap because it has user-generated content (reviews, photos). However, Farmmap's pre-moderation model — where no user content is publicly displayed without admin review — is one of the strongest possible compliance positions for a small service. The conditions required are primarily documentation and process conditions, not architectural changes.

The conditions are scoped to V2 launch (when reviews go live). V1 (free directory with no reviews) does not require the OSA conditions to be satisfied before launch, provided the photo upload system also gates on admin approval before display.

---

*Produced by: compliance-squad-lead (invoking online-safety-specialist)*
*Authority: specs/003-farmmap/spec.md + Online Safety Act 2023*
*Feeds: specs/003-farmmap/compliance-pack/compliance-decision.md*
