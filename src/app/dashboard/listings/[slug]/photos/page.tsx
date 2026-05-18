import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PhotoUploader } from '@/components/owner/PhotoUploader'

export const metadata: Metadata = { title: 'Photos — Farmmap' }

interface Props { params: Promise<{ slug: string }> }

export default async function PhotosPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: manager } = await supabase
    .from('listing_managers')
    .select('role, listings:listing_id(id, name)')
    .eq('user_id', user!.id)
    .not('accepted_at', 'is', null)
    .eq('listings.slug', slug)
    .single()

  if (!manager) notFound()

  const listing = manager.listings as unknown as { id: string; name: string }

  const { data: photos } = await supabase
    .from('listing_photos')
    .select('*')
    .eq('listing_id', listing.id)
    .order('upload_order')

  return (
    <div>
      <Link href={`/dashboard/listings/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Photos</h1>
      <p className="text-sm text-text-secondary mb-6">
        Photos are reviewed before appearing on your listing. Approved photos appear immediately.
      </p>
      <PhotoUploader listingSlug={slug} initialPhotos={photos ?? []} />
    </div>
  )
}
