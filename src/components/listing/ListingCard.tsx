import Link from 'next/link'
import Image from 'next/image'
import type { Listing, ListingPhoto, AggregateRating } from '@/lib/types'
import { listingTypeConfig } from '@/lib/tokens'
import { TierBadge } from '@/components/ui/TierBadge'
import { StarRatingDisplay } from '@/components/ui/StarRating'

/**
 * ListingCard — used in county pages and search results.
 * Tap target meets WCAG 2.5.8 (24×24 CSS px minimum).
 * Type badge uses colour + text label (WCAG 1.4.1).
 */

interface ListingCardProps {
  listing: Listing & {
    primaryPhoto?: Pick<ListingPhoto, 'public_url' | 'alt_text'> | null
    aggregate_rating?: AggregateRating | null
  }
}

const TYPE_BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  farm_shop: { bg: 'bg-brand-primary-light', text: 'text-brand-primary' },
  honesty_box: { bg: 'bg-status-success-light', text: 'text-status-success-text' },
  farm_gate_stall: { bg: 'bg-status-info-light', text: 'text-status-info-text' },
  roadside_stand: { bg: 'bg-status-warning-light', text: 'text-status-warning-text' },
}

export function ListingCard({ listing }: ListingCardProps) {
  const typeConfig = listingTypeConfig[listing.listing_type]
  const typeBadge = TYPE_BADGE_STYLES[listing.listing_type] ?? TYPE_BADGE_STYLES.farm_shop
  const country = listing.address.country.toLowerCase().replace(/\s+/g, '-')
  const county = listing.address.county.toLowerCase().replace(/\s+/g, '-')
  const href = `/listings/${typeConfig.slug}/${country}/${county}/${listing.slug}`

  return (
    <article className="bg-surface-elevated rounded-xl border border-border-default hover:border-border-strong transition-colors shadow-sm hover:shadow-md overflow-hidden">
      <Link
        href={href}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus rounded-xl"
        aria-label={`${listing.name} — ${typeConfig.label} in ${listing.address.county}`}
      >
        {/* Photo */}
        <div className="relative aspect-[16/9] bg-surface-raised overflow-hidden">
          {listing.primaryPhoto ? (
            <Image
              src={listing.primaryPhoto.public_url}
              alt={listing.primaryPhoto.alt_text}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-tertiary">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 opacity-30">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
          )}
          {/* Tier badge overlay */}
          <div className="absolute top-2 right-2">
            <TierBadge tier={listing.tier} size="sm" />
          </div>
          {listing.is_temporarily_closed && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-status-error text-text-inverse text-xs font-bold px-2 py-1 rounded">
                Temporarily closed
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Type badge */}
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${typeBadge.bg} ${typeBadge.text}`}>
            {typeConfig.label}
          </span>

          <h2 className="font-semibold text-text-primary text-sm leading-snug mb-1 line-clamp-2">
            {listing.name}
          </h2>

          <p className="text-xs text-text-secondary mb-2">
            {listing.address.town}, {listing.address.county}
          </p>

          {listing.description && (
            <p className="text-xs text-text-secondary line-clamp-2 mb-2">
              {listing.description}
            </p>
          )}

          {listing.aggregate_rating && listing.aggregate_rating.review_count >= 1 && (
            <div className="flex items-center gap-1.5">
              <StarRatingDisplay rating={listing.aggregate_rating.avg_rating} size="sm" />
              <span className="text-xs text-text-secondary">
                ({listing.aggregate_rating.review_count})
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}
