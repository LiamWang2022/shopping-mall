import type { RootState } from '../store'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface CartItemDTO {
  productId: string
  display_name: string
  price: number
  images?: { url: string; alt?: string }[]
  quantity: number
}
export interface CartDTO { items: CartItemDTO[] }

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (b) => ({
    // GET /api/carts/items
    getCart: b.query<CartDTO, void>({
      query: () => ({ url: '/carts/items', method: 'GET' }),
      providesTags: ['Cart'],
    }),
    // POST /api/carts/items
    addItem: b.mutation<{ message?: string } | CartDTO, { productId: string; quantity?: number }>({
      query: (body) => ({ url: '/carts/items', method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),
    // PATCH /api/carts/items
    updateQty: b.mutation<{ message?: string } | CartDTO, { productId: string; quantity: number }>({
      query: (body) => ({ url: '/carts/items', method: 'PATCH', body }),
      invalidatesTags: ['Cart'],
    }),
    // DELETE /api/cart/items/:productId
    removeItem: b.mutation<{ message?: string } | CartDTO, { productId: string }>({
      query: ({ productId }) => ({ url: `/carts/items/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddItemMutation,
  useUpdateQtyMutation,
  useRemoveItemMutation,
} = cartApi