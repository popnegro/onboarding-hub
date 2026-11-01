import { createClient } from '@/lib/supabase/server'
import type { ContentResource } from '@/lib/supabase'
import ContentLibrary from '@/components/ContentLibrary'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('content_resources')
    .select('*')
    .eq('active', true)
    .order('stage')
    .order('sort_order')
    .order('title')

  if (error) {
    return <div className="mx-auto max-w-7xl px-4 py-8"><div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-900">La biblioteca todavía no está disponible. Aplicá la migración de contenidos de la rama de integración para habilitarla.</div></div>
  }

  return <ContentLibrary initialResources={(data ?? []) as ContentResource[]} />
}
