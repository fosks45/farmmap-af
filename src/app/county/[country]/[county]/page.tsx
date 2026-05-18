import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generateCountyMetadata, buildBreadcrumbStructuredData } from '@/lib/seo'
import { ListingGrid } from '@/components/listing/ListingGrid'

const PER_PAGE = 20

interface Props {
  params: Promise<{ country: string; county: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, county } = await params
  const supabase = await createClient()
  const { count } = await supabase
    .from('listings')
    .select('id', { count: 'exact', head: true })
    .ilike('address->>county', county.replace(/-/g, ' '))
    .eq('is_active', true)

  return generateCountyMetadata(country, county, count ?? 0)
}

async function getCountyListings(country: string, county: string, page: number) {
  const supabase = await createClient()
  const countyName = county.replace(/-/g, ' ')
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const { data, count, error } = await supabase
    .from('listings')
    .select(`
      id, slug, listing_type, tier, name, description,
      address, lat, lng, geo_approximate,
      is_temporarily_closed, is_currently_stocked, is_claimed, is_active,
      currency, country_code, created_at, updated_at,
      opening_hours, product_types, payment_methods,
      contact_phone, contact_email, contact_website,
      stocked_updated_at, claimed_at,
      listing_photos(public_url, alt_text, is_primary, moderation_status)
    `, { count: 'exact' })
    .ilike('address->>county', countyName)
    .eq('is_active', true)
    .order('tier', { ascending: false })
    .order('name')
    .range(from, to)

  if (error) return { listings: [], total: 0 }

  const listings = (data ?? []).map((l) => {
    const photos = (l.listing_photos ?? []) as Array<{ public_url: string; alt_text: string; is_primary: boolean; moderation_status: string }>
    const primaryPhoto = photos.find((p) => p.is_primary && p.moderation_status === 'approved')
      ?? photos.find((p) => p.moderation_status === 'approved')
      ?? null
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { listing_photos: _, ...rest } = l as typeof l & { listing_photos: unknown }
    return { ...rest, primaryPhoto }
  })

  return { listings, total: count ?? 0 }
}

export default async function CountyPage({ params, searchParams }: Props) {
  const { country, county } = await params
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10))

  const { listings, total } = await getCountyListings(country, county, page)

  if (total === 0 && page === 1) {
    // Only 404 on page 1 with no results; later pages just show empty
    notFound()
  }

  const prettyCounty = county.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const prettyCountry = country.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://farmmap.co.uk'

  const breadcrumbJsonLd = buildBreadcrumbStructuredData([
    { name: 'Home', url: `${BASE}/` },
    { name: 'Farm Shops', url: `${BASE}/farm-shops` },
    { name: prettyCountry, url: `${BASE}/county/${country}` },
    { name: prettyCounty },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-text-secondary">
            <li>
              <Link href="/" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/farm-shops" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
                Farm Shops
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/county/${country}`} className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
                {prettyCountry}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-text-primary font-medium">{prettyCounty}</li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Farm Shops and Honesty Boxes in {prettyCounty}, {prettyCountry}
          </h1>
          <p className="text-text-secondary">
            {total.toLocaleString()} listing{total !== 1 ? 's' : ''} in {prettyCounty}
          </p>
        </header>

        {/* Static map placeholder (SEO page — no MapLibre) */}
        <div
          className="w-full aspect-[21/9] max-h-64 rounded-xl bg-surface-map mb-8 flex items-center justify-center border border-border-default"
          role="img"
          aria-label={`Map area for ${prettyCounty}, ${prettyCountry}`}
        >
          <p className="text-text-tertiary text-sm">
            <Link
              href={`/map`}
              className="underline text-text-link hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm"
            >
              View on interactive map →
            </Link>
          </p>
        </div>

        <ListingGrid
          listings={listings as Parameters<typeof ListingGrid>[0]['listings']}
          total={total}
          page={page}
          perPage={PER_PAGE}
          baseUrl={`/county/${country}/${county}`}
          emptyMessage={`No listings found in ${prettyCounty} yet.`}
        />
      </div>
    </>
  )
}
