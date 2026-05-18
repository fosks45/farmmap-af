---
feature: 003-farmmap
phase: 6
document: user-flows
squad: ux-design
produced_by: ux-design-lead
produced_at: 2026-05-17T00:00:00Z
authority: >
  specs/003-farmmap/spec.md
  + specs/003-farmmap/personas-pack/personas.md
  + specs/003-farmmap/design-pack/information-architecture.md
---

# Farmmap — User Flows

All primary user flows with trigger, steps, happy exit, and error path.

---

## Primary Flows (Required by Brief)

---

### Flow 1: Impulse Discovery (P1/P2 Consumer)

**Trigger:** Consumer opens Farmmap while out — in a car, on a walk, at a pub.
No prior intent to research; pure impulse.

| Step | Screen | Action | System Response |
|---|---|---|---|
| 1 | Home / Map | App loads | SSR map renders with all pins visible in current viewport; no login required |
| 2 | Home / Map | User sees a nearby pin | Pin is visually distinct by tier and listing type |
| 3 | Home / Map | User taps pin | Pin expands to mini-card: listing name, type badge, star rating if available |
| 4 | Home / Map | User taps mini-card or "View details" | Navigate to Listing Detail page |
| 5 | Listing Detail | User reads listing: name, hours, products | SSR content fully visible without JS |
| 6 | Listing Detail | User taps "Directions" | Native maps app opens with pre-filled address |

**Happy exit:** Native maps app opened; user is navigating to the farm shop.

**Error paths:**
- Map tiles fail to load → show a tile error state with offline indicator; listing
  list view is available as fallback (accessible list of nearby listings)
- Pin tap on a listing with no detail data → listing detail loads with seeded data
  only; "Claim this listing" prominently shown
- Geolocation not available → map loads centred on UK; user can type a location
  in the search bar
- Directions link on Android → opens Google Maps; on iOS → opens Apple Maps; on
  desktop → opens Google Maps in a new tab

---

### Flow 2: Listing Claim (P3/P4 Owner)

**Trigger:** Owner (or their representative) arrives on an unclaimed listing detail
page and sees the "Claim this listing" call to action.

| Step | Screen | Action | System Response |
|---|---|---|---|
| 1 | Listing Detail (unclaimed) | Owner taps "Claim this listing" | Redirects to Claim Listing — Step 1 (Email) |
| 2 | Claim Step 1 | Owner enters: name, role ("I am the owner / manager / family member"), business email | Validation: email format check; role is required |
| 3 | Claim Step 1 | Owner submits | System sends verification email; navigates to Claim Step 2 (Verify) with pending state |
| 4 | Claim Step 2 | Owner's email inbox | Receives email: "Verify your Farmmap listing claim — click here" | Link valid for 24 hours |
| 5 | Claim Step 2 | Owner clicks verification link | System verifies the token; navigates to Claim Step 3 (Edit) |
| 6 | Claim Step 3 | Owner edits listing: name, address, hours, products, contact details | All fields editable; photos uploadable (enter moderation queue) |
| 7 | Claim Step 3 | Owner saves | System confirms; navigates to Claim Done screen |
| 8 | Claim Done | Owner sees confirmation | "Your listing is live. View your dashboard." link |

**Add manager (Step 6 extension):**
After claiming, owner can navigate to Dashboard → Managers to add additional managers
(email invitation, role: manager). This is available from the Claim Done screen with
a secondary CTA "Add a colleague as a manager".

**Happy exit:** Owner redirected to Owner Dashboard — Home; listing now shows "Claimed"
state; claim prompt replaced by "Managed listing" badge.

**Error paths:**
- Email already registered to an account → prompt to log in first; claim is associated
  with the existing account
- Listing already claimed → "This listing has been claimed. If you believe this is
  incorrect, contact us" with mailto link
- Verification link expired (>24h) → "This link has expired. Request a new one"
  with resend option; resend requires the original email address to be entered again
- Email not received → "Resend verification email" option on Step 2 screen; secondary
  CTA after 2 minutes

---

### Flow 3: Bronze Upgrade (P3/P4 Owner)

