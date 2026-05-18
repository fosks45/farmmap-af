import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TIER_CONFIG } from '@/lib/tokens'
import type { Product, SubscriptionTier } from '@/lib/types'

export const metadata: Metadata = { title: 'Products — Farmmap' }

interface Props { params: Promise<{ slug: string }> }

export default async function ProductsPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: manager } = await supabase
    .from('listing_managers')
    .select('role, listings:listing_id(id, name, tier, currency)')
    .eq('user_id', user!.id)
    .not('accepted_at', 'is', null)
    .eq('listings.slug', slug)
    .single()

  if (!manager) notFound()

  const listing = manager.listings as unknown as { id: string; name: string; tier: SubscriptionTier; currency: 'GBP' | 'EUR' }
  const tierInfo = TIER_CONFIG[listing.tier]
  const currencySymbol = listing.currency === 'GBP' ? '£' : '€'

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('listing_id', listing.id)
    .order('name')

  const activeProducts = (products ?? []).filter((p: Product) => p.is_active)
  const archivedProducts = (products ?? []).filter((p: Product) => !p.is_active)

  return (
    <div>
      <Link href={`/dashboard/listings/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
        ← Back to dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Products</h1>
        <Link
          href={`/dashboard/listings/${slug}/products/new`}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-primary text-text-inverse hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus transition-colors"
        >
          + Add product
        </Link>
      </div>

      {tierInfo.canOrder === false && listing.tier !== 'free' && listing.tier !== 'claimed' && (
        <div className="mb-6 bg-status-info-light border border-status-info rounded-lg p-4 text-sm text-status-info-text">
          <strong>Bronze tier:</strong> Products are displayed on your listing but cannot be ordered online.{' '}
          <Link href={`/dashboard/listings/${slug}/subscription`} className="underline hover:text-brand-primary">
            Upgrade to Silver or Gold
          </Link>{' '}
          to enable online ordering.
        </div>
      )}

      {activeProducts.length === 0 && archivedProducts.length === 0 ? (
        <div className="rounded-xl border border-border-default bg-surface-raised p-10 text-center">
          <p className="text-text-secondary mb-4">No products yet. Add your first product to showcase what you sell.</p>
          <Link href={`/dashboard/listings/${slug}/products/new`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-medium text-sm bg-brand-primary text-text-inverse hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus">
            Add your first product
          </Link>
        </div>
      ) : (
        <ul className="space-y-2" aria-label="Products">
          {activeProducts.map((product: Product) => (
            <li key={product.id} className="flex items-center gap-3 rounded-lg border border-border-default bg-surface-elevated p-3 hover:border-border-strong transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-text-primary">{product.name}</p>
                {product.price_min != null && (
                  <p className="text-xs text-text-secondary">
                    {currencySymbol}{(product.price_min / 100).toFixed(2)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {product.is_purchasable ? (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-status-success-light text-status-success-text font-medium">Orderable</span>
                ) : (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-surface-raised border border-border-default text-text-tertiary">Display only</span>
                )}
                <Link href={`/dashboard/listings/${slug}/products/${product.id}`}
                  className="text-xs text-text-link hover:text-brand-primary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
                  Edit
                </Link>
              </div>
            </li>
          ))}
          {archivedProducts.length > 0 && (
            <li className="pt-4">
              <p className="text-xs text-text-tertiary font-medium uppercase tracking-wide mb-2">Archived ({archivedProducts.length})</p>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
