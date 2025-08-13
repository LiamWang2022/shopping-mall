import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function OrderSuccessPage() {
  const qs = new URLSearchParams(useLocation().search)
  const ids = (qs.get('ids') || '').split(',').filter(Boolean)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-3">Order placed</h1>
      <p className="text-gray-600">Orders were created per shop:</p>
      <ul className="mt-4 space-y-2">
        {ids.map((id) => (
          <li key={id}>
            <Link className="text-blue-600 underline" to={`/orders/${id}`}>View order {id}</Link>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link className="rounded-xl border px-4 py-2" to="/orders">Back to My Orders</Link>
      </div>
    </div>
  )
}