/**
 * AnalyticsDashboard — stats cards and 30-day page view trend.
 * Bar chart is CSS/div-based (not canvas) for accessibility.
 * All data-viz uses colour + number labels (WCAG 1.4.1).
 */

interface DayStat {
  date: string
  views: number
}

interface AnalyticsDashboardProps {
  pageViews: number
  mapImpressions: number
  enquiries: number
  waitlistCount: number
  reviewAvg: number | null
  reviewCount: number
  trend: DayStat[]
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border-default bg-surface-elevated p-4">
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
    </div>
  )
}

function TrendBar({ day, maxViews }: { day: DayStat; maxViews: number }) {
  const pct = maxViews > 0 ? Math.round((day.views / maxViews) * 100) : 0
  const dateLabel = new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric' }).format(new Date(day.date))
  return (
    <div className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
      <span className="text-xs text-text-tertiary" aria-hidden="true">{day.views > 0 ? day.views : ''}</span>
      <div
        className="w-full bg-surface-raised rounded-sm overflow-hidden"
        style={{ height: '80px' }}
        title={`${dateLabel}: ${day.views} views`}
        aria-label={`${dateLabel}: ${day.views} page view${day.views !== 1 ? 's' : ''}`}
      >
        <div
          className="w-full bg-brand-primary rounded-sm transition-all"
          style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="text-[9px] text-text-tertiary rotate-0 text-center leading-none" aria-hidden="true">
        {dateLabel}
      </span>
    </div>
  )
}

export function AnalyticsDashboard({
  pageViews,
  mapImpressions,
  enquiries,
  waitlistCount,
  reviewAvg,
  reviewCount,
  trend,
}: AnalyticsDashboardProps) {
  const maxViews = Math.max(...trend.map((d) => d.views), 1)

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <section aria-label="Key metrics">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">Last 30 days</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Page views" value={pageViews.toLocaleString()} />
          <StatCard label="Map impressions" value={mapImpressions.toLocaleString()} />
          <StatCard label="Enquiries" value={enquiries.toLocaleString()} />
          <StatCard label="Waitlist sign-ups" value={waitlistCount.toLocaleString()} />
          <StatCard
            label={`Reviews avg (${reviewCount})`}
            value={reviewAvg != null ? `${reviewAvg.toFixed(1)} ★` : '–'}
          />
        </div>
      </section>

      {/* 30-day trend bar chart */}
      {trend.length > 0 && (
        <section aria-label="30-day page view trend">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">Page views — daily</h2>
          {/* Screen reader table */}
          <table className="sr-only">
            <caption>Daily page views for the last 30 days</caption>
            <thead><tr><th>Date</th><th>Page views</th></tr></thead>
            <tbody>
              {trend.map((d) => (
                <tr key={d.date}><td>{d.date}</td><td>{d.views}</td></tr>
              ))}
            </tbody>
          </table>
          {/* Visual bar chart */}
          <div className="flex gap-0.5 items-end h-32 bg-surface-raised rounded-xl p-3" aria-hidden="true">
            {trend.map((day) => (
              <TrendBar key={day.date} day={day} maxViews={maxViews} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
