---
feature: 003-farmmap
phase: 6
document: wireframes-review-and-waitlist
squad: ux-design
produced_by: ux-design-lead
produced_at: 2026-05-17T00:00:00Z
---

# Wireframes — Review Submission and Waitlist

---

## Review Submission Modal

Appears over the listing detail page. Focus trapping inside modal (WCAG 2.1.2).

```
┌─────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ← Dimmed listing detail behind modal
│ ░ ┌──────────────────────────────────┐ │
│ ░ │ [×] Close                        │ │ ← Close button; focus goes here
│ ░ │     (aria-label="Close review    │ │   on modal open; returns focus to
│ ░ │      form")                      │ │   "Write a review" button on close
│ ░ │                                  │ │
│ ░ │  Leave a review                  │ │ ← Modal heading h2
│ ░ │  Hargreaves Farm Shop           │ │
│ ░ │                                  │ │
│ ░ │  ─ Your rating * ─────────────  │ │
│ ░ │                                  │ │
│ ░ │  How was your visit?             │ │
│ ░ │  ┌────────────────────────────┐  │ │ ← Radio group (WCAG V2-C9)
│ ░ │  │ ○ ☆☆☆☆☆ Terrible         │  │ │   role="radiogroup"
│ ░ │  │ ○ ★☆☆☆☆ Poor             │  │ │   legend="Your rating"
│ ░ │  │ ○ ★★☆☆☆ Average          │  │ │   Each option: input[type="radio"]
│ ░ │  │ ○ ★★★☆☆ Good             │  │ │   + label with star display
│ ░ │  │ ○ ★★★★☆ Very good        │  │ │
│ ░ │  │ ● ★★★★★ Excellent ✓      │  │ │ ← Selected state shown
│ ░ │  └────────────────────────────┘  │ │
│ ░ │                                  │ │
│ ░ │  ─ Your review * ──────────────  │ │
│ ░ │                                  │ │
│ ░ │  ┌────────────────────────────┐  │ │ ← <textarea>
│ ░ │  │                            │  │ │   id="review-text"
│ ░ │  │ Tell others about your     │  │ │   aria-label="Your review"
│ ░ │  │ experience...              │  │ │   aria-describedby="review-help
│ ░ │  │                            │  │ │                    review-count"
│ ░ │  │                            │  │ │
│ ░ │  └────────────────────────────┘  │ │
│ ░ │  <span id="review-help">         │ │
│ ░ │  At least 20 characters.         │ │ ← Hint text (id="review-help")
│ ░ │  </span>                         │ │
│ ░ │  <span id="review-count"         │ │
│ ░ │        aria-live="polite">       │ │ ← Live region for character count
│ ░ │  0 / 1000 characters             │ │   (id="review-count")
│ ░ │  </span>                         │ │
│ ░ │                                  │ │
│ ░ │  ┌────────────────────────────┐  │ │
│ ░ │  │  Submit review             │  │ │ ← Primary button; disabled until
│ ░ │  └────────────────────────────┘  │ │   rating selected + ≥20 chars
│ ░ │                                  │ │
│ ░ │  Your review will be checked    │ │
│ ░ │  before it appears on the site. │ │
│ ░└──────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Post-submit "Thank you" state:**
```
│ ░ ┌──────────────────────────────────┐ │
│ ░ │                                  │ │
│ ░ │  ✓ Review submitted!             │ │ ← aria-live="assertive" announces
│ ░ │                                  │ │   this on submission
│ ░ │  Thank you for your review of   │ │
│ ░ │  Hargreaves Farm Shop.          │ │
│ ░ │                                  │ │
│ ░ │  We'll check it and publish it  │ │
│ ░ │  within 24 hours.               │ │
│ ░ │                                  │ │
│ ░ │  [Close]                         │ │ ← Returns focus to listing detail
│ ░ └──────────────────────────────────┘ │
```

---

## Review Display on Listing Detail

```
  ── Reviews (18) ──────────────────────────────
                                              
  ★ 4.2 overall  ████████████████░░░░  4.2/5
                                              
  ┌──────────────────────────────────────────┐
  │ ★★★★★  Sarah W.                          │
  │ Verified visitor · 3 weeks ago           │
  │                                          │
  │ "Brilliant selection of seasonal veg.    │
  │ Janet was incredibly helpful about       │
  │ what was coming in next week. Will       │
  │ definitely come back for the tomatoes    │
  │ in August."                              │
  │                                          │
  │ [Report this review]                     │
  └──────────────────────────────────────────┘
  
  ┌──────────────────────────────────────────┐
  │ ★★★★☆  Marcus O.                         │
  │ Verified visitor · 5 weeks ago           │
  │                                          │
  │ "Cycled out from Guildford — well worth  │
  │ the trip. Good range of dairy produce.  │
  │ Would be great to see online ordering   │
  │ available for delivery."                 │
  │                                          │
  │   ↳ Owner response (Hargreaves Farm):   │ ← Owner response indented
  │   "Thanks Marcus! Online ordering is    │
  │   coming soon — sign up to our list!"   │
  └──────────────────────────────────────────┘
  
  [Show all 18 reviews]  [Write a review]
```

---

## Ordering Waitlist Email Capture Widget

Appears on all listing detail pages. Not gated to claimed listings.

```
  ── 💌 Be the first to order online ──────────
  
  ┌──────────────────────────────────────────┐
  │                                          │
  │  47 people are waiting for Hargreaves   │
  │  Farm Shop to go live with online       │
  │  orders.                                 │
  │                                          │
  │  Join them and we'll email you when     │
  │  ordering goes live.                     │
  │                                          │
  │  ┌──────────────────────────┐ ┌──────┐ │
  │  │ your@email.com           │ │Notify│ │ ← input[type="email"]
  │  └──────────────────────────┘ └──────┘ │   autocomplete="email"
  │                                          │   + <button>
  │  No spam. Unsubscribe any time.         │
  └──────────────────────────────────────────┘
```

**Post-submit confirmation (inline, replaces the form):**
```
  ┌──────────────────────────────────────────┐
  │  ✓ You're on the list!                  │ ← aria-live="polite" announces
  │                                          │
  │  We'll email you at                     │
  │  your@email.com when ordering goes      │
  │  live at Hargreaves Farm Shop.          │
  │                                          │
  │  Check your email for a confirmation.   │
  └──────────────────────────────────────────┘
```

**Already signed up state:**
```
  ┌──────────────────────────────────────────┐
  │  ✓ You're already on the list!          │
  └──────────────────────────────────────────┘
```

---

*Produced by: ux-design-lead | squad: ux-design*
*Phase: 6*
