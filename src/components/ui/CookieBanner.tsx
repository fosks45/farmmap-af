'use client'

import { useEffect, useRef, useState } from 'react'
import { useCookieConsent } from '@/lib/hooks/useCookieConsent'

/**
 * PECR-compliant cookie consent banner.
 * Uses native <dialog> with showModal() for focus trapping (WCAG 2.1.2).
 * Categories: Strictly Necessary (always on) and Analytics (opt-in, default off).
 * Stores consent in fm_consent cookie.
 *
 * Opens automatically when no consent has been given.
 * Can be reopened via the footer "Cookie settings" link (window.openCookieBanner).
 */
export function CookieBanner() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [showPreferences, setShowPreferences] = useState(false)
  const [analyticsChecked, setAnalyticsChecked] = useState(false)
  const { analyticsAccepted, setConsent, hasConsent } = useCookieConsent()

  // Open banner if no consent recorded
  useEffect(() => {
    if (!hasConsent) {
      dialogRef.current?.showModal()
    }
  }, [hasConsent])

  // Expose global opener for footer "Cookie settings" link
  useEffect(() => {
    const open = () => {
      setShowPreferences(true)
      dialogRef.current?.showModal()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).openCookieBanner = open
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).openCookieBanner
    }
  }, [])

  // Sync analytics toggle with stored value
  useEffect(() => {
    setAnalyticsChecked(analyticsAccepted)
  }, [analyticsAccepted])

  function acceptAll() {
    setConsent({ analytics: true })
    dialogRef.current?.close()
  }

  function rejectNonEssential() {
    setConsent({ analytics: false })
    dialogRef.current?.close()
  }

  function savePreferences() {
    setConsent({ analytics: analyticsChecked })
    dialogRef.current?.close()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="
        fixed bottom-0 left-0 right-0 top-auto m-0 max-w-none w-full
        sm:bottom-4 sm:left-4 sm:right-auto sm:top-auto sm:m-0 sm:max-w-sm sm:rounded-xl
        p-6 shadow-2xl bg-surface-elevated border border-border-default
        backdrop:bg-black/40
      "
    >
      <div id="cookie-banner-title" className="text-base font-semibold text-text-primary mb-2">
        Cookie settings
      </div>
      <p id="cookie-banner-desc" className="text-sm text-text-secondary mb-4">
        We use cookies to make Farmmap work and to understand how people use it.
        You choose what we track.{' '}
        <a href="/privacy/cookies" className="underline text-text-link hover:text-brand-primary">
          Cookie policy
        </a>
      </p>

      {showPreferences ? (
        <div>
          <div className="space-y-3 mb-4">
            {/* Strictly necessary — always on */}
            <div className="flex items-start gap-3">
              <span
                role="switch"
                aria-checked="true"
                aria-disabled="true"
                aria-label="Strictly necessary cookies — always active"
                className="mt-0.5 flex-shrink-0 w-10 h-6 rounded-full bg-brand-primary opacity-60 cursor-not-allowed"
              />
              <div>
                <p className="text-sm font-medium text-text-primary">Strictly necessary</p>
                <p className="text-xs text-text-secondary">Authentication, security, cookie preferences. Cannot be disabled.</p>
              </div>
            </div>

            {/* Analytics — opt-in */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={analyticsChecked}
                aria-label="Analytics cookies"
                onClick={() => setAnalyticsChecked((v) => !v)}
                className={`
                  mt-0.5 flex-shrink-0 w-10 h-6 rounded-full transition-colors
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
                  ${analyticsChecked ? 'bg-brand-primary' : 'bg-border-strong'}
                `}
              >
                <span className={`
                  block w-4 h-4 rounded-full bg-white shadow transition-transform ml-1
                  ${analyticsChecked ? 'translate-x-4' : 'translate-x-0'}
                `} />
              </button>
              <div>
                <p className="text-sm font-medium text-text-primary">Analytics</p>
                <p className="text-xs text-text-secondary">Plausible Analytics — anonymous, no personal data. Helps us improve the directory.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={savePreferences}
              className="flex-1 min-w-[120px] btn-primary text-sm py-2 px-4 rounded-lg font-medium
                         bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
            >
              Save preferences
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={acceptAll}
            className="
              w-full py-2 px-4 rounded-lg font-medium text-sm
              bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
            "
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={rejectNonEssential}
            className="
              w-full py-2 px-4 rounded-lg font-medium text-sm
              bg-surface-raised text-text-primary border border-border-default
              hover:bg-surface-map
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
            "
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => setShowPreferences(true)}
            className="
              w-full py-2 px-4 rounded-lg font-medium text-sm text-text-secondary underline
              hover:text-text-primary
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
            "
          >
            Manage preferences
          </button>
        </div>
      )}
    </dialog>
  )
}
