---
feature: 003-farmmap
phase: 4
document: consumer-rights-assessment
specialist: consumer-rights-specialist
produced_by: compliance-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md + specs/003-farmmap/intake.md
regimes:
  - Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 (UK)
  - Consumer Rights Act 2015 (UK)
  - Digital Markets, Competition and Consumers Act 2024 (DMCC 2024)
  - Consumer Protection Act 2007 (Ireland) — ROI
  - Consumer Rights Act 2022 (Ireland) — ROI
status: conditions-required
---

# Consumer Rights Assessment — Farmmap

## 1. Regime Scope

Farmmap's paid subscription tiers (Bronze, Silver, Gold) constitute distance contracts under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 (CCR 2013). Farm shop owners who subscribe are "consumers" for the purposes of these regulations in certain circumstances — the definition depends on whether the subscription is entered into in the course of their trade, business, or profession.

**Critical distinction:** Farm shop owners subscribing to Bronze/Silver/Gold are doing so in the course of their trade. The CCR 2013 definition of "consumer" is a natural person acting outside their trade/business/profession. This means most farm shop owner subscriptions are **business-to-business contracts**, not consumer contracts, and the 14-day withdrawal right does not automatically apply.

**Exception:** Where the farm shop owner is an individual sole trader acting partly in a business and partly in a personal capacity, or where the contract is only marginally related to their trade, some consumer protection provisions may apply. This is a grey area. The safer commercial and reputational position — and the position the spec has already adopted — is to **provide the 14-day cancellation right regardless** of strict legal obligation. This is confirmed in the spec (F10).

---

## 2. 14-Day Cancellation Right (Consumer Contracts Regulations 2013 / CCR 2013)

### Spec Position

The spec (F10) states: "At the initial signup for any paid tier, the owner has a 14-day right to cancel and receive a full refund." This is correct and exceeds minimum legal requirement (given the B2B ambiguity above). The spec also states: "This right is disclosed prominently on the payment page and in the post-payment confirmation email. It applies to the initial signup only, not to upgrades from one tier to another."

### Pre-Contractual Information Requirements (CCR 2013, Regulation 13)

Before entering a distance contract, Farmmap must provide the following information in a durable medium:

