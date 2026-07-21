'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase, type Client, type OnboardingStep, type Video } from '@/lib/supabase'
import StepEditor from '@/components/StepEditor'
import AdoptionMonitor from '@/components/AdoptionMonitor'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const ETAPA_LABELS: Record<number, string> = {
  1: 'Bienvenida',
  2: 'Configuración',
  3: 'Capacitación',
  4: 'Integraciones',
}

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [steps, setSteps] = useState<OnboardingStep[]>([])
  const [videos, setVideos] = useState<Record<string, Video>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedEtapa, setExpandedEtapa] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch client
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single()

        if (clientError) throw clientError

        setClient(clientData)

        // Fetch steps
        const { data: stepsData, error: stepsError } = await supabase
          .from('onboarding_steps')
          .select('*')
          .eq('client_id', clientId)
          .order('step_number', { ascending: true })

        if (stepsError) throw stepsError

        setSteps(stepsData || [])

        // Fetch videos
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select('*')

        if (videosError) throw videosError

        const videoMap: Record<string, Video> = {}
        videosData?.forEach((v) => {
          videoMap[v.id] = v
        })
        setVideos(videoMap)

        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [clientId])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-pxsol-blue border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <h3 className="font-bold mb-2">Cliente no encontrado</h3>
          <Link href="/dashboard" className="text-red-600 hover:underline">
            Volver al dashboard
          </Link>
        </div>
      </div>
    )
  }

  const etapas = [1, 2, 3, 4]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Link
        href="/dashboard"
        className="flex items-center space-x-2 text-pxsol-blue hover:text-blue-700 mb-6 font-medium"
      >
        <ChevronLeft size={20} />
        <span>Volver al dashboard</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pxsol-dark mb-2">{client.name}</h1>
        <p className="text-pxsol-gray">{client.email}</p>
      </div>

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
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="4"
                      />
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
    </div>
  )
}
