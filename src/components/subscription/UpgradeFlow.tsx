'use client'

import { useState } from 'react'
import type { SubscriptionTier } from '@/lib/tokens'

/**
 * UpgradeFlow — handles Stripe Checkout redirect.
 * Calls /api/listings/[slug]/subscriptions/checkout.
 * Shows loading + error states.
 */

interface UpgradeFlowProps {
  listingSlug: string
  targetTier: SubscriptionTier
  onComplete?: () => void
}

export function UpgradeFlow({ listingSlug, targetTier, onComplete }: UpgradeFlowProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpgrade() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/listings/${listingSlug}/subscriptions/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: targetTier }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? 'Failed to start checkout. Please try again.')
      } else if (data.url) {
        window.location.href = data.url
        onComplete?.()
      } else {
        setError('No checkout URL returned.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <p role="alert" className="mb-3 text-sm text-status-error-text bg-status-error-light rounded-md px-3 py-2">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={isLoading}
        className="
          w-full py-2.5 px-4 rounded-lg font-medium text-sm
          bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
          transition-colors
        "
      >
        {isLoading ? 'Redirecting to checkout…' : `Upgrade to ${targetTier.charAt(0).toUpperCase() + targetTier.slice(1)}`}
      </button>
    </div>
  )
}
