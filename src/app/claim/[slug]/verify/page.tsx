'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

/**
 * Claim verify page.
 * Reads ?token= from URL. On load: GET /api/listings/[slug]/claim?token=.
 * Shows success state with link to dashboard, or error if token is invalid/expired.
 */
export default function ClaimVerifyPage() {
  const { slug } = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No claim token found in the URL. Please check your email for the correct link.')
      return
    }

    fetch(`/api/listings/${slug}/claim?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.ok) {
          setStatus('success')
        } else {
          const data = await res.json()
          setStatus('error')
          setMessage(data.message ?? 'This claim link is invalid or has expired. Please request a new one.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Network error. Please try again.')
      })
  }, [slug, token])

  if (status === 'loading') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div
          role="status"
          aria-live="polite"
          className="inline-block w-8 h-8 border-4 border-brand-primary-light border-t-brand-primary rounded-full animate-spin"
          aria-label="Verifying your claim…"
        />
        <p className="mt-4 text-text-secondary">Verifying your claim…</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-status-success-light flex items-center justify-center mx-auto mb-6">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8 text-status-success-text">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-3">Listing claimed!</h1>
        <p className="text-text-secondary mb-8">
          Your listing has been successfully claimed. You can now manage it from your dashboard.
        </p>
        <Link
          href="/dashboard"
          className="
            inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm
            bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
            transition-colors
          "
        >
          Go to your dashboard →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-status-error-light flex items-center justify-center mx-auto mb-6">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8 text-status-error-text">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-text-primary mb-3">Claim link invalid</h1>
      <p className="text-text-secondary mb-8">{message}</p>
      <Link
        href={`/claim/${slug}`}
        className="
          inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm
          border border-border-default bg-surface-raised text-text-primary
          hover:bg-surface-map
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
          transition-colors
        "
      >
        Request a new claim link
      </Link>
    </div>
  )
}
