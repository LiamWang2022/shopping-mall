import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CartCheckoutButton({ disabled }: { disabled?: boolean }) {
  const navigate = useNavigate()
  return (
    <div className="mt-6 flex justify-end">
      <button
        onClick={() => navigate('/checkout')}
        disabled={disabled}
        className="rounded-xl bg-black text-white px-5 py-2.5 disabled:opacity-60"
      >
        Proceed to Checkout
      </button>
    </div>
  )
}