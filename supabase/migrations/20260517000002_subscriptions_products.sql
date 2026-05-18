-- Migration 002: Subscriptions, Products, Delivery Zones
-- Feature: 003-farmmap
-- Authority: specs/003-farmmap/architecture-pack/data-model.md
-- ADRs: ADR-0001, ADR-0003, ADR-0005

-- ============================================================
-- UP
-- ============================================================

-- ============================================================
-- Table: listing_subscriptions
-- Purpose: Subscription state for Bronze/Silver/Gold tiers.
-- Data class: C0/C3
-- ============================================================
CREATE TABLE IF NOT EXISTS listing_subscriptions (
  id                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),           -- C0
  listing_id                 uuid NOT NULL UNIQUE REFERENCES listings(id),         -- C0: one active subscription per listing
  directory_id               uuid NOT NULL REFERENCES directories(id),             -- C0
  tier                       text NOT NULL CHECK (tier IN ('free','bronze','silver','gold')),  -- C0
  stripe_subscription_id     text UNIQUE,                                          -- C3: encrypted
  stripe_customer_id         text,                                                 -- C3: encrypted
  stripe_connect_account_id  text,                                                 -- C3: Silver/Gold Connect account; encrypted
  status                     text NOT NULL DEFAULT 'active' CHECK (status IN ('active','past_due','suspended','cancelled','trialing')),  -- C0
  current_period_start       timestamptz,                                          -- C0
  current_period_end         timestamptz,                                          -- C0
  cancel_at_period_end       boolean NOT NULL DEFAULT false,                       -- C0: true on downgrade/cancellation request
  pending_tier               text CHECK (pending_tier IN ('free','bronze','silver','gold')),  -- C0: tier to transition to at period end
  silver_months_count        int NOT NULL DEFAULT 0,                               -- C0: months on Silver; incremented by webhook
  completed_order_count      int NOT NULL DEFAULT 0,                               -- C0: delivered orders; incremented by order completion
  gold_unlock_at             timestamptz,                                          -- C0: set when Gold eligibility first met
  trialing_until             timestamptz,                                          -- C0: future trial periods
  created_at                 timestamptz NOT NULL DEFAULT now(),                   -- C0
  cancelled_at               timestamptz,                                          -- C0
  updated_at                 timestamptz NOT NULL DEFAULT now()                    -- C0
);

CREATE INDEX listing_subscriptions_stripe_sub ON listing_subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

-- ============================================================
-- Table: products
-- Purpose: Product catalogue entries for Bronze (display-only) and Silver/Gold (purchasable).
-- Data class: C0/C1
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id                           uuid PRIMARY KEY DEFAULT gen_random_uuid(),           -- C0
  listing_id                   uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,  -- C0
  directory_id                 uuid NOT NULL REFERENCES directories(id),             -- C0
  name                         text NOT NULL,                                        -- C0
  description                  text,                                                 -- C0
  price_pence                  int,                                                  -- C0: null = price on request; stored as integer pence/eurocents
  price_currency               text NOT NULL DEFAULT 'GBP' CHECK (price_currency IN ('GBP','EUR')),  -- C0
  price_display                text,                                                 -- C0: e.g. "from £2.50"
  category                     text NOT NULL,                                        -- C0: from directory product_categories config
  allergens_contain            jsonb,                                                -- C1: array of allergen keys from 14 regulated allergens
  allergens_may_contain        text,                                                 -- C1: cross-contamination risk free text
  allergen_verified_at         timestamptz,                                          -- C1: date owner confirmed allergen data
  allergen_declaration_complete boolean GENERATED ALWAYS AS (
    allergens_contain IS NOT NULL AND allergen_verified_at IS NOT NULL
  ) STORED,                                                                          -- C0: computed; purchasable toggle blocked until true
  is_purchasable               boolean NOT NULL DEFAULT false,                       -- C0: Silver/Gold only; requires allergen_declaration_complete
  is_perishable                boolean,                                              -- C0: required for Silver/Gold (V3-C8)
  is_seasonal                  boolean NOT NULL DEFAULT false,                       -- C0
  seasonal_months              int[],                                                -- C0: month numbers (1-12) when available
  stock_count                  int,                                                  -- C0: null = unlimited
  stock_reserved               int NOT NULL DEFAULT 0,                               -- C0: reserved by active checkout sessions (15-min hold)
  max_per_order                int,                                                  -- C0: optional per-order quantity limit
  status                       text NOT NULL DEFAULT 'draft' CHECK (status IN ('active','draft','archived')),  -- C0
  display_order                int NOT NULL DEFAULT 0,                               -- C0
  created_at                   timestamptz NOT NULL DEFAULT now(),                   -- C0
  updated_at                   timestamptz NOT NULL DEFAULT now(),                   -- C0

  CONSTRAINT products_purchasable_requires_allergen CHECK (
    is_purchasable = false OR allergen_declaration_complete = true
  )
);

CREATE INDEX products_listing_status ON products(listing_id, status);

-- ============================================================
-- Table: delivery_zones
-- Purpose: Delivery configuration for Silver/Gold listings (F18).
-- Data class: All C0
-- ============================================================
CREATE TABLE IF NOT EXISTS delivery_zones (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),            -- C0
  listing_id      uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,  -- C0
  directory_id    uuid NOT NULL REFERENCES directories(id),              -- C0
  zone_name       text NOT NULL,                                          -- C0: e.g. "Local (5 miles)"
  postcodes       text[] NOT NULL,                                        -- C0: array of postcode prefixes or full postcodes
  categories      text[],                                                 -- C0: product categories in zone; null = all
  fee_pence       int NOT NULL DEFAULT 0,                                 -- C0: flat delivery fee for this zone
  min_order_pence int NOT NULL DEFAULT 0,                                 -- C0: minimum order subtotal for this zone
  time_slots      jsonb,                                                  -- C0: [{day_of_week, time_from, time_to, max_orders}]
  is_active       boolean NOT NULL DEFAULT true,                          -- C0
  created_at      timestamptz NOT NULL DEFAULT now()                      -- C0
);

CREATE INDEX delivery_zones_listing ON delivery_zones(listing_id) WHERE is_active = true;

-- ============================================================
-- DOWN
-- ============================================================
-- DROP TABLE IF EXISTS delivery_zones CASCADE;
-- DROP INDEX IF EXISTS products_listing_status;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP INDEX IF EXISTS listing_subscriptions_stripe_sub;
-- DROP TABLE IF EXISTS listing_subscriptions CASCADE;
