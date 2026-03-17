'use client'

import { useState } from 'react'
import { Listing } from '@/lib/types'
import { DUMMY_LISTINGS } from '@/lib/dummy'
import { X } from 'lucide-react'
import Image from 'next/image'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active: { label: 'Active', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  under_contract: { label: 'Under Contract', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  sold: { label: 'Sold', color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' }
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
      style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  )
}

const EMPTY_FORM = {
  address: '',
  price: '',
  beds: '',
  baths: '',
  sqft: '',
  status: 'active',
  agent_name: '',
  photo_url: '',
}

function ListingModal({
  listing,
  onClose,
  onSaved,
}: {
  listing?: Listing
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState(
    listing
      ? {
          address: listing.address,
          price: listing.price?.toString() ?? '',
          beds: listing.beds?.toString() ?? '',
          baths: listing.baths?.toString() ?? '',
          sqft: listing.sqft?.toString() ?? '',
          status: listing.status,
          agent_name: listing.agent_name ?? '',
          photo_url: listing.photo_url ?? '',
        }
      : EMPTY_FORM
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.address.trim()) {
      setError('Address is required')
      return
    }
    setLoading(true)
    setError('')
    // Demo mode: just close the modal
    setLoading(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
          style={{ borderTop: '3px solid #C41E2A', borderRadius: '16px 16px 0 0' }}
        >
          <h2
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            {listing ? 'Edit Listing' : 'Add Listing'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 grid grid-cols-2 gap-3">
          {error && (
            <div className="col-span-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Address *</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-300"
              placeholder="123 Ocean Dr, Miami Beach, FL 33139"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Price ($)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-300"
              placeholder="450000"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-300"
            >
              <option value="active">Active</option>
              <option value="under_contract">Under Contract</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Beds</label>
            <input
              type="number"
              value={form.beds}
              onChange={(e) => setForm({ ...form, beds: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-300"
              placeholder="3"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Baths</label>
            <input
              type="number"
              step="0.5"
              value={form.baths}
              onChange={(e) => setForm({ ...form, baths: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-300"
              placeholder="2"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sq Ft</label>
            <input
              type="number"
              value={form.sqft}
              onChange={(e) => setForm({ ...form, sqft: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-300"
              placeholder="1800"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Agent Name</label>
            <input
              type="text"
              value={form.agent_name}
              onChange={(e) => setForm({ ...form, agent_name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-300"
              placeholder="Sarah Johnson"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Photo URL</label>
            <input
              type="url"
              value={form.photo_url}
              onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-300"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div className="col-span-2 flex gap-2 pt-2 border-t border-gray-100 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C41E2A' }}
            >
              {loading ? 'Saving...' : listing ? 'Save Changes' : 'Add Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ListingCard({
  listing,
  onEdit,
}: {
  listing: Listing
  onEdit: (l: Listing) => void
}) {
  const formatPrice = (price: number | null) => {
    if (!price) return 'Price TBD'
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`
    return `$${price.toLocaleString()}`
  }

  const specsLine = [
    listing.beds != null ? `${listing.beds} bd` : null,
    listing.baths != null ? `${listing.baths} ba` : null,
    listing.sqft != null ? `${listing.sqft.toLocaleString()} sqft` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-lg"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      {/* Photo */}
      <div className="relative h-48 bg-gray-100">
        {listing.photo_url ? (
          <Image
            src={listing.photo_url}
            alt={listing.address}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
            <span className="text-5xl">🏠</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={listing.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 flex-1">
            {listing.address}
          </p>
          <button
            onClick={() => onEdit(listing)}
            className="text-xs font-medium flex-shrink-0 px-2 py-1 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
          >
            Edit
          </button>
        </div>

        <p
          className="text-2xl font-bold mb-3"
          style={{ color: '#C41E2A', fontFamily: 'var(--font-dm-serif)' }}
        >
          {formatPrice(listing.price)}
        </p>

        {specsLine && (
          <p className="text-xs text-gray-500 mb-2">{specsLine}</p>
        )}

        {listing.agent_name && (
          <div className="pt-2.5 border-t border-gray-50">
            <span className="text-xs text-gray-400">{listing.agent_name}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ListingsPage() {
  const [listings] = useState<Listing[]>(DUMMY_LISTINGS)
  const [showModal, setShowModal] = useState(false)
  const [editListing, setEditListing] = useState<Listing | undefined>()
  const [filter, setFilter] = useState('all')
  const [loading] = useState(false)

  const filtered = filter === 'all' ? listings : listings.filter((l) => l.status === filter)

  const counts = {
    all: listings.length,
    active: listings.filter((l) => l.status === 'active').length,
    under_contract: listings.filter((l) => l.status === 'under_contract').length,
    sold: listings.filter((l) => l.status === 'sold').length,
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            Listings
          </h1>
          <p className="text-sm text-gray-500 mt-1">{listings.length} properties</p>
        </div>
        <button
          onClick={() => {
            setEditListing(undefined)
            setShowModal(true)
          }}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#C41E2A' }}
        >
          + Add Listing
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'under_contract', label: 'Under Contract' },
          { key: 'sold', label: 'Sold' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: filter === key ? '#fff' : 'transparent',
              color: filter === key ? '#C41E2A' : '#6B7280',
              boxShadow: filter === key ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {label}
            <span className="ml-1.5 text-xs text-gray-400">
              {counts[key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          No listings found. Add your first listing to get started.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onEdit={(l) => {
                setEditListing(l)
                setShowModal(true)
              }}
            />
          ))}
        </div>
      )}

      {showModal && (
        <ListingModal
          listing={editListing}
          onClose={() => {
            setShowModal(false)
            setEditListing(undefined)
          }}
          onSaved={() => {}}
        />
      )}
    </div>
  )
}
