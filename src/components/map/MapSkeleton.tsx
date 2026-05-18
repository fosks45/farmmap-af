/**
 * Map loading skeleton.
 * Shown while MapLibre initialises and the GeoJSON loads.
 * Uses the map background colour token so it blends with the expected map tile colour.
 */
export function MapSkeleton() {
  return (
    <div
      className="w-full h-full bg-surface-map flex items-center justify-center"
      aria-label="Map loading"
      role="status"
    >
      <div className="text-center">
        <div
          className="w-10 h-10 rounded-full border-4 border-border-default border-t-brand-primary
                     animate-spin mx-auto mb-3"
          aria-hidden="true"
        />
        <p className="text-text-secondary text-sm">Loading map…</p>
      </div>
    </div>
  )
}
