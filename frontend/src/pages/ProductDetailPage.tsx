import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetProductByIdQuery } from '../services/productApi'
import { useAddItemMutation } from '../services/cartApi'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading, error } = useGetProductByIdQuery(id!)
  const [addToCart, { isLoading: adding }] = useAddItemMutation()

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error || !product) return <div className="p-6 text-red-500">Product not found</div>

  const handleAddToCart = async () => {
    await addToCart({ productId: product._id, quantity: 1 }).unwrap()
    navigate('/cart')
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <div>
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.display_name}
            className="rounded-xl shadow-lg w-full"
          />
        ) : (
          <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center">
            No image
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.display_name}</h1>
        <div className="text-2xl font-semibold text-green-700">£{product.price}</div>
        <p className="text-gray-600">{product.product_description || 'No description provided.'}</p>
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl cursor-pointer
                     hover:bg-gray-800 hover:text-white transition-colors duration-200 disabled:opacity-60"
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}