**Trigger:** Owner in their dashboard sees the Bronze upgrade prompt or navigates
directly to the Subscription tab.

| Step | Screen | Action | System Response |
|---|---|---|---|
| 1 | Dashboard — Subscription | Owner views current tier (Free) | UI shows tier comparison; Bronze CTA prominent |
| 2 | Bronze Upgrade — Pricing | Owner views Bronze pricing page | Full feature list, £20/month, trial offer (if applicable: "First 3 months free"), 14-day cancellation right prominently displayed |
| 3 | Bronze Upgrade — Pricing | Owner clicks "Start Bronze" | Redirects to Bronze Upgrade — Payment |
| 4 | Bronze Upgrade — Payment | Stripe Elements form rendered | Pre-contractual information displayed above form (CCR 2013 compliance) |
| 5 | Bronze Upgrade — Payment | Owner enters card details | Stripe handles card input; Farmmap never sees card data |
| 6 | Bronze Upgrade — Payment | Owner clicks "Start my Bronze subscription" | Stripe processes payment; webhook fires; subscription created |
| 7 | Bronze Upgrade — Confirmation | Confirmation screen | "You're on Bronze. Your shop page is live at farmmap.co.uk/shops/[slug]" |

**Post-confirmation (within 15 minutes):**
- Bronze badge appears on map pin
- Verified badge appears on listing detail page
- Branded shop page goes live at `/shops/[slug]`
- Welcome email sent to owner

**Happy exit:** Owner on confirmation screen; Bronze badge visible on their listing;
shop page live.

**Error paths:**
- Payment fails → error displayed in Stripe Elements form; "Check your card details
  and try again"; no partial state created
- Payment declined (insufficient funds) → friendly error: "Your card was declined.
  Please try a different payment method."
- Stripe webhook delayed → subscription confirmation may take up to 60 seconds;
  show "Processing..." state with spinner; do not double-charge on retry
- Owner navigates away during payment → Stripe Elements state is preserved on return
  within the same session; no charge created unless the final form submission completed

---

### Flow 4: Consumer Review Submission (P2 Consumer)

**Trigger:** Consumer visits a listing detail page after a real visit and wants to
leave a review.

| Step | Screen | Action | System Response |
|---|---|---|---|
| 1 | Listing Detail | Consumer taps "Write a review" | Check auth state |
| 2a | If not authenticated | Redirect to Account — Sign In or inline magic-link prompt | |
| 2b | Sign In | Consumer enters email; receives magic link; clicks link | Account created/verified; redirects back to listing detail |
| 3 | Review Submission Modal | Modal opens (overlaid on listing detail) | Focus moves to modal; focus trapped within modal |
| 4 | Review Submission Modal | Consumer selects star rating (accessible radio group) | Star highlight provides visual feedback; rating is required |
| 5 | Review Submission Modal | Consumer enters review text | Character count shown: "142 / 1000 characters"; minimum 20 characters enforced |
| 6 | Review Submission Modal | Consumer submits | Optimistic UI: "Thank you — your review is being reviewed and will appear shortly" |
| 7 | Review Submission Modal | Modal closes; returns to listing detail | No review visible yet (pending moderation) |
| 8 | Moderation queue | Admin reviews within 24 hours | Approve: review goes live; Reject: notification sent to reviewer with reason |

**Happy exit:** Consumer sees "Thank you" state; review enters moderation queue.

**Error paths:**
- Review text too short (<20 chars) → inline validation error: "Please write at least
  20 characters to help other visitors"
- Review text too long (>1000 chars) → character counter turns red; submit button
  disabled until within limit
- Spam detected (automated) → soft reject: "We couldn't post your review right now.
  Please try again later." No indication of reason to avoid gaming
- Submit fails (network error) → "Something went wrong. Your review was not submitted.
  Please try again." with retry button; review text is preserved in local state

---

### Flow 5: Admin Moderation (P5 Alex, Admin)

**Trigger:** Alex reviews the admin console listing moderation queue (daily routine).

