-- Migration 005: Row Level Security Policies
-- Feature: 003-farmmap
-- Authority: specs/003-farmmap/architecture-pack/data-model.md
-- ADRs: ADR-0003, ADR-0004

-- ============================================================
-- UP
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE directories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE reported_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper functions
-- ============================================================

-- Check if the current user is an owner or manager for a listing
CREATE OR REPLACE FUNCTION is_listing_manager(p_listing_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM listing_managers
    WHERE listing_id = p_listing_id
      AND user_id = auth.uid()
      AND accepted_at IS NOT NULL
  );
$$;

-- Check if the current user is the owner for a listing
CREATE OR REPLACE FUNCTION is_listing_owner(p_listing_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM listing_managers
    WHERE listing_id = p_listing_id
      AND user_id = auth.uid()
      AND role = 'owner'
  );
$$;

-- Check if the current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND admin_role IN ('content_moderator','directory_admin','super_admin')
  );
$$;

-- Check if the current user is a directory_admin or super_admin
CREATE OR REPLACE FUNCTION is_directory_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND admin_role IN ('directory_admin','super_admin')
  );
$$;

-- ============================================================
-- directories
-- ============================================================
CREATE POLICY directories_public_read
  ON directories FOR SELECT
  USING (is_active = true);

-- ============================================================
-- listings
-- ============================================================

-- Public can read active listings
CREATE POLICY listings_public_read
  ON listings FOR SELECT
  USING (status = 'active');

-- Listing owner or manager can read their own listing regardless of status
CREATE POLICY listings_manager_read
  ON listings FOR SELECT
  USING (is_listing_manager(id));

-- Admins can read all listings
CREATE POLICY listings_admin_read
  ON listings FOR SELECT
  USING (is_admin());

-- Owner or manager can update listing fields
CREATE POLICY listings_manager_update
  ON listings FOR UPDATE
  USING (is_listing_manager(id));

-- Service role (system) can insert (for seeding and claim flow)
CREATE POLICY listings_system_insert
  ON listings FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- listing_managers
-- ============================================================

-- Owner can see all managers for their listing
CREATE POLICY listing_managers_owner_read
  ON listing_managers FOR SELECT
  USING (is_listing_owner(listing_id));

-- Managers can see their own row
CREATE POLICY listing_managers_self_read
  ON listing_managers FOR SELECT
  USING (user_id = auth.uid());

-- Owner can invite new managers (INSERT)
CREATE POLICY listing_managers_owner_insert
  ON listing_managers FOR INSERT
  WITH CHECK (is_listing_owner(listing_id));

-- Owner can remove managers (DELETE) — but not themselves
CREATE POLICY listing_managers_owner_delete
  ON listing_managers FOR DELETE
  USING (
    is_listing_owner(listing_id)
    AND user_id != auth.uid()
  );

-- Admins full access
CREATE POLICY listing_managers_admin_all
  ON listing_managers FOR ALL
  USING (is_admin());

-- ============================================================
-- listing_subscriptions
-- ============================================================

-- Owner can read their subscription
CREATE POLICY subscriptions_owner_read
  ON listing_subscriptions FOR SELECT
  USING (is_listing_owner(listing_id));

-- Owner can update their subscription (e.g., set tier from webhook)
CREATE POLICY subscriptions_service_all
  ON listing_subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- Admins can read and update subscriptions
CREATE POLICY subscriptions_admin_all
  ON listing_subscriptions FOR ALL
  USING (is_admin());

-- ============================================================
-- listing_photos
-- ============================================================

-- Public can read approved, non-deleted photos
CREATE POLICY photos_public_read
  ON listing_photos FOR SELECT
  USING (moderation_status = 'approved' AND deleted_at IS NULL);

-- Owner/manager can read their own photos (all moderation statuses)
CREATE POLICY photos_manager_read
  ON listing_photos FOR SELECT
  USING (is_listing_manager(listing_id) AND deleted_at IS NULL);

-- Owner/manager can insert photos
CREATE POLICY photos_manager_insert
  ON listing_photos FOR INSERT
  WITH CHECK (is_listing_manager(listing_id));

-- Owner/manager can soft-delete (update deleted_at)
CREATE POLICY photos_manager_update
  ON listing_photos FOR UPDATE
  USING (is_listing_manager(listing_id));

-- Admins can manage all photos (for moderation)
CREATE POLICY photos_admin_all
  ON listing_photos FOR ALL
  USING (is_admin());

-- ============================================================
-- products
-- ============================================================

-- Public can read active, purchasable products
CREATE POLICY products_public_read
  ON products FOR SELECT
  USING (status = 'active');

-- Owner/manager can read all their products (including drafts)
CREATE POLICY products_manager_read
  ON products FOR SELECT
  USING (is_listing_manager(listing_id));

-- Owner/manager can create/edit/archive products (Bronze+ tier required — checked in app code)
CREATE POLICY products_manager_write
  ON products FOR INSERT
  WITH CHECK (is_listing_manager(listing_id));

