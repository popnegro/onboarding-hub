import { useEffect, useState } from 'react'
import { supabase, type Client } from '@/lib/supabase'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true)
        const { data, error: err } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })

        if (err) throw err
        setClients(data || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar clientes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()

    // Subscribe to real-time updates (opcional)
    const subscription = supabase
      .channel('clients')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clients' },
        () => {
          fetchClients()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { clients, isLoading, error, setClients }
}
