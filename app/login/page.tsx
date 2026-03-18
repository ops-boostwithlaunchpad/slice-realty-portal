'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { USERS, storeAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const user = USERS[form.username.trim().toLowerCase()]
      if (user && form.password === user.password) {
        storeAuth({
          username: form.username.trim().toLowerCase(),
          role: user.role,
          displayName: user.displayName,
        })
        router.replace('/')
      } else {
        setError('Invalid username or password.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="flex h-screen w-full">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] flex-shrink-0 p-10 relative overflow-hidden"
      >
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80"
          alt="Skyscraper"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Bottom scrim — darkens lower portion so text is readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)' }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="px-3 py-2 rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
          >
            <Image
              src="/slice-logo.png"
              alt="Slice Realty"
              width={120}
              height={38}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Center content */}
        <div className="relative">
          <h1
            className="text-4xl font-bold leading-tight mb-4 text-white"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            Your Real Estate<br />Pipeline, Simplified.
          </h1>
          <p className="text-sm leading-loose" style={{ color: 'rgba(255,255,255,0.80)' }}>
            Manage clients, track deals, browse listings,<br />and prep for your Florida license exam —<br />all in one place.
          </p>
        </div>

        {/* Spacer to push content up from bottom */}
        <div />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Image src="/only_logo.png" alt="Slice Realty" width={36} height={36} className="object-contain" />
            <span className="text-gray-900 text-lg" style={{ fontFamily: 'var(--font-dm-serif)' }}>
              Slice Realty
            </span>
          </div>

          <h2
            className="text-3xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            Welcome back
          </h2>
          <p className="text-sm text-gray-400 mb-8">Sign in to your portal</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div
                className="text-sm px-4 py-3 rounded-xl border"
                style={{ color: '#C41E2A', backgroundColor: '#FFF0F0', borderColor: '#FECACA' }}
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none transition-colors"
                style={{ backgroundColor: '#FAFAFA' }}
                onFocus={(e) => { e.target.style.borderColor = '#C41E2A'; e.target.style.backgroundColor = '#fff' }}
                onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.backgroundColor = '#FAFAFA' }}
                placeholder="Enter your username"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none transition-colors pr-10"
                  style={{ backgroundColor: '#FAFAFA' }}
                  onFocus={(e) => { e.target.style.borderColor = '#C41E2A'; e.target.style.backgroundColor = '#fff' }}
                  onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.backgroundColor = '#FAFAFA' }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !form.username || !form.password}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-2 transition-opacity disabled:opacity-50 hover:opacity-90"
              style={{ backgroundColor: '#C41E2A' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-gray-300 text-center mt-10">
            Slice Realty Portal &copy; 2026
          </p>
        </div>
      </div>
    </div>
  )
}
