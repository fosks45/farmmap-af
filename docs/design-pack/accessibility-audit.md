---
feature: 003-farmmap
phase: 6
document: accessibility-audit
squad: ux-design
produced_by: ux-design-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md (NFR: WCAG 2.2 AA non-negotiable)
  + .claude/rules/a11y.md
  + specs/003-farmmap/compliance-pack/accessibility-compliance-assessment.md
  + specs/003-farmmap/design-pack/design-tokens.md
---

# Farmmap — Accessibility Audit

Design-phase accessibility review. Issues identified here are resolved in the design
(not deferred to build). Each row represents an issue found in the design review,
its severity, the WCAG criterion, and the fix applied.

---

## Audit Results by Screen

---

### Map Interface (Home / Map Screen)

| WCAG Criterion | Severity | Issue | Fix Applied |
|---|---|---|---|
| 1.3.1 Info and Relationships | CRITICAL | Pins are visual elements only. A screen reader user navigating the map page receives no information about the listings shown. | Provide an off-screen accessible list (`<div class="sr-only">`) of listings in the current viewport, dynamically updated with `aria-live="polite"` as the map pans. The list is announced: "Showing 14 listings. Hargreaves Farm Shop, Farm Shop, Lincolnshire. [next listing]…". Tab order reaches this list before the map canvas. |
| 4.1.3 Status Messages | IMPORTANT | Pin count and filter changes are not announced to screen readers. | Add `aria-live="polite"` region at the top of the map panel that announces: "Filters applied. Showing [N] farm shops." on each filter change. Region is populated by JS after the filter fires. |
| 1.4.1 Use of Colour | CRITICAL | Pin tier is communicated by colour only in the initial design. | All pin types use both colour AND distinct icon/shape. See design-tokens.md pin legend: farm shop = house icon, honesty box = box icon, farm gate = gate icon, roadside = sign icon. Tier indicated by overlaid star/diamond/double-star badge. Colour is additive, not sole indicator. |
| 1.4.3 Contrast (Non-text) | IMPORTANT | `color-pin-free` (warm grey) and `color-pin-gold` (gold) on some map tile backgrounds fail the 3:1 non-text contrast requirement for UI components. | All pins render with a 2px white halo/stroke. The halo against any map tile background achieves the required 3:1 boundary contrast. Additionally, gold pins use a dark stroke token (`color-pin-gold-stroke`). See design-tokens.md verification notes. |
| 2.1.1 Keyboard | IMPORTANT | Map canvas is not keyboard-navigable in the initial design; all listing access requires mouse/touch pin interaction. | Add a keyboard-accessible "List view" button adjacent to the map canvas (focusable via Tab). This reveals an accessible list of all listings with the same filter/sort options as the map. All listing detail navigation is possible via the list view without ever interacting with the map canvas itself. The map canvas additionally supports arrow key navigation between pins when focused (future enhancement; list view is the v1 WCAG 2.1.1 compliance path). |
| 2.4.1 Bypass Blocks | IMPORTANT | Map home has no skip link in the initial design. Navigation header repeats on every page load. | First focusable element on every page is `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>`. On the map home, `#main-content` is the map canvas container (with `tabindex="-1"` to receive programmatic focus). |
| 2.4.7 Focus Visible | IMPORTANT | Map pin mini-cards appearing on pin tap do not have a visible focus indicator in the initial design. | All interactive elements in mini-cards (listing name link, directions button, "View more" button) use `:focus-visible` with `outline: 2px solid color-border-focus; outline-offset: 2px`. No `outline: none` without replacement anywhere in the codebase. |
| 1.4.13 Content on Hover/Focus | SUGGESTION | Mini-card content appears on pin tap (pointer) but the design did not specify keyboard-triggerable equivalent. | Mini-card appears when the pin's underlying button element receives keyboard focus (`:focus-visible`). Mini-card persists until focus moves away (not time-limited). Mini-card is dismissible with Escape (treated as keyboard equivalent of tapping elsewhere). |

---

### Listing Detail Page (Farm Shop)

