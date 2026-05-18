-- Migration 001: Extensions and base tables
-- Feature: 003-farmmap
-- Authority: specs/003-farmmap/architecture-pack/data-model.md
-- ADRs: ADR-0001, ADR-0003, ADR-0004, ADR-0006

-- ============================================================
-- UP
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS postgis;    -- C0: spatial queries
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- C0: gen_random_uuid(), crypt()

-- ============================================================
-- Table: directories
-- Purpose: Multi-tenant configuration. One row per directory.
-- Data class: All columns C0 (public config)
-- ============================================================
CREATE TABLE IF NOT EXISTS directories (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),  -- C0
  name                text NOT NULL,                                -- C0: e.g. "Farmmap"
  slug                text NOT NULL UNIQUE,                         -- C0: e.g. "farmmap"
  domain              text NOT NULL UNIQUE,                         -- C0: e.g. "farmmap.co.uk"
  listing_types       jsonb NOT NULL,                               -- C0: [{key, label, pin_style, pin_colour}]
  product_categories  jsonb NOT NULL,                               -- C0: [{key, label}]
  brand_config        jsonb NOT NULL DEFAULT '{}',                  -- C0: {primary_colour, logo_url, meta_title_suffix}
  commission_config   jsonb NOT NULL,                               -- C0: {silver:{rate,threshold_pence}, gold:{rate,threshold_pence}}
  is_active           boolean NOT NULL DEFAULT true,                -- C0
  created_at          timestamptz NOT NULL DEFAULT now(),           -- C0
  updated_at          timestamptz NOT NULL DEFAULT now()            -- C0
);

-- ============================================================
-- Table: listings
-- Purpose: Core listing record for all listing types.
-- Data class: Mix C0/C1/C3 — see column comments
-- ============================================================
CREATE TABLE IF NOT EXISTS listings (
  id                            uuid PRIMARY KEY DEFAULT gen_random_uuid(),  -- C0
  directory_id                  uuid NOT NULL REFERENCES directories(id),    -- C0: RLS key
  listing_type                  text NOT NULL CHECK (listing_type IN ('farm_shop','honesty_box','farm_gate_stall','roadside_stand')),  -- C0
  name                          text NOT NULL,                                -- C0
  slug                          text NOT NULL,                                -- C0: stable, never changed after creation
  status                        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','claimed','suspended')),  -- C0
  tier                          text NOT NULL DEFAULT 'free' CHECK (tier IN ('free','bronze','silver','gold')),  -- C0: denormalised from listing_subscriptions
  address_line1                 text,                                         -- C1: encrypted at rest via app layer
  address_line2                 text,                                         -- C1: encrypted at rest via app layer
  town                          text,                                         -- C0: non-identifying, used for SEO pages
  county                        text,                                         -- C0
  country                       text NOT NULL CHECK (country IN ('england','scotland','wales','northern_ireland','republic_of_ireland')),  -- C0
  postcode                      text,                                         -- C1: UK postcode — precise location identifier; encrypted
  eircode                       text,                                         -- C1: ROI Eircode — precise location identifier; encrypted
  location                      GEOMETRY(Point, 4326),                        -- C0: WGS84 coordinates; public location
  geocoding_method              text CHECK (geocoding_method IN ('postcode','eircode','address_text','manual')),  -- C0
  geocoding_approximate         boolean NOT NULL DEFAULT false,                -- C0: true for text-geocoded Irish rural addresses
  phone                         text,                                         -- C1: owner contact; encrypted
  website                       text,                                         -- C0: public URL
  email                         text,                                         -- C3: owner/business email; encrypted
  description                   text,                                         -- C0: public listing description
  opening_hours                 jsonb,                                        -- C0: structured hours per day
  temporarily_closed            boolean NOT NULL DEFAULT false,                -- C0
  temporarily_closed_updated_at timestamptz,                                  -- C0
  listing_type_meta             jsonb,                                        -- C0: type-specific fields
  review_count                  int NOT NULL DEFAULT 0,                        -- C0: denormalised count of approved reviews
  review_rating_avg             numeric(3,2),                                  -- C0: denormalised avg; null if < 3 reviews
  is_seed_data                  boolean NOT NULL DEFAULT false,                -- C0: true for 953 imported listings
  seed_source                   text CHECK (seed_source IN ('yourhonestybox.com','fra','manual')),  -- C0
  gold_eligibility_override     boolean NOT NULL DEFAULT false,                -- C0: admin manual override for Gold gate
  created_at                    timestamptz NOT NULL DEFAULT now(),            -- C0
  updated_at                    timestamptz NOT NULL DEFAULT now()             -- C0
);

