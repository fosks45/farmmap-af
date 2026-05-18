---
feature: 003-farmmap
phase: 7
document: data-model
produced_by: architecture-squad-lead
produced_at: 2026-05-17T00:00:00Z
authority: specs/003-farmmap/spec.md + specs/003-farmmap/architecture-pack/adrs/
data-classification-authority: agent-foundry Constitution §3
---

# Farmmap — Data Model

All fields carry a data classification tag (C0–C8) per the agent-foundry Constitution §3 taxonomy. Every table includes `directory_id` for multi-tenancy (ADR-0003). PostgreSQL with PostGIS extension (ADR-0006). Supabase Auth provides the `auth.users` table; application tables reference `auth.users.id` as foreign keys.

---

## Classification Reference

| Class | Description |
|---|---|
| C0 | Public — no restrictions |
| C1 | Internal — corporate cloud, TLS + at-rest, internal only |
| C2 | Customer Operational — TLS + at-rest, CMK, role-gated |
| C3 | Customer PII — strict residency, TLS + at-rest, CMK, field-level encryption for direct identifiers |
| C4 | Customer Financial — PCI-scoped enclave, HSM-backed keys, tokenisation |
| C6 | Authentication Secrets — secrets manager only, never logged |

**Encryption notes:**
- C3 fields marked `(encrypted)` use AES-256-GCM application-layer encryption before storage. The encryption key is stored in Supabase Vault (secrets manager), never in the database row itself.
- C4 fields (Stripe IDs containing payment instrument references) are encrypted at rest using the same mechanism.
- C6 fields (auth tokens, webhook secrets) are stored in Supabase Vault / Vercel environment secrets only.

---

## Table: `directories`

**Purpose:** Multi-tenant configuration record. One row per directory (Farmmap, TractorMap, etc.).

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C0 | |
| `name` | text NOT NULL | C0 | e.g. "Farmmap" |
| `slug` | text NOT NULL UNIQUE | C0 | e.g. "farmmap" |
| `domain` | text NOT NULL UNIQUE | C0 | e.g. "farmmap.co.uk" |
| `listing_types` | jsonb NOT NULL | C0 | Array of `{key, label, pin_style, pin_colour}` |
| `product_categories` | jsonb NOT NULL | C0 | Array of `{key, label}` |
| `brand_config` | jsonb NOT NULL DEFAULT '{}' | C0 | `{primary_colour, logo_url, meta_title_suffix}` |
| `commission_config` | jsonb NOT NULL | C0 | `{silver: {rate: 0.03, threshold_pence: 2000}, gold: {rate: 0.05, threshold_pence: 3000}}` |
| `is_active` | boolean NOT NULL DEFAULT true | C0 | |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C0 | |
| `updated_at` | timestamptz NOT NULL DEFAULT now() | C0 | |

---

## Table: `listings`

