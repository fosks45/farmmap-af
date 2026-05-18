---
feature: 003-farmmap
phase: 5
document: device-matrix
squad: platform-strategy
produced_by: platform-strategy-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md
  + specs/003-farmmap/personas-pack/personas.md
  + specs/003-farmmap/compliance-pack/compliance-decision.md
---

# Farmmap — Device Matrix

## Platform Decision

Farmmap is a map-first, mobile-first product. No native iOS or Android applications
are built at v1–v3. The product is delivered as a progressive web application (PWA)
served over responsive web.

**Distribution target:**
- 65% mobile web
- 20% tablet web
- 15% desktop web

---

## Persona-to-Device Mapping

| Persona | Device | Browser | Use Context | Priority |
|---|---|---|---|---|
| P1 Sarah (Weekend Forager) | iPhone (mid-range) | iOS Safari | In-car passenger (parked), sofa in the evening | P1 — highest volume consumer |
| P2 Marcus (Ethical Foodie) | Android phone (Pixel 7 class) | Chrome for Android | On foot, pre-trip planning at home | P1 — mobile web |
| P3 Janet (Reluctant Digitaliser) | iPad (home), iPhone (in shop) | Safari (both) | Admin at home on iPad; checking listing on iPhone | P2 — tablet + mobile |
| P4 Tom (Digital-Native) | MacBook (admin), iPhone (in field) | Safari (both) | Owner dashboard on MacBook; checking map/orders in field on iPhone | P2 — desktop admin + mobile field |
| P5 Alex (Admin) | MacBook | Safari or Chrome | Admin console — listing moderation, photo queue, subscription management | P3 — desktop admin only |
| P6 Brigid (Cooperative) | Windows laptop | Chrome or Edge | Cooperative listing management, data export, compliance documentation | P3 — desktop web |

---

## Device Capability Tiers

### Tier 1: Standard Mobile (Primary — 65% of sessions)

**Representative device:** iPhone 13 / Samsung Galaxy A52 class
**Connection:** 4G LTE (average UK rural: 20–50 Mbps download; some dead spots at 2–3G)
**Screen:** 375–390px CSS width
**Browser:** Safari 17+ (iOS), Chrome 120+ (Android)
**Capabilities:** Service workers, Web Share API, Geolocation API, PWA install prompt
**JavaScript:** Full ES2020+ support

This is the primary design and performance target. Every interactive user flow —
map discovery, pin click, listing detail, claim flow, Bronze upgrade — must be
designed first for a 375px-wide iOS Safari session on 4G.

### Tier 2: Low-End Mobile (Rural Coverage — important for farm shop owners)

**Representative device:** iPhone SE (2nd gen), Samsung Galaxy A32, older mid-range
Android circa 2019–2021
**Connection:** 3G or weak 4G (rural UK: common in agricultural areas; farm shop
owners checking their dashboard from a barn may be on EDGE)
**Screen:** 320–375px CSS width
**Browser:** Safari 15+ (iOS), Chrome 100+ (Android)
**Capabilities:** Geolocation, limited service worker support; no PWA install on older
Android WebView

This tier is critical for the owner-side product. Janet (P3) in her farm shop is
on an older iPhone. Tom (P4) in a field may be on a weak signal. The owner dashboard,
claim flow, and listing editing flows must be functional on this tier, not just on
Tier 1.

### Tier 3: Tablet Web (20% of sessions)

**Representative device:** iPad (9th/10th gen), iPad Air
**Connection:** WiFi at home; cellular if iPad has SIM
**Screen:** 768–820px CSS width (portrait); 1024–1180px (landscape)
**Browser:** Safari 17+ (iOS/iPadOS)

Janet uses an iPad at home for banking and recipe browsing. The Farmmap map on iPad
in landscape should display more of the map canvas and more listing information in
the detail panel without requiring a tap to reveal content. Tablet layout is not a
separate product — it is a responsive enhancement where the breakpoint at 768px
provides a richer layout.

### Tier 4: Desktop Web (15% of sessions)

**Representative device:** MacBook (P4, P5), Windows laptop (P6)
**Connection:** Broadband WiFi (>50 Mbps typically)
**Screen:** 1280–1440px CSS width
**Browser:** Safari 17+ (macOS), Chrome 120+, Edge 120+

Desktop is primarily the owner dashboard and admin console. The consumer map on
desktop is a secondary surface; it should work correctly but does not drive consumer
acquisition (P1 and P2 discover on mobile). Desktop receives the richest layout:
persistent sidebar for listing details alongside the map, larger admin tables,
multi-column form layouts.

---

## PWA Configuration

**Install prompt:** Shown to returning users after their second visit. Not shown
on first visit (impulse discovery use case must not be interrupted). Not shown
in the admin console.

**Service worker:** Cache-first for the application shell (navigation, UI components).
Network-first for map data and listing detail (content must be current). Offline
experience is not required at v1; if the network is unavailable, show a graceful
"no connection" state rather than a blank screen.

**Web App Manifest:**
- `display: standalone` — removes browser chrome when installed
- `theme_color`: `color-brand-primary` token value
- `background_color`: `color-surface-default` token value
- Icon set: 192px and 512px maskable icons
- `start_url`: `/` (map home)
- `scope`: `/`

**iOS Safari behaviour note:** iOS Safari does not support push notifications for
PWAs as of 2025 (limited support in iOS 16.4+ but not reliable). Do not design
any user flow that depends on push notification delivery on iOS. Email is the only
reliable async notification channel for all device tiers.

---

## No-Native-App Rationale

Per the spec (Won't Have section): "A responsive, mobile-first web application
covers the primary use case. A native app adds distribution complexity (App Store/
Play Store), update friction, and push notification infrastructure without a v1–v3
use case that cannot be served by the web application."

For reference: Apple App Store review takes 24–72 hours minimum per build; Google
Play takes 2–7 days for new apps. The map discovery use case is not harmed by
web delivery. The only feature that native would materially improve is background
push notifications (e.g., "New farm shop opened near you") — deferred to a future
version if warranted by consumer engagement data.

---

*Produced by: platform-strategy-lead | squad: platform-strategy*
*Authority: specs/003-farmmap/spec.md + personas-pack/personas.md*
*Phase: 5 | Feeds: specs/003-farmmap/architecture-pack/ + design-pack/*