1. The main characteristics of the service (what each tier provides)
2. The identity and geographic address of Farmmap Ltd (or the trading entity)
3. The total price inclusive of all charges (subscription + commission structure)
4. The 14-day withdrawal right and how to exercise it
5. Information about what happens to data if the consumer cancels
6. The minimum duration of the contract (if any — Farmmap's subscription appears to be rolling monthly with no minimum term, which is the safer model)

**Condition:** The payment pages for Bronze, Silver, and Gold must display all required pre-contractual information. The 14-day withdrawal notice must not be buried in terms and conditions — it must be on the checkout page.

### Digital Markets, Competition and Consumers Act 2024 (DMCC 2024)

The DMCC 2024 received Royal Assent on 24 May 2024. Its consumer enforcement provisions (Part 4) are being brought into force in stages; the subscription contract provisions (Chapter 2 of Part 4) are expected to be fully operative by late 2025 / early 2026.

**Key subscription contract requirements under DMCC 2024 that apply to Farmmap:**

| Requirement | Farmmap Implication |
|---|---|
| Reminder notification before auto-renewal | Before each monthly billing renewal, Farmmap must send a notification informing the subscriber of the upcoming charge and how to cancel. |
| Easy cancellation mechanism | Cancellation must be achievable through the same channel used to subscribe (online self-serve). A subscriber who signed up online must be able to cancel online. A telephone-only cancellation process is prohibited. |
| Pro-rata refund on cancellation during term | The CMA has interpreted DMCC 2024 as requiring that cancellation mid-term entitles the subscriber to a refund of the unused portion of the current billing period. The spec currently states "no partial-period refunds after the 14-day cancellation right window" — this may need revision under DMCC 2024. |
| No subscriptions that activate without clear consent | The subscription activation at Bronze must be an active, informed click-through — no pre-ticked subscription boxes. |

**Condition (DMCC 2024):** The subscription renewal notification and pro-rata refund positions must be reviewed against DMCC 2024 provisions as they come into force. The spec's current "end of period on cancellation, no partial refund" position may need to be amended to provide pro-rata refunds on mid-period cancellations. Legal advice is required on the specific DMCC 2024 commencement date and scope for Farmmap's subscription model.

---

## 3. Consumer Rights Act 2015 — Digital Content and Services

The Consumer Rights Act 2015 (CRA 2015) applies to:
- **Digital content** supplied to consumers (the Farmmap map and listing data viewed by consumers)
- **Services** supplied to consumers (the Bronze subscription services including analytics dashboard and branded page)

For digital content and services supplied to consumers:
- Content/services must be of satisfactory quality, fit for purpose, and as described
- Where content/services are defective, the consumer has a right to repair or replacement, and ultimately a price reduction or refund

**For Farmmap's free tier (consumer browsing):** The map and listing data are provided free of charge in exchange for the consumer's attention/engagement. The CRA 2015 applies to digital content supplied for consideration, including where "the consumer provides personal data as the price." Anonymous browsing (no account, no data provided) falls outside this provision; logged-in consumer browsing where session/analytics data is collected would technically fall within it.

**Practical implication:** Farmmap must ensure its consumer-facing services perform as described. Listing data that is demonstrably incorrect and causes a consumer to make a wasted journey is a potential CRA 2015 issue if the platform has been negligent in allowing inaccurate data to persist. The moderation system (F11) and the "last verified" timestamp approach are the mitigations.

---

## 4. Subscription Lifecycle Compliance

### Upgrade Flow

The spec (F10) states upgrades take effect immediately with prorated charges. This is acceptable under consumer protection principles: the subscriber receives immediate access to the higher tier.

### Downgrade Flow

End-of-period downgrade with 7-day advance notice is compliant and commercially sensible. The spec's provision that "pending orders must be resolved before Silver features are removed" is a consumer protection measure in the marketplace context.

### Grace Period (F7)

The spec provides a 7-day grace period on card failure with notifications on day 1 and day 5, suspension on day 8. This is reasonable but must be documented clearly in the subscription terms so the subscriber knows the timeline.

### Cancellation with Pending Orders

The spec requires that "any pending orders in the order management system must be fulfilled or refunded before Silver features are removed." This is correct from a consumer protection standpoint: a Silver-tier consumer who has placed an order has a contractual right to receive that order (or a refund). Farmmap, as the platform facilitating the transaction, has reputational and potentially legal exposure if orders are abandoned due to the shop's subscription cancellation.

**Condition:** The Terms of Service must clearly state that cancelling a Silver/Gold subscription does not affect the shop's obligation to fulfill outstanding orders placed before the cancellation effective date.

---

## 5. Unfair Contract Terms

The Consumer Rights Act 2015 (Part 2) and the Consumer Contracts Regulations 2013 prohibit unfair terms in consumer contracts. While most Farmmap subscriber relationships are B2B, the following terms should be reviewed for fairness regardless:

- **Exclusion of liability clauses:** Any clause purporting to exclude Farmmap's liability for data loss, platform unavailability, or incorrect listing data should be reviewed. Total exclusion clauses are unlikely to be enforceable.
- **Automatic renewal without adequate notice:** Covered by DMCC 2024 (see above).
- **Immediate termination without refund for Terms of Service violations:** Such clauses need to be proportionate and clearly defined. "Immediate suspension" is acceptable for specific serious violations; "immediate termination" without any notice or right to cure for minor violations is likely unfair.

---

## 6. Display of Prices and Commission Transparency

The spec (F8) notes: "The £20 commission threshold applies to the full order subtotal, not per item. This must be disclosed clearly to shop owners during Silver onboarding and in the subscription agreement."

**Requirement:** Commission structure disclosure is not merely a best practice — it is a contractual obligation. The subscription agreement for Silver and Gold must state the commission structure in a clear, unambiguous format. Hidden or obscured commission terms create liability under the CCR 2013's unfair commercial practices provisions.

For Gold tier, the commission structure (5% on orders ≥ £30) and the risk note (commission exceeds standalone e-commerce costs above £8,000/month GMV) must be transparent in the onboarding documentation. The spec acknowledges this risk — it must also be disclosed to Gold subscribers.

---

## 7. Republic of Ireland — Consumer Law

### Consumer Rights Act 2022 (Ireland)

The Irish Consumer Rights Act 2022 (commenced 29 November 2022) implements the EU Digital Content Directive (2019/770/EU) and Consumer Sales and Guarantees Directive (2019/771/EU). It applies to:
- Contracts for the supply of digital services to consumers
- Contracts for the supply of digital content to consumers
- Contracts for the sale of goods to consumers

For Farmmap in Ireland:
- The map and listing service provided to Irish consumers constitutes a "digital service"
- Irish consumers have rights to conformity of the digital service, remedy for lack of conformity, and price reduction or termination of contract where the service does not conform

**Key difference from UK CRA 2015:** The Irish 2022 Act explicitly covers services provided in exchange for personal data. Anonymous browsing still falls outside scope; any logged-in Irish consumer using the platform is providing personal data and is therefore within scope.

**Condition:** Before enabling any paid services to Irish consumers (which is currently deferred — ROI ordering is not in V1-V3 scope), a separate Irish consumer law review is required.

---

## 8. Conditions Summary

### C1 — Pre-Contractual Information on Payment Pages (BLOCKER for V2 launch)

All required pre-contractual information under CCR 2013 Regulation 13 must appear on the Bronze/Silver/Gold payment pages. The 14-day withdrawal right must be prominent, not buried in terms.

### C2 — DMCC 2024 Subscription Auto-Renewal Notification (BLOCKER for V2 launch)

Implement automatic pre-renewal notification for each monthly billing cycle. The notification must state the amount to be charged and provide a clear link to cancel.

### C3 — DMCC 2024 Pro-Rata Refund Position (LEGAL REVIEW REQUIRED)

The spec's "no partial-period refunds after 14-day window" position must be reviewed against DMCC 2024 provisions on cancellation. If DMCC 2024 requires pro-rata refunds on cancellation, the spec must be amended before V2 launch.

### C4 — Commission Transparency in Silver/Gold Subscription Agreement (BLOCKER for V3 launch)

The subscription agreement for Silver and Gold must state the commission structure unambiguously, including the £20/£30 threshold mechanics and any commission cap if designed per market-decision.md recommendation.

### C5 — Cancellation Terms and Pending Order Obligations in ToS (BLOCKER for V3 launch)

The Terms of Service must confirm that cancellation of a Silver/Gold subscription does not relieve the shop of its obligation to fulfill outstanding orders.

---

## 9. Overall Assessment

**Status: CONDITIONS REQUIRED**

The spec has already incorporated the core consumer rights requirements (14-day cancellation right, self-serve cancellation, downgrade notice). The primary gaps are:
1. DMCC 2024 auto-renewal notification is not currently specified
2. DMCC 2024 pro-rata refund position needs legal review
3. Pre-contractual information display needs to be specified for the payment pages
4. Commission transparency in the subscription agreement needs to be formalised

None of these conditions prevent architecture or build commencing. All must be resolved before V2 (Bronze) launch.

---

*Produced by: compliance-squad-lead (invoking consumer-rights-specialist)*
*Authority: specs/003-farmmap/spec.md + intake.md + agent-foundry Constitution v1.0.0*
*Feeds: specs/003-farmmap/compliance-pack/compliance-decision.md*
