/**
 * GET /api/admin/photos/queue
 * Photo moderation queue — pending photos grouped by listing. Admin auth required.
 *
 * F17 — Admin moderation
 * ADR-0004 (auth)
 * Data classification: C1
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: Request): Promise<NextResponse> {
  const directoryId = getDirectoryId(request);

  const authResult = await requireAdmin(request, 'content_moderator');
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'validation_error',
          message: 'Invalid query parameters',
          details: parsed.error.flatten(),
        },
      },
      { status: 422 },
    );
  }

  const { page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  const { data: photos, error, count } = await supabase
    .from('listing_photos')
    .select(
      `
      id, listing_id, storage_path, thumbnail_path, alt_text, display_order, created_at,
      listings(id, name, slug)
      `,
      { count: 'exact' },
    )
    .eq('directory_id', directoryId)
    .eq('moderation_status', 'pending')
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('[admin/photos/queue/get] query error:', error.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to fetch photo queue' } },
      { status: 500 },
    );
  }

  const total = count ?? 0;
  const total_pages = Math.ceil(total / limit);

  return NextResponse.json({
    data: photos ?? [],
    pagination: { page, limit, total, total_pages },
  });
}
