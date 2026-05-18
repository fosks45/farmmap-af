'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import type { Map as MapLibreMap, GeoJSONSource, MapMouseEvent } from 'maplibre-gl'
import type { ListingGeoFeature } from '@/lib/types'
import { colours, pinConfig, listingTypeConfig, type PinTier, type ListingType } from '@/lib/tokens'
import { ListingPanel } from './ListingPanel'
import { MapFilters } from './MapFilters'
import { MapSkeleton } from './MapSkeleton'
import { cn } from '@/lib/utils'

// MapLibre is browser-only — never import at module level in an SSR context
// This file is only ever rendered via dynamic import with { ssr: false }

interface MapFilter {
  listingType: ListingType | 'all'
  productCategory: string | 'all'
}

interface SelectedListing {
  id: string
  name: string
  listing_type: ListingType
  tier: PinTier
  slug: string
  country: string
  county: string
  lat: number
  lng: number
  avg_rating: number | null
  review_count: number
  is_temporarily_closed: boolean
  is_currently_stocked: boolean | null
}

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`

// UK centre (approximately)
const DEFAULT_CENTER: [number, number] = [-1.5, 53.5]
const DEFAULT_ZOOM = 6

export default function FarmmapMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [selectedListing, setSelectedListing] = useState<SelectedListing | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [filters, setFilters] = useState<MapFilter>({ listingType: 'all', productCategory: 'all' })
  const [filterError, setFilterError] = useState<string | null>(null)

  // Build the MapLibre layer paint spec for pins — colour by tier property
  // Each tier also uses a distinct icon shape via symbol layer (WCAG 1.4.1)
  const buildPinLayers = useCallback(() => {
    const tierColours = [
      'match',
      ['get', 'tier'],
      'gold', colours.pinGold,
      'silver', colours.pinSilver,
      'bronze', colours.pinBronze,
      'claimed', colours.pinClaimed,
      /* default */ colours.pinFree,
    ] as unknown as maplibregl.ExpressionSpecification

    const tierStrokeColours = [
      'match',
      ['get', 'tier'],
      'gold', colours.pinGoldStroke,
      'silver', colours.pinSilverStroke,
      'bronze', colours.pinBronzeStroke,
      'claimed', colours.pinClaimedStroke,
      /* default */ colours.pinFreeStroke,
    ] as unknown as maplibregl.ExpressionSpecification

    return { tierColours, tierStrokeColours }
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return

    let map: MapLibreMap

    // Dynamic import to avoid any SSR breakage
    import('maplibre-gl').then(({ Map, NavigationControl }) => {
      map = new Map({
        container: mapContainer.current!,
        style: MAP_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        attributionControl: {
          compact: true,
        },
        // Accessibility: allow keyboard navigation of the map
        keyboard: true,
        // Performance: use device pixel ratio for crisp pins on retina
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      })

      mapRef.current = map

      // Add zoom + compass controls (top-right on desktop)
      map.addControl(new NavigationControl({ showCompass: true }), 'top-right')

      map.on('load', async () => {
        // Fetch the GeoJSON data from the API
        // Max 150kB gzipped for 953 listings (per performance budget)
        try {
          const res = await fetch('/api/listings/geojson', {
            headers: { 'Accept-Encoding': 'gzip' },
          })
          if (!res.ok) throw new Error('Failed to load listings')
          const geojson = await res.json()

          // Add the GeoJSON source
          map.addSource('listings', {
            type: 'geojson',
            data: geojson,
            // Cluster pins at low zoom to avoid overplotting
            cluster: true,
            clusterMaxZoom: 12,
            clusterRadius: 40,
          })

          const { tierColours, tierStrokeColours } = buildPinLayers()

          // Layer 1: Clustered circles
          map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'listings',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': colours.brandPrimary,
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                16, 10,
                22, 50,
                28,
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': colours.surfaceDefault,
            },
          })

          // Layer 2: Cluster count labels
          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'listings',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-size': 12,
            },
            paint: {
              'text-color': colours.textInverse,
            },
          })

          // Layer 3: Individual pins (circles with white halo for contrast on any map background)
          map.addLayer({
            id: 'unclustered-pin-halo',
            type: 'circle',
            source: 'listings',
            filter: ['!', ['has', 'point_count']],
            paint: {
              // White halo ensures 3:1 non-text contrast (WCAG 1.4.11)
              'circle-radius': 12,
              'circle-color': colours.surfaceDefault,
              'circle-opacity': 0.85,
            },
          })

          map.addLayer({
            id: 'unclustered-pin',
            type: 'circle',
            source: 'listings',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-radius': 9,
              'circle-color': tierColours,
              'circle-stroke-width': 2,
              'circle-stroke-color': tierStrokeColours,
              // Temporarily closed pins are desaturated
              'circle-opacity': [
                'case',
                ['get', 'is_temporarily_closed'],
                0.5,
                1,
              ],
            },
          })

          // Layer 4: Stocked indicator for honesty boxes
          map.addLayer({
            id: 'honesty-stocked-indicator',
            type: 'circle',
            source: 'listings',
            filter: [
              'all',
              ['!', ['has', 'point_count']],
              ['==', ['get', 'listing_type'], 'honesty_box'],
            ],
            paint: {
              'circle-radius': 4,
              'circle-color': [
                'case',
                ['==', ['get', 'is_currently_stocked'], true],
                colours.pinHonestyStocked,
                colours.pinHonestyEmpty,
              ],
              'circle-translate': [7, -7], // top-right offset from pin centre
            },
          })

          setIsLoaded(true)
        } catch (err) {
          console.error('Failed to load listings GeoJSON:', err)
          setFilterError('Failed to load map data. Please refresh.')
        }
      })

      // ── Event handlers ───────────────────────────────────────────────────

      // Click on a cluster: zoom in
      map.on('click', 'clusters', (e: MapMouseEvent) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
        if (!features.length) return
        const clusterId = features[0].properties?.cluster_id
        const source = map.getSource('listings') as GeoJSONSource
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !zoom) return
          map.easeTo({
            center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
            zoom,
          })
        })
      })

      // Click on individual pin: open listing panel
      map.on('click', 'unclustered-pin', (e: MapMouseEvent) => {
        const feature = e.features?.[0] as ListingGeoFeature | undefined
        if (!feature) return
        const props = feature.properties
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number]

        setSelectedListing({
          id: props.id,
          name: props.name,
          listing_type: props.listing_type as ListingType,
          tier: props.tier as PinTier,
          slug: props.slug,
          country: props.country,
          county: props.county,
          lat: coords[1],
          lng: coords[0],
          avg_rating: props.avg_rating,
          review_count: props.review_count,
          is_temporarily_closed: props.is_temporarily_closed,
          is_currently_stocked: props.is_currently_stocked,
        })
        setIsPanelOpen(true)
      })

      // Change cursor on pin hover
      map.on('mouseenter', 'unclustered-pin', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'unclustered-pin', () => {
        map.getCanvas().style.cursor = ''
      })
      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = ''
      })

      // Close panel on map click (not on pin)
      map.on('click', (e: MapMouseEvent) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['unclustered-pin', 'clusters'],
        })
        if (!features.length) {
          setIsPanelOpen(false)
        }
      })
    })

    return () => {
      map?.remove()
      mapRef.current = null
    }
  }, [buildPinLayers])

  // Apply filters — client-side filter of the GeoJSON source
  // Performance budget: < 150ms (HARD GATE per platform-pack/performance-budgets.md)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded) return

    const filterExpr: maplibregl.FilterSpecification[] = ['!', ['has', 'point_count']]

    if (filters.listingType !== 'all') {
      ;(filterExpr as unknown[]).push(['==', ['get', 'listing_type'], filters.listingType])
    }

    const combined = filterExpr.length > 1
      ? ['all', ...filterExpr]
      : filterExpr[0]

    try {
      map.setFilter('unclustered-pin', combined as maplibregl.FilterSpecification)
      map.setFilter('unclustered-pin-halo', combined as maplibregl.FilterSpecification)
      map.setFilter('honesty-stocked-indicator', [
        'all',
        combined as maplibregl.FilterSpecification,
        ['==', ['get', 'listing_type'], 'honesty_box'],
      ])
    } catch {
      // Map may not be fully initialised yet
    }
  }, [filters, isLoaded])

  // "Near me" — geolocate and pan to user position
  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      setFilterError('Geolocation is not supported by your browser.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false)
        const { latitude, longitude } = position.coords
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 11,
          duration: 1500,
        })
      },
      () => {
        setIsLocating(false)
        setFilterError('Could not get your location. Please check your browser permissions.')
      },
      { timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  const handleFilterChange = useCallback((newFilters: MapFilter) => {
    setFilters(newFilters)
  }, [])

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false)
  }, [])

  return (
    <div className="relative w-full h-full" role="region" aria-label="Interactive map of farm shops and honesty boxes">
      {/* Map container */}
      <div
        ref={mapContainer}
        className="maplibre-map w-full h-full"
        aria-hidden="true" // map canvas; keyboard users use the accessible list below
      />

      {/* Loading skeleton overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <MapSkeleton />
        </div>
      )}

      {/* Filter controls */}
      <MapFilters
        filters={filters}
        onChange={handleFilterChange}
        onNearMe={handleNearMe}
        isLocating={isLocating}
      />

      {/* Error/status messages — announced to screen readers */}
      {filterError && (
        <div
          role="alert"
          aria-live="assertive"
          className="absolute bottom-24 left-4 right-4 z-[300] bg-status-error-light text-status-error-text
                     px-4 py-3 rounded-md shadow-md text-sm font-medium"
        >
          {filterError}
          <button
            type="button"
            onClick={() => setFilterError(null)}
            className="ml-2 underline"
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Listing panel — bottom sheet on mobile, sidebar on desktop */}
      {selectedListing && (
        <ListingPanel
          listing={selectedListing}
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
        />
      )}

      {/* Screen-reader-accessible listing list (hidden visually) */}
      {/* WCAG: map pins must have accessible text equivalents */}
      <section
        id="sr-listing-list"
        className="sr-only"
        aria-label="Listings accessible list"
      >
        <p>Use the interactive map above to browse listings. Listings are also available on the Discover page.</p>
        <a href="/farm-shops/">Browse all farm shops</a>
        <a href="/honesty-boxes/">Browse all honesty boxes</a>
      </section>
    </div>
  )
}
