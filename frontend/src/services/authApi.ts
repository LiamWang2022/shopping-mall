import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface UserDTO {
  id: string
  name: string
  email: string
  roles: string[]
  activeRole: 'buyer' | 'seller'
}

export interface LoginResponse {
  message: string
  token: string
  user: UserDTO
}

export interface RegisterResponse {
  message: string
  user: UserDTO
}

interface LoginRequest { email: string; password: string }
interface RegisterRequest extends LoginRequest { name: string }

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'api'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (b) => ({
    login: b.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: 'users/login', method: 'POST', body }),
    }),
    register: b.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: 'users/register', method: 'POST', body }),
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation } = authApi