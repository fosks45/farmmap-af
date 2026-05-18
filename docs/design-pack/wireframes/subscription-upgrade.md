---
feature: 003-farmmap
phase: 6
document: wireframes-subscription-upgrade
squad: ux-design
produced_by: ux-design-lead
produced_at: 2026-05-17T00:00:00Z
---

# Wireframes — Subscription Upgrade Flows

Bronze, Silver, and Gold upgrade flows. All at 375px CSS width.

---

## Bronze Upgrade Flow

### Pricing Screen

```
┌─────────────────────────────────────────┐
│ ← Back to dashboard                     │
├─────────────────────────────────────────┤
│                                         │
│  ★ Bronze subscription                  │ ← Page h1
│                                         │
│  ┌─────────────────────────────────────┐│ ← Pricing card
│  │  £20 / month                        ││
│  │  Cancel any time                    ││
│  │  Billed monthly                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ── What you get ──────────────────── │
│                                         │
│  ✓ Branded shop page at                │
│    farmmap.co.uk/shops/your-shop-name  │
│  ✓ Display-only product catalogue      │
│    (up to 500 products)                │
│  ✓ Photo gallery (up to 10 photos)     │
│  ✓ Consumer enquiry form               │
│  ✓ Performance analytics dashboard     │
│  ✓ Verified owner badge on map pin     │
│    and listing page                    │
│  ✓ Access to campaign add-ons          │
│    (newsletter: £50, social: £50)      │
│                                         │
│  ── Trial offer (first 50 shops) ──── │ ← Only shown if in first-50 cohort
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  🎁 First 3 months FREE            ││
│  │  Your first billing date:           ││
│  │  [date 90 days from today]          ││
│  │                                     ││
│  │  After that: £20/month.            ││
│  │  Cancel any time during trial.     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ── Your rights ──────────────────── │ ← CCR 2013 / DMCC 2024 disclosures
│                                         │
│  14-day cancellation right: If you     │
│  start today and change your mind      │
│  within 14 days, you can cancel for   │
│  a full refund. Email                  │
│  support@farmmap.co.uk or cancel in   │
│  your dashboard.                       │
│                                         │
│  Auto-renewal: Your subscription       │
│  renews automatically each month.     │
│  We'll email you 3 days before each   │
│  renewal.                              │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Continue to payment →             ││ ← Primary CTA
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Payment Screen

```
┌─────────────────────────────────────────┐
│ ← Back                                  │
├─────────────────────────────────────────┤
│                                         │
│  Payment details                        │ ← Page h1
│                                         │
│  ┌─────────────────────────────────────┐│ ← Order summary
│  │  Bronze subscription                ││
│  │  First 3 months: FREE               ││
│  │  Then: £20.00/month                 ││
│  │  First charge: [date + 90 days]     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│ ← Stripe Elements iframe
│  │  Card number                        ││
│  │  ┌──────────────────────────────┐  ││
│  │  │                              │  ││
│  │  └──────────────────────────────┘  ││
│  │  MM / YY         CVC              ││
│  │  ┌────────┐      ┌────────┐      ││
│  │  │        │      │        │      ││
│  │  └────────┘      └────────┘      ││
│  │                                    ││
│  │  Cardholder name                   ││
│  │  ┌──────────────────────────────┐  ││
│  │  │                              │  ││
│  │  └──────────────────────────────┘  ││
│  └─────────────────────────────────────┘│
│                                         │
│  🔒 Payment secured by Stripe          │
│  Farmmap never sees your card number.  │
│                                         │
│  By subscribing you agree to our       │
│  Terms of Service.                     │ ← Link to /terms
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Start my Bronze subscription      ││ ← Exact charge stated (or £0 for trial)
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Confirmation Screen

