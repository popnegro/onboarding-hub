'use client'

import Link from 'next/link'
import { type Client } from '@/lib/supabase'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { getScoreColor, getScoreLabel } from '@/lib/adoption-scoring'

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
  const scoreColor = getScoreColor(client.adoption_score)
  const scoreLabel = getScoreLabel(client.adoption_score)
  const isAtRisk = client.adoption_score < 50

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

        {/* Etapa y Progreso */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${ETAPA_COLORS[client.current_etapa]}`}>
              {ETAPA_LABELS[client.current_etapa]}
            </span>
            <span className="text-sm font-semibold text-pxsol-dark">{Math.round(client.progress_percentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-pxsol-blue h-2 rounded-full transition-all"
              style={{ width: `${client.progress_percentage}%` }}
            />
          </div>
        </div>

        {/* Adoption Score */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-pxsol-gray">Adoption Score:</span>
            <div
              className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white text-sm"
              style={{ backgroundColor: scoreColor }}
            >
              {client.adoption_score}
            </div>
          </div>
          {isAtRisk && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle size={16} />
              <span className="text-xs font-medium">Riesgo</span>
            </div>
          )}
        </div>

        {/* Score Label */}
        <div className="text-xs text-pxsol-gray">{scoreLabel}</div>
      </div>
    </Link>
  )
}
