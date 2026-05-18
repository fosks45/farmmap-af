'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import type { ListingPhoto } from '@/lib/types'

/**
 * PhotoUploader — drag-drop zone + file input.
 * Shows upload progress and moderation status per photo.
 * Max 10 photos, max 5MB each, JPEG/PNG only.
 */

interface PhotoUploaderProps {
  listingSlug: string
  initialPhotos: ListingPhoto[]
}

interface UploadState {
  id: string
  file: File
  progress: number
  error: string | null
  done: boolean
}

const MAX_PHOTOS = 10
const MAX_SIZE_MB = 5
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

function ModerationBadge({ status }: { status: ListingPhoto['moderation_status'] }) {
  const map = {
    approved: { label: 'Approved', classes: 'bg-status-success-light text-status-success-text' },
    pending: { label: 'Pending review', classes: 'bg-status-warning-light text-status-warning-text' },
    rejected: { label: 'Rejected', classes: 'bg-status-error-light text-status-error-text' },
  }
  const { label, classes } = map[status]
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${classes}`}>{label}</span>
  )
}

export function PhotoUploader({ listingSlug, initialPhotos }: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<ListingPhoto[]>(initialPhotos)
  const [uploads, setUploads] = useState<UploadState[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalPhotos = photos.length + uploads.filter((u) => u.done && !u.error).length

  async function uploadFile(file: File) {
    const id = crypto.randomUUID()
    setUploads((u) => [...u, { id, file, progress: 0, error: null, done: false }])

    const formData = new FormData()
    formData.append('photo', file)

    try {
      const xhr = new XMLHttpRequest()
      await new Promise<void>((resolve, reject) => {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100)
            setUploads((u) => u.map((x) => x.id === id ? { ...x, progress: pct } : x))
          }
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploads((u) => u.map((x) => x.id === id ? { ...x, progress: 100, done: true } : x))
            resolve()
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`))
          }
        }
        xhr.onerror = () => reject(new Error('Network error'))
        xhr.open('POST', `/api/listings/${listingSlug}/photos`)
        xhr.send(formData)
      })
    } catch (err) {
      setUploads((u) => u.map((x) => x.id === id ? { ...x, error: err instanceof Error ? err.message : 'Upload failed', done: true } : x))
    }
  }

  function processFiles(files: File[]) {
    setGlobalError(null)
    const remaining = MAX_PHOTOS - totalPhotos
    if (remaining <= 0) {
      setGlobalError(`Maximum ${MAX_PHOTOS} photos allowed.`)
      return
    }
    const toUpload = files.slice(0, remaining)
    const skipped: string[] = []

    for (const file of files.slice(remaining)) {
      skipped.push(file.name)
    }

    const invalid: string[] = []
    for (const file of toUpload) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        invalid.push(file.name)
        continue
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        invalid.push(`${file.name} (too large)`)
        continue
      }
      void uploadFile(file)
    }

    const msgs: string[] = []
    if (invalid.length) msgs.push(`Skipped (invalid format/size): ${invalid.join(', ')}`)
    if (skipped.length) msgs.push(`Only ${MAX_PHOTOS} photos allowed; ${skipped.length} file(s) not uploaded.`)
    if (msgs.length) setGlobalError(msgs.join(' '))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(Array.from(e.dataTransfer.files))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPhotos])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(Array.from(e.target.files))
    e.target.value = ''
  }

  async function deletePhoto(photoId: string) {
    const res = await fetch(`/api/listings/${listingSlug}/photos/${photoId}`, { method: 'DELETE' })
    if (res.ok) setPhotos((p) => p.filter((x) => x.id !== photoId))
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-brand-primary bg-brand-primary-light/20' : 'border-border-default hover:border-border-strong'}
        `}
        role="region"
        aria-label="Photo upload area"
      >
        <p className="text-text-secondary text-sm mb-3">
          Drag and drop photos here, or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="underline text-text-link hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus rounded-sm"
          >
            browse to upload
          </button>
        </p>
        <p className="text-xs text-text-tertiary">JPEG or PNG, max {MAX_SIZE_MB}MB each, up to {MAX_PHOTOS} photos total</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Upload photos"
        />
      </div>

      {globalError && (
        <p role="alert" className="text-sm text-status-error-text bg-status-error-light rounded-md px-3 py-2">
          {globalError}
        </p>
      )}

      {/* In-progress uploads */}
      {uploads.filter((u) => !u.done || u.error).length > 0 && (
        <ul className="space-y-2" aria-label="Upload progress">
          {uploads.filter((u) => !u.done || u.error).map((u) => (
            <li key={u.id} className="flex items-center gap-3 bg-surface-raised rounded-lg px-3 py-2">
              <span className="text-sm text-text-primary flex-1 min-w-0 truncate">{u.file.name}</span>
              {u.error ? (
                <span className="text-xs text-status-error-text">{u.error}</span>
              ) : (
                <div className="w-24 h-2 bg-border-subtle rounded-full overflow-hidden" role="progressbar" aria-valuenow={u.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Uploading ${u.file.name}`}>
                  <div className="h-full bg-brand-primary transition-all" style={{ width: `${u.progress}%` }} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Existing photos */}
      {photos.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-text-primary mb-3">
            Your photos ({photos.length}/{MAX_PHOTOS})
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" aria-label="Uploaded photos">
            {photos.map((photo) => (
              <li key={photo.id} className="relative group rounded-lg overflow-hidden border border-border-default bg-surface-raised aspect-square">
                <Image
                  src={photo.public_url}
                  alt={photo.alt_text || 'Listing photo'}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                  <ModerationBadge status={photo.moderation_status} />
                  <button
                    type="button"
                    onClick={() => void deletePhoto(photo.id)}
                    aria-label={`Delete photo ${photo.alt_text || ''}`}
                    className="
                      opacity-0 group-hover:opacity-100 transition-opacity
                      w-7 h-7 rounded-full bg-status-error text-text-inverse flex items-center justify-center
                      focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white
                      min-w-[44px] min-h-[44px]
                    "
                  >
                    <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