**Purpose:** Core listing record for all listing types (farm_shop, honesty_box, farm_gate_stall, roadside_stand).

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C0 | |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C0 | RLS key |
| `listing_type` | text NOT NULL | C0 | ENUM: farm_shop \| honesty_box \| farm_gate_stall \| roadside_stand |
| `name` | text NOT NULL | C0 | |
| `slug` | text NOT NULL | C0 | Stable; never changed after creation |
| `status` | text NOT NULL DEFAULT 'pending' | C0 | ENUM: pending \| active \| claimed \| suspended |
| `tier` | text NOT NULL DEFAULT 'free' | C0 | ENUM: free \| bronze \| silver \| gold — denormalised from listing_subscriptions for query performance |
| `address_line1` | text | C1 | Encrypted at rest |
| `address_line2` | text | C1 | Encrypted at rest |
| `town` | text | C0 | Non-identifying; used for SEO pages |
| `county` | text | C0 | |
| `country` | text NOT NULL | C0 | ENUM: england \| scotland \| wales \| northern_ireland \| republic_of_ireland |
| `postcode` | text | C1 | UK postcodes — precise location identifier; encrypted |
| `eircode` | text | C1 | ROI Eircodes — precise location identifier; encrypted |
| `location` | GEOMETRY(Point, 4326) | C0 | WGS84 coordinates; spatial index; public location data |
| `geocoding_method` | text | C0 | ENUM: postcode \| eircode \| address_text \| manual |
| `geocoding_approximate` | boolean NOT NULL DEFAULT false | C0 | True for text-geocoded Irish rural addresses |
| `phone` | text | C1 | Owner contact; not required to be personal number |
| `website` | text | C0 | Public URL |
| `email` | text | C3 | Owner/business email; encrypted |
| `description` | text | C0 | Public listing description |
| `opening_hours` | jsonb | C0 | Structured opening hours per day with irregular patterns support |
| `temporarily_closed` | boolean NOT NULL DEFAULT false | C0 | |
| `temporarily_closed_updated_at` | timestamptz | C0 | |
| `listing_type_meta` | jsonb | C0 | Type-specific fields: honesty box: `{payment_methods, currently_stocked, stocked_updated_at, location_description}` |
| `review_count` | int NOT NULL DEFAULT 0 | C0 | Denormalised count of approved reviews |
| `review_rating_avg` | numeric(3,2) | C0 | Denormalised average; null if < 3 reviews |
| `is_seed_data` | boolean NOT NULL DEFAULT false | C0 | True for the 953 imported listings |
| `seed_source` | text | C0 | yourhonestybox.com \| fra \| manual |
| `gold_eligibility_override` | boolean NOT NULL DEFAULT false | C0 | Admin can manually override Gold gate (spec Q5) |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C0 | |
| `updated_at` | timestamptz NOT NULL DEFAULT now() | C0 | |

**Indexes:**
```sql
CREATE UNIQUE INDEX listings_directory_slug_unique ON listings(directory_id, slug);
CREATE INDEX listings_location_gist ON listings USING GIST(location);
CREATE INDEX listings_directory_type_status ON listings(directory_id, listing_type, status);
CREATE INDEX listings_directory_county ON listings(directory_id, county);
```

**RLS Policy:** `directory_isolation` — `USING (directory_id = current_setting('app.current_directory_id')::uuid)`

---

## Table: `listing_managers`

**Purpose:** Multi-manager join table (spec sign-off Q3 — multi-manager from v1). Maps users to listings with roles.

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C1 | |
| `listing_id` | uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE | C1 | |
| `user_id` | uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE | C1 | |
| `role` | text NOT NULL | C1 | ENUM: owner \| manager |
| `invited_by` | uuid REFERENCES auth.users(id) | C1 | UUID of the owner who invited this manager |
| `invitation_token` | text UNIQUE | C6 | Single-use token for manager invitation email link; nulled on acceptance |
| `invitation_email` | text | C3 | Email the invitation was sent to; encrypted |
| `invitation_expires_at` | timestamptz | C1 | 48 hours from invitation |
| `accepted_at` | timestamptz | C1 | Null until manager accepts invitation |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C1 | |

**Constraints:**
```sql
UNIQUE(listing_id, user_id)
```

**RLS Policies:**
- Owners may SELECT, INSERT, DELETE rows where `listing_id` maps to a listing they own.
- Managers may SELECT rows for their listings (to see the team).
- Admins may SELECT and modify all rows.

---

## Table: `listing_photos`

