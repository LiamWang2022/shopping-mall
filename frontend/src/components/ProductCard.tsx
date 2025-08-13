import React from 'react'
import type { Product } from '../services/productApi'
import AddToCartButton from './AddToCartButton'
import { Link } from 'react-router-dom'
export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const cover = product.images?.[0]

  return (
    <Link to={`/products/${product._id}`} className="group rounded-2xl border overflow-hidden bg-white shadow-sm hover:shadow-md transition">
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        {cover?.url ? (
          <img
            src={cover.url}
            alt={cover.alt || product.display_name}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-gray-400 text-sm">No Image</div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">{product.display_name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">£{product.price.toFixed(2)}</p>

          <AddToCartButton
            productId={product._id}
            className="text-xs border px-2.5 py-1 rounded-lg hover:bg-gray-50 cursor-pointer"
          />
        </div>
      </div>
    </Link>
  )
}
