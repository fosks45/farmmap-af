'use client'

/**
 * SkipLink — first interactive element on every page.
 * Visually hidden until focused; reveals above all content when focused.
 * WCAG 2.4.1 (Bypass Blocks) — Level A.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        focus:absolute focus:top-2 focus:left-2
        focus:z-[9999]
        focus:rounded-md focus:px-4 focus:py-2
        focus:bg-brand-primary focus:text-text-inverse
        focus:text-sm focus:font-semibold focus:no-underline
        focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-border-focus
      "
    >
      Skip to main content
    </a>
  )
}
