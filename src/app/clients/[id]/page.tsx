import { supabase, type Video } from '@/lib/supabase'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import ClientPageContent from './ClientPageContent'

interface ClientDetailPageProps {
  params: { id: string }
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const clientId = params.id

  // Fetch all data in parallel on the server
  const [clientResult, stepsResult, videosResult] = await Promise.all([
    supabase.from('clients').select('*').eq('id', clientId).single(),
    supabase.from('onboarding_steps').select('*').eq('client_id', clientId).order('step_number', { ascending: true }),
    supabase.from('videos').select('*'),
  ])

  const { data: client, error: clientError } = clientResult
  const { data: steps, error: stepsError } = stepsResult
  const { data: videosData, error: videosError } = videosResult

  const anyError = clientError || stepsError || videosError

  if (anyError || !client) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <h3 className="font-bold mb-2">Error al cargar los datos del cliente</h3>
          <p className="text-sm mb-4">{anyError?.message || 'El cliente no fue encontrado.'}</p>
          <Link href="/dashboard" className="text-red-600 hover:underline">
            Volver al dashboard
          </Link>
        </div>
      </div>
    )
  }

  const videoMap: Record<string, Video> = {}
  videosData?.forEach((v) => {
    videoMap[v.id] = v
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Link href="/dashboard" className="flex items-center space-x-2 text-pxsol-blue hover:text-blue-700 mb-6 font-medium">
        <ChevronLeft size={20} />
        <span>Volver al dashboard</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pxsol-dark">{client.name}</h1>
        <p className="text-pxsol-gray">{client.email}</p>
      </div>

      <ClientPageContent client={client} initialSteps={steps || []} videos={videoMap} />
    </div>
  )
}