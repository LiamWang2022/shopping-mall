import React from 'react'
import {
  useGetCartQuery,
  cartSelectors,
  selectCartTotalPrice,
} from '../services/cartApi'
import { extractErrorMessage } from '../lib/rtkError'
import CartCheckoutButton from '../components/CartCheckoutButton'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { CartItemRow } from '../components/CartItemRow'
export function CartPage() {
  const { isLoading: cartLoading, isFetching: cartFetching, isError: cartError, error: cartErrorMessage } =
    useGetCartQuery(undefined, {
      selectFromResult: ({ isLoading, isFetching, isError, error }) => ({
        isLoading,
        isFetching,
        isError,
        error,
      }),
    })

  const ids = useSelector((s: RootState) => cartSelectors.selectIds(s)) as string[]
  const subtotal = useSelector(selectCartTotalPrice)

  if (cartLoading || cartFetching) return <div className="p-6">Loading cart…</div>
  if (cartError) {
    const msg = extractErrorMessage(cartErrorMessage)
    return <div className="p-6 text-red-600">Failed to load cart: {msg}</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {ids.length === 0 ? (
        <div className="text-gray-600">Cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {ids.map((id) => (
            <CartItemRow key={id} id={id} />
          ))}

          <div className="flex justify-end pt-4 text-lg font-semibold">
            Subtotal: £{subtotal.toFixed(2)}
          </div>
          <div className="flex justify-end">
            <CartCheckoutButton disabled={ids.length === 0 || cartFetching} />
          </div>
        </div>
      )}
    </div>
  )
}