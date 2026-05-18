---
feature: 003-farmmap
phase: 4
document: accessibility-compliance-assessment
specialist: accessibility-compliance-specialist
produced_by: compliance-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md + .claude/rules/a11y.md
regimes:
  - WCAG 2.2 AA
  - European Accessibility Act 2025 (EAA / EN 301 549)
  - Public Sector Bodies (Websites and Mobile Applications) Accessibility Regulations 2018 (UK)
status: conditions-required
---

# Accessibility Compliance Assessment — Farmmap

## 1. Applicable Standards and Legal Context

**WCAG 2.2 AA** is the authoritative standard per the spec (Non-Functional Requirements — Accessibility) and the `.claude/rules/a11y.md` file. The spec states: "WCAG 2.2 AA for all consumer-facing and admin-facing surfaces. This is a non-negotiable requirement, not an aspiration."

**Legal force:**
- **European Accessibility Act (EAA):** In force across all EU member states since 28 June 2025. Applies to digital products and services made available to consumers in the EU. Farmmap serves ROI consumers, placing it within EAA scope for those users. Enforcement body: Competition and Consumer Protection Commission (CCPC) in Ireland. Penalties up to EUR 3 million.
- **UK accessibility obligations:** The Public Sector Bodies Accessibility Regulations apply only to public sector bodies; Farmmap is a private company and is not within scope. However, WCAG 2.2 AA is the applicable standard for EAA compliance, which applies to ROI users.
- **ADA Title II (US):** Not applicable — Farmmap is a UK/Ireland product with no US market presence.

---

## 2. High-Risk Accessibility Surfaces

### 2.1 Interactive Map (F1) — HIGHEST RISK

The interactive map is the most challenging WCAG 2.2 AA surface in the product. Map interfaces present inherent accessibility challenges:

**Critical requirements (from spec and a11y rules):**
- Keyboard-only users must be able to: search for a location, view map results, navigate to a listing detail page, and use filter controls
- Map pins must have accessible text equivalents when focused (e.g., "Hargreaves Farm Shop — Farm Shop — 2.3 miles away")
- Dynamic map updates (filtering, zoom changes, new pins loading) must be announced via appropriate ARIA live regions
- The filter panel must be keyboard-navigable and use native form controls (checkboxes, select elements) not `<div>`-based custom controls
- Location search input requires a proper `<label>`, `aria-label`, or `aria-labelledby`
- Directions links must have descriptive text (not "click here" — violation S7 from a11y rules)

**Anti-patterns to avoid in map implementation:**
- `<div onClick>` for pin interactions (violation S8, K1) — use proper `<button>` elements or ARIA landmark roles
- Map controls without accessible labels (zoom in/out buttons must have `aria-label`) — violation A6
- Clustering controls without keyboard access
- Animated pin loading without `prefers-reduced-motion` consideration

**Recommended approach:** MapLibre GL JS (the confirmed tech stack) has limited native accessibility support. A custom accessible layer must be built on top: an off-screen list of listings that is navigable by keyboard and screen reader, synchronised with the visual map. This pattern is used by accessibility-compliant map applications and satisfies WCAG 2.1.1 (Keyboard) and 4.1.3 (Status Messages).

### 2.2 Listing Detail Pages (F2)

Standard content page — high compliance achievability. Key requirements:
- Structured data hierarchy: `<h1>` for listing name, `<h2>` for sections (Opening Hours, Products, Reviews)
- Photos: all photos must have descriptive `alt` text; the owner-uploaded photo moderation workflow must include an `alt` text field (not automatically generated)
- Opening hours: presented in accessible format — not as an image of a timetable
- Directions link: must open in native maps application; link text must describe the destination ("Get directions to Hargreaves Farm Shop")
- Reviews section: star ratings must have text equivalents ("4.2 out of 5 stars, based on 12 reviews")
- "Claim this listing" CTA: must be a `<button>` or `<a>` with descriptive text

### 2.3 Review Submission Form (F5)

- Star rating widget: accessible star rating implementations are complex. Radio button group with visible labels is the accessible implementation. Custom CSS star-click-widgets typically fail 4.1.2 (Name, Role, Value).
- Text review textarea: must have associated `<label>`, character count accessible to screen readers via `aria-live` region
- Error states: `aria-invalid="true"` on fields with errors; error messages linked via `aria-describedby`
- Submit confirmation: must announce success via `role="status"` live region

### 2.4 Subscription Payment Flow (F7/F8/F9)

Payment forms are consistently the highest-WCAG-failure-rate surface in web applications:
- All form fields require associated labels (F1 in a11y rules)
- Error messages must be linked to fields via `aria-describedby` (F2 in a11y rules)
- Card number, expiry, CVC fields: Stripe Elements (the payment UI component) has accessibility support but must be configured correctly — default Stripe Elements embed with unlabelled iframes fails WCAG 1.3.1
- Required fields must use `required` attribute and be announced as required (F3 in a11y rules)

### 2.5 Admin Console (F11)

Admin console is specified as a productivity tool, not a polished consumer product. However, WCAG 2.2 AA applies to "all admin-facing surfaces" per the spec. Key risks:
- Bulk approval actions (up to 50 photos per action) must be keyboard-operable and announce the result
- Moderation queue navigation must support keyboard-only workflow
- Impersonation modal: must trap focus, dismiss on Escape, return focus to trigger element (K3, K7 in a11y rules)
- Status badges on reported content queue: must not convey severity information by colour alone (V2 in a11y rules)

