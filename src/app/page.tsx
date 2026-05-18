import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { MapSkeleton } from '@/components/map/MapSkeleton'

export const metadata: Metadata = {
  title: 'Farmmap — Find farm shops and honesty boxes near you',
  description:
    'Browse the UK and Ireland\'s most complete directory of farm shops, honesty boxes, farm gate stalls and roadside stands. Find fresh local produce near you.',
  alternates: {
    canonical: 'https://farmmap.co.uk/',
  },
}

/**
 * FarmmapMap MUST be dynamically imported with ssr: false.
 * MapLibre GL JS uses browser APIs (canvas, WebGL) that do not exist in Node.
 */
const FarmmapMap = dynamic(() => import('@/components/map/FarmmapMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

/**
 * Homepage — the primary map interface.
 * This is a React Server Component; the map itself is client-only.
 * The page renders as server HTML with just the skeleton;
 * MapLibre loads client-side after hydration.
 */
export default function HomePage() {
  return (
    // Full-viewport map — no scrolling on the map page
    <div className="relative h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] overflow-hidden">
      <Suspense fallback={<MapSkeleton />}>
        <FarmmapMap />
      </Suspense>

      {/* Screen-reader-accessible listing list alternative to map */}
      {/* Hidden visually; accessible to keyboard and SR users */}
      <a
        href="#sr-listing-list"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                   focus:z-[700] focus:bg-brand-primary focus:text-text-inverse
                   focus:px-4 focus:py-2 focus:rounded-md focus:no-underline"
      >
        View listings as a list (keyboard / screen reader)
      </a>
    </div>
  )
}
