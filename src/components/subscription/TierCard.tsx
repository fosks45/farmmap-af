import type { SubscriptionTier } from '@/lib/tokens'
import { TIER_CONFIG } from '@/lib/tokens'
import { TierBadge } from '@/components/ui/TierBadge'

/**
 * TierCard — shows tier details, features list, and CTA.
 * Uses tier tokens for colours. No raw hex values.
 */

interface TierCardProps {
  tier: SubscriptionTier
  isCurrentTier: boolean
  onUpgrade?: () => void
  isUpgrading?: boolean
  disabled?: boolean
}

const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: [
    'Listed on the Farmmap directory',
    'Map pin',
    'Basic listing details',
  ],
  claimed: [
    'Everything in Free',
    'Verify listing ownership',
    'Update listing details',
    'Manage photos',
  ],
  bronze: [
    'Everything in Claimed',
    'Verified badge',
    'Branded listing page',
    'Product catalogue (display)',
    'Analytics dashboard',
    '£20/month',
  ],
  silver: [
    'Everything in Bronze',
    'Online ordering enabled',
    '3% commission on orders over £20',
    '£60/month',
  ],
  gold: [
    'Everything in Silver',
    'Managed marketing support',
    'Higher product limit (1,000)',
    '5% commission on orders over £30',
    '£100/month',
  ],
}

const TIER_STYLES: Record<SubscriptionTier, { headerBg: string; headerText: string }> = {
  free: { headerBg: 'bg-surface-raised', headerText: 'text-text-secondary' },
  claimed: { headerBg: 'bg-brand-primary-light', headerText: 'text-brand-primary' },
  bronze: { headerBg: 'bg-amber-100', headerText: 'text-amber-800' },
  silver: { headerBg: 'bg-blue-100', headerText: 'text-blue-800' },
  gold: { headerBg: 'bg-yellow-100', headerText: 'text-yellow-800' },
}

export function TierCard({ tier, isCurrentTier, onUpgrade, isUpgrading, disabled }: TierCardProps) {
  const config = TIER_CONFIG[tier]
  const features = TIER_FEATURES[tier]
  const styles = TIER_STYLES[tier]

  return (
    <div className={`rounded-xl border-2 overflow-hidden ${isCurrentTier ? 'border-brand-primary' : 'border-border-default'}`}>
      <div className={`p-4 ${styles.headerBg}`}>
        <div className="flex items-center justify-between">
          <TierBadge tier={tier} />
          {isCurrentTier && (
            <span className="text-xs font-semibold text-brand-primary bg-brand-primary-light px-2 py-0.5 rounded-full">
              Current plan
            </span>
          )}
        </div>
        {config.monthlyPrice != null && (
          <p className={`mt-2 text-2xl font-bold ${styles.headerText}`}>
            £{config.monthlyPrice}
            <span className="text-sm font-normal opacity-70">/month</span>
          </p>
        )}
      </div>

      <div className="p-4 bg-surface-elevated">
        <ul className="space-y-2 mb-4">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd"/>
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {!isCurrentTier && onUpgrade && (
          <button
            type="button"
            onClick={onUpgrade}
            disabled={disabled || isUpgrading}
            className="
              w-full py-2.5 px-4 rounded-lg font-medium text-sm
              bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
              transition-colors
            "
          >
            {isUpgrading ? 'Redirecting…' : `Upgrade to ${config.label}`}
          </button>
        )}
      </div>
    </div>
  )
}
