import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TIER_CONFIG } from '@/lib/tokens'
import { AnalyticsDashboard } from '@/components/owner/AnalyticsDashboard'
import { getListingAnalyticsSummary } from '@/lib/analytics'
import type { SubscriptionTier } from '@/lib/tokens'

export const metadata: Metadata = { title: 'Analytics — Farmmap' }

interface Props { params: Promise<{ slug: string }> }

export default async function AnalyticsPage({ params }: Props) {
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

  if (!tierInfo.hasAnalytics) {
    return (
      <div>
        <Link href={`/dashboard/listings/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-text-primary mb-4">Analytics</h1>
        <div className="rounded-xl border border-border-default bg-surface-raised p-8 text-center">
          <p className="text-text-secondary mb-4">Analytics are available on Bronze tier and above.</p>
          <Link href={`/dashboard/listings/${slug}/subscription`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-medium text-sm bg-brand-primary text-text-inverse hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus">
            Upgrade your listing
          </Link>
        </div>
      </div>
    )
  }

  const summary = await getListingAnalyticsSummary(listing.id, '30d')

  // Build daily trend from analytics_events (simplified: count per day for last 30 days)
  const { data: events } = await supabase
    .from('analytics_events')
    .select('created_at')
    .eq('listing_id', listing.id)
    .eq('event_type', 'listing_page_view')
    .gte('created_at', summary.period_start)

  const trend: { date: string; views: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const dateStr = d.toISOString().substring(0, 10)
    const views = (events ?? []).filter((e) =>
      e.created_at.startsWith(dateStr)
    ).length
    trend.push({ date: dateStr, views })
  }

  // Review avg
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('listing_id', listing.id)
    .eq('moderation_status', 'approved')

  const reviewCount = reviews?.length ?? 0
  const reviewAvg = reviewCount > 0
    ? (reviews!.reduce((s, r) => s + r.rating, 0) / reviewCount)
    : null

  // Waitlist count
  const { count: waitlistCount } = await supabase
    .from('waitlist_entries')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', listing.id)
    .eq('confirmed', true)
    .eq('unsubscribed', false)

  return (
    <div>
      <Link href={`/dashboard/listings/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Analytics</h1>
      <AnalyticsDashboard
        pageViews={summary.listing_page_views}
        mapImpressions={summary.map_pin_clicks}
        enquiries={summary.enquiry_submissions}
        waitlistCount={waitlistCount ?? 0}
        reviewAvg={reviewAvg}
        reviewCount={reviewCount}
        trend={trend}
      />
    </div>
  )
}
