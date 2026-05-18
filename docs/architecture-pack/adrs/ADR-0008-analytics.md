---
adr: ADR-0008
title: Analytics — Server-Side Event Store + Plausible Analytics
status: accepted
date: 2026-05-17
feature: 003-farmmap
authority: specs/003-farmmap/spec.md (NFR Analytics section, F22) + specs/003-farmmap/compliance-pack/compliance-decision.md (V1-C8, V2-C8) + specs/003-farmmap/platform-pack/platform-decision.md
deciders:
  - architecture-squad-lead
  - platform-strategy-lead
---

# ADR-0008: Analytics — Server-Side Event Store + Plausible Analytics (Cookieless)

## Context

The spec defines a two-tier analytics requirement:
1. **Farm shop analytics dashboard (F22):** Page views, map pin impressions, enquiry counts, waitlist subscriber counts shown to shop owners. These must be derived from Farmmap's own event store — not from third-party analytics cookies — to be consent-independent and always accurate.
2. **Site-level traffic analytics:** For the commercial funnel (visitor → claim → Bronze → Silver). This requires an aggregate traffic tool.

Compliance constraints:
- [V1-C8]: Non-strictly-necessary cookies require PECR-compliant cookie consent.
- [V2-C8]: The Bronze analytics dashboard must present only aggregate data; no individually identifiable consumer data to shop operators.
- Platform pack confirms: server-side event store for listing analytics is independent of consent state.
- Plausible Analytics (EU-hosted, cookieless mode) confirmed as the default analytics tier 2.

## Decision

**Two-tier analytics architecture:**

**Tier 1 — Own server-side event store (`analytics_events` table):**
- All business-critical events written to the `analytics_events` table in Supabase by server-side handlers (Next.js API Routes or RSC).
- Events are written on the server; no client-side JavaScript required; no cookies set; consent-independent.
- Events stored: `listing_page_view`, `listing_pin_click`, `claim_cta_click`, `subscription_upgrade_initiated`, `subscription_upgrade_completed`, `waitlist_signup`, `review_submission`, `enquiry_form_submission`.
- Each event: `directory_id`, `event_type`, `listing_id` (nullable), `session_bucket` (first 8 chars of a hash of IP + User-Agent + day, rotated daily — pseudonymised, not a real user identifier, C0), `source` (organic|direct|social), `metadata` (jsonb, no PII).
- **No PII in analytics_events.** `session_bucket` is a coarse pseudonym that cannot re-identify an individual. Raw IPs are never stored. This satisfies [V2-C8].
- The farm shop analytics dashboard queries `analytics_events` filtered by `listing_id`; counts are aggregate.

**Tier 2 — Plausible Analytics (EU-hosted, cookieless mode):**
- Plausible's cookieless script loaded on all pages without consent gating (cookieless mode does not require PECR consent).
- Provides site-level traffic reporting (unique visitors, page views, sources, device types, top pages) for the commercial funnel.
- EU-hosted (Plausible is GDPR-compliant, EU-hosted on Hetzner in Germany). No cross-site tracking.
- If the owner/founder requires richer funnel data (GA4), this can be added as an optional category 2 cookie behind the consent gate. Not deployed at v1.

**No GA4 at v1.** Avoids GDPR consent complexity and the consent banner friction on the P1 impulse-discovery use case.

## Consequences

**Positive:**
- Farm shop page view counts shown to owners are accurate — not biased by whether the visitor accepted analytics cookies.
- Cookieless Plausible provides site-level analytics without any consent requirement, preserving the frictionless first-visit experience for P1/P2 consumers.
- The `analytics_events` table is queryable with standard SQL; no third-party analytics API dependency for the dashboard.
- Daily `session_bucket` rotation means no user can be tracked across days from the analytics data alone.

**Negative / Risks:**
- Plausible cookieless mode provides less granular data than GA4 (no user journey tracking, no funnel visualisation). Accepted trade-off for PECR compliance and frictionless first visit.
- The `analytics_events` table will grow to millions of rows over time. Requires a partitioning strategy (by month) and periodic archival. Addressed in Sprint 7 database maintenance tasks.
- `session_bucket` is a coarse pseudonym; it cannot distinguish between two visitors at the same IP on the same day. Page view counts may be slightly under-counted for shared connections (office, library). Acceptable for a v1 analytics dashboard.

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| Google Analytics 4 | Requires consent under PECR for all tracking. Consent banner friction degrades the P1 impulse-discovery use case. GA4's data processing in the US creates GDPR transfer concerns. Not deployed at v1. |
| Posthog (self-hosted) | Self-hosted Posthog adds infrastructure to maintain. Cloud Posthog is EU-hosted but adds a third-party dependency with per-event pricing. No advantage over Plausible + own event store for v1 requirements. |
| Fathom Analytics | Very similar to Plausible. Plausible was selected based on cost, open-source transparency, and UK/EU community familiarity. Either is a valid choice. |
| Third-party analytics platform for shop dashboards | Cannot be consent-independent. Shop owners would see under-counted data for visitors who declined analytics cookies. Own event store is the correct architecture for this requirement. |
