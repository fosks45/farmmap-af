/**
 * GET  /api/listings/[slug]/reviews — list approved reviews (public)
 * POST /api/listings/[slug]/reviews — submit a review (auth required)
 *
 * F5 — Reviews
 * ADR-0004 (auth)
 * Data classification: C0/C1 (review body), C3 (reviewer identity not exposed)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDirectoryId, requireAuth, resolveListingBySlug } from '@/lib/auth';
import { trackEvent, getClientIp } from '@/lib/analytics';

export const runtime = 'nodejs';

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

const CreateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  body: z
    .string()
    .min(20, 'Review must be at least 20 characters')
    .max(1000, 'Review must be at most 1000 characters'),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const directoryId = getDirectoryId(request);
  const { searchParams } = new URL(request.url);

  const listingResult = await resolveListingBySlug(slug, directoryId);
  if (listingResult instanceof NextResponse) return listingResult;
  const listing = listingResult;

  if (listing.status !== 'active') {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Listing not found' } },
      { status: 404 },
    );
  }

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

  const { data: reviews, error, count } = await supabase
    .from('reviews')
    .select('id, rating, body, owner_response, owner_response_status, created_at', {
      count: 'exact',
    })
    .eq('listing_id', listing.id)
    .eq('directory_id', directoryId)
    .eq('moderation_status', 'approved')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('[reviews/get] query error:', error.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to fetch reviews' } },
      { status: 500 },
    );
  }

  const total = count ?? 0;
  const total_pages = Math.ceil(total / limit);

  return NextResponse.json({
    data: (reviews ?? []).map((r) => ({
      id: r.id,
      rating: r.rating,
      body: r.body,
      // Only show approved owner responses
      owner_response:
        r.owner_response_status === 'approved' ? r.owner_response : null,
      created_at: r.created_at,
    })),
    pagination: { page, limit, total, total_pages },
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

  if (listing.status !== 'active') {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Listing not found' } },
      { status: 404 },
    );
  }

  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { user } = authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_body', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parsed = CreateReviewSchema.safeParse(body);
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

  const { rating, body: reviewBody } = parsed.data;
  const supabase = await createClient();

  // One review per user per listing (unique constraint in DB)
  const { error: insertError } = await supabase.from('reviews').insert({
    listing_id: listing.id,
    directory_id: directoryId,
    reviewer_user_id: user.id,
    rating,
    body: reviewBody,
    moderation_status: 'pending',
  });

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json(
        {
          error: {
            code: 'duplicate_review',
            message: 'You have already submitted a review for this listing',
          },
        },
        { status: 409 },
      );
    }
    console.error('[reviews/post] insert error:', insertError.message);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'Failed to submit review' } },
      { status: 500 },
    );
  }

  // Track analytics
  void trackEvent({
    eventType: 'review_submission',
    directoryId,
    listingId: listing.id,
    ip: getClientIp(request),
    userAgent: request.headers.get('user-agent') ?? '',
  });

  return NextResponse.json(
    { message: 'Review submitted, pending moderation' },
    { status: 201 },
  );
}
