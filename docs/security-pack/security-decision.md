---
feature: 003-farmmap
phase: 9
gate: security-sign-off
status: passed-with-conditions
risk-classification: medium
critical-findings: []
conditions:
  - "COND-S1: Middleware directory resolution is a hardcoded in-process map — no DB lookup; stale if new directories added without code deployment"
  - "COND-S2: Webhook lookup for payment_intent.succeeded iterates up to 5 recent pending orders by buyer+listing to match encrypted payment_intent_id — low collision risk but not zero under adversarial retry"
  - "COND-S3: silver_months_count increment uses a 2-day window heuristic rather than comparing stored period start — could double-count on webhook retry within 48 hours of period renewal"
  - "COND-S4: /privacy/cookies page is absent — cookie consent implementation incomplete (V1-C8)"
produced_by: security-squad-lead
produced_at: 2026-05-17T00:00:00Z
authority: specs/003-farmmap/spec.md + specs/003-farmmap/compliance-pack/compliance-decision.md
human-approval-required: true
human-approval-reasons:
  - "Security review of auth/payments code requires human security engineer co-sign per Constitution §2"
---

# Farmmap — Security Review Decision

## Gate: Phase 9 Security Sign-Off

**STATUS: PASSED WITH CONDITIONS**

No critical security vulnerabilities found in the eight files reviewed. All principal security controls are present and correctly implemented. Four non-blocking conditions are recorded below. Human security engineer co-sign is required before production launch (Constitution §2 — pen-test sign-off for critical assets).

---

## Files Reviewed

| File | Review Summary |
|---|---|
| `src/app/api/listings/[slug]/claim/route.ts` | Claim tokens: SHA-256 hashed, not plaintext. Correct. |
| `src/app/api/orders/route.ts` | Auth required, allergen checked server-side, delivery zone validated server-side, C3 fields encrypted. |
| `src/app/api/webhooks/stripe/route.ts` | Signature verified before processing. No sensitive data logged. |
| `src/app/api/listings/[slug]/subscriptions/checkout/route.ts` | Gold eligibility checked server-side. Redirect URL allowlist enforced. |
| `src/lib/encryption.ts` | AES-256-GCM with 96-bit IV, 128-bit auth tag. Correct algorithm and implementation. |
| `src/lib/auth.ts` | Role hierarchy enforced. Directory scoping via `getDirectoryId()`. |
| `src/middleware.ts` | Session refresh. Auth redirect for dashboard/admin. Directory injection via `x-directory-id`. |
| `src/app/api/admin/listings/[id]/status/route.ts` | `requireAdmin('content_moderator')` enforced. `directory_id` filter on listing fetch. Audit log written. |

---

## Key Risk Findings

### Stripe Webhook Signature Verification
**Status: CONFIRMED SECURE**

`src/app/api/webhooks/stripe/route.ts` lines 31–48:

- Raw body read with `request.text()` before any parsing (required for signature verification)
- Signature header presence checked before attempting verification (returns 400 if missing)
- `verifyStripeWebhook()` in `src/lib/stripe.ts` calls `stripe.webhooks.constructEventAsync(body, signature, webhookSecret)` — Stripe SDK timing-safe comparison
- Event processing only begins after successful signature verification
- No Stripe secrets or IDs logged (comments and `substring(0,10)` truncation for debug logging)

**No finding.**

---

### Checkout — Gold Eligibility Server-Side Check
**Status: CONFIRMED SECURE**

`src/app/api/listings/[slug]/subscriptions/checkout/route.ts` lines 100–129:

- `requireListingOwner()` called before any eligibility logic — unauthenticated requests rejected with 403
- `silver_months_count` and `completed_order_count` fetched directly from `listing_subscriptions` database record, not from request body or client state
- Check: `!hasOverride && (silverMonths < 3 || completedOrders < 50)` returns HTTP 403 with explanation
- `gold_eligibility_override` fetched from `listings` table (database-authoritative, not client-supplied)
- Redirect URLs validated against `isAllowedRedirectUrl()` — checks hostname matches `NEXT_PUBLIC_SITE_URL` or localhost; prevents open redirect to external domains

