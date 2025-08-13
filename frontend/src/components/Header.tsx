import React, { useEffect, useState } from 'react'
import { Link, NavLink, type NavLinkProps, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { logout } from '../features/authSlice'
import HeaderOrders from './HeaderOrders'
export const Header: React.FC = () => {
  const [sp] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [q, setQ] = useState(sp.get('q') ?? '')
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => setQ(sp.get('q') ?? ''), [sp])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const next = new URLSearchParams(sp)
    if (q.trim()) next.set('q', q.trim())
    else next.delete('q')
    next.delete('page')
    navigate({ pathname: '/', search: next.toString() })
  }
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const base = 'inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100'
  type NavClassFn = Exclude<NavLinkProps['className'], string>
  const navItem: NavClassFn = ({ isActive }) => `${base} ${isActive ? 'text-black' : 'text-gray-700'}`
  return (
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight">
          <span className="px-2 py-1 rounded-lg bg-gray-900 text-white">Mall</span>{' '}
          <span className="text-gray-700">Shop</span>
        </Link>

        <form onSubmit={onSubmit} className="flex-1 max-w-xl mx-6 hidden md:block">
          <div className="flex items-center gap-2 h-10 rounded-xl border px-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-transparent outline-none text-sm"
            />
            <button type="submit" className="text-sm text-black rounded-lg border px-3 py-1.5
                                            cursor-pointer hover:text-white hover:bg-gray-800
                                            transition-all duration-200">
              Search
            </button>
          </div>
        </form>
        {!user ? (
          <div className="flex items-center gap-2">
            <NavLink to="/login" className={navItem}>Sign in</NavLink>
            <NavLink
              to="/register"
              className={`${base} bg-gray-900 text-white hover:opacity-90`}
            >
              Register
            </NavLink>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/profile" className={`${base} text-gray-700 hover:underline`}>
              Hi, {user.name}
            </Link>
            <NavLink to="/cart" className={navItem}>Cart</NavLink>
            <HeaderOrders />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-900 text-white hover:opacity-70 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}