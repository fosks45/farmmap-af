---
feature: 003-farmmap
phase: 4
document: financial-services-assessment
specialist: financial-services-specialist
produced_by: compliance-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md + specs/003-farmmap/intake.md
regimes:
  - Financial Services and Markets Act 2000 (FSMA 2000) — UK
  - Payment Services Regulations 2017 (PSRs 2017) — UK
  - Electronic Money Regulations 2011 (EMRs 2011) — UK
  - FCA Perimeter Guidance (PERG)
  - EU Payment Services Directive 2 (PSD2) — ROI
status: passed-with-conditions
---

# Financial Services Assessment — Farmmap

## 1. The Core Question

The intake states: "Stripe Connect Standard — shop is always merchant of record (avoids FCA regulation)." This assessment confirms whether that analysis is correct and identifies any edge cases.

---

## 2. FCA Regulatory Perimeter — Payment Services

Under the Payment Services Regulations 2017 (SI 2017/752), a firm requires FCA authorisation or registration if it provides **payment services** in the UK as a regular business. Payment services (Schedule 1 to the PSRs) include:

- Services enabling cash to be placed on or withdrawn from a payment account
- Execution of payment transactions
- **Money remittance** — transferring funds received from a payer to a payee without a payment account
- **Payment initiation services**
- **Account information services**

The critical question for Farmmap is whether collecting consumer payments and remitting a portion to farm shops constitutes "money remittance" or "execution of payment transactions" requiring FCA authorisation.

---

## 3. Stripe Connect Standard Architecture — FCA Analysis

### 3.1 How Stripe Connect Standard Works

Under Stripe Connect Standard:

1. **Consumer pays:** Consumer's card is charged via Stripe's payment infrastructure. The charge is made **on the farm shop's connected Stripe account**, not on Farmmap's account. The farm shop is the merchant of record.

2. **Application fee deducted:** Stripe deducts Farmmap's application fee (3%/5%) from the charge before settling the remainder to the farm shop.

