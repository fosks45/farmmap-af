---
adr: ADR-0005
title: Payments — Stripe Billing + Stripe Connect Standard
status: accepted
date: 2026-05-17
feature: 003-farmmap
authority: specs/003-farmmap/spec.md (F7, F8, F9, F10, Q5 sign-off) + specs/003-farmmap/compliance-pack/compliance-decision.md (V3-C10)
deciders:
  - architecture-squad-lead
---

# ADR-0005: Payments — Stripe Billing Subscriptions + Stripe Connect Standard

## Context

Farmmap has two distinct payment flows:
1. **Subscriptions** (Bronze £20/month, Silver £60/month, Gold £100/month) billed to listing owners.
2. **Marketplace orders** (Silver/Gold) where consumers pay farm shops; Farmmap takes a 3% (Silver) or 5% (Gold) application fee on orders above the commission threshold.

Compliance-pack [V3-C10] explicitly requires: Stripe Connect Standard (not Custom or Express) must be confirmed in the architecture, and no fund-holding by Farmmap may occur.

The spec sign-off decision Q5 (2026-05-16) confirmed Gold tier eligibility gating requires:
- `silver_months_count`: count of calendar months a listing has been on Silver tier.
- `completed_order_count`: count of completed (delivered) orders.
- Gold upgrade disabled until both `silver_months_count >= 3` AND `completed_order_count >= 50`.

Commission structure confirmed in spec:
- Silver: 3% on order subtotal ≥ £20; £0 below £20.
- Gold: 5% on order subtotal ≥ £30; £0 below £30.
- Auto-reversal on full refund within 1 hour.

## Decision

**Stripe Billing for subscriptions (Bronze/Silver/Gold). Stripe Connect Standard for all marketplace payments (Silver/Gold). Gold eligibility tracked in `listing_subscriptions` table via Stripe webhooks.**

Architecture:

### Subscriptions (Stripe Billing)

- Three Stripe Products: `farmmap-bronze`, `farmmap-silver`, `farmmap-gold`, each with a monthly recurring Price.
- Subscription lifecycle managed via Stripe Billing; payment recovery handled by Stripe's Smart Retries (7-day grace period per spec F7).
- Farmmap Billing Portal (Stripe Customer Portal) for owner self-service upgrade/downgrade/cancel.
- Stripe webhooks (`invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`) update `listing_subscriptions` table.
- `silver_months_count` incremented by a webhook handler on `invoice.paid` when the subscription tier is Silver.
- Downgrade takes effect at `cancel_at_period_end = true` — Stripe's native end-of-period downgrade mechanism. Satisfies spec Q6 decision.

### Marketplace Payments (Stripe Connect Standard)

- Farm shops (Silver/Gold) connect their Stripe account via the Standard OAuth flow. Farmmap holds the `stripe_connect_account_id` per listing (stored encrypted at C3).
- All marketplace charges are created on the connected account with an `application_fee_amount` calculated server-side:
  ```
  fee = subtotal_pence < threshold_pence ? 0 : Math.round(subtotal_pence * commission_rate)
  ```
  Where `threshold_pence` = 2000 (Silver) or 3000 (Gold), and `commission_rate` = 0.03 (Silver) or 0.05 (Gold).
- **Farm shop is the merchant of record** at all times. Funds flow directly to the connected account; Farmmap receives the application fee.
- No fund-holding by Farmmap — satisfies the FCA perimeter requirement and [V3-C10].
- Stripe Payment Intents for checkout (with idempotency key per order, satisfying spec Q7 decision).

### Gold Eligibility Gate

- `listing_subscriptions.silver_months_count`: incremented by `invoice.paid` webhook when tier is Silver.
- `listing_subscriptions.completed_order_count`: incremented by the order completion handler (when owner transitions order to `delivered`).
- Gold upgrade endpoint checks both fields before creating the Stripe upgrade. Admin can manually override via the admin console (sets a `gold_eligibility_override: bool` flag on the subscription record).
- The check runs at upgrade time (not continuously), as confirmed in spec Q5.

### Idempotency

- All order creation requests include a client-generated `idempotency_key` (UUID) sent with the Stripe Payment Intent creation. Stripe's native idempotency handles duplicate payment attempts.
- Database-level UNIQUE constraint on `orders.stripe_payment_intent_id` as the secondary defence (spec Q7 decision: both layers required).

## Consequences

**Positive:**
- Stripe Connect Standard keeps Farmmap outside the FCA perimeter (confirmed by compliance pack). The shop is always the merchant of record.
- PCI DSS SAQ-A applies (Stripe Hosted Elements; card data never touches Farmmap's infrastructure). Confirmed by compliance pack.
- Stripe Billing handles the full subscription lifecycle (dunning, retries, proration, portal) without custom code.
- End-of-period downgrade via `cancel_at_period_end` is a single Stripe API call; no custom scheduling required.

**Negative / Risks:**
- Stripe Connect Standard onboarding requires each shop owner to complete Stripe's KYC/identity verification. Some owners may abandon this step. Mitigation: clear onboarding UX explaining the requirement (spec F8 Silver onboarding step).
- Commission reversal on full refund must be implemented as a custom webhook handler (`charge.refunded`) that issues a Stripe application fee refund. The "within 1 hour" spec requirement requires the webhook handler to process promptly — implement with a low-latency serverless function, not a cron job.
- `silver_months_count` and `completed_order_count` are maintained by webhooks; webhook delivery failures could under-count. Mitigated by Stripe's at-least-once webhook delivery and idempotency checks on the handler.

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| Stripe Connect Express | Express uses a Stripe-hosted dashboard; shops cannot access Stripe's full dashboard. Standard is preferred because shop owners may use their Stripe account for other purposes and benefit from a unified dashboard. |
| Stripe Connect Custom | Custom requires Farmmap to handle KYC, identity verification, and money transmission. Would require FCA authorisation. Explicitly rejected. |
| Paddle | Does not support Connect-style marketplace payments. |
| GoCardless | ACH/BACS direct debit — not appropriate for immediate card-based consumer checkout. |
| Braintree | Viable but no meaningful advantage over Stripe at v1. Stripe's UK/Ireland support is more mature. |
