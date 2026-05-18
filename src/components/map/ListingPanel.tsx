'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, MapPin, ExternalLink, Star } from 'lucide-react'
import { cn, listingPath, formatRating } from '@/lib/utils'
import { listingTypeConfig, pinConfig, type PinTier, type ListingType } from '@/lib/tokens'
import { TierBadge } from '@/components/ui/TierBadge'

interface ListingPanelProps {
  listing: {
    id: string
    name: string
    listing_type: ListingType
    tier: PinTier
    slug: string
    country: string
    county: string
    lat: number
    lng: number
    avg_rating: number | null
    review_count: number
    is_temporarily_closed: boolean
    is_currently_stocked: boolean | null
  }
  isOpen: boolean
  onClose: () => void
}

/**
 * ListingPanel — shows a listing mini-card when a map pin is clicked.
 * - Mobile: bottom sheet (slide up from bottom)
 * - Desktop (md+): sidebar panel on the right
 *
 * Focus management: when opened, focus moves to the panel heading.
 * When closed, focus returns to the map canvas.
 * WCAG 2.1.2 — no keyboard trap: Escape key closes the panel.
 */
export function ListingPanel({ listing, isOpen, onClose }: ListingPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  const typeCfg = listingTypeConfig[listing.listing_type]
  const detailPath = listingPath(listing.listing_type, listing.country, listing.county, listing.slug)

  // Focus management on open/close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      // Small delay to allow transition to start before moving focus
      const timer = setTimeout(() => {
        headingRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else {
      // Return focus to previous element on close (WCAG 2.4.3 / K7)
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])

  // Escape key closes panel (WCAG 2.1.2)
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {/* Mobile: bottom sheet overlay */}
      <div
        className={cn(
          'md:hidden fixed inset-x-0 bottom-0 z-[300]',
          'bg-surface-default rounded-t-2xl shadow-xl',
          'transition-transform duration-normal',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        )}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Listing details for ${listing.name}`}
        data-open={isOpen}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
          <div className="w-10 h-1 rounded-full bg-border-default" />
        </div>

        <PanelContent
          listing={listing}
          typeCfg={typeCfg}
          detailPath={detailPath}
          headingRef={headingRef}
          onClose={onClose}
        />
      </div>

      {/* Desktop: sidebar panel */}
      <div
        className={cn(
          'hidden md:block absolute right-4 top-4 bottom-4 z-[300]',
          'w-80 bg-surface-default rounded-xl shadow-xl',
          'transition-all duration-normal overflow-y-auto',
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none',
        )}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Listing details for ${listing.name}`}
      >
        <PanelContent
          listing={listing}
          typeCfg={typeCfg}
          detailPath={detailPath}
          headingRef={headingRef}
          onClose={onClose}
        />
      </div>

      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-[290] bg-surface-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  )
}

function PanelContent({
  listing,
  typeCfg,
  detailPath,
  headingRef,
  onClose,
}: {
  listing: ListingPanelProps['listing']
  typeCfg: typeof listingTypeConfig[ListingType]
  detailPath: string
  headingRef: React.RefObject<HTMLHeadingElement>
  onClose: () => void
}) {
  const pinCfg = pinConfig[listing.tier]

  return (
    <div className="p-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {/* Listing type label */}
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
            {typeCfg.label}
          </p>

          {/* Listing name — receives focus on panel open */}
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-bold text-text-primary leading-tight focus:outline-none"
          >
            {listing.name}
          </h2>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close listing panel"
          className={cn(
            'flex-shrink-0 p-2 rounded-md text-text-secondary',
            'hover:bg-surface-raised hover:text-text-primary',
            'focus-visible:outline-2 focus-visible:outline-border-focus',
            'min-h-[44px] min-w-[44px] flex items-center justify-center',
            'transition-colors duration-fast',
          )}
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Tier badge */}
      <div className="mb-3">
        <TierBadge tier={listing.tier} />
      </div>

      {/* Status badges */}
      {listing.is_temporarily_closed && (
        <div
          role="status"
          className="flex items-center gap-2 text-sm text-status-warning-text
                     bg-status-warning-light rounded-md px-3 py-2 mb-3"
        >
          <span aria-hidden="true">⚠</span>
          <span>Temporarily closed</span>
        </div>
      )}

      {listing.listing_type === 'honesty_box' && listing.is_currently_stocked !== null && (
        <div
          role="status"
          className={cn(
            'flex items-center gap-2 text-sm rounded-md px-3 py-2 mb-3',
            listing.is_currently_stocked
              ? 'text-status-success-text bg-status-success-light'
              : 'text-text-secondary bg-surface-raised',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'w-2 h-2 rounded-full inline-block',
              listing.is_currently_stocked ? 'bg-status-success' : 'bg-border-strong',
            )}
          />
          <span>{listing.is_currently_stocked ? 'Currently stocked' : 'Currently empty'}</span>
        </div>
      )}

      {/* Rating */}
      {listing.avg_rating !== null && listing.review_count >= 3 && (
        <div className="flex items-center gap-1.5 mb-3" aria-label={formatRating(listing.avg_rating)}>
          <Star
            size={16}
            className="text-pin-gold fill-current"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-text-primary">
            {listing.avg_rating.toFixed(1)}
          </span>
          <span className="text-sm text-text-secondary">
            ({listing.review_count} review{listing.review_count === 1 ? '' : 's'})
          </span>
        </div>
      )}

      {/* Tier description */}
      <p className="text-sm text-text-secondary mb-4">
        {pinCfg.label}
      </p>

      {/* CTA buttons */}
      <div className="flex flex-col gap-2">
        <Link
          href={detailPath}
          className={cn(
            'flex items-center justify-center gap-2',
            'bg-brand-primary text-text-inverse font-semibold text-sm',
            'rounded-lg px-4 py-3 min-h-[44px]',
            'hover:bg-brand-primary-hover transition-colors duration-fast',
            'focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2',
            'no-underline',
          )}
        >
          <MapPin size={16} aria-hidden="true" />
          View full details
        </Link>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center justify-center gap-2',
            'border border-border-default text-text-primary font-medium text-sm',
            'rounded-lg px-4 py-3 min-h-[44px]',
            'hover:bg-surface-raised transition-colors duration-fast',
            'focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2',
            'no-underline',
          )}
        >
          <ExternalLink size={16} aria-hidden="true" />
          <span>Get directions</span>
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </div>
  )
}
