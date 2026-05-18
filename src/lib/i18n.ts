/**
 * i18n locale strings for Farmmap.
 * en-GB: UK users (default)
 * en-IE: Republic of Ireland users (set by middleware from directory config)
 *
 * Keep keys flat — no nesting beyond one level.
 */

export type Locale = 'en-GB' | 'en-IE'

const strings = {
  'en-GB': {
    // Navigation
    'nav.map': 'Map',
    'nav.nearMe': 'Near me',
    'nav.discover': 'Discover',
    'nav.myListings': 'My listings',
    'nav.account': 'Account',
    'nav.signIn': 'Sign in',
    'nav.admin': 'Admin',

    // Listing types
    'type.farmShop': 'Farm Shop',
    'type.farmShops': 'Farm Shops',
    'type.honestyBox': 'Honesty Box',
    'type.honestyBoxes': 'Honesty Boxes',
    'type.farmGateStall': 'Farm Gate Stall',
    'type.farmGateStalls': 'Farm Gate Stalls',
    'type.roadsideStand': 'Roadside Stand',
    'type.roadsideStands': 'Roadside Stands',

    // Listing detail
    'listing.claimCta': 'Is this your farm shop? Claim it free',
    'listing.claimedBadge': 'Managed listing',
    'listing.unclaimedSeededNote': 'This listing was added from public data. If you\'re the owner, claim it to manage your details.',
    'listing.temporarilyClosed': 'Temporarily closed',
    'listing.directions': 'Get directions',
    'listing.openingHours': 'Opening hours',
    'listing.products': 'Products available',
    'listing.contact': 'Contact',
    'listing.reviews': 'Reviews',
    'listing.writeReview': 'Write a review',
    'listing.noReviews': 'No reviews yet. Be the first!',
    'listing.reviewsMinThreshold': 'Reviews shown once 3 or more have been submitted.',
    'listing.currentlyStocked': 'Currently stocked',
    'listing.currentlyEmpty': 'Currently empty',
    'listing.stockedUpdated': 'Last updated',
    'listing.paymentMethods': 'Payment accepted',
    'listing.alsoIn': 'Also in',
    'listing.alsoInCounty': 'Also in {county}',

    // Waitlist
    'waitlist.heading': 'Get notified when {name} starts taking online orders',
    'waitlist.emailPlaceholder': 'your@email.co.uk',
    'waitlist.submit': 'Notify me',
    'waitlist.success': "You're on the list! We'll email you when ordering goes live.",
    'waitlist.alreadySignedUp': "You're already signed up!",
    'waitlist.emailInvalid': 'Please enter a valid email address',

    // Reviews
    'review.ratingLabel': 'Your rating',
    'review.bodyLabel': 'Your review',
    'review.bodyPlaceholder': 'Share your experience to help other visitors…',
    'review.charCount': '{count} / 1000 characters',
    'review.minChars': 'Please write at least 20 characters',
    'review.submit': 'Submit review',
    'review.submitted': 'Thank you — your review is being reviewed and will appear shortly.',
    'review.loginRequired': 'Sign in to leave a review',
    'review.ownerResponse': "Owner's response",

    // Tier badges
    'tier.free': 'Free listing',
    'tier.claimed': 'Claimed',
    'tier.bronze': 'Bronze',
    'tier.silver': 'Silver',
    'tier.gold': 'Gold',
    'tier.verifiedBadge': 'Verified owner',
    'tier.goldPriority': 'Gold Member — Priority Listed',

    // Subscription
    'subscription.upgrade': 'Upgrade',
    'subscription.currentTier': 'Your current plan',
    'subscription.bronzePrice': '£20/month',
    'subscription.silverPrice': '£60/month',
    'subscription.goldPrice': '£100/month',
    'subscription.cancellationRight': 'You have a 14-day right to cancel and receive a full refund after your initial sign-up.',

    // Auth
    'auth.signIn': 'Sign in',
    'auth.signUp': 'Create account',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.magicLink': 'Sign in without a password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',

    // Admin
    'admin.listingQueue': 'Listing queue',
    'admin.photoQueue': 'Photo queue',
    'admin.reviewQueue': 'Review queue',
    'admin.approve': 'Approve',
    'admin.reject': 'Reject',
    'admin.bulkApprove': 'Approve selected ({count})',
    'admin.rejectReason': 'Reason for rejection',

    // Common
    'common.loading': 'Loading…',
    'common.error': 'Something went wrong. Please try again.',
    'common.retry': 'Try again',
    'common.save': 'Save changes',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.search': 'Search',
    'common.close': 'Close',
    'common.openMenu': 'Open menu',
    'common.skipToMain': 'Skip to main content',

    // Cookie consent
    'cookies.bannerHeading': 'We use cookies',
    'cookies.bannerBody': 'We use strictly necessary cookies to make this site work. With your consent, we may also set analytics cookies to understand how you use the site.',
    'cookies.acceptAll': 'Accept all',
    'cookies.acceptNecessary': 'Accept necessary only',
    'cookies.managePreferences': 'Manage preferences',
    'cookies.strictlyNecessary': 'Strictly necessary',
    'cookies.strictlyNecessaryDesc': 'These cookies are required for the site to function. They cannot be disabled.',
    'cookies.analytics': 'Analytics',
    'cookies.analyticsDesc': 'These cookies help us understand how visitors use the site. All data is aggregated and anonymous.',
    'cookies.savePreferences': 'Save preferences',
    'cookies.settingsLink': 'Cookie settings',

    // Address / postcode labels
    'address.postcode': 'Postcode',
    'address.eircode': 'Eircode',
    'address.country': 'Country',
  },
  'en-IE': {
    // Override only what differs for ROI users
    'address.postcode': 'Eircode',
    'waitlist.emailPlaceholder': 'your@email.ie',
    'subscription.bronzePrice': '€24/month',
    'subscription.silverPrice': '€72/month',
    'subscription.goldPrice': '€120/month',
  } satisfies Partial<Record<string, string>>,
} as const

type StringKey = keyof typeof strings['en-GB']

/**
 * Get a localised string.
 * Falls back to en-GB if the key isn't overridden in en-IE.
 */
export function t(key: StringKey, locale: Locale = 'en-GB', params?: Record<string, string | number>): string {
  const localeStrings = strings[locale] as Partial<Record<string, string>>
  const base = strings['en-GB']
  let str: string = localeStrings[key] ?? base[key]

  if (params) {
    for (const [param, value] of Object.entries(params)) {
      str = str.replace(`{${param}}`, String(value))
    }
  }

  return str
}

export { strings }
