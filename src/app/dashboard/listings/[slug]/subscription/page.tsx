import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TierCard } from '@/components/subscription/TierCard'
import { GoldEligibilityGate } from '@/components/subscription/GoldEligibilityGate'
import type { SubscriptionTier } from '@/lib/tokens'
import type { Subscription } from '@/lib/types'

export const metadata: Metadata = { title: 'Subscription — Farmmap' }

interface Props { params: Promise<{ slug: string }> }

export default async function SubscriptionPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: manager } = await supabase
    .from('listing_managers')
    .select('role, listings:listing_id(id, name, tier)')
    .eq('user_id', user!.id)
    .eq('role', 'owner')
    .not('accepted_at', 'is', null)
    .eq('listings.slug', slug)
    .single()

  if (!manager) notFound()

  const listing = manager.listings as unknown as { id: string; name: string; tier: SubscriptionTier }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('listing_id', listing.id)
    .eq('status', 'active')
    .single()

  const sub = subscription as Subscription | null

  const upgradeTiers: SubscriptionTier[] = ['bronze', 'silver', 'gold']
  const availableUpgrades = upgradeTiers.filter((t) => t !== listing.tier)

  return (
    <div>
      <Link href={`/dashboard/listings/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Subscription</h1>
      <p className="text-text-secondary mb-6">{listing.name}</p>

      {/* Current tier */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text-primary mb-3">Current plan</h2>
        <div className="max-w-xs">
          <TierCard tier={listing.tier} isCurrentTier />
        </div>
      </div>

      {/* Gold eligibility gate */}
      {(listing.tier === 'silver' || listing.tier === 'gold') && sub && (
        <div className="mb-8 max-w-md">
          <GoldEligibilityGate
            silverMonthsCount={sub.silver_months_count}
            completedOrderCount={sub.completed_order_count}
          />
        </div>
      )}

      {/* Available upgrades */}
      {availableUpgrades.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-3">Upgrade your plan</h2>
          <p className="text-sm text-text-secondary mb-4">
            Changes take effect immediately. You can cancel anytime — within 14 days of subscribing
            you are entitled to a full refund under the UK Consumer Contracts Regulations 2013.
            Subscriptions auto-renew monthly; cancel before the renewal date to avoid the next charge.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
            {availableUpgrades.map((tier) => (
              <TierCard
                key={tier}
                tier={tier}
                isCurrentTier={false}
                onUpgrade={undefined} // handled client-side via UpgradeFlow
              />
            ))}
          </div>
        </div>
      )}

      {/* Stripe billing portal link */}
      {sub?.stripe_customer_id && (
        <div className="mt-8 pt-6 border-t border-border-subtle">
          <h2 className="text-sm font-semibold text-text-primary mb-2">Billing</h2>
          <p className="text-sm text-text-secondary mb-3">
            Manage payment methods, view invoices, and cancel your subscription in the billing portal.
          </p>
          <a
            href={`/api/listings/${slug}/subscriptions/portal`}
            className="
              inline-flex items-center gap-1.5 text-sm font-medium
              text-text-link underline hover:text-brand-primary
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus rounded-sm
            "
          >
            Open billing portal →
          </a>
        </div>
      )}
    </div>
  )
}
