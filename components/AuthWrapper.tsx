'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import TopNavbar from './TopNavbar'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const isAuth = localStorage.getItem('slice_auth') === 'true'
    setAuthed(isAuth)
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

  if (!authed) return null

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <TopNavbar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
