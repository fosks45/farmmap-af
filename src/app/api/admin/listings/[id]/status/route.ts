/**
 * PATCH /api/admin/listings/[id]/status
 * Approve or reject a listing. Admin auth required (content_moderator+).
 * Writes to audit_log.
 *
 * F17 — Admin moderation
 * ADR-0004 (auth)
 * Data classification: C1
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireAdmin } from '@/lib/auth';
import { hashActorId } from '@/lib/hmac';

export const runtime = 'nodejs';

const UpdateStatusSchema = z.object({
  status: z.enum(['active', 'suspended']),
  reason: z.string().max(500).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const directoryId = getDirectoryId(request);

  const authResult = await requireAdmin(request, 'content_moderator');
  if (authResult instanceof NextResponse) return authResult;
  const { user, adminRole } = authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parsed = UpdateStatusSchema.safeParse(body);
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

  const { status, reason } = parsed.data;
  const supabase = await createClient();

  // Fetch current listing
  const { data: listing, error: fetchError } = await supabase
    .from('listings')
    .select('id, status, name, directory_id')
    .eq('id', id)
    .eq('directory_id', directoryId)
    .single();

  if (fetchError || !listing) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Listing not found' } },
      { status: 404 },
    );
  }

  const previousStatus = listing.status;

  const { error: updateError } = await supabase
    .from('listings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (updateError) {
    console.error('[admin/listings/[id]/status] update error:', updateError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to update listing status' } },
      { status: 500 },
    );
  }

  // Write to audit_log (Constitution Principle 10)
  await supabase.from('audit_log').insert({
    directory_id: directoryId,
    actor_id_hash: hashActorId(user.id),
    actor_role: adminRole,
    action: status === 'active' ? 'listing_approved' : 'listing_suspended',
    entity_type: 'listing',
    entity_id: id,
    previous_value: { status: previousStatus },
    new_value: { status },
    metadata_json: reason ? { reason } : {},
  });

  return NextResponse.json({ id, status });
}
