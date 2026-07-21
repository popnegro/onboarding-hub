'use client'

import { useState } from 'react'
import { supabase, type Client, type OnboardingStep, type Video } from '@/lib/supabase'
import StepEditor from '@/components/StepEditor'
import AdoptionMonitor from '@/components/AdoptionMonitor'

const ETAPA_LABELS: Record<number, string> = {
  1: 'Bienvenida',
  2: 'Configuración',
  3: 'Capacitación',
  4: 'Integraciones',
}

interface ClientPageContentProps {
  client: Client
  initialSteps: OnboardingStep[]
  videos: Record<string, Video>
}

export default function ClientPageContent({ client, initialSteps, videos }: ClientPageContentProps) {
  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps)
  const [error, setError] = useState<string | null>(null)
  const [expandedEtapa, setExpandedEtapa] = useState(client.current_etapa || 1)

  const handleStatusChange = async (stepId: string, newStatus: OnboardingStep['status']) => {
    try {
      const { error } = await supabase
        .from('onboarding_steps')
        .update({
          status: newStatus,
          completed_date: newStatus === 'completed' || newStatus === 'verified' ? new Date().toISOString() : null,
        })
        .eq('id', stepId)

      if (error) throw error

      setSteps(
        steps.map((s) =>
          s.id === stepId ? { ...s, status: newStatus } : s
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar paso')
    }
  }

  const handleNotesChange = async (stepId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('onboarding_steps')
        .update({ notes })
        .eq('id', stepId)

      if (error) throw error

      setSteps(
        steps.map((s) =>
          s.id === stepId ? { ...s, notes } : s
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar notas')
    }
  }

  const handleBlockerChange = async (stepId: string, blocker: string | null) => {
    try {
      const { error } = await supabase
        .from('onboarding_steps')
        .update({ blocker_reason: blocker })
        .eq('id', stepId)

      if (error) throw error

      setSteps(
        steps.map((s) =>
          s.id === stepId ? { ...s, blocker_reason: blocker || undefined } : s
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar bloqueador')
    }
  }

  const etapas = [1, 2, 3, 4]

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Adopción Monitor */}
      <div className="mb-8">
        <AdoptionMonitor
          metric={{
            id: '',
            client_id: client.id,
            measurement_date: new Date().toISOString().split('T')[0],
            reservations_7d: Math.floor(Math.random() * 150),
            active_users: Math.floor(Math.random() * 6),
            rates_updated: Math.random() > 0.5,
            reports_generated: Math.floor(Math.random() * 20),
            integrations_active: Math.floor(Math.random() * 5),
            adoption_score: client.adoption_score,
            risk_level: client.adoption_score >= 70 ? 'alto' : client.adoption_score >= 40 ? 'medio' : 'bajo',
            created_at: new Date().toISOString(),
          }}
        />
      </div>

      {/* Checklist por Etapas */}
      <div className="space-y-6">
        {etapas.map((etapa) => {
          const etapaSteps = steps.filter((s) => s.etapa === etapa)
          const completedSteps = etapaSteps.filter((s) => s.status === 'completed' || s.status === 'verified').length
          const progress = etapaSteps.length > 0 ? Math.round((completedSteps / etapaSteps.length) * 100) : 0

          return (
            <div key={etapa} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Etapa Header */}
              <button
                onClick={() => setExpandedEtapa(expandedEtapa === etapa ? 0 : etapa)}
                className="w-full bg-white hover:bg-pxsol-light transition p-6 flex items-center justify-between cursor-pointer"
              >
                <div className="flex-1 text-left">
                  <h2 className="text-xl font-bold text-pxsol-dark">
                    Etapa {etapa}: {ETAPA_LABELS[etapa]}
                  </h2>
                  <p className="text-sm text-pxsol-gray mt-1">
                    {completedSteps} de {etapaSteps.length} pasos completados
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="w-16 h-16 relative flex items-center justify-center">
                    <svg className="transform -rotate-90 w-16 h-16">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#0066cc"
                        strokeWidth="4"
                        strokeDasharray={`${progress * 1.76} 176`}
                        className="transition-all"
                      />
                    </svg>
                    <span className="absolute text-sm font-bold text-pxsol-dark">{progress}%</span>
                  </div>
                </div>
              </button>

              {/* Etapa Content */}
              {expandedEtapa === etapa && (
                <div className="border-t border-gray-200 p-6 bg-pxsol-light space-y-4">
                  {etapaSteps.map((step) => (
                    <StepEditor
                      key={step.id}
                      step={step}
                      onStatusChange={(newStatus) => handleStatusChange(step.id, newStatus)}
                      onNotesChange={(notes) => handleNotesChange(step.id, notes)}
                      onBlockerChange={(blocker) => handleBlockerChange(step.id, blocker)}
                      videoTitle={step.video_id && videos[step.video_id]?.title}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}