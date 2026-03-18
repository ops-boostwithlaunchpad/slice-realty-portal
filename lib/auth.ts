'use client'

import { createContext, useContext } from 'react'

export type UserRole = 'agent' | 'manager'

export interface AuthUser {
  username: string
  role: UserRole
  displayName: string
}

export const USERS: Record<string, { password: string; role: UserRole; displayName: string }> = {
  silvia: { password: '123', role: 'agent', displayName: 'Silvia Martinez' },
  manager: { password: '123', role: 'manager', displayName: 'Carlos Reyes' },
}

export const AuthContext = createContext<AuthUser | null>(null)

export function useAuth(): AuthUser {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useRole(): UserRole {
  return useAuth().role
}

export function getStoredAuth(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('slice_auth_user')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && parsed.username && parsed.role && parsed.displayName) {
      return parsed as AuthUser
    }
  } catch {}
  return null
}

export function storeAuth(user: AuthUser) {
  localStorage.setItem('slice_auth', 'true')
  localStorage.setItem('slice_auth_user', JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem('slice_auth')
  localStorage.removeItem('slice_auth_user')
}
