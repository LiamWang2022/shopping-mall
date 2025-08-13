import React from 'react'
import {
  useGetCartQuery,
  useUpdateQtyMutation,
  useRemoveItemMutation,
} from '../services/cartApi'
import { extractErrorMessage } from '../lib/rtkError'
import CartCheckoutButton from '../components/CartCheckoutButton'

export function CartPage() {
  const { data, isLoading, isFetching, isError, error } = useGetCartQuery()
  const [updateQty] = useUpdateQtyMutation()
  const [removeItem] = useRemoveItemMutation()

  if (isLoading || isFetching) return <div className="p-6">Loading cart…</div>
  if (isError) {
    const msg = extractErrorMessage(error)
    return <div className="p-6 text-red-600">Failed to load cart: {msg}</div>
  }

  const items = data?.items ?? []
  const subtotal = items.reduce((sum, it) => {
    const price = Number(it.price ?? 0)
    const qty = Number(it.quantity ?? 0)
    return sum + price * qty
  }, 0)

  const onDec = async (productId: string, current: number) => {
    try {
      const next = current - 1
      await updateQty({ productId, quantity: next }).unwrap()
    } catch (e) {
      console.error(extractErrorMessage(e))
    }
  }

  const onInc = async (productId: string, current: number) => {
    try {
      await updateQty({ productId, quantity: current + 1 }).unwrap()
    } catch (e) {
      console.error(extractErrorMessage(e))
    }
  }

  const onRemove = async (productId: string) => {
    try {
      await removeItem({ productId }).unwrap()
    } catch (e) {
      console.error(extractErrorMessage(e))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-gray-600">Cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => {
            const cover = it.images?.[0]?.url
            return (
              <div
                key={it.productId}
                className="flex items-center justify-between rounded-xl border p-4 bg-white"
              >
                <div className="flex items-center gap-3">
                  {cover ? (
                    <img
                      src={cover}
                      alt={it.display_name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                  ) : (
                    <div className="w-16 h-16 grid place-items-center rounded-lg bg-gray-100 text-xs text-gray-500">
                      No Img
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{it.display_name}</div>
                    <div className="text-sm text-gray-600">
                      £{Number(it.price).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="border rounded px-2"
                    onClick={() => onDec(it.productId, it.quantity)}
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{it.quantity}</span>
                  <button
                    className="border rounded px-2"
                    onClick={() => onInc(it.productId, it.quantity)}
                  >
                    +
                  </button>
                  <button
                    className="ml-3 border rounded px-2 py-1"
                    onClick={() => onRemove(it.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}

          <div className="flex justify-end pt-4 text-lg font-semibold">
            Subtotal: £{subtotal.toFixed(2)}
          </div>
          <div className="flex justify-end">
            <CartCheckoutButton disabled={items.length === 0 || isFetching} />
          </div>
        </div>
      )}
    </div>
  )
}