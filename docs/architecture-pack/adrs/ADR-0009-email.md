---
adr: ADR-0009
title: Transactional Email — Resend + React Email
status: accepted
date: 2026-05-17
feature: 003-farmmap
authority: specs/003-farmmap/spec.md (F3, F6, F7, F8) + specs/003-farmmap/compliance-pack/compliance-decision.md (V2-C4, V3-C12)
deciders:
  - architecture-squad-lead
---

# ADR-0009: Transactional Email — Resend + React Email Templates

## Context

Farmmap requires transactional email for:
- Listing claim verification (F3)
- Manager invitation emails (F16 multi-manager)
- Subscription receipts, upgrade/downgrade/cancellation confirmations (F7, F8, F9, F10)
- Order confirmation and status notifications (F8)
- Ordering waitlist confirmation and Silver activation notification (F6)
- Photo moderation rejection notifications (F11)
- Review moderation notifications (F5)
- Payment failure and grace period warnings (F7)

Compliance constraints:
- [V2-C4]: Marketing opt-in must be explicit and separate from transactional email.
- [V3-C12]: Newsletter/Gold marketing email requires a separate compliant consent mechanism.
- Transactional email must not be used for marketing without explicit opt-in (PECR Regulation 22).

## Decision

**Resend for all transactional email. React Email for type-safe template authoring. Marketing/newsletter email via a separate tool (Mailchimp or Brevo) that is never connected to the Resend transactional sending account.**

Architecture:
- Resend SDK (`resend` npm package) used in Next.js API Route Handlers and Supabase Edge Functions.
- React Email templates compiled to HTML at build time; templates are type-safe TypeScript components.
- From address: `hello@farmmap.co.uk` for transactional; domain verified with DKIM/SPF via Resend's DNS setup.
- Email categories clearly segmented in code: transactional (always sent, no consent check), marketing (only sent with recorded consent in `account_consents`).
- Resend free tier: 100 emails/day, 3,000/month. Sufficient for v1 at launch volume. Pro tier ($20/month for 50,000 emails) when volume grows.
- Resend's EU data centre used if available; otherwise US with EU adequacy decision in place.

Transactional email types implemented:
1. `claim-verify` — claim verification link
2. `manager-invite` — manager invitation with acceptance link
3. `subscription-receipt` — monthly invoice confirmation
4. `subscription-grace-day1` / `subscription-grace-day5` — payment failure warnings
5. `subscription-suspended` — suspension notification
6. `subscription-confirmation` — upgrade/downgrade/cancellation confirmation
7. `order-confirmation` (consumer) — order placed confirmation with details
8. `order-status-update` (consumer) — on each status transition
9. `new-order` (owner) — new order notification
10. `auto-cancel` (consumer) — 24-hour auto-cancellation with refund confirmation
11. `waitlist-confirm` — ordering waitlist confirmation with unsubscribe link
12. `waitlist-notify` — Silver activation notification to waitlist subscribers
13. `photo-rejected` — photo moderation rejection with reason
14. `review-rejected` — review moderation rejection with reason
15. `review-published` — review published confirmation to reviewer
16. `downgrade-reminder` — 7-day pre-downgrade notification

Marketing email (NOT via Resend):
- Bronze campaign add-ons (F23), Gold newsletter features — managed manually by editorial team via Mailchimp or Brevo.
- Consumer newsletter opt-in mechanism connects to Mailchimp/Brevo list, not to Resend.

## Consequences

**Positive:**
- Resend's React Email integration provides type-safe templates with full TypeScript IDE support — no string-based HTML templates.
- Clear separation of transactional and marketing sending accounts eliminates the risk of transactional email being used for marketing (a PECR violation).
- Resend's free tier is sufficient for v1 launch volume.

**Negative / Risks:**
- Resend is a newer provider; deliverability reputation is building. If deliverability issues emerge, migration to SendGrid or Postmark is straightforward as the abstraction is in React Email.
- The waitlist activation email (when a listing upgrades to Silver) may require bulk sending to hundreds of subscribers simultaneously. Resend's bulk API handles this, but the implementation must use batch sending with rate limiting, not individual API calls in a loop.

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| SendGrid | Higher cost at scale; more complex API. No meaningful technical advantage over Resend for this use case. |
| Postmark | Excellent deliverability; slightly more expensive than Resend. Valid alternative if Resend deliverability is problematic. |
| AWS SES | Low cost per email but requires more infrastructure setup (bounce/complaint handling, suppression lists). Operational overhead not justified at v1. |
| Supabase Auth email | Supabase Auth handles magic link and password reset emails; custom emails (order notifications, waitlist) require a dedicated email provider. Both are used in combination. |
