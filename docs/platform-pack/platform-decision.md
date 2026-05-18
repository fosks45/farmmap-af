---
feature: 003-farmmap
spec_id: 003-farmmap-v1
phase: 5
gate: platform-strategy
status: passed
produced_by: platform-strategy-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md + specs/003-farmmap/personas-pack/personas.md + specs/003-farmmap/compliance-pack/compliance-decision.md
feeds: specs/003-farmmap/architecture-pack/ + specs/003-farmmap/design-pack/
platforms-confirmed:
  - responsive-web
  - pwa
human-approval-required: false
---

# Farmmap — Platform Decision

## Gate: Platform Strategy Phase (Phase 5)

**STATUS: PASSED**

Farmmap may proceed to architecture with the platform constraints, performance budgets, i18n scope, SEO requirements, analytics strategy, and cookie/policy requirements documented in this pack. No conditions in this assessment prevent the architecture phase from commencing.

---

## Platform Summary

| Dimension | Decision |
|---|---|
| Platform | Responsive web application |
| Native apps | Not at v1 — explicitly out of scope per spec |
| PWA | Install prompt for returning users; offline not required at v1 |
| Device target | Mobile web primary (65%), tablet web (20%), desktop web (15%) |
| Rendering | Server-side rendering mandatory for all SEO surfaces |
| Language primary | en-GB |
| Language secondary | en-IE (locale adaptation: address format, currency, phone) |
| Welsh | Deferred to v2 |
| Analytics tier 1 | Server-side event store (consent-free, always-on) |
| Analytics tier 2 | Plausible Analytics cookieless (consent-free in cookieless mode) |
| Cookie consent required | Yes — for any non-strictly-necessary cookies |
| Core Web Vitals gate | Hard build gate before v1 launch (LCP < 2.5s, INP < 200ms, CLS < 0.1) |

---

## Rationale

**Responsive web over native app:** The spec explicitly excludes native iOS/Android apps from v1–v3 scope. All six personas are reachable through the mobile web. P1 (Sarah, iPhone) and P2 (Marcus, Android) represent the two dominant mobile OS environments; both are served identically by a responsive web application without App Store/Play Store distribution friction.

**PWA install prompt:** Regular consumers (P1, P2) who visit Farmmap repeatedly benefit from a home-screen shortcut and faster repeat loads from the app shell. The install prompt is shown after a second visit and does not disrupt the impulse-discovery use case that defines first visits. Offline is explicitly not required at v1 — the map data model is inherently online.

**Server-side rendering as non-negotiable:** The 100,000 monthly visitor traffic target depends entirely on organic search. The interactive map is not indexable. SSR listing and county pages are the primary SEO surface. This is both a product requirement and a compliance requirement (the spec states non-map HTML fallback is mandatory).

**Plausible Analytics as default:** The PECR assessment (compliance-pack/pecr-assessment.md) recommends cookieless analytics for anonymous browsing to eliminate consent banner friction on the P1 impulse-discovery use case. Plausible in cookieless mode satisfies this requirement and is EU-hosted.

---

## Downstream Constraints for Architecture

The following constraints from this platform pack are hard constraints for the architecture team:

1. All listing detail pages and county pages must be server-rendered (not client-rendered)
2. JS bundle must not block map rendering — progressive enhancement required
3. Map tile API must achieve p95 < 1,500ms from UK and Ireland edge locations
4. All four listing types must have visually distinguishable pins at all non-clustered zoom levels
5. Cookie consent implementation must meet DPC standards (stricter of ICO/DPC)
6. Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1) are a hard launch gate measured in production
7. Server-side event store for listing analytics is independent of consent state
8. Data residency: UK user data within UK; ROI user data within EU

---

*Produced by: platform-strategy-lead*
*Authority: specs/003-farmmap/spec.md + personas-pack + compliance-pack*
*Phase: 5 | Gate: platform-strategy | Status: passed*
*Agent-foundry Constitution v1.0.0 — Principle 6 (Evidence Pack), Principle 7 (Promotion Gates)*
