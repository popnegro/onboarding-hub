'use client'

import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let active = true
    try {
      const supabase = createClient()
      void supabase.auth.getUser().then(({ data }) => {
        if (active) setIsAuthenticated(Boolean(data.user))
      })
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) setIsAuthenticated(Boolean(session?.user))
      })
      return () => {
        active = false
        subscription.unsubscribe()
      }
    } catch {
      setIsAuthenticated(false)
      return () => { active = false }
    }
  }, [])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.replace('/login')
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-pxsol-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-pxsol-dark">Onboarding Hub</span>
              <span className="text-xs text-pxsol-gray">by PXSOL · Demo interno</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6" aria-label="Navegación principal">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-pxsol-gray hover:text-pxsol-dark font-medium text-sm">Dashboard</Link>
                <button type="button" onClick={handleSignOut} disabled={isSigningOut} className="inline-flex items-center gap-2 text-sm font-medium text-pxsol-gray hover:text-pxsol-dark disabled:opacity-50">
                  <LogOut size={16} />{isSigningOut ? 'Cerrando…' : 'Cerrar sesión'}
                </button>
              </>
            ) : (
              <Link href="/login" className="text-pxsol-blue hover:text-blue-700 font-medium text-sm">Acceso interno</Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <button type="button" aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-pxsol-dark">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isOpen && (
          <nav id="mobile-navigation" aria-label="Navegación móvil" className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-pxsol-dark hover:bg-pxsol-light rounded">Dashboard</Link>
                <button type="button" onClick={() => { setIsOpen(false); void handleSignOut() }} disabled={isSigningOut} className="block w-full text-left px-4 py-2 text-pxsol-dark hover:bg-pxsol-light rounded">Cerrar sesión</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-pxsol-dark hover:bg-pxsol-light rounded">Acceso interno</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
