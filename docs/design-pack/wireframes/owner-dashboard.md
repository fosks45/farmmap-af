---
feature: 003-farmmap
phase: 6
document: wireframes-owner-dashboard
squad: ux-design
produced_by: ux-design-lead
produced_at: 2026-05-17T00:00:00Z
---

# Wireframes — Owner Dashboard

All layouts at 375px CSS width (mobile first). Desktop layout notes included.

---

## Dashboard Home (Performance Metrics)

```
┌─────────────────────────────────────────┐
│ 🌿 FARMMAP           [👤 Account ▼]    │ ← Header; authenticated state
├─────────────────────────────────────────┤
│                                         │
│  Good morning, Janet                    │ ← Personalised greeting
│  Hargreaves Farm Shop                   │ ← Active listing name
│                                         │
│  ── This month ──────────────────────── │
│                                         │
│ ┌──────────────┐  ┌──────────────────┐ │ ← Metric cards; 2-up on mobile
│ │  247          │  │  12              │ │
│ │  Page views  │  │  Map pin views   │ │
│ │  +23% vs last│  │  (impressions)   │ │
│ │  month       │  │                  │ │
│ └──────────────┘  └──────────────────┘ │
│                                         │
│ ┌──────────────┐  ┌──────────────────┐ │
│ │  3            │  │  47              │ │
│ │  Enquiries   │  │  Waitlist subs   │ │
│ │              │  │                  │ │
│ └──────────────┘  └──────────────────┘ │
│                                         │
│  Data updated: 6 hours ago              │ ← Timestamp (spec requirement)
│                                         │
│  ── Your listing ─────────────────────  │
│                                         │
│  Hargreaves Farm Shop         [Edit ›] │ ← Link to edit screen
│  📍 Sleaford, Lincolnshire            │
│  ⭐ 4.2  (18 reviews)                  │
│  Status: ✓ Live · Free tier           │
│                                         │
│  ── Quick actions ─────────────────── │
│                                         │
│  [📸 Add photos]                       │ ← Quick action buttons
│  [🕐 Update opening hours]             │
│  [📦 Mark as temporarily closed]       │
│                                         │
│  ── Upgrade to Bronze ────────────── │ ← Upgrade prompt; always shown at free tier
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ✦ Get more from Farmmap            ││
│  │  A branded shop page + analytics   ││
│  │  for just £20/month                 ││
│  │  [Start free trial →]              ││
│  └─────────────────────────────────────┘│
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ [📋 Listing] [📊 Analytics] [✦ Upgrade]│ ← Bottom nav within dashboard
└─────────────────────────────────────────┘
```

**Bronze tier — same screen, different state:**
Analytics cards are fully populated. Upgrade prompt changes to "Upgrade to Silver"
or is replaced with Silver eligibility tracker (waitlist count vs 20+ threshold).

---

## Listing Edit Screen

