'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Bell,
  Check,
  CheckCheck,
  X,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { DUMMY_NOTIFICATIONS } from '@/lib/dummy'
import type { Notification, NotificationType } from '@/lib/types'

const TYPE_CONFIG: Record<
  NotificationType,
  { color: string; bg: string; label: string }
> = {
  follow_up_overdue: {
    color: '#DC2626',
    bg: '#FEF2F2',
    label: 'Overdue',
  },
  follow_up_due: {
    color: '#D97706',
    bg: '#FFFBEB',
    label: 'Due Soon',
  },
  deal_stage_change: {
    color: '#7C3AED',
    bg: '#F5F3FF',
    label: 'Deal Update',
  },
  new_client: {
    color: '#0891B2',
    bg: '#ECFEFF',
    label: 'New Lead',
  },
  appointment_reminder: {
    color: '#2563EB',
    bg: '#EFF6FF',
    label: 'Appointment',
  },
  commission_received: {
    color: '#059669',
    bg: '#ECFDF5',
    label: 'Commission',
  },
  system: {
    color: '#6B7280',
    bg: '#F9FAFB',
    label: 'System',
  },
}

function timeAgo(dateStr: string): string {
  const now = new Date('2026-03-20T12:00:00Z')
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHrs = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHrs < 24) return `${diffHrs}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

type FilterTab = 'all' | 'unread' | 'follow_ups' | 'deals'

export default function NotificationDropdown() {
  const { role } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(DUMMY_NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter notifications by role
  const roleNotifications = notifications.filter((n) => n.visibility.includes(role))
  const unreadCount = roleNotifications.filter((n) => !n.read).length

  // Filter by tab
  const filteredNotifications = roleNotifications.filter((n) => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !n.read
    if (activeTab === 'follow_ups')
      return n.type === 'follow_up_overdue' || n.type === 'follow_up_due'
    if (activeTab === 'deals')
      return n.type === 'deal_stage_change' || n.type === 'commission_received'
    return true
  })

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'follow_ups', label: 'Follow-ups' },
    { key: 'deals', label: 'Deals' },
  ]

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all"
        style={{
          backgroundColor: open ? '#FFF0F0' : 'transparent',
          color: open ? '#C41E2A' : '#6B7280',
        }}
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.backgroundColor = '#F9FAFB'
            e.currentTarget.style.color = '#374151'
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#6B7280'
          }
        }}
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={2} />
        {unreadCount > 0 && (
          <span
            className="absolute flex items-center justify-center text-white font-bold rounded-full"
            style={{
              fontSize: '0.6rem',
              minWidth: '16px',
              height: '16px',
              padding: '0 4px',
              top: '2px',
              right: '2px',
              backgroundColor: '#C41E2A',
              border: '2px solid white',
              lineHeight: 1,
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-[400px] max-h-[520px] bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col"
          style={{
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)',
            zIndex: 100,
          }}
        >
          {/* Header */}
          <div className="px-5 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <h3
                  className="text-base font-bold text-gray-900"
                  style={{ fontFamily: 'var(--font-dm-serif)' }}
                >
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: '#C41E2A', backgroundColor: '#FFF0F0' }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors hover:bg-gray-50"
                    style={{ color: '#6B7280' }}
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                  style={{
                    color: activeTab === tab.key ? '#fff' : '#6B7280',
                    backgroundColor:
                      activeTab === tab.key ? '#C41E2A' : 'transparent',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin' }}>
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: '#F9FAFB' }}
                >
                  <Bell size={20} style={{ color: '#D1D5DB' }} />
                </div>
                <p className="text-sm font-medium text-gray-400">
                  {activeTab === 'unread'
                    ? 'All caught up!'
                    : 'No notifications here'}
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  {activeTab === 'unread'
                    ? 'You\'ve read all your notifications'
                    : 'Check back later'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const config = TYPE_CONFIG[notif.type]

                const content = (
                  <div
                    className="flex gap-3 px-5 py-3.5 transition-colors cursor-pointer"
                    style={{
                      backgroundColor: notif.read ? 'transparent' : '#FAFBFF',
                      borderLeft: notif.read
                        ? '3px solid transparent'
                        : `3px solid ${config.color}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = notif.read
                        ? 'transparent'
                        : '#FAFBFF'
                    }}
                    onClick={() => markAsRead(notif.id)}
                  >
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className="text-sm leading-snug"
                          style={{
                            fontWeight: notif.read ? 500 : 600,
                            color: notif.read ? '#6B7280' : '#111827',
                          }}
                        >
                          {notif.title}
                        </p>
                        <span className="text-[11px] text-gray-400 flex-shrink-0 mt-0.5">
                          {timeAgo(notif.created_at)}
                        </span>
                      </div>
                      <p
                        className="text-xs mt-0.5 leading-relaxed"
                        style={{ color: notif.read ? '#9CA3AF' : '#6B7280' }}
                      >
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            color: config.color,
                            backgroundColor: config.bg,
                          }}
                        >
                          {config.label}
                        </span>
                        {!notif.read && (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              markAsRead(notif.id)
                            }}
                            className="flex items-center gap-1 text-[10px] font-medium rounded px-1.5 py-0.5 transition-colors hover:bg-gray-100"
                            style={{ color: '#9CA3AF' }}
                          >
                            <Check size={10} />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )

                return notif.href ? (
                  <Link
                    key={notif.id}
                    href={notif.href}
                    onClick={() => {
                      markAsRead(notif.id)
                      setOpen(false)
                    }}
                    className="block border-b border-gray-50 last:border-b-0"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={notif.id}
                    className="border-b border-gray-50 last:border-b-0"
                  >
                    {content}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
              <p className="text-[11px] text-gray-400 text-center">
                Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                {activeTab !== 'all' && (
                  <button
                    onClick={() => setActiveTab('all')}
                    className="ml-1 font-medium underline"
                    style={{ color: '#C41E2A' }}
                  >
                    View all
                  </button>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
