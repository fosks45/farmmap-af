/**
 * POST /api/listings/[slug]/claim  — initiate listing claim
 * GET  /api/listings/[slug]/claim  — verify claim token (query: token)
 *
 * F3 — Listing claim flow
 * ADR-0004 (auth), ADR-0007 (tokens)
 * Data classification: C3 (email), C6 (token hash)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes, createHash } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId } from '@/lib/auth';
import { encrypt } from '@/lib/encryption';
import { hashEmail } from '@/lib/hmac';
import { sendClaimVerificationEmail } from '@/lib/resend';

export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://farmmap.co.uk';

const PostSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1).max(200),
  role: z.enum(['owner', 'manager', 'family_member']).default('owner'),
});

const GetSchema = z.object({
  token: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);
  const supabase = await createClient();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parsed = PostSchema.safeParse(body);
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

  const { email, name, role } = parsed.data;

  // Resolve listing
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id, name, status')
    .eq('slug', slug)
    .eq('directory_id', directoryId)
    .single();

  if (listingError || !listing) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Listing not found' } },
      { status: 404 },
    );
  }

  // Check if listing already has an owner in listing_managers
  const { data: existingOwner } = await supabase
    .from('listing_managers')
    .select('id')
    .eq('listing_id', listing.id)
    .eq('role', 'owner')
    .not('accepted_at', 'is', null)
    .single();

  if (existingOwner) {
    return NextResponse.json(
      {
        error: {
          code: 'already_claimed',
          message: 'This listing has already been claimed',
        },
      },
      { status: 409 },
    );
  }

  // Generate single-use token
  const rawToken = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const emailHash = hashEmail(email);

  // Delete any existing unused tokens for this listing+email combination
  await supabase
    .from('claim_tokens')
    .delete()
    .eq('listing_id', listing.id)
    .eq('claimant_email_hash', emailHash)
    .is('used_at', null);

  const { error: insertError } = await supabase.from('claim_tokens').insert({
    listing_id: listing.id,
    claimant_email: encrypt(email),
    claimant_email_hash: emailHash,
    claimant_name: encrypt(name),
    claimant_role: role,
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
  });

  if (insertError) {
    console.error('[claim/post] insert error:', insertError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to create claim token' } },
      { status: 500 },
    );
  }

  const verificationUrl = `${SITE_URL}/claim/${slug}/verify?token=${rawToken}`;

  try {
    await sendClaimVerificationEmail({
      to: email,
      claimantName: name,
      listingName: listing.name,
      verificationUrl,
    });
  } catch (err) {
    console.error('[claim/post] resend error:', err);
    return NextResponse.json(
      { error: { code: 'email_error', message: 'Failed to send verification email' } },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: 'Verification email sent' });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);
  const { searchParams } = new URL(request.url);

  const parsed = GetSchema.safeParse({ token: searchParams.get('token') });
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'validation_error', message: 'Token is required' } },
      { status: 422 },
    );
  }

  const { token } = parsed.data;
  const supabase = await createClient();

  // Resolve listing
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id, name')
    .eq('slug', slug)
    .eq('directory_id', directoryId)
    .single();

  if (listingError || !listing) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Listing not found' } },
      { status: 404 },
    );
  }

  const tokenHash = createHash('sha256').update(token).digest('hex');

  const { data: claimToken, error: tokenError } = await supabase
    .from('claim_tokens')
    .select('id, claimant_role, expires_at, used_at')
    .eq('listing_id', listing.id)
    .eq('token_hash', tokenHash)
    .single();

  if (tokenError || !claimToken) {
    return NextResponse.json(
      { error: { code: 'invalid_token', message: 'Invalid or expired token' } },
      { status: 400 },
    );
  }

  if (claimToken.used_at) {
    return NextResponse.json(
      { error: { code: 'token_used', message: 'This token has already been used' } },
      { status: 400 },
    );
  }

  if (new Date(claimToken.expires_at) < new Date()) {
    return NextResponse.json(
      { error: { code: 'token_expired', message: 'This token has expired' } },
      { status: 400 },
    );
  }

  // Require the claimant to be authenticated for the owner entry
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: {
          code: 'auth_required',
          message: 'You must be signed in to complete the claim',
        },
      },
      { status: 401 },
    );
  }

  // Insert listing_managers row
  const { error: managerError } = await supabase.from('listing_managers').upsert(
    {
      listing_id: listing.id,
      user_id: user.id,
      role: claimToken.claimant_role === 'owner' ? 'owner' : 'manager',
      accepted_at: new Date().toISOString(),
    },
    { onConflict: 'listing_id,user_id' },
  );

  if (managerError) {
    console.error('[claim/get] manager insert error:', managerError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to complete claim' } },
      { status: 500 },
    );
  }

  // Update listing status to 'claimed'
  await supabase
    .from('listings')
    .update({ status: 'claimed', updated_at: new Date().toISOString() })
    .eq('id', listing.id);

  // Mark token as used
  await supabase
    .from('claim_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', claimToken.id);

  return NextResponse.json({ success: true });
}