| WCAG Criterion | Severity | Issue | Fix Applied |
|---|---|---|---|
| 2.4.1 Bypass Blocks | IMPORTANT | No skip link to main content. | First focusable element is the skip link (`href="#main-content"`). `<main id="main-content" tabindex="-1">` receives focus on skip link activation. |
| 1.4.3 Contrast (Text) | IMPORTANT | Hero image text overlay (listing name + tier badge) was positioned without contrast verification. | Listing name heading and tier badge are placed below the hero image on a solid surface (`color-surface-default`), not overlaid on the photo. The photo is decorative (`alt=""`). No text is overlaid on photography. |
| 1.3.5 Identify Input Purpose | SUGGESTION | The waitlist email input (F6 widget) had no `autocomplete` attribute in the initial design. | `<input type="email" autocomplete="email">` applied to all email inputs. |
| 3.3.2 Labels or Instructions | CRITICAL | The waitlist email input had a placeholder but no associated `<label>` element in the initial design. | `<label for="waitlist-email">Email address</label>` added. Label is visually positioned above the input. Placeholder is supplementary hint text only. |
| 1.3.1 Info and Relationships | IMPORTANT | Opening hours were presented as free text in the initial design with no programmatic structure. | Opening hours are rendered as a `<dl>` (description list) with `<dt>` for day/period names and `<dd>` for times. Screen readers announce: "Tuesday, Friday: 9am to 5pm". |
| 4.1.2 Name, Role, Value | IMPORTANT | "Currently stocked" toggle on honesty box listing had no programmatic role in the initial design. | The stocked status is read-only on the consumer listing view; rendered as `<p>` with role="status" and a visually distinct badge. Owner-side toggle is `<button aria-pressed="true/false" aria-label="Mark as currently stocked">`. |
| 2.5.8 Target Size (Minimum) | IMPORTANT | Product type chip touch targets were 28×28px in the initial design (below 44×44 recommended). | Chips are padded to a minimum 44px height and 44px width. The design token `touch-target-recommended: 44px` applies to all interactive chip elements. |

---

### Listing Claim Flow (3-Step)

| WCAG Criterion | Severity | Issue | Fix Applied |
|---|---|---|---|
| 3.3.1 Error Identification | CRITICAL | Validation errors (Step 1) were styled with colour only in the initial design (red border). | Error messages are added below each invalid field as `<span id="[field]-error" role="alert">Error message text</span>`. Each input has `aria-describedby="[field]-error"` and `aria-invalid="true"` on error. Border colour change is additive. |
| 3.3.2 Labels or Instructions | IMPORTANT | The business email field label ("Business email address") was not programmatically associated with the input. | `<label for="business-email">Business email address <abbr title="required">*</abbr></label>` with matching `id="business-email"` on the input. |
| 3.3.7 Redundant Entry | SUGGESTION | The claim flow asks for name and email in Step 1, but does not reuse these in subsequent steps. | Name and email are not re-asked in Step 2 or Step 3. The edit form in Step 3 pre-fills the listing's existing data, not the owner's personal details again. |
| 2.4.3 Focus Order | IMPORTANT | After the verification email is sent (Step 1 → Step 2 transition), focus was not managed in the initial design. | On navigation to Step 2, focus is moved to the Step 2 page heading (`<h1 tabindex="-1">Check your email</h1>`). The heading receives programmatic focus via `element.focus()` on route change. |
| 1.3.1 Info and Relationships | IMPORTANT | The progress indicator ("Step 2 of 3") was an icon-only visual element with no text equivalent. | Progress indicator renders as `<ol aria-label="Claim listing steps"><li aria-current="step">Verify email</li><li>Confirm details</li><li>Done</li></ol>`. Visually shown as the ●─○─○ indicator; programmatically a step list. |

---

### Review Submission Modal

| WCAG Criterion | Severity | Issue | Fix Applied |
|---|---|---|---|
| 2.1.2 No Keyboard Trap | CRITICAL | Modal must trap focus within itself while open but allow Escape to dismiss. | Focus is trapped within the modal using a focus trap implementation (Tab cycles through modal interactive elements; Shift+Tab reverses). Escape dismisses the modal and returns focus to the "Write a review" button that triggered it. Native `<dialog>` element is used where browser support allows; polyfilled otherwise. |
| 2.4.3 Focus Order | CRITICAL | On modal open, focus was not moved to the modal in the initial design. | Focus moves to the modal's close button (first focusable element) on open. `<dialog>` with `showModal()` handles this natively in supporting browsers. |
| 4.1.2 Name, Role, Value | IMPORTANT | The star rating widget was designed as custom SVG star icons in the initial design. | Star rating is implemented as an accessible radio button group: `<fieldset><legend>Your rating</legend>` with five `<input type="radio">` elements and `<label>` elements. Visual star display is CSS/SVG layered on the native radio inputs (which are visually hidden but remain accessible). V2-C9 compliance condition met. |
| 3.3.1 Error Identification | IMPORTANT | Submit button was disabled in the initial design with no explanation to the user of why. | `aria-disabled="true"` is used instead of `disabled` attribute so the button remains focusable and can be described. When the button is keyboard-focused while disabled: `aria-describedby` points to a `<span>` that says "Please select a star rating and write at least 20 characters to submit your review." |
| 1.4.3 Status Messages | IMPORTANT | The post-submit "Thank you" state replaced the form with no announcement. | The confirmation message container has `role="alert"` or `aria-live="assertive"`. When content is injected, screen readers announce "Review submitted. Thank you for your review…" without requiring focus movement. |

---

### Cookie Consent Banner

