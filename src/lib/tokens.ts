/**
 * Design tokens as TypeScript constants.
 * These mirror the CSS custom properties in globals.css.
 * Use the CSS variables in component styles; use these constants
 * in TypeScript logic (e.g. map pin colours, chart colours).
 *
 * NO hex literals elsewhere in the codebase. All colours live here.
 */

export const colours = {
  // Brand
  brandPrimary: '#2D6A4F',
  brandPrimaryHover: '#245A42',
  brandPrimaryLight: '#B7E4C7',
  brandSecondary: '#3A5A8C',
  brandSecondaryHover: '#2E497A',
  brandSecondaryLight: '#C8D8F0',

  // Surface
  surfaceDefault: '#FFFFFF',
  surfaceRaised: '#F8F6F2',
  surfaceElevated: '#FFFFFF',
  surfaceMap: '#E5EFE8',

  // Text
  textPrimary: '#1A2E1F',
  textSecondary: '#4A6050',
  textTertiary: '#7A9080',
  textInverse: '#FFFFFF',
  textLink: '#2D6A4F',
  textLinkVisited: '#1E4D36',

  // Map pins — each has DISTINCT colour AND shape/icon (WCAG 1.4.1)
  pinFree: '#8B9E93',
  pinFreeStroke: '#6A7D72',
  pinClaimed: '#2D6A4F',
  pinClaimedStroke: '#1E4D36',
  pinBronze: '#B5651D',
  pinBronzeStroke: '#8A4A15',
  pinSilver: '#3A5A8C',
  pinSilverStroke: '#2E497A',
  pinGold: '#C9A227',
  pinGoldStroke: '#9B7C1B',
  pinHonestyStocked: '#22A05A',
  pinHonestyEmpty: '#9BABA2',
  pinClosed: '#C0C0C0',

  // Status
  statusSuccess: '#22A05A',
  statusSuccessLight: '#D4EDDA',
  statusSuccessText: '#145A35',
  statusWarning: '#D97706',
  statusWarningLight: '#FEF3C7',
  statusWarningText: '#92400E',
  statusError: '#DC2626',
  statusErrorLight: '#FEE2E2',
  statusErrorText: '#991B1B',
  statusInfo: '#3A5A8C',
  statusInfoLight: '#EFF6FF',
  statusInfoText: '#1E3A5F',

  // Border
  borderDefault: '#D4DDD8',
  borderSubtle: '#E8EFEB',
  borderStrong: '#8B9E93',
  borderFocus: '#2D6A4F',
  borderError: '#DC2626',
} as const

export type ColourToken = keyof typeof colours

// Map pin tier config — used by MapPin.tsx and MapLibre layer configuration
export type PinTier = 'free' | 'claimed' | 'bronze' | 'silver' | 'gold'
export type ListingType = 'farm_shop' | 'honesty_box' | 'farm_gate_stall' | 'roadside_stand'

export const pinConfig: Record<PinTier, {
  fill: string
  stroke: string
  // Icon name (lucide) — never colour-only; WCAG 1.4.1
  icon: string
  label: string
}> = {
  free: {
    fill: colours.pinFree,
    stroke: colours.pinFreeStroke,
    icon: 'MapPin',
    label: 'Unlisted',
  },
  claimed: {
    fill: colours.pinClaimed,
    stroke: colours.pinClaimedStroke,
    icon: 'MapPinCheck',
    label: 'Claimed',
  },
  bronze: {
    fill: colours.pinBronze,
    stroke: colours.pinBronzeStroke,
    icon: 'Award',
    label: 'Bronze member',
  },
  silver: {
    fill: colours.pinSilver,
    stroke: colours.pinSilverStroke,
    icon: 'Star',
    label: 'Silver member',
  },
  gold: {
    fill: colours.pinGold,
    stroke: colours.pinGoldStroke,
    icon: 'Crown',
    label: 'Gold member',
  },
}

