---
feature: 003-farmmap
phase: 7
gate: plan-sign-off
status: passed
produced_by: architecture-squad-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md
  + specs/003-farmmap/compliance-pack/compliance-decision.md
  + specs/003-farmmap/platform-pack/platform-decision.md
  + specs/003-farmmap/design-pack/information-architecture.md
  + specs/003-farmmap/design-pack/user-flows.md

stack-profile: nextjs-supabase-stripe
plan-complete: true
data-model-classified: true
openapi-complete: true
adr-count: 10

human-approval-required: true
human-approval-items:
  - Supabase project creation and PostGIS enablement on eu-west-2 (London) — required before Sprint 0 data migrations can run
  - Stripe account setup + Stripe Connect Standard configuration for test mode — required before Sprint 3 Bronze checkout build
  - Resend API key + domain verification for farmmap.co.uk — required before Sprint 2 claim email build
  - MapLibre/OSM tile service selection (MapTiler free tier vs Stadia Maps vs self-hosted) — required before Sprint 1 map build
  - Vercel project creation and domain configuration — required before Sprint 0 CI/CD

compliance-conditions-satisfied:
  - V1-C9 data residency confirmed — Supabase eu-west-2 (London) satisfies UK GDPR and EU GDPR (adequacy) simultaneously
  - V3-C10 Stripe Connect Standard confirmed — no fund-holding; shop is merchant of record throughout
  - V1-C5 OSM attribution — MapLibre attributionControl enabled; automated test in Sprint 7 (T-100)
  - V1-C10 accessible map plan — documented in ADR-0002 and Sprint 7 tasks T-104/T-105/T-106

compliance-conditions-deferred-to-launch:
  - V1-C1 dual privacy policy (human-authored legal document; build provides page at /privacy)
  - V1-C2 EU GDPR Article 27 representative (legal/administrative act; not a build task)
  - V1-C3 yourhonestybox.com written consent (human action; blocks 336 ROI seed listings from going live)
  - V1-C4 FRA data written confirmation (human action)
  - V2-C1 pre-contractual information on Bronze payment page (build task T-052)
  - V2-C2 DMCC 2024 auto-renewal notification (build task T-060)
  - V3-C1 allergen liability legal opinion (human/legal action; gates V3 launch)
  - V3-C11 PCI DSS SAQ-A (founder action; gates V3 launch)

spec-decisions-implemented:
  - Q1 multi-tenancy — shared database with directory_id + RLS (ADR-0003)
  - Q2 Sanity deferred — Supabase for all data at v1 (spec, no separate ADR required)
  - Q3 multi-manager from v1 — listing_managers join table with owner|manager roles (ADR-0004, data-model.md)
  - Q4 three admin roles — super_admin, directory_admin, content_moderator (ADR-0004)
  - Q5 Gold gating — silver_months_count >= 3 AND completed_order_count >= 50 (ADR-0005, data-model.md)
  - Q6 Silver downgrade end-of-period — cancel_at_period_end Stripe mechanism (ADR-0005)
  - Q7 idempotency — application-layer idempotency_key + database UNIQUE constraint (ADR-0005, data-model.md)
  - Q8 background jobs — Vercel Cron at v1; Inngest deferred to v2+ (plan.md)
  - Q9 stock reservation on checkout initiation — 15-minute hold, release on timeout (data-model.md, plan T-073)
  - Q10 auto-cancellation 24 hours — auto_cancel_at = now() + 24h (data-model.md, plan T-072)
  - Q11 reverse image search deferred — NSFW pre-screening only at v1 (plan T-088)

evidence-pack:
  adrs:
    - specs/003-farmmap/architecture-pack/adrs/ADR-0001-stack-selection.md
    - specs/003-farmmap/architecture-pack/adrs/ADR-0002-map-implementation.md
    - specs/003-farmmap/architecture-pack/adrs/ADR-0003-multi-tenancy.md
    - specs/003-farmmap/architecture-pack/adrs/ADR-0004-authentication.md
    - specs/003-farmmap/architecture-pack/adrs/ADR-0005-payments.md
    - specs/003-farmmap/architecture-pack/adrs/ADR-0006-postgis-geospatial.md
    - specs/003-farmmap/architecture-pack/adrs/ADR-0007-ssr-seo.md
    - specs/003-farmmap/architecture-pack/adrs/ADR-0008-analytics.md
    - specs/003-farmmap/architecture-pack/adrs/ADR-0009-email.md
    - specs/003-farmmap/architecture-pack/adrs/ADR-0010-file-storage.md
  data-model: specs/003-farmmap/architecture-pack/data-model.md
  openapi: specs/003-farmmap/architecture-pack/contracts/openapi.yaml
  plan: specs/003-farmmap/plan.md
  prior-gates:
    - specs/003-farmmap/compliance-pack/compliance-decision.md
    - specs/003-farmmap/platform-pack/platform-decision.md
    - specs/003-farmmap/design-pack/information-architecture.md
    - specs/003-farmmap/design-pack/user-flows.md
---

# Farmmap — Architecture Decision

## Gate: Architecture Phase (Phase 7)

**STATUS: PASSED**

The architecture phase for Farmmap is complete. All required artefacts have been produced:

- 10 ADRs covering all major technology decisions
- Complete data model with C0–C8 classification on every field
- OpenAPI 3.1 contract covering all 16 Must-Have features (F1–F16) and all Should-Have features requiring API surface (F17–F24)
- 8-sprint build plan with 113 task IDs linked to features and ADRs
- Compliance conditions from the compliance pack have been addressed in the architecture where possible; deferred conditions are documented with the correct gate

**Human approval is required** on the five items listed above (Supabase, Stripe, Resend, MapLibre tile service, Vercel) before the corresponding sprint build tasks can begin. These are infrastructure provisioning decisions, not architecture decisions — the architecture itself does not change based on which MapLibre tile provider is chosen.

**Architecture and build may proceed immediately** on all Sprint 0 tasks that do not require live service credentials. T-002 (Next.js project initialisation), T-003 (GitHub Actions CI), T-009 (middleware scaffold), and T-010 (Vercel project setup) can begin before Supabase and Stripe are provisioned.

## Stack Confirmed

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 14+ App Router, TypeScript strict, Tailwind CSS, shadcn/ui |
| Database | Supabase PostgreSQL + PostGIS, eu-west-2 (London) |
| Auth | Supabase Auth (email/password, magic link) |
| Storage | Supabase Storage (listing-photos, product-photos buckets) |
| Hosting | Vercel (Next.js optimised, edge middleware) |
| Map | MapLibre GL JS + OpenStreetMap vector tiles (provider TBC) |
| Payments | Stripe Billing + Stripe Connect Standard |
| Email | Resend + React Email templates |
| Analytics | Server-side analytics_events table + Plausible (cookieless) |
| Error monitoring | Sentry + Better Stack (Logtail) |
| CMS | Deferred (Supabase for all data at v1) |

---

*Produced by: architecture-squad-lead*
*Authority: Full evidence pack listed above*
*Phase: 7 | Gate: plan-sign-off | Status: passed*
*Agent-foundry Constitution v1.0.0 — Principle 6 (Evidence Pack), Principle 7 (Promotion Gates)*
