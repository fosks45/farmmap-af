---
adr: ADR-0004
title: Authentication — Supabase Auth + listing_managers Join Table
status: accepted
date: 2026-05-17
feature: 003-farmmap
authority: specs/003-farmmap/spec.md (F16, Q3 sign-off) + specs/003-farmmap/compliance-pack/compliance-decision.md
deciders:
  - architecture-squad-lead
---

# ADR-0004: Authentication — Supabase Auth + listing_managers Join Table

## Context

The spec (F16) defines four account types: anonymous, consumer, owner, and admin. The spec sign-off decision (Q3, 2026-05-16) confirmed **multi-manager from v1**: a listing can have one owner and multiple managers. The compliance pack requires consent records per GDPR/DPC.

Key requirements:
- Multi-manager: `listing_managers` join table with `role: owner|manager` from day one.
- Owner role: full access including billing, subscription management, ownership transfer.
- Manager role: can edit listing content and manage orders; cannot change billing, transfer ownership, or change other managers.
- Consent records stored in `account_consents` table.
- Session tokens for owner/admin accounts expire after 8 hours of inactivity (spec NFR).
- Consumer accounts: 30-day idle session expiry.
- Social login deferred; email/password and magic link from v1.
- Admin impersonation must be logged immutably (F11 requirement).

## Decision

**Supabase Auth for all authentication, extended with a `listing_managers` join table and `account_consents` table. Role-based access enforced via JWT custom claims and RLS policies.**

Architecture:

1. **Supabase Auth** handles email/password, magic link, and (deferred) social login. JWT tokens include custom claims: `directory_id`, `account_type` (consumer|owner|admin), `admin_role` (null|directory_admin|super_admin|content_moderator).

2. **`listing_managers` join table** (listing_id, user_id, role: owner|manager, invited_by, accepted_at). The owner role is created when a listing is claimed (F3); subsequent rows are added via the manager invitation flow. RLS policy on listing_managers:
   - `owner` may read all managers for their listings.
   - `owner` may insert/delete manager rows for their listings.
   - `manager` may read other managers for their listings (to see the team) but not insert/delete.
   - `admin` may read and modify all rows.

3. **Permission checks** on all listing-level API operations:
   - Content operations (edit listing, upload photos, manage orders): allowed if `listing_managers` row exists with `accepted_at IS NOT NULL`.
   - Billing operations (subscription changes, bank details): allowed only if `role = 'owner'`.
   - Ownership transfer: allowed only if `role = 'owner'`; creates a new owner row and removes the old one atomically.

4. **`account_consents` table** records: `consent_type` (cookie_analytics|marketing|terms_v1|waitlist_notification), `given_at`, `ip_hash` (HMAC-SHA256 of IP, C3), `mechanism` (banner_accept_all|banner_custom|claim_flow|checkout), `withdrawn_at`. This satisfies GDPR Article 7 consent records requirement.

5. **Session expiry**: Supabase Auth's `auth.sessions` table has a configurable expiry. Owner and admin sessions use an 8-hour JWT TTL with no refresh after that. Consumer sessions use a 30-day TTL. Implemented via Supabase Auth's `jwt_expiry` setting and Next.js middleware token validation.

6. **Admin impersonation**: Implemented as a custom endpoint that mints a short-lived (1-hour) JWT with the impersonated user's claims plus an `impersonated_by` claim. Every request made with this token is logged in `audit_log` with `action: impersonation_event`. The impersonation log is INSERT-only; no update or delete allowed.

## Consequences

**Positive:**
- `listing_managers` join table satisfies the spec Q3 decision precisely, without over-engineering a custom RBAC system.
- Supabase Auth's built-in email verification, magic link, and password reset flows eliminate custom authentication code.
- JWT custom claims allow RLS policies to use `auth.jwt()` to resolve directory_id and role without an additional database lookup per request.
- Consent records table satisfies both UK GDPR and EU GDPR (DPC) Article 7 requirements with no third-party consent platform dependency.

**Negative / Risks:**
- Custom JWT claims require a Supabase Auth Hook (database webhook) to inject `directory_id` and `account_type` at token mint time. This is a supported pattern but adds one setup step.
- Manager invitation emails (sent by Resend) include a magic link with an invitation token. The token must be single-use and expire in 48 hours. Implemented as a row in a `manager_invitations` table, not a Supabase Auth invite (which has different semantics).

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| Custom JWT auth (Fastify + jsonwebtoken) | Eliminates Supabase Auth's built-in flows (email verification, password reset, magic link). Adds significant custom code surface. No benefit over Supabase Auth at v1. |
| Clerk | Excellent auth product but adds a third-party identity provider dependency. Supabase Auth is bundled with the existing Supabase subscription. Also: Clerk's per-MAU pricing adds cost at scale. |
| NextAuth.js (Auth.js) | Viable but not as tightly integrated with Supabase RLS. Would require custom Supabase adapter and session synchronisation. Supabase Auth is the correct choice for a Supabase-native stack. |
| Separate admin auth system | Unnecessary complexity. The `admin_role` JWT claim is sufficient to scope admin access. All auth flows are unified. |