```
┌─────────────────────────────────────────┐
│ ← Dashboard           [Save changes]   │ ← Header with prominent Save
├─────────────────────────────────────────┤
│                                         │
│  Edit your listing                      │ ← Page h1
│                                         │
│  ─ Status ────────────────────────────  │
│                                         │
│  ☐ Temporarily closed                  │ ← Toggle; if checked, shows orange
│    Tick this if you're closed for a     │   "Temporarily closed" banner on listing
│    period but will reopen               │
│                                         │
│  ─ Basic information ─────────────────  │
│  [... same fields as Claim Step 3 ...]  │ ← Reuses the claim editing form
│                                         │
│  ─ Photos ────────────────────────────  │
│                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │ ← Uploaded photos grid
│  │[img] │ │[img] │ │[img] │ │  +   │  │   drag to reorder; + = upload new
│  │✓Appr │ │⏳Pend│ │✗Rej  │ │      │  │   status badges on each photo
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│                                         │
│  Rejected photo reason:                 │ ← Inline explanation for rejected photos
│  "Please upload your own photo,         │
│   not a stock image."                   │
│                                         │
│  ─ Managers ──────────────────────────  │
│                                         │
│  Current managers:                      │
│  ┌──────────────────────────────────┐  │
│  │ 👤 Janet Hargreaves (Owner)      │  │ ← Owner — cannot be removed
│  │ 👤 Sarah Hargreaves (Manager) [Remove] │  │
│  └──────────────────────────────────┘  │
│                                         │
│  [+ Invite a manager by email]          │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │        Save changes                 ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## Subscription Tab

```
┌─────────────────────────────────────────┐
│ ← Dashboard                             │
├─────────────────────────────────────────┤
│                                         │
│  Subscription                           │ ← Page h1
│                                         │
│  ─── Current plan ────────────────────  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  FREE                               ││ ← Current tier badge
│  │  Basic listing with map pin         ││
│  │  No monthly fee                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─── Upgrade options ─────────────────  │
│                                         │
│  ┌─────────────────────────────────────┐│ ← Bronze card
│  │  ★ BRONZE                           ││
│  │  £20 / month                        ││
│  │                                     ││
│  │  ✓ Branded shop page                ││
│  │  ✓ Product catalogue (display)      ││
│  │  ✓ Photo gallery (up to 10)         ││
│  │  ✓ Enquiry form                     ││
│  │  ✓ Analytics dashboard              ││
│  │  ✓ Verified owner badge             ││
│  │                                     ││
│  │  14-day free trial available        ││ ← CCR 2013 disclosure visible
│  │                                     ││
│  │  [Start Bronze — 3 months free →]  ││ ← Trial CTA (if in first 50 cohort)
│  │  or [Start Bronze — £20/month]     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│ ← Silver card (dimmed; not yet available)
│  │  ◆ SILVER                           ││
│  │  £60 / month + 3% commission        ││
│  │  on orders over £20                 ││
│  │                                     ││
│  │  ✓ Everything in Bronze             ││
│  │  ✓ Online ordering                  ││
│  │  ✓ Delivery zone management         ││
│  │  ✓ Order management dashboard       ││
│  │                                     ││
│  │  Available when you have 20+        ││ ← Eligibility gate explanation
│  │  ordering waitlist sign-ups or      ││
│  │  after 6 months on Bronze           ││
│  │                                     ││
│  │  Current waitlist: 47 / 20 needed  ││ ← Progress bar
│  │  ████████████████████░░  47/20     ││ ← 20+ means Silver is unlockable
│  │                                     ││
│  │  [Upgrade to Silver →]             ││ ← Active CTA if threshold met
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│ ← Gold card (locked)
│  │  ✦ GOLD                             ││
│  │  £100 / month + 5% commission       ││
│  │  on orders over £30                 ││
│  │                                     ││
│  │  ✓ Everything in Silver             ││
│  │  ✓ Monthly newsletter feature       ││
│  │  ✓ Weekly social media posts        ││
│  │  ✓ Homepage featured placement      ││
│  │  ✓ Priority search ranking          ││
│  │                                     ││
│  │  🔒 Requires: 3 months on Silver   ││
│  │     + 50 completed orders           ││
│  │     (currently 0/50 orders)         ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

**Bronze active state (after upgrade):**
- Current plan card shows "BRONZE ★ · Active"
- Silver card shows waitlist progress + eligibility status
- Gold card shows Silver tenure counter (0 of 3 months)

---

## Bronze/Silver/Gold Upgrade Prompts (Inline in Dashboard)

```
── Dashboard home — Free tier upgrade prompt ─────────────────────
┌─────────────────────────────────────────────────────────────────┐
│  47 people are waiting for Hargreaves Farm Shop to go online   │
│  Bronze unlocks your waitlist data + analytics dashboard        │
│  [See your upgrade options →]                                  │
└─────────────────────────────────────────────────────────────────┘

── Dashboard home — Bronze → Silver prompt (shown when waitlist ≥ 20) ─
┌─────────────────────────────────────────────────────────────────┐
│  ◆ Ready for online orders?                                    │
│  You have 47 waitlist subscribers ready to buy.                │
│  Silver tier starts from £60/month + 3% on orders over £20.   │
│  [Set up online ordering →]                                    │
└─────────────────────────────────────────────────────────────────┘

── Dashboard home — Silver → Gold prompt (shown when eligible) ──────
┌─────────────────────────────────────────────────────────────────┐
│  ✦ You're eligible for Gold!                                   │
│  3 months on Silver ✓  50+ orders ✓                           │
│  Gold adds marketing done for you: newsletter, social posts,   │
│  homepage placement.                                           │
│  [Upgrade to Gold →]                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

*Produced by: ux-design-lead | squad: ux-design*
*Phase: 6*