CREATE POLICY products_manager_update
  ON products FOR UPDATE
  USING (is_listing_manager(listing_id));

-- ============================================================
-- orders
-- ============================================================

-- Buyer can read their own orders
CREATE POLICY orders_buyer_read
  ON orders FOR SELECT
  USING (buyer_user_id = auth.uid());

-- Owner/manager can read orders for their listing
CREATE POLICY orders_manager_read
  ON orders FOR SELECT
  USING (is_listing_manager(listing_id));

-- Authenticated users can create orders (additional checks in app code)
CREATE POLICY orders_create
  ON orders FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND buyer_user_id = auth.uid());

-- Owner/manager can update order status
CREATE POLICY orders_manager_update
  ON orders FOR UPDATE
  USING (is_listing_manager(listing_id));

-- Service role full access (for webhooks, auto-cancel cron)
CREATE POLICY orders_service_all
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- order_items
-- ============================================================

-- Order items visible if order is visible
CREATE POLICY order_items_read
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id
        AND (o.buyer_user_id = auth.uid() OR is_listing_manager(o.listing_id))
    )
  );

CREATE POLICY order_items_insert
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id
        AND o.buyer_user_id = auth.uid()
    )
  );

-- ============================================================
-- reviews
-- ============================================================

-- Public can read approved reviews
CREATE POLICY reviews_public_read
  ON reviews FOR SELECT
  USING (moderation_status = 'approved');

-- Reviewer can read their own review (pending/rejected)
CREATE POLICY reviews_self_read
  ON reviews FOR SELECT
  USING (reviewer_user_id = auth.uid());

-- Authenticated consumers can submit reviews (one per listing enforced by UNIQUE constraint)
CREATE POLICY reviews_create
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND reviewer_user_id = auth.uid());

-- Admins can manage all reviews (for moderation)
CREATE POLICY reviews_admin_all
  ON reviews FOR ALL
  USING (is_admin());

-- ============================================================
-- analytics_events (INSERT-only for non-admin)
-- ============================================================

-- Service role can insert analytics events
CREATE POLICY analytics_service_insert
  ON analytics_events FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Admins can read analytics
CREATE POLICY analytics_admin_read
  ON analytics_events FOR SELECT
  USING (is_admin());

-- ============================================================
-- audit_log (INSERT-only — no UPDATE/DELETE for any role)
-- ============================================================

-- Service role and admins can insert
CREATE POLICY audit_log_insert
  ON audit_log FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
    OR is_admin()
  );

-- Admins can read audit logs
CREATE POLICY audit_log_admin_read
  ON audit_log FOR SELECT
  USING (is_admin());

-- CRITICAL: No UPDATE or DELETE policies are defined on audit_log.
-- This means no role (including service_role unless using pg_bypass_rls) can modify audit records.
-- This enforces the immutable audit trail requirement.

-- ============================================================
-- account_consents
-- ============================================================

-- User can insert their own consent records
CREATE POLICY consents_self_insert
  ON account_consents FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- User can read their own consent records
CREATE POLICY consents_self_read
  ON account_consents FOR SELECT
  USING (user_id = auth.uid());

-- Service role full access
CREATE POLICY consents_service_all
  ON account_consents FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- users
-- ============================================================

-- Users can read and update their own profile
CREATE POLICY users_self_read
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY users_self_update
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Service role full access (for user creation on signup)
CREATE POLICY users_service_all
  ON users FOR ALL
  USING (auth.role() = 'service_role');

-- Admins can read all users
CREATE POLICY users_admin_read
  ON users FOR SELECT
  USING (is_admin());

-- ============================================================
-- order_waitlist
-- ============================================================

-- Service role full access (waitlist inserts are server-side)
CREATE POLICY waitlist_service_all
  ON order_waitlist FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- claim_tokens
-- ============================================================

-- Service role full access
CREATE POLICY claim_tokens_service_all
  ON claim_tokens FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- manager_invitations
-- ============================================================

-- Service role full access
CREATE POLICY manager_invitations_service_all
  ON manager_invitations FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- delivery_zones
-- ============================================================

-- Public can read active delivery zones
CREATE POLICY delivery_zones_public_read
  ON delivery_zones FOR SELECT
  USING (is_active = true);

-- Owner/manager can manage their delivery zones
CREATE POLICY delivery_zones_manager_write
  ON delivery_zones FOR ALL
  USING (is_listing_manager(listing_id));

-- ============================================================
-- reported_content
-- ============================================================

-- Authenticated users can report content
CREATE POLICY reported_content_insert
  ON reported_content FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admins can view and manage reports
CREATE POLICY reported_content_admin_all
  ON reported_content FOR ALL
  USING (is_admin());

-- ============================================================
-- DOWN
-- ============================================================
-- DROP FUNCTION IF EXISTS is_listing_manager(uuid);
-- DROP FUNCTION IF EXISTS is_listing_owner(uuid);
-- DROP FUNCTION IF EXISTS is_admin();
-- DROP FUNCTION IF EXISTS is_directory_admin();
-- (All policies dropped automatically when RLS is disabled or tables are dropped)
