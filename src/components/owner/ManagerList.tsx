'use client'

import { useState } from 'react'
import type { ListingManager, UserProfile } from '@/lib/types'

/**
 * ManagerList — list and manage listing managers.
 * Owner cannot remove themselves.
 * Add manager by email.
 */

type ManagerWithProfile = ListingManager & { user?: UserProfile }

interface ManagerListProps {
  listingSlug: string
  managers: ManagerWithProfile[]
  currentUserId: string
}

export function ManagerList({ listingSlug, managers: initialManagers, currentUserId }: ManagerListProps) {
  const [managers, setManagers] = useState(initialManagers)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)
  const [isInviting, setIsInviting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail) {
      setInviteError('Enter an email address.')
      return
    }
    setInviteError(null)
    setInviteSuccess(null)
    setIsInviting(true)
    try {
      const res = await fetch(`/api/listings/${listingSlug}/managers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        setInviteError(data.message ?? 'Failed to invite manager.')
      } else {
        setInviteEmail('')
        setInviteSuccess(`Invitation sent to ${inviteEmail}.`)
      }
    } catch {
      setInviteError('Network error.')
    } finally {
      setIsInviting(false)
    }
  }

  async function handleRemove(userId: string) {
    if (!window.confirm('Remove this manager? They will lose access to this listing.')) return
    setRemovingId(userId)
    try {
      const res = await fetch(`/api/listings/${listingSlug}/managers/${userId}`, { method: 'DELETE' })
      if (res.ok) {
        setManagers((m) => m.filter((x) => x.user_id !== userId))
      }
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="space-y-8 max-w-xl">
      {/* Current managers */}
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-4">Team members</h2>
        <ul className="space-y-3" aria-label="Current managers">
          {managers.map((m) => {
            const isCurrentUser = m.user_id === currentUserId
            const isOwner = m.role === 'owner'
            return (
              <li key={m.user_id} className="flex items-center gap-3 bg-surface-raised rounded-lg p-3">
                <div className="w-9 h-9 rounded-full bg-brand-primary-light text-brand-primary flex items-center justify-center text-sm font-semibold flex-shrink-0" aria-hidden="true">
                  {(m.user?.display_name ?? m.user?.email ?? '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {m.user?.display_name ?? m.user?.email ?? 'Unknown user'}
                  </p>
                  {m.user?.email && m.user?.display_name && (
                    <p className="text-xs text-text-secondary truncate">{m.user.email}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    isOwner
                      ? 'bg-brand-primary-light text-brand-primary'
                      : 'bg-surface-elevated border border-border-default text-text-secondary'
                  }`}>
                    {isOwner ? 'Owner' : 'Manager'}
                  </span>
                  {!isOwner && !isCurrentUser && (
                    <button
                      type="button"
                      onClick={() => void handleRemove(m.user_id)}
                      disabled={removingId === m.user_id}
                      aria-label={`Remove ${m.user?.display_name ?? m.user?.email ?? 'manager'}`}
                      className="
                        text-xs text-status-error-text hover:underline disabled:opacity-50
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm
                        min-h-[44px] min-w-[44px] flex items-center justify-center
                      "
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Invite manager */}
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-2">Add a manager</h2>
        <p className="text-sm text-text-secondary mb-4">
          They will receive an email invitation to accept access to this listing.
        </p>
        <form onSubmit={handleInvite} noValidate className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="invite-email" className="sr-only">Email address</label>
            <input
              id="invite-email"
              type="email"
              required
              autoComplete="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com"
              aria-invalid={!!inviteError}
              aria-describedby={inviteError ? 'invite-error' : undefined}
              className={`
                w-full rounded-lg border px-3 py-2 text-sm bg-surface-elevated text-text-primary
                focus:outline-none focus:ring-2 focus:ring-border-focus
                ${inviteError ? 'border-status-error' : 'border-border-default'}
              `}
            />
          </div>
          <button
            type="submit"
            disabled={isInviting}
            className="
              flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium
              bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
              disabled:opacity-50
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
            "
          >
            {isInviting ? '…' : 'Invite'}
          </button>
        </form>
        {inviteError && (
          <p id="invite-error" role="alert" className="mt-1.5 text-xs text-status-error-text">{inviteError}</p>
        )}
        {inviteSuccess && (
          <p role="status" aria-live="polite" className="mt-1.5 text-xs text-status-success-text">{inviteSuccess}</p>
        )}
      </div>
    </div>
  )
}
