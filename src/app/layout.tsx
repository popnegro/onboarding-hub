import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Onboarding Hub - PXSOL',
  description: 'Herramienta interna para gestión de onboarding de clientes',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-pxsol-light">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-pxsol-dark text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p>© 2025 PXSOL - Onboarding Hub. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
