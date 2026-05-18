import type { Metadata } from 'next'
import Link from 'next/link'
import { CookieSettingsButton } from '@/components/ui/CookieSettingsButton'

export const metadata: Metadata = {
  title: 'Cookie Policy — Farmmap',
  description: 'How Farmmap uses cookies and how to manage your cookie preferences.',
  alternates: { canonical: 'https://farmmap.co.uk/privacy/cookies' },
}

const LAST_UPDATED = '15 May 2026'
const VERSION = '1.0'

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Cookie Policy</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">
        Version {VERSION} — Last updated {LAST_UPDATED}
      </p>

      <div className="prose max-w-none space-y-8 text-[var(--color-text-primary)]">

        <section>
          <h2 className="text-xl font-semibold mb-3">1. What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help
            websites remember your preferences and work correctly across pages.
          </p>
          <p className="mt-2">
            Farmmap uses a minimal number of cookies — only what is strictly necessary to operate
            the service, plus optional analytics cookies you can accept or decline.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Cookies we use</h2>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">Complete list of cookies set by Farmmap</caption>
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th scope="col" className="text-left py-2 pr-4 font-semibold text-[var(--color-text-primary)]">Cookie name</th>
                  <th scope="col" className="text-left py-2 pr-4 font-semibold text-[var(--color-text-primary)]">Purpose</th>
                  <th scope="col" className="text-left py-2 pr-4 font-semibold text-[var(--color-text-primary)]">Duration</th>
                  <th scope="col" className="text-left py-2 pr-4 font-semibold text-[var(--color-text-primary)]">Type</th>
                  <th scope="col" className="text-left py-2 font-semibold text-[var(--color-text-primary)]">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">fm_consent</td>
                  <td className="py-2 pr-4">Stores your cookie preference choices (accepted/rejected categories, version, timestamp)</td>
                  <td className="py-2 pr-4">12 months</td>
                  <td className="py-2 pr-4">First party</td>
                  <td className="py-2">Strictly Necessary</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">fm_session</td>
                  <td className="py-2 pr-4">Session management for logged-in farm shop owners</td>
                  <td className="py-2 pr-4">Session (closes with browser)</td>
                  <td className="py-2 pr-4">First party</td>
                  <td className="py-2">Strictly Necessary</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">_csrf</td>
                  <td className="py-2 pr-4">CSRF protection for form submissions</td>
                  <td className="py-2 pr-4">Session</td>
                  <td className="py-2 pr-4">First party</td>
                  <td className="py-2">Strictly Necessary</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">_pl_s</td>
                  <td className="py-2 pr-4">Plausible Analytics session identifier (only if analytics cookies accepted)</td>
                  <td className="py-2 pr-4">24 hours</td>
                  <td className="py-2 pr-4">First party (EU-hosted)</td>
                  <td className="py-2">Analytics</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">_ga</td>
                  <td className="py-2 pr-4">Google Analytics 4 client identifier (only if analytics cookies accepted and GA4 deployed)</td>
                  <td className="py-2 pr-4">2 years</td>
                  <td className="py-2 pr-4">Third party (Google)</td>
                  <td className="py-2">Analytics</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">_ga_[ID]</td>
                  <td className="py-2 pr-4">Google Analytics 4 session identifier (only if analytics cookies accepted and GA4 deployed)</td>
                  <td className="py-2 pr-4">2 years</td>
                  <td className="py-2 pr-4">Third party (Google)</td>
                  <td className="py-2">Analytics</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] mt-3">
            This table is updated whenever a new cookie is added to the service. The policy version
            number is incremented at the same time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Cookie categories explained</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-1">Strictly Necessary</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                These cookies are required for Farmmap to work. They cannot be switched off.
                They do not track you for marketing purposes and do not require your consent
                under UK PECR or the EU ePrivacy Directive.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-1">Analytics</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                These cookies help us understand how visitors use Farmmap — which pages are visited,
                how long sessions last, and where traffic comes from. We use this to improve the
                service. These cookies require your consent. You can accept or decline them using
                the cookie banner or by clicking "Change your cookie settings" below.
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                Where Plausible Analytics is deployed in cookieless mode, no cookies are set by
                Plausible. In that case, the Analytics category covers only any other analytics
                tools in use (e.g. Google Analytics 4, if deployed).
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. How to manage your cookie preferences</h2>

          <h3 className="text-base font-semibold mt-4 mb-2">Change your preferences on Farmmap</h3>
          <p>
            You can update your cookie preferences at any time using the button below. This opens
            the same consent panel shown on your first visit.
          </p>
          <div className="mt-3">
            <CookieSettingsButton />
          </div>

          <h3 className="text-base font-semibold mt-6 mb-2">Manage cookies in your browser</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            You can also block or delete all cookies through your browser settings. Note that
            blocking strictly necessary cookies will prevent Farmmap from working correctly.
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li>
              <strong className="text-[var(--color-text-primary)]">Safari (iOS):</strong>{' '}
              Settings → Safari → Advanced → Block All Cookies (or use Privacy Report for site-specific controls)
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Safari (macOS):</strong>{' '}
              Safari menu → Settings → Privacy → Manage Website Data
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Chrome (Android / Windows / macOS):</strong>{' '}
              Settings → Privacy and security → Cookies and other site data
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Firefox:</strong>{' '}
              Settings → Privacy &amp; Security → Cookies and Site Data → Manage Data
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Microsoft Edge:</strong>{' '}
              Settings → Cookies and site permissions → Cookies and site data
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. UK users</h2>
          <p>
            Farmmap&apos;s use of cookies on users in the United Kingdom is governed by the Privacy
            and Electronic Communications Regulations 2003 (PECR) and UK GDPR. Strictly Necessary
            cookies are exempt from consent under PECR. Analytics cookies require your explicit
            opt-in consent.
          </p>
          <p className="mt-2">
            The UK supervisory authority for cookie complaints is the{' '}
            <a
              href="https://ico.org.uk"
              rel="noopener noreferrer"
              target="_blank"
              className="text-[var(--color-brand-primary)] underline"
            >
              Information Commissioner&apos;s Office (ICO)
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Republic of Ireland users</h2>
          <p>
            For users in the Republic of Ireland, Farmmap&apos;s use of cookies is governed by the
            European Union (Electronic Communications) Regulations 2011 (which transpose the EU
            ePrivacy Directive 2009/136/EC) and EU GDPR. Farmmap applies the standard set by the
            Data Protection Commission (DPC) throughout — the stricter standard — for all users.
          </p>
          <p className="mt-2">
            The Irish supervisory authority for cookie complaints is the{' '}
            <a
              href="https://www.dataprotection.ie"
              rel="noopener noreferrer"
              target="_blank"
              className="text-[var(--color-brand-primary)] underline"
            >
              Data Protection Commission (DPC)
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Changes to this policy</h2>
          <p>
            We update this policy whenever a new cookie is added or removed. The version number
            and last updated date at the top of this page reflect the current version. When the
            version changes, the consent banner is shown again so you can review and update your
            preferences.
          </p>
        </section>

        <div className="border-t border-[var(--color-border-subtle)] pt-6 mt-8">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Version {VERSION} — Last updated {LAST_UPDATED}
          </p>
          <div className="flex gap-4 mt-2 text-sm flex-wrap">
            <Link href="/privacy" className="text-[var(--color-brand-primary)] underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[var(--color-brand-primary)] underline">
              Terms of Service
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            Questions about cookies?{' '}
            <a href="mailto:privacy@farmmap.co.uk" className="text-[var(--color-brand-primary)] underline">
              privacy@farmmap.co.uk
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}
