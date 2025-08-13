import { useAddItemMutation } from '../services/cartApi'
import { extractErrorMessage } from '../lib/rtkError'

type Props = {
  productId: string
  className?: string
}

export default function AddToCartButton({ productId, className }: Props) {
  const [addItem, { isLoading }] = useAddItemMutation()

  const onAdd = async () => {
    try {
      await addItem({ productId, quantity: 1 }).unwrap()
    } catch (e) {
      const msg = extractErrorMessage(e)
      console.error(msg)
    }
  }

  return (
    <button
      className={className}
      disabled={isLoading}
      onClick={onAdd}
    >
      {isLoading ? 'Adding…' : 'Add to Cart'}
    </button>
  )
}
