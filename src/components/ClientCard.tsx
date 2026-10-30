'use client'

import Link from 'next/link'
import { type Client } from '@/lib/supabase'
import { ChevronRight } from 'lucide-react'

const ETAPA_LABELS: Record<number, string> = {
  1: 'Bienvenida',
  2: 'Configuración',
  3: 'Capacitación',
  4: 'Integraciones',
}

const ETAPA_COLORS: Record<number, string> = {
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-purple-100 text-purple-800',
  3: 'bg-amber-100 text-amber-800',
  4: 'bg-green-100 text-green-800',
}

interface ClientCardProps {
  client: Client
}

export default function ClientCard({ client }: ClientCardProps) {
  const etapaLabel = ETAPA_LABELS[client.current_etapa] || 'Etapa pendiente'
  const etapaColor = ETAPA_COLORS[client.current_etapa] || 'bg-gray-100 text-gray-700'
  const progress = Math.min(100, Math.max(0, Number(client.progress_percentage) || 0))

  return (
    <Link href={`/clients/${client.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-pxsol-blue transition cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-pxsol-dark">{client.name}</h3>
            <p className="text-sm text-pxsol-gray">{client.email}</p>
          </div>
          <ChevronRight className="text-pxsol-gray" size={20} />
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${etapaColor}`}>
              {etapaLabel}
            </span>
            <span className="text-sm font-semibold text-pxsol-dark">{Math.round(progress)}%</span>
          </div>
          <div
            className="w-full bg-gray-200 rounded-full h-2"
            role="progressbar"
            aria-label={`Progreso de onboarding de ${client.name}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="bg-pxsol-blue h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 text-xs text-pxsol-gray">
          Métricas de adopción pendientes de integración verificada
        </div>
      </div>
    </Link>
  )
}
