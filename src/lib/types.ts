/**
 * Shared TypeScript types for Farmmap.
 * These types align with the data model in specs/003-farmmap/architecture-pack/data-model.md
 */

import type { ListingType, SubscriptionTier, Allergen } from './tokens'

// ─── Directory (multi-tenancy) ─────────────────────────────────────────────

export interface Directory {
  id: number
  slug: string
  name: string
  domain: string
  country_scope: string[]
  listing_types: ListingType[]
  created_at: string
}

// ─── Listing ───────────────────────────────────────────────────────────────

export interface ListingAddress {
  street: string
  town: string
  county: string
  country: string
  postcode: string | null
  eircode: string | null
  location_description: string | null // for honesty boxes without precise postcode
}

export interface OpeningHoursSlot {
  day_of_week: number[] // 0=Sunday … 6=Saturday
  opens: string // HH:MM
  closes: string // HH:MM
}

export interface OpeningHours {
  regular: OpeningHoursSlot[]
  notes: string | null // irregular patterns ("Tuesday and Friday only")
  seasonal_from: string | null // ISO date
  seasonal_to: string | null
  is_seasonal: boolean
}

export interface PaymentMethod {
  cash: boolean
  contactless: boolean
  qr_code: boolean
  qr_code_url: string | null
  revolut: boolean
  other: string | null
}

export interface Listing {
  id: string
  directory_id: number
  slug: string
  listing_type: ListingType
  tier: SubscriptionTier
  name: string
  description: string | null
  address: ListingAddress
  lat: number
  lng: number
  geo_approximate: boolean // true if geocoded from address text (no precise postcode)
  opening_hours: OpeningHours | null
  product_types: string[] // tag slugs from directory category list
  payment_methods: PaymentMethod | null // for honesty boxes
  contact_phone: string | null
  contact_email: string | null
  contact_website: string | null
  is_temporarily_closed: boolean
  is_currently_stocked: boolean | null // honesty box specific
  stocked_updated_at: string | null
  is_claimed: boolean
  claimed_at: string | null
  is_active: boolean
  currency: 'GBP' | 'EUR'
  country_code: 'GB' | 'IE'
  created_at: string
  updated_at: string
}

// GeoJSON feature for map pin layer — lightweight (no body text)
export interface ListingGeoFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }
  properties: {
    id: string
    name: string
    listing_type: ListingType
    tier: SubscriptionTier
    is_temporarily_closed: boolean
    is_currently_stocked: boolean | null
    slug: string
    country: string
    county: string
    avg_rating: number | null
    review_count: number
  }
}

export interface ListingGeoJSON {
  type: 'FeatureCollection'
  features: ListingGeoFeature[]
}

// ─── Photos ───────────────────────────────────────────────────────────────

export interface ListingPhoto {
  id: string
  listing_id: string
  directory_id: number
  storage_path: string
  public_url: string
  alt_text: string
  width: number
  height: number
  is_primary: boolean
  moderation_status: 'pending' | 'approved' | 'rejected'
  moderation_reason: string | null
  upload_order: number
  created_at: string
}

// ─── Reviews ─────────────────────────────────────────────────────────────

export interface Review {
  id: string
  listing_id: string
  directory_id: number
  reviewer_user_id: string
  reviewer_name: string
  rating: 1 | 2 | 3 | 4 | 5
  body: string
  moderation_status: 'pending' | 'approved' | 'rejected'
  moderation_reason: string | null
  owner_response: string | null
  owner_response_status: 'pending' | 'approved' | null
  created_at: string
  published_at: string | null
}

export interface AggregateRating {
  avg_rating: number
  review_count: number
}

// ─── Products ─────────────────────────────────────────────────────────────

export interface ProductAllergens {
  contains: Allergen[]
  may_contain: string | null // free text for cross-contamination
  verified: boolean
  verified_at: string | null
}

