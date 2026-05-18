---
feature: 003-farmmap
phase: 6
document: wireframes-map-and-discovery
squad: ux-design
produced_by: ux-design-lead
produced_at: 2026-05-17T00:00:00Z
---

# Wireframes — Map and Discovery

All layouts shown at 375px CSS width (iPhone 13 viewport). ASCII wireframes.
Dimensions are approximate; final layout governed by design tokens.

---

## Screen 1: Map Home (Default Landing)

```
┌─────────────────────────────────────────┐ ← 375px wide
│ ┌─────────────────────────────────────┐ │
│ │  🌿 FARMMAP          [🔍 Search...] │ │ ← Header bar: 56px
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │   MAP CANVAS (fills viewport)       │ │
│ │                                     │ │
│ │   FS  ← farm shop pin               │ │
│ │       HB  ← honesty box pin         │ │
│ │  FG                                 │ │
│ │         FS*  ← bronze tier pin      │ │
│ │    HB*                              │ │
│ │           FS✦  ← silver tier pin    │ │
│ │   RS                                │ │
│ │                                     │ │
│ │  [📍 Near me]  [≡ Filter]          │ │ ← Floating map controls
│ │                                     │ │
│ │  [©OpenStreetMap contributors]      │ │ ← Required attribution (V1-C5)
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌───────┬──────────┬─────────┬────────┐ │
│ │  🗺   │   📍     │   ▦    │  👤   │ │ ← Bottom tab bar: 56px
│ │  Map  │ Near me  │ Discover│Account │ │
│ └───────┴──────────┴─────────┴────────┘ │
└─────────────────────────────────────────┘
```

**Pin legend (visual system — colour never the sole indicator):**

| Pin Code | Tier/Type | Colour Token | Shape/Icon |
|---|---|---|---|
| FS | Farm shop (free/unclaimed) | `color-pin-free` (warm grey) | House shape |
| HB | Honesty box (free/unclaimed) | `color-pin-free` | Box/crate shape |
| FG | Farm gate stall (free/unclaimed) | `color-pin-free` | Gate shape |
| RS | Roadside stand (free/unclaimed) | `color-pin-free` | Stand/board shape |
| FS* | Any type, claimed/Bronze | `color-pin-bronze` (amber) | Same shape + star |
| FS✦ | Any type, Silver | `color-pin-silver` (blue) | Same shape + diamond |
| FS✦✦ | Any type, Gold | `color-pin-gold` (gold) | Same shape + double-star |

Screen reader accessible list: an off-screen `<div aria-live="polite">` announces
the count of visible listings as the map pans: "Showing 14 listings in view." A
keyboard-accessible "List view" toggle shows all pins as a scrollable list.

---

## Screen 2: Pin Tap → Mini-Card (Map Overlay)

```
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │  🌿 FARMMAP          [🔍 Search...] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │   MAP CANVAS (partially covered)   │ │
│ │                                     │ │
│ │         FS✦ ← selected (elevated)  │ │
│ │                                     │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │ ← Mini-card slides up from bottom
│ │ [photo]  Hargreaves Farm Shop       │ │   height: 140px; border-radius-lg
│ │  48×48   Farm Shop · Lincolnshire   │ │
│ │          ⭐ 4.2  (18 reviews)       │ │
│ │          Tue, Fri · 9am–5pm         │ │
│ │          [Directions]  [View more ›]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌───────┬──────────┬─────────┬────────┐ │
│ │  🗺   │   📍     │   ▦    │  👤   │ │
│ │  Map  │ Near me  │ Discover│Account │ │
│ └───────┴──────────┴─────────┴────────┘ │
└─────────────────────────────────────────┘
```

Dismiss mini-card: tap outside the card, or swipe down, or press Escape (keyboard).
"View more ›" navigates to full Listing Detail.

---

## Screen 3: Pin States (All Tier/Type Combinations)

```
┌── Pin State Reference ─────────────────────────┐
│                                                  │
│  UNCLAIMED                                       │
│  FS (farm shop)  ╔══╗   warm grey fill          │
│                  ║🏠║   house icon               │
│                  ╚══╝                             │
│                                                  │
│  HB (honesty box)╔══╗   warm grey fill          │
│                  ║📦║   box icon                 │
│                  ╚══╝                             │
│                                                  │
│  FG (farm gate)  ╔══╗   warm grey fill          │
│                  ║🚪║   gate icon                │
│                  ╚══╝                             │
│                                                  │
│  RS (roadside)   ╔══╗   warm grey fill          │
│                  ║🪧║   sign icon                │
│                  ╚══╝                             │
│                                                  │
│  CLAIMED (free)                                  │
│  Any type        ╔══╗   brand-primary fill      │
│                  ║🏠║   icon + checkmark         │
│                  ╚══╝   overlay                  │
│                                                  │
│  BRONZE          ╔══╗   bronze/amber fill       │
│                  ║🏠★║  icon + star              │
│                  ╚══╝                             │
│                                                  │
│  SILVER          ╔══╗   slate-blue fill         │
│                  ║🏠◆║  icon + diamond           │
│                  ╚══╝                             │
│                                                  │
│  GOLD            ╔══╗   gold fill               │
│                  ║🏠✦║  icon + double-star       │
│                  ╚══╝   pulsing glow anim        │
│                         (prefers-reduced:off)    │
│                                                  │
│  HONESTY BOX — CURRENTLY STOCKED                │
│  HB (any tier)   ╔══╗   + green dot indicator  │
│                  ║📦●║  bottom-right of pin      │
│                  ╚══╝                             │
│                                                  │
│  HONESTY BOX — CURRENTLY EMPTY                  │
│  HB (any tier)   ╔══╗   + grey dot indicator   │
│                  ║📦○║                            │
│                  ╚══╝                             │
│                                                  │
│  TEMPORARILY CLOSED                              │
│  Any type        ╔══╗   pin desaturated;        │
│                  ║🏠×║  × overlay                │
│                  ╚══╝                             │
└──────────────────────────────────────────────────┘
```

