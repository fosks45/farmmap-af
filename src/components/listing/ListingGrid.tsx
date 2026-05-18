import Link from 'next/link'
import type { Listing, ListingPhoto, AggregateRating } from '@/lib/types'
import { ListingCard } from './ListingCard'

/**
 * ListingGrid — paginated grid of ListingCard components.
 * Uses semantic <ul> + <li>. Pagination uses <a> tags for SEO crawlability.
 */

type ListingWithExtras = Listing & {
  primaryPhoto?: Pick<ListingPhoto, 'public_url' | 'alt_text'> | null
  aggregate_rating?: AggregateRating | null
}

interface ListingGridProps {
  listings: ListingWithExtras[]
  total: number
  page: number
  perPage?: number
  baseUrl: string
  emptyMessage?: string
}

export function ListingGrid({
  listings,
  total,
  page,
  perPage = 20,
  baseUrl,
  emptyMessage = 'No listings found.',
}: ListingGridProps) {
  const totalPages = Math.ceil(total / perPage)
  const hasPrev = page > 1
  const hasNext = page < totalPages

  if (listings.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-secondary">{emptyMessage}</p>
      </div>
    )
  }

  function pageUrl(p: number) {
    return p === 1 ? baseUrl : `${baseUrl}?page=${p}`
  }

  return (
    <div>
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        aria-label="Listings"
      >
        {listings.map((listing) => (
          <li key={listing.id}>
            <ListingCard listing={listing} />
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-10 flex items-center justify-center gap-2"
        >
          {hasPrev && (
            <Link
              href={pageUrl(page - 1)}
              rel="prev"
              className="
                px-4 py-2 rounded-md border border-border-default text-sm font-medium
                text-text-secondary hover:bg-surface-raised hover:text-text-primary
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
              "
            >
              ← Previous
            </Link>
          )}

          <span className="text-sm text-text-secondary px-2" aria-current="page">
            Page {page} of {totalPages}
          </span>

          {hasNext && (
            <Link
              href={pageUrl(page + 1)}
              rel="next"
              className="
                px-4 py-2 rounded-md border border-border-default text-sm font-medium
                text-text-secondary hover:bg-surface-raised hover:text-text-primary
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
              "
            >
              Next →
            </Link>
          )}
        </nav>
      )}

      {total > 0 && (
        <p className="mt-4 text-center text-xs text-text-tertiary" aria-live="polite">
          Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total} listings
        </p>
      )}
    </div>
  )
}