**Purpose:** Photo records for listing and product photos, with moderation state.

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C0 | |
| `listing_id` | uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE | C0 | |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C0 | Denormalised for RLS |
| `uploaded_by` | uuid NOT NULL REFERENCES auth.users(id) | C1 | |
| `storage_path` | text NOT NULL | C1 | Supabase Storage path to processed WebP |
| `thumbnail_path` | text NOT NULL | C1 | Supabase Storage path to 400×300 thumbnail WebP |
| `storage_bucket` | text NOT NULL | C0 | ENUM: listing-photos \| product-photos |
| `alt_text` | text | C0 | Owner-provided alt text; fallback to listing name + photo type |
| `moderation_status` | text NOT NULL DEFAULT 'pending' | C0 | ENUM: pending \| approved \| rejected |
| `rejection_reason` | text | C0 | Set by admin on rejection; sent to owner via email |
| `rejected_by` | uuid REFERENCES auth.users(id) | C1 | Admin user who rejected |
| `display_order` | int NOT NULL DEFAULT 0 | C0 | Owner-set ordering |
| `deleted_at` | timestamptz | C1 | Soft delete; permanent deletion after 30 days |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C0 | |

---

## Table: `users`

**Purpose:** Extended user profile complementing Supabase `auth.users`. One row per auth.users row.

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY REFERENCES auth.users(id) | C3 | |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C1 | User accounts are directory-scoped |
| `display_name` | text | C3 | User-set display name; encrypted |
| `email_hash` | text | C3 | HMAC-SHA256 of email for lookup without storing plaintext; not for display |
| `account_type` | text NOT NULL DEFAULT 'consumer' | C1 | ENUM: consumer \| owner \| admin |
| `admin_role` | text | C1 | ENUM: null \| content_moderator \| directory_admin \| super_admin |
| `locale` | text NOT NULL DEFAULT 'en-GB' | C0 | en-GB \| en-IE |
| `currency` | text NOT NULL DEFAULT 'GBP' | C0 | GBP \| EUR — for ROI owner listings |
| `consent_marketing` | boolean NOT NULL DEFAULT false | C1 | |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C1 | |
| `updated_at` | timestamptz NOT NULL DEFAULT now() | C1 | |

---

## Table: `account_consents`

**Purpose:** GDPR/DPC Article 7 consent records. Append-only; withdrawals add a new row with `withdrawn_at` rather than updating the original.

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C1 | |
| `user_id` | uuid REFERENCES auth.users(id) | C3 | Nullable for anonymous waitlist consents |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C1 | |
| `consent_type` | text NOT NULL | C1 | ENUM: cookie_analytics \| cookie_marketing \| terms_v1 \| marketing_email \| waitlist_notification |
| `given_at` | timestamptz NOT NULL DEFAULT now() | C3 | Timestamp of consent action |
| `ip_hash` | text NOT NULL | C3 | HMAC-SHA256 of IP address + daily salt; never raw IP |
| `mechanism` | text NOT NULL | C1 | ENUM: banner_accept_all \| banner_custom \| claim_flow \| checkout_opt_in \| waitlist_form |
| `policy_version` | text NOT NULL | C0 | e.g. "terms-v1.0.0", "cookies-v1.0.0" |
| `withdrawn_at` | timestamptz | C1 | Set when consent is withdrawn; original `given_at` row is never deleted |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C1 | |

---

## Table: `listing_subscriptions`

**Purpose:** Subscription state for Bronze/Silver/Gold tiers. Includes Gold eligibility tracking fields (spec Q5 sign-off).

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C0 | |
| `listing_id` | uuid NOT NULL UNIQUE REFERENCES listings(id) | C0 | One active subscription per listing |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C0 | |
| `tier` | text NOT NULL | C0 | ENUM: free \| bronze \| silver \| gold |
| `stripe_subscription_id` | text UNIQUE | C3 | Stripe subscription ID; encrypted |
| `stripe_customer_id` | text | C3 | Stripe customer ID; encrypted |
| `stripe_connect_account_id` | text | C3 | Silver/Gold Stripe Connect account ID; encrypted |
| `status` | text NOT NULL DEFAULT 'active' | C0 | ENUM: active \| past_due \| suspended \| cancelled \| trialing |
| `current_period_start` | timestamptz | C0 | |
| `current_period_end` | timestamptz | C0 | |
| `cancel_at_period_end` | boolean NOT NULL DEFAULT false | C0 | Set true on downgrade/cancellation request |
| `pending_tier` | text | C0 | The tier to transition to at period end (e.g. silver→bronze) |
| `silver_months_count` | int NOT NULL DEFAULT 0 | C0 | Count of calendar months on Silver tier; incremented by Stripe webhook on invoice.paid |
| `completed_order_count` | int NOT NULL DEFAULT 0 | C0 | Count of orders in delivered status; incremented by order completion handler |
| `gold_unlock_at` | timestamptz | C0 | Set when Gold eligibility is first met; informational |
| `trialing_until` | timestamptz | C0 | For future trial periods |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C0 | |
| `cancelled_at` | timestamptz | C0 | |
| `updated_at` | timestamptz NOT NULL DEFAULT now() | C0 | |

