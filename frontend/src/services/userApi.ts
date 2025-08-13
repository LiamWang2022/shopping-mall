import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  roles: string[]
  activeRole: 'buyer' | 'seller'
}

export interface UpdateProfileBody {
  name?: string
  avatar?: string
}

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'api'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (b) => ({
    getProfile: b.query<UserProfile, void>({
      query: () => 'users/profile',
    }),
    updateProfile: b.mutation<{ message: string; user: UserProfile }, UpdateProfileBody>({
      query: (body) => ({
        url: 'users/profile',
        method: 'PUT',
        body,
      }),
    }),
  }),
})

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi