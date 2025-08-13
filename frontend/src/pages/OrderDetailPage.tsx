import React from 'react'
import { useParams } from 'react-router-dom'
import { useCancelOrderMutation, useGetOrderQuery, type Order } from '../services/orderApi'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, refetch } = useGetOrderQuery(id as string)
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation()

  if (isLoading) return <div className="p-6">Loading…</div>
  const o: Order | undefined = data?.order
  if (!o) return <div className="p-6">Order not found</div>

  const canCancel = o.status === 'pending'

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Order Detail</h1>
      <div className="rounded-2xl border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Order ID: {o._id}</div>
            <div className="text-sm text-gray-500">Status: {o.status}</div>
          </div>
          <div className="text-lg font-semibold">£{o.total.toFixed(2)}</div>
        </div>

        <div>
          <h2 className="font-medium mb-2">Items</h2>
          <div className="space-y-2">
            {o.items.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div>×{it.quantity}</div>
                <div className="flex-1 px-3 truncate">{it.product}</div>
                <div>£{(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {canCancel && (
          <div className="pt-2">
            <button
              disabled={cancelling}
              onClick={async () => { await cancelOrder(o._id).unwrap(); await refetch() }}
              className="rounded-xl border px-4 py-2 disabled:opacity-60"
            >
              {cancelling ? 'Cancelling…' : 'Cancel order'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}