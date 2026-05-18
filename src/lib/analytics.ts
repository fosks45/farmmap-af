/**
 * Server-side analytics event logging to analytics_events table.
 *
 * All events are C0 — no PII is stored.
 * session_bucket is a pseudonymised, daily-rotated identifier.
 * Consent is not required (server-side, cookieless analytics per ADR-0008).
 *
 * ADR: ADR-0008
 * Data classification: C0 throughout (by design)
 */

import { createClient } from './supabase/server';
import { sessionBucket } from './hmac';

export type AnalyticsEventType =
  | 'listing_page_view'
  | 'listing_pin_click'
  | 'claim_cta_click'
  | 'subscription_upgrade_initiated'
  | 'subscription_upgrade_completed'
  | 'waitlist_signup'
  | 'review_submission'
  | 'enquiry_form_submission';

export interface TrackEventOptions {
  eventType: AnalyticsEventType;
  directoryId: string;
  listingId?: string | null;
  ip: string;
  userAgent: string;
  source?: 'organic' | 'direct' | 'social' | 'referral' | null;
  metadata?: Record<string, unknown>;
}

/**
 * Records an analytics event to the analytics_events table.
 * Uses the service role client to bypass RLS (INSERT-only policy).
 *
 * Fails silently — analytics must never block the main response path.
 */
export async function trackEvent(opts: TrackEventOptions): Promise<void> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().substring(0, 10);
    const bucket = sessionBucket(opts.ip, opts.userAgent, today);

    await supabase.from('analytics_events').insert({
      directory_id: opts.directoryId,
      event_type: opts.eventType,
      listing_id: opts.listingId ?? null,
      session_bucket: bucket,
      source: opts.source ?? null,
      metadata: opts.metadata ?? {},
    });
  } catch {
    // Fail silently — analytics must never block the main response
    // In production, log to Better Stack (structured logging, no PII)
  }
}

/**
 * Extracts the client IP from Next.js request headers.
 * Handles Vercel's x-forwarded-for and CF-Connecting-IP.
 * Returns '0.0.0.0' if no IP is available.
 */
export function getClientIp(request: Request): string {
  const cfIp = request.headers.get('CF-Connecting-IP');
  if (cfIp) return cfIp.split(',')[0].trim();

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  return '0.0.0.0';
}

/**
 * Returns analytics summary for a listing dashboard.
 * Queries the analytics_events table for the given period.
 */
export async function getListingAnalyticsSummary(
  listingId: string,
  period: '7d' | '30d' | '90d' | '12m',
): Promise<{
  period_start: string;
  period_end: string;
  listing_page_views: number;
  map_pin_clicks: number;
  waitlist_signups: number;
  enquiry_submissions: number;
  last_updated_at: string;
}> {
  const supabase = await createClient();

  const periodDays: Record<string, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '12m': 365,
  };

  const days = periodDays[period] ?? 30;
  const periodStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const periodEnd = new Date();

  const { data } = await supabase
    .from('analytics_events')
    .select('event_type')
    .eq('listing_id', listingId)
    .gte('created_at', periodStart.toISOString())
    .lte('created_at', periodEnd.toISOString());

  const events = data ?? [];

  const count = (type: AnalyticsEventType) =>
    events.filter((e) => e.event_type === type).length;

  return {
    period_start: periodStart.toISOString().substring(0, 10),
    period_end: periodEnd.toISOString().substring(0, 10),
    listing_page_views: count('listing_page_view'),
    map_pin_clicks: count('listing_pin_click'),
    waitlist_signups: count('waitlist_signup'),
    enquiry_submissions: count('enquiry_form_submission'),
    last_updated_at: new Date().toISOString(),
  };
}
