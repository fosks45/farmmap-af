'use client'

import { useState } from 'react'
import { ALLERGENS, ALLERGEN_LABELS, type Allergen } from '@/lib/tokens'
import type { Product } from '@/lib/types'

/**
 * ProductForm — create or edit a product.
 * Price stored as integer pence; displayed as pounds.
 * 14 allergen checkboxes per Natasha's Law / EU 1169/2011.
 * is_purchasable toggle disabled until allergen_declaration_complete = true.
 */

type ProductFormData = Partial<Omit<Product, 'id' | 'listing_id' | 'directory_id' | 'created_at' | 'updated_at' | 'moderation_status'>>

interface ProductFormProps {
  listingSlug: string
  productId?: string
  initial?: ProductFormData
  currency?: 'GBP' | 'EUR'
  onSaved?: () => void
}

interface FormErrors {
  name?: string
  price?: string
  submit?: string
}

export function ProductForm({ listingSlug, productId, initial, currency = 'GBP', onSaved }: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [pricePounds, setPricePounds] = useState(
    initial?.price_min != null ? (initial.price_min / 100).toFixed(2) : ''
  )
  const [allergenContains, setAllergenContains] = useState<Allergen[]>(initial?.allergens?.contains ?? [])
  const [mayContain, setMayContain] = useState(initial?.allergens?.may_contain ?? '')
  const [allergenVerified, setAllergenVerified] = useState(initial?.allergens?.verified ?? false)
  const [isPurchasable, setIsPurchasable] = useState(initial?.is_purchasable ?? false)
  const [seasonal, setSeasonal] = useState<Product['seasonal_availability']>(
    initial?.seasonal_availability ?? 'year_round'
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const allergenDeclarationComplete = allergenVerified

  function toggleAllergen(allergen: Allergen) {
    setAllergenContains((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    )
  }

  function validate() {
    const errs: FormErrors = {}
    if (!name.trim()) errs.name = 'Product name is required.'
    if (pricePounds && isNaN(parseFloat(pricePounds))) errs.price = 'Enter a valid price.'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setIsSaving(true)

    const pricePence = pricePounds ? Math.round(parseFloat(pricePounds) * 100) : null

    const body = {
      name,
      description: description || null,
      price_min: pricePence,
      price_max: pricePence,
      currency,
      allergens: {
        contains: allergenContains,
        may_contain: mayContain || null,
        verified: allergenVerified,
        verified_at: allergenVerified ? new Date().toISOString() : null,
      },
      is_purchasable: allergenDeclarationComplete ? isPurchasable : false,
      seasonal_availability: seasonal,
    }

    const url = productId
      ? `/api/listings/${listingSlug}/products/${productId}`
      : `/api/listings/${listingSlug}/products`
    const method = productId ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        setErrors({ submit: data.message ?? 'Failed to save product.' })
      } else {
        setSaved(true)
        onSaved?.()
      }
    } catch {
      setErrors({ submit: 'Network error.' })
    } finally {
      setIsSaving(false)
    }
  }

  const currencySymbol = currency === 'GBP' ? '£' : '€'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 max-w-xl">
      <div>
        <label htmlFor="product-name" className="block text-sm font-medium text-text-primary mb-1">
          Product name <span aria-hidden="true" className="text-status-error">*</span>
        </label>
        <input
          id="product-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'product-name-error' : undefined}
          className={`w-full rounded-lg border px-3 py-2 text-sm bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus ${errors.name ? 'border-status-error' : 'border-border-default'}`}
        />
        {errors.name && <p id="product-name-error" role="alert" className="mt-1 text-xs text-status-error-text">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="product-desc" className="block text-sm font-medium text-text-primary mb-1">Description</label>
        <textarea id="product-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-border-default px-3 py-2 text-sm bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus resize-vertical" />
      </div>

      <div>
        <label htmlFor="product-price" className="block text-sm font-medium text-text-primary mb-1">
          Price ({currencySymbol})
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm pointer-events-none" aria-hidden="true">
            {currencySymbol}
          </span>
          <input
            id="product-price"
            type="number"
            step="0.01"
            min="0"
            value={pricePounds}
            onChange={(e) => setPricePounds(e.target.value)}
            aria-describedby={errors.price ? 'product-price-error' : 'product-price-hint'}
            aria-invalid={!!errors.price}
            placeholder="0.00"
            className={`w-full rounded-lg border px-3 py-2 pl-7 text-sm bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus ${errors.price ? 'border-status-error' : 'border-border-default'}`}
          />
        </div>
        {errors.price ? (
          <p id="product-price-error" role="alert" className="mt-1 text-xs text-status-error-text">{errors.price}</p>
        ) : (
          <p id="product-price-hint" className="mt-1 text-xs text-text-tertiary">Stored as pence. Leave blank if price varies.</p>
        )}
      </div>

      <div>
        <label htmlFor="product-seasonal" className="block text-sm font-medium text-text-primary mb-1">Availability</label>
        <select id="product-seasonal" value={seasonal} onChange={(e) => setSeasonal(e.target.value as Product['seasonal_availability'])}
          className="w-full rounded-lg border border-border-default px-3 py-2 text-sm bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus">
          <option value="year_round">Year round</option>
          <option value="seasonal">Seasonal</option>
          <option value="ask_us">Ask us</option>
        </select>
      </div>

      {/* Allergens — Natasha's Law */}
      <fieldset>
        <legend className="text-sm font-semibold text-text-primary mb-3">
          Allergens
          <span className="ml-2 text-xs font-normal text-text-secondary">(EU 1169/2011 / Natasha&apos;s Law)</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {ALLERGENS.map((allergen) => (
            <label key={allergen} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={allergenContains.includes(allergen)}
                onChange={() => toggleAllergen(allergen)}
                className="w-4 h-4 rounded border-border-default text-brand-primary focus:ring-2 focus:ring-border-focus focus:ring-offset-1"
              />
              {ALLERGEN_LABELS[allergen]}
            </label>
          ))}
        </div>

        <div className="mt-3">
          <label htmlFor="may-contain" className="block text-sm font-medium text-text-primary mb-1">May contain (cross-contamination)</label>
          <input id="may-contain" type="text" value={mayContain} onChange={(e) => setMayContain(e.target.value)}
            placeholder="e.g. produced in a facility that handles nuts"
            className="w-full rounded-lg border border-border-default px-3 py-2 text-sm bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus" />
        </div>

        <label className="flex items-start gap-2 mt-3 cursor-pointer">
          <input
            type="checkbox"
            checked={allergenVerified}
            onChange={(e) => setAllergenVerified(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-border-default text-brand-primary focus:ring-2 focus:ring-border-focus focus:ring-offset-1"
          />
          <span className="text-sm text-text-primary">
            I confirm this allergen information is accurate and complete
            <span className="block text-xs text-text-secondary mt-0.5">Required to enable purchasable products</span>
          </span>
        </label>
      </fieldset>

      <div className="flex items-start gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isPurchasable}
          aria-disabled={!allergenDeclarationComplete}
          onClick={() => allergenDeclarationComplete && setIsPurchasable((v) => !v)}
          disabled={!allergenDeclarationComplete}
          aria-describedby="purchasable-hint"
          className={`
            mt-0.5 w-10 h-6 rounded-full transition-colors flex-shrink-0
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
            ${!allergenDeclarationComplete ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${isPurchasable && allergenDeclarationComplete ? 'bg-brand-primary' : 'bg-border-strong'}
          `}
        >
          <span className={`block w-4 h-4 rounded-full bg-white shadow ml-1 transition-transform ${isPurchasable && allergenDeclarationComplete ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
        <div>
          <p className="text-sm font-medium text-text-primary">Enable online ordering for this product</p>
          <p id="purchasable-hint" className="text-xs text-text-secondary">
            {allergenDeclarationComplete
              ? 'Customers will be able to order this product online (Silver/Gold tier required).'
              : 'Verify allergen information above to enable online ordering.'}
          </p>
        </div>
      </div>

      {errors.submit && (
        <p role="alert" className="text-sm text-status-error-text bg-status-error-light rounded-md px-3 py-2">{errors.submit}</p>
      )}
      {saved && (
        <p role="status" aria-live="polite" className="text-sm text-status-success-text bg-status-success-light rounded-md px-3 py-2">
          Product saved.
        </p>
      )}

      <button type="submit" disabled={isSaving}
        className="px-6 py-2.5 rounded-lg font-medium text-sm bg-brand-primary text-text-inverse hover:bg-brand-primary-hover disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus transition-colors">
        {isSaving ? 'Saving…' : productId ? 'Save changes' : 'Add product'}
      </button>
    </form>
  )
}
