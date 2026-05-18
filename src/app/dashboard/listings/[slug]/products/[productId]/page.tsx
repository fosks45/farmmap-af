import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/owner/ProductForm'
import type { Product } from '@/lib/types'

export const metadata: Metadata = { title: 'Edit product — Farmmap' }

interface Props { params: Promise<{ slug: string; productId: string }> }

export default async function EditProductPage({ params }: Props) {
  const { slug, productId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: manager } = await supabase
    .from('listing_managers')
    .select('role, listings:listing_id(id, currency)')
    .eq('user_id', user!.id)
    .not('accepted_at', 'is', null)
    .eq('listings.slug', slug)
    .single()

  if (!manager) notFound()

  const listing = manager.listings as unknown as { id: string; currency: 'GBP' | 'EUR' }

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('listing_id', listing.id)
    .single()

  if (!product) notFound()

  return (
    <div>
      <Link href={`/dashboard/listings/${slug}/products`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
        ← Back to products
      </Link>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Edit product</h1>
      <ProductForm
        listingSlug={slug}
        productId={productId}
        initial={product as Product}
        currency={listing.currency}
      />
    </div>
  )
}
