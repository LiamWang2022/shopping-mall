import { useGetCartQuery, useRemoveItemMutation, useUpdateQtyMutation } from '../services/cartApi'

export default function CartDrawer() {
  const { data, isFetching, isLoading, isError } = useGetCartQuery()
  const [removeItem, { isLoading: removing }] = useRemoveItemMutation()
  const [updateQty] = useUpdateQtyMutation()

  const items = data?.items ?? []
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  const onRemove = async (productId: string) => {
    try { await removeItem({ productId }).unwrap() } catch (e) { console.error(e) }
  }

  const onChangeQty = async (productId: string, quantity: number) => {
    try { await updateQty({ productId, quantity }).unwrap() } catch (e) { console.error(e) }
  }

  if (isLoading || isFetching) return <div className="p-4">Loading cart…</div>
  if (isError) return <div className="p-4 text-red-600">Failed to load cart.</div>

  return (
    <div className="w-full max-w-md p-4 border-l border-gray-200">
      <h2 className="text-lg font-semibold mb-3">Your Cart</h2>
      {items.length === 0 ? (
        <div className="text-gray-500">Cart is empty</div>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.productId} className="flex items-center justify-between border rounded p-3">
              <div className="flex items-center gap-3">
                {it.images?.[0]?.url && (
                  <img src={it.images[0].url} alt={it.display_name} className="w-14 h-14 object-cover rounded" />
                )}
                <div>
                  <div className="font-medium">{it.display_name}</div>
                  <div className="text-sm text-gray-500">£{it.price}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => onChangeQty(it.productId, Math.max(0, it.quantity - 1))}
                >
                  −
                </button>
                <span className="w-6 text-center">{it.quantity}</span>
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => onChangeQty(it.productId, it.quantity + 1)}
                >
                  +
                </button>

                <button
                  className="ml-3 px-2 py-1 border rounded text-red-600"
                  disabled={removing}
                  onClick={() => onRemove(it.productId)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-gray-600">Subtotal</div>
        <div className="text-lg font-semibold">£{total.toFixed(2)}</div>
      </div>

      <button className="mt-4 w-full py-2 rounded bg-black text-white disabled:opacity-60" disabled={items.length === 0}>
        Checkout
      </button>
    </div>
  )
}