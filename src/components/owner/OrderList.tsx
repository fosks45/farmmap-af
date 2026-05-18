'use client'

import { useState, useEffect } from 'react'
import type { Order, OrderStatus } from '@/lib/types'

/**
 * OrderList — order management table for Silver/Gold tier listings.
 * Status filter tabs. Accept/prepare/dispatch/deliver actions.
 * Auto-cancel countdown for pending orders (24-hour window).
 */

interface OrderListProps {
  listingSlug: string
  initialOrders: Order[]
}

const STATUS_TABS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_preparation', label: 'Preparing' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
]

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'accepted',
  accepted: 'in_preparation',
  in_preparation: 'dispatched',
  dispatched: 'delivered',
}

const ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  pending: 'Accept order',
  accepted: 'Mark preparing',
  in_preparation: 'Mark dispatched',
  dispatched: 'Mark delivered',
}

function CountdownTimer({ expiresAt }: { expiresAt: Date }) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    function update() {
      const diff = expiresAt.getTime() - Date.now()
      if (diff <= 0) { setRemaining('Expired'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setRemaining(`${h}h ${m}m remaining`)
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [expiresAt])

  return <span className="text-xs text-status-warning-text">{remaining}</span>
}

export function OrderList({ listingSlug, initialOrders }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [actioning, setActioning] = useState<string | null>(null)

  const filtered = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter)

  async function advance(order: Order) {
    const next = NEXT_STATUS[order.status]
    if (!next) return
    setActioning(order.id)
    try {
      const res = await fetch(`/api/listings/${listingSlug}/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: next } : o))
      }
    } finally {
      setActioning(null)
    }
  }

  const currencySymbol = (c: 'GBP' | 'EUR') => c === 'GBP' ? '£' : '€'

  if (orders.length === 0) {
    return <p className="text-text-secondary text-sm py-8 text-center">No orders yet.</p>
  }

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto" role="tablist" aria-label="Filter orders by status">
        {STATUS_TABS.map((tab) => {
          const count = tab.value === 'all' ? orders.length : orders.filter((o) => o.status === tab.value).length
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={statusFilter === tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus
                ${statusFilter === tab.value
                  ? 'bg-brand-primary text-text-inverse'
                  : 'bg-surface-raised text-text-secondary hover:text-text-primary'}
              `}
            >
              {tab.label} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          )
        })}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <p className="text-text-secondary text-sm py-4">No orders with this status.</p>
      ) : (
        <ul className="space-y-3" aria-label="Orders">
          {filtered.map((order) => {
            const expiresAt = order.status === 'pending'
              ? new Date(new Date(order.created_at).getTime() + 24 * 60 * 60 * 1000)
              : null
            return (
              <li key={order.id} className="rounded-xl border border-border-default bg-surface-elevated p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-sm text-text-primary">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(order.created_at))}
                    </p>
                    {expiresAt && <CountdownTimer expiresAt={expiresAt} />}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-text-primary">
                      {currencySymbol(order.currency)}{(order.total / 100).toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === 'delivered' ? 'bg-status-success-light text-status-success-text' :
                      order.status === 'cancelled' || order.status === 'refunded' ? 'bg-status-error-light text-status-error-text' :
                      'bg-status-warning-light text-status-warning-text'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <ul className="text-xs text-text-secondary mb-3 space-y-0.5">
                  {order.items.map((item, i) => (
                    <li key={i}>{item.quantity}× {item.product_name} — {currencySymbol(item.currency)}{(item.unit_price / 100).toFixed(2)}</li>
                  ))}
                </ul>

                {NEXT_STATUS[order.status] && (
                  <button
                    type="button"
                    onClick={() => void advance(order)}
                    disabled={actioning === order.id}
                    className="
                      px-3 py-1.5 rounded-md text-xs font-medium
                      bg-brand-primary text-text-inverse hover:bg-brand-primary-hover
                      disabled:opacity-50
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus
                      transition-colors
                    "
                  >
                    {actioning === order.id ? '…' : ACTION_LABELS[order.status]}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
