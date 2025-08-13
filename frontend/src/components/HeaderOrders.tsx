import React from 'react'
import { NavLink, type NavLinkProps } from 'react-router-dom'
import { useGetMyOrdersQuery, type Order } from '../services/orderApi'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

interface Props {
  className?: string
}

// Explicitly type the className function to avoid `any`
type NavClassFn = Exclude<NavLinkProps['className'], string>

export default function HeaderOrders({ className }: Props) {
  // If your auth slice uses a different path, change selector accordingly
  const token = useSelector((s: RootState) => s.auth.token)

  // Only fetch when logged in to avoid 401 noise
  const { data } = useGetMyOrdersQuery(undefined, { skip: !token })
  const orders: Order[] = data?.orders ?? []
  const pendingCount = orders.filter((o) => o.status === 'pending').length

  const linkClassName: NavClassFn = ({ isActive /*, isPending, isTransitioning */ }) =>
    `inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 ${isActive ? 'text-black' : 'text-gray-700'} ${
      className ?? ''
    }`

  return (
    <NavLink to="/orders" className={linkClassName} aria-label="My Orders">
      <span>Orders</span>
      {token && pendingCount > 0 && (
        <span className="ml-1 inline-flex min-w-[1.25rem] h-5 items-center justify-center rounded-full bg-black px-1 text-xs font-medium text-white">
          {pendingCount}
        </span>
      )}
    </NavLink>
  )
}