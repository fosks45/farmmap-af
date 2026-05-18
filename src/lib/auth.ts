/**
 * Server-side auth helpers for API route handlers.
 * Extracts the current user and checks listing management roles.
 *
 * ADR: ADR-0004
 * Data classification: C1 (user IDs and roles are internal)
 */

import { createClient } from './supabase/server';
import { NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';

export interface AuthResult {
  user: User;
  directoryId: string;
}

export type AuthError = NextResponse;

/**
 * Resolves the directory_id from the Host header.
 * In production, the host is farmmap.co.uk.
 * In development, falls back to the seed directory ID.
 */
export function getDirectoryId(request: Request): string {
  const host = request.headers.get('host') ?? '';
  // In development/test, fall back to the seed directory ID
  if (
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('vercel.app')
  ) {
    return process.env.NEXT_PUBLIC_DEFAULT_DIRECTORY_ID ??
      '00000000-0000-0000-0000-000000000001';
  }
  // In production, the middleware resolves and injects x-directory-id
  const injectedId = request.headers.get('x-directory-id');
  if (injectedId) return injectedId;

  // Fallback: farmmap.co.uk seed directory
  return '00000000-0000-0000-0000-000000000001';
}

/**
 * Requires authentication. Returns the user or a 401 response.
 */
export async function requireAuth(
  request: Request,
): Promise<{ user: User; directoryId: string } | NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { code: 'unauthorized', message: 'Authentication required' },
      { status: 401 },
    );
  }

  return { user, directoryId: getDirectoryId(request) };
}

/**
 * Requires the authenticated user to be an owner or manager for a listing.
 * Returns the user and their role, or a 403 response.
 */
export async function requireListingManager(
  request: Request,
  listingId: string,
): Promise<
  | { user: User; directoryId: string; role: 'owner' | 'manager' }
  | NextResponse
> {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const { user, directoryId } = authResult;
  const supabase = await createClient();

  const { data: manager, error } = await supabase
    .from('listing_managers')
    .select('role')
    .eq('listing_id', listingId)
    .eq('user_id', user.id)
    .not('accepted_at', 'is', null)
    .single();

  if (error || !manager) {
    return NextResponse.json(
      { code: 'forbidden', message: 'You do not have access to this listing' },
      { status: 403 },
    );
  }

  return { user, directoryId, role: manager.role as 'owner' | 'manager' };
}

/**
 * Requires the authenticated user to be the owner of a listing (not just a manager).
 */
export async function requireListingOwner(
  request: Request,
  listingId: string,
): Promise<{ user: User; directoryId: string } | NextResponse> {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const { user, directoryId } = authResult;
  const supabase = await createClient();

  const { data: manager, error } = await supabase
    .from('listing_managers')
    .select('role')
    .eq('listing_id', listingId)
    .eq('user_id', user.id)
    .eq('role', 'owner')
    .single();

  if (error || !manager) {
    return NextResponse.json(
      { code: 'forbidden', message: 'Only the listing owner can perform this action' },
      { status: 403 },
    );
  }

  return { user, directoryId };
}

/**
 * Requires the authenticated user to have an admin role.
 */
export async function requireAdmin(
  request: Request,
  minRole: 'content_moderator' | 'directory_admin' | 'super_admin' = 'content_moderator',
): Promise<{ user: User; directoryId: string; adminRole: string } | NextResponse> {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const { user, directoryId } = authResult;
  const supabase = await createClient();

  const { data: userProfile } = await supabase
    .from('users')
    .select('admin_role')
    .eq('id', user.id)
    .single();

  const role = userProfile?.admin_role;
  const roleHierarchy = ['content_moderator', 'directory_admin', 'super_admin'];
  const minIndex = roleHierarchy.indexOf(minRole);
  const userIndex = role ? roleHierarchy.indexOf(role) : -1;

  if (userIndex < minIndex) {
    return NextResponse.json(
      { code: 'forbidden', message: 'Insufficient admin permissions' },
      { status: 403 },
    );
  }

  return { user, directoryId, adminRole: role! };
}

/**
 * Resolves a listing ID from a slug within a directory.
 * Returns the listing record or a 404 response.
 */
export async function resolveListingBySlug(
  slug: string,
  directoryId: string,
): Promise<
  { id: string; tier: string; status: string; stripe_connect_account_id?: string | null } | NextResponse
> {
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from('listings')
    .select('id, tier, status')
    .eq('slug', slug)
    .eq('directory_id', directoryId)
    .single();

  if (error || !listing) {
    return NextResponse.json(
      { code: 'not_found', message: 'Listing not found' },
      { status: 404 },
    );
  }

  return listing;
}
