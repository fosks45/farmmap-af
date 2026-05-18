import Link from 'next/link'
import type { ListingDetail as ListingDetailType } from '@/lib/types'
import { listingTypeConfig, TIER_CONFIG } from '@/lib/tokens'
import { TierBadge } from '@/components/ui/TierBadge'
import { StarRatingDisplay } from '@/components/ui/StarRating'
import { AllergenBadges } from '@/components/ui/AllergenBadges'
import { PhotoGallery } from './PhotoGallery'
import { ReviewList } from './ReviewList'
import { ReviewForm } from './ReviewForm'
import { WaitlistWidget } from './WaitlistWidget'

/**
 * ListingDetail — full detail component for the listing page.
 * Used as a server component; ReviewForm and WaitlistWidget are client components.
 */

interface ListingDetailProps {
  listing: ListingDetailType
  isAuthenticated: boolean
  waitlistCount?: number
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatOpeningHours(listing: ListingDetailType) {
  if (!listing.opening_hours) return null
  const { regular, notes, is_seasonal, seasonal_from, seasonal_to } = listing.opening_hours

  return (
    <div>
      {is_seasonal && seasonal_from && seasonal_to && (
        <p className="text-xs text-status-warning-text bg-status-warning-light rounded-md px-3 py-1.5 mb-3 border border-status-warning">
          Seasonal: open {seasonal_from} to {seasonal_to}
        </p>
      )}
      <dl className="grid grid-cols-1 gap-1">
        {regular.map((slot, i) => (
          <div key={i} className="flex gap-2 text-sm">
            <dt className="text-text-secondary min-w-[80px]">
              {slot.day_of_week.map((d) => DAY_NAMES[d]).join(', ')}
            </dt>
            <dd className="text-text-primary">{slot.opens}–{slot.closes}</dd>
          </div>
        ))}
      </dl>
      {notes && (
        <p className="mt-2 text-xs text-text-secondary italic">{notes}</p>
      )}
    </div>
  )
}

export function ListingDetail({ listing, isAuthenticated, waitlistCount = 0 }: ListingDetailProps) {
  const typeConfig = listingTypeConfig[listing.listing_type]
  const tierInfo = TIER_CONFIG[listing.tier]
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`
  const canOrder = tierInfo.canOrder
  const showProducts = listing.products.filter((p) => p.is_active && p.moderation_status === 'approved')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start gap-2 mb-2">
          <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-brand-primary-light text-brand-primary">
            {typeConfig.label}
          </span>
          <TierBadge tier={listing.tier} />
          {listing.is_temporarily_closed && (
            <span className="inline-block text-xs font-bold px-2 py-1 rounded-full bg-status-error-light text-status-error-text">
              Temporarily closed
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">
          {listing.name}
        </h1>
        <p className="text-text-secondary">
          {listing.address.street && `${listing.address.street}, `}
          {listing.address.town}, {listing.address.county}
          {listing.address.postcode && `, ${listing.address.postcode}`}
        </p>

        {/* Rating summary */}
        {listing.aggregate_rating && listing.aggregate_rating.review_count >= 1 && (
          <div className="flex items-center gap-2 mt-2">
            <StarRatingDisplay
              rating={listing.aggregate_rating.avg_rating}
              showNumber
              size="md"
            />
            <span className="text-sm text-text-secondary">
              ({listing.aggregate_rating.review_count} review{listing.aggregate_rating.review_count !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photos */}
          {listing.photos.length > 0 && (
            <PhotoGallery photos={listing.photos} listingName={listing.name} />
          )}

          {/* Description */}
          {listing.description && (
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-2">About</h2>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </section>
          )}

          {/* Products */}
          {showProducts.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">Products</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Available products">
                {showProducts.map((product) => (
                  <li key={product.id} className="rounded-lg border border-border-default p-3 bg-surface-elevated">
                    <p className="font-medium text-sm text-text-primary">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{product.description}</p>
                    )}
                    {(product.price_min != null) && (
                      <p className="text-sm font-semibold text-brand-primary mt-1">
                        {listing.currency === 'GBP' ? '£' : '€'}
                        {(product.price_min / 100).toFixed(2)}
                        {product.price_max && product.price_max !== product.price_min &&
                          `–${(product.price_max / 100).toFixed(2)}`}
                      </p>
                    )}
                    {product.allergens && (
                      <div className="mt-2">
                        <AllergenBadges
                          contains={product.allergens.contains}
                          mayContain={product.allergens.may_contain}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Waitlist (if not yet accepting orders) */}
          {!canOrder && (
            <WaitlistWidget
              listingSlug={listing.slug}
              listingName={listing.name}
              waitlistCount={waitlistCount}
            />
          )}

          {/* Reviews */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Reviews</h2>
            <ReviewList reviews={listing.reviews} />
            <div className="mt-6 pt-6 border-t border-border-subtle">
              <h3 className="text-base font-semibold text-text-primary mb-3">Leave a review</h3>
              <ReviewForm listingSlug={listing.slug} isAuthenticated={isAuthenticated} />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Directions */}
          <div className="rounded-xl border border-border-default p-4 bg-surface-elevated">
            <h2 className="text-base font-semibold text-text-primary mb-3">Getting here</h2>
            <address className="not-italic text-sm text-text-secondary mb-3">
              {listing.address.street && <span className="block">{listing.address.street}</span>}
              <span className="block">{listing.address.town}</span>
              <span className="block">{listing.address.county}</span>
              {listing.address.postcode && <span className="block">{listing.address.postcode}</span>}
              {listing.address.eircode && <span className="block">{listing.address.eircode}</span>}
            </address>
            {listing.address.location_description && (
              <p className="text-xs text-text-secondary italic mb-3">{listing.address.location_description}</p>
            )}
            <a
              href={directionsUrl}
              rel="noopener noreferrer"
              target="_blank"
              className="
                inline-flex items-center gap-1.5 text-sm font-medium
                text-brand-primary hover:text-brand-primary-hover underline
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus rounded-sm
              "
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M14.78 8.22a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 0 1-1.06-1.06l2.22-2.22H8.75v4.5a.75.75 0 0 1-1.5 0v-4.5H3.53l2.22 2.22a.75.75 0 0 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L3.53 7.5H7.25V3a.75.75 0 0 1 1.5 0v4.5h3.72L10.25 5.28a.75.75 0 0 1 1.06-1.06l3.47 3.47v.53z"/>
              </svg>
              Get directions (Google Maps)
            </a>
          </div>

          {/* Opening hours */}
          {listing.opening_hours && (
            <div className="rounded-xl border border-border-default p-4 bg-surface-elevated">
              <h2 className="text-base font-semibold text-text-primary mb-3">Opening hours</h2>
              {formatOpeningHours(listing)}
            </div>
          )}

          {/* Contact */}
          {(listing.contact_phone || listing.contact_email || listing.contact_website) && (
            <div className="rounded-xl border border-border-default p-4 bg-surface-elevated">
              <h2 className="text-base font-semibold text-text-primary mb-3">Contact</h2>
              <dl className="space-y-2 text-sm">
                {listing.contact_phone && (
                  <div>
                    <dt className="sr-only">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${listing.contact_phone}`}
                        className="text-text-link hover:text-brand-primary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm"
                      >
                        {listing.contact_phone}
                      </a>
                    </dd>
                  </div>
                )}
                {listing.contact_email && (
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${listing.contact_email}`}
                        className="text-text-link hover:text-brand-primary underline break-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm"
                      >
                        {listing.contact_email}
                      </a>
                    </dd>
                  </div>
                )}
                {listing.contact_website && (
                  <div>
                    <dt className="sr-only">Website</dt>
                    <dd>
                      <a
                        href={listing.contact_website}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-text-link hover:text-brand-primary underline break-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm"
                      >
                        Visit website
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Claim CTA — only shown if unclaimed */}
          {!listing.is_claimed && (
            <div className="rounded-xl border border-border-default p-4 bg-surface-raised text-center">
              <p className="text-sm text-text-secondary mb-2">Is this your listing?</p>
              <Link
                href={`/claim/${listing.slug}`}
                className="
                  inline-flex items-center gap-1.5 text-sm font-medium
                  text-brand-primary underline hover:text-brand-primary-hover
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus rounded-sm
                "
              >
                Claim it free →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