3. **Settlement:** The farm shop receives the net amount (order total minus Stripe processing fees minus Farmmap's application fee) directly from Stripe into the shop's bank account.

4. **Farmmap never touches consumer funds:** At no point does consumer payment arrive in a Farmmap-controlled account and then get transferred to the farm shop. The entire transaction occurs within Stripe's payment infrastructure, with the shop as the account holder.

### 3.2 FCA Perimeter Analysis

**Is Farmmap executing payment transactions?** No. The payment is executed between the consumer and the farm shop's Stripe account, within Stripe's infrastructure. Farmmap is not a party to the payment transaction — it is the platform that initiated the commercial relationship.

**Is Farmmap providing money remittance?** No. Money remittance involves receiving funds from a payer and transferring them to a payee (often cross-border). Farmmap never receives or holds consumer funds. The application fee is collected by Stripe on Farmmap's behalf as a platform fee deducted at source — this is a billing mechanism, not fund-holding.

**Is Farmmap an e-money institution?** No. E-money institutions issue electronic money (stored-value instruments). Farmmap does not issue, redeem, or hold e-money.

**FCA Perimeter Guidance (PERG 15, Section 15.5):** The FCA's PERG explicitly addresses marketplace/aggregator platforms. A platform that enables commerce between buyers and sellers without holding funds, where the payment provider (Stripe) is the regulated entity, is not itself providing payment services. The regulated entity is Stripe, which is a fully FCA-authorised Payment Institution.

**Conclusion:** Farmmap's use of Stripe Connect Standard is correctly architected to keep Farmmap outside the PSRs 2017 regulated perimeter. The intake's analysis is correct.

---

## 4. Subscription Payments (Bronze/Silver/Gold)

For subscription payments, Farmmap is the merchant of record. The consumer pays Farmmap directly via Stripe for the subscription. Farmmap receives these funds.

**FCA analysis:** Receiving payments for Farmmap's own services (subscriptions) is not a payment service — it is ordinary commerce. A business is not regulated simply because it receives money from customers for its own products/services. No FCA authorisation is required for subscription billing.

---

## 5. Application Fee Collection — No Fund-Holding

**Critical verification:** The application fee mechanism must not involve Farmmap holding consumer funds at any point. Under the correct Stripe Connect Standard implementation:

- The application fee is deducted at source by Stripe when the charge is created
- The fee flows to Farmmap's Stripe balance (settled by Stripe to Farmmap's bank account on Stripe's standard settlement schedule — typically T+2)
- Farmmap never holds consumer payment funds in a segregated account or acts as custodian

**If the implementation inadvertently creates fund-holding** (e.g., if the architecture uses Stripe Connect Custom instead of Standard, or if funds pass through a Farmmap-controlled intermediate account), this analysis changes and FCA authorisation may be required.

**Condition:** The architecture must confirm that Stripe Connect Standard (not Custom or Express) is used for marketplace payments, and that the application fee mechanism does not involve Farmmap holding or transferring consumer funds.

---

## 6. Edge Case: Refunds

When a full or partial refund is issued (per spec F8 commission reversal logic):
- The refund is processed through Stripe
- The application fee reversal is handled by Stripe
- Farmmap does not process the refund directly — it triggers the refund via Stripe's API

This does not create a fund-holding situation. The refund flow remains within Stripe's infrastructure.

---

## 7. Republic of Ireland — PSD2 and PSRs

In Ireland, the Payment Services Directive 2 (PSD2) is implemented via the European Union (Payment Services) Regulations 2018 (SI 6/2018). The analysis is identical to the UK position:

- Stripe is the regulated payment service provider in the EU/EEA
- Under Stripe Connect Standard, the Irish farm shops are the merchants of record
- Farmmap does not hold or transfer funds
- Farmmap is outside PSD2 scope

When Irish marketplace ordering is launched (deferred beyond V3), the same architecture applies.

---

## 8. Consumer Credit and Lending

Farmmap does not offer credit, loans, BNPL (Buy Now Pay Later), or deferred payment. No FCA consumer credit authorisation is required.

---

## 9. Financial Promotions

Under FSMA 2000, communications that constitute "financial promotions" require FCA authorisation or approval by an authorised firm. Financial promotions are communications that invite or induce a person to engage in investment activity or certain financial services.

**Farmmap's marketing:** Farmmap's marketing promotes its own subscription service (Bronze/Silver/Gold) to farm shop operators. This is commercial advertising, not a financial promotion — a subscription to a farm shop directory is not investment activity or a financial service.

No FCA financial promotion approval is required.

---

## 10. Conditions

### C1 — Stripe Connect Standard Confirmation in Architecture (BLOCKER for V3 launch)

The architecture pack must explicitly confirm that Stripe Connect Standard (not Custom or Express) is used for all marketplace payments, and that no fund-holding by Farmmap occurs at any point in the payment flow. This confirmation should cite the specific Stripe integration type.

### C2 — Refund Flow Review (REQUIRED for V3 launch)

The refund flow (especially partial refund commission recalculation per spec F8) must be reviewed to confirm it operates entirely within Stripe's infrastructure without Farmmap holding refunded amounts.

### C3 — No Deviation to Fund-Holding Architecture (ONGOING ARCHITECTURAL CONSTRAINT)

Any future architectural decision that would cause Farmmap to hold consumer payment funds (e.g., adding a wallet, escrow, or delayed settlement feature) would take Farmmap outside the current FCA non-regulated position and require legal review before implementation.

---

## 11. Overall Assessment

**Status: PASSED — THE INTAKE ANALYSIS IS CORRECT**

The assessment confirms that Stripe Connect Standard keeps Farmmap outside the FCA regulated perimeter for payment services. The analysis is correct:
- The farm shop is the merchant of record
- Farmmap never holds consumer funds
- The application fee is a platform service charge, not money remittance
- Stripe is the regulated payment service provider

The primary condition is architectural verification — the implementation must confirm it uses Stripe Connect Standard and not a Custom or Express model that would change the fund flow.

---

*Produced by: compliance-squad-lead (invoking financial-services-specialist)*
*Authority: specs/003-farmmap/spec.md + intake.md + FCA PERG 15*
*Feeds: specs/003-farmmap/compliance-pack/compliance-decision.md*
