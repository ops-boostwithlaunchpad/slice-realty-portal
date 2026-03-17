'use client'

import { useState, useCallback } from 'react'
import { Client, FollowUp } from '@/lib/types'
import { DUMMY_CLIENTS, DUMMY_FOLLOW_UPS } from '@/lib/dummy'
import { X, Plus } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  prospect: { label: 'Prospect', color: '#C41E2A', bg: '#FFF0F0' },
  active: { label: 'Active', color: '#16A34A', bg: '#F0FDF4' },
  closed: { label: 'Closed', color: '#6B7280', bg: '#F9FAFB' },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: '#6B7280', bg: '#F9FAFB' }
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </span>
  )
}

function ClientDetailPanel({
  client,
  onClose,
  onUpdate,
}: {
  client: Client
  onClose: () => void
  onUpdate: (updated: Client) => void
}) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [newNote, setNewNote] = useState('')
  const [status, setStatus] = useState(client.status)
  const [addingNote, setAddingNote] = useState(false)
  const [savingStatus, setSavingStatus] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadFollowUps = useCallback(() => {
    const dummyFu = DUMMY_FOLLOW_UPS.filter((f) => f.client_id === client.id)
    setFollowUps(dummyFu)
    setLoading(false)
  }, [client.id])

  // Load on mount
  if (loading && followUps.length === 0) {
    loadFollowUps()
  }

  const addFollowUp = () => {
    if (!newNote.trim()) return
    setAddingNote(true)
    const newFollowUp: FollowUp = {
      id: `fu-${Date.now()}`,
      client_id: client.id,
      note: newNote.trim(),
      created_at: new Date().toISOString(),
    }
    setFollowUps([newFollowUp, ...followUps])
    setNewNote('')
    setAddingNote(false)
  }

  const updateStatus = (newStatus: string) => {
    setSavingStatus(true)
    setStatus(newStatus)
    onUpdate({ ...client, status: newStatus })
    setSavingStatus(false)
  }

  const formatBudget = () => {
    if (!client.budget_min && !client.budget_max) return null
    const fmt = (n: number) =>
      n >= 1000000
        ? `$${(n / 1000000).toFixed(1)}M`
        : `$${(n / 1000).toFixed(0)}K`
    if (client.budget_min && client.budget_max)
      return `${fmt(client.budget_min)} – ${fmt(client.budget_max)}`
    if (client.budget_min) return `From ${fmt(client.budget_min)}`
    return `Up to ${fmt(client.budget_max!)}`
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-end z-50">
      <div className="bg-white h-full w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0"
          style={{ borderTop: '3px solid #C41E2A' }}
        >
          <h2
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            {client.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Client Info */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <StatusBadge status={status} />
              <select
                value={status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={savingStatus}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none"
              >
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              {client.phone && (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide w-16 flex-shrink-0" style={{ color: '#C41E2A' }}>Phone</span>
                  <span className="text-sm text-gray-700">{client.phone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide w-16 flex-shrink-0" style={{ color: '#C41E2A' }}>Email</span>
                  <span className="text-sm text-gray-700 break-all">{client.email}</span>
                </div>
              )}
              {formatBudget() && (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide w-16 flex-shrink-0" style={{ color: '#C41E2A' }}>Budget</span>
                  <span className="text-sm text-gray-700">{formatBudget()}</span>
                </div>
              )}
              {client.preferred_areas && (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide w-16 flex-shrink-0" style={{ color: '#C41E2A' }}>Areas</span>
                  <span className="text-sm text-gray-700">{client.preferred_areas}</span>
                </div>
              )}
              {client.source && (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide w-16 flex-shrink-0" style={{ color: '#C41E2A' }}>Source</span>
                  <span className="text-sm text-gray-700">{client.source}</span>
                </div>
              )}
              <div className="text-xs text-gray-400 pt-1 border-t border-gray-50">
                Added {new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Follow-up Log */}
          <div className="px-5 py-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-dm-serif)' }}>Follow-up Log</h3>

            {/* Add note */}
            <div className="mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a follow-up note..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:border-red-300"
              />
              <button
                onClick={addFollowUp}
                disabled={addingNote || !newNote.trim()}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-opacity"
                style={{ backgroundColor: '#C41E2A' }}
              >
                <Plus size={14} />
                {addingNote ? 'Adding...' : 'Add Follow-up'}
              </button>
            </div>

            {/* Log entries */}
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : followUps.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No follow-ups logged yet.</p>
            ) : (
              <div className="space-y-2">
                {followUps.map((fu) => (
                  <div
                    key={fu.id}
                    className="rounded-xl px-3 py-2.5 border border-gray-100"
                    style={{ backgroundColor: '#FAFAFA' }}
                  >
                    <p className="text-xs text-gray-400 mb-1">
                      {new Date(fu.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-gray-700 leading-snug">{fu.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(DUMMY_CLIENTS)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [search, setSearch] = useState('')
  const [loading] = useState(false)

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q) ||
      (c.preferred_areas ?? '').toLowerCase().includes(q)
    )
  })

  const handleUpdate = (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    if (selectedClient?.id === updated.id) setSelectedClient(updated)
  }

  const formatBudget = (c: Client) => {
    if (!c.budget_min && !c.budget_max) return '—'
    const fmt = (n: number) =>
      n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`
    if (c.budget_min && c.budget_max) return `${fmt(c.budget_min)} – ${fmt(c.budget_max)}`
    if (c.budget_min) return `From ${fmt(c.budget_min)}`
    return `Up to ${fmt(c.budget_max!)}`
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            Clients
          </h1>
          <p className="text-sm text-gray-500 mt-1">{clients.length} total clients</p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-60 focus:outline-none focus:border-red-300"
        />
      </div>

      <div
        className="bg-white rounded-xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #F3F4F6' }}>
              <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                Name
              </th>
              <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-3.5">
                Phone
              </th>
              <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-3.5">
                Email
              </th>
              <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-3.5">
                Budget
              </th>
              <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-3.5">
                Status
              </th>
              <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-3.5">
                Preferred Areas
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  {[...Array(6)].map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                  {search ? 'No clients match your search.' : 'No clients yet. Add a prospect from the dashboard.'}
                </td>
              </tr>
            ) : (
              filtered.map((client, idx) => (
                <tr
                  key={client.id}
                  className="cursor-pointer transition-colors"
                  style={{
                    borderBottom: idx < filtered.length - 1 ? '1px solid #F9FAFB' : 'none',
                  }}
                  onClick={() => setSelectedClient(client)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#FFF0F0' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent' }}
                >
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{client.name}</td>
                  <td className="px-4 py-3.5 text-gray-500">{client.phone ?? '—'}</td>
                  <td className="px-4 py-3.5 text-gray-500 truncate max-w-[180px]">
                    {client.email ?? '—'}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{formatBudget(client)}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={client.status} />
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 truncate max-w-[180px]">
                    {client.preferred_areas ?? '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedClient && (
        <ClientDetailPanel
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}
