import React, { useState } from 'react'
import { useRegisterMutation } from '../services/authApi'
import { useNavigate, Link } from 'react-router-dom'
import type { FetchBaseQueryError} from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'
function getNiceError(e: unknown): string {
  const isFBQ = (x: unknown): x is FetchBaseQueryError =>
    typeof x === 'object' && x !== null && 'status' in x
  const isSE = (x: unknown): x is SerializedError =>
    typeof x === 'object' && x !== null && 'message' in x && 'name' in x
  if (isFBQ(e)) {
    const s = e.status
    if (typeof s === 'number') {
      if (s === 400) return 'Email already exists.'
      const msg = (e.data as { message?: string; error?: string } | undefined)
      if (msg?.message) return msg.message
      if (msg?.error) return msg.error
      return `Request failed (${s}).`
    }
    if (s === 'FETCH_ERROR') return 'Network error. Please check your connection.'
    return 'Request failed.'
  }
  if (isSE(e)) return e.message ?? 'Something went wrong.'
  return 'Something went wrong.'
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [register, { isLoading, isSuccess }] = useRegisterMutation()
  const navigate = useNavigate()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errorMsg) setErrorMsg(null)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    try {
      await register(form).unwrap()
      navigate('/login', { replace: true })
    } catch (e) {
      setErrorMsg(getNiceError(e))
    }
  }

  const canSubmit = form.name.trim() && form.email.trim() && form.password.trim() && !isLoading

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      {errorMsg && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {errorMsg}
        </div>
      )}
      {isSuccess && (
        <div role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 text-green-700 px-3 py-2 text-sm">
          Register successful. Please login.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
        </div>

        <button
          disabled={!canSubmit}
          className="w-full rounded-lg bg-gray-900 text-white px-4 py-2 hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Registering…' : 'Create account'}
        </button>

        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