All pin states use both colour AND icon/shape to distinguish type. Colour is never
the sole differentiator (WCAG 1.4.1).

---

## Screen 4: Listing Detail — Farm Shop (Mobile, 375px)

```
┌─────────────────────────────────────────┐
│ ← Back                                  │ ← Navigation header: 44px
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │ ← Hero image: 200px height
│ │                                     │ │   aspect-ratio: 375:200
│ │   [PHOTO — farm shop exterior]      │ │
│ │                                     │ │
│ │      ✦ SILVER  ← tier badge        │ │ ← Bottom-left of image
│ └─────────────────────────────────────┘ │
│                                         │
│  Hargreaves Farm Shop                   │ ← font-size-2xl, font-weight-bold
│  📍 Sleaford, Lincolnshire             │ ← font-size-sm, color-text-secondary
│                                         │
│  ⭐ 4.2  ████████░  (18 reviews)       │ ← Star + bar + count
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📅 Opening Hours                       │ ← Section heading
│  Tuesday · Friday  9am – 5pm           │
│  Saturdays (school holidays only)       │
│                                         │
│  🥦 Products                            │
│  [Vegetables] [Meat] [Dairy] [Eggs]    │ ← Product type chips
│  [Baked goods] [Seasonal produce]      │
│                                         │
│  📞 01529 000 000                       │
│  🌐 hargreavesfarm.co.uk               │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  💌 Sign up for ordering waitlist       │ ← F6 widget — always visible
│  Get notified when Hargreaves Farm     │
│  Shop starts taking online orders      │
│  ┌───────────────────────┐ ┌─────────┐ │
│  │ your@email.com        │ │ Notify  │ │
│  └───────────────────────┘ └─────────┘ │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ★ Reviews (18)                         │
│  ┌─────────────────────────────────┐   │
│  │ ⭐⭐⭐⭐⭐  Sarah W.           │   │
│  │ "Brilliant selection of veg..." │   │
│  │ 3 weeks ago                     │   │
│  └─────────────────────────────────┘   │
│  [Write a review]                       │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ⚠ This listing is unclaimed           │ ← Only shown if unclaimed
│  [Claim this listing]                  │ ← Primary CTA for unclaimed
│                                         │
│  ┌─────────────────────────────────────┐│
│  │        [📍 Get Directions]         ││ ← Sticky bottom CTA
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

Skip link: first focusable element on the page is `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>` (WCAG 2.4.1).

---

## Screen 5: Listing Detail — Honesty Box (Distinct Layout)

```
┌─────────────────────────────────────────┐
│ ← Back                                  │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │ ← Hero: 160px (shorter than farm shop)
│ │   [PHOTO — honesty box image]       │ │
│ │                📦 HONESTY BOX       │ │ ← Type badge — top-right
│ └─────────────────────────────────────┘ │
│                                         │
│  Glen Dairy Honesty Box                 │
│  📍 Near Forfar, Angus, Scotland       │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  📦 Currently stocked                  │ ← Prominent status indicator
│  Last updated: 2 hours ago             │   green badge if stocked
│                                         │   grey badge if empty
│  ─────────────────────────────────────  │
│                                         │
│  💳 Payment methods                     │
│  [Cash] [Contactless] [QR code]        │ ← Payment method chips
│                                         │
│  🥛 Usually available                   │
│  [Raw milk] [Cream] [Butter]           │
│                                         │
│  💰 Approximate prices                  │
│  1 pint raw milk · £1.20               │
│                                         │
│  📍 Location                            │
│  End of the track past the red gate,   │
│  on the left. Look for the blue box.   │ ← Free-text location description
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  💌 Sign up for ordering waitlist       │ ← F6 (same as farm shop)
│  ┌───────────────────────┐ ┌─────────┐ │
│  │ your@email.com        │ │ Notify  │ │
│  └───────────────────────┘ └─────────┘ │
│                                         │
│  ⚠ This listing is unclaimed           │ ← If applicable
│  [Claim this listing]                  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │        [📍 Get Directions]         ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

Key differences from farm shop layout:
- Shorter hero image (no elaborate shop exterior to show)
- "Currently stocked" status is the primary information
- Payment methods displayed prominently (essential for visit decision)
- No reviews section (star ratings not a primary use case for anonymous honesty boxes)
- Free-text location description replaces map pin precision

---

*Produced by: ux-design-lead | squad: ux-design*
*Phase: 6 | Feeds: specs/003-farmmap/design-pack/design-tokens.md*
