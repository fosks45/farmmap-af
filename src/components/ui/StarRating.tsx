/**
 * StarRating — display and input variants.
 * Display: visual stars + aria-label for screen readers (WCAG 1.4.1 — not colour alone).
 * Input: <fieldset> + <legend> + radio buttons labelled "1 star" through "5 stars" (WCAG 1.3.1, 4.1.2).
 */

interface StarRatingDisplayProps {
  rating: number
  maxRating?: number
  showNumber?: boolean
  size?: 'sm' | 'md' | 'lg'
}

function StarIcon({ filled, size }: { filled: boolean; size: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      className={`${sizeClass} ${filled ? 'text-amber-500' : 'text-border-strong'}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  )
}

/**
 * Display-only star rating. Communicates value via aria-label, not colour alone.
 */
export function StarRatingDisplay({
  rating,
  maxRating = 5,
  showNumber = false,
  size = 'md',
}: StarRatingDisplayProps) {
  const rounded = Math.round(rating * 2) / 2 // round to nearest 0.5

  return (
    <span
      aria-label={`${rating.toFixed(1)} out of ${maxRating} stars`}
      className="inline-flex items-center gap-0.5"
    >
      {Array.from({ length: maxRating }).map((_, i) => (
        <StarIcon key={i} filled={i < rounded} size={size} />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm text-text-secondary" aria-hidden="true">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  )
}

interface StarRatingInputProps {
  name: string
  legend: string
  value: number
  onChange: (value: number) => void
  required?: boolean
  error?: string
}

/**
 * Input star rating. Uses radio buttons for full keyboard and screen reader support.
 * Labelled options: "1 star", "2 stars", …, "5 stars".
 */
export function StarRatingInput({
  name,
  legend,
  value,
  onChange,
  required = false,
  error,
}: StarRatingInputProps) {
  const labels = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars']

  return (
    <fieldset>
      <legend className="text-sm font-medium text-text-primary mb-2">
        {legend}
        {required && <span aria-hidden="true" className="ml-1 text-status-error">*</span>}
      </legend>

      <div className="flex gap-1" role="group">
        {labels.map((label, i) => {
          const starValue = i + 1
          return (
            <label key={starValue} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={starValue}
                checked={value === starValue}
                required={required && i === 0}
                onChange={() => onChange(starValue)}
                className="sr-only"
                aria-label={label}
              />
              <span
                aria-hidden="true"
                className={`block transition-colors ${
                  starValue <= value ? 'text-amber-500' : 'text-border-strong hover:text-amber-300'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={starValue <= value ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </span>
            </label>
          )
        })}
      </div>

      {error && (
        <p role="alert" className="mt-1 text-xs text-status-error-text">
          {error}
        </p>
      )}
    </fieldset>
  )
}
