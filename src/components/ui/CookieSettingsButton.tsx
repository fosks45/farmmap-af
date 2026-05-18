'use client'

export function CookieSettingsButton() {
  function handleClick() {
    if (typeof window !== 'undefined' && typeof (window as Window & { openCookieBanner?: () => void }).openCookieBanner === 'function') {
      ;(window as Window & { openCookieBanner?: () => void }).openCookieBanner!()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-block bg-[var(--color-brand-primary)] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-brand-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)] min-h-[44px]"
    >
      Change your cookie settings
    </button>
  )
}
