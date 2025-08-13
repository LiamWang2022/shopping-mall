import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

export interface OrderItem {
  product: string
  quantity: number
  price: number
}

export interface Order {
  _id: string
  buyer: string
  shop: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  address: string
  createdAt: string
}

export interface CreateFromCartBody {
  items: { productId: string; quantity: number }[]
  address: string // Address ObjectId
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Orders', 'Order'],
  endpoints: (b) => ({
    createFromCart: b.mutation<{ message: string; orders: Order[] }, CreateFromCartBody>({
      query: (body) => ({ url: '/orders/from-cart', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),
    getMyOrders: b.query<{ orders: Order[] }, void>({
      query: () => '/orders/buyer',
      providesTags: ['Orders'],
    }),
    getOrder: b.query<{ message: string; order: Order; role?: 'buyer' | 'seller' }, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: b.mutation<{ message: string; order: Order }, string>({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const {
  useCreateFromCartMutation,
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
} = orderApi