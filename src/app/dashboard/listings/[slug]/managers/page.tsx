import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ManagerList } from '@/components/owner/ManagerList'

export const metadata: Metadata = { title: 'Managers — Farmmap' }

interface Props { params: Promise<{ slug: string }> }

export default async function ManagersPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: selfManager } = await supabase
    .from('listing_managers')
    .select('role, listings:listing_id(id, name)')
    .eq('user_id', user!.id)
    .not('accepted_at', 'is', null)
    .eq('listings.slug', slug)
    .single()

  if (!selfManager || selfManager.role !== 'owner') notFound()

  const listing = selfManager.listings as unknown as { id: string; name: string }

  const { data: managers } = await supabase
    .from('listing_managers')
    .select('*, user:user_id(id, email, display_name)')
    .eq('listing_id', listing.id)
    .not('accepted_at', 'is', null)

  return (
    <div>
      <Link href={`/dashboard/listings/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Managers</h1>
      <ManagerList
        listingSlug={slug}
        managers={(managers ?? []) as Parameters<typeof ManagerList>[0]['managers']}
        currentUserId={user!.id}
      />
    </div>
  )
}
