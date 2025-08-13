import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateFromCartMutation, type CreateFromCartBody } from '../services/orderApi'
import { useGetCartQuery } from '../services/cartApi'
import CheckoutAddressSelector from '../components/CheckoutAddressSelector'

interface ProductImage { url: string; alt?: string }
interface CartItem { productId: string; display_name: string; price: number; images?: ProductImage[]; quantity: number }
interface CartResponse { items: CartItem[] }

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { data } = useGetCartQuery() as { data?: CartResponse }
  const [addressId, setAddressId] = useState('')
  const [createFromCart, { isLoading }] = useCreateFromCartMutation()

  const items: CreateFromCartBody['items'] = useMemo(() => {
    const list = data?.items ?? []
    return list.map((it) => ({ productId: it.productId, quantity: it.quantity }))
  }, [data])

  const subtotal = useMemo(() => {
    const list = data?.items ?? []
    return list.reduce((sum, it) => sum + it.price * it.quantity, 0)
  }, [data])

  const onSubmit = async () => {
    if (!addressId) { alert('Please choose or create an address'); return }
    if (items.length === 0) { alert('Cart is empty'); return }
    try {
      const res = await createFromCart({ items, address: addressId }).unwrap()
      const ids = res.orders.map((o) => o._id).join(',')
      navigate(`/orders/success?ids=${ids}`)
    } catch (e: unknown) {
      const err = e as { data?: { error?: string; message?: string } }
      alert(err?.data?.error || err?.data?.message || 'Checkout failed')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Review & Checkout</h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-2xl border p-4">
          <h2 className="font-medium mb-3">Items</h2>
          <div className="space-y-3">
            {(data?.items ?? []).map((it, idx) => (
              <div key={`${it.productId}_${idx}`} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {it.images?.[0]?.url ? (
                    <img src={it.images[0].url} alt={it.images[0].alt || ''} className="h-12 w-12 rounded-lg object-cover" />
                  ) : null}
                  <div>
                    <div className="font-medium">{it.display_name}</div>
                    <div className="text-sm text-gray-500">x{it.quantity}</div>
                  </div>
                </div>
                <div>£{(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end text-lg font-semibold">Subtotal: £{subtotal.toFixed(2)}</div>
        </div>

        <CheckoutAddressSelector value={addressId} onChange={setAddressId} />

        <div className="flex items-center justify-end gap-3">
          <button onClick={onSubmit} disabled={isLoading || !addressId} className="rounded-xl px-5 py-2.5 border bg-black text-white disabled:opacity-60">
            {isLoading ? 'Placing…' : 'Place order'}
          </button>
        </div>
      </div>
    </div>
  )
}
