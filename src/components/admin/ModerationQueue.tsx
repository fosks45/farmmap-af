'use client'

import { useState } from 'react'
import type { Listing } from '@/lib/types'
import { listingTypeConfig } from '@/lib/tokens'

/**
 * ModerationQueue — listing approval queue with approve/reject actions.
 * Rejection requires a reason (shown to listing owner).
 */

interface ModerationQueueProps {
  listings: (Listing & { status: string })[]
}

interface RejectState {
  listingId: string
  reason: string
}

export function ModerationQueue({ listings: initialListings }: ModerationQueueProps) {
  const [listings, setListings] = useState(initialListings)
  const [actioning, setActioning] = useState<string | null>(null)
  const [reject, setReject] = useState<RejectState | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function approve(listingId: string) {
    setActioning(listingId)
    try {
      const res = await fetch(`/api/admin/listings/${listingId}/approve`, { method: 'POST' })
      if (res.ok) setListings((l) => l.filter((x) => x.id !== listingId))
      else setError('Failed to approve listing.')
    } finally {
      setActioning(null)
    }
  }

  async function submitReject() {
    if (!reject || !reject.reason.trim()) return
    setActioning(reject.listingId)
    try {
      const res = await fetch(`/api/admin/listings/${reject.listingId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reject.reason }),
      })
      if (res.ok) {
        setListings((l) => l.filter((x) => x.id !== reject.listingId))
        setReject(null)
      } else {
        setError('Failed to reject listing.')
      }
    } finally {
      setActioning(null)
    }
  }

  if (listings.length === 0) {
    return <p className="text-text-secondary py-8 text-center">No listings pending moderation.</p>
  }

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="text-sm text-status-error-text bg-status-error-light rounded px-3 py-2">{error}</p>}

      {listings.map((listing) => {
        const typeConfig = listingTypeConfig[listing.listing_type]
        return (
          <div key={listing.id} className="rounded-xl border border-border-default bg-surface-elevated p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-text-primary">{listing.name}</p>
                <p className="text-xs text-text-secondary">{typeConfig.label} · {listing.address.town}, {listing.address.county}</p>
                <p className="text-xs text-text-tertiary mt-1">
                  Added {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(listing.created_at))}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void approve(listing.id)}
                  disabled={actioning === listing.id}
                  className="
                    px-3 py-1.5 rounded-md text-xs font-medium
                    bg-status-success text-text-inverse hover:opacity-90
                    disabled:opacity-50
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus
                  "
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setReject({ listingId: listing.id, reason: '' })}
                  disabled={actioning === listing.id}
                  className="
                    px-3 py-1.5 rounded-md text-xs font-medium
                    bg-status-error-light text-status-error-text hover:bg-status-error hover:text-text-inverse
                    disabled:opacity-50
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus
                    transition-colors
                  "
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Reject form inline */}
            {reject?.listingId === listing.id && (
              <div className="mt-3 pt-3 border-t border-border-subtle">
                <label htmlFor={`reject-reason-${listing.id}`} className="block text-xs font-medium text-text-primary mb-1">
                  Rejection reason <span aria-hidden="true" className="text-status-error">*</span>
                </label>
                <textarea
                  id={`reject-reason-${listing.id}`}
                  rows={2}
                  required
                  value={reject.reason}
                  onChange={(e) => setReject((r) => r ? { ...r, reason: e.target.value } : r)}
                  className="w-full rounded-lg border border-border-default px-3 py-2 text-sm bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-border-focus"
                  placeholder="Explain why this listing is being rejected…"
                />
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={submitReject} disabled={!reject.reason.trim()}
                    className="px-3 py-1.5 rounded-md text-xs font-medium bg-status-error text-text-inverse disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus">
                    Submit rejection
                  </button>
                  <button type="button" onClick={() => setReject(null)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium border border-border-default text-text-secondary hover:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
