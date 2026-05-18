import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PhotoReviewCard } from '@/components/admin/PhotoReviewCard'

export const metadata: Metadata = { title: 'Photo moderation — Admin — Farmmap' }

export default async function AdminPhotosPage() {
  const supabase = await createClient()
  const { data: photos } = await supabase
    .from('listing_photos')
    .select('*, listings:listing_id(name, slug)')
    .eq('moderation_status', 'pending')
    .order('created_at')
    .limit(100)

  const enriched = (photos ?? []).map((p) => ({
    ...p,
    listing_name: (p.listings as unknown as { name: string; slug: string })?.name ?? 'Unknown',
    listing_slug: (p.listings as unknown as { name: string; slug: string })?.slug ?? '',
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Photo moderation
        {enriched.length > 0 && (
          <span className="ml-2 text-sm font-normal text-text-tertiary">({enriched.length} pending)</span>
        )}
      </h1>
      <PhotoReviewCard photos={enriched as Parameters<typeof PhotoReviewCard>[0]['photos']} />
    </div>
  )
}
