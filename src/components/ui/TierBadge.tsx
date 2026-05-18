import type { SubscriptionTier } from '@/lib/tokens'

/**
 * TierBadge — renders Bronze/Silver/Gold/Claimed/Free as a badge.
 * Each tier has BOTH a distinct colour AND a distinct icon/label (WCAG 1.4.1).
 */

interface TierBadgeProps {
  tier: SubscriptionTier
  size?: 'sm' | 'md'
}

// CSS class maps use Tailwind tokens; no hex literals here.
const TIER_STYLES: Record<SubscriptionTier, { bg: string; text: string; border: string }> = {
  free: {
    bg: 'bg-surface-raised',
    text: 'text-text-secondary',
    border: 'border-border-default',
  },
  claimed: {
    bg: 'bg-brand-primary-light',
    text: 'text-brand-primary',
    border: 'border-brand-primary-light',
  },
  bronze: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  silver: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  gold: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
}

// Distinct icons per tier — ensures information is not conveyed by colour alone (WCAG 1.4.1).
function TierIcon({ tier }: { tier: SubscriptionTier }) {
  switch (tier) {
    case 'gold':
      return (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M8 1.5a.75.75 0 01.6.3L11.25 5.5h3a.75.75 0 01.6 1.2l-2.25 3 .9 3.6a.75.75 0 01-1.05.87L8 12.25l-4.45 1.92a.75.75 0 01-1.05-.87l.9-3.6-2.25-3A.75.75 0 011.75 5.5h3L7.4 1.8a.75.75 0 01.6-.3z"/>
        </svg>
      )
    case 'silver':
      return (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M8 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 018 1zm4.243 2.757a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.06a.75.75 0 011.061 0zM15 8a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0115 8zm-2.757 4.243a.75.75 0 01-1.06 0l-1.061-1.06a.75.75 0 011.06-1.061l1.06 1.06a.75.75 0 010 1.061zM8 15a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 018 15zm-4.243-2.757a.75.75 0 010-1.06l1.06-1.061a.75.75 0 011.061 1.06l-1.06 1.06a.75.75 0 01-1.061 0zM1 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 011 8zm2.757-4.243a.75.75 0 011.06 0l1.061 1.06A.75.75 0 114.818 5.88L3.757 4.818a.75.75 0 010-1.061z" clipRule="evenodd"/>
        </svg>
      )
    case 'bronze':
      return (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M8 14A6 6 0 108 2a6 6 0 000 12zm0-1.5A4.5 4.5 0 118 3.5a4.5 4.5 0 010 9zM8 5a1 1 0 100 2 1 1 0 000-2zm-1 4a1 1 0 112 0v2a1 1 0 11-2 0V9z"/>
        </svg>
      )
    case 'claimed':
      return (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd"/>
        </svg>
      )
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M8 1.75a.75.75 0 01.692.462l1.41 3.393 3.664.293a.75.75 0 01.428 1.317l-2.791 2.39.853 3.595a.75.75 0 01-1.12.814L8 11.273l-3.135 2.74a.75.75 0 01-1.12-.814l.852-3.595L1.806 7.215a.75.75 0 01.428-1.317l3.664-.293L7.308 2.212A.75.75 0 018 1.75z" clipRule="evenodd"/>
        </svg>
      )
  }
}

const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Free',
  claimed: 'Claimed',
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
}

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const styles = TIER_STYLES[tier]
  const label = TIER_LABELS[tier]
  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-xs gap-1' : 'px-2 py-1 text-xs gap-1.5'

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${styles.bg} ${styles.text} ${styles.border} ${sizeClass}
      `}
      aria-label={`${label} tier`}
    >
      <TierIcon tier={tier} />
      {label}
    </span>
  )
}
