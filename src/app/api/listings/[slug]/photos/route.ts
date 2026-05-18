/**
 * POST /api/listings/[slug]/photos
 * Upload a photo for a listing. Auth required (owner or manager).
 * Resizes to 1200×900 (main) and 400×300 (thumbnail) via sharp, uploads to Supabase Storage.
 *
 * F7 — Photo management
 * ADR-0004 (auth)
 * Data classification: C1 (storage_path); C0 (public photos after approval)
 */

import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getDirectoryId, requireListingManager, resolveListingBySlug } from '@/lib/auth';

export const runtime = 'nodejs';

const STORAGE_BUCKET = 'listing-photos';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);

  // Resolve listing
  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  // Require owner or manager
  const authResult = await requireListingManager(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;
  const { user } = authResult;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request must be multipart/form-data' } },
      { status: 400 },
    );
  }

  const file = formData.get('photo');
  const altText = (formData.get('alt_text') as string | null) ?? '';

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: { code: 'missing_file', message: 'A photo file is required' } },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error: {
          code: 'invalid_file_type',
          message: `File type must be one of: ${ALLOWED_TYPES.join(', ')}`,
        },
      },
      { status: 422 },
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      {
        error: {
          code: 'file_too_large',
          message: 'File must be smaller than 10 MB',
        },
      },
      { status: 422 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  // Resize to 1200×900 (main) and 400×300 (thumbnail)
  let mainBuffer: Buffer;
  let thumbBuffer: Buffer;
  try {
    mainBuffer = await sharp(inputBuffer)
      .resize(1200, 900, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82 })
      .toBuffer();

    thumbBuffer = await sharp(inputBuffer)
      .resize(400, 300, { fit: 'cover', position: 'centre' })
      .webp({ quality: 75 })
      .toBuffer();
  } catch (err) {
    console.error('[photos/post] sharp error:', err);
    return NextResponse.json(
      { error: { code: 'processing_error', message: 'Failed to process image' } },
      { status: 422 },
    );
  }

  const timestamp = Date.now();
  const basePath = `${listing.id}/${timestamp}`;
  const mainPath = `${basePath}/main.webp`;
  const thumbPath = `${basePath}/thumb.webp`;

  // Use admin client for storage uploads (bypasses RLS)
  const adminSupabase = createAdminClient();

  const { error: mainUploadError } = await adminSupabase.storage
    .from(STORAGE_BUCKET)
    .upload(mainPath, mainBuffer, { contentType: 'image/webp', upsert: false });

  if (mainUploadError) {
    console.error('[photos/post] main upload error:', mainUploadError.message);
    return NextResponse.json(
      { error: { code: 'upload_error', message: 'Failed to upload photo' } },
      { status: 500 },
    );
  }

  const { error: thumbUploadError } = await adminSupabase.storage
    .from(STORAGE_BUCKET)
    .upload(thumbPath, thumbBuffer, { contentType: 'image/webp', upsert: false });

  if (thumbUploadError) {
    // Attempt cleanup of main upload
    await adminSupabase.storage.from(STORAGE_BUCKET).remove([mainPath]);
    console.error('[photos/post] thumb upload error:', thumbUploadError.message);
    return NextResponse.json(
      { error: { code: 'upload_error', message: 'Failed to upload thumbnail' } },
      { status: 500 },
    );
  }

  // Get current max display_order for this listing
  const supabase = await createClient();
  const { data: maxOrderRow } = await supabase
    .from('listing_photos')
    .select('display_order')
    .eq('listing_id', listing.id)
    .is('deleted_at', null)
    .order('display_order', { ascending: false })
    .limit(1)
    .single();

  const displayOrder = ((maxOrderRow?.display_order as number | null) ?? -1) + 1;

  const { data: photoRow, error: insertError } = await supabase
    .from('listing_photos')
    .insert({
      listing_id: listing.id,
      directory_id: directoryId,
      uploaded_by: user.id,
      storage_path: mainPath,
      thumbnail_path: thumbPath,
      storage_bucket: STORAGE_BUCKET,
      alt_text: altText || null,
      moderation_status: 'pending',
      display_order: displayOrder,
    })
    .select('id')
    .single();

  if (insertError || !photoRow) {
    // Attempt cleanup
    await adminSupabase.storage.from(STORAGE_BUCKET).remove([mainPath, thumbPath]);
    console.error('[photos/post] insert error:', insertError?.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to save photo record' } },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      photoId: photoRow.id,
      message: 'Photo uploaded, pending moderation',
    },
    { status: 201 },
  );
}
