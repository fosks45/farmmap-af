'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

/**
 * Claim initiation page.
 * Form: email address input → POST /api/listings/[slug]/claim.
 * Shows "check your email" state + resend option after submission.
 */
export default function ClaimPage() {
  const { slug } = useParams<{ slug: string }>()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resent, setResent] = useState(false)

  async function sendClaim(targetEmail: string) {
    const res = await fetch(`/api/listings/${slug}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message ?? 'Failed to send claim email.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      await sendClaim(email)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    setResent(false)
    try {
      await sendClaim(email)
      setResent(true)
    } catch {
      // silently ignore resend errors
    }
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-status-success-light flex items-center justify-center mx-auto mb-6">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8 text-status-success-text">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-3">Check your email</h1>
        <p className="text-text-secondary mb-6">
          We&apos;ve sent a claim link to <strong>{email}</strong>. Follow the link to complete your claim.
          The link expires in 30 minutes.
        </p>
        <p className="text-sm text-text-tertiary">
          Didn&apos;t receive it?{' '}
          <button
            type="button"
            onClick={handleResend}
            className="underline text-text-link hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm"
          >
            Resend email
          </button>
        </p>
        {resent && (
          <p role="status" aria-live="polite" className="mt-2 text-sm text-status-success-text">
            Email resent!
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Claim your listing</h1>
      <p className="text-text-secondary mb-8">
        Enter the email address associated with this listing. We&apos;ll send you a secure link to
        verify ownership and take control of your listing — free of charge.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="claim-email" className="block text-sm font-medium text-text-primary mb-1">
            Email address <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <input
            id="claim-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={error ? 'claim-email-error' : undefined}
            aria-invalid={!!error}
            placeholder="you@example.com"
            className={`
              w-full rounded-lg border px-3 py-2.5 text-sm text-text-primary
              placeholder:text-text-tertiary bg-surface-elevated
              focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus
              ${error ? 'border-status-error' : 'border-border-default'}
            `}
          />
          {error && (
            <p id="claim-email-error" role="alert" className="mt-1 text-xs text-status-error-text">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full py-2.5 px-4 rounded-lg font-medium text-sm
            bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
            transition-colors
          "
        >
          {isSubmitting ? 'Sending…' : 'Send claim link'}
        </button>
      </form>

      <p className="mt-6 text-xs text-text-tertiary">
        By claiming a listing you confirm you are authorised to manage it on behalf of the business.
        View our{' '}
        <a href="/terms" className="underline hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
          Terms of Service
        </a>.
      </p>
    </div>
  )
}
