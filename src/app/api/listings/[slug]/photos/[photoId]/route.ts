/**
 * DELETE /api/listings/[slug]/photos/[photoId]
 * Delete a listing photo (owner only). Removes from Supabase Storage and soft-deletes the DB row.
 *
 * F7 — Photo management
 * ADR-0004 (auth)
 * Data classification: C1 (storage_path)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getDirectoryId, requireListingOwner, resolveListingBySlug } from '@/lib/auth';

export const runtime = 'nodejs';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; photoId: string }> },
): Promise<NextResponse> {
  const { slug, photoId } = await params;
  const directoryId = getDirectoryId(request);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  const authResult = await requireListingOwner(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;

  const supabase = await createClient();

  // Fetch the photo record to get storage paths
  const { data: photo, error: fetchError } = await supabase
    .from('listing_photos')
    .select('id, storage_path, thumbnail_path, storage_bucket, listing_id, deleted_at')
    .eq('id', photoId)
    .eq('listing_id', listing.id)
    .single();

  if (fetchError || !photo) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Photo not found' } },
      { status: 404 },
    );
  }

  if (photo.deleted_at) {
    return NextResponse.json(
      { error: { code: 'already_deleted', message: 'Photo has already been deleted' } },
      { status: 409 },
    );
  }

  // Remove from Supabase Storage
  const adminSupabase = createAdminClient();
  const pathsToRemove = [photo.storage_path, photo.thumbnail_path].filter(Boolean);

  if (pathsToRemove.length > 0) {
    const { error: storageError } = await adminSupabase.storage
      .from(photo.storage_bucket)
      .remove(pathsToRemove);

    if (storageError) {
      console.error('[photos/delete] storage remove error:', storageError.message);
      // Continue to soft-delete the record even if storage removal fails
    }
  }

  // Soft delete the DB row
  const { error: updateError } = await supabase
    .from('listing_photos')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', photoId);

  if (updateError) {
    console.error('[photos/delete] soft delete error:', updateError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to delete photo' } },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
