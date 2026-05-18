---
feature: 003-farmmap
phase: 3
gate: requirements-sign-off
status: passed
human-approval-required: true
spec-md-created: true
open-questions-count: 11
recommendations-provided: true
produced_by: personas-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/viability-gate.md + specs/003-farmmap/personas-pack/personas.md + specs/003-farmmap/personas-pack/jtbd-map.md
feeds: specs/003-farmmap/spec.md + specs/003-farmmap/architecture-pack/ + specs/003-farmmap/compliance-pack/
---

# Farmmap — Requirements Sign-Off Decision

## Phase 3 Gate: PASSED (pending human approval)

The personas and requirements phase is complete. All deliverables have been produced
and are coherent with the evidence assembled in Phases 1 and 2. The gate passes on
substance; human approval is required before the architecture phase begins, per the
Constitution's Human-in-the-Loop Gates (§2).

---

## What Was Produced in This Phase

| Deliverable | File | Status |
|---|---|---|
| Canonical personas (6) | personas-pack/personas.md | Complete |
| JTBD map (9 jobs, Christensen format) | personas-pack/jtbd-map.md | Complete |
| Requirements sign-off decision | personas-pack/requirements-decision.md | This document |
| Product specification | spec.md | Complete |

---

## Key Decisions Made in This Phase

### Features Added to Spec (Not in Original Intake)

Two features were added to the Must-Have list based on explicit conditions in
`viability-gate.md` and gaps identified in `discovery-pack/problem-solution-fit.md`.
These are not scope additions; they are corrections to the intake's omissions.

**F5 — Consumer Reviews and Ratings**
Added because J2 (pre-trip planning) and J3 (trust verification) remain permanently
partial without a native social-proof layer. The viability-gate.md condition is
explicit: "Design for V2 Bronze. Consumer review and ratings system absence leaves
J2 and J3 permanently dependent on Google Maps and TripAdvisor." The feature has
been scoped to the minimum viable implementation: star rating + text review +
moderation queue + owner response. It does not include social login, gamification,
or verified purchase signals at v1.

**F6 — Ordering Waitlist / Demand Capture**
Added because the viability-gate.md condition names this as the "lowest-cost,
highest-return item in the entire conditions list." The mechanism is a single email
capture field on listing detail pages. It collects J4/J6 ordering intent that
would otherwise route to competitors or the farm shop's direct website during the
12+ months before V3 is live. Engineering cost is negligible; V3 conversion value
is material.

### Features Removed from Scope (Were in Intake, Not in Spec)

The intake listed Sanity for editorial content. This spec recommends deferring
Sanity entirely for v1, per the open question recommendation (item 2). This is
an architecture-phase decision and is flagged rather than resolved in this spec —
the spec is technology-free and does not reference Sanity. The architecture squad
should confirm the editorial content approach in the architecture pack.

### Viability-Gate Conditions Addressed in Spec

All eight conditions from viability-gate.md are reflected in the spec:

| Condition | Status in Spec |
|---|---|
| yourhonestybox-consent | F15 (RoI support) and open question 1 recommendation note consent basis |
| fra-relationship | Named in non-functional commercial context; architecture-phase action |
| demand-capture | F6 added as Must-Have |
| reviews-layer | F5 added as Must-Have |
| poc-before-engine | Gate condition stated in F14 (multi-tenant engine) |
| gold-commission-cap | Named in F9 commission risk note; recommendation for V3 commercial model |
| natasha-law-allergens | F8 and F13 include mandatory allergen fields for all purchasable products |
| seo-content-programme | Named in non-functional requirements and open question context |

---

## Open Questions: Status and Recommendations

All 11 open questions from the intake are addressed in spec.md with a recommended
answer and rationale. They are reproduced here for the human approver's review.

Human approval is required on items 3, 5, and 6 specifically — these have commercial
and product implications that require founder decision before architecture begins.

| # | Question | Recommendation | Human Approval Required? |
|---|---|---|---|
| 1 | Multi-tenancy: shared DB vs separate project per directory | Shared DB with directory_id — operational overhead of separate projects is unjustified at current scale | No (architectural; architecture squad to confirm) |
| 2 | Sanity scope | Defer Sanity for v1; markdown-based editorial solution | No (architectural; architecture squad to confirm) |
| 3 | Multiple managers per shop | Single owner at v1; multi-manager deferred to v2 | **Yes — affects B2B/cooperative use case timing** |
| 4 | Admin vs moderator role split | Three roles: super_admin, directory_admin, content_moderator | No (operational; Alex Kim to confirm) |
| 5 | Gold tier gating | Open to any Silver subscriber — 3-month + 50-order gate is an unnecessary delay to revenue | **Yes — commercial model decision** |
| 6 | Silver → Bronze downgrade billing | End-of-period; immediate downgrade creates refund complexity | **Yes — legal and financial** |
| 7 | Idempotency pattern | Application-layer idempotency keys + database uniqueness constraints as secondary defence | No (architectural) |
| 8 | Background job runner | Vercel Cron + serverless for POC; Inngest for production at scale | No (architectural) |
| 9 | Stock race condition | Reservation on checkout initiation; 15-minute timeout; release on payment failure | No (architectural) |
| 10 | Auto-cancellation window | 24 hours for unaccepted orders | No (operational) |
| 11 | Reverse image search | Defer automated reverse image search for v1; admin manual review + basic NSFW classifier | No (operational) |

---

## What Human Approval Covers

Human approval of this gate attests to the following:

1. The six personas are an accurate and sufficient representation of Farmmap's user
   base for v1–v3 planning purposes.
2. The nine jobs-to-be-done are correctly prioritised — no critical job has been
   omitted and no non-job has been included.
3. The Must-Have features (F1–F16) are the correct minimum set for V1/V2/V3.
4. The two features added beyond the intake (F5 reviews, F6 waitlist) are accepted
   as Must-Have rather than Should-Have.
5. The open questions marked "Human Approval Required?" above are confirmed by the
   founder before architecture begins.
6. The spec.md is approved as the authoritative product specification against which
   all subsequent architecture, build, and QA work will be evaluated.

---

## Next Phase

Following human approval of this gate, the following packs may proceed in parallel:

- **Architecture pack** — consumes spec.md and personas; produces data model, API
  contracts, infra diagram, and architecture decision records
- **Compliance pack** — consumes spec.md; produces GDPR/DPC assessment, allergen
  compliance analysis, Consumer Contracts Regulations review, and data classification
  tagging for all entities

The Build queue must not be populated until both the architecture pack and the
compliance pack have passed their respective gates.

---

*Produced by: personas-squad-lead | squad: personas-and-requirements*
*Gate: requirements-sign-off | Status: PASSED (pending human approval)*
*Authority: viability-gate.md + personas.md + jtbd-map.md + spec.md*
