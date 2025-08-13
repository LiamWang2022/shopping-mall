import React from 'react'
// import { Link } from 'react-router-dom'
import { useGetMyOrdersQuery, type Order } from '../services/orderApi'

export default function MyOrdersPage() {
  const { data, isLoading } = useGetMyOrdersQuery()

  if (isLoading) return <div className="p-6">Loading…</div>

  const orders: Order[] = data?.orders ?? []

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-gray-600">No orders yet</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="block rounded-2xl border p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Order ID: {o._id}</div>
                  <div className="text-sm text-gray-500">Status: {o.status}</div>
                </div>
                <div className="text-lg font-semibold">£{o.total.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}