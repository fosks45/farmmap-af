---
adr: ADR-0003
title: Multi-Tenancy — Shared Supabase Database with directory_id + RLS
status: accepted
date: 2026-05-17
feature: 003-farmmap
authority: specs/003-farmmap/spec.md (F14) + spec.md (Q1 sign-off)
deciders:
  - architecture-squad-lead
---

# ADR-0003: Multi-Tenancy — Shared Supabase Database with directory_id Column + RLS

## Context

The spec requires a multi-tenant architecture from day one (F14). Farmmap is the first directory; TractorMap, BerthMap, and CampingMap are planned future verticals on the same engine. The spec Q1 decision (confirmed at sign-off 2026-05-16) chose shared database with directory_id scoping over separate projects per directory.

Requirements:
- Every data entity carries a `directory_id` UUID.
- Queries without a directory_id filter must return zero results by default.
- Admin console is directory-scoped; cross-directory access requires `super_admin` role.
- Host domain → directory_id resolution must be deterministic with no cross-directory data leakage.
- Directory configuration (listing types, product categories, pin styles, brand colours) must be editable by super_admin without a code deployment.
- The architecture must not serve Farmmap data to a TractorMap visitor under any circumstances.

## Decision

**Shared Supabase PostgreSQL database with `directory_id UUID NOT NULL` on all tenant-scoped tables, enforced by Row Level Security (RLS) policies. Host domain resolution via a `directories` configuration table. Supabase's `SET LOCAL app.current_directory_id` session variable pattern for RLS context.**

Architecture:

1. **`directories` table** maps `domain` (text) → `directory_id` (uuid). Seeded at setup. Editable by super_admin via admin console.

2. **Middleware (Next.js `middleware.ts`)** reads the `Host` header on every request, resolves it to a `directory_id` via the `directories` table (cached with a 5-minute TTL in Vercel Edge Config or equivalent), and sets `x-directory-id` in the request context.

3. **All API Route Handlers** extract `directory_id` from the request context and pass it to Supabase queries as an explicit filter AND as a session variable:
   ```sql
   SET LOCAL app.current_directory_id = '[directory_id]';
   ```

4. **RLS policies** on every tenant-scoped table:
   ```sql
   CREATE POLICY "directory_isolation"
   ON listings
   USING (directory_id = current_setting('app.current_directory_id')::uuid);
   ```
   This ensures that even if the application layer fails to filter by directory_id, the database will not return cross-directory data.

5. **Admin console** receives the directory_id from the authenticated admin's JWT claims (`directory_id` claim). `super_admin` role receives the directory_id from an explicit UI selection, not from the host header.

6. **Directory configuration** is stored in the `directories` table as JSONB columns (`listing_types`, `product_categories`, `pin_styles`, `brand_config`). Super_admin edits via the admin console without a deployment.

## Consequences

**Positive:**
- Single Supabase project, single connection string, single backup configuration, single monitoring endpoint — correct operational posture for a solo founder.
- RLS at the database layer is a defence-in-depth second layer; even a bug in the application layer cannot leak cross-directory data.
- Directory configuration via JSONB config table means adding TractorMap requires only: a new row in `directories`, DNS configuration, and a Vercel domain alias — no code deployment.
- Standard Supabase RLS multi-tenancy pattern with extensive community documentation.

**Negative / Risks:**
- RLS adds a small query overhead on every database access. At Farmmap v1 query volumes, this overhead is negligible (<1ms per query).
- `SET LOCAL app.current_directory_id` must be called before every RLS-protected query in the same database session. Connection pooling (via Supabase's built-in PgBouncer) resets session variables between connections in transaction mode — all queries must explicitly set the variable within the transaction. This is a known pattern with documented mitigation.
- If a future directory requires a different data residency region (e.g., a US directory), a separate Supabase project would be required. This is not a near-term concern for UK/ROI directories.

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| Separate Supabase project per directory | Multiplies: connection strings, backup configs, monitoring, RLS policy maintenance, and storage buckets. No architectural benefit at current scale. Explicitly rejected in spec Q1 sign-off. |
| Schema-per-tenant (separate PostgreSQL schema per directory) | More complex migration management; Supabase does not natively support schema-per-tenant auth. Adds complexity without meaningful benefit over RLS. |
| Application-layer-only directory scoping (no RLS) | Violates defence-in-depth principle. A single application bug could leak cross-directory data. RLS is the correct second layer. |
