import { useEffect, useState } from 'react'
import { supabase, type OnboardingStep, type Video } from '@/lib/supabase'

export function useOnboardingSteps(clientId: string) {
  const [steps, setSteps] = useState<OnboardingStep[]>([])
  const [videos, setVideos] = useState<Record<string, Video>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

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

  const updateStep = async (stepId: string, updates: Partial<OnboardingStep>) => {
    try {
      const { error } = await supabase
        .from('onboarding_steps')
        .update(updates)
        .eq('id', stepId)

      if (error) throw error

      setSteps(
        steps.map((s) =>
          s.id === stepId ? { ...s, ...updates } : s
        )
      )
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar paso')
      return false
    }
  }

  return { steps, videos, isLoading, error, updateStep }
}