---

## Table: `products`

**Purpose:** Product catalogue entries for Bronze (display-only) and Silver/Gold (purchasable) tiers.

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C0 | |
| `listing_id` | uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE | C0 | |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C0 | |
| `name` | text NOT NULL | C0 | |
| `description` | text | C0 | |
| `price_pence` | int | C0 | Always stored as integer pence (GBP) or eurocents (EUR). Null = price on request |
| `price_currency` | text NOT NULL DEFAULT 'GBP' | C0 | GBP \| EUR |
| `price_display` | text | C0 | e.g. "from £2.50", "£3.00 / kg" — owner-set display string |
| `category` | text NOT NULL | C0 | From directory product_categories config |
| `allergens_contain` | jsonb | C1 | Array of allergen keys from the 14 regulated allergens; required for purchasable products |
| `allergens_may_contain` | text | C1 | Cross-contamination risk free text |
| `allergen_verified_at` | timestamptz | C1 | Date owner confirmed allergen data accuracy |
| `allergen_declaration_complete` | boolean GENERATED ALWAYS AS (allergens_contain IS NOT NULL AND allergen_verified_at IS NOT NULL) STORED | C0 | Computed; purchasable toggle blocked until true |
| `is_purchasable` | boolean NOT NULL DEFAULT false | C0 | Silver/Gold only; requires allergen_declaration_complete = true |
| `is_perishable` | boolean | C0 | Required for Silver/Gold (V3-C8); determines returns policy |
| `is_seasonal` | boolean NOT NULL DEFAULT false | C0 | |
| `seasonal_months` | int[] | C0 | Array of month numbers (1–12) when available |
| `stock_count` | int | C0 | Null = unlimited; integer ≥ 0 when stock tracking enabled |
| `stock_reserved` | int NOT NULL DEFAULT 0 | C0 | Reserved by active checkout sessions (15-min hold) |
| `max_per_order` | int | C0 | Optional per-order quantity limit |
| `status` | text NOT NULL DEFAULT 'draft' | C0 | ENUM: active \| draft \| archived |
| `display_order` | int NOT NULL DEFAULT 0 | C0 | |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C0 | |
| `updated_at` | timestamptz NOT NULL DEFAULT now() | C0 | |

**Constraint:** `CHECK (is_purchasable = false OR allergen_declaration_complete = true)` — database-level enforcement that purchasable requires allergen data.

---

## Table: `orders`

**Purpose:** Marketplace orders (Silver/Gold). Each order belongs to one listing/shop.

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C0 | |
| `listing_id` | uuid NOT NULL REFERENCES listings(id) | C0 | |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C0 | |
| `buyer_user_id` | uuid NOT NULL REFERENCES auth.users(id) | C3 | |
| `idempotency_key` | text NOT NULL UNIQUE | C0 | Client-generated UUID for duplicate prevention (spec Q7) |
| `stripe_payment_intent_id` | text UNIQUE | C4 | Encrypted |
| `stripe_connect_account_id` | text NOT NULL | C3 | Connected account used for this payment; encrypted |
| `subtotal_pence` | int NOT NULL | C0 | Sum of line totals excluding delivery |
| `commission_pence` | int NOT NULL DEFAULT 0 | C0 | Farmmap application fee; 0 if below threshold |
| `delivery_fee_pence` | int NOT NULL DEFAULT 0 | C0 | |
| `total_pence` | int NOT NULL | C0 | subtotal + delivery |
| `currency` | text NOT NULL DEFAULT 'GBP' | C0 | GBP only at v1–v3 (ROI ordering deferred) |
| `status` | text NOT NULL DEFAULT 'pending' | C0 | ENUM: pending \| accepted \| preparing \| dispatched \| delivered \| cancelled \| refunded |
| `buyer_name` | text NOT NULL | C3 | Encrypted |
| `buyer_email` | text NOT NULL | C3 | Encrypted |
| `buyer_phone` | text | C3 | Encrypted; optional |
| `delivery_address` | jsonb | C3 | Entire address object encrypted as jsonb |
| `delivery_zone_id` | uuid REFERENCES delivery_zones(id) | C0 | |
| `delivery_slot` | jsonb | C0 | `{date, time_from, time_to}` — from delivery zone config |
| `notes` | text | C1 | Consumer order notes to shop |
| `cancellation_reason` | text | C0 | Set on cancelled status |
| `auto_cancel_at` | timestamptz | C0 | now() + 24 hours; order auto-cancelled if still pending at this time |
| `refunded_at` | timestamptz | C0 | |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C0 | |
| `updated_at` | timestamptz NOT NULL DEFAULT now() | C0 | |

---

## Table: `order_items`

**Purpose:** Line items within an order.

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C0 | |
| `order_id` | uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE | C0 | |
| `product_id` | uuid NOT NULL REFERENCES products(id) | C0 | |
| `product_name` | text NOT NULL | C0 | Denormalised snapshot at order time (product name may change later) |
| `quantity` | int NOT NULL CHECK (quantity > 0) | C0 | |
| `unit_price_pence` | int NOT NULL | C0 | Price at time of order |
| `line_total_pence` | int NOT NULL GENERATED ALWAYS AS (quantity * unit_price_pence) STORED | C0 | |

---

## Table: `delivery_zones`

**Purpose:** Delivery configuration for Silver/Gold listings (F18).

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C0 | |
| `listing_id` | uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE | C0 | |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C0 | |
| `zone_name` | text NOT NULL | C0 | e.g. "Local (5 miles)", "Extended" |
| `postcodes` | text[] NOT NULL | C0 | Array of postcode prefixes or full postcodes |
| `categories` | text[] | C0 | Product categories available in this zone; null = all |
| `fee_pence` | int NOT NULL DEFAULT 0 | C0 | Flat delivery fee for this zone |
| `min_order_pence` | int NOT NULL DEFAULT 0 | C0 | Minimum order subtotal for this zone |
| `time_slots` | jsonb | C0 | `[{day_of_week, time_from, time_to, max_orders}]` |
| `is_active` | boolean NOT NULL DEFAULT true | C0 | |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C0 | |

---

## Table: `reviews`

**Purpose:** Consumer reviews for listings (F5).

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C0 | |
| `listing_id` | uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE | C0 | |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C0 | |
| `reviewer_user_id` | uuid NOT NULL REFERENCES auth.users(id) | C3 | |
| `rating` | int NOT NULL CHECK (rating BETWEEN 1 AND 5) | C0 | |
| `body` | text NOT NULL CHECK (length(body) BETWEEN 20 AND 1000) | C1 | |
| `moderation_status` | text NOT NULL DEFAULT 'pending' | C0 | ENUM: pending \| approved \| rejected |
| `rejection_reason` | text | C0 | Sent to reviewer on rejection |
| `owner_response` | text CHECK (length(owner_response) <= 1000) | C1 | Owner's response to the review |
| `owner_response_status` | text DEFAULT 'pending' | C0 | ENUM: null \| pending \| approved \| rejected |
| `report_count` | int NOT NULL DEFAULT 0 | C0 | Number of consumer reports on this review |
| `reported_at` | timestamptz | C0 | Time of first report |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C0 | |
| `updated_at` | timestamptz NOT NULL DEFAULT now() | C0 | |

