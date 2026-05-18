'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * Login page — email + password form.
 * On success: redirect to ?next= or /dashboard.
 */
export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') ?? '/dashboard'
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        setError(signInError.message ?? 'Sign in failed. Please check your email and password.')
      } else {
        router.push(nextPath)
        router.refresh()
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Sign in to Farmmap</h1>
      <p className="text-text-secondary mb-8 text-sm">
        Manage your listings, track analytics, and more.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-text-primary mb-1">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
            className="w-full rounded-lg border border-border-default px-3 py-2.5 text-sm bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="login-password" className="text-sm font-medium text-text-primary">
              Password
            </label>
            <a href="/forgot-password" className="text-xs text-text-link hover:text-brand-primary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
              Forgot password?
            </a>
          </div>
          <input
            id="login-password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border-default px-3 py-2.5 text-sm bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-status-error-text bg-status-error-light rounded-md px-3 py-2">
            {error}
          </p>
        )}

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
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link
          href={`/signup${nextPath !== '/dashboard' ? `?next=${encodeURIComponent(nextPath)}` : ''}`}
          className="font-medium text-text-link underline hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
