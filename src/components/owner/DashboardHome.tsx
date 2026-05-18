'use client'

import Link from 'next/link'
import { TierBadge } from '@/components/ui/TierBadge'

interface OwnedListing {
  slug: string
  name: string
  county: string
  listing_type: 'farm_shop' | 'honesty_box' | 'farm_gate_stall' | 'roadside_stand'
  tier: 'free' | 'bronze' | 'silver' | 'gold'
  pageViews30d: number
  enquiries30d: number
  reviewCount: number
  avgRating: number | null
  photosApproved: number
}

interface DashboardHomeProps {
  listings: OwnedListing[]
}

export function DashboardHome({ listings }: DashboardHomeProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-5xl mb-4" aria-hidden="true">🏡</div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          No listings yet
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
          Search for your farm shop or honesty box on the map and claim your free listing.
          It only takes 5 minutes.
        </p>
        <Link
          href="/map"
          className="inline-block bg-[var(--color-brand-primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-brand-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)] min-h-[44px]"
        >
          Find my listing on the map
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Your listings
        </h2>
        <span className="text-sm text-[var(--color-text-secondary)]">
          {listings.length} listing{listings.length !== 1 ? 's' : ''}
        </span>
      </div>

      <ul className="space-y-4" aria-label="Your listings">
        {listings.map((listing) => (
          <li
            key={listing.slug}
            className="bg-[var(--color-surface-raised)] rounded-xl border border-[var(--color-border-subtle)] p-5"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
                    {listing.name}
                  </h3>
                  <TierBadge tier={listing.tier} size="sm" />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                  {listing.county} ·{' '}
                  {listing.listing_type === 'farm_shop'
                    ? 'Farm shop'
                    : listing.listing_type === 'honesty_box'
                    ? 'Honesty box'
                    : listing.listing_type === 'farm_gate_stall'
                    ? 'Farm gate stall'
                    : 'Roadside stand'}
                </p>
              </div>

              <Link
                href={`/dashboard/listings/${listing.slug}`}
                className="shrink-0 text-sm font-medium text-[var(--color-brand-primary)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)] px-3 py-1.5 rounded-md min-h-[36px] flex items-center"
              >
                Manage
              </Link>
            </div>

            {/* Quick stats */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                label="Page views"
                value={listing.pageViews30d}
                suffix="(30d)"
              />
              <StatCard
                label="Enquiries"
                value={listing.enquiries30d}
                suffix="(30d)"
              />
              <StatCard
                label="Reviews"
                value={listing.reviewCount}
                extra={
                  listing.avgRating != null
                    ? `avg ${listing.avgRating.toFixed(1)}★`
                    : undefined
                }
              />
              <StatCard
                label="Photos live"
                value={listing.photosApproved}
              />
            </div>

            {/* Quick actions */}
            <div className="mt-4 flex gap-2 flex-wrap">
              <QuickAction href={`/dashboard/listings/${listing.slug}/edit`} label="Edit details" />
              <QuickAction href={`/dashboard/listings/${listing.slug}/photos`} label="Photos" />
              {(listing.tier === 'bronze' || listing.tier === 'silver' || listing.tier === 'gold') && (
                <QuickAction href={`/dashboard/listings/${listing.slug}/products`} label="Products" />
              )}
              {(listing.tier === 'silver' || listing.tier === 'gold') && (
                <QuickAction href={`/dashboard/listings/${listing.slug}/orders`} label="Orders" />
              )}
              <QuickAction href={`/dashboard/listings/${listing.slug}/analytics`} label="Analytics" />
              {listing.tier === 'free' && (
                <QuickAction
                  href={`/dashboard/listings/${listing.slug}/subscription`}
                  label="Upgrade to Bronze"
                  highlight
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatCard({
  label,
  value,
  suffix,
  extra,
}: {
  label: string
  value: number
  suffix?: string
  extra?: string
}) {
  return (
    <div className="bg-[var(--color-surface-default)] rounded-lg p-3">
      <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
      <p className="text-lg font-semibold text-[var(--color-text-primary)] mt-0.5">
        {value.toLocaleString('en-GB')}
        {suffix && (
          <span className="text-xs font-normal text-[var(--color-text-secondary)] ml-1">
            {suffix}
          </span>
        )}
      </p>
      {extra && (
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{extra}</p>
      )}
    </div>
  )
}

function QuickAction({
  href,
  label,
  highlight = false,
}: {
  href: string
  label: string
  highlight?: boolean
}) {
  return (
    <Link
      href={href}
      className={[
        'text-sm px-3 py-1.5 rounded-md font-medium min-h-[36px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        highlight
          ? 'bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-hover)] focus-visible:outline-[var(--color-brand-primary)]'
          : 'bg-[var(--color-surface-default)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] focus-visible:outline-[var(--color-brand-primary)]',
      ].join(' ')}
    >
      {label}
    </Link>
  )
}
