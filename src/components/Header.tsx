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
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-pxsol-gray hover:text-pxsol-dark font-medium text-sm">
              Dashboard
            </Link>
            <Link href="/videos" className="text-pxsol-gray hover:text-pxsol-dark font-medium text-sm">
              Videos
            </Link>
            <Link href="/settings" className="text-pxsol-gray hover:text-pxsol-dark font-medium text-sm">
              Configuración
            </Link>
          </nav>

          {/* User Menu / Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex px-4 py-2 bg-pxsol-blue text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              Perfil
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-pxsol-dark"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-pxsol-dark hover:bg-pxsol-light rounded"
            >
              Dashboard
            </Link>
            <Link
              href="/videos"
              className="block px-4 py-2 text-pxsol-dark hover:bg-pxsol-light rounded"
            >
              Videos
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-pxsol-dark hover:bg-pxsol-light rounded"
            >
              Configuración
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
