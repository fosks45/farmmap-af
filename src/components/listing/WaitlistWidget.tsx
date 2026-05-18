'use client'

import { useState } from 'react'

/**
 * WaitlistWidget — "Get notified when [Name] starts taking online orders."
 * Shows count if > 5 entries.
 */

interface WaitlistWidgetProps {
  listingSlug: string
  listingName: string
  waitlistCount?: number
}

export function WaitlistWidget({ listingSlug, listingName, waitlistCount = 0 }: WaitlistWidgetProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-status-success bg-status-success-light p-4"
      >
        <p className="text-sm font-medium text-status-success-text">
          ✓ You&apos;re on the waitlist! We&apos;ll email you when {listingName} starts taking online orders.
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/listings/${listingSlug}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message ?? 'Could not join waitlist. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border border-border-default bg-surface-raised p-4">
      <p className="text-sm font-semibold text-text-primary mb-1">
        Get notified when {listingName} starts taking online orders
      </p>
      {waitlistCount > 5 && (
        <p className="text-xs text-text-secondary mb-3">
          Join {waitlistCount.toLocaleString()} others on the waitlist
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="waitlist-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={error ? 'waitlist-error' : undefined}
            aria-invalid={!!error}
            className={`
              w-full rounded-lg border px-3 py-2 text-sm text-text-primary
              placeholder:text-text-tertiary bg-surface-elevated
              focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus
              ${error ? 'border-status-error' : 'border-border-default'}
            `}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium
            bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
            transition-colors
          "
        >
          {isSubmitting ? '…' : 'Notify me'}
        </button>
      </form>

      {error && (
        <p id="waitlist-error" role="alert" className="mt-1.5 text-xs text-status-error-text">
          {error}
        </p>
      )}
    </div>
  )
}