export const listingTypeConfig: Record<ListingType, {
  label: string
  pluralLabel: string
  slug: string
  // SVG path for distinct map pin shape (in addition to colour)
  pinShape: 'circle' | 'square' | 'diamond' | 'star'
}> = {
  farm_shop: {
    label: 'Farm Shop',
    pluralLabel: 'Farm Shops',
    slug: 'farm-shop',
    pinShape: 'circle',
  },
  honesty_box: {
    label: 'Honesty Box',
    pluralLabel: 'Honesty Boxes',
    slug: 'honesty-box',
    pinShape: 'square',
  },
  farm_gate_stall: {
    label: 'Farm Gate Stall',
    pluralLabel: 'Farm Gate Stalls',
    slug: 'farm-gate-stall',
    pinShape: 'diamond',
  },
  roadside_stand: {
    label: 'Roadside Stand',
    pluralLabel: 'Roadside Stands',
    slug: 'roadside-stand',
    pinShape: 'star',
  },
}

// The 14 regulated major allergens under Natasha's Law / EU 1169/2011
export const ALLERGENS = [
  'celery',
  'cereals_containing_gluten',
  'crustaceans',
  'eggs',
  'fish',
  'lupin',
  'milk',
  'molluscs',
  'mustard',
  'peanuts',
  'sesame',
  'soybeans',
  'sulphur_dioxide_and_sulphites',
  'tree_nuts',
] as const

export type Allergen = typeof ALLERGENS[number]

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  celery: 'Celery',
  cereals_containing_gluten: 'Cereals containing gluten',
  crustaceans: 'Crustaceans',
  eggs: 'Eggs',
  fish: 'Fish',
  lupin: 'Lupin',
  milk: 'Milk',
  molluscs: 'Molluscs',
  mustard: 'Mustard',
  peanuts: 'Peanuts',
  sesame: 'Sesame',
  soybeans: 'Soybeans',
  sulphur_dioxide_and_sulphites: 'Sulphur dioxide & sulphites',
  tree_nuts: 'Tree nuts',
}

// Tier capability matrix
export type SubscriptionTier = 'free' | 'claimed' | 'bronze' | 'silver' | 'gold'

export const TIER_CONFIG: Record<SubscriptionTier, {
  label: string
  monthlyPrice: number | null
  commissionRate: number | null
  commissionThreshold: number | null
  maxProducts: number
  canOrder: boolean
  hasAnalytics: boolean
  hasBrandedPage: boolean
  hasVerifiedBadge: boolean
  hasManagedMarketing: boolean
}> = {
  free: {
    label: 'Free',
    monthlyPrice: null,
    commissionRate: null,
    commissionThreshold: null,
    maxProducts: 0,
    canOrder: false,
    hasAnalytics: false,
    hasBrandedPage: false,
    hasVerifiedBadge: false,
    hasManagedMarketing: false,
  },
  claimed: {
    label: 'Claimed (Free)',
    monthlyPrice: null,
    commissionRate: null,
    commissionThreshold: null,
    maxProducts: 0,
    canOrder: false,
    hasAnalytics: false,
    hasBrandedPage: false,
    hasVerifiedBadge: false,
    hasManagedMarketing: false,
  },
  bronze: {
    label: 'Bronze',
    monthlyPrice: 20,
    commissionRate: null,
    commissionThreshold: null,
    maxProducts: 500,
    canOrder: false,
    hasAnalytics: true,
    hasBrandedPage: true,
    hasVerifiedBadge: true,
    hasManagedMarketing: false,
  },
  silver: {
    label: 'Silver',
    monthlyPrice: 60,
    commissionRate: 0.03,
    commissionThreshold: 20,
    maxProducts: 500,
    canOrder: true,
    hasAnalytics: true,
    hasBrandedPage: true,
    hasVerifiedBadge: true,
    hasManagedMarketing: false,
  },
  gold: {
    label: 'Gold',
    monthlyPrice: 100,
    commissionRate: 0.05,
    commissionThreshold: 30,
    maxProducts: 1000,
    canOrder: true,
    hasAnalytics: true,
    hasBrandedPage: true,
    hasVerifiedBadge: true,
    hasManagedMarketing: true,
  },
}

// Gold eligibility thresholds
export const GOLD_ELIGIBILITY = {
  requiredSilverMonths: 3,
  requiredCompletedOrders: 50,
} as const
