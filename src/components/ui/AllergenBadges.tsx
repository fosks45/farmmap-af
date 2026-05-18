import { ALLERGEN_LABELS, type Allergen } from '@/lib/tokens'

/**
 * AllergenBadges — displays allergen pills with distinct icon + text name.
 * Distinguishes "contains" vs "may contain" (WCAG 1.4.1 — not colour alone).
 */

interface AllergenBadgesProps {
  contains: Allergen[]
  mayContain?: string | null
}

function AllergenIcon({ allergen }: { allergen: Allergen }) {
  // Simple letter-based icon as fallback; icon is decorative (label carries meaning).
  const initial = ALLERGEN_LABELS[allergen].charAt(0)
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center w-4 h-4 rounded-full
                 bg-current opacity-20 text-[8px] font-bold leading-none"
    >
      {initial}
    </span>
  )
}

export function AllergenBadges({ contains, mayContain }: AllergenBadgesProps) {
  if (!contains.length && !mayContain) return null

  return (
    <div className="space-y-2">
      {contains.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-status-error-text mb-1.5">Contains</p>
          <div className="flex flex-wrap gap-1.5">
            {contains.map((allergen) => (
              <span
                key={allergen}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                           bg-status-error-light text-status-error-text text-xs font-medium
                           border border-status-error"
              >
                <AllergenIcon allergen={allergen} />
                {ALLERGEN_LABELS[allergen]}
              </span>
            ))}
          </div>
        </div>
      )}

      {mayContain && (
        <div>
          <p className="text-xs font-semibold text-status-warning-text mb-1.5">May contain</p>
          <p className="text-xs text-text-secondary bg-status-warning-light rounded-md px-3 py-1.5 border border-status-warning">
            {mayContain}
          </p>
        </div>
      )}
    </div>
  )
}
