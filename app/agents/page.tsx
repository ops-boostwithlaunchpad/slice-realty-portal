'use client'

import { useState } from 'react'
import { Agent } from '@/lib/types'
import { DUMMY_AGENTS } from '@/lib/dummy'
import { useRole } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Mail, Phone, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'

function AgentCard({ agent }: { agent: Agent }) {
  const initials = agent.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const fmt = (n: number) =>
    n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${n.toLocaleString()}`

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-lg"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: '#C41E2A' }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900 truncate" style={{ fontFamily: 'var(--font-dm-serif)' }}>
              {agent.name}
            </h3>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                color: agent.status === 'active' ? '#16A34A' : '#6B7280',
                backgroundColor: agent.status === 'active' ? '#F0FDF4' : '#F9FAFB',
              }}
            >
              {agent.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Mail size={12} />
              {agent.email}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
            <span className="flex items-center gap-1">
              <Phone size={12} />
              {agent.phone}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Joined {new Date(agent.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-px bg-gray-100 border-t border-gray-100">
        {[
          { label: 'Deals Closed', value: agent.deals_closed.toString(), icon: TrendingUp, accent: '#10B981' },
          { label: 'Active Clients', value: agent.active_clients.toString(), icon: Users, accent: '#3B82F6' },
          { label: 'Total Volume', value: fmt(agent.total_volume), icon: DollarSign, accent: '#8B5CF6' },
          { label: 'Commission', value: fmt(agent.commission_earned), icon: DollarSign, accent: '#C41E2A' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon size={12} style={{ color: stat.accent }} />
              <span className="text-xs text-gray-400">{stat.label}</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const role = useRole()
  const router = useRouter()
  const [agents] = useState<Agent[]>(DUMMY_AGENTS)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Only admin (CEO) can access this page
  if (role !== 'admin') {
    router.replace('/')
    return null
  }

  const filtered = filter === 'all' ? agents : agents.filter((a) => a.status === filter)

  const teamStats = {
    totalAgents: agents.filter((a) => a.status === 'active').length,
    totalDeals: agents.reduce((s, a) => s + a.deals_closed, 0),
    totalVolume: agents.reduce((s, a) => s + a.total_volume, 0),
    totalCommission: agents.reduce((s, a) => s + a.commission_earned, 0),
  }

  const fmt = (n: number) =>
    n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${n.toLocaleString()}`

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          Agents
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage your team of {teamStats.totalAgents} active agents</p>
      </div>

      {/* Team Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Agents', value: teamStats.totalAgents.toString(), accent: '#3B82F6' },
          { label: 'Total Deals Closed', value: teamStats.totalDeals.toString(), accent: '#10B981' },
          { label: 'Total Volume', value: fmt(teamStats.totalVolume), accent: '#8B5CF6' },
          { label: 'Total Commission', value: fmt(teamStats.totalCommission), accent: '#C41E2A' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 p-4"
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
              borderTop: `3px solid ${stat.accent}`,
            }}
          >
            <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-dm-serif)' }}>
              {stat.value}
            </p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: 'all' as const, label: 'All', count: agents.length },
          { key: 'active' as const, label: 'Active', count: agents.filter((a) => a.status === 'active').length },
          { key: 'inactive' as const, label: 'Inactive', count: agents.filter((a) => a.status === 'inactive').length },
        ].map(({ key, label, count }) => (
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
            <span className="ml-1.5 text-xs text-gray-400">{count}</span>
          </button>
        ))}
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-2 gap-5">
        {filtered.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}
