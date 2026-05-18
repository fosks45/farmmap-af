-- Migration 004: Analytics events and audit log
-- Feature: 003-farmmap
-- Authority: specs/003-farmmap/architecture-pack/data-model.md
-- ADRs: ADR-0008

-- ============================================================
-- UP
-- ============================================================

-- ============================================================
-- Table: analytics_events
-- Purpose: Server-side event store for listing analytics.
--          No PII stored. INSERT-only in application code.
-- Data class: All C0
-- Partitioning: monthly RANGE by created_at for query performance at scale.
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id             bigserial,                                          -- C0
  directory_id   uuid NOT NULL REFERENCES directories(id),          -- C0
  event_type     text NOT NULL CHECK (event_type IN (
    'listing_page_view',
    'listing_pin_click',
    'claim_cta_click',
    'subscription_upgrade_initiated',
    'subscription_upgrade_completed',
    'waitlist_signup',
    'review_submission',
    'enquiry_form_submission'
  )),                                                                -- C0
  listing_id     uuid REFERENCES listings(id),                      -- C0: nullable for non-listing events
  session_bucket varchar(16) NOT NULL,                              -- C0: first 8 hex chars of HMAC(ip+ua+date); pseudonymised; rotated daily; no re-identification possible
  source         text CHECK (source IN ('organic','direct','social','referral')),  -- C0
  metadata       jsonb NOT NULL DEFAULT '{}',                       -- C0: additional context with no PII
  created_at     timestamptz NOT NULL DEFAULT now()                 -- C0
) PARTITION BY RANGE (created_at);

-- Create initial partitions: previous month, current month, next 3 months
CREATE TABLE analytics_events_2026_04 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');

CREATE TABLE analytics_events_2026_05 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

CREATE TABLE analytics_events_2026_06 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

CREATE TABLE analytics_events_2026_07 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

CREATE TABLE analytics_events_2026_08 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

CREATE INDEX analytics_events_listing_date
  ON analytics_events(listing_id, created_at)
  WHERE listing_id IS NOT NULL;

-- ============================================================
-- Table: audit_log
-- Purpose: Immutable append-only audit trail for all admin and system actions.
--          INSERT-only — no UPDATE or DELETE permitted by any role.
--          Constitution Principle 10 compliance.
-- Data class: All C0 (no PII stored directly; actor is HMAC hash)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id                bigserial PRIMARY KEY,                           -- C0
  directory_id      uuid NOT NULL,                                   -- C0
  actor_id_hash     text NOT NULL,                                   -- C0: HMAC-SHA256 of actor's user_id + audit_secret
  actor_role        text NOT NULL CHECK (actor_role IN ('system','directory_admin','super_admin','content_moderator')),  -- C0
  impersonating_hash text,                                           -- C0: set when admin is impersonating; HMAC of impersonated user_id
  action            text NOT NULL,                                   -- C0: e.g. listing_approved | photo_rejected | user_deactivated
  entity_type       text NOT NULL,                                   -- C0: e.g. listing | photo | review | user | subscription
  entity_id         text NOT NULL,                                   -- C0: UUID of affected entity
  previous_value    jsonb,                                           -- C0: previous state; classified values redacted (no PII)
  new_value         jsonb,                                           -- C0: new state; same redaction rules
  metadata_json     jsonb,                                           -- C0: additional context; no prompts, no PII, no user content
  created_at        timestamptz NOT NULL DEFAULT now()               -- C0
);

CREATE INDEX audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX audit_log_directory ON audit_log(directory_id, created_at DESC);

-- ============================================================
-- DOWN
-- ============================================================
-- DROP INDEX IF EXISTS audit_log_directory;
-- DROP INDEX IF EXISTS audit_log_entity;
-- DROP TABLE IF EXISTS audit_log;
-- DROP INDEX IF EXISTS analytics_events_listing_date;
-- DROP TABLE IF EXISTS analytics_events_2026_08;
-- DROP TABLE IF EXISTS analytics_events_2026_07;
-- DROP TABLE IF EXISTS analytics_events_2026_06;
-- DROP TABLE IF EXISTS analytics_events_2026_05;
-- DROP TABLE IF EXISTS analytics_events_2026_04;
-- DROP TABLE IF EXISTS analytics_events;
