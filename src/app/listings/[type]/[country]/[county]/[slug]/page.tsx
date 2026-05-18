import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@/lib/supabase/admin'
import {
  generateListingMetadata,
  buildListingStructuredData,
  buildBreadcrumbStructuredData,
} from '@/lib/seo'
import { listingTypeConfig } from '@/lib/tokens'
import { trackEvent, getClientIp } from '@/lib/analytics'
import { ListingDetail } from '@/components/listing/ListingDetail'
import { headers } from 'next/headers'
import type { ListingDetail as ListingDetailType } from '@/lib/types'

interface Props {
  params: Promise<{
    type: string
    country: string
    county: string
    slug: string
  }>
}

async function getListingDetail(slug: string): Promise<ListingDetailType | null> {
  const supabase = await createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select(`
      *,
      listing_photos(*, moderation_status),
      listing_products:products(*),
      listing_reviews:reviews(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!listing) return null

  // Aggregate rating
  const approvedReviews = (listing.listing_reviews ?? []).filter(
    (r: { moderation_status: string; rating: number }) => r.moderation_status === 'approved',
  )
  const avgRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / approvedReviews.length
      : null

  return {
    ...listing,
    photos: listing.listing_photos ?? [],
    reviews: listing.listing_reviews ?? [],
    products: listing.listing_products ?? [],
    aggregate_rating:
      avgRating !== null
        ? { avg_rating: avgRating, review_count: approvedReviews.length }
        : null,
    nearby_listings: [],
  } as unknown as ListingDetailType
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingDetail(slug)
  if (!listing) return { title: 'Listing not found — Farmmap' }
  return generateListingMetadata(listing)
}

export async function generateStaticParams() {
  // Build static params for known slugs at build time
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('listings')
      .select('slug, listing_type, address')
      .eq('is_active', true)
      .limit(500)

    return (data ?? []).map((l) => {
      const typeSlug = listingTypeConfig[l.listing_type as keyof typeof listingTypeConfig]?.slug ?? 'farm-shop'
      const addr = l.address as { country: string; county: string }
      return {
        type: typeSlug,
        country: addr.country.toLowerCase().replace(/\s+/g, '-'),
        county: addr.county.toLowerCase().replace(/\s+/g, '-'),
        slug: l.slug,
      }
    })
  } catch {
    return []
  }
}

export default async function ListingPage({ params }: Props) {
  const { type, country, county, slug } = await params
  const listing = await getListingDetail(slug)

  if (!listing) notFound()

  // Verify the URL type matches the listing type (canonical redirect handled by middleware)
  const expectedTypeSlug = listingTypeConfig[listing.listing_type]?.slug
  if (type !== expectedTypeSlug) notFound()

  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Waitlist count
  const { count: waitlistCount } = await supabase
    .from('waitlist_entries')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', listing.id)
    .eq('confirmed', true)
    .eq('unsubscribed', false)

  // Track page view (server-side, no cookies, C0)
  const headersList = await headers()
  const ip = getClientIp({ headers: headersList } as unknown as Request)
  const ua = headersList.get('user-agent') ?? ''
  const directoryId = headersList.get('x-directory-id') ?? '1'

  // Fire analytics in background — must not block render
  void trackEvent({
    eventType: 'listing_page_view',
    directoryId,
    listingId: listing.id,
    ip,
    userAgent: ua,
  })

  const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://farmmap.co.uk'
  const listingJsonLd = buildListingStructuredData(listing)
  const prettyCounty = county.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const prettyCountry = country.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const typeConfig = listingTypeConfig[listing.listing_type]

  const breadcrumbJsonLd = buildBreadcrumbStructuredData([
    { name: 'Home', url: `${BASE}/` },
    { name: typeConfig.pluralLabel, url: `${BASE}/${typeConfig.slug}s` },
    { name: prettyCountry, url: `${BASE}/county/${country}` },
    { name: prettyCounty, url: `${BASE}/county/${country}/${county}` },
    { name: listing.name },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-text-secondary">
            <li>
              <Link href="/" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/${typeConfig.slug}s`} className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
                {typeConfig.pluralLabel}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/county/${country}/${county}`} className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
                {prettyCounty}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-text-primary font-medium">{listing.name}</li>
          </ol>
        </nav>
      </div>

      <ListingDetail
        listing={listing}
        isAuthenticated={!!user}
        waitlistCount={waitlistCount ?? 0}
      />
    </>
  )
}