CREATE UNIQUE INDEX listings_directory_slug_unique ON listings(directory_id, slug);
CREATE INDEX listings_location_gist ON listings USING GIST(location);
CREATE INDEX listings_directory_type_status ON listings(directory_id, listing_type, status);
CREATE INDEX listings_directory_county ON listings(directory_id, county);

-- ============================================================
-- Table: listing_managers
-- Purpose: Multi-manager join table — maps users to listings with roles.
-- Data class: C1/C3/C6
-- ============================================================
CREATE TABLE IF NOT EXISTS listing_managers (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),             -- C1
  listing_id            uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,  -- C1
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  -- C1
  role                  text NOT NULL CHECK (role IN ('owner','manager')),      -- C1
  invited_by            uuid REFERENCES auth.users(id),                        -- C1: UUID of inviting owner
  invitation_token      text UNIQUE,                                            -- C6: single-use token; nulled on acceptance
  invitation_email      text,                                                   -- C3: email invitation sent to; encrypted
  invitation_expires_at timestamptz,                                            -- C1: 48 hours from invitation
  accepted_at           timestamptz,                                            -- C1: null until manager accepts
  created_at            timestamptz NOT NULL DEFAULT now(),                     -- C1
  UNIQUE(listing_id, user_id)
);

-- ============================================================
-- Table: listing_photos
-- Purpose: Photo records with moderation state.
-- Data class: C0/C1
-- ============================================================
CREATE TABLE IF NOT EXISTS listing_photos (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),               -- C0
  listing_id        uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,  -- C0
  directory_id      uuid NOT NULL REFERENCES directories(id),                 -- C0: denormalised for RLS
  uploaded_by       uuid NOT NULL REFERENCES auth.users(id),                  -- C1
  storage_path      text NOT NULL,                                             -- C1: Supabase Storage path to processed WebP
  thumbnail_path    text NOT NULL,                                             -- C1: Supabase Storage path to 400x300 thumbnail
  storage_bucket    text NOT NULL CHECK (storage_bucket IN ('listing-photos','product-photos')),  -- C0
  alt_text          text,                                                      -- C0: owner-provided alt text
  moderation_status text NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending','approved','rejected')),  -- C0
  rejection_reason  text,                                                      -- C0: set by admin on rejection
  rejected_by       uuid REFERENCES auth.users(id),                           -- C1: admin who rejected
  display_order     int NOT NULL DEFAULT 0,                                    -- C0
  deleted_at        timestamptz,                                               -- C1: soft delete
  created_at        timestamptz NOT NULL DEFAULT now()                         -- C0
);

CREATE INDEX listing_photos_listing_id ON listing_photos(listing_id) WHERE deleted_at IS NULL;

-- ============================================================
-- Table: users
-- Purpose: Extended user profile complementing Supabase auth.users.
-- Data class: C1/C3
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id                uuid PRIMARY KEY REFERENCES auth.users(id),    -- C3
  directory_id      uuid NOT NULL REFERENCES directories(id),       -- C1: user accounts are directory-scoped
  display_name      text,                                           -- C3: user-set display name; encrypted
  email_hash        text,                                           -- C3: HMAC-SHA256 of email for lookup
  account_type      text NOT NULL DEFAULT 'consumer' CHECK (account_type IN ('consumer','owner','admin')),  -- C1
  admin_role        text CHECK (admin_role IN ('content_moderator','directory_admin','super_admin')),  -- C1
  locale            text NOT NULL DEFAULT 'en-GB',                  -- C0
  currency          text NOT NULL DEFAULT 'GBP' CHECK (currency IN ('GBP','EUR')),  -- C0
  consent_marketing boolean NOT NULL DEFAULT false,                 -- C1
  created_at        timestamptz NOT NULL DEFAULT now(),             -- C1
  updated_at        timestamptz NOT NULL DEFAULT now()              -- C1
);

-- ============================================================
-- Table: account_consents
-- Purpose: GDPR/DPC Article 7 consent records. Append-only.
-- Data class: C1/C3
-- ============================================================
CREATE TABLE IF NOT EXISTS account_consents (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),      -- C1
  user_id        uuid REFERENCES auth.users(id),                  -- C3: nullable for anonymous waitlist consents
  directory_id   uuid NOT NULL REFERENCES directories(id),        -- C1
  consent_type   text NOT NULL CHECK (consent_type IN ('cookie_analytics','cookie_marketing','terms_v1','marketing_email','waitlist_notification')),  -- C1
  given_at       timestamptz NOT NULL DEFAULT now(),               -- C3: timestamp of consent action
  ip_hash        text NOT NULL,                                    -- C3: HMAC-SHA256 of IP + daily salt; never raw IP
  mechanism      text NOT NULL CHECK (mechanism IN ('banner_accept_all','banner_custom','claim_flow','checkout_opt_in','waitlist_form')),  -- C1
  policy_version text NOT NULL,                                    -- C0: e.g. "terms-v1.0.0"
  withdrawn_at   timestamptz,                                      -- C1: original given_at row never deleted
  created_at     timestamptz NOT NULL DEFAULT now()                -- C1
);

