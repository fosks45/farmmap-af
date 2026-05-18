import { GOLD_ELIGIBILITY } from '@/lib/tokens'

/**
 * GoldEligibilityGate — shows progress toward Gold tier eligibility.
 * Progress shown as visual bars + percentage text (WCAG 1.4.1 — not colour alone).
 */

interface GoldEligibilityGateProps {
  silverMonthsCount: number
  completedOrderCount: number
}

function ProgressBar({
  label,
  current,
  max,
}: {
  label: string
  current: number
  max: number
}) {
  const pct = Math.min(Math.round((current / max) * 100), 100)
  const isComplete = current >= max

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-text-primary">{label}</span>
        <span className={`text-sm font-semibold ${isComplete ? 'text-status-success-text' : 'text-text-secondary'}`}>
          {current} / {max}
          {isComplete && ' ✓'}
        </span>
      </div>
      <div
        className="w-full h-3 bg-surface-raised rounded-full overflow-hidden border border-border-default"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}: ${current} of ${max}`}
      >
        <div
          className={`h-full rounded-full transition-all ${isComplete ? 'bg-status-success' : 'bg-brand-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-text-tertiary mt-0.5">{pct}% complete</p>
    </div>
  )
}

export function GoldEligibilityGate({ silverMonthsCount, completedOrderCount }: GoldEligibilityGateProps) {
  const { requiredSilverMonths, requiredCompletedOrders } = GOLD_ELIGIBILITY
  const isEligible = silverMonthsCount >= requiredSilverMonths && completedOrderCount >= requiredCompletedOrders

  return (
    <div className={`rounded-xl border p-5 ${isEligible ? 'border-status-success bg-status-success-light' : 'border-border-default bg-surface-raised'}`}>
      <h3 className="text-base font-semibold text-text-primary mb-1">Gold tier eligibility</h3>
      {isEligible ? (
        <p className="text-sm text-status-success-text font-medium mb-4">
          You are eligible for Gold! Contact us to upgrade.
        </p>
      ) : (
        <p className="text-sm text-text-secondary mb-4">
          Gold tier requires {requiredSilverMonths} months on Silver and {requiredCompletedOrders} completed orders.
        </p>
      )}
      <div className="space-y-4">
        <ProgressBar
          label={`Months on Silver`}
          current={silverMonthsCount}
          max={requiredSilverMonths}
        />
        <ProgressBar
          label="Completed orders"
          current={completedOrderCount}
          max={requiredCompletedOrders}
        />
      </div>
    </div>
  )
}
