'use client'

import { useId } from 'react'
import { MapPin, Navigation, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { listingTypeConfig, type ListingType } from '@/lib/tokens'

interface MapFilter {
  listingType: ListingType | 'all'
  productCategory: string | 'all'
}

interface MapFiltersProps {
  filters: MapFilter
  onChange: (filters: MapFilter) => void
  onNearMe: () => void
  isLocating: boolean
}

const LISTING_TYPE_OPTIONS = [
  { value: 'all', label: 'All types' },
  ...Object.entries(listingTypeConfig).map(([key, cfg]) => ({
    value: key as ListingType,
    label: cfg.label,
  })),
]

export function MapFilters({ filters, onChange, onNearMe, isLocating }: MapFiltersProps) {
  const typeId = useId()

  return (
    // Positioned top-left on desktop, top on mobile
    <div
      className={cn(
        'absolute top-4 left-4 z-[200]',
        'flex flex-col gap-2 sm:flex-row sm:items-center',
      )}
      role="group"
      aria-label="Map filters"
    >
      {/* Listing type filter */}
      <div className="flex items-center gap-2 bg-surface-default rounded-lg shadow-md px-3 py-2">
        <label
          htmlFor={typeId}
          className="text-sm font-medium text-text-secondary whitespace-nowrap flex items-center gap-1"
        >
          <MapPin size={14} aria-hidden="true" />
          <span>Type</span>
        </label>
        <select
          id={typeId}
          value={filters.listingType}
          onChange={(e) =>
            onChange({ ...filters, listingType: e.target.value as ListingType | 'all' })
          }
          className={cn(
            'text-sm bg-transparent border-none outline-none cursor-pointer',
            'text-text-primary font-medium min-h-[44px] pr-2',
            'focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:rounded',
          )}
        >
          {LISTING_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Near Me button */}
      <button
        type="button"
        onClick={onNearMe}
        disabled={isLocating}
        aria-label={isLocating ? 'Finding your location…' : 'Find listings near my location'}
        aria-busy={isLocating}
        className={cn(
          'flex items-center gap-2 bg-brand-primary text-text-inverse',
          'rounded-lg shadow-md px-4 py-2 text-sm font-semibold',
          'min-h-[44px] min-w-[44px]',
          'hover:bg-brand-primary-hover transition-colors duration-fast',
          'focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2',
          'disabled:opacity-60 disabled:cursor-not-allowed',
        )}
      >
        {isLocating ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Navigation size={16} aria-hidden="true" />
        )}
        <span>{isLocating ? 'Locating…' : 'Near me'}</span>
      </button>
    </div>
  )
}
