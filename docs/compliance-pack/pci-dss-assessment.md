---
feature: 003-farmmap
phase: 4
document: pci-dss-assessment
specialist: pci-dss-specialist
produced_by: compliance-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md + specs/003-farmmap/intake.md
regimes:
  - PCI DSS v4.0
  - Stripe Connect Standard documentation
status: passed-with-conditions
---

# PCI DSS Assessment — Farmmap

## 1. Payment Architecture Overview

Farmmap uses **Stripe Connect Standard** for marketplace payments (Silver/Gold tier). The intake and spec confirm:

- Farm shop is the **merchant of record** via their own Stripe account
- Farmmap takes an **application fee** at charge level within Stripe's infrastructure
- Payment card data **never enters Farmmap's own systems** (confirmed in spec, Non-Functional Requirements — Security)
- "All card processing is handled by the payment platform. The platform stores only the tokens and identifiers provided by the payment platform."

Separately, Bronze/Silver/Gold subscription payments are processed via **Stripe Subscriptions** where Farmmap is the merchant of record for subscription charges.

---

## 2. PCI DSS Scope Analysis

### 2.1 Silver/Gold Marketplace Payments (Stripe Connect Standard)

Under Stripe Connect Standard, when a consumer pays for an order:
1. The consumer's card details are entered directly into Stripe's hosted payment form (Stripe Elements or Stripe Checkout)
2. Stripe tokenises the card data
3. The charge is made on the farm shop's connected Stripe account
4. Farmmap receives an application fee via Stripe's fee mechanism

**PCI DSS scope for Farmmap:** Farmmap is **not in scope** for PCI DSS in respect of marketplace order payments because:
- Farmmap never sees, transmits, stores, or processes raw card data
- Card data entry occurs in Stripe's PCI-compliant hosted fields (Stripe Elements/Checkout)
- Farmmap's systems only ever receive Stripe-issued tokens and payment IDs

This is the standard justification used by Stripe Connect Standard platforms (Depop, Vinted, Etsy). Farmmap's architecture is correct.

**Caveat:** Farmmap must not deviate from this architecture in any way that would bring card data into its own systems. Specifically:
- Must not create a custom payment form that collects card numbers directly
- Must not store any card number, expiry date, or CVV value in its database
- Must not log Stripe webhook payloads in full if those payloads could contain card-related data (they typically do not, but webhook logging must be reviewed)

### 2.2 Bronze/Silver/Gold Subscription Payments (Stripe Subscriptions)

For subscription payments, Farmmap is the merchant of record. However, the same Stripe Elements / Stripe Checkout mechanism applies: card data is entered in Stripe's hosted interface, not Farmmap's. Farmmap receives a Stripe payment method ID (token) for recurring billing.

**PCI DSS scope for Farmmap:** Same position as above — Stripe handles card data; Farmmap receives tokens.

**SAQ-A eligibility:** Because Farmmap uses Stripe's hosted card capture exclusively and does not handle card data in any form, Farmmap qualifies for **PCI DSS SAQ-A** (Self-Assessment Questionnaire A) — the simplest self-assessment tier, applicable to merchants that outsource all card data functions to a PCI-compliant third party.

SAQ-A requirements are minimal:
- Maintain a security policy
- Use Stripe's hosted fields only
- Ensure the Stripe integration is kept up to date
- Complete annual SAQ-A self-assessment

---

## 3. Stripe Connect Standard — Farm Shop Onboarding

When farm shops onboard to Silver/Gold, they undergo Stripe's own KYC and compliance verification:
- Stripe collects business identity, banking details, and the information required under Stripe's own Know Your Customer process
- Stripe is responsible for PCI compliance for the connected account's payment processing
- Farmmap's obligation is to ensure its Stripe Connect integration does not circumvent Stripe's compliance architecture

**Noted risk in PESTEL analysis:** Some older farm shop operators may struggle with Stripe's KYC requirements. This is a support/onboarding design challenge but does not create a PCI DSS compliance risk for Farmmap.

---

## 4. Data That Must Never Be Stored or Logged

| Data Type | Status |
|---|---|
| Full card number (PAN) | Never — Stripe never provides this to Farmmap |
| Card expiry date | Never |
| CVV/CVC | Never |
| Stripe payment method ID / token | Storable — this is a PCI-safe reference, not card data |
| Stripe customer ID | Storable — non-sensitive identifier |
| Last 4 digits of card | Storable and displayable (PCI SAQ-A compliant for display to customer) |
| Webhook event IDs | Storable |
| Order amounts | Storable |
| Commission amounts | Storable |

**Condition:** The application must be reviewed to confirm that no logging, debugging, or analytics pipeline inadvertently captures any Stripe webhook payload that could contain sensitive data beyond the above-permitted fields.

---

## 5. Commission Calculation and Fund Flows

The commission model (3% on Silver orders ≥ £20; 5% on Gold orders ≥ £30) is implemented as a Stripe application fee:
- The total consumer payment goes to the farm shop's Stripe account
- Farmmap's application fee is deducted at source within Stripe before the shop's payout
- Farmmap never holds the consumer's payment funds

**PCI DSS implication:** Because Farmmap does not hold or transfer consumer funds (funds go directly from the consumer's card to the shop's Stripe account via Stripe's infrastructure), Farmmap is not acting as a payment institution and the application fee mechanism does not create an e-money or payment services obligation.

**Important:** This fund flow also confirms the FCA non-registration position (see financial-services-specialist assessment for the full analysis).

---

## 6. Conditions

### C1 — SAQ-A Annual Self-Assessment (REQUIRED for V3 launch)

Before Silver/Gold tier launches, Farmmap must complete a PCI DSS SAQ-A self-assessment. This is annual. It can be completed by the founding team without a QSA (Qualified Security Assessor) at SAQ-A level.

### C2 — Stripe Integration Code Review for Card Data Leakage (BLOCKER for V3 launch)

A code review of the Stripe integration must confirm that no card data reaches Farmmap's application layer. This includes reviewing webhook handlers, logging configurations, and any custom Stripe Elements implementations.

### C3 — No Custom Card Capture Forms

The build team must use exclusively Stripe Elements or Stripe Checkout for all payment UIs. Custom HTML card number input fields are prohibited regardless of downstream tokenisation.

---

## 7. Overall Assessment

**Status: PASSED — MINIMAL CONDITIONS**

Farmmap's confirmed payment architecture (Stripe Connect Standard with Stripe-hosted card capture) places it outside PCI DSS scope for the full SAQ-D or SAQ-B. SAQ-A self-assessment is the only PCI obligation, and it is straightforward to complete. The fund flow architecture is correct and the spec's "payment card data never enters the platform's own systems" statement is accurate and must be maintained as an architectural constraint.

The primary condition is that the Stripe integration is reviewed before V3 launch to confirm no card data leakage in logging or debugging pipelines.

---

*Produced by: compliance-squad-lead (invoking pci-dss-specialist)*
*Authority: specs/003-farmmap/spec.md + intake.md + Stripe Connect documentation*
*Feeds: specs/003-farmmap/compliance-pack/compliance-decision.md*
