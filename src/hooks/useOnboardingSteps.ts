import { useEffect, useState } from 'react'
import { type OnboardingStep, type Video } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/client'

export function useOnboardingSteps(clientId: string) {
  const [steps, setSteps] = useState<OnboardingStep[]>([])
  const [videos, setVideos] = useState<Record<string, Video>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const supabase = createClient()

        const { data: stepsData, error: stepsError } = await supabase
          .from('onboarding_steps')
          .select('*')
          .eq('client_id', clientId)
          .order('step_number', { ascending: true })

        if (stepsError) throw stepsError
        if (!isActive) return
        setSteps(stepsData || [])

        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select('*')

        if (videosError) throw videosError
        if (!isActive) return

        const videoMap: Record<string, Video> = {}
        videosData?.forEach((video) => {
          videoMap[video.id] = video
        })
        setVideos(videoMap)
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Error al cargar datos')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void fetchData()

    return () => {
      isActive = false
    }
  }, [clientId])

  const updateStep = async (stepId: string, updates: Partial<OnboardingStep>) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('onboarding_steps')
        .update(updates)
        .eq('id', stepId)

      if (error) throw error

      setSteps((currentSteps) =>
        currentSteps.map((step) =>
          step.id === stepId ? { ...step, ...updates } : step
        )
      )
      setError(null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar paso')
      return false
    }
  }

  return { steps, videos, isLoading, error, updateStep }
}
