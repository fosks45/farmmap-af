import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Admin — Farmmap' }

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: pendingListings },
    { count: pendingPhotos },
    { count: pendingReviews },
  ] = await Promise.all([
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('listing_photos').select('id', { count: 'exact', head: true }).eq('moderation_status', 'pending'),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('moderation_status', 'pending'),
  ])

  const queues = [
    { label: 'Pending listings', count: pendingListings ?? 0, href: '/admin/listings', urgent: (pendingListings ?? 0) > 0 },
    { label: 'Pending photos', count: pendingPhotos ?? 0, href: '/admin/photos', urgent: (pendingPhotos ?? 0) > 0 },
    { label: 'Pending reviews', count: pendingReviews ?? 0, href: '/admin/reviews', urgent: (pendingReviews ?? 0) > 0 },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {queues.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className={`
              rounded-xl border p-5
              hover:shadow-md transition-all
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
              ${q.urgent && q.count > 0 ? 'border-status-warning bg-status-warning-light' : 'border-border-default bg-surface-elevated'}
            `}
          >
            <p className="text-3xl font-bold text-text-primary">{q.count}</p>
            <p className="text-sm text-text-secondary mt-1">{q.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
