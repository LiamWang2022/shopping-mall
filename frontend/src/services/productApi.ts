import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/** ====== Types ====== */
export interface ProductImage {
  url: string
  alt?: string
}

export interface Product {
  _id: string
  display_name: string
  price: number
  images: ProductImage[]
  product_description?: string
  shipping_description?: string
  stock_count?: number
  isActive?: boolean
  category?: string | { _id: string; name: string }
  colour?: string
  shop?: string | { _id: string; name: string }
}

export interface ProductListResponse {
  items: Product[]
  total?: number
  page?: number
  limit?: number
}

export type ProductQueryParams = {
  q?: string
  category?: string
  page?: number
  limit?: number
}


const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, ProductQueryParams | undefined>({
      query: (params: ProductQueryParams = {}) => ({
        url: 'products',
        params,
      }),
      transformResponse: (resp: Product[] | ProductListResponse): ProductListResponse => {
        if (Array.isArray(resp)) {
          return { items: resp }
        }
        return resp
      },
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`
    }),
  }),
})

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi
