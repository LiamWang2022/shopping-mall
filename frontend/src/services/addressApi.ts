import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

export interface Address {
  _id: string
  user: string
  country: string
  province: string
  city: string
  detail: string
  postcode?: string
  isDefault: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateAddressBody {
  country: string
  province: string
  city: string
  detail: string
  postcode?: string
  isDefault?: boolean
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Addresses'],
  endpoints: (b) => ({
    getMyAddresses: b.query<{ addresses: Address[] }, void>({
      query: () => '/addresses',
      providesTags: ['Addresses'],
      transformResponse: (resp: unknown): { addresses: Address[] } => {
        if (Array.isArray(resp)) return { addresses: resp as Address[] }
        if (resp && typeof resp === 'object') {
          const obj = resp as Record<string, unknown>
          if (Array.isArray(obj.addresses)) {
            return { addresses: obj.addresses as Address[] }
          }
        }
        return { addresses: [] }
      },
    }),
    createAddress: b.mutation<{ address: Address }, CreateAddressBody>({
      query: (body) => ({ url: '/addresses', method: 'POST', body }),
      invalidatesTags: ['Addresses'],
    }),
  }),
})

export const { useGetMyAddressesQuery, useCreateAddressMutation } = addressApi