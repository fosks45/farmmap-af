/**
 * SiteFooter — site-wide footer.
 * Cookie settings link opens CookieBanner via window.openCookieBanner().
 */
'use client'

import Link from 'next/link'

export function SiteFooter() {
  function openCookieBanner() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).openCookieBanner?.()
  }

  return (
    <footer className="bg-surface-raised border-t border-border-default mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-text-secondary">
          <div>
            <p className="font-semibold text-text-primary mb-2">Farmmap</p>
            <p className="text-xs">
              The UK &amp; Ireland&apos;s most complete directory of farm shops and honesty boxes.
            </p>
          </div>

          <div>
            <p className="font-semibold text-text-primary mb-2">Browse</p>
            <ul className="space-y-1">
              <li><Link href="/map" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Map</Link></li>
              <li><Link href="/farm-shops" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Farm Shops</Link></li>
              <li><Link href="/honesty-boxes" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Honesty Boxes</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-text-primary mb-2">Listings</p>
            <ul className="space-y-1">
              <li><Link href="/dashboard" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">My dashboard</Link></li>
              <li><Link href="/login" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Sign in</Link></li>
              <li><Link href="/signup" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Create account</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-text-primary mb-2">Legal</p>
            <ul className="space-y-1">
              <li><Link href="/privacy" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Privacy policy</Link></li>
              <li><Link href="/privacy/cookies" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Cookie policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Terms of service</Link></li>
              <li>
                <button
                  type="button"
                  onClick={openCookieBanner}
                  className="hover:text-brand-primary text-left
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm"
                >
                  Cookie settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border-subtle text-xs text-text-tertiary flex flex-wrap gap-2 justify-between">
          <p>&copy; {new Date().getFullYear()} Farmmap. All rights reserved.</p>
          <p>
            Honesty box data supplied in partnership with{' '}
            <a
              href="https://www.yourhonestybox.com"
              rel="noopener noreferrer"
              target="_blank"
              className="underline hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm"
            >
              yourhonestybox.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