### 2.6 Owner Management Dashboard

- Analytics charts/graphs: must have text alternatives or accessible data tables
- Photo upload component: accessible file input with clear label and error states
- "Currently stocked" toggle (F12): must use accessible toggle pattern with clear on/off label

---

## 3. Specific WCAG 2.2 New Criteria (not in 2.1)

WCAG 2.2 introduced several new success criteria that are directly relevant to Farmmap:

| Criterion | Level | Farmmap Relevance |
|---|---|---|
| 2.4.11 Focus Not Obscured | AA | Farmmap will use sticky navigation (mobile header, filter bar). Focused elements must not be entirely hidden behind these. |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | Aspiration target only |
| 2.5.7 Dragging Movements | AA | If the map supports drag-to-pan, a tap/click alternative must exist. MapLibre supports this via keyboard pan. |
| 2.5.8 Target Size (Minimum) | AA | Map pins, filter checkboxes, and all interactive controls must have a minimum 24×24 CSS px target size. Small map pins at certain zoom levels may fail this. |
| 3.2.6 Consistent Help | A | Help links or contact support links must appear in the same relative order across all pages. |
| 3.3.7 Redundant Entry | A | Subscription forms must not re-ask for information already provided (e.g., business name already entered during claim flow must not be re-requested during Bronze signup). |
| 3.3.8 Accessible Authentication | AA | Login and signup forms must support paste and browser autofill. Password fields must not block paste. No cognitive CAPTCHAs without accessible alternatives. |

---

## 4. EAA Compliance Specific to ROI Users

The EAA requires compliance with EN 301 549, which maps to WCAG 2.1 AA as its web accessibility standard. WCAG 2.2 AA is a superset of WCAG 2.1 AA and therefore satisfies EN 301 549 requirements.

**EAA enforcement in Ireland:** The CCPC is the enforcement body. EAA enforcement began June 2025. No grace period for new products launched after that date.

**Farmmap timing:** Farmmap is launching after June 2025. It has no EAA grace period. It must be WCAG 2.2 AA compliant at V1 launch for all surfaces accessible to ROI users.

---

## 5. Accessibility Testing Requirements

The spec states WCAG 2.2 AA is required but does not specify how compliance will be verified. The following testing approach is required:

**Automated testing (CI gate):**
- axe-core or equivalent integrated into the CI pipeline for all pages
- Automated testing catches approximately 30–40% of WCAG violations (primarily structural issues)

**Manual testing (pre-launch):**
- Keyboard-only navigation test across all primary user flows (consumer browsing, listing claim, Bronze signup, review submission)
- Screen reader testing: NVDA + Chrome (Windows), VoiceOver + Safari (macOS and iOS), TalkBack (Android)
- Map interface keyboard navigation test: this must be conducted manually; automated tools cannot adequately test map keyboard access

**Condition:** A formal accessibility audit against WCAG 2.2 AA must be conducted before V1 launch and before each subsequent version launch (V2, V3). The audit must cover the map interface specifically. The audit findings must be recorded in the evidence pack for each phase gate.

---

## 6. Conditions

### C1 — Accessible Map Implementation Plan (BLOCKER for Build — map component)

Before the map component build commences, the architecture/build squad must produce a documented plan for accessible map implementation covering: keyboard navigation model, accessible listing list fallback, screen reader announcement approach for dynamic updates, and mobile touch alternative. This plan must be reviewed against WCAG 2.2 AA criteria 2.1.1, 4.1.2, and 4.1.3 before implementation begins.

### C2 — Accessible Star Rating Widget (BLOCKER for F5 build)

The star rating widget for consumer reviews must use a radio button group pattern, not a custom `<div>`-based click widget. The implementation spec must be confirmed before the F5 review component is built.

### C3 — Stripe Elements Accessibility Configuration (BLOCKER for F7 build)

The payment form implementation must use Stripe Elements with correct accessibility configuration. The Stripe integration must be tested against WCAG 1.3.1, 1.4.3, 3.3.1, and 3.3.2 before the Bronze payment flow goes to QA.

### C4 — Photo Alt Text Workflow

The photo upload workflow (F4, F11) must include a mandatory `alt` text field for all owner-uploaded photos. Admin bulk approval must not allow approval of photos without `alt` text.

### C5 — Pre-Launch Accessibility Audit (BLOCKER for each version launch)

A formal WCAG 2.2 AA accessibility audit is required before V1 launch, V2 launch, and V3 launch. The audit must include manual keyboard and screen reader testing of the map interface. Results must be recorded in the evidence pack.

### C6 — WCAG 2.2 New Criteria Coverage

The build specifications for all interactive components must explicitly address WCAG 2.2 new criteria: 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8.

---

## 7. Overall Assessment

**Status: CONDITIONS REQUIRED**

The spec explicitly requires WCAG 2.2 AA, which is correct and sufficient. The conditions are about implementation verification rather than product design gaps. The map interface represents the highest accessibility risk in the product and must be addressed proactively in the build phase — not retrofitted after initial implementation.

The EAA (EU law, in force) adds legal enforceability to what would otherwise be a best-practice requirement. ROI users are entitled to accessible service under EAA, and Farmmap will be launching after the EAA enforcement date with no grace period.

---

*Produced by: compliance-squad-lead (invoking accessibility-compliance-specialist)*
*Authority: specs/003-farmmap/spec.md + .claude/rules/a11y.md + agent-foundry Constitution v1.0.0*
*Feeds: specs/003-farmmap/compliance-pack/compliance-decision.md*
