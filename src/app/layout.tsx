import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import { SkipLink } from '@/components/ui/SkipLink'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://farmmap.co.uk'),
  title: {
    default: 'Farmmap — Find farm shops and honesty boxes near you',
    template: '%s — Farmmap',
  },
  description:
    'Browse the UK and Ireland\'s most complete directory of farm shops, honesty boxes, farm gate stalls and roadside stands. Find fresh local produce near you.',
  keywords: [
    'farm shop',
    'honesty box',
    'local produce',
    'farm gate stall',
    'UK farm shops',
    'farm shop near me',
  ],
  authors: [{ name: 'Farmmap' }],
  creator: 'Farmmap',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://farmmap.co.uk',
    siteName: 'Farmmap',
    title: 'Farmmap — Find farm shops and honesty boxes near you',
    description:
      'Browse the UK and Ireland\'s most complete directory of farm shops, honesty boxes, farm gate stalls and roadside stands.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farmmap — Find farm shops and honesty boxes near you',
    description:
      'Browse the UK and Ireland\'s most complete directory of farm shops, honesty boxes, and farm gate stalls.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // allow user zoom for accessibility
  themeColor: '#2D6A4F',
}

/**
 * Root layout.
 * Sets html lang based on directory (en-GB default, en-IE for ROI visitors).
 * SkipLink is the first focusable element — WCAG 2.4.1.
 * CookieBanner handles PECR consent before analytics load.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const directoryId = parseInt(headersList.get('x-directory-id') ?? '1', 10)

  // Directory 1 = Farmmap (en-GB), ROI-specific lang set in page-level metadata
  // For now we default to en-GB; the middleware can enhance this with geo-detection
  const lang = directoryId === 1 ? 'en-GB' : 'en-GB'

  return (
    <html lang={lang} className="h-full">
      <head>
        {/* Preconnect to critical third-party origins for performance */}
        <link rel="preconnect" href="https://api.maptiler.com" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} />
        <link rel="dns-prefetch" href="https://js.stripe.com" />

        {/* Plausible analytics — loaded conditionally after consent in CookieBanner */}
        {/* Scripts are injected by CookieBanner component after consent is given */}
      </head>
      <body className="min-h-full flex flex-col bg-surface-default text-text-primary">
        {/* Skip link — first interactive element; WCAG 2.4.1 */}
        <SkipLink />

        {/* Site navigation */}
        <SiteNav />

        {/* Main content area */}
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>

        {/* Site footer */}
        <SiteFooter />

        {/* Cookie consent banner (PECR-compliant) */}
        {/* Rendered last so it overlays above footer but below nothing else */}
        <CookieBanner />
      </body>
    </html>
  )
}