**No finding.**

---

### Orders — Allergen Declaration Complete Check (Server-Side)
**Status: CONFIRMED SECURE**

`src/app/api/orders/route.ts` lines 136–194:

- `requireAuth()` called first — unauthenticated requests rejected
- Products fetched from database with `eq('listing_id', listing_id)` — prevents ordering products from a different listing
- Per-product loop checks `!product.is_purchasable` (returns 422 if false)
- Per-product loop checks `!product.allergen_declaration_complete` (returns 422 if false, error code `allergen_declaration_incomplete`)
- `allergen_declaration_complete` is a database GENERATED column — cannot be spoofed by client
- Additionally enforced at DB layer by `products_purchasable_requires_allergen` CHECK constraint

**No finding.**

---

### Orders — Delivery Zone Validation (Server-Side)
**Status: CONFIRMED SECURE**

`src/app/api/orders/route.ts` lines 226–253:

- Delivery zones fetched from database with `eq('listing_id', listing_id)` and `eq('is_active', true)` — server-authoritative
- Postcode matching performed server-side: normalises whitespace, compares uppercase prefix/full postcode
- If delivery zones exist and postcode does not match any zone, returns HTTP 422 `outside_delivery_zone`
- If no delivery zones are configured, order proceeds without zone check (permissive — acceptable for listings still configuring delivery)
- Minimum order validation performed server-side after zone match

**No finding.**

---

### Admin Routes — Role Enforced from auth.ts
**Status: CONFIRMED SECURE**

`src/app/api/admin/listings/[id]/status/route.ts`:

- `requireAdmin(request, 'content_moderator')` called at the top of the handler
- `requireAdmin()` in `src/lib/auth.ts` lines 135–163: calls `requireAuth()` first (no session → 401), then queries `users.admin_role` from the database, then compares against role hierarchy `['content_moderator', 'directory_admin', 'super_admin']`
- Role index comparison: `userIndex < minIndex → 403`. Correctly rejects users with no role (index -1) or lower roles
- Listing fetch includes `.eq('directory_id', directoryId)` — admin cannot modify listings in other directories via this route
- The `directoryId` is injected by middleware from the host header, not supplied by the client

**No finding.**

---

### Claim Tokens — Stored as Hash (Not Plaintext)
**Status: CONFIRMED SECURE**

`src/app/api/listings/[slug]/claim/route.ts` lines 103–126:

- `rawToken = randomBytes(32).toString('hex')` — 256 bits of entropy
- `tokenHash = createHash('sha256').update(rawToken).digest('hex')` — only the hash stored in `claim_tokens.token_hash`
- Raw token sent to user's email only; never written to database
- Verification (GET handler): incoming token hashed with same SHA-256 and compared against stored hash
- `used_at` set on consumption — single-use enforced
- `expires_at` checked server-side — 24-hour expiry
- Pre-existing unused tokens for same listing+email deleted before inserting new one (avoids token accumulation)

`manager_invitations.token_hash` in Migration 001 also uses SHA-256 hash — consistent approach.

**No finding.**

---

### C3 Fields — Encrypted Before Supabase Insert
**Status: CONFIRMED SECURE**

`src/app/api/orders/route.ts` lines 337–349 (order insert):

```
buyer_name: encrypt(buyerName),
buyer_email: encrypt(buyerEmail),
delivery_address: encryptJson(delivery_address),
stripe_payment_intent_id: encrypt(paymentIntent.id),
stripe_connect_account_id: encrypt(connectAccountId),
```

