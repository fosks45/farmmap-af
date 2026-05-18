'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import type { ListingPhoto } from '@/lib/types'

/**
 * PhotoGallery — accessible photo gallery.
 * Navigation arrows are keyboard accessible with WCAG 2.1.1.
 * Images have meaningful alt text. Lazy loading via Next/Image.
 */

interface PhotoGalleryProps {
  photos: ListingPhoto[]
  listingName: string
}

export function PhotoGallery({ photos, listingName }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const approved = photos.filter((p) => p.moderation_status === 'approved')

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, approved.length - 1)))
  }, [approved.length])

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [goPrev, goNext])

  if (approved.length === 0) return null

  const current = approved[currentIndex]

  return (
    <div
      role="region"
      aria-label={`Photos of ${listingName}`}
      className="relative rounded-xl overflow-hidden bg-surface-raised"
    >
      {/* Main image */}
      <div className="relative aspect-[16/9]">
        <Image
          key={current.id}
          src={current.public_url}
          alt={current.alt_text || `${listingName} — photo ${currentIndex + 1} of ${approved.length}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority={currentIndex === 0}
          loading={currentIndex === 0 ? 'eager' : 'lazy'}
        />
      </div>

      {/* Navigation arrows */}
      {approved.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Previous photo"
            className="
              absolute left-2 top-1/2 -translate-y-1/2
              w-10 h-10 rounded-full bg-black/50 text-white
              flex items-center justify-center
              hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-white
              transition-all min-w-[44px] min-h-[44px]
            "
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex === approved.length - 1}
            aria-label="Next photo"
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              w-10 h-10 rounded-full bg-black/50 text-white
              flex items-center justify-center
              hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-white
              transition-all min-w-[44px] min-h-[44px]
            "
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Counter */}
      {approved.length > 1 && (
        <div
          className="absolute bottom-2 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full"
          aria-live="polite"
          aria-atomic="true"
        >
          {currentIndex + 1} / {approved.length}
        </div>
      )}

      {/* Thumbnail strip */}
      {approved.length > 1 && (
        <div
          className="flex gap-2 p-2 bg-surface-raised overflow-x-auto"
          role="list"
          aria-label="Photo thumbnails"
        >
          {approved.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              role="listitem"
              onClick={() => goTo(i)}
              aria-label={`View photo ${i + 1}`}
              aria-pressed={i === currentIndex}
              className={`
                flex-shrink-0 relative w-14 h-14 rounded-md overflow-hidden
                border-2 transition-all
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus
                ${i === currentIndex ? 'border-brand-primary' : 'border-transparent hover:border-border-strong'}
              `}
            >
              <Image
                src={photo.public_url}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
