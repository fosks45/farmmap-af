'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ListingPhoto } from '@/lib/types'

/**
 * PhotoReviewCard — photo moderation queue with bulk approve.
 * Approve/reject buttons per photo. Bulk select + bulk approve.
 * Rejection reason modal (native <dialog>).
 */

interface PhotoReviewCardProps {
  photos: (ListingPhoto & { listing_name: string; listing_slug: string })[]
}

export function PhotoReviewCard({ photos: initialPhotos }: PhotoReviewCardProps) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actioning, setActioning] = useState<string | null>(null)
  const dialogRef = useState<HTMLDialogElement | null>(null)

  async function approve(id: string) {
    setActioning(id)
    try {
      const res = await fetch(`/api/admin/photos/${id}/approve`, { method: 'POST' })
      if (res.ok) setPhotos((p) => p.filter((x) => x.id !== id))
    } finally {
      setActioning(null)
    }
  }

  async function bulkApprove() {
    const ids = Array.from(selected)
    for (const id of ids) {
      await fetch(`/api/admin/photos/${id}/approve`, { method: 'POST' })
    }
    setPhotos((p) => p.filter((x) => !selected.has(x.id)))
    setSelected(new Set())
  }

  async function submitReject() {
    if (!rejectTarget || !rejectReason.trim()) return
    setActioning(rejectTarget)
    try {
      const res = await fetch(`/api/admin/photos/${rejectTarget}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      })
      if (res.ok) {
        setPhotos((p) => p.filter((x) => x.id !== rejectTarget))
        setRejectTarget(null)
        setRejectReason('')
      }
    } finally {
      setActioning(null)
    }
  }

  function toggleSelect(id: string) {
    setSelected((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  if (photos.length === 0) {
    return <p className="text-text-secondary py-8 text-center">No photos pending review.</p>
  }

  return (
    <div>
      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-brand-primary-light rounded-lg">
          <span className="text-sm font-medium text-brand-primary">{selected.size} selected</span>
          <button type="button" onClick={bulkApprove}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-brand-primary text-text-inverse hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus">
            Approve selected
          </button>
          <button type="button" onClick={() => setSelected(new Set())}
            className="text-xs text-text-secondary underline hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm">
            Clear selection
          </button>
        </div>
      )}

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" aria-label="Photos pending review">
        {photos.map((photo) => (
          <li key={photo.id} className="relative rounded-xl border border-border-default overflow-hidden bg-surface-raised">
            {/* Select checkbox */}
            <label className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selected.has(photo.id)}
                onChange={() => toggleSelect(photo.id)}
                className="sr-only"
                aria-label={`Select photo for ${photo.listing_name}`}
              />
              <span className={`block w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selected.has(photo.id) ? 'bg-brand-primary border-brand-primary' : 'bg-white/80 border-border-default'
              }`} aria-hidden="true">
                {selected.has(photo.id) && <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </span>
            </label>

            <div className="relative aspect-square">
              <Image src={photo.public_url} alt={photo.alt_text || `Photo for ${photo.listing_name}`} fill sizes="200px" className="object-cover" />
            </div>

            <div className="p-2">
              <p className="text-xs font-medium text-text-primary truncate">{photo.listing_name}</p>
              <div className="flex gap-1 mt-2">
                <button type="button" onClick={() => void approve(photo.id)} disabled={actioning === photo.id}
                  className="flex-1 py-1 rounded text-xs font-medium bg-status-success text-text-inverse disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus">
                  ✓
                </button>
                <button type="button" onClick={() => { setRejectTarget(photo.id); setRejectReason('') }} disabled={actioning === photo.id}
                  className="flex-1 py-1 rounded text-xs font-medium bg-status-error-light text-status-error-text hover:bg-status-error hover:text-text-inverse disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus transition-colors">
                  ✕
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Rejection reason dialog */}
      {rejectTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-photo-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-surface-elevated rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h2 id="reject-photo-title" className="text-base font-semibold text-text-primary mb-3">Reject photo</h2>
            <label htmlFor="reject-photo-reason" className="block text-sm font-medium text-text-primary mb-1">
              Reason <span aria-hidden="true" className="text-status-error">*</span>
            </label>
            <textarea id="reject-photo-reason" rows={3} required value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-lg border border-border-default px-3 py-2 text-sm bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-border-focus"
              placeholder="Explain why this photo is being rejected…"
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <button type="button" onClick={submitReject} disabled={!rejectReason.trim()}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-status-error text-text-inverse disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus">
                Reject
              </button>
              <button type="button" onClick={() => { setRejectTarget(null); setRejectReason('') }}
                className="flex-1 py-2 rounded-lg text-sm font-medium border border-border-default text-text-secondary hover:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
