import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { MapSkeleton } from '@/components/map/MapSkeleton'

export const metadata: Metadata = {
  title: 'Farm Shops & Honesty Boxes Map — Farmmap',
  description:
    'Explore an interactive map of farm shops, honesty boxes, farm gate stalls, and roadside stands across the UK and Ireland.',
  alternates: {
    canonical: 'https://farmmap.co.uk/map',
  },
}

/**
 * Map page — full-screen interactive map with overlay filters.
 * MapLibre is browser-only, so FarmmapMap must be dynamically imported with ssr: false.
 */
const FarmmapMap = dynamic(() => import('@/components/map/FarmmapMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

export default function MapPage() {
  return (
    <div className="relative h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] overflow-hidden">
      <Suspense fallback={<MapSkeleton />}>
        <FarmmapMap />
      </Suspense>

      {/* Screen-reader accessible alternative */}
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
