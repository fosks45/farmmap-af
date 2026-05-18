# Farmmap

**Find local. Support local.**

The definitive map-first directory of farm shops and honesty boxes across the UK and Ireland. Launches with 953 verified listings. Mobile-first, SEO-first, built with Next.js 14 + Supabase + Stripe.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Supabase CLI](https://supabase.com/docs/guides/cli): `npm install -g supabase`
- [Stripe CLI](https://stripe.com/docs/stripe-cli): for local webhook testing
- [MapTiler](https://www.maptiler.com/) free account (1,000 map loads/day free)

---

## First-time setup

### 1. Clone and install

```bash
git clone https://github.com/fosks45/farmmap-af.git
cd farmmap-af
npm install
```

### 2. Supabase setup

**Option A — Local development (recommended):**
```bash
supabase start        # starts local Postgres + Auth + Storage
supabase db push      # runs all 6 migrations (creates schema + seed data)
```

**Option B — Hosted Supabase project (free tier):**
1. Create a project at [supabase.com](https://supabase.com) — choose **London (eu-west-2)** region
2. Enable PostGIS: `Extensions → PostGIS → Enable`
3. Copy your project URL and keys
4. `supabase link --project-ref [your-project-ref]`
5. `supabase db push`

After running migrations you will have:
- All 15 tables with RLS policies
- 5 SAMPLE listings for development (farm_shop, honesty_box, farm_gate_stall) in `county/lincolnshire`
- A `farmmap.co.uk` directory record
- All indexes including PostGIS spatial index

### 3. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_MAPLIBRE_STYLE_URL` | MapTiler → Maps → your map → Style URL + `?key=[your-key]` |
| `STRIPE_SECRET_KEY` | [Stripe dashboard](https://dashboard.stripe.com) → Developers → API keys (use `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Set up in Step 4 |
| `STRIPE_BRONZE_PRICE_ID` | Create in Stripe: Products → Add product → £20/month recurring |
| `STRIPE_SILVER_PRICE_ID` | Create in Stripe: £60/month recurring |
| `STRIPE_GOLD_PRICE_ID` | Create in Stripe: £100/month recurring |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for dev |
| `ENCRYPTION_KEY` | `openssl rand -hex 32` |
| `EMAIL_HMAC_KEY` | `openssl rand -hex 32` |

### 4. Stripe webhook (local)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` signing secret into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### 5. MapTiler (free map tiles)

1. Create a free account at [maptiler.com](https://www.maptiler.com/)
2. Create a new map → copy the Style URL
3. Add `?key=[your-api-key]` to the URL
4. Paste into `NEXT_PUBLIC_MAPLIBRE_STYLE_URL` in `.env.local`

---

## Running the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

- **Map:** http://localhost:3000/map — interactive map with SAMPLE listings
- **Farm shops:** http://localhost:3000/farm-shops
- **County page:** http://localhost:3000/county/england/lincolnshire
- **Listing detail:** http://localhost:3000/listings/farm-shops/england/lincolnshire/hargreaves-sample-farm-shop
- **Dashboard:** http://localhost:3000/dashboard (claim a SAMPLE listing to access)
- **Admin:** http://localhost:3000/admin (requires admin role — see below)

---

## Test the golden path

1. **Browse the map** → click a SAMPLE pin → view listing detail
2. **Claim a listing** → enter any email → follow the verification link (check Resend dashboard or local logs)
3. **Add a photo** → upload a test image → check admin moderation queue
4. **Upgrade to Bronze** → use Stripe test card `4242 4242 4242 4242`
5. **Add a product** → complete all 14 allergen fields → toggle to purchasable
6. **Silver tier** → upgrade again → complete Stripe Connect onboarding (test mode)
7. **Place a test order** → use Stripe test card → accept the order from the dashboard

---

## Admin console

To access `/admin`, your Supabase user needs a custom JWT claim `{ "role": "admin" }`.

Set this in your Supabase project via SQL:
```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your@email.com';
```

---

## Project structure

```
src/
  app/
    api/          27 API route files covering all features
    (auth)/       Login, signup
    map/          Interactive MapLibre map (client-only)
    farm-shops/   SSR listing-type landing page
    honesty-boxes/
    county/       SSR county landing pages
    listings/     SSR listing detail pages (primary SEO surface)
    claim/        Listing claim flow
    dashboard/    Owner management (auth required)
    admin/        Content moderation (admin role required)
    privacy/      Privacy policy + cookie policy
    terms/        Terms of service
  components/
    map/          MapLibre components (client-only)
    listing/      Listing display, reviews, waitlist
    owner/        Dashboard, editor, product form, order management
    subscription/ Tier cards, upgrade flow, Gold eligibility gate
    admin/        Moderation queue components
    ui/           CookieBanner, SkipLink, StarRating, AllergenBadges, TierBadge
    layout/       Nav, footer
  lib/
    supabase/     Browser + server + admin clients
    analytics.ts  Server-side event logging (no cookies, consent-independent)
    auth.ts       Auth helpers (isOwner, isManager, isAdmin)
    encryption.ts AES-256-GCM for C3+ fields
    geo.ts        PostGIS query helpers
    stripe.ts     Stripe client + Connect helpers
    seo.ts        Metadata generators for listing/county pages
    tokens.ts     Design tokens as CSS custom properties
    i18n.ts       en-GB + en-IE locale strings
    hooks/        useAnalytics, useCookieConsent
supabase/
  migrations/     6 migration files (run via `supabase db push`)
```

---

## Deployment

### Vercel (frontend)
```bash
vercel deploy --prod
```
Set all environment variables in the Vercel dashboard.

### Supabase (database + storage)
Use a hosted Supabase project in the **London (eu-west-2)** region to satisfy UK GDPR data residency requirements.

---

## Pre-launch checklist

Before removing the `--prerelease` flag from the GitHub Release:

- [ ] Copyright licences obtained from exam boards with `board_licence_cleared = TRUE` (farm papers)
- [ ] yourhonestybox.com data consent confirmed in writing (verbal consent given — needs documentation)
- [ ] EU GDPR Article 27 representative appointed for ROI users
- [ ] DPO awareness of dual ICO/DPC regulatory position confirmed
- [ ] Natasha's Law allergen liability position confirmed by UK solicitor
- [ ] WCAG 2.2 AA independent audit completed (compliance condition C-016)

See `docs/compliance-pack/` for the full 35-condition compliance checklist.

---

## Key design decisions

- **No native apps at v1** — responsive PWA covers the mobile use case
- **MapLibre + OSM** — free at v1 scale; attribution "© OpenStreetMap contributors" required on all maps
- **Stripe Connect Standard** — farm shop is the merchant of record; Farmmap avoids FCA authorisation
- **Supabase RLS** — all queries automatically scoped to `directory_id` for multi-tenancy
- **Consent-independent analytics** — listing page views stored server-side; shop dashboards show accurate counts regardless of cookie consent
- **All monetary values as integer pence** — never floats

See `docs/architecture-pack/` for all 10 ADRs with full context, decision, and consequences.
