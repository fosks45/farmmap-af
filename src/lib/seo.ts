import type { Metadata } from 'next'
import type { Listing, ListingDetail } from './types'
import { listingTypeConfig } from './tokens'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://farmmap.co.uk'

function buildListingUrl(listing: Pick<Listing, 'listing_type' | 'address' | 'slug'>): string {
  const typeSlug = listingTypeConfig[listing.listing_type].slug
  const country = listing.address.country.toLowerCase().replace(/\s+/g, '-')
  const county = listing.address.county.toLowerCase().replace(/\s+/g, '-')
  return `${BASE_URL}/listings/${typeSlug}/${country}/${county}/${listing.slug}`
}

export function generateListingMetadata(listing: ListingDetail): Metadata {
  const typeLabel = listingTypeConfig[listing.listing_type].label
  const url = buildListingUrl(listing)
  const primaryPhoto = listing.photos.find((p) => p.is_primary) ?? listing.photos[0]

  const productList = listing.product_types.slice(0, 3).join(', ')
  const descriptionBase = `Visit ${listing.name} in ${listing.address.town}, ${listing.address.county}. ${typeLabel}${productList ? ` — ${productList}` : ''}.`
  const description = listing.description
    ? `${descriptionBase} ${listing.description.slice(0, 80)}`.slice(0, 160)
    : descriptionBase.slice(0, 160)

  return {
    title: `${listing.name}, ${listing.address.county} — Farmmap`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${listing.name} — Farmmap`,
      description,
      url,
      type: 'place',
      locale: listing.country_code === 'IE' ? 'en_IE' : 'en_GB',
      images: primaryPhoto
        ? [
            {
              url: primaryPhoto.public_url,
              width: primaryPhoto.width,
              height: primaryPhoto.height,
              alt: primaryPhoto.alt_text,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${listing.name} — Farmmap`,
      description,
      images: primaryPhoto ? [primaryPhoto.public_url] : [],
    },
  }
}

export function generateCountyMetadata(country: string, county: string, count: number): Metadata {
  const prettyCounty = county.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const prettyCountry = country.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const url = `${BASE_URL}/county/${country}/${county}`
  const title = `Farm shops in ${prettyCounty} — Farmmap`
  const description = `Find ${count} farm shops and honesty boxes in ${prettyCounty}, ${prettyCountry}. Browse local produce, opening hours, and directions.`.slice(0, 160)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export function generateCountryMetadata(country: string, count: number): Metadata {
  const prettyCountry = country.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const url = `${BASE_URL}/${country}`
  const title = `Farm shops in ${prettyCountry} — Farmmap | Directory`
  const description = `Browse ${count} farm shops and honesty boxes across ${prettyCountry}. Find local produce near you.`.slice(0, 160)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'en_GB',
    },
  }
}

export function generateListingTypeMetadata(type: string, count: number): Metadata {
  const prettyType = type.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const url = `${BASE_URL}/${type}s/`
  const title = `${prettyType}s across the UK — Farmmap Directory`
  const description = `Find ${count} ${prettyType.toLowerCase()}s across the United Kingdom and Republic of Ireland. Browse local farm produce near you.`.slice(0, 160)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'en_GB',
    },
  }
}

// ─── JSON-LD structured data builders ───────────────────────────────────

export function buildListingStructuredData(listing: ListingDetail): object {
  const url = buildListingUrl(listing)
  const primaryPhoto = listing.photos.find((p) => p.is_primary) ?? listing.photos[0]
  const { aggregate_rating } = listing

  const dayNames: Record<number, string> = {
    0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
    4: 'Thursday', 5: 'Friday', 6: 'Saturday',
  }

  const openingHoursSpec = listing.opening_hours?.regular.flatMap((slot) =>
    slot.day_of_week.map((day) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayNames[day],
      opens: slot.opens,
      closes: slot.closes,
    })),
  ) ?? []

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'FoodEstablishment'],
    name: listing.name,
    description: listing.description ?? undefined,
    url,
    image: primaryPhoto?.public_url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address.street,
      addressLocality: listing.address.town,
      addressRegion: listing.address.county,
      postalCode: listing.address.postcode ?? listing.address.eircode ?? undefined,
      addressCountry: listing.country_code,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: listing.lat,
      longitude: listing.lng,
    },
    telephone: listing.contact_phone ?? undefined,
    sameAs: listing.contact_website ?? undefined,
    openingHoursSpecification: openingHoursSpec.length > 0 ? openingHoursSpec : undefined,
    servesCuisine: listing.product_types.length > 0 ? listing.product_types : undefined,
    priceRange: '£',
  }

  // Only include aggregateRating if ≥ 3 reviews (spec F5)
  if (aggregate_rating && aggregate_rating.review_count >= 3) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregate_rating.avg_rating.toFixed(1),
      reviewCount: aggregate_rating.review_count,
    }
  }

  return structuredData
}

export function buildBreadcrumbStructuredData(
  crumbs: Array<{ name: string; url?: string }>,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.url ? { item: crumb.url } : {}),
    })),
  }
}
