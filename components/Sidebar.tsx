'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Kanban,
  Users,
  Home,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCog,
} from 'lucide-react'
import { useAuth, clearAuth, type UserRole } from '@/lib/auth'

const allNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['broker', 'admin'] as UserRole[] },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban, roles: ['broker', 'admin'] as UserRole[] },
  { href: '/clients', label: 'Clients', icon: Users, roles: ['broker', 'admin'] as UserRole[] },
  { href: '/listings', label: 'Listings', icon: Home, roles: ['broker', 'admin'] as UserRole[] },
  { href: '/agents', label: 'Agents', icon: UserCog, roles: ['admin'] as UserRole[] },
  { href: '/quiz', label: 'Quiz', icon: BookOpen, roles: ['broker'] as UserRole[] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const { role } = useAuth()

  const navItems = allNavItems.filter((item) => item.roles.includes(role))

  const handleLogout = () => {
    clearAuth()
    router.replace('/login')
  }

  return (
    <aside
      className="relative flex flex-col min-h-screen flex-shrink-0 transition-all duration-300 border-r border-gray-200"
      style={{
        backgroundColor: '#ffffff',
        width: collapsed ? '60px' : '220px',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center overflow-hidden border-b border-gray-100"
        style={{
          height: '60px',
          padding: collapsed ? '0' : '0 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : 8,
        }}
      >
        <div className="flex-shrink-0" style={{ width: collapsed ? 28 : 34, height: collapsed ? 28 : 34 }}>
          <Image
            src="/only_logo.png"
            alt="Slice Realty"
            width={collapsed ? 28 : 34}
            height={collapsed ? 28 : 34}
            className="object-contain w-full h-full"
            priority
          />
        </div>
        {!collapsed && (
          <span
            className="text-gray-900 whitespace-nowrap leading-none"
            style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '1rem', fontWeight: 400 }}
          >
            Slice Realty
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[44px] z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm transition-colors"
        style={{ border: '1px solid #E5E7EB', color: '#C41E2A' }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className="flex items-center rounded-lg transition-colors text-sm font-medium"
              style={{
                gap: collapsed ? 0 : '10px',
                padding: collapsed ? '10px 0' : '9px 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                color: isActive ? '#C41E2A' : '#6b7280',
                backgroundColor: isActive ? '#FFF0F0' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#FFF0F0'
                  e.currentTarget.style.color = '#C41E2A'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign Out' : undefined}
          className="flex items-center rounded-lg text-sm font-medium w-full transition-colors"
          style={{
            gap: collapsed ? 0 : '10px',
            padding: collapsed ? '9px 0' : '9px 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: '#9CA3AF',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFF0F0'
            e.currentTarget.style.color = '#C41E2A'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#9CA3AF'
          }}
        >
          <LogOut size={17} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
