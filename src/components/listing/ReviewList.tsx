import type { Review } from '@/lib/types'
import { StarRatingDisplay } from '@/components/ui/StarRating'

/**
 * ReviewList — displays approved reviews with star ratings, reviewer initials, date, owner response.
 * Star rating uses aria-label (not colour alone) — WCAG 1.4.1.
 */

interface ReviewListProps {
  reviews: Review[]
}

function ReviewerAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      aria-hidden="true"
      className="w-9 h-9 rounded-full bg-brand-primary-light text-brand-primary
                 flex items-center justify-center text-sm font-semibold flex-shrink-0"
    >
      {initials}
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export function ReviewList({ reviews }: ReviewListProps) {
  const approved = reviews.filter((r) => r.moderation_status === 'approved')

  if (approved.length === 0) {
    return (
      <p className="text-sm text-text-secondary py-4">
        No reviews yet. Be the first to leave a review.
      </p>
    )
  }

  return (
    <ul className="space-y-6" aria-label="Customer reviews">
      {approved.map((review) => (
        <li key={review.id} className="border-b border-border-subtle pb-6 last:border-0 last:pb-0">
          <div className="flex items-start gap-3">
            <ReviewerAvatar name={review.reviewer_name} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-medium text-sm text-text-primary">
                  {review.reviewer_name}
                </span>
                <StarRatingDisplay rating={review.rating} size="sm" />
                <time
                  dateTime={review.published_at ?? review.created_at}
                  className="text-xs text-text-tertiary"
                >
                  {formatDate(review.published_at ?? review.created_at)}
                </time>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{review.body}</p>

              {/* Owner response */}
              {review.owner_response && review.owner_response_status === 'approved' && (
                <div className="mt-3 pl-3 border-l-2 border-brand-primary-light">
                  <p className="text-xs font-semibold text-brand-primary mb-1">
                    Response from the owner
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {review.owner_response}
                  </p>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
