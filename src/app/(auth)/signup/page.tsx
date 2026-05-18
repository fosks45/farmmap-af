'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * Sign up page — name, email, password.
 * On success: redirect to ?next= or /dashboard.
 */
export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') ?? '/dashboard'
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name.trim() },
        },
      })
      if (signUpError) {
        setError(signUpError.message)
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
      <h1 className="text-2xl font-bold text-text-primary mb-2">Create your Farmmap account</h1>
      <p className="text-text-secondary mb-8 text-sm">
        Claim your listing, manage products, and track your customers.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium text-text-primary mb-1">
            Your name <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <input
            id="signup-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border-default px-3 py-2.5 text-sm bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-text-primary mb-1">
            Email address <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <input
            id="signup-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border-default px-3 py-2.5 text-sm bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-text-primary mb-1">
            Password <span aria-hidden="true" className="text-status-error">*</span>
          </label>
          <input
            id="signup-password"
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="signup-password-hint"
            className="w-full rounded-lg border border-border-default px-3 py-2.5 text-sm bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
          />
          <p id="signup-password-hint" className="mt-1 text-xs text-text-tertiary">Minimum 8 characters</p>
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
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-xs text-text-tertiary text-center">
        By creating an account you agree to our{' '}
        <Link href="/terms" className="underline hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Terms of Service</Link>
        {' '}and{' '}
        <Link href="/privacy" className="underline hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Privacy Policy</Link>.
      </p>

      <p className="mt-4 text-sm text-center text-text-secondary">
        Already have an account?{' '}
        <Link
          href={`/login${nextPath !== '/dashboard' ? `?next=${encodeURIComponent(nextPath)}` : ''}`}
          className="font-medium text-text-link underline hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
