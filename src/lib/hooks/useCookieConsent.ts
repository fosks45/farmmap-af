'use client'

import { useState, useEffect, useCallback } from 'react'

const CONSENT_COOKIE = 'fm_consent'
const CONSENT_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds

interface ConsentCategories {
  analytics: boolean
}

interface ConsentState extends ConsentCategories {
  hasConsent: boolean
  setConsent: (categories: ConsentCategories) => void
  analyticsAccepted: boolean
  marketingAccepted: boolean
}

function parseConsentCookie(): ConsentCategories | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]+)`))
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    return null
  }
}

/**
 * Reads and writes the fm_consent cookie.
 * Returns consent state and a setter.
 *
 * hasConsent is false until the user has made a choice.
 * analyticsAccepted: true if user accepted analytics cookies.
 * marketingAccepted: always false (no marketing cookies in v1).
 */
export function useCookieConsent(): ConsentState {
  const [consent, setConsentState] = useState<ConsentCategories | null>(null)

  useEffect(() => {
    setConsentState(parseConsentCookie())
  }, [])

  const setConsent = useCallback((categories: ConsentCategories) => {
    const value = encodeURIComponent(JSON.stringify(categories))
    document.cookie = `${CONSENT_COOKIE}=${value}; max-age=${CONSENT_MAX_AGE}; path=/; SameSite=Lax; Secure`
    setConsentState(categories)

    // Conditionally load Plausible analytics if accepted
    if (categories.analytics && typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any
      if (!w.plausible) {
        const script = document.createElement('script')
        script.defer = true
        script.dataset.domain = 'farmmap.co.uk'
        script.src = 'https://plausible.io/js/script.js'
        document.head.appendChild(script)
      }
    }
  }, [])

  return {
    hasConsent: consent !== null,
    analytics: consent?.analytics ?? false,
    analyticsAccepted: consent?.analytics ?? false,
    marketingAccepted: false,
    setConsent,
  }
}