**Constraint:** `UNIQUE(listing_id, reviewer_user_id)` — one review per consumer per listing.

---

## Table: `order_waitlist`

**Purpose:** Email capture for ordering waitlist (F6). No account required.

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C1 | |
| `listing_id` | uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE | C1 | |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C1 | |
| `email` | text NOT NULL | C3 | Encrypted |
| `email_hash` | text NOT NULL | C3 | HMAC-SHA256 for duplicate detection without decrypting all rows |
| `notified_at` | timestamptz | C1 | Set when Silver activation notification was sent |
| `unsubscribed_at` | timestamptz | C1 | One-click unsubscribe |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C1 | |

**Constraint:** `UNIQUE(listing_id, email_hash)` — prevents duplicate waitlist entries.

---

## Table: `analytics_events`

**Purpose:** Server-side event store for listing analytics dashboards and commercial funnel metrics. No PII stored.

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | bigserial PRIMARY KEY | C0 | |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C0 | |
| `event_type` | text NOT NULL | C0 | ENUM: listing_page_view \| listing_pin_click \| claim_cta_click \| subscription_upgrade_initiated \| subscription_upgrade_completed \| waitlist_signup \| review_submission \| enquiry_form_submission |
| `listing_id` | uuid REFERENCES listings(id) | C0 | Nullable for non-listing events |
| `session_bucket` | varchar(16) NOT NULL | C0 | First 8 hex chars of HMAC-SHA256(ip + user_agent + current_date). Pseudonymised; rotated daily. No re-identification possible. |
| `source` | text | C0 | ENUM: organic \| direct \| social \| referral |
| `metadata` | jsonb NOT NULL DEFAULT '{}' | C0 | Additional context with no PII. e.g. `{county, listing_type, tier}` |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C0 | |

**Partitioning:** Table partitioned by `created_at` (monthly RANGE partitions) for query performance at scale.

**Index:** `CREATE INDEX analytics_events_listing_date ON analytics_events(listing_id, created_at) WHERE listing_id IS NOT NULL;`

---

## Table: `audit_log`

**Purpose:** Immutable append-only audit trail for all admin and system actions (spec F11, Constitution Principle 10). INSERT-only — no UPDATE or DELETE permitted by any role.

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | bigserial PRIMARY KEY | C0 | |
| `directory_id` | uuid NOT NULL | C0 | |
| `actor_id_hash` | text NOT NULL | C0 | HMAC-SHA256 of the actor's user_id + audit_secret. Identifies the actor without storing raw UUID in a way that could be confused with PII. Admin can reverse-lookup against users table. |
| `actor_role` | text NOT NULL | C0 | ENUM: system \| directory_admin \| super_admin \| content_moderator |
| `impersonating_hash` | text | C0 | Set when an admin is impersonating; HMAC of impersonated user_id |
| `action` | text NOT NULL | C0 | e.g. listing_approved \| listing_rejected \| photo_approved \| user_deactivated \| subscription_overridden \| impersonation_started \| impersonation_ended |
| `entity_type` | text NOT NULL | C0 | e.g. listing \| photo \| review \| user \| subscription |
| `entity_id` | text NOT NULL | C0 | UUID of the affected entity |
| `previous_value` | jsonb | C0 | Previous state of changed fields (no PII; field names only with classified values redacted) |
| `new_value` | jsonb | C0 | New state (same redaction rules) |
| `metadata_json` | jsonb | C0 | Additional context; no prompts, no PII, no user content |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C0 | |

**RLS policy:** `INSERT` permitted for `directory_admin`, `super_admin`, `content_moderator`, and `system` roles. No `UPDATE` or `DELETE` policy defined — no role may modify or delete audit records.

---

## Table: `manager_invitations`

