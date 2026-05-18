import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TierBadge } from '@/components/ui/TierBadge'
import { getListingAnalyticsSummary } from '@/lib/analytics'
import type { SubscriptionTier } from '@/lib/tokens'

export const metadata: Metadata = { title: 'Listing dashboard — Farmmap' }

interface Props {
  params: Promise<{ slug: string }>
}

const QUICK_ACTIONS = [
  { label: 'Edit details', href: 'edit', description: 'Name, description, opening hours, contact' },
  { label: 'Photos', href: 'photos', description: 'Upload and manage photos' },
  { label: 'Products', href: 'products', description: 'Your product catalogue' },
  { label: 'Orders', href: 'orders', description: 'Manage incoming orders' },
  { label: 'Analytics', href: 'analytics', description: 'Page views, map clicks, reviews' },
  { label: 'Subscription', href: 'subscription', description: 'Tier, billing, upgrade' },
  { label: 'Managers', href: 'managers', description: 'Team access and permissions' },
]

export default async function ListingDashboardPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: manager } = await supabase
    .from('listing_managers')
    .select('role, listings:listing_id(*)')
    .eq('user_id', user!.id)
    .not('accepted_at', 'is', null)
    .eq('listings.slug', slug)
    .single()

  if (!manager) notFound()

  const listing = manager.listings as unknown as {
    id: string
    slug: string
    name: string
    tier: SubscriptionTier
    listing_type: string
    address: { town: string; county: string; county_slug?: string; country_slug?: string }
    is_temporarily_closed: boolean
    is_active: boolean
  }

  const analytics = await getListingAnalyticsSummary(listing.id, '30d')

  const metrics = [
    { label: 'Page views (30d)', value: analytics.listing_page_views.toLocaleString() },
    { label: 'Map clicks (30d)', value: analytics.map_pin_clicks.toLocaleString() },
    { label: 'Enquiries (30d)', value: analytics.enquiry_submissions.toLocaleString() },
    { label: 'Waitlist sign-ups (30d)', value: analytics.waitlist_signups.toLocaleString() },
  ]

  return (
    <div>
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm"
      >
        ← All listings
      </Link>

      <div className="flex flex-wrap items-start gap-3 mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-text-primary">{listing.name}</h1>
          <p className="text-text-secondary text-sm">{listing.address.town}, {listing.address.county}</p>
        </div>
        <TierBadge tier={listing.tier} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border-default bg-surface-elevated p-4">
            <p className="text-2xl font-bold text-text-primary">{m.value}</p>
            <p className="text-xs text-text-secondary mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-base font-semibold text-text-primary mb-4">Quick actions</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <li key={action.href}>
            <Link
              href={`/dashboard/listings/${slug}/${action.href}`}
              className="
                block rounded-xl border border-border-default bg-surface-elevated p-4
                hover:border-border-strong hover:shadow-sm transition-all
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
              "
            >
              <p className="font-medium text-sm text-text-primary">{action.label}</p>
              <p className="text-xs text-text-secondary mt-0.5">{action.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
