'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-pxsol-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-pxsol-dark">Onboarding Hub</span>
              <span className="text-xs text-pxsol-gray">by PXSOL</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Navegación principal">
            <Link href="/dashboard" className="text-pxsol-gray hover:text-pxsol-dark font-medium text-sm">
              Dashboard
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-pxsol-dark"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav id="mobile-navigation" aria-label="Navegación móvil" className="md:hidden pb-4 space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-pxsol-dark hover:bg-pxsol-light rounded"
            >
              Dashboard
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
