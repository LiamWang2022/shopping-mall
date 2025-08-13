import React, { useEffect, useState } from 'react'
import { useGetProfileQuery, useUpdateProfileMutation } from '../services/userApi'
import { useGetMyAddressesQuery, useCreateAddressMutation, type Address } from '../services/addressApi'

export default function ProfilePage() {
  const { data: profile, isLoading: loadingProfile } = useGetProfileQuery()
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation()

  const { data: addrData, isLoading: loadingAddr } = useGetMyAddressesQuery()
  const [createAddress, { isLoading: creatingAddr }] = useCreateAddressMutation()

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [addrForm, setAddrForm] = useState({
    country: '',
    province: '',
    city: '',
    detail: '',
    postcode: '',
    isDefault: false,
  })

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '')
      setAvatar(profile.avatar ?? '')
    }
  }, [profile])

  if (loadingProfile) return <div className="max-w-7xl mx-auto p-6">Loading profile…</div>

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile({ name, avatar }).unwrap()
    alert('Profile updated!')
  }

  const onCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    await createAddress(addrForm).unwrap()
    setAddrForm({ country: '', province: '', city: '', detail: '', postcode: '', isDefault: false })
    alert('Address created!')
  }

  const addresses: Address[] = addrData?.addresses ?? []

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Profile Card */}
      <div className="rounded-2xl border p-6 space-y-6">
        <div className="flex items-center gap-4">
          {avatar ? (
            <img src={avatar} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">🙂</div>
          )}
          <div>
            <div className="text-lg font-semibold">{profile?.email}</div>
            <div className="text-sm text-gray-600">
              Roles: {profile?.roles?.join(', ')} / Active: {profile?.activeRole}
            </div>
          </div>
        </div>

        <form onSubmit={onSaveProfile} className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Name</span>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Avatar URL</span>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://…"
            />
          </label>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={updating}
              className="rounded-xl bg-gray-900 text-white px-4 py-2 hover:opacity-90 disabled:opacity-60"
            >
              {updating ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Address List */}
      <div className="rounded-2xl border p-6">
        <h2 className="text-xl font-semibold mb-4">My Addresses</h2>
        {loadingAddr ? (
          <div>Loading addresses…</div>
        ) : addresses.length === 0 ? (
          <div className="text-gray-600">No address yet.</div>
        ) : (
          <ul className="space-y-3">
            {addresses.map((a) => (
              <li key={a._id} className="rounded-xl border p-4">
                <div className="font-medium">
                  {a.country} {a.province} {a.city} {a.detail}
                  {a.postcode ? ` (${a.postcode})` : ''}
                </div>
                {a.isDefault && <div className="text-xs text-green-700 mt-1">Default</div>}
              </li>
            ))}
          </ul>
        )}

        {/* Add Address */}
        <form onSubmit={onCreateAddress} className="grid sm:grid-cols-2 gap-4 mt-6">
          {(['country', 'province', 'city', 'detail', 'postcode'] as const).map((k) => (
            <label key={k} className="block">
              <span className="text-sm text-gray-600 capitalize">{k}</span>
              <input
                className="mt-1 w-full rounded-lg border p-2"
                value={(addrForm)[k]}
                onChange={(e) => setAddrForm((s) => ({ ...s, [k]: e.target.value }))}
                placeholder={k === 'detail' ? 'Street, building, room…' : ''}
                required={k !== 'postcode'}
              />
            </label>
          ))}
          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={addrForm.isDefault}
              onChange={(e) => setAddrForm((s) => ({ ...s, isDefault: e.target.checked }))}
            />
            <span className="text-sm">Set as default</span>
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={creatingAddr}
              className="rounded-xl bg-gray-900 text-white px-4 py-2 hover:opacity-90 disabled:opacity-60"
            >
              {creatingAddr ? 'Adding…' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}