| Step | Screen | Action | System Response |
|---|---|---|---|
| 1 | Admin Home | Alex loads admin home | Queue counts displayed: Listing queue [N], Photo queue [N], Review queue [N] |
| 2 | Listing Queue | Alex navigates to listing queue | Table view: listing name, type, country, submitted date, days-in-queue |
| 3 | Listing Queue — Detail | Alex clicks a listing row | Detail view: all submitted fields, map preview of pin location, seeded data comparison |
| 4 | Listing Queue — Detail | Alex reviews and approves | Single click "Approve"; listing goes live; audit trail entry created |
| 5 | Listing Queue — Detail | Alex reviews and rejects | "Reject" button opens reason field; reason sent to submitter; audit trail entry |
| 6 | Listing Queue — Detail | Alex needs more info | "Request info" sends email to submitter with specific question; listing held |
| 7 | Photo Queue | Alex navigates to photo queue | Grid view of pending photos with listing name |
| 8 | Photo Queue — Bulk | Alex selects multiple obvious approvals | Checkboxes on photos; "Approve selected (N)" bulk action |
| 9 | Photo Queue — Bulk | Alex confirms bulk approve | Up to 50 photos approved in one action; each individually logged in audit trail |

**Happy exit:** Queue processed; listings and photos go live or are rejected with reasons.

**Error paths:**
- Conflicting data (e.g., new submission vs existing listing name conflict) → "Flag
  for manual review" button; flags item to a separate "Conflicts" queue
- Audit trail write failure → system-level error; listing action is rolled back;
  Alex notified that the action failed and must be retried
- Photo in queue already rejected by another admin → "Already actioned" state shown;
  skip option

---

## Additional Flows

---

### Flow 6: Ordering Waitlist Signup (F6 — All Consumers)

**Trigger:** Consumer on any listing detail page notices the waitlist widget —
"Get notified when [Farm Name] starts taking online orders."

| Step | Screen | Action | System Response |
|---|---|---|---|
| 1 | Listing Detail | Consumer sees waitlist widget (always visible) | Widget shows: "Be the first to order from [Farm Name]" + email field |
| 2 | Listing Detail | Consumer enters email | Email format validation |
| 3 | Listing Detail | Consumer submits | Optimistic confirmation: "You're on the list! We'll email you when ordering goes live." |
| 4 | Email inbox | Consumer receives confirmation email | Contains one-click unsubscribe link |

**Happy exit:** Consumer on waitlist; confirmation shown inline; no account required.

**Error paths:**
- Invalid email → inline validation before submit
- Email already on this listing's waitlist → "You're already signed up!" message;
  no duplicate created
- Submit fails → error with retry option; email preserved in field

---

### Flow 7: Silver Ordering Flow (F8 — Silver Shop Consumer)

**Trigger:** Consumer visits a Silver-tier listing detail page or shop page and
sees "Add to basket" on a product.

| Step | Screen | Action | System Response |
|---|---|---|---|
| 1 | Silver/Gold Shop Page | Consumer browses products; allergen info visible | |
| 2 | Silver/Gold Shop Page | Consumer taps "Add to basket" | Product added; basket counter in header increments |
| 3 | Basket / Checkout | Consumer reviews basket | Order subtotal shown; commission threshold note if subtotal < £20 |
| 4 | Checkout | Consumer enters delivery details | Delivery zone validation against shop's configured postcodes |
| 5 | Checkout | Consumer selects delivery slot | Available slots from shop's configuration |
| 6 | Checkout — Payment | Consumer enters payment details (Stripe Elements) | Stock reservation created (15-minute hold) |
| 7 | Order Confirmation | Payment confirmed | Order created; consumer receives confirmation email; owner notified of new order |
| 8 | Owner Dashboard — Orders | Owner accepts order | Consumer notified: "Your order has been accepted" |

**Happy exit:** Order confirmed; consumer and owner both notified.

**Error paths:**
- Item out of stock (race condition) → "Sorry, this item is now out of stock" at
  checkout; item removed from basket automatically
- Delivery postcode not in shop's zone → error at delivery step with
  "We don't deliver to [postcode]" and suggestion to contact shop directly
- Stock reservation expired (15 min) → "Your basket has expired. Items have been
  released." redirect back to shop page to rebuild basket

---

### Flow 8: Admin Photo Moderation (Detailed — P5 Admin)

**Trigger:** New photos arrive from a listing owner's upload via F4 Listing Management.

| Step | Screen | Action | System Response |
|---|---|---|---|
| 1 | Photo Queue | Alex sees photos in queue with listing context | Grid view: photo thumbnail, listing name, date submitted |
| 2 | Photo Queue | Alex identifies obvious approvals (farm photos, clearly relevant) | Multi-select checkboxes |
| 3 | Photo Queue | Alex bulk-approves | "Approve selected (N)" processes up to 50; each logged individually |
| 4 | Photo Queue | Alex sees a borderline photo | Single photo review: larger preview, listing context, approve/reject/flag |
| 5 | Photo Queue — Reject | Alex rejects a photo with reason | Reason required: "Not relevant to the listing", "Inappropriate content", "Stock photography suspected" |
| 6 | Owner notification | System sends email to owner | "Your photo was not approved: [reason]. Please review our photo guidelines." |

---

### Flow 9: Cooperative Bulk Claim (P6 Brigid — V1 Manual Path)

**Note:** F17 (Bulk Listing Claim) is at v1 handled manually via admin request.
The self-serve bulk claim is a Should-Have feature for v2.

**Trigger:** Brigid (cooperative manager) contacts Farmmap admin to request bulk
claim of 12 listings.

| Step | Screen | Action | System Response |
|---|---|---|---|
| 1 | Email / Support | Brigid submits a bulk claim request | Provides: cooperative legal name, registered address, names + email addresses of 12 farm operators, evidence of cooperative membership |
| 2 | Admin Console — User Management | Alex receives request; verifies cooperative identity | Creates a cooperative account; links 12 operator accounts as managers |
| 3 | Admin Console — Listings | Alex bulk-transfers listings to cooperative account | Each listing assigned to the cooperative account; individual operators added as managers |
| 4 | Owner notifications | Each operator receives invitation email | "Your listing has been claimed by [Cooperative Name]. You are listed as a manager." |
| 5 | Dashboard | Brigid can see all 12 listings in her dashboard under the cooperative account | |

**Happy exit:** 12 listings claimed; Brigid has a single account managing all 12;
individual operators are managers of their own listings.

---

### Flow 10: Cookie Consent Interaction (All Visitors)

**Trigger:** First visit to any Farmmap page; no consent cookie present.

| Step | Screen | Action | System Response |
|---|---|---|---|
| 1 | Any page (first visit) | Page loads | SSR content renders immediately (no consent gate on content) |
| 2 | Any page | Cookie consent banner appears at bottom | Focus moves to banner's first interactive element |
| 3 | Banner | Visitor reads options | Two buttons: "Accept all" / "Accept necessary only" + "Manage preferences" link |
| 4a | Banner | Visitor clicks "Accept all" | `fm_consent` cookie set with all categories accepted; Plausible/GA4 loads |
| 4b | Banner | Visitor clicks "Accept necessary only" | `fm_consent` cookie set with strictly_necessary only; analytics do not load |
| 4c | Banner | Visitor clicks "Manage preferences" | Expanded panel shows per-category toggles; visitor can toggle each; confirms with "Save preferences" |
| 5 | All subsequent pages | Consent respected | No banner shown; analytics fire (or not) per consent state |
| 6 | Footer — "Cookie settings" | Visitor wants to change preferences | Opens same consent panel; allows withdrawal of previously given consent |

**Happy exit:** Consent choice recorded; banner dismissed; consent respected throughout session and on return visits.

**Error paths:**
- Visitor presses Escape on banner → treated as "Accept necessary only"; banner
  dismissed; analytics do not load
- `fm_consent` cookie deleted by user → banner shown again on next visit; previous
  consent not inferred

---

*Produced by: ux-design-lead | squad: ux-design*
*Authority: specs/003-farmmap/spec.md + personas-pack + information-architecture.md*
*Phase: 6 | Feeds: specs/003-farmmap/design-pack/wireframes/*