-- ============================================================
-- Table: manager_invitations
-- Purpose: Pending manager invitation tokens.
-- Data class: C1/C3/C6
-- ============================================================
CREATE TABLE IF NOT EXISTS manager_invitations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),             -- C1
  listing_id          uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,  -- C1
  invited_by          uuid NOT NULL REFERENCES auth.users(id),                -- C1
  invited_email       text NOT NULL,                                           -- C3: encrypted
  invited_email_hash  text NOT NULL,                                           -- C3: for lookup
  token_hash          text NOT NULL UNIQUE,                                    -- C6: SHA-256 of token sent in email; raw token never stored
  expires_at          timestamptz NOT NULL,                                    -- C1: 48 hours from creation
  accepted_at         timestamptz,                                             -- C1
  created_at          timestamptz NOT NULL DEFAULT now()                       -- C1
);

-- ============================================================
-- Table: claim_tokens
-- Purpose: Single-use listing claim verification tokens.
-- Data class: C1/C3/C6
-- ============================================================
CREATE TABLE IF NOT EXISTS claim_tokens (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),             -- C1
  listing_id           uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,  -- C1
  claimant_email       text NOT NULL,                                           -- C3: encrypted
  claimant_email_hash  text NOT NULL,                                           -- C3: HMAC for lookup
  claimant_name        text NOT NULL,                                           -- C3: encrypted
  claimant_role        text NOT NULL CHECK (claimant_role IN ('owner','manager','family_member')),  -- C0
  token_hash           text NOT NULL UNIQUE,                                    -- C6: SHA-256 of token; raw token never stored
  expires_at           timestamptz NOT NULL,                                    -- C1: 24 hours from creation
  used_at              timestamptz,                                             -- C1: set when token consumed
  created_at           timestamptz NOT NULL DEFAULT now()                       -- C1
);

-- ============================================================
-- Table: reported_content
-- Purpose: Consumer-reported listings, photos, reviews.
-- Data class: C0/C1/C3
-- ============================================================
CREATE TABLE IF NOT EXISTS reported_content (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),   -- C0
  directory_id     uuid NOT NULL REFERENCES directories(id),     -- C0
  reporter_user_id uuid REFERENCES auth.users(id),               -- C3: nullable for anonymous reports
  entity_type      text NOT NULL CHECK (entity_type IN ('listing','photo','review')),  -- C0
  entity_id        uuid NOT NULL,                                 -- C0
  report_category  text NOT NULL CHECK (report_category IN ('spam','inappropriate_content','incorrect_information','potentially_illegal_content')),  -- C0
  report_detail    text,                                          -- C1: reporter description; max 500 chars
  severity         text NOT NULL CHECK (severity IN ('low','medium','high')),  -- C0: auto-classified from category
  status           text NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewing','dismissed','edited','hidden','removed')),  -- C0
  resolution_note  text,                                          -- C0: admin resolution note
  resolved_by      uuid REFERENCES auth.users(id),               -- C1
  resolved_at      timestamptz,                                   -- C0
  created_at       timestamptz NOT NULL DEFAULT now()             -- C0
);

-- ============================================================
-- DOWN
-- ============================================================
-- DROP TABLE IF EXISTS reported_content CASCADE;
-- DROP TABLE IF EXISTS claim_tokens CASCADE;
-- DROP TABLE IF EXISTS manager_invitations CASCADE;
-- DROP TABLE IF EXISTS account_consents CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS listing_photos CASCADE;
-- DROP TABLE IF EXISTS listing_managers CASCADE;
-- DROP INDEX IF EXISTS listings_directory_county;
-- DROP INDEX IF EXISTS listings_directory_type_status;
-- DROP INDEX IF EXISTS listings_location_gist;
-- DROP INDEX IF EXISTS listings_directory_slug_unique;
-- DROP TABLE IF EXISTS listings CASCADE;
-- DROP TABLE IF EXISTS directories CASCADE;
-- DROP EXTENSION IF EXISTS pgcrypto;
-- DROP EXTENSION IF EXISTS postgis;
