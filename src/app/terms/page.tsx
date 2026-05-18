import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — Farmmap',
  description: 'Terms of service for Farmmap. Covers acceptable use, listing standards, subscription terms, and allergen liability.',
  alternates: { canonical: 'https://farmmap.co.uk/terms' },
}

const LAST_UPDATED = '15 May 2026'
const VERSION = '1.0'

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Terms of Service</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">
        Version {VERSION} — Last updated {LAST_UPDATED}
      </p>

      <div className="prose max-w-none space-y-8 text-[var(--color-text-primary)]">

        <section>
          <h2 className="text-xl font-semibold mb-3">1. About these terms</h2>
          <p>
            These Terms of Service govern your use of Farmmap (<strong>farmmap.co.uk</strong>), operated by
            LearningStor Ltd. By using Farmmap, you agree to these terms. If you do not agree, please stop
            using the service.
          </p>
          <p className="mt-2">
            These terms are governed by the laws of England and Wales for users in the United Kingdom, and
            by Irish law for users resident in the Republic of Ireland.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Who can use Farmmap</h2>
          <p>
            Farmmap is open to consumers browsing the directory (no account required) and to farm shop and
            honesty box operators who wish to claim and manage their listing. You must be 18 or over to
            create an account or claim a listing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Acceptable use</h2>
          <p>You must not use Farmmap to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Submit false, misleading, or fraudulent listing information</li>
            <li>Claim a listing you do not own or have authority to manage</li>
            <li>Post reviews that are fabricated, incentivised, or defamatory</li>
            <li>Scrape, reproduce, or redistribute listing data without our written consent</li>
            <li>Circumvent any security or access control measures</li>
            <li>Use the platform for any unlawful purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Listing content standards</h2>
          <p>
            If you claim a listing, you are responsible for ensuring that all information you provide is
            accurate, current, and not misleading. This includes opening hours, product descriptions,
            prices, and contact details.
          </p>
          <p className="mt-2">
            Product photos must be your own or licensed for use. We may remove photos that violate these
            standards without notice.
          </p>
          <p className="mt-2">
            Reviews submitted by consumers must reflect genuine visits and honest opinions. We moderate all
            reviews before they appear publicly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Subscriptions</h2>

          <h3 className="text-lg font-medium mt-4 mb-2">Pricing</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Free</strong> — Map pin listing, free to claim</li>
            <li><strong>Bronze</strong> — £20.00 per month (inc. VAT)</li>
            <li><strong>Silver</strong> — £60.00 per month (inc. VAT) + 3% commission on orders of £20 or more</li>
            <li><strong>Gold</strong> — £100.00 per month (inc. VAT) + 5% commission on orders of £30 or more (eligibility: 3 months on Silver + 50 completed orders)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">14-day cancellation right</h3>
          <p>
            Under the Consumer Contracts Regulations 2013, you have a right to cancel a new subscription
            within 14 days of purchase for a full refund. To exercise this right, contact us at{' '}
            <a href="mailto:hello@farmmap.co.uk" className="text-[var(--color-brand-primary)] underline">
              hello@farmmap.co.uk
            </a>{' '}
            within 14 days of your subscription start date.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">Auto-renewal</h3>
          <p>
            Subscriptions renew automatically each month. You will receive an email reminder before each
            renewal. You can cancel at any time from your subscription dashboard; cancellation takes effect
            at the end of your current billing period.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">Downgrades</h3>
          <p>
            If you downgrade from a higher tier to a lower tier, the change takes effect at the end of
            your current billing period. You retain access to your current tier's features until that date.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">How to cancel</h3>
          <p>
            Go to your listing's subscription dashboard and click "Cancel subscription". You can also email
            us at{' '}
            <a href="mailto:hello@farmmap.co.uk" className="text-[var(--color-brand-primary)] underline">
              hello@farmmap.co.uk
            </a>.
            Cancellation is straightforward — we do not use confusing cancellation flows.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Marketplace orders (Silver and Gold)</h2>
          <p>
            When you enable online ordering (Silver or Gold tier), you become the merchant of record for
            all sales made through your Farmmap listing. Farmmap acts as a technology platform and is not
            a party to any sale between you and your customers.
          </p>
          <p className="mt-2">
            You are responsible for fulfilling orders accurately and on time. Farmmap's commission is
            deducted automatically and reversed in full on complete order cancellations.
          </p>
          <p className="mt-2">
            <strong>Auto-cancellation:</strong> orders not accepted within 24 hours are automatically
            cancelled and fully refunded to the customer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Allergen information — important notice</h2>
          <div className="bg-[var(--color-status-warning-subtle,#fffbeb)] border border-[var(--color-status-warning,#d97706)] rounded-md p-4">
            <p className="font-medium">
              Farmmap is a technology platform. We are not a food business operator.
            </p>
            <p className="mt-2">
              Allergen information displayed on Farmmap listing pages is provided by the farm shop or
              producer, not by Farmmap. While we require allergen declarations for all purchasable products
              (in compliance with the UK Food Information Regulations 2014 / Natasha's Law), we cannot
              verify the accuracy of allergen information provided by third-party operators.
            </p>
            <p className="mt-2">
              If you have a food allergy or intolerance, please contact the farm shop directly before
              purchasing to confirm allergen information. Do not rely solely on the information displayed
              on Farmmap.
            </p>
          </div>
          <p className="mt-3">
            Farm shops are responsible for ensuring that the allergen information they provide on Farmmap
            is accurate and up to date. Farmmap accepts no liability for allergic reactions or other harm
            resulting from inaccurate allergen information submitted by a listing owner.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Intellectual property</h2>
          <p>
            The Farmmap platform, brand, and directory database are owned by LearningStor Ltd. Listing
            data contributed by farm shop owners remains the property of those owners. By contributing
            content to Farmmap, you grant us a licence to display and distribute that content as part of
            the Farmmap service.
          </p>
          <p className="mt-2">
            Map data is provided by OpenStreetMap contributors under the Open Database Licence (ODbL).
            Honesty box seed data was provided with the permission of yourhonestybox.com.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Limitation of liability</h2>
          <p>
            Farmmap provides the directory and marketplace as a platform. We do not warrant that listing
            information is accurate or that farm shops are currently trading. We are not liable for any
            loss or damage arising from reliance on listing information, wasted journeys, or transactions
            between buyers and sellers.
          </p>
          <p className="mt-2">
            Nothing in these terms limits liability for death or personal injury caused by our negligence,
            or for fraud or fraudulent misrepresentation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Dispute resolution</h2>
          <p>
            If you have a complaint, please contact us first at{' '}
            <a href="mailto:hello@farmmap.co.uk" className="text-[var(--color-brand-primary)] underline">
              hello@farmmap.co.uk
            </a>.
            We aim to resolve complaints within 5 working days.
          </p>
          <p className="mt-2">
            For UK users, disputes are subject to the jurisdiction of the courts of England and Wales.
            For users in the Republic of Ireland, disputes are subject to Irish law and the jurisdiction
            of the Irish courts.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">11. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. We will notify active subscribers by email at
            least 30 days before any material change takes effect. Continued use of Farmmap after the
            effective date constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact us</h2>
          <p>
            LearningStor Ltd<br />
            <a href="mailto:hello@farmmap.co.uk" className="text-[var(--color-brand-primary)] underline">
              hello@farmmap.co.uk
            </a>
          </p>
        </section>

        <div className="border-t border-[var(--color-border-subtle)] pt-6 mt-8">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Version {VERSION} — Last updated {LAST_UPDATED}
          </p>
          <div className="flex gap-4 mt-2 text-sm">
            <Link href="/privacy" className="text-[var(--color-brand-primary)] underline">Privacy Policy</Link>
            <Link href="/privacy/cookies" className="text-[var(--color-brand-primary)] underline">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
