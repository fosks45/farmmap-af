import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ModerationQueue } from '@/components/admin/ModerationQueue'

export const metadata: Metadata = { title: 'Listing moderation — Admin — Farmmap' }

export default async function AdminListingsPage() {
  const supabase = await createClient()
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'pending')
    .order('created_at')
    .limit(50)

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Listing moderation
        {listings && listings.length > 0 && (
          <span className="ml-2 text-sm font-normal text-text-tertiary">({listings.length} pending)</span>
        )}
      </h1>
      <ModerationQueue listings={(listings ?? []) as Parameters<typeof ModerationQueue>[0]['listings']} />
    </div>
  )
}
