import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetProductsQuery } from '../services/productApi'
import { ProductCard } from '../components/ProductCard'
import { SkeletonCard } from '../components/SkeletonCard'

const categories = ['All', 'Beauty', 'Clothing', 'Electronics', 'Home']

export const HomePage: React.FC = () => {
  const [sp, setSp] = useSearchParams()
  const page = Number(sp.get('page') ?? '1')
  const limit = Number(sp.get('limit') ?? '12')
  const q = sp.get('q') ?? undefined
  const category = sp.get('category') ?? undefined

  const { data, isLoading, error } = useGetProductsQuery({
    page,
    limit,
    q,
    category: category && category !== 'All' ? category : undefined,
  })

  const items = data?.items ?? []
  const hasPrev = page > 1
  const hasNext = data?.total ? page * limit < data.total : items.length === limit

  const setPage = (n: number) => {
    const next = new URLSearchParams(sp)
    next.set('page', String(n))
    next.set('limit', String(limit))
    setSp(next)
  }

  const setCategory = (c: string) => {
    const next = new URLSearchParams(sp)
    if (c === 'All') next.delete('category')
    else next.set('category', c)
    next.delete('page')
    setSp(next)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <section className="rounded-3xl border bg-gradient-to-br from-gray-50 to-white p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Discover products you’ll love
        </h1>
        <p className="text-gray-600 mt-2">
          Fresh arrivals, clean layout, smooth browsing.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setCategory('All')}
            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Shop now
          </button>
          <a href="#catalog" className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50">
            Browse catalog
          </a>
        </div>
      </section>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const active = (sp.get('category') ?? 'All') === c
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-sm rounded-full border ${
                active ? 'bg-gray-900 text-white border-gray-900' : 'hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          )
        })}
      </div>

      {/* Catalog */}
      <section id="catalog">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-600">Failed to load products.</div>
        )}

        {!isLoading && !error && (
          <>
            {items.length === 0 ? (
              <div className="text-center py-20 text-gray-600">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                disabled={!hasPrev}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 text-sm rounded-lg border disabled:opacity-50 hover:bg-gray-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">Page {page}</span>
              <button
                disabled={!hasNext}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 text-sm rounded-lg border disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}