import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TIER_CONFIG } from '@/lib/tokens'
import { OrderList } from '@/components/owner/OrderList'
import type { SubscriptionTier } from '@/lib/tokens'

export const metadata: Metadata = { title: 'Orders — Farmmap' }

interface Props { params: Promise<{ slug: string }> }

export default async function OrdersPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: manager } = await supabase
    .from('listing_managers')
    .select('role, listings:listing_id(id, name, tier)')
    .eq('user_id', user!.id)
    .not('accepted_at', 'is', null)
    .eq('listings.slug', slug)
    .single()

  if (!manager) notFound()

  const listing = manager.listings as unknown as { id: string; name: string; tier: SubscriptionTier }
  const tierInfo = TIER_CONFIG[listing.tier]

  if (!tierInfo.canOrder) {
    return (
      <div>
        <Link href={`/dashboard/listings/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-text-primary mb-4">Orders</h1>
        <div className="rounded-xl border border-border-default bg-surface-raised p-8 text-center">
          <p className="text-text-secondary mb-4">Online ordering is available on Silver and Gold tiers.</p>
          <Link href={`/dashboard/listings/${slug}/subscription`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-medium text-sm bg-brand-primary text-text-inverse hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus">
            Upgrade your tier
          </Link>
        </div>
      </div>
    )
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('listing_id', listing.id)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <Link href={`/dashboard/listings/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Orders</h1>
      <OrderList listingSlug={slug} initialOrders={(orders ?? []) as Parameters<typeof OrderList>[0]['initialOrders']} />
    </div>
  )
}
