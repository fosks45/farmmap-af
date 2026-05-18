---
feature: 003-farmmap
phase: 6
document: wireframes-listing-claim
squad: ux-design
produced_by: ux-design-lead
produced_at: 2026-05-17T00:00:00Z
---

# Wireframes — Listing Claim Flow

3-step claim flow. All layouts at 375px CSS width.
F3 spec: completable in under 5 minutes by a non-technical user.

---

## Step 1: Email Entry

```
┌─────────────────────────────────────────┐
│ ← Cancel                                │ ← Returns to listing detail
├─────────────────────────────────────────┤
│                                         │
│  Step 1 of 3                            │ ← Progress indicator
│  ●─────────────────○────────────────○  │   filled ● = current; open ○ = future
│                                         │
│  Claim this listing                     │ ← Page h1
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ [FARM SHOP NAME]                    ││ ← Listing name displayed for confirmation
│  │ Hargreaves Farm Shop                ││
│  │ Sleaford, Lincolnshire              ││
│  └─────────────────────────────────────┘│
│                                         │
│  Your name *                            │ ← Required fields marked with *
│  ┌─────────────────────────────────────┐│
│  │                                     ││ ← input[name="name"] autocomplete="name"
│  └─────────────────────────────────────┘│
│                                         │
│  Your role at this business *           │
│  ┌─────────────────────────────────────┐│
│  │ ▼ Select your role                  ││ ← <select> element
│  └─────────────────────────────────────┘│
│   Options: Owner · Partner · Manager    │
│            Family member · Employee     │
│            Other                        │
│                                         │
│  Business email address *               │
│  ┌─────────────────────────────────────┐│
│  │                                     ││ ← input[type="email"] autocomplete="email"
│  └─────────────────────────────────────┘│
│  We'll send a verification link         │
│  to this address.                       │ ← Helper text below field
│                                         │
│  ┌─────────────────────────────────────┐│
│  │     Continue →                      ││ ← Primary CTA button
│  └─────────────────────────────────────┘│
│                                         │
│  By continuing, you agree to            │
│  Farmmap's Terms of Service.            │ ← Plain English; link to /terms
└─────────────────────────────────────────┘
```

**Validation errors (Step 1):**
```
  Business email address *
  ┌─────────────────────────────────────┐
  │ not-an-email                        │  ← Red border: color-status-error
  └─────────────────────────────────────┘
  ⚠ Please enter a valid email address  ← error text with aria-describedby
    linked to the input's id
```

---

## Step 2: Email Verification Pending

```
┌─────────────────────────────────────────┐
│ ← Back                                  │
├─────────────────────────────────────────┤
│                                         │
│  Step 2 of 3                            │
│  ●──────────────●───────────────────○  │
│                                         │
│  Check your email                       │ ← Page h1
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  📧                                 ││ ← Envelope illustration (decorative,
│  │  We sent a verification link to     ││   aria-hidden)
│  │  janet@hargreavesfarm.co.uk         ││
│  │                                     ││
│  │  Click the link in the email        ││
│  │  to continue. The link expires      ││
│  │  in 24 hours.                       ││
│  └─────────────────────────────────────┘│
│                                         │
│  Didn't receive the email?              │
│                                         │
│  Check your spam folder first, then:   │
│  [Resend verification email]            │ ← Secondary button; available after 2 min
│                                         │
│  Wrong email address?                   │
│  [← Go back and change it]             │ ← Returns to Step 1 with pre-filled data
└─────────────────────────────────────────┘
```

**Resend state (after clicking Resend):**
```
  ✓ Verification email resent            ← Success message; focus moved to it
  (aria-live="polite" announces this)
```

---

## Step 3: Edit Listing Form (Post-Verification)

