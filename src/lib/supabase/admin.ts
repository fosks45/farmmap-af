/**
 * Admin Supabase client using the service role key.
 * Bypasses RLS — only for admin and moderation operations.
 * NEVER expose this client to browser code.
 *
 * Use for:
 * - Admin moderation actions (approve/reject listings, photos, reviews)
 * - Audit log writes
 * - Stripe webhook processing
 * - Auto-cancel cron jobs
 *
 * Data classification: C0 (client config); handles C3/C4 data via RLS bypass.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required',
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
