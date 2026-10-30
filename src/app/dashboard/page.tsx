'use client'

import { useEffect, useState } from 'react'
import { type Client } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/client'
import ClientCard from '@/components/ClientCard'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    let isActive = true

    const fetchClients = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const supabase = createClient()
        let query = supabase.from('clients').select('*')

        if (filter !== 'all') {
          query = query.eq('status', filter)
        }

        const { data, error: err } = await query.order('created_at', {
          ascending: false,
        })

        if (err) throw err
        if (isActive) setClients(data || [])
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Error al cargar clientes')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void fetchClients()

    return () => {
      isActive = false
    }
  }, [filter])

  const activeClients = clients.filter((client) => client.status === 'active')
  const completedClients = clients.filter((client) => client.status === 'completed')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-pxsol-dark mb-2">
            Dashboard de Onboarding
          </h1>
          <p className="text-pxsol-gray">
            Gestiona el ciclo de vida de onboarding de tus clientes
          </p>
        </div>
        <button
          type="button"
          disabled
          title="La creación de clientes todavía no está implementada"
          aria-disabled="true"
          className="mt-4 md:mt-0 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium flex items-center space-x-2 cursor-not-allowed"
        >
          <Plus size={20} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {!isLoading && !error && (\n      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-pxsol-gray font-medium">Clientes Activos</p>
          <p className="text-3xl font-bold text-pxsol-dark mt-2">{activeClients.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-pxsol-gray font-medium">Completados</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{completedClients.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-900 font-medium">Métricas de adopción</p>
          <p className="text-xl font-bold text-amber-900 mt-2">Pendientes</p>
          <p className="text-xs text-amber-800 mt-1">Requieren una fuente real verificada</p>
        </div>
      </div>

      )}\n\n      <div className="mb-6 flex gap-2">
        {(['all', 'active', 'completed'] as const).map((currentFilter) => (
          <button
            key={currentFilter}
            onClick={() => setFilter(currentFilter)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filter === currentFilter
                ? 'bg-pxsol-blue text-white'
                : 'bg-white text-pxsol-dark border border-gray-200 hover:border-pxsol-blue'
            }`}
          >
            {currentFilter === 'all'
              ? 'Todos'
              : currentFilter === 'active'
                ? 'Activos'
                : 'Completados'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin">
            <div className="w-8 h-8 border-4 border-pxsol-blue border-t-transparent rounded-full" />
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <h3 className="font-bold mb-2">Error al cargar datos</h3>
          <p>{error}</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-pxsol-gray text-lg">No hay clientes para mostrar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  )
}
