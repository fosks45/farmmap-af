import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ListingGrid } from '@/components/listing/ListingGrid'

export const metadata: Metadata = {
  title: 'Farm Shops in the UK — Farmmap',
  description:
    'Browse farm shops across the UK and Ireland. Find fresh local produce, opening hours, and get directions to farm shops near you.',
  alternates: {
    canonical: 'https://farmmap.co.uk/farm-shops',
  },
}

const PER_PAGE = 20

interface SearchParams {
  page?: string
}

async function getTopCounties() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('address->county')
    .eq('listing_type', 'farm_shop')
    .eq('is_active', true)
    .limit(1000)

  if (!data) return []
  const counts: Record<string, number> = {}
  for (const row of data) {
    const county = (row as unknown as { county: string }).county
    if (county) counts[county] = (counts[county] ?? 0) + 1
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([county, count]) => ({ county, count }))
}

async function getListings(page: number) {
  const supabase = await createClient()
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const { data, count, error } = await supabase
    .from('listings')
    .select(`
      id, slug, listing_type, tier, name, description,
      address, lat, lng, geo_approximate,
      is_temporarily_closed, is_claimed, is_active,
      currency, country_code, created_at, updated_at,
      opening_hours, product_types, payment_methods,
      contact_phone, contact_email, contact_website,
      is_currently_stocked, stocked_updated_at, claimed_at,
      listing_photos!inner(public_url, alt_text, is_primary, moderation_status)
    `, { count: 'exact' })
    .eq('listing_type', 'farm_shop')
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

// JSON-LD for ItemList
function buildItemListJsonLd(listings: Array<{ name: string; slug: string; address: { county: string; country: string }; listing_type: string }>) {
  const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://farmmap.co.uk'
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Farm Shops across the UK and Ireland',
    itemListElement: listings.slice(0, 10).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/listings/farm-shop/${l.address.country.toLowerCase().replace(/\s+/g, '-')}/${l.address.county.toLowerCase().replace(/\s+/g, '-')}/${l.slug}`,
      name: l.name,
    })),
  }
}

export default async function FarmShopsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const [{ listings, total }, topCounties] = await Promise.all([
    getListings(page),
    getTopCounties(),
  ])

  const jsonLd = buildItemListJsonLd(listings as Parameters<typeof buildItemListJsonLd>[0])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Farm Shops across the UK and Ireland
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Browse {total.toLocaleString()} farm shops in the directory. Find fresh, seasonal local
            produce direct from the farmer.
          </p>
        </header>

        {/* County nav */}
        {topCounties.length > 0 && (
          <nav aria-label="Browse by county" className="mb-8">
            <p className="text-sm font-medium text-text-secondary mb-3">Browse by county</p>
            <ul className="flex flex-wrap gap-2">
              {topCounties.map(({ county, count }) => {
                const countySlug = county.toLowerCase().replace(/\s+/g, '-')
                return (
                  <li key={county}>
                    <Link
                      href={`/county/united-kingdom/${countySlug}`}
                      className="
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        border border-border-default bg-surface-elevated
                        text-xs font-medium text-text-secondary
                        hover:bg-surface-raised hover:text-text-primary transition-colors
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
                      "
                    >
                      {county}
                      <span className="text-text-tertiary">({count})</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}

        <ListingGrid
          listings={listings as Parameters<typeof ListingGrid>[0]['listings']}
          total={total}
          page={page}
          perPage={PER_PAGE}
          baseUrl="/farm-shops"
          emptyMessage="No farm shops found in the directory yet."
        />
      </div>
    </>
  )
}