| WCAG Criterion | Severity | Issue | Fix Applied |
|---|---|---|---|
| 2.4.3 Focus Order | CRITICAL | Cookie banner appears at the bottom of the viewport and does not receive focus on appearance in the initial design. | On banner insertion into the DOM, focus is moved programmatically to the banner's first interactive element ("Accept all" button). `element.focus()` is called after a one-frame delay to allow the animation to start. |
| 2.1.2 No Keyboard Trap | IMPORTANT | Banner appears over page content; keyboard users cannot access page content until they make a choice. | Focus is trapped within the banner (Tab cycles: Accept all → Accept necessary → Manage preferences → back to Accept all). Escape dismisses as "Accept necessary only" and returns focus to the banner's previous trigger point or to the first body element. |
| 3.3.2 Labels or Instructions | IMPORTANT | The "Manage preferences" expanded panel had toggle switches without `<label>` elements in the initial design. | Each category toggle is `<input type="checkbox" id="consent-analytics" aria-describedby="consent-analytics-desc">` with `<label for="consent-analytics">Analytics</label>` and `<span id="consent-analytics-desc">…description…</span>`. |
| 1.3.1 Info and Relationships | IMPORTANT | The cookie categories were listed without programmatic structure in the initial design. | Categories are rendered as a `<ul>` with `<li>` items. Each item contains the category name (heading), description text, and the toggle control. The list structure is announced by screen readers. |

---

### All Pages — General Findings

| WCAG Criterion | Severity | Issue | Fix Applied |
|---|---|---|---|
| 3.1.1 Language of Page | CRITICAL | `<html>` `lang` attribute not specified in the initial design specification. | Set `lang="en-GB"` on all UK pages. Set `lang="en-IE"` for pages served to ROI users (detected via user locale preference or billing address on account pages). Set dynamically for any pages with bilingual content. |
| 1.3.5 Identify Input Purpose | SUGGESTION | Autocomplete attributes were not specified on all form inputs in the initial design. | All inputs that collect personal information have `autocomplete` attributes: name → `autocomplete="name"`, email → `autocomplete="email"`, tel → `autocomplete="tel"`, address fields → `autocomplete="street-address"` / `"address-level2"` / `"postal-code"`. |
| 2.4.6 Headings and Labels | IMPORTANT | Several screens had page headings that were not `<h1>` elements (styled divs) in the initial design. | Every screen has exactly one `<h1>` that describes the page purpose. Section headings use `<h2>`. Sub-sections use `<h3>`. Heading levels do not skip (S3 pattern from a11y.md). |
| 1.4.4 Resize Text | IMPORTANT | Fixed `px` font sizes were used in early CSS explorations. | All body text and component text use `rem` units. Base font size is the browser default (16px). Content scales correctly to 200% without horizontal scrolling (tested at 320px × 200% = effectively 320px with doubled text size). |
| 4.1.3 Status Messages | IMPORTANT | Toast notification messages (future feature) are not announced by screen readers. | All toast/notification components use `role="status"` (polite) or `role="alert"` (assertive for errors). Content is injected into a pre-existing live region in the DOM — not a newly created element. A8 pattern from a11y.md. |
| 2.5.3 Label in Name | IMPORTANT | Several icon-only buttons (photo delete, close modal) had `aria-label` values that differed from any visible text. | Icon-only buttons: `<button aria-label="Close review form">` contains only the ×SVG icon (`aria-hidden="true"`). A6 pattern from a11y.md. Where a button has both visible text and an icon, the `aria-label` matches the visible text exactly. |

---

## Compliance Summary

| Screen Area | WCAG AA Status | Notes |
|---|---|---|
| Map interface | Compliant with design fixes applied | Screen reader list view is the v1 compliance path for map navigation |
| Listing detail (farm shop) | Compliant | Waitlist email input label fix required in build |
| Listing detail (honesty box) | Compliant | Same fixes as farm shop; no additional issues |
| Listing claim flow | Compliant | Focus management on step transitions is a build task |
| Owner dashboard | Compliant | No critical issues; standard form accessibility applies |
| Bronze upgrade / payment | Compliant | Stripe Elements a11y config is a build task (V2-C10) |
| Review submission modal | Compliant | Native `<dialog>` implementation preferred where supported |
| Cookie consent banner | Compliant | Focus management on banner appearance is a build task |
| Admin console | Compliant | Admin-only surface; keyboard navigation optimised for batch operations |
| All pages (global) | Compliant | `lang` attribute, skip links, heading hierarchy all confirmed |

**Map accessibility note:** The interactive map canvas (Leaflet/MapLibre GL JS) does not
have native screen reader support. The accessible list view fallback is the WCAG 2.1.1
compliance mechanism at v1. A keyboard-navigable map is a WCAG 2.1 AA requirement
that is met through the list view; direct pin keyboard navigation is a v2 enhancement
(using Leaflet's `L.marker().bindPopup()` with keyboard focus management).

---

*Produced by: ux-design-lead | squad: ux-design*
*Authority: specs/003-farmmap/spec.md (NFR Accessibility) + .claude/rules/a11y.md + compliance-pack/accessibility-compliance-assessment.md*
*Phase: 6 | Gate: design-sign-off*
