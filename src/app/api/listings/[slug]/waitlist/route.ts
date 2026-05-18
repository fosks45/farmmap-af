/**
 * POST /api/listings/[slug]/waitlist
 * Join the ordering waitlist for a listing. No auth required.
 * Idempotent — duplicate emails for same listing return 200.
 *
 * F6 — Ordering waitlist
 * Data classification: C3 (email encrypted), C0 (email_hash for dedup)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, resolveListingBySlug } from '@/lib/auth';
import { encrypt } from '@/lib/encryption';
import { hashEmail } from '@/lib/hmac';
import { sendWaitlistConfirmationEmail } from '@/lib/resend';
import { trackEvent, getClientIp } from '@/lib/analytics';

export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://farmmap.co.uk';

const WaitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  // Waitlist is only available on active listings
  if (listing.status !== 'active') {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Listing not found' } },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parsed = WaitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'validation_error',
          message: 'Invalid request body',
          details: parsed.error.flatten(),
        },
      },
      { status: 422 },
    );
  }

  const { email } = parsed.data;
  const emailHash = hashEmail(email);

  const supabase = await createClient();

  // Idempotent — check existing entry
  const { data: existing } = await supabase
    .from('order_waitlist')
    .select('id, unsubscribed_at')
    .eq('listing_id', listing.id)
    .eq('email_hash', emailHash)
    .single();

  if (existing) {
    if (existing.unsubscribed_at) {
      // Re-subscribe — clear unsubscribed_at
      await supabase
        .from('order_waitlist')
        .update({ unsubscribed_at: null })
        .eq('id', existing.id);
    }
    // Return 200 regardless (idempotent)
    return NextResponse.json({ message: "You're on the waitlist" });
  }

  const { error: insertError } = await supabase.from('order_waitlist').insert({
    listing_id: listing.id,
    directory_id: directoryId,
    email: encrypt(email),
    email_hash: emailHash,
  });

  if (insertError) {
    if (insertError.code === '23505') {
      // Duplicate — idempotent
      return NextResponse.json({ message: "You're on the waitlist" });
    }
    console.error('[waitlist/post] insert error:', insertError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to join waitlist' } },
      { status: 500 },
    );
  }

  // Fetch listing name for email
  const { data: listingRow } = await supabase
    .from('listings')
    .select('name')
    .eq('id', listing.id)
    .single();

  const listingName = listingRow?.name ?? 'this listing';
  const unsubscribeUrl = `${SITE_URL}/waitlist/unsubscribe?listing=${listing.id}&hash=${emailHash}`;

  try {
    await sendWaitlistConfirmationEmail({
      to: email,
      listingName,
      unsubscribeUrl,
    });
  } catch (err) {
    console.error('[waitlist/post] resend error:', err);
    // Don't fail the request — the entry is saved; email is best-effort
  }

  // Track analytics
  void trackEvent({
    eventType: 'waitlist_signup',
    directoryId,
    listingId: listing.id,
    ip: getClientIp(request),
    userAgent: request.headers.get('user-agent') ?? '',
  });

  return NextResponse.json({ message: "You're on the waitlist" }, { status: 201 });
}
