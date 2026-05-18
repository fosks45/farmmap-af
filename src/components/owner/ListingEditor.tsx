'use client'

import { useState } from 'react'
import type { Listing } from '@/lib/types'

/**
 * ListingEditor — edit all listing fields.
 * Controlled inputs with client-side Zod-style validation.
 */

type EditableFields = Pick<
  Listing,
  'name' | 'description' | 'contact_phone' | 'contact_email' | 'contact_website' | 'is_temporarily_closed'
>

interface ListingEditorProps {
  listing: EditableFields & { slug: string }
}

interface FormErrors {
  name?: string
  contact_email?: string
  contact_website?: string
  submit?: string
}

function validate(values: EditableFields): FormErrors {
  const errs: FormErrors = {}
  if (!values.name.trim()) errs.name = 'Name is required.'
  if (values.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact_email)) {
    errs.contact_email = 'Enter a valid email address.'
  }
  if (values.contact_website && !/^https?:\/\/.+/.test(values.contact_website)) {
    errs.contact_website = 'Website must start with http:// or https://'
  }
  return errs
}

export function ListingEditor({ listing }: ListingEditorProps) {
  const [form, setForm] = useState<EditableFields>({
    name: listing.name,
    description: listing.description ?? '',
    contact_phone: listing.contact_phone ?? '',
    contact_email: listing.contact_email ?? '',
    contact_website: listing.contact_website ?? '',
    is_temporarily_closed: listing.is_temporarily_closed,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function set<K extends keyof EditableFields>(key: K, value: EditableFields[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setIsSaving(true)
    try {
      const res = await fetch(`/api/listings/${listing.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setErrors({ submit: data.message ?? 'Failed to save. Please try again.' })
      } else {
        setSaved(true)
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 max-w-xl">
      <div>
        <label htmlFor="edit-name" className="block text-sm font-medium text-text-primary mb-1">
          Listing name <span aria-hidden="true" className="text-status-error">*</span>
        </label>
        <input
          id="edit-name"
          type="text"
          required
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'edit-name-error' : undefined}
          className={`w-full rounded-lg border px-3 py-2 text-sm bg-surface-elevated text-text-primary
            focus:outline-none focus:ring-2 focus:ring-border-focus
            ${errors.name ? 'border-status-error' : 'border-border-default'}`}
        />
        {errors.name && <p id="edit-name-error" role="alert" className="mt-1 text-xs text-status-error-text">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="edit-description" className="block text-sm font-medium text-text-primary mb-1">Description</label>
        <textarea
          id="edit-description"
          rows={4}
          value={form.description ?? ''}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Tell visitors about your farm shop…"
          className="w-full rounded-lg border border-border-default px-3 py-2 text-sm bg-surface-elevated text-text-primary
            focus:outline-none focus:ring-2 focus:ring-border-focus resize-vertical"
        />
      </div>

      <div>
        <label htmlFor="edit-phone" className="block text-sm font-medium text-text-primary mb-1">Phone number</label>
        <input
          id="edit-phone"
          type="tel"
          autoComplete="tel"
          value={form.contact_phone ?? ''}
          onChange={(e) => set('contact_phone', e.target.value)}
          className="w-full rounded-lg border border-border-default px-3 py-2 text-sm bg-surface-elevated text-text-primary
            focus:outline-none focus:ring-2 focus:ring-border-focus"
        />
      </div>

      <div>
        <label htmlFor="edit-email" className="block text-sm font-medium text-text-primary mb-1">Contact email</label>
        <input
          id="edit-email"
          type="email"
          autoComplete="email"
          value={form.contact_email ?? ''}
          onChange={(e) => set('contact_email', e.target.value)}
          aria-invalid={!!errors.contact_email}
          aria-describedby={errors.contact_email ? 'edit-email-error' : undefined}
          className={`w-full rounded-lg border px-3 py-2 text-sm bg-surface-elevated text-text-primary
            focus:outline-none focus:ring-2 focus:ring-border-focus
            ${errors.contact_email ? 'border-status-error' : 'border-border-default'}`}
        />
        {errors.contact_email && <p id="edit-email-error" role="alert" className="mt-1 text-xs text-status-error-text">{errors.contact_email}</p>}
      </div>

      <div>
        <label htmlFor="edit-website" className="block text-sm font-medium text-text-primary mb-1">Website</label>
        <input
          id="edit-website"
          type="url"
          autoComplete="url"
          value={form.contact_website ?? ''}
          onChange={(e) => set('contact_website', e.target.value)}
          placeholder="https://"
          aria-invalid={!!errors.contact_website}
          aria-describedby={errors.contact_website ? 'edit-website-error' : undefined}
          className={`w-full rounded-lg border px-3 py-2 text-sm bg-surface-elevated text-text-primary
            focus:outline-none focus:ring-2 focus:ring-border-focus
            ${errors.contact_website ? 'border-status-error' : 'border-border-default'}`}
        />
        {errors.contact_website && <p id="edit-website-error" role="alert" className="mt-1 text-xs text-status-error-text">{errors.contact_website}</p>}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="edit-temporarily-closed"
          type="checkbox"
          checked={form.is_temporarily_closed}
          onChange={(e) => set('is_temporarily_closed', e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-border-default text-brand-primary
                     focus:ring-2 focus:ring-border-focus focus:ring-offset-1"
        />
        <label htmlFor="edit-temporarily-closed" className="text-sm text-text-primary">
          Mark as temporarily closed
        </label>
      </div>

      {errors.submit && (
        <p role="alert" className="text-sm text-status-error-text bg-status-error-light rounded-md px-3 py-2">
          {errors.submit}
        </p>
      )}

      {saved && (
        <p role="status" aria-live="polite" className="text-sm text-status-success-text bg-status-success-light rounded-md px-3 py-2">
          Changes saved.
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="
          px-6 py-2.5 rounded-lg font-medium text-sm
          bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
          transition-colors
        "
      >
        {isSaving ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
