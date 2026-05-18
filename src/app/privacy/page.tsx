import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Farmmap',
  description: 'How Farmmap collects, uses, and protects your personal data. UK GDPR and EU GDPR compliant.',
  alternates: { canonical: 'https://farmmap.co.uk/privacy' },
}

const LAST_UPDATED = '15 May 2026'
const VERSION = '1.0'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
      <p className="text-sm text-text-tertiary mb-8">
        Version {VERSION} — Last updated {LAST_UPDATED}
      </p>

      <div className="prose prose-sm max-w-none text-text-secondary space-y-8">

        <section aria-labelledby="pp-controller">
          <h2 id="pp-controller" className="text-lg font-semibold text-text-primary mb-3">1. Data controller</h2>
          <p>
            Farmmap (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is the data controller for personal data collected through
            farmmap.co.uk. Our registered address and ICO registration number are available on request at{' '}
            <a href="mailto:privacy@farmmap.co.uk" className="underline text-text-link hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
              privacy@farmmap.co.uk
            </a>.
          </p>
          <p className="mt-2">
            For users in the Republic of Ireland, we are subject to both UK GDPR and EU GDPR. Our EU representative
            for GDPR purposes is contactable at the same address. We are registered with the ICO (UK) and
            process EU data in accordance with standard contractual clauses (SCCs) where required.
          </p>
        </section>

        <section aria-labelledby="pp-collected">
          <h2 id="pp-collected" className="text-lg font-semibold text-text-primary mb-3">2. Data we collect and why</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">Data categories, purposes, and legal bases</caption>
              <thead>
                <tr className="border-b border-border-default">
                  <th scope="col" className="text-left py-2 pr-4 font-semibold text-text-primary">Category</th>
                  <th scope="col" className="text-left py-2 pr-4 font-semibold text-text-primary">Examples</th>
                  <th scope="col" className="text-left py-2 font-semibold text-text-primary">Lawful basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                <tr><td className="py-2 pr-4">Account data</td><td className="py-2 pr-4">Name, email address, hashed password</td><td className="py-2">Contract (account creation)</td></tr>
                <tr><td className="py-2 pr-4">Listing data</td><td className="py-2 pr-4">Business name, address, photos, opening hours</td><td className="py-2">Contract (listing management)</td></tr>
                <tr><td className="py-2 pr-4">Order data</td><td className="py-2 pr-4">Delivery address, items, payment intent reference</td><td className="py-2">Contract (order fulfilment)</td></tr>
                <tr><td className="py-2 pr-4">Analytics</td><td className="py-2 pr-4">Pseudonymised daily session bucket (no cookies)</td><td className="py-2">Legitimate interests (product improvement)</td></tr>
                <tr><td className="py-2 pr-4">Reviews</td><td className="py-2 pr-4">Display name, review text, star rating</td><td className="py-2">Consent (voluntary submission)</td></tr>
                <tr><td className="py-2 pr-4">Waitlist</td><td className="py-2 pr-4">Email address</td><td className="py-2">Consent (opt-in)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="pp-retention">
          <h2 id="pp-retention" className="text-lg font-semibold text-text-primary mb-3">3. Retention periods</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Account data: duration of account + 7 years after closure</li>
            <li>Order data: regulatory minimum (currently 6 years under UK tax law)</li>
            <li>Analytics (session buckets): 12 months from collection</li>
            <li>Waitlist: until unsubscribed or listing activates</li>
            <li>Review data: until account deleted</li>
          </ul>
        </section>

        <section aria-labelledby="pp-third-parties">
          <h2 id="pp-third-parties" className="text-lg font-semibold text-text-primary mb-3">4. Third parties</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Supabase</strong> — database and authentication (EU/US data centres; SCCs in place)</li>
            <li><strong>Stripe</strong> — payment processing (PCI DSS Level 1 certified; data processed outside listing content)</li>
            <li><strong>Resend</strong> — transactional email (email addresses only)</li>
            <li><strong>Plausible Analytics</strong> — cookieless, privacy-preserving analytics (only loaded with explicit consent)</li>
            <li><strong>MapTiler</strong> — map tile provider (IP address in tile requests; no personal data stored)</li>
          </ul>
        </section>

        <section aria-labelledby="pp-rights">
          <h2 id="pp-rights" className="text-lg font-semibold text-text-primary mb-3">5. Your rights</h2>
          <p>Under UK GDPR and EU GDPR you have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Erasure (&quot;right to be forgotten&quot;) — subject to legal retention obligations</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Object to processing based on legitimate interests</li>
            <li>Withdraw consent at any time (without affecting prior processing)</li>
          </ul>
          <p className="mt-2">
            To exercise any right, contact{' '}
            <a href="mailto:privacy@farmmap.co.uk" className="underline text-text-link hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">privacy@farmmap.co.uk</a>.
            We will respond within one calendar month.
          </p>
        </section>

        <section aria-labelledby="pp-supervisory">
          <h2 id="pp-supervisory" className="text-lg font-semibold text-text-primary mb-3">6. Supervisory authorities</h2>
          <p>
            UK users may lodge a complaint with the{' '}
            <a href="https://ico.org.uk" rel="noopener noreferrer" target="_blank" className="underline text-text-link hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Information Commissioner&apos;s Office (ICO)</a>.
            ROI users may lodge a complaint with the{' '}
            <a href="https://www.dataprotection.ie" rel="noopener noreferrer" target="_blank" className="underline text-text-link hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">Data Protection Commission (DPC)</a>.
          </p>
        </section>

        <section aria-labelledby="pp-cookies">
          <h2 id="pp-cookies" className="text-lg font-semibold text-text-primary mb-3">7. Cookies</h2>
          <p>
            We use a minimal number of cookies. See our{' '}
            <Link href="/privacy/cookies" className="underline text-text-link hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
              Cookie Policy
            </Link>{' '}
            for full details.
          </p>
        </section>
      </div>
    </div>
  )
}