export interface Product {
  id: string
  listing_id: string
  directory_id: number
  name: string
  description: string | null
  price_min: number | null
  price_max: number | null
  currency: 'GBP' | 'EUR'
  photo_url: string | null
  allergens: ProductAllergens | null
  is_purchasable: boolean
  seasonal_availability: 'year_round' | 'seasonal' | 'ask_us'
  seasonal_from: string | null // month 1-12
  seasonal_to: string | null
  stock_quantity: number | null
  is_active: boolean
  moderation_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

// ─── Orders ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'in_preparation'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  currency: 'GBP' | 'EUR'
  allergen_snapshot: ProductAllergens | null
}

export interface Order {
  id: string
  idempotency_key: string
  listing_id: string
  directory_id: number
  consumer_user_id: string
  items: OrderItem[]
  subtotal: number
  delivery_fee: number
  total: number
  currency: 'GBP' | 'EUR'
  commission_amount: number
  commission_rate: number
  status: OrderStatus
  delivery_address: ListingAddress
  delivery_slot_date: string
  delivery_slot_time: string
  stripe_payment_intent_id: string
  consumer_email: string
  notes: string | null
  created_at: string
  updated_at: string
}

// ─── Users & Auth ────────────────────────────────────────────────────────

export type UserRole = 'consumer' | 'owner' | 'content_moderator' | 'directory_admin' | 'super_admin'

export interface UserProfile {
  id: string
  directory_id: number
  email: string
  display_name: string | null
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface ListingManager {
  listing_id: string
  user_id: string
  role: 'owner' | 'manager'
  invited_at: string
  accepted_at: string | null
  user?: UserProfile
}

// ─── Subscription ─────────────────────────────────────────────────────────

export type SubscriptionStatus =
  | 'active'
  | 'grace_period'
  | 'suspended'
  | 'cancelled'
  | 'pending_downgrade'
  | 'pending_cancellation'

export interface Subscription {
  id: string
  listing_id: string
  directory_id: number
  user_id: string
  tier: 'bronze' | 'silver' | 'gold'
  status: SubscriptionStatus
  stripe_subscription_id: string
  stripe_customer_id: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  pending_tier: 'bronze' | 'silver' | 'gold' | null
  silver_months_count: number
  completed_order_count: number
  created_at: string
  updated_at: string
}

// ─── Waitlist ─────────────────────────────────────────────────────────────

export interface WaitlistEntry {
  id: string
  listing_id: string
  directory_id: number
  email: string
  confirmed: boolean
  unsubscribed: boolean
  created_at: string
}

// ─── Analytics events ────────────────────────────────────────────────────

export type AnalyticsEventType =
  | 'listing_view'
  | 'map_pin_click'
  | 'claim_cta_click'
  | 'waitlist_signup'
  | 'review_submit'
  | 'enquiry_submit'
  | 'upgrade_initiated'
  | 'upgrade_completed'
  | 'directions_click'

export interface AnalyticsEvent {
  id: string
  directory_id: number
  listing_id: string | null
  event_type: AnalyticsEventType
  session_id: string // random, not tied to user
  page_path: string
  created_at: string
}

// ─── Audit trail ─────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string
  directory_id: number
  actor_user_id: string
  action: string
  target_entity_type: string
  target_entity_id: string
  previous_value: Record<string, unknown> | null
  new_value: Record<string, unknown> | null
  ip_address: string | null // C3 — hashed before storage
  created_at: string
}

// ─── Page / Route params ──────────────────────────────────────────────────

export interface ListingPageParams {
  type: string
  country: string
  county: string
  slug: string
}

export interface CountyPageParams {
  country: string
  county: string
}

// ─── Listing detail (full, for SSR page rendering) ───────────────────────

export interface ListingDetail extends Listing {
  photos: ListingPhoto[]
  aggregate_rating: AggregateRating | null
  reviews: Review[]
  products: Product[]
  nearby_listings: Pick<Listing, 'id' | 'slug' | 'name' | 'listing_type' | 'tier' | 'address'>[]
}
