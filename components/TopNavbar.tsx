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
  LogOut,
  Menu,
  X,
  UserCog,
} from 'lucide-react'
import { useAuth, clearAuth, type UserRole } from '@/lib/auth'

const allNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['agent', 'manager', 'admin'] as UserRole[] },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban, roles: ['agent', 'manager', 'admin'] as UserRole[] },
  { href: '/clients', label: 'Clients', icon: Users, roles: ['agent', 'manager', 'admin'] as UserRole[] },
  { href: '/listings', label: 'Listings', icon: Home, roles: ['agent', 'manager', 'admin'] as UserRole[] },
  { href: '/agents', label: 'Agents', icon: UserCog, roles: ['manager', 'admin'] as UserRole[] },
  { href: '/quiz', label: 'Quiz', icon: BookOpen, roles: ['agent'] as UserRole[] },
]

export default function TopNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { role, displayName } = useAuth()

  const navItems = allNavItems.filter((item) => item.roles.includes(role))

  const handleLogout = () => {
    clearAuth()
    router.replace('/login')
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-white border-b border-gray-200"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between h-[56px] px-5">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/only_logo.png"
                alt="Slice Realty"
                width={30}
                height={30}
                className="object-contain"
                priority
              />
              <span
                className="text-gray-900 whitespace-nowrap leading-none hidden sm:block"
                style={{ fontFamily: 'var(--font-dm-serif)', fontSize: '0.95rem', fontWeight: 400 }}
              >
                Slice Realty
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive =
                  href === '/' ? pathname === '/' : pathname.startsWith(href)

                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      color: isActive ? '#fff' : '#6b7280',
                      backgroundColor: isActive ? '#C41E2A' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#F9FAFB'
                        e.currentTarget.style.color = '#374151'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#6b7280'
                      }
                    }}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right: User info + Sign Out + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  color: role === 'admin' ? '#0369A1' : role === 'manager' ? '#7C3AED' : '#C41E2A',
                  backgroundColor: role === 'admin' ? '#F0F9FF' : role === 'manager' ? '#F5F3FF' : '#FFF0F0',
                }}
              >
                {role === 'admin' ? 'Admin' : role === 'manager' ? 'Manager' : 'Agent'}
              </span>
              <span className="text-sm text-gray-600 font-medium">{displayName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all border border-gray-200"
              style={{ color: '#6b7280', backgroundColor: '#F9FAFB' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C41E2A'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.borderColor = '#C41E2A'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB'
                e.currentTarget.style.color = '#6b7280'
                e.currentTarget.style.borderColor = '#E5E7EB'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {/* Mobile user info */}
            <div className="flex items-center gap-2 px-3 pb-2 mb-2 border-b border-gray-100">
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  color: role === 'admin' ? '#0369A1' : role === 'manager' ? '#7C3AED' : '#C41E2A',
                  backgroundColor: role === 'admin' ? '#F0F9FF' : role === 'manager' ? '#F5F3FF' : '#FFF0F0',
                }}
              >
                {role === 'admin' ? 'Admin' : role === 'manager' ? 'Manager' : 'Agent'}
              </span>
              <span className="text-sm text-gray-600 font-medium">{displayName}</span>
            </div>
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === '/' ? pathname === '/' : pathname.startsWith(href)

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: isActive ? '#fff' : '#6b7280',
                    backgroundColor: isActive ? '#C41E2A' : 'transparent',
                  }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                </Link>
              )
            })}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <button
                onClick={() => {
                  setMobileOpen(false)
                  handleLogout()
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-all"
                style={{ color: '#9CA3AF' }}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
