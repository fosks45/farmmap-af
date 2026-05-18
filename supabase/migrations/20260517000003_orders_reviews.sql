-- Migration 003: Orders, Reviews, Waitlist
-- Feature: 003-farmmap
-- Authority: specs/003-farmmap/architecture-pack/data-model.md
-- ADRs: ADR-0003, ADR-0005

-- ============================================================
-- UP
-- ============================================================

-- ============================================================
-- Table: orders
-- Purpose: Marketplace orders (Silver/Gold). Each order belongs to one listing.
-- Data class: C0/C3/C4
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),            -- C0
  listing_id                uuid NOT NULL REFERENCES listings(id),                 -- C0
  directory_id              uuid NOT NULL REFERENCES directories(id),              -- C0
  buyer_user_id             uuid NOT NULL REFERENCES auth.users(id),               -- C3
  idempotency_key           text NOT NULL UNIQUE,                                  -- C0: client-generated UUID for duplicate prevention
  stripe_payment_intent_id  text UNIQUE,                                           -- C4: encrypted
  stripe_connect_account_id text NOT NULL,                                         -- C3: connected account used for this payment; encrypted
  subtotal_pence            int NOT NULL,                                          -- C0: sum of line totals excluding delivery
  commission_pence          int NOT NULL DEFAULT 0,                                -- C0: Farmmap application fee; 0 if below threshold
  delivery_fee_pence        int NOT NULL DEFAULT 0,                                -- C0
  total_pence               int NOT NULL,                                          -- C0: subtotal + delivery
  currency                  text NOT NULL DEFAULT 'GBP' CHECK (currency IN ('GBP','EUR')),  -- C0
  status                    text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','preparing','dispatched','delivered','cancelled','refunded')),  -- C0
  buyer_name                text NOT NULL,                                          -- C3: encrypted
  buyer_email               text NOT NULL,                                          -- C3: encrypted
  buyer_phone               text,                                                   -- C3: encrypted; optional
  delivery_address          jsonb,                                                  -- C3: entire address object encrypted as jsonb
  delivery_zone_id          uuid REFERENCES delivery_zones(id),                    -- C0
  delivery_slot             jsonb,                                                  -- C0: {date, time_from, time_to}
  notes                     text,                                                   -- C1: consumer order notes
  cancellation_reason       text,                                                   -- C0: set on cancelled status
  auto_cancel_at            timestamptz,                                            -- C0: now() + 24 hours; auto-cancelled if still pending
  refunded_at               timestamptz,                                            -- C0
  created_at                timestamptz NOT NULL DEFAULT now(),                     -- C0
  updated_at                timestamptz NOT NULL DEFAULT now()                      -- C0
);

CREATE INDEX orders_listing_status ON orders(listing_id, status);
CREATE INDEX orders_buyer ON orders(buyer_user_id);
CREATE INDEX orders_auto_cancel ON orders(auto_cancel_at) WHERE status = 'pending';

-- ============================================================
-- Table: order_items
-- Purpose: Line items within an order.
-- Data class: All C0
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),          -- C0
  order_id         uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,  -- C0
  product_id       uuid NOT NULL REFERENCES products(id),               -- C0
  product_name     text NOT NULL,                                        -- C0: denormalised snapshot at order time
  quantity         int NOT NULL CHECK (quantity > 0),                   -- C0
  unit_price_pence int NOT NULL,                                         -- C0: price at time of order
  line_total_pence int NOT NULL GENERATED ALWAYS AS (quantity * unit_price_pence) STORED  -- C0
);

CREATE INDEX order_items_order ON order_items(order_id);

-- ============================================================
-- Table: reviews
-- Purpose: Consumer reviews for listings (F5).
-- Data class: C0/C1/C3
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),            -- C0
  listing_id            uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,  -- C0
  directory_id          uuid NOT NULL REFERENCES directories(id),              -- C0
  reviewer_user_id      uuid NOT NULL REFERENCES auth.users(id),               -- C3
  rating                int NOT NULL CHECK (rating BETWEEN 1 AND 5),           -- C0
  body                  text NOT NULL CHECK (length(body) BETWEEN 20 AND 1000),  -- C1
  moderation_status     text NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending','approved','rejected')),  -- C0
  rejection_reason      text,                                                   -- C0: sent to reviewer on rejection
  owner_response        text CHECK (length(owner_response) <= 1000),           -- C1: owner's response
  owner_response_status text DEFAULT 'pending' CHECK (owner_response_status IN ('pending','approved','rejected')),  -- C0
  report_count          int NOT NULL DEFAULT 0,                                 -- C0: number of consumer reports
  reported_at           timestamptz,                                            -- C0: time of first report
  created_at            timestamptz NOT NULL DEFAULT now(),                     -- C0
  updated_at            timestamptz NOT NULL DEFAULT now(),                     -- C0
  UNIQUE(listing_id, reviewer_user_id)
);

CREATE INDEX reviews_listing_approved ON reviews(listing_id, created_at DESC) WHERE moderation_status = 'approved';

-- ============================================================
-- Table: order_waitlist
-- Purpose: Email capture for ordering waitlist (F6). No account required.
-- Data class: C1/C3
-- ============================================================
CREATE TABLE IF NOT EXISTS order_waitlist (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),              -- C1
  listing_id     uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,  -- C1
  directory_id   uuid NOT NULL REFERENCES directories(id),                -- C1
  email          text NOT NULL,                                            -- C3: encrypted
  email_hash     text NOT NULL,                                            -- C3: HMAC-SHA256 for duplicate detection
  notified_at    timestamptz,                                              -- C1: set when Silver activation notification sent
  unsubscribed_at timestamptz,                                             -- C1: one-click unsubscribe
  created_at     timestamptz NOT NULL DEFAULT now(),                       -- C1
  UNIQUE(listing_id, email_hash)
);

-- ============================================================
-- DOWN
-- ============================================================
-- DROP INDEX IF EXISTS reviews_listing_approved;
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS order_waitlist CASCADE;
-- DROP INDEX IF EXISTS order_items_order;
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP INDEX IF EXISTS orders_auto_cancel;
-- DROP INDEX IF EXISTS orders_buyer;
-- DROP INDEX IF EXISTS orders_listing_status;
-- DROP TABLE IF EXISTS orders CASCADE;
