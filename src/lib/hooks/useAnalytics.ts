'use client'

import { useCallback } from 'react'

type ClientEventType =
  | 'claim_cta_click'
  | 'waitlist_signup'
  | 'review_submit'
  | 'directions_click'
  | 'enquiry_submit'
  | 'upgrade_initiated'

/**
 * Hook for firing server-side analytics events from client components.
 * POSTs to the internal /api/analytics endpoint.
 *
 * Consent-independent: all events are cookieless, C0, server-side.
 * ADR: ADR-0008
 */
export function useAnalytics() {
  const track = useCallback(
    async (eventType: ClientEventType, listingId?: string, metadata?: Record<string, unknown>) => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventType, listingId, metadata }),
        })
      } catch {
        // Analytics must never block user interactions
      }
    },
    [],
  )

  return { track }
}
