'use client'

import { type AdoptionMetric } from '@/lib/supabase'
import { getScoreColor, getScoreLabel } from '@/lib/adoption-scoring'
import { AlertCircle, TrendingUp } from 'lucide-react'

interface AdoptionMonitorProps {
  metric: AdoptionMetric
}

export default function AdoptionMonitor({ metric }: AdoptionMonitorProps) {
  const scoreColor = getScoreColor(metric.adoption_score)
  const scoreLabel = getScoreLabel(metric.adoption_score)
  const isAtRisk = metric.adoption_score < 50

  return (
    <div className={`border-2 rounded-lg p-6 ${isAtRisk ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-pxsol-dark flex items-center space-x-2">
            <span>Monitor de Adopción</span>
            {isAtRisk && <AlertCircle size={20} className="text-red-600" />}
          </h3>
          <p className="text-sm text-pxsol-gray">Última medición: {metric.measurement_date}</p>
        </div>
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl text-white"
            style={{ backgroundColor: scoreColor }}
          >
            {metric.adoption_score}
          </div>
          <p className="text-xs font-medium text-pxsol-gray mt-2">{scoreLabel}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Reservas */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-pxsol-gray font-medium mb-2">Reservas (7d)</p>
          <p className="text-2xl font-bold text-pxsol-dark">{metric.reservations_7d}</p>
          <p className="text-xs text-pxsol-gray mt-1">
            {metric.reservations_7d > 0 ? '✓ Activo' : '⚠ Crítico'}
          </p>
        </div>

        {/* Usuarios Activos */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-pxsol-gray font-medium mb-2">Usuarios Activos</p>
          <p className="text-2xl font-bold text-pxsol-dark">{metric.active_users}</p>
          <p className="text-xs text-pxsol-gray mt-1">
            {metric.active_users >= 2 ? '✓ Bueno' : '⚠ Bajo'}
          </p>
        </div>

        {/* Tarifas */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-pxsol-gray font-medium mb-2">Tarifas</p>
          <p className="text-2xl font-bold text-pxsol-dark">{metric.rates_updated ? '✓' : '✗'}</p>
          <p className="text-xs text-pxsol-gray mt-1">
            {metric.rates_updated ? 'Actualizado' : 'Pendiente'}
          </p>
        </div>

        {/* Reportes */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-pxsol-gray font-medium mb-2">Reportes</p>
          <p className="text-2xl font-bold text-pxsol-dark">{metric.reports_generated}</p>
          <p className="text-xs text-pxsol-gray mt-1">
            {metric.reports_generated > 0 ? '✓ Activos' : '⚠ Ninguno'}
          </p>
        </div>

        {/* Integraciones */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-pxsol-gray font-medium mb-2">Integraciones</p>
          <p className="text-2xl font-bold text-pxsol-dark">{metric.integrations_active}/4</p>
          <p className="text-xs text-pxsol-gray mt-1">
            {metric.integrations_active >= 2 ? '✓ Ok' : '⚠ Bajo'}
          </p>
        </div>
      </div>

      {/* Recomendación */}
      {isAtRisk && (
        <div className="mt-6 bg-white border-l-4 border-red-500 p-4 rounded">
          <h4 className="font-bold text-red-700 mb-2 flex items-center space-x-2">
            <AlertCircle size={18} />
            <span>Recomendaciones</span>
          </h4>
          <ul className="text-sm text-pxsol-dark space-y-1 list-disc list-inside">
            {metric.reservations_7d === 0 && <li>Enviar video: "Cómo crear tu primera reserva"</li>}
            {metric.active_users < 2 && <li>Contactar al cliente para verificar acceso</li>}
            {!metric.rates_updated && <li>Revisar Paso 6: Configuración de tarifas</li>}
            {metric.reports_generated === 0 && <li>Hacer demo de reportes en próxima sesión</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