```
┌─────────────────────────────────────────┐
│  🌿 FARMMAP                             │
├─────────────────────────────────────────┤
│                                         │
│  ✓ You're on Bronze!                   │ ← Success h1
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Your shop page is live:            ││
│  │  farmmap.co.uk/shops/               ││
│  │  hargreaves-farm-shop-sleaford      ││
│  │                                     ││
│  │  [View your shop page ›]           ││
│  └─────────────────────────────────────┘│
│                                         │
│  Your Bronze badge appears on your     │
│  map pin and listing within 15 minutes.│
│                                         │
│  A confirmation email has been sent to │
│  janet@hargreavesfarm.co.uk            │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │     Go to my dashboard             ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## Silver Upgrade Flow

### Marketplace Consent + Delivery Zone Setup

```
┌─────────────────────────────────────────┐
│ ← Back to dashboard                     │
├─────────────────────────────────────────┤
│                                         │
│  ◆ Set up your online shop              │ ← Page h1
│                                         │
│  ─ Step 1: Marketplace consent ───────  │
│                                         │
│  Before you can take online orders,    │
│  please confirm:                        │
│                                         │
│  ☐ I confirm that my business is       │ ← Checkbox; required before continuing
│    registered with the relevant         │
│    local authority as a food business  │
│    (if applicable)                      │
│                                         │
│  ☐ I understand that commission of     │
│    3% applies to orders with a total   │
│    of £20 or more (not per-item)       │
│                                         │
│  ☐ I understand that cancelling        │
│    Silver does not remove my           │
│    obligation to fulfil pending orders │
│                                         │
│  ─ Step 2: Delivery zones ────────────  │
│                                         │
│  Which areas do you deliver to?         │
│  (Enter postcode prefixes)              │
│  ┌─────────────────────────────────────┐│
│  │ NG34, LN4, LN5, PE10              ││ ← Free text; comma separated
│  └─────────────────────────────────────┘│
│  Example: NG34, NG1, LN1               │
│                                         │
│  Delivery fee (flat rate)               │
│  ┌─────────────────────────────────────┐│
│  │ £ [     ]                           ││
│  └─────────────────────────────────────┘│
│                                         │
│  Minimum order value                    │
│  ┌─────────────────────────────────────┐│
│  │ £ [     ]   (leave blank for none)  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Continue to payment →             ││ ← Disabled until all checkboxes ticked
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## Gold Upgrade Flow

### Eligibility Gate Screen (Not Yet Eligible)

```
┌─────────────────────────────────────────┐
│ ← Back to dashboard                     │
├─────────────────────────────────────────┤
│                                         │
│  ✦ Gold subscription                    │ ← Page h1
│                                         │
│  ┌─────────────────────────────────────┐│ ← Locked state card
│  │  🔒 Gold is not yet available       ││
│  │  for your shop                      ││
│  │                                     ││
│  │  Gold is available after:           ││
│  │                                     ││
│  │  ☐ 3 months on Silver              ││ ← Progress indicator; checked when met
│  │    (0 of 3 months)                 ││
│  │    ░░░░░░░░░░  0%                  ││
│  │                                     ││
│  │  ☐ 50 completed orders             ││
│  │    (0 of 50)                        ││
│  │    ░░░░░░░░░░  0%                  ││
│  │                                     ││
│  │  Why this gate exists:              ││
│  │  Gold includes a managed marketing  ││
│  │  service. We feature shops in our  ││
│  │  newsletter and on social media.   ││
│  │  We want to make sure your shop    ││
│  │  has proven ordering capability    ││
│  │  before we feature it.             ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─ What Gold includes ────────────────  │
│                                         │
│  ✓ Everything in Silver                 │
│  ✓ Monthly newsletter feature           │
│  ✓ 4 social media posts per month       │
│  ✓ Homepage featured placement          │
│  ✓ Priority search ranking              │
│  ✓ 1 blog post per quarter              │
│  ✓ Up to 1,000 products in catalogue    │
│                                         │
│  £100/month + 5% on orders over £30    │
│                                         │
└─────────────────────────────────────────┘
```

### Eligibility Gate Screen (Eligible — Full)

```
┌─────────────────────────────────────────┐
│ ← Back                                  │
├─────────────────────────────────────────┤
│                                         │
│  ✦ Gold subscription                    │
│                                         │
│  ✓ You're eligible!                     │ ← Success state
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ✓ 3 months on Silver              ││
│  │    ████████████████████  100%      ││
│  │                                     ││
│  │  ✓ 50+ completed orders            ││
│  │    ████████████████████  63 orders ││
│  └─────────────────────────────────────┘│
│                                         │
│  [… feature list and pricing …]         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Upgrade to Gold — £100/month →   ││ ← Active CTA
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

*Produced by: ux-design-lead | squad: ux-design*
*Phase: 6*
