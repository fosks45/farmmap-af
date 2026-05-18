/**
 * GET  /api/listings/[slug]/managers — list managers (owner auth)
 * POST /api/listings/[slug]/managers — invite a manager by email (owner auth)
 *
 * F9 — Manager management
 * ADR-0004 (auth)
 * Data classification: C1/C3 (invitation_email encrypted)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes, createHash } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireListingOwner, resolveListingBySlug } from '@/lib/auth';
import { encrypt, decryptNullable } from '@/lib/encryption';
import { hashEmail } from '@/lib/hmac';
import { sendManagerInvitationEmail } from '@/lib/resend';

export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://farmmap.co.uk';

const InviteManagerSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.literal('manager').default('manager'),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  const authResult = await requireListingOwner(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;

  const supabase = await createClient();

  const { data: managers, error } = await supabase
    .from('listing_managers')
    .select('id, user_id, role, accepted_at, created_at')
    .eq('listing_id', listing.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[managers/get] query error:', error.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to fetch managers' } },
      { status: 500 },
    );
  }

  // Fetch pending invitations
  const { data: invitations } = await supabase
    .from('manager_invitations')
    .select('id, expires_at, accepted_at, created_at')
    .eq('listing_id', listing.id)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString());

  return NextResponse.json({
    managers: (managers ?? []).map((m) => ({
      id: m.id,
      user_id: m.user_id,
      role: m.role,
      accepted_at: m.accepted_at,
      created_at: m.created_at,
    })),
    pending_invitations: (invitations ?? []).map((i) => ({
      id: i.id,
      expires_at: i.expires_at,
      created_at: i.created_at,
    })),
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  const authResult = await requireListingOwner(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;
  const { user: owner } = authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parsed = InviteManagerSchema.safeParse(body);
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
  const supabase = await createClient();

  const emailHash = hashEmail(email);

  // Check if this email already has an active manager entry
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email_hash', emailHash)
    .single();

  if (existingUser) {
    const { data: existingManager } = await supabase
      .from('listing_managers')
      .select('id')
      .eq('listing_id', listing.id)
      .eq('user_id', existingUser.id)
      .not('accepted_at', 'is', null)
      .single();

    if (existingManager) {
      return NextResponse.json(
        {
          error: {
            code: 'already_manager',
            message: 'This user is already a manager for this listing',
          },
        },
        { status: 409 },
      );
    }
  }

  // Generate invitation token
  const rawToken = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  // Delete any existing pending invitation for this listing+email
  await supabase
    .from('manager_invitations')
    .delete()
    .eq('listing_id', listing.id)
    .eq('invited_email_hash', emailHash)
    .is('accepted_at', null);

  const { data: invitation, error: insertError } = await supabase
    .from('manager_invitations')
    .insert({
      listing_id: listing.id,
      invited_by: owner.id,
      invited_email: encrypt(email),
      invited_email_hash: emailHash,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
    })
    .select('id')
    .single();

  if (insertError || !invitation) {
    console.error('[managers/post] insert error:', insertError?.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to create invitation' } },
      { status: 500 },
    );
  }

  const acceptUrl = `${SITE_URL}/manage/${slug}/accept-invite?token=${rawToken}`;

  // Fetch owner display name for the email
  const { data: ownerProfile } = await supabase
    .from('users')
    .select('display_name')
    .eq('id', owner.id)
    .single();

  const ownerName = ownerProfile?.display_name
    ? (decryptNullable(ownerProfile.display_name) ?? 'A listing owner')
    : 'A listing owner';

  // Fetch listing name
  const { data: listingRow } = await supabase
    .from('listings')
    .select('name')
    .eq('id', listing.id)
    .single();

  try {
    await sendManagerInvitationEmail({
      to: email,
      invitedByName: ownerName,
      listingName: listingRow?.name ?? 'a Farmmap listing',
      acceptUrl,
    });
  } catch (err) {
    console.error('[managers/post] resend error:', err);
    return NextResponse.json(
      { error: { code: 'email_error', message: 'Failed to send invitation email' } },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: 'Invitation sent', invitation_id: invitation.id },
    { status: 201 },
  );
}
