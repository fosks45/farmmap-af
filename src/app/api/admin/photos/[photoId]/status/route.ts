/**
 * PATCH /api/admin/photos/[photoId]/status
 * Approve or reject a photo (or bulk up to 50). Admin auth required.
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

const UpdatePhotoStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  reason: z.string().max(500).optional(),
  // Bulk: up to 50 photo IDs. If provided, photoId from URL is ignored.
  photoIds: z.array(z.string().uuid()).max(50).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ photoId: string }> },
): Promise<NextResponse> {
  const { photoId } = await params;
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

  const parsed = UpdatePhotoStatusSchema.safeParse(body);
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

  const { status, reason, photoIds } = parsed.data;

  // Resolve target IDs: bulk if provided, otherwise single from URL
  const targetIds =
    photoIds && photoIds.length > 0 ? photoIds : [photoId];

  const supabase = await createClient();

  const updatePayload: Record<string, unknown> = {
    moderation_status: status,
  };

  if (status === 'rejected') {
    updatePayload.rejection_reason = reason ?? null;
    updatePayload.rejected_by = user.id;
  }

  const { data: updated, error: updateError } = await supabase
    .from('listing_photos')
    .update(updatePayload)
    .in('id', targetIds)
    .eq('directory_id', directoryId)
    .eq('moderation_status', 'pending')
    .is('deleted_at', null)
    .select('id, listing_id');

  if (updateError) {
    console.error('[admin/photos/[photoId]/status] update error:', updateError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to update photo status' } },
      { status: 500 },
    );
  }

  const updatedIds = (updated ?? []).map((p) => p.id);

  if (updatedIds.length === 0) {
    return NextResponse.json(
      {
        error: {
          code: 'not_found',
          message: 'No pending photos found with the provided IDs',
        },
      },
      { status: 404 },
    );
  }

  // Write audit log entries (one per photo)
  const actorHash = hashActorId(user.id);
  const auditEntries = (updated ?? []).map((p) => ({
    directory_id: directoryId,
    actor_id_hash: actorHash,
    actor_role: adminRole,
    action: status === 'approved' ? 'photo_approved' : 'photo_rejected',
    entity_type: 'photo',
    entity_id: p.id,
    previous_value: { moderation_status: 'pending' },
    new_value: { moderation_status: status },
    metadata_json: reason ? { reason } : {},
  }));

  await supabase.from('audit_log').insert(auditEntries);

  return NextResponse.json({
    updated: updatedIds.length,
    ids: updatedIds,
    status,
  });
}
