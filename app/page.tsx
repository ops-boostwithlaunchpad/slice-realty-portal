'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Deal } from '@/lib/types'
import { DUMMY_DEALS, DUMMY_LISTINGS, DUMMY_CLIENTS, DUMMY_AGENTS } from '@/lib/dummy'
import { Plus, X, ArrowLeft } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'
import { useRole } from '@/lib/auth'

interface Stats {
  prospects: number
  appointments: number
  pending: number
  sold: number
  listings: number
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer hover:shadow-md transition-shadow"
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        borderTop: '3px solid #C41E2A',
      }}
    >
      <p className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-dm-serif)' }}>{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}

const MODAL_STEPS = [
  {
    title: 'Contact Info',
    subtitle: 'Start with the basics',
    image: 'https://picsum.photos/seed/slice-step1/480/560',
  },
  {
    title: 'Budget & Areas',
    subtitle: 'Financial range and location preferences',
    image: 'https://picsum.photos/seed/slice-step2/480/560',
  },
  {
    title: 'Property & Source',
    subtitle: 'Property of interest and lead source',
    image: 'https://picsum.photos/seed/slice-step3/480/560',
  },
]

function AddProspectModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    budget_min: '',
    budget_max: '',
    preferred_areas: '',
    source: '',
    property_address: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleNext = () => {
    if (step === 0 && !form.name.trim()) {
      setError('Full name is required')
      return
    }
    setError('')
    setStep((s) => s + 1)
  }

  const handleSubmit = () => {
    setLoading(true)
    setError('')
    // Demo mode: just close the modal
    setLoading(false)
    onSuccess()
    onClose()
  }

  const numSteps = MODAL_STEPS.length
  const slidePercent = step * (100 / numSteps)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Modal shell — fixed size, clips the sliding track */}
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ width: 720, height: 480 }}
      >
        {/* Sliding track: numSteps × modal width, slides horizontally */}
        <div
          style={{
            display: 'flex',
            width: `${numSteps * 100}%`,
            height: '100%',
            transform: `translateX(-${slidePercent}%)`,
            transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {MODAL_STEPS.map((s, i) => (
            <div
              key={i}
              style={{ width: `${100 / numSteps}%`, height: '100%', display: 'flex', flexShrink: 0 }}
            >
              {/* Left: image */}
              <div className="relative flex-shrink-0" style={{ width: 240 }}>
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="240px"
                  priority={i === 0}
                />
                {/* Overlay with step label */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-5"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }}
                >
                  <span className="text-white text-xs font-medium opacity-70 mb-1">
                    Step {i + 1} of {numSteps}
                  </span>
                  <p className="text-white font-bold text-base leading-tight" style={{ fontFamily: 'var(--font-dm-serif)' }}>
                    {s.title}
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">{s.subtitle}</p>
                </div>
              </div>

              {/* Right: form content */}
              <div className="flex flex-col flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                  <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: 'var(--font-dm-serif)' }}>
                    Add New Prospect
                  </h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={18} />
                  </button>
                </div>

                {/* Fields */}
                <div className="flex-1 px-6 py-5 flex flex-col gap-3 overflow-y-auto">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  {i === 0 && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                          placeholder="Jane Doe"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                          placeholder="(305) 000-0000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                          placeholder="jane@email.com"
                        />
                      </div>
                    </>
                  )}

                  {i === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Budget Min ($)</label>
                          <input
                            type="number"
                            value={form.budget_min}
                            onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                            placeholder="200,000"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Budget Max ($)</label>
                          <input
                            type="number"
                            value={form.budget_max}
                            onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                            placeholder="500,000"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Preferred Areas</label>
                        <input
                          type="text"
                          value={form.preferred_areas}
                          onChange={(e) => setForm({ ...form, preferred_areas: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                          placeholder="Miami Beach, Coral Gables"
                        />
                      </div>
                    </>
                  )}

                  {i === 2 && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Property of Interest</label>
                        <input
                          type="text"
                          value={form.property_address}
                          onChange={(e) => setForm({ ...form, property_address: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                          placeholder="123 Ocean Dr, Miami Beach, FL"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Lead Source</label>
                        <input
                          type="text"
                          value={form.source}
                          onChange={(e) => setForm({ ...form, source: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                          placeholder="Zillow, Referral, Open House…"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Footer nav */}
                <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
                  {/* Progress dots */}
                  <div className="flex gap-1.5 flex-1">
                    {MODAL_STEPS.map((_, di) => (
                      <span
                        key={di}
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: di === step ? 20 : 6,
                          backgroundColor: di === step ? '#C41E2A' : '#E5E7EB',
                        }}
                      />
                    ))}
                  </div>

                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => { setError(''); setStep((s) => s - 1) }}
                      className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft size={14} />
                      Back
                    </button>
                  )}

                  {step < numSteps - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#C41E2A' }}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#C41E2A' }}
                    >
                      {loading ? 'Adding…' : 'Add Prospect'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ManagerDashboard() {
  const activeAgents = DUMMY_AGENTS.filter((a) => a.status === 'active')
  const totalDeals = DUMMY_AGENTS.reduce((s, a) => s + a.deals_closed, 0)
  const totalVolume = DUMMY_AGENTS.reduce((s, a) => s + a.total_volume, 0)
  const totalCommission = DUMMY_AGENTS.reduce((s, a) => s + a.commission_earned, 0)
  const totalClients = DUMMY_AGENTS.reduce((s, a) => s + a.active_clients, 0)
  const avgDealSize = totalDeals > 0 ? totalVolume / totalDeals : 0

  const fmt = (n: number) =>
    n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${n.toLocaleString()}`

  const pipelineData = [
    { name: 'Prospects', value: DUMMY_DEALS.filter((d) => d.stage === 'prospect').length, color: '#3B82F6' },
    { name: 'Appointments', value: DUMMY_DEALS.filter((d) => d.stage === 'appointment').length, color: '#F59E0B' },
    { name: 'Pending', value: DUMMY_DEALS.filter((d) => d.stage === 'pending').length, color: '#8B5CF6' },
    { name: 'Sold', value: DUMMY_DEALS.filter((d) => d.stage === 'sold').length, color: '#10B981' },
  ]

  const agentPerformance = DUMMY_AGENTS
    .filter((a) => a.status === 'active')
    .sort((a, b) => b.total_volume - a.total_volume)
    .map((a) => ({ name: a.name.split(' ')[0], volume: a.total_volume, deals: a.deals_closed }))

  const listingsBreakdown = [
    { name: 'Active', value: DUMMY_LISTINGS.filter((l) => l.status === 'active').length, color: '#10B981' },
    { name: 'Under Contract', value: DUMMY_LISTINGS.filter((l) => l.status === 'under_contract').length, color: '#F59E0B' },
    { name: 'Sold', value: DUMMY_LISTINGS.filter((l) => l.status === 'sold').length, color: '#6B7280' },
  ]

  const recentDeals: Deal[] = [...DUMMY_DEALS]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  const stageBadge = (stage: string) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      prospect: { label: 'Prospect', color: '#2563EB', bg: '#EFF6FF' },
      appointment: { label: 'Appointment', color: '#D97706', bg: '#FFFBEB' },
      pending: { label: 'Pending', color: '#7C3AED', bg: '#F5F3FF' },
      sold: { label: 'Sold', color: '#16A34A', bg: '#F0FDF4' },
    }
    const s = map[stage] ?? { label: stage, color: '#6B7280', bg: '#F9FAFB' }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ color: s.color, backgroundColor: s.bg }}>
        {s.label}
      </span>
    )
  }

  const cardStyle = { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-dm-serif)' }}>
          Team Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Row 1: Key team stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Active Agents', value: activeAgents.length.toString(), accent: '#3B82F6' },
          { label: 'Total Clients', value: totalClients.toString(), accent: '#F59E0B' },
          { label: 'Deals Closed', value: totalDeals.toString(), accent: '#10B981' },
          { label: 'Total Volume', value: fmt(totalVolume), accent: '#8B5CF6' },
          { label: 'Commission Earned', value: fmt(totalCommission), accent: '#C41E2A' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 p-5"
            style={{ ...cardStyle, borderTop: `3px solid ${stat.accent}` }}
          >
            <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-dm-serif)' }}>
              {stat.value}
            </p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Pipeline + Agent Performance */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        {/* Team Pipeline */}
        <div className="bg-white rounded-xl border border-gray-100 p-5" style={cardStyle}>
          <h2 className="text-sm font-bold text-gray-800 mb-0.5" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1rem' }}>
            Team Pipeline
          </h2>
          <p className="text-xs text-gray-400 mb-4">All deals across agents</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={pipelineData} layout="vertical" margin={{ left: 0, right: 24, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#4B5563' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ border: '1px solid #F3F4F6', borderRadius: 8, fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} formatter={(v) => [v, 'Deals']} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {pipelineData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Performance Comparison */}
        <div className="bg-white rounded-xl border border-gray-100 p-5" style={cardStyle}>
          <h2 className="font-bold text-gray-800 mb-0.5" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1rem' }}>
            Agent Performance
          </h2>
          <p className="text-xs text-gray-400 mb-4">Volume by agent</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={agentPerformance} margin={{ left: 0, right: 24, top: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4B5563' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ border: '1px solid #F3F4F6', borderRadius: 8, fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} formatter={(v) => [fmt(v as number), 'Volume']} />
              <Bar dataKey="volume" radius={[6, 6, 0, 0]} maxBarSize={48} fill="#C41E2A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Listings + Financial + Recent */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Listings Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-5" style={cardStyle}>
          <h2 className="text-sm font-bold text-gray-800 mb-0.5" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1rem' }}>
            Listings Status
          </h2>
          <p className="text-xs text-gray-400 mb-2">Portfolio breakdown</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={listingsBreakdown} cx="50%" cy="45%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                {listingsBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ border: '1px solid #F3F4F6', borderRadius: 8, fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-5" style={cardStyle}>
          <h2 className="font-bold text-gray-800 mb-0.5" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1rem' }}>
            Financial Summary
          </h2>
          <p className="text-xs text-gray-400 mb-4">Team YTD performance</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Closed', value: fmt(totalVolume), accent: '#10B981' },
              { label: 'Commission', value: fmt(totalCommission), accent: '#C41E2A' },
              { label: 'Avg Deal Size', value: fmt(avgDealSize), accent: '#F59E0B' },
              { label: 'Active Listings', value: DUMMY_LISTINGS.filter((l) => l.status === 'active').length.toString(), accent: '#3B82F6' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3" style={{ backgroundColor: '#FAFAFA', borderLeft: `3px solid ${s.accent}` }}>
                <p className="text-xs text-gray-400 mb-1 leading-tight">{s.label}</p>
                <p className="text-base font-bold text-gray-900" style={{ fontFamily: 'var(--font-dm-serif)' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Leaderboard */}
        <div className="bg-white rounded-xl border border-gray-100 p-5" style={cardStyle}>
          <h2 className="font-bold text-gray-800 mb-0.5" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1rem' }}>
            Agent Leaderboard
          </h2>
          <p className="text-xs text-gray-400 mb-4">Top performers by volume</p>
          <div className="flex flex-col gap-3">
            {DUMMY_AGENTS
              .filter((a) => a.status === 'active')
              .sort((a, b) => b.total_volume - a.total_volume)
              .map((agent, i) => {
                const initials = agent.name.split(' ').map((n) => n[0]).join('')
                const medals = ['#FFD700', '#C0C0C0', '#CD7F32']
                return (
                  <div key={agent.id} className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: medals[i] ?? '#C41E2A' }}
                    >
                      {initials}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{agent.name}</p>
                      <p className="text-xs text-gray-400">{agent.deals_closed} deals</p>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{fmt(agent.total_volume)}</span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Activity */}
      <div
        className="bg-white rounded-xl border border-gray-100"
        style={cardStyle}
      >
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1.05rem' }}>Recent Activity</h2>
          <p className="text-xs text-gray-500 mt-0.5">Latest deal updates across all agents</p>
        </div>
        <div className="divide-y divide-gray-50">
          {recentDeals.map((deal) => (
            <div key={deal.id} className="px-5 py-3.5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#C41E2A' }} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{deal.clients?.name ?? 'Unknown Client'}</p>
                <p className="text-xs text-gray-400 truncate">{deal.property_address ?? 'No address'}</p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-3 flex-shrink-0">
                {stageBadge(deal.stage)}
                <span className="text-xs text-gray-400">{formatDate(deal.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const role = useRole()

  if (role === 'manager') {
    return <ManagerDashboard />
  }

  const dummyStats: Stats = {
    prospects: DUMMY_DEALS.filter((d) => d.stage === 'prospect').length,
    appointments: DUMMY_DEALS.filter((d) => d.stage === 'appointment').length,
    pending: DUMMY_DEALS.filter((d) => d.stage === 'pending').length,
    sold: DUMMY_DEALS.filter((d) => d.stage === 'sold').length,
    listings: DUMMY_LISTINGS.length,
  }
  const dummyUpcoming = DUMMY_DEALS.filter((d) => d.stage === 'appointment' && d.appointment_at)

  const stats = dummyStats
  const listingsBreakdown = {
    active: DUMMY_LISTINGS.filter((l) => l.status === 'active').length,
    under_contract: DUMMY_LISTINGS.filter((l) => l.status === 'under_contract').length,
    sold: DUMMY_LISTINGS.filter((l) => l.status === 'sold').length,
  }
  const recentDeals: Deal[] = [...DUMMY_DEALS].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5)
  const upcomingAppointments: Deal[] = dummyUpcoming
  const [showModal, setShowModal] = useState(false)
  const loading = false

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const stageBadge = (stage: string) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      prospect: { label: 'Prospect', color: '#2563EB', bg: '#EFF6FF' },
      appointment: { label: 'Appointment', color: '#D97706', bg: '#FFFBEB' },
      pending: { label: 'Pending', color: '#7C3AED', bg: '#F5F3FF' },
      sold: { label: 'Sold', color: '#16A34A', bg: '#F0FDF4' },
    }
    const s = map[stage] ?? { label: stage, color: '#6B7280', bg: '#F9FAFB' }
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
        style={{ color: s.color, backgroundColor: s.bg }}
      >
        {s.label}
      </span>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-dm-serif)' }}>
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#C41E2A' }}
        >
          <Plus size={16} />
          Add Prospect
        </button>
      </div>

      {/* Row 1: Pipeline Overview (full width) */}
      {(() => {
        const pipelineData = [
          { name: 'Prospects', value: stats.prospects, color: '#3B82F6' },
          { name: 'Appointments', value: stats.appointments, color: '#F59E0B' },
          { name: 'Pending', value: stats.pending, color: '#8B5CF6' },
          { name: 'Sold', value: stats.sold, color: '#10B981' },
        ]
        const cardStyle = { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }

        return (
          <div className="mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5" style={cardStyle}>
              <h2 className="text-sm font-bold text-gray-800 mb-0.5" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1rem' }}>
                Pipeline Overview
              </h2>
              <p className="text-xs text-gray-400 mb-4">Deals by stage</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={pipelineData} layout="vertical" margin={{ left: 0, right: 24, top: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#4B5563' }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip
                    cursor={{ fill: '#F9FAFB' }}
                    contentStyle={{ border: '1px solid #F3F4F6', borderRadius: 8, fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    formatter={(v) => [v, 'Deals']}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {pipelineData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      })()}

      {/* Row 2: Listings Status + Lead Sources + Financial Summary (3 columns) */}
      {(() => {
        const donutData = [
          { name: 'Active', value: listingsBreakdown.active, color: '#10B981' },
          { name: 'Under Contract', value: listingsBreakdown.under_contract, color: '#F59E0B' },
          { name: 'Sold', value: listingsBreakdown.sold, color: '#6B7280' },
        ]

        const sourceMap: Record<string, number> = {}
        DUMMY_CLIENTS.forEach((c) => {
          if (c.source) sourceMap[c.source] = (sourceMap[c.source] ?? 0) + 1
        })
        const sourceData = Object.entries(sourceMap)
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value }))

        const cardStyle = { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }
        const total = sourceData.reduce((s, d) => s + d.value, 0)
        const barColors = ['#C41E2A', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#6B7280']

        const soldDeals = DUMMY_DEALS.filter((d) => d.stage === 'sold')
        const totalCommission = soldDeals.reduce((s, d) => s + (d.commission ?? 0), 0)
        const totalClosed = soldDeals.reduce((s, d) => s + (d.sale_price ?? 0), 0)
        const pipelineValue = DUMMY_DEALS.filter((d) => d.stage === 'pending').reduce((s, d) => s + (d.offer_amount ?? 0), 0)
        const avgSalePrice = soldDeals.length ? totalClosed / soldDeals.length : 0

        const fmt = (n: number) =>
          n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${n.toLocaleString()}`

        const financialStats = [
          { label: 'Total Closed Sales', value: fmt(totalClosed), accent: '#10B981' },
          { label: 'Commission Earned', value: fmt(totalCommission), accent: '#C41E2A' },
          { label: 'Active Pipeline', value: fmt(pipelineValue), accent: '#8B5CF6' },
          { label: 'Avg. Sale Price', value: fmt(avgSalePrice), accent: '#F59E0B' },
        ]

        return (
          <div className="grid grid-cols-3 gap-5 mb-6">
            {/* Listings Status */}
            <div className="bg-white rounded-xl border border-gray-100 p-5" style={cardStyle}>
              <h2 className="text-sm font-bold text-gray-800 mb-0.5" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1rem' }}>
                Listings Status
              </h2>
              <p className="text-xs text-gray-400 mb-2">Portfolio breakdown</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="45%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ border: '1px solid #F3F4F6', borderRadius: 8, fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Lead Sources */}
            <div className="bg-white rounded-xl border border-gray-100 p-5" style={cardStyle}>
              <h2 className="font-bold text-gray-800 mb-0.5" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1rem' }}>
                Lead Sources
              </h2>
              <p className="text-xs text-gray-400 mb-4">Where your clients come from</p>
              <div className="flex flex-col gap-3">
                {sourceData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-24 flex-shrink-0">{s.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(s.value / total) * 100}%`, backgroundColor: barColors[i % barColors.length] }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-4 text-right">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-5" style={cardStyle}>
              <h2 className="font-bold text-gray-800 mb-0.5" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1rem' }}>
                Financial Summary
              </h2>
              <p className="text-xs text-gray-400 mb-4">YTD performance</p>
              <div className="grid grid-cols-2 gap-3">
                {financialStats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-3"
                    style={{ backgroundColor: '#FAFAFA', borderLeft: `3px solid ${s.accent}` }}
                  >
                    <p className="text-xs text-gray-400 mb-1 leading-tight">{s.label}</p>
                    <p className="text-base font-bold text-gray-900" style={{ fontFamily: 'var(--font-dm-serif)' }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}

      <div className="grid grid-cols-5 gap-5">
        {/* Recent Activity */}
        <div
          className="col-span-3 bg-white rounded-xl border border-gray-100"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1.05rem' }}>Recent Activity</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest 5 deal updates</p>
          </div>
          <div className="divide-y divide-gray-50">
            {recentDeals.length === 0 && !loading ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No deals yet. Add a prospect to get started.
              </div>
            ) : (
              recentDeals.map((deal) => (
                <div key={deal.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: '#C41E2A' }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {deal.clients?.name ?? 'Unknown Client'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {deal.property_address ?? 'No address'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-3 flex-shrink-0">
                    {stageBadge(deal.stage)}
                    <span className="text-xs text-gray-400">{formatDate(deal.updated_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div
          className="col-span-2 bg-white rounded-xl border border-gray-100"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1.05rem' }}>Upcoming Appointments</h2>
            <p className="text-xs text-gray-500 mt-0.5">This week</p>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingAppointments.length === 0 && !loading ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No appointments scheduled this week.
              </div>
            ) : (
              upcomingAppointments.map((deal) => (
                <div key={deal.id} className="px-5 py-3.5 flex items-center gap-4">
                  <div
                    className="flex-shrink-0 rounded-xl px-3 py-2 text-center"
                    style={{ backgroundColor: '#FFF0F0', minWidth: 52 }}
                  >
                    {deal.appointment_at ? (
                      <>
                        <p className="text-xs font-medium uppercase" style={{ color: '#C41E2A' }}>
                          {new Date(deal.appointment_at).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                        <p className="text-lg font-bold leading-none" style={{ color: '#C41E2A' }}>
                          {new Date(deal.appointment_at).getDate()}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs font-medium" style={{ color: '#C41E2A' }}>TBD</p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {deal.clients?.name ?? 'Unknown Client'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {deal.appointment_at
                        ? new Date(deal.appointment_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Time TBD'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <AddProspectModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  )
}
