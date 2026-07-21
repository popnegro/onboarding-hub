'use client'

import { useEffect, useState } from 'react'
import { supabase, type Client } from '@/lib/supabase'
import ClientCard from '@/components/ClientCard'
import { Plus, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true)
        let query = supabase.from('clients').select('*')

        if (filter !== 'all') {
          query = query.eq('status', filter)
        }

        const { data, error: err } = await query.order('created_at', {
          ascending: false,
        })

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
  }, [filter])

  const atRiskClients = clients.filter((c) => c.adoption_score < 50)
  const activeClients = clients.filter((c) => c.status === 'active')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-pxsol-dark mb-2">
            Dashboard de Onboarding
          </h1>
          <p className="text-pxsol-gray">
            Gestiona el ciclo de vida de onboarding de tus clientes
          </p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-pxsol-blue text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center space-x-2">
          <Plus size={20} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-pxsol-gray font-medium">Clientes Activos</p>
          <p className="text-3xl font-bold text-pxsol-dark mt-2">{activeClients.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-pxsol-gray font-medium">Completados</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {clients.filter((c) => c.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-red-200 bg-red-50">
          <p className="text-sm text-red-700 font-medium flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>En Riesgo</span>
          </p>
          <p className="text-3xl font-bold text-red-600 mt-2">{atRiskClients.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-2">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filter === f
                ? 'bg-pxsol-blue text-white'
                : 'bg-white text-pxsol-dark border border-gray-200 hover:border-pxsol-blue'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Completados'}
          </button>
        ))}
      </div>

      {/* Clientes */}
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
