'use client'

import { useState } from 'react'
import { StarRatingInput } from '@/components/ui/StarRating'

/**
 * ReviewForm — submit a review.
 * Star rating uses <fieldset> + <legend> + radio inputs (WCAG 1.3.1, 4.1.2).
 * Login prompt shown if not authenticated.
 * Text: 20–1,000 characters.
 */

interface ReviewFormProps {
  listingSlug: string
  isAuthenticated: boolean
}

interface FormState {
  rating: number
  body: string
}

interface FormErrors {
  rating?: string
  body?: string
  submit?: string
}

export function ReviewForm({ listingSlug, isAuthenticated }: ReviewFormProps) {
  const [form, setForm] = useState<FormState>({ rating: 0, body: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-border-default p-5 bg-surface-raised text-center">
        <p className="text-sm text-text-secondary mb-3">
          You need to be signed in to leave a review.
        </p>
        <a
          href={`/login?next=/listings/${listingSlug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary underline
                     hover:text-brand-primary-hover
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus rounded-sm"
        >
          Sign in to review
        </a>
      </div>
    )
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-status-success bg-status-success-light p-5 text-center"
      >
        <p className="text-sm font-medium text-status-success-text">
          Thank you for your review! It will appear once approved.
        </p>
      </div>
    )
  }

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (form.rating === 0) errs.rating = 'Please select a star rating.'
    if (form.body.length < 20) errs.body = `Review must be at least 20 characters (${form.body.length}/20).`
    if (form.body.length > 1000) errs.body = `Review must be no more than 1,000 characters (${form.body.length}/1000).`
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/listings/${listingSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: form.rating, body: form.body }),
      })
      if (!res.ok) {
        const data = await res.json()
        setErrors({ submit: data.message ?? 'Failed to submit review. Please try again.' })
      } else {
        setSubmitted(true)
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <StarRatingInput
          name="rating"
          legend="Your rating"
          value={form.rating}
          onChange={(v) => setForm((s) => ({ ...s, rating: v }))}
          required
          error={errors.rating}
        />
      </div>

      <div>
        <label htmlFor="review-body" className="block text-sm font-medium text-text-primary mb-1">
          Your review <span aria-hidden="true" className="text-status-error">*</span>
        </label>
        <textarea
          id="review-body"
          name="body"
          required
          minLength={20}
          maxLength={1000}
          rows={4}
          value={form.body}
          onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))}
          aria-describedby={errors.body ? 'review-body-error' : 'review-body-hint'}
          aria-invalid={!!errors.body}
          placeholder="Share your experience…"
          className={`
            w-full rounded-lg border px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary
            bg-surface-elevated resize-vertical min-h-[100px]
            focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus
            ${errors.body ? 'border-status-error' : 'border-border-default'}
          `}
        />
        {errors.body ? (
          <p id="review-body-error" role="alert" className="mt-1 text-xs text-status-error-text">
            {errors.body}
          </p>
        ) : (
          <p id="review-body-hint" className="mt-1 text-xs text-text-tertiary">
            {form.body.length}/1000 characters (minimum 20)
          </p>
        )}
      </div>

      {errors.submit && (
        <p role="alert" className="text-sm text-status-error-text bg-status-error-light rounded-md px-3 py-2">
          {errors.submit}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium
          bg-brand-primary text-text-inverse
          hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
          transition-colors
        "
      >
        {isSubmitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  )
}
