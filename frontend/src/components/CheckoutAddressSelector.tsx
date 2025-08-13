import React, { useMemo, useState } from 'react'
import { useCreateAddressMutation, useGetMyAddressesQuery, type CreateAddressBody, type Address } from '../services/addressApi'

interface Props {
  value?: string
  onChange: (addressId: string) => void
}

type TabKey = 'book' | 'new'

export default function CheckoutAddressSelector({ value, onChange }: Props) {
  const [tab, setTab] = useState<TabKey>('book')
  const { data, isLoading, isFetching } = useGetMyAddressesQuery()
  const [createAddress, { isLoading: creating }] = useCreateAddressMutation()

  const addresses: Address[] = data?.addresses ?? []

  // --- New address form state ---
  const [form, setForm] = useState<CreateAddressBody>({
    country: 'UK',
    province: 'England',
    city: '',
    detail: '',
    postcode: '',
    isDefault: false,
  })

  const canSubmitNew = useMemo(() => {
    return form.country.trim() && form.province.trim() && form.city.trim() && form.detail.trim()
  }, [form])

  const handleCreate = async () => {
    if (!canSubmitNew) return
    const res = await createAddress(form).unwrap()
    onChange(res.address._id)
    setTab('book')
  }

  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTab('book')}
          className={`rounded-xl px-3 py-1.5 border ${tab === 'book' ? 'bg-black text-white' : ''}`}
        >Address book</button>
        <button
          type="button"
          onClick={() => setTab('new')}
          className={`rounded-xl px-3 py-1.5 border ${tab === 'new' ? 'bg-black text-white' : ''}`}
        >New address</button>
      </div>

      {tab === 'book' ? (
        <div className="space-y-3">
          {isLoading || isFetching ? (
            <div className="text-gray-600">Loading addresses…</div>
          ) : addresses.length === 0 ? (
            <div className="text-gray-600">No addresses yet. Switch to “New address” to add one.</div>
          ) : (
            <ul className="space-y-3">
              {addresses.map((a) => (
                <li key={a._id} className={`rounded-xl border p-3 flex items-start justify-between ${value === a._id ? 'ring-2 ring-black' : ''}`}>
                  <div>
                    <div className="font-medium">{a.detail}, {a.city}</div>
                    <div className="text-sm text-gray-600">{a.province}, {a.country} {a.postcode}</div>
                    {a.isDefault && <div className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-900 text-white">Default</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={value === a._id}
                      onChange={() => onChange(a._id)}
                      className="h-4 w-4"
                    />
                    <button
                      type="button"
                      onClick={() => onChange(a._id)}
                      className="rounded-lg border px-3 py-1.5"
                    >Use</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="rounded-xl border px-3 py-2" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <input className="rounded-xl border px-3 py-2" placeholder="Province/State" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="rounded-xl border px-3 py-2" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input className="rounded-xl border px-3 py-2" placeholder="Postcode" value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} />
          </div>
          <input className="rounded-xl border px-3 py-2" placeholder="Address line" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
            Set as default
          </label>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!canSubmitNew || creating}
              onClick={handleCreate}
              className="rounded-xl border px-4 py-2 disabled:opacity-60"
            >{creating ? 'Saving…' : 'Save & use'}</button>
          </div>
        </div>
      )}
    </div>
  )
}