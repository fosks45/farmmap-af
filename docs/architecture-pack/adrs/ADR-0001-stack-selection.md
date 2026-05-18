---
adr: ADR-0001
title: Stack Selection — Next.js + Supabase
status: accepted
date: 2026-05-17
feature: 003-farmmap
authority: specs/003-farmmap/spec.md + specs/003-farmmap/compliance-pack/compliance-decision.md + specs/003-farmmap/platform-pack/platform-decision.md
deciders:
  - architecture-squad-lead
  - platform-strategy-lead
---

# ADR-0001: Stack Selection — Next.js App Router + Supabase

## Context

The spec defines a map-first, mobile-first directory covering UK and Republic of Ireland farm shops and honesty boxes. The following constraints shape the stack decision:

- **SSR mandatory for SEO:** The 100,000 monthly visitor target depends on organic search. All listing detail, county, and region pages must be server-rendered with JSON-LD structured data and full meta tags. The interactive map is not indexable; SSR listing pages are the primary SEO surface.
- **PWA required:** Platform pack confirms PWA install prompt for returning users. No native app at v1–v3.
- **Data residency:** Compliance pack [V1-C9] requires UK user data stored within the UK; ROI user data within the EU. Both must be satisfied simultaneously.
- **PostGIS required:** 953+ listings with geospatial search ("near me", radius queries, Eircode geocoding) demand a spatial database extension.
- **Solo founder context:** Operational simplicity is a real constraint. Minimising the number of managed services reduces the risk of operational failure.
- **Multi-tenancy:** directory_id scoping from day one for TractorMap/BerthMap future verticals.

## Decision

**Next.js 14+ App Router (TypeScript) + Supabase (PostgreSQL + PostGIS + Auth + Storage + Edge Functions) on Supabase's eu-west-2 (London) region.**

- Next.js App Router provides React Server Components for SSR listing pages, Client Components for the interactive map, and API Route Handlers for webhook endpoints. TypeScript throughout.
- Tailwind CSS + shadcn/ui for the component system, providing accessible, unstyled primitives that satisfy WCAG 2.2 AA requirements.
- Supabase on eu-west-2 (London) satisfies UK data residency for UK user data. ROI user personal data (C3) is stored in the same Supabase project; eu-west-2 qualifies as EU-adequate storage under EU GDPR Article 45 adequacy framework — confirmed by compliance pack [V1-C9].
- PostGIS extension enabled on Supabase PostgreSQL from Sprint 0. Spatial queries handle all radius-based and "near me" features.
- Supabase Auth handles all authentication (email/password, magic link). Row Level Security (RLS) policies enforce multi-tenancy and access control at the database layer.
- Supabase Storage handles all user-uploaded photos with CDN delivery.
- Vercel for hosting (Next.js optimised; edge functions available for middleware).

## Consequences

**Positive:**
- Single platform (Supabase) for database, auth, storage, and real-time — dramatically reduces operational surface for a solo founder.
- Next.js App Router's React Server Components deliver SSR without a separate API server, meeting the platform pack's constraint that JS must not block SSR rendering.
- London region satisfies both UK data residency and EU-adequate hosting simultaneously.
- Supabase RLS is the industry-standard mechanism for multi-tenant database access control without application-layer overhead.
- Vercel's CDN provides sub-200ms edge delivery for SSR pages globally, meeting the Core Web Vitals gate (LCP < 2.5s).

**Negative / Risks:**
- Supabase free tier has row-count and connection limits; a dedicated project is required at scale. This is a known cost model decision, not an architectural constraint.
- Next.js App Router RSC mental model is newer than Pages Router; developers must be proficient. Mitigated by TypeScript strict mode and extensive test coverage.
- Vercel deployment lock-in; migration to other hosting is possible but non-trivial at v3+. Accepted for v1–v3.

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| Separate Fastify/Node API + Supabase | Adds an API server to maintain, deploy, and monitor separately. No architectural benefit at v1 scale. Increases operational complexity for a solo founder. |
| PlanetScale (MySQL) | No PostGIS support. Spatial queries would require application-layer distance calculation, losing spatial indexing. Rejected on technical grounds. |
| Railway-hosted Postgres + PostGIS | Viable but adds a second infrastructure provider with separate billing, monitoring, and incident response. Supabase bundles auth + storage + realtime that would need separate services on Railway. |
| AWS RDS (London) + Vercel | Satisfies data residency but requires VPC configuration, IAM, connection pooling setup. Substantially higher ops burden for no v1 benefit. |
| Remix + Supabase | Remix RSC story is less mature than Next.js 14 App Router at decision date. Next.js has broader community support and more established Supabase integration patterns. |
