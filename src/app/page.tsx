import Link from 'next/link'
import { CheckCircle, TrendingUp, Video, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-pxsol-dark to-pxsol-blue py-20 px-4">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Onboarding Hub
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Centraliza la gestión de onboarding de tus clientes hoteleros. Automatiza el seguimiento, monitorea la adopción y prevén el churn.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-white text-pxsol-blue rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Ir al Dashboard
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-pxsol-dark text-center mb-12">
            Funcionalidades Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-pxsol-light rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pxsol-blue rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-pxsol-dark mb-2">
                Checklist de Procesos
              </h3>
              <p className="text-sm text-pxsol-gray">
                Guía de 20 pasos en 4 etapas para asegurar un onboarding consistente
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-pxsol-light rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pxsol-blue rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-pxsol-dark mb-2">
                Monitor de Adopción
              </h3>
              <p className="text-sm text-pxsol-gray">
                Scoring automático para detectar clientes en riesgo en tiempo real
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-pxsol-light rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pxsol-blue rounded-lg flex items-center justify-center mb-4">
                <Video className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-pxsol-dark mb-2">
                Biblioteca de Videos
              </h3>
              <p className="text-sm text-pxsol-gray">
                Envía el video correcto con 1 clic según la etapa del cliente
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-pxsol-light rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pxsol-blue rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-pxsol-dark mb-2">
                Alertas Inteligentes
              </h3>
              <p className="text-sm text-pxsol-gray">
                Notificaciones automáticas de churn risk y recomendaciones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-pxsol-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-pxsol-blue mb-2">20</p>
              <p className="text-pxsol-gray font-medium">Pasos de Onboarding</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-pxsol-blue mb-2">4</p>
              <p className="text-pxsol-gray font-medium">Etapas Claras</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-pxsol-blue mb-2">30%</p>
              <p className="text-pxsol-gray font-medium">Mejora Esperada en Tiempo</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-pxsol-dark mb-4">
            ¿Listo para optimizar tu onboarding?
          </h2>
          <p className="text-pxsol-gray mb-8">
            Accede al dashboard y comienza a gestionar tus clientes de forma más eficiente
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-pxsol-blue text-white rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Acceder al Dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}
