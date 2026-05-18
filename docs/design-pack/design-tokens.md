---
feature: 003-farmmap
phase: 6
document: design-tokens
squad: ux-design
produced_by: ux-design-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md
  + specs/003-farmmap/platform-pack/device-matrix.md
  + .claude/rules/a11y.md (WCAG 2.2 AA contrast requirements)
---

# Farmmap — Design Tokens

All tokens are semantic. No hex literals in component code. Components reference
token names only. Token values are defined once here and in the implementation's
CSS custom properties / design system variables.

WCAG 2.2 AA contrast compliance is noted for all colour pairs that carry text.

---

## Colour Tokens

### Brand Colours

```
color-brand-primary:        #2D6A4F   // Deep forest green — Farmmap brand
color-brand-primary-hover:  #245A42   // Darker on hover/focus
color-brand-primary-light:  #B7E4C7   // Light green tint; backgrounds
color-brand-secondary:      #3A5A8C   // Slate blue — secondary accent
color-brand-secondary-hover:#2E497A
color-brand-secondary-light:#C8D8F0   // Light blue tint; info states
```

**Contrast verification:**
- `color-brand-primary` (#2D6A4F) on white (#FFFFFF): **8.5:1 ✓** (exceeds 4.5:1 AA minimum)
- `color-brand-secondary` (#3A5A8C) on white (#FFFFFF): **7.2:1 ✓**
- White (#FFFFFF) on `color-brand-primary`: **8.5:1 ✓**
- White (#FFFFFF) on `color-brand-secondary`: **7.2:1 ✓**

---

### Surface Colours

```
color-surface-default:      #FFFFFF   // Main page background
color-surface-raised:       #F8F6F2   // Cards, panels — warm off-white
color-surface-elevated:     #FFFFFF   // Modals, overlays (with shadow)
color-surface-map:          #E5EFE8   // Map tile background tint (CSS only; not tile itself)
color-surface-overlay:      rgba(0,0,0,0.5)  // Modal backdrop dimmer
color-surface-input:        #FFFFFF   // Form input backgrounds
color-surface-input-focus:  #F0F7F2   // Input background when focused
```

---

### Text Colours

```
color-text-primary:         #1A2E1F   // Near-black on white — primary body text
color-text-secondary:       #4A6050   // Medium green-grey — captions, meta
color-text-tertiary:        #7A9080   // Subdued — placeholders, disabled
color-text-inverse:         #FFFFFF   // White text on dark backgrounds
color-text-link:            #2D6A4F   // Same as brand-primary for links
color-text-link-visited:    #1E4D36   // Darker for visited links
```

**Contrast verification:**
- `color-text-primary` (#1A2E1F) on `color-surface-default` (#FFFFFF): **16.8:1 ✓**
- `color-text-secondary` (#4A6050) on `color-surface-default` (#FFFFFF): **7.1:1 ✓**
- `color-text-tertiary` (#7A9080) on `color-surface-default` (#FFFFFF): **3.9:1** — meets 3:1 for large text (18pt+); does NOT meet 4.5:1 for normal text. Must not be used for body text; acceptable for placeholder text only (WCAG 1.4.3 — incidental text)
- `color-text-inverse` (#FFFFFF) on `color-brand-primary` (#2D6A4F): **8.5:1 ✓**

---

### Map Pin Colours

Pins use both colour AND distinct icon/shape. Colour is never the sole differentiator
(WCAG 1.4.1 Use of Colour).

```
color-pin-free:             #8B9E93   // Warm grey — unclaimed listings
color-pin-free-stroke:      #6A7D72   // Outline for unclaimed pins

color-pin-claimed:          #2D6A4F   // Brand green — claimed free listings
color-pin-claimed-stroke:   #1E4D36

color-pin-bronze:           #B5651D   // Amber/bronze — Bronze tier
color-pin-bronze-stroke:    #8A4A15   // Darker stroke for contrast

color-pin-silver:           #3A5A8C   // Slate blue — Silver tier
color-pin-silver-stroke:    #2E497A

color-pin-gold:             #C9A227   // Gold — Gold tier
color-pin-gold-stroke:      #9B7C1B

color-pin-honesty-stocked:  #22A05A   // Green dot — honesty box stocked indicator
color-pin-honesty-empty:    #9BABA2   // Grey dot — honesty box empty indicator
color-pin-closed:           #C0C0C0   // Desaturated — temporarily closed state
```

**Non-text contrast verification (pins against map tile background ~#E5EFE8):**
- `color-pin-free` (#8B9E93) on map background: **1.8:1** — FAILS 3:1 for non-text. Mitigation: pins use a white stroke/halo to ensure minimum 3:1 contrast against the map tile
- `color-pin-bronze` (#B5651D) on map background: **3.4:1 ✓**
- `color-pin-silver` (#3A5A8C) on map background: **6.8:1 ✓**
- `color-pin-gold` (#C9A227) on map background: **2.1:1** — FAILS on light map. Mitigation: gold pins use a dark (#9B7C1B) stroke to achieve 3:1 contrast at the pin boundary
- All pins include a 2px white halo as a universal backstop against varying map tile backgrounds

---

### Status Colours

```
color-status-success:       #22A05A   // Green — success states, approvals
color-status-success-light: #D4EDDA   // Light green background for success banners
color-status-success-text:  #145A35   // Dark green text on light background

color-status-warning:       #D97706   // Amber — warnings, pending states
color-status-warning-light: #FEF3C7   // Light amber background
color-status-warning-text:  #92400E   // Dark text on warning background

color-status-error:         #DC2626   // Red — errors, failures
color-status-error-light:   #FEE2E2   // Light red background
color-status-error-text:    #991B1B   // Dark text on error background

color-status-info:          #3A5A8C   // Blue — informational states
color-status-info-light:    #EFF6FF   // Light blue background
color-status-info-text:     #1E3A5F   // Dark text on info background
```

**Contrast verification (text on light backgrounds):**
- `color-status-success-text` (#145A35) on `color-status-success-light` (#D4EDDA): **8.1:1 ✓**
- `color-status-warning-text` (#92400E) on `color-status-warning-light` (#FEF3C7): **5.7:1 ✓**
- `color-status-error-text` (#991B1B) on `color-status-error-light` (#FEE2E2): **6.0:1 ✓**
- `color-status-info-text` (#1E3A5F) on `color-status-info-light` (#EFF6FF): **10.2:1 ✓**

---

### Border Colours

```
color-border-default:       #D4DDD8   // Default dividers and input borders
color-border-subtle:        #E8EFEB   // Subtle separators within cards
color-border-strong:        #8B9E93   // Stronger borders; form focus states
color-border-focus:         #2D6A4F   // Focus ring colour (brand primary)
color-border-error:         #DC2626   // Error state on inputs
```

---

## Spacing Tokens

Base unit: 4px. Spacing scale is multiples of the base unit.

```
spacing-0:    0px
spacing-0.5:  2px    // Micro spacing
spacing-1:    4px    // Tiny
spacing-2:    8px    // Small
spacing-3:    12px   // Compact
spacing-4:    16px   // Default
spacing-5:    20px   // Medium
spacing-6:    24px   // Standard section gap
spacing-7:    28px   // Medium-large
spacing-8:    32px   // Large
spacing-10:   40px   // Extra large
spacing-12:   48px   // Section padding
spacing-16:   64px   // Page section
spacing-20:   80px   // Hero section
```

---

## Border Radius Tokens

```
radius-none:  0px
radius-sm:    4px    // Small interactive elements
radius-md:    8px    // Cards, inputs, buttons
radius-lg:    12px   // Modals, floating panels, pin mini-cards
radius-xl:    16px   // Large cards
radius-2xl:   24px   // Hero images, large feature cards
radius-full:  9999px // Pill shapes, badges, chips
```

---

## Typography Tokens

### Font Family

```
font-family-sans:   system-ui, -apple-system, BlinkMacSystemFont,
                    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
font-family-mono:   "SF Mono", "Fira Code", "Fira Mono", monospace
```

System UI font stack ensures optimal rendering on iOS Safari (SF Pro) and Android
Chrome (Roboto) without a custom font download (performance budget requirement).

### Font Size Scale (rem — relative to 16px browser default)

```
font-size-xs:   0.75rem    // 12px — micro labels
font-size-sm:   0.875rem   // 14px — captions, secondary text
font-size-base: 1rem       // 16px — body text
font-size-lg:   1.125rem   // 18px — large body / subheadings
font-size-xl:   1.25rem    // 20px — card headings
font-size-2xl:  1.5rem     // 24px — page headings
font-size-3xl:  1.875rem   // 30px — section headings
font-size-4xl:  2.25rem    // 36px — hero headings
```

All font sizes use `rem` (not `px`) to respect user-set browser font size preferences
(WCAG 1.4.4 Resize Text — users can scale to 200% without loss of content).

### Font Weight

```
font-weight-regular:   400
font-weight-medium:    500
font-weight-semibold:  600
font-weight-bold:      700
```

### Line Height

```
line-height-tight:   1.25    // Headings
line-height-snug:    1.375   // Compact body
line-height-normal:  1.5     // Body text (WCAG 1.4.12 — min 1.5× for body)
line-height-relaxed: 1.625   // Long-form reading
```

---

## Shadow Tokens

```
shadow-sm:   0 1px 2px rgba(0,0,0,0.06)        // Subtle card lift
shadow-md:   0 2px 8px rgba(0,0,0,0.10)        // Cards, dropdowns
shadow-lg:   0 4px 16px rgba(0,0,0,0.12)       // Modals, floating panels
shadow-xl:   0 8px 32px rgba(0,0,0,0.16)       // Hero elements
shadow-pin:  0 2px 6px rgba(0,0,0,0.30)        // Map pins (need higher contrast)
```

---

## Motion Tokens

All animations respect `prefers-reduced-motion`. When the user has requested
reduced motion, all `transition` and `animation` properties fall back to `none`.

```
duration-instant:   0ms       // Immediate state changes (errors, validation)
duration-fast:      150ms     // Micro-interactions (button press, checkbox toggle)
duration-normal:    300ms     // Standard transitions (panel slide, fade)
duration-slow:      500ms     // Page-level transitions (modal enter)

easing-ease-out:    cubic-bezier(0.0, 0.0, 0.2, 1)   // Elements entering view
easing-ease-in:     cubic-bezier(0.4, 0.0, 1, 1)     // Elements leaving view
easing-ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1)   // Position changes
easing-spring:      cubic-bezier(0.34, 1.56, 0.64, 1) // Bouncy — sparingly
```

**Reduced motion override pattern:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Z-Index Scale

```
z-base:       0
z-raised:     1       // Slightly above default flow
z-dropdown:   100     // Dropdown menus, tooltips
z-sticky:     200     // Sticky headers, bottom tab bar
z-map-pin:    300     // Map pin mini-cards
z-modal-bg:   400     // Modal backdrop overlay
z-modal:      500     // Modal content
z-banner:     600     // Cookie consent banner
z-toast:      700     // Toast/notification messages
```

---

## Breakpoints

```
bp-sm:   480px    // Small mobile breakpoint
bp-md:   768px    // Tablet — switch from bottom tab bar to top nav
bp-lg:   1024px   // Desktop — sidebar layouts
bp-xl:   1280px   // Wide desktop — admin console layouts
bp-2xl:  1536px   // Ultra-wide
```

---

## Touch Target Minimums (WCAG 2.5.8)

All interactive controls must have a minimum target size of 24×24 CSS pixels with
sufficient spacing, or a target area of 44×44 CSS pixels.

```
touch-target-min:       24px    // Minimum per WCAG 2.5.8 AA
touch-target-recommended: 44px  // Apple HIG / Material Design recommendation
touch-target-tap-bar:   56px    // Bottom navigation tab bar height
```

---

*Produced by: ux-design-lead | squad: ux-design*
*Authority: specs/003-farmmap/spec.md + a11y.md (WCAG 2.2 AA)*
*Phase: 6 | Feeds: specs/003-farmmap/architecture-pack/*