**Purpose:** Pending manager invitation tokens (separate from `listing_managers.invitation_token` for cleaner state management).

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C1 | |
| `listing_id` | uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE | C1 | |
| `invited_by` | uuid NOT NULL REFERENCES auth.users(id) | C1 | |
| `invited_email` | text NOT NULL | C3 | Encrypted |
| `invited_email_hash` | text NOT NULL | C3 | For lookup |
| `token_hash` | text NOT NULL UNIQUE | C6 | SHA-256 hash of the token sent in the email. Raw token never stored. |
| `expires_at` | timestamptz NOT NULL | C1 | 48 hours from creation |
| `accepted_at` | timestamptz | C1 | |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C1 | |

---

## Table: `reported_content`

**Purpose:** Consumer-reported listings, photos, and reviews (F11 reported content queue).

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C0 | |
| `directory_id` | uuid NOT NULL REFERENCES directories(id) | C0 | |
| `reporter_user_id` | uuid REFERENCES auth.users(id) | C3 | Nullable for anonymous reports |
| `entity_type` | text NOT NULL | C0 | ENUM: listing \| photo \| review |
| `entity_id` | uuid NOT NULL | C0 | |
| `report_category` | text NOT NULL | C0 | ENUM: spam \| inappropriate_content \| incorrect_information \| potentially_illegal_content (OSA 2023 V2-C6) |
| `report_detail` | text | C1 | Reporter's description; max 500 chars |
| `severity` | text NOT NULL | C0 | ENUM: low \| medium \| high — auto-classified from category |
| `status` | text NOT NULL DEFAULT 'open' | C0 | ENUM: open \| reviewing \| dismissed \| edited \| hidden \| removed |
| `resolution_note` | text | C0 | Admin resolution note |
| `resolved_by` | uuid REFERENCES auth.users(id) | C1 | |
| `resolved_at` | timestamptz | C0 | |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C0 | |

---

## Table: `claim_tokens`

**Purpose:** Single-use listing claim verification tokens (F3 claim flow).

| Column | Type | Classification | Notes |
|---|---|---|---|
| `id` | uuid PRIMARY KEY DEFAULT gen_random_uuid() | C1 | |
| `listing_id` | uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE | C1 | |
| `claimant_email` | text NOT NULL | C3 | Encrypted |
| `claimant_email_hash` | text NOT NULL | C3 | HMAC for lookup |
| `claimant_name` | text NOT NULL | C3 | Encrypted |
| `claimant_role` | text NOT NULL | C0 | ENUM: owner \| manager \| family_member |
| `token_hash` | text NOT NULL UNIQUE | C6 | SHA-256 of token sent in email; raw token never stored |
| `expires_at` | timestamptz NOT NULL | C1 | 24 hours from creation |
| `used_at` | timestamptz | C1 | Set when token is consumed |
| `created_at` | timestamptz NOT NULL DEFAULT now() | C1 | |

---

## Tagging Propagation Rules (Constitution §3)

Applying propagation rules to Farmmap:

1. **Every field above declares its class** — complete above.
2. **API endpoint maximum class inheritance:** Any endpoint touching `orders.buyer_email` (C3) or `orders.stripe_payment_intent_id` (C4) inherits C4 and requires RBAC + ABAC + dual-control access patterns.
3. **Log sanitisation:** C3+ fields are never written to application logs. The `audit_log` stores field names but redacts classified values (e.g., logs `{buyer_email: "[C3-REDACTED]"}`).
4. **Backup inheritance:** Database backups inherit the maximum class of any field — C4 (orders table). Supabase's encrypted backups satisfy C4 controls.
5. **Analytics events C0:** `analytics_events` is deliberately designed with no C3+ fields. Session bucket is pseudonymised. No PII propagates to analytics.

---

*Produced by: architecture-squad-lead*
*Authority: specs/003-farmmap/spec.md + specs/003-farmmap/architecture-pack/adrs/ + agent-foundry Constitution §3*
*Phase: 7 | Document: data-model*
