import { useEffect, useState } from 'react'
import { type Client } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/client'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true
    let cleanupSubscription: (() => void) | undefined

    const fetchClients = async (supabase: ReturnType<typeof createClient>) => {
      try {
        setIsLoading(true)
        const { data, error: err } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })

        if (err) throw err
        if (isActive) {
          setClients(data || [])
          setError(null)
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Error al cargar clientes')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    try {
      const supabase = createClient()
      void fetchClients(supabase)

      const subscription = supabase
        .channel('clients')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
          void fetchClients(supabase)
        })
        .subscribe()

      cleanupSubscription = () => {
        void supabase.removeChannel(subscription)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes')
      setIsLoading(false)
    }

    return () => {
      isActive = false
      cleanupSubscription?.()
    }
  }, [])

  return { clients, isLoading, error, setClients }
}