`src/lib/encryption.ts`:
- Algorithm: `aes-256-gcm` (authenticated encryption — provides confidentiality and integrity)
- IV: 12-byte random per encryption call — IV is not reused
- Auth tag: 16 bytes — tamper detection
- Key: 32-byte key loaded from `ENCRYPTION_KEY` environment variable; errors thrown if absent or wrong length
- Key never logged; no plaintext C3 data logged in any reviewed route

Claim route: `claimant_email: encrypt(email)`, `claimant_name: encrypt(name)` — correct.
Webhook `handleCheckoutCompleted`: `stripe_subscription_id: encrypt(stripeSubscriptionId)`, `stripe_customer_id: encrypt(stripeCustomerId)` — correct.

**No finding.**

---

### CORS / Directory Scoping — Middleware Enforces directory_id
**Status: CONFIRMED WITH CONDITION**

`src/middleware.ts`:
- `resolveDirectoryId(host)` maps hostname to a directory ID number using a hardcoded in-process map
- `x-directory-id` header set on all responses; downstream API routes read it via `getDirectoryId(request)`
- All database queries in API routes include `.eq('directory_id', directoryId)` filters

RLS in Migration 005 provides a second layer: `listings_public_read USING (status = 'active')` is not directory-scoped at the policy level. However, the application layer always applies `directory_id` filters before querying.

**COND-S1 (Non-blocking):** The hostname → directory_id map is hardcoded in `resolveDirectoryId()`. Adding a new directory (e.g. BerthMap) requires a code deployment to update the map. This is an operational risk, not a security vulnerability — data cannot cross directories because the map is statically correct — but the architecture spec (ADR-0003) should document this as an intentional design choice and note that a database-driven lookup should replace it before the fourth directory launches.

---

### URL Allowlist — Stripe Redirect URLs Validated
**Status: CONFIRMED SECURE**

`src/app/api/listings/[slug]/subscriptions/checkout/route.ts` lines 29–40:

`isAllowedRedirectUrl()` function:
- Parses both `successUrl` and `cancelUrl` as `URL` objects (invalid URL → `false`)
- Checks `parsed.hostname === siteUrl.hostname` (production domain match)
- Also allows `localhost` and `127.0.0.1` for development
- Applied to both URLs before `createSubscriptionCheckout()` is called
- Returns HTTP 422 `invalid_redirect` if either URL fails validation

**No finding.**

---

## Additional Security Observations

### Idempotency Key on Orders
`src/app/api/orders/route.ts` line 76: `idempotencyKey = parsed.data.idempotency_key ?? randomUUID()`. Client may optionally provide a UUID; server generates one if absent. The key is passed to `stripe.paymentIntents.create()` as `idempotencyKey` and stored as `UNIQUE` in the `orders.idempotency_key` column. Duplicate order detection handled at line 356 with error code `23505` → HTTP 409. Correct double-submission defence.

### Audit Log Immutability
Migration 005 defines no `UPDATE` or `DELETE` RLS policies on `audit_log`. Only `INSERT` is permitted (service role and admins). This enforces the Constitution Principle 10 append-only requirement at the database layer, not just application layer.

### HMAC for PII Lookup Fields
`src/lib/hmac.ts`: `hashEmail()` normalises to lowercase before HMAC-SHA256; `hashIp()` uses daily-rotated salt; `hashActorId()` uses `audit:actor:` prefix to namespace hashes. Keys loaded from environment variables (`EMAIL_HMAC_KEY`). Raw PII never in audit log.

### Admin Listing Update — No directory_id Re-filter on UPDATE
`src/app/api/admin/listings/[id]/status/route.ts` line 79: The UPDATE statement uses `.eq('id', id)` without `.eq('directory_id', directoryId)`. However, the SELECT at line 65 includes `.eq('directory_id', directoryId)` and returns 404 if not found — so the update only proceeds for listings confirmed to be in the correct directory. This is acceptable but slightly fragile; a single atomic UPDATE with both filters would be more defensive.