```
┌─────────────────────────────────────────┐
│  Your listing                    [Save] │ ← Header with Save action
├─────────────────────────────────────────┤
│                                         │
│  Step 3 of 3                            │
│  ●──────────────●──────────────────●   │
│                                         │
│  ✓ Email verified! Update your         │ ← Success banner
│    listing details.                     │
│                                         │
│  ── Basic information ─────────────── │
│                                         │
│  Listing name *                         │
│  ┌─────────────────────────────────────┐│
│  │ Hargreaves Farm Shop                ││ ← Pre-filled from seeded data
│  └─────────────────────────────────────┘│
│                                         │
│  Description                            │
│  ┌─────────────────────────────────────┐│
│  │                                     ││ ← <textarea> maxlength=500
│  │                                     ││   rows=4
│  └─────────────────────────────────────┘│
│  0 / 500 characters                     │
│                                         │
│  ── Address ──────────────────────── │
│                                         │
│  Street address *                       │
│  ┌─────────────────────────────────────┐│
│  │ Mill Farm, Sleaford Road            ││
│  └─────────────────────────────────────┘│
│                                         │
│  Town / Village *                       │
│  ┌─────────────────────────────────────┐│
│  │ Sleaford                            ││
│  └─────────────────────────────────────┘│
│                                         │
│  County *                               │
│  ┌─────────────────────────────────────┐│
│  │ ▼ Lincolnshire                      ││
│  └─────────────────────────────────────┘│
│                                         │
│  Postcode *                             │
│  ┌─────────────────────────────────────┐│
│  │ NG34 0AA                            ││ ← input autocomplete="postal-code"
│  └─────────────────────────────────────┘│
│                                         │
│  ── Opening hours ─────────────────── │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Opening hours editor             │  │ ← Custom hours editor
│  │                                  │  │
│  │ [+ Add opening period]           │  │
│  │                                  │  │
│  │ Period 1:                        │  │
│  │ Days: [Mon][Tue][Wed][Thu][Fri]  │  │ ← Multi-select toggle buttons
│  │       [Sat][Sun]                 │  │
│  │ Opens: [09:00 ▼]  Closes: [17:00▼]  │  │
│  │ [Remove this period]             │  │
│  │                                  │  │
│  │ ☐ Seasonal (e.g. April–October) │  │ ← Checkbox reveals date range
│  │ ☐ Temporarily closed            │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ── Products ──────────────────────── │
│                                         │
│  What do you sell?                      │
│  ┌──────────────────────────────────┐  │
│  │ [✓ Vegetables] [✓ Meat]          │  │ ← Multi-select chips
│  │ [  Dairy     ] [✓ Eggs]          │  │
│  │ [✓ Baked goods] [  Fish  ]       │  │
│  │ [  Honey     ] [  Preserves]     │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ── Contact details ───────────────── │
│                                         │
│  Phone (optional)                       │
│  ┌─────────────────────────────────────┐│
│  │                                     ││ ← input[type="tel"] autocomplete="tel"
│  └─────────────────────────────────────┘│
│                                         │
│  Website (optional)                     │
│  ┌─────────────────────────────────────┐│
│  │                                     ││ ← input[type="url"] autocomplete="url"
│  └─────────────────────────────────────┘│
│                                         │
│  ── Photos ────────────────────────── │
│                                         │
│  Add photos (up to 10)                  │
│  ┌────────────────────────┐            │
│  │  [+] Upload photos     │            │ ← File input; accepts JPG/PNG; max 5MB
│  │                        │            │   aria-label="Upload listing photos"
│  └────────────────────────┘            │
│  Photos are reviewed before display.   │ ← Set expectation for moderation
│                                         │
│  ── Managers ──────────────────────── │
│                                         │
│  Add a colleague to help manage        │
│  this listing                           │
│  ┌─────────────────────────────────────┐│
│  │ colleague@business.com              ││
│  └─────────────────────────────────────┘│
│  [+ Invite manager by email]            │ ← Sends invitation email
│                                         │
│  ┌─────────────────────────────────────┐│
│  │     Save and finish                 ││ ← Primary CTA
│  └─────────────────────────────────────┘│
│  Your listing will be live immediately.│
└─────────────────────────────────────────┘
```

---

## Claim Done Screen

```
┌─────────────────────────────────────────┐
│  🌿 FARMMAP                             │
├─────────────────────────────────────────┤
│                                         │
│  ✓ Listing claimed!                     │ ← Page h1; success state
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Your listing is live on Farmmap.   ││
│  │                                     ││
│  │  Hargreaves Farm Shop               ││
│  │  Sleaford, Lincolnshire             ││
│  │                                     ││
│  │  [View your listing ›]              ││ ← Link to listing detail page
│  └─────────────────────────────────────┘│
│                                         │
│  What's next?                           │
│                                         │
│  ├ 📊 Set up your dashboard            │ ← Link to owner dashboard home
│  │   See who's finding your shop       │
│  │                                     │
│  ├ 📸 Add photos                       │ ← Link to dashboard photos
│  │   Listings with photos get 3×       │
│  │   more views                        │
│  │                                     │
│  ├ 👥 Invite a colleague               │ ← Link to managers
│  │   Add a manager to help you         │
│  │                                     │
│  └ ✦ Upgrade to Bronze                 │ ← Bronze upgrade CTA
│    Get a branded shop page and         │
│    performance analytics for £20/month │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │     Go to my dashboard             ││ ← Primary CTA
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

*Produced by: ux-design-lead | squad: ux-design*
*Phase: 6*
