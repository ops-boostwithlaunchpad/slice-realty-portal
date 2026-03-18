'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import TopNavbar from './TopNavbar'
import { AuthContext, AuthUser, getStoredAuth } from '@/lib/auth'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const storedUser = getStoredAuth()
    setUser(storedUser)
    const isAuth = !!storedUser
    if (!isAuth && pathname !== '/login') {
      router.replace('/login')
    } else if (isAuth && pathname === '/login') {
      router.replace('/')
    }
    setChecked(true)
  }, [pathname, router])

  if (!checked) return null

  if (pathname === '/login') {
    return <>{children}</>
  }

  if (!user) return null

  return (
    <AuthContext.Provider value={user}>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  )
}
