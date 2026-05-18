import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Multi-tenancy middleware.
 * 1. Reads the host header to determine the directory.
 * 2. Sets `x-directory-id` in request headers for downstream RSC/API handlers.
 * 3. Refreshes Supabase auth session tokens (required for SSR auth).
 *
 * Directory resolution: queries the `directories` config table via the public
 * API (anon key). The host → directory_id mapping is cached at the CDN edge.
 *
 * For local development: defaults to directory_id = 1 (Farmmap).
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh the auth session — do NOT remove this.
  // It refreshes the user's session silently so subsequent RSC requests are authenticated.
  await supabase.auth.getUser()

  // ── Directory detection ──────────────────────────────────────────────────
  const host = request.headers.get('host') ?? ''
  const directoryId = resolveDirectoryId(host)

  supabaseResponse.headers.set('x-directory-id', String(directoryId))
  supabaseResponse.headers.set('x-forwarded-host', host)

  // ── Route protection ─────────────────────────────────────────────────────
  const { pathname } = request.nextUrl

  // Dashboard and admin routes require authentication.
  // The actual auth guard is in the layout's server component,
  // but we add a lightweight check here to avoid unnecessary rendering.
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return supabaseResponse
}

/**
 * Resolve a directory_id from a host header.
 * Production: queries the database. Development: hardcoded map.
 *
 * The hostname→id map is small and changes rarely, so it is safe to keep a
 * process-level cache here. An edge config or Redis cache should replace this
 * in production for multi-tenant edge deployments.
 */
function resolveDirectoryId(host: string): number {
  const DIRECTORY_MAP: Record<string, number> = {
    'farmmap.co.uk': 1,
    'www.farmmap.co.uk': 1,
    'farmmap.ie': 1,
    'www.farmmap.ie': 1,
    'tractormap.co.uk': 2,
    'www.tractormap.co.uk': 2,
    'berthmap.co.uk': 3,
    'www.berthmap.co.uk': 3,
    'localhost:3000': 1,
    'localhost': 1,
  }

  // Strip port for lookup
  const hostname = host.split(':')[0]
  return DIRECTORY_MAP[host] ?? DIRECTORY_MAP[hostname] ?? 1
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico   (favicon)
     * - /api/         (API routes handle their own auth)
     * - robots.txt, sitemap.xml
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|robots.txt|sitemap.*\\.xml).*)',
  ],
}