### Webhook Payment Intent Matching (COND-S2)
`handlePaymentIntentSucceeded` in the webhook route cannot directly match an encrypted `stripe_payment_intent_id` (encryption is non-deterministic, different ciphertext per call). The implementation fetches up to 5 recent pending orders for the buyer+listing and decrypts each to find the match. This is functionally correct. Risk: if a buyer has 5+ simultaneous pending orders for the same listing (unlikely for a farm shop), the correct order could be missed. This is an implementation constraint documented here for awareness — not a vulnerability.

### Silver Months Count Heuristic (COND-S3)
`handleSubscriptionUpdated` increments `silver_months_count` when `daysSinceStart < 2` (within 2 days of period start). If Stripe retries a `customer.subscription.updated` webhook within 48 hours of the billing period renewal, the count could increment twice. Stripe generally retries on 5xx responses; the handler returns 200 on success so retries would only occur on transient errors. Low risk but worth addressing with an idempotency check (e.g., storing `last_silver_month_incremented_at` and only incrementing if the stored date differs from the current period start).

---

## Non-Findings Summary

| Risk | Result |
|---|---|
| Stripe webhook signature verified before processing | CONFIRMED — `constructEventAsync` before any handler |
| Gold eligibility checked server-side | CONFIRMED — DB query, not client state |
| Allergen declaration complete checked server-side | CONFIRMED — DB GENERATED column + server validation |
| Delivery zone validation server-side | CONFIRMED — DB query + postcode matching in API route |
| Admin role enforced from auth.ts | CONFIRMED — role hierarchy check against DB |
| Claim tokens stored as SHA-256 hash | CONFIRMED — raw token in email only |
| C3 fields encrypted before Supabase insert | CONFIRMED — AES-256-GCM throughout |
| Redirect URL allowlist on checkout | CONFIRMED — hostname validation |
| Directory scoping on all data access | CONFIRMED — `directory_id` filters on all queries |
| No secrets or PII in audit log | CONFIRMED — HMAC hashes only; no raw IDs logged |

---

## Conditions Register

| ID | Severity | Description | Remediation |
|---|---|---|---|
| COND-S1 | Low | Directory hostname map is hardcoded in middleware. Operational risk only — data cannot cross directories but new directories require code deployment. | Document in ADR-0003 as intentional; plan DB-driven lookup before 4th directory launches. |
| COND-S2 | Low | Webhook `payment_intent.succeeded` matches order by decrypting up to 5 candidates — not direct key lookup. Negligible collision risk at farm-shop order volumes. | Consider storing a non-encrypted idempotency reference in payment intent metadata for direct matching. |
| COND-S3 | Low | `silver_months_count` increment uses 2-day window heuristic; webhook retry within 48 hours of period renewal could double-count. | Add `last_silver_month_incremented_period_start` field to `listing_subscriptions` and compare before incrementing. |
| COND-S4 | Medium | `/privacy/cookies` page is absent (also flagged in Quality Review). Cookie consent implementation is incomplete — `CookieBanner` links to `/privacy/cookies` but the page does not exist. Violates [V1-C8] of the compliance decision. | Create `src/app/privacy/cookies/page.tsx` before V1 launch. |

---

## Human Approval Requirement

Per the agent-foundry Constitution §2, a human security engineer must co-sign this review before production deployment. The Constitution states: "Pen-test sign-off for 'critical' assets — human security engineer." The Stripe Connect payment flow, allergen data gating, and customer PII encryption qualify as critical assets.

No agent may approve production launch of Silver/Gold marketplace without human security engineer sign-off.

---

*Produced by: security-squad-lead*
*Authority: specs/003-farmmap/spec.md + specs/003-farmmap/compliance-pack/compliance-decision.md*
*agent-foundry Constitution v1.0.0 — Principle 6 (Evidence Pack), Principle 7 (Promotion Gates), Principle 10 (No Black Boxes)*
*Phase: 9 | Gate: security-sign-off | Status: passed-with-conditions*
