/**
 * DELETE /api/listings/[slug]/managers/[userId]
 * Remove a manager from a listing (owner only).
 * Cannot remove the owner themselves.
 *
 * F9 — Manager management
 * ADR-0004 (auth)
 * Data classification: C1
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireListingOwner, resolveListingBySlug } from '@/lib/auth';

export const runtime = 'nodejs';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; userId: string }> },
): Promise<NextResponse> {
  const { slug, userId } = await params;
  const directoryId = getDirectoryId(request);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  const authResult = await requireListingOwner(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;
  const { user: owner } = authResult;

  // Prevent owner from removing themselves
  if (userId === owner.id) {
    return NextResponse.json(
      {
        error: {
          code: 'cannot_remove_self',
          message: 'The listing owner cannot remove themselves',
        },
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // Ensure target is not also an owner
  const { data: targetManager } = await supabase
    .from('listing_managers')
    .select('id, role')
    .eq('listing_id', listing.id)
    .eq('user_id', userId)
    .single();

  if (!targetManager) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Manager not found' } },
      { status: 404 },
    );
  }

  if (targetManager.role === 'owner') {
    return NextResponse.json(
      {
        error: {
          code: 'cannot_remove_owner',
          message: 'Cannot remove another owner from the listing',
        },
      },
      { status: 400 },
    );
  }

  const { error: deleteError } = await supabase
    .from('listing_managers')
    .delete()
    .eq('listing_id', listing.id)
    .eq('user_id', userId);

  if (deleteError) {
    console.error('[managers/delete] error:', deleteError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to remove manager' } },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
