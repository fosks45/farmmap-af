/**
 * PATCH /api/listings/[slug]/reviews/[reviewId]
 * Owner response to a review (owner auth).
 * Response is set to moderation_status='pending' until approved by admin.
 *
 * F5 — Reviews
 * ADR-0004 (auth)
 * Data classification: C1 (owner_response)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireListingOwner, resolveListingBySlug } from '@/lib/auth';

export const runtime = 'nodejs';

const OwnerResponseSchema = z.object({
  owner_response: z
    .string()
    .min(1, 'Response cannot be empty')
    .max(1000, 'Response must be at most 1000 characters'),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string; reviewId: string }> },
): Promise<NextResponse> {
  const { slug, reviewId } = await params;
  const directoryId = getDirectoryId(request);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  const authResult = await requireListingOwner(request, listing.id);
  if (authResult instanceof NextResponse) return authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parsed = OwnerResponseSchema.safeParse(body);
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

  const supabase = await createClient();

  // Verify review exists and belongs to this listing
  const { data: review, error: fetchError } = await supabase
    .from('reviews')
    .select('id, moderation_status, listing_id')
    .eq('id', reviewId)
    .eq('listing_id', listing.id)
    .eq('moderation_status', 'approved')
    .single();

  if (fetchError || !review) {
    return NextResponse.json(
      {
        error: {
          code: 'not_found',
          message: 'Review not found or not yet approved',
        },
      },
      { status: 404 },
    );
  }

  const { error: updateError } = await supabase
    .from('reviews')
    .update({
      owner_response: parsed.data.owner_response,
      owner_response_status: 'pending',
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId);

  if (updateError) {
    console.error('[reviews/[reviewId]/patch] error:', updateError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to save response' } },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: 'Response submitted, pending moderation',
  });
}
