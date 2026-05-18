---
feature: 003-farmmap
phase: 6
gate: design-sign-off
status: passed
human-approval-required: false
produced_by: ux-design-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md
  + specs/003-farmmap/personas-pack/personas.md
  + specs/003-farmmap/platform-pack/
  + specs/003-farmmap/compliance-pack/compliance-decision.md
evidence-pack-references:
  - specs/003-farmmap/design-pack/information-architecture.md
  - specs/003-farmmap/design-pack/user-flows.md
  - specs/003-farmmap/design-pack/wireframes/map-and-discovery.md
  - specs/003-farmmap/design-pack/wireframes/listing-claim.md
  - specs/003-farmmap/design-pack/wireframes/owner-dashboard.md
  - specs/003-farmmap/design-pack/wireframes/subscription-upgrade.md
  - specs/003-farmmap/design-pack/wireframes/review-and-waitlist.md
  - specs/003-farmmap/design-pack/wireframes/admin-console.md
  - specs/003-farmmap/design-pack/design-tokens.md
  - specs/003-farmmap/design-pack/accessibility-audit.md
feeds: specs/003-farmmap/architecture-pack/
---

# Farmmap — Design Decision

## Gate: UX Design Phase (Phase 6)

**STATUS: PASSED**

The UX design pack is complete. The information architecture, user flows, wireframes,
design tokens, and accessibility audit are internally consistent with the product
specification, persona requirements, platform strategy, and compliance conditions.

---

## Design Summary

### Platform

- Responsive web application; PWA with install prompt
- WCAG conformance: AA (WCAG 2.2)
- Primary locale: en-GB; secondary: en-IE

### Information Architecture

- 5-tab navigation (mobile bottom bar / desktop top nav)
- 41 named screens across consumer, owner, and admin surfaces
- Maximum 2 taps from home to any high-frequency job
- SEO hierarchy: Home → Country → County → Listing (matches URL structure)

### User Flows

10 complete flows documented:
1. Impulse discovery (consumer)
2. Listing claim (owner)
3. Bronze upgrade (owner)
4. Review submission (consumer)
5. Admin moderation (admin)
6. Ordering waitlist signup (consumer)
7. Silver ordering flow (consumer)
8. Admin photo moderation (admin)
9. Cooperative bulk claim (P6 — admin-assisted V1 path)
10. Cookie consent interaction (all visitors)

### Wireframes

6 wireframe files covering all primary screens:
- Map and discovery (map home, pin states, listing detail farm shop, listing detail
  honesty box)
- Listing claim (3-step flow including manager addition)
- Owner dashboard (home, edit, subscription tab, upgrade prompts)
- Subscription upgrade (Bronze pricing + payment + confirmation; Silver consent +
  delivery; Gold eligibility gate with both locked and eligible states)
- Review and waitlist (review modal, review display, waitlist widget)
- Admin console (queue home, listing review, photo bulk moderation, reported content)

### Design Tokens

Complete semantic token set including:
- Brand colours (deep green / slate blue) with WCAG contrast verification
- Map pin colours (5 tier states + 4 listing types; all with colour + shape/icon)
- Status colours (success/warning/error/info) with light/text pairs
- Typography (system UI stack; rem sizes; WCAG 1.4.4 compliant)
- Spacing (4px base unit; 0–80px scale)
- Motion (150ms / 300ms; `prefers-reduced-motion` respected throughout)
- Z-index scale

### Accessibility

All WCAG 2.2 AA issues identified in the design review are resolved at the design
phase, not deferred to build. Key resolutions:

- Map interface: accessible off-screen list view as v1 keyboard/screen reader
  compliance mechanism (WCAG 2.1.1)
- All pins: colour + shape/icon distinction (WCAG 1.4.1)
- All form inputs: `<label>` elements, `autocomplete` attributes, `aria-describedby`
  on errors (WCAG F1, F2, 1.3.5)
- Review modal: native `<dialog>` / focus trap implementation (WCAG 2.1.2, K3)
- Cookie banner: focus management on appearance; Escape to dismiss (WCAG 2.4.3, 2.1.2)
- Skip links on all pages (WCAG 2.4.1)
- Star rating: accessible radio group pattern (WCAG V2-C9 compliance condition)
- `lang="en-GB"` / `lang="en-IE"` on HTML element (WCAG 3.1.1)

---

## Constraints for Architecture Phase

The following design decisions are hard constraints for the architecture team:

1. All SEO-bearing pages (listing detail, county, country, listing-type) must be
   server-rendered; client-side hydration is permitted but not a substitute for SSR
2. The map pin payload must be a single GeoJSON API call (not N per-pin requests);
   maximum 150kB gzipped for 953 pins
3. The off-screen accessible listing list must be dynamically updated on map pan
   via a `aria-live="polite"` region; this requires a server-side or edge-computed
   "listings in viewport" API endpoint
4. The owner dashboard analytics (F22) must be derived from the server-side event
   store, not from third-party analytics cookies
5. Cookie consent state (`fm_consent` cookie) must be read server-side on first
   render to suppress analytics scripts before the page loads — cannot be a
   client-side check
6. All design token values must be implemented as CSS custom properties (`--token-name`)
   to enable theming for future portfolio directories (TractorMap, BerthMap) without
   component code changes

---

*Produced by: ux-design-lead | squad: ux-design*
*Authority: specs/003-farmmap/spec.md + all design-pack documents listed above*
*Phase: 6 | Gate: design-sign-off | Status: passed*
*Agent-foundry Constitution v1.0.0 — Principle 6 (Evidence Pack), Principle 7 (Promotion Gates)*
*Feeds: specs/003-farmmap/architecture-pack/*
