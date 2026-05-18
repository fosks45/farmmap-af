---
feature: 003-farmmap
phase: 4
document: children-data-assessment
specialist: children-data-specialist
produced_by: compliance-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md + specs/003-farmmap/personas-pack/personas.md
regimes:
  - UK GDPR Article 8 + ICO Children's Code (Age Appropriate Design Code)
  - EU GDPR Article 8
  - COPPA (US — not applicable)
status: passed-with-note
---

# Children's Data Assessment — Farmmap

## 1. Assessment Question

Does Farmmap need age-gating? Is it likely to be accessed by children? Are any data processing activities directed at children?

## 2. Product Analysis

**Consumer-facing product (map browsing, listing views, F1/F2):** The anonymous browsing experience sets no account requirement and collects no personal data beyond a session cookie. A child browsing the map to find a farm shop is functionally equivalent to a child using Google Maps. No age-gating is appropriate or required for anonymous browsing.

**Account creation (F16):** Consumer accounts are required for:
- Review submission (F5) — requires verified email address
- Saving favourites
- Ordering notifications

**Owner accounts:** Required for listing claim (F3) and subscription management. A farm shop owner under 18 is theoretically possible (a young person who has inherited or is jointly running a family farm business). However, the claim flow requires a business email address, a declaration of business role, and acceptance of subscription terms — these are substantively business-to-business interactions.

## 3. ICO Age Appropriate Design Code (Children's Code)

The ICO's Children's Code applies to "online services likely to be accessed by children." The Code covers any online service that is either:
- Directed at children, or
- Likely to be accessed by a significant proportion of children

**Assessment for Farmmap:**

The core Farmmap user persona is an adult aged 25–65 with an interest in local food and food provenance. The service is:
- Not marketed to children
- Not designed with content or features that would particularly attract children
- Not similar to services that attract child users at scale (social media, gaming, streaming)

The service does involve food — food content is age-neutral. However, a farm shop directory is not a product category where children are an expected or likely significant user segment.

**Conclusion:** Farmmap is **not likely to be accessed by a significant proportion of children** as defined by the Children's Code. Age-gating is not required.

## 4. Edge Case: Young Farm Shop Owners / Managers

The multi-manager feature (confirmed in spec sign-off) means a farm business owner could add a manager who is under 18. This is not prohibited — a 16-year-old working on a family farm and managing the listing is a legitimate use case.

**Requirement:** The account creation and listing management features do not need to be age-gated. However, the Terms of Service should state that subscription contracts (Bronze/Silver/Gold) require the contracting party to be 18 or over (to ensure contractual capacity). Managers under 18 can be added by an adult owner but may not hold the owner account for billing purposes.

## 5. Review Submission

Consumer reviews (F5) require a verified email account. The Children's Code concern here is minimal: the review platform is not targeted at children, and the verified email requirement is a meaningful friction barrier for young children (though not for teenagers).

No additional age verification mechanism is required for the review feature.

## 6. Conditions

**No conditions required.**

One note for the ToS:
- Subscription contracts (Bronze/Silver/Gold) should state a minimum age of 18 for the account holder entering the subscription agreement. This is a standard contract capacity protection, not a GDPR/Children's Code requirement.

## 7. Overall Assessment

**Status: PASSED — NO CONDITIONS REQUIRED**

Farmmap is not a service likely to be accessed by a significant proportion of children. Age-gating is not required. No special category data processing in relation to children is contemplated. The Children's Code does not apply.

One minor note for the Terms of Service: subscription account holders should be required to be 18+.

---

*Produced by: compliance-squad-lead (invoking children-data-specialist)*
*Authority: specs/003-farmmap/spec.md + ICO Age Appropriate Design Code*
*Feeds: specs/003-farmmap/compliance-pack/compliance-decision.md*
