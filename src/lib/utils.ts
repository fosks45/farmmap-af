import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind CSS classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Build the canonical listing URL path */
export function listingPath(
  listingType: string,
  country: string,
  county: string,
  slug: string,
): string {
  const typeSlug = listingType.replace(/_/g, '-')
  return `/listings/${typeSlug}/${slugify(country)}/${slugify(county)}/${slug}`
}

export function countyPath(country: string, county: string): string {
  return `/county/${slugify(country)}/${slugify(county)}`
}

export function countryPath(country: string): string {
  return `/${slugify(country)}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Format a star rating as accessible text */
export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} out of 5 stars`
}

/** Format a price in GBP or EUR */
export function formatPrice(amount: number, currency: 'GBP' | 'EUR'): string {
  return new Intl.NumberFormat(currency === 'GBP' ? 'en-GB' : 'en-IE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/** Calculate commission on an order subtotal */
export function calculateCommission(subtotal: number, rate: number, threshold: number): number {
  if (subtotal < threshold) return 0
  return Math.round(subtotal * rate * 100) / 100
}

/** Validate an Eircode format */
export function isValidEircode(eircode: string): boolean {
  return /^[A-Z]\d{1}\s?[A-Z0-9]{4}$/i.test(eircode.trim())
}

/** Validate a UK postcode format */
export function isValidUKPostcode(postcode: string): boolean {
  return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(postcode.trim())
}

/** Format an ISO date string as a human-readable date */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Format a relative time (e.g. "2 hours ago") */
export function formatRelativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = now - then
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return formatDate(iso)
}

/** Truncate text to maxLength with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

/** Get directions URL for a given address */
export function getDirectionsUrl(
  address: { street: string; town: string; county: string; postcode?: string | null },
  lat?: number,
  lng?: number,
): string {
  if (lat && lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  }
  const addr = [address.street, address.town, address.county, address.postcode]
    .filter(Boolean)
    .join(', ')
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`
}

/** Get Apple Maps URL for iOS */
export function getAppleMapsUrl(
  address: { street: string; town: string; county: string; postcode?: string | null },
  lat?: number,
  lng?: number,
): string {
  if (lat && lng) {
    return `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`
  }
  const addr = [address.street, address.town, address.county, address.postcode]
    .filter(Boolean)
    .join(', ')
  return `maps://maps.apple.com/?daddr=${encodeURIComponent(addr)}&dirflg=d`
}

/** Parse page query param safely */
export function parsePage(pageParam: string | string[] | undefined): number {
  const n = parseInt(String(pageParam ?? '1'), 10)
  if (isNaN(n) || n < 1) return 1
  return n
}

export const LISTINGS_PER_PAGE = 20
