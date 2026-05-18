import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TierBadge } from '@/components/ui/TierBadge'
import type { SubscriptionTier } from '@/lib/tokens'

export const metadata: Metadata = {
  title: 'Dashboard — Farmmap',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get listings managed by this user
  const { data: managedListings } = await supabase
    .from('listing_managers')
    .select(`
      role,
      listings:listing_id(
        id, slug, name, tier, listing_type, address,
        is_temporarily_closed, is_active, is_claimed
      )
    `)
    .eq('user_id', user!.id)
    .not('accepted_at', 'is', null)

  const listings = (managedListings ?? []).map((m) => ({
    ...(m.listings as unknown as {
      id: string
      slug: string
      name: string
      tier: SubscriptionTier
      listing_type: string
      address: { town: string; county: string }
      is_temporarily_closed: boolean
      is_active: boolean
      is_claimed: boolean
    }),
    managerRole: m.role as 'owner' | 'manager',
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">My listings</h1>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-border-default bg-surface-raised p-10 text-center">
          <h2 className="text-lg font-semibold text-text-primary mb-2">No listings yet</h2>
          <p className="text-text-secondary mb-6 max-w-sm mx-auto">
            Search the map for your farm shop or honesty box, then claim it to start managing your listing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/map"
              className="
                px-5 py-2.5 rounded-lg font-medium text-sm
                bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
                transition-colors
              "
            >
              Find your listing on the map
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <li key={listing.id}>
              <Link
                href={`/dashboard/listings/${listing.slug}`}
                className="
                  block rounded-xl border border-border-default bg-surface-elevated p-5
                  hover:border-border-strong hover:shadow-md transition-all
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
                "
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-semibold text-text-primary text-sm leading-snug line-clamp-2">
                    {listing.name}
                  </h2>
                  <TierBadge tier={listing.tier} size="sm" />
                </div>
                <p className="text-xs text-text-secondary mb-3">
                  {listing.address.town}, {listing.address.county}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {listing.managerRole === 'owner' && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-brand-primary-light text-brand-primary font-medium">
                      Owner
                    </span>
                  )}
                  {!listing.is_active && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-surface-raised text-text-tertiary border border-border-default">
                      Inactive
                    </span>
                  )}
                  {listing.is_temporarily_closed && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-status-warning-light text-status-warning-text font-medium">
                      Temporarily closed
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
