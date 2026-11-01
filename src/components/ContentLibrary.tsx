'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ContentResource, ContentType } from '@/lib/supabase'
import { FileText, Film, Presentation, UploadCloud, ExternalLink } from 'lucide-react'

const BUCKET = 'pxsol-onboarding-content'
const MAX_FILE_SIZE = 100 * 1024 * 1024
const ACCEPTED: Record<ContentType, string[]> = {
  video: ['video/mp4', 'video/webm'],
  pdf: ['application/pdf'],
  presentation: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
}
const TYPE_LABELS: Record<ContentType, string> = {
  video: 'Video',
  pdf: 'PDF',
  presentation: 'Presentación',
}
const STAGES = ['Bienvenida', 'Configuración', 'Capacitación', 'Integraciones y puesta en marcha']

interface Props { initialResources: ContentResource[] }

export default function ContentLibrary({ initialResources }: Props) {
  const [resources, setResources] = useState(initialResources)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ContentType>('video')
  const [stage, setStage] = useState('1')
  const [step, setStep] = useState('')
  const [language, setLanguage] = useState('es')
  const [externalUrl, setExternalUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | ContentType>('all')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const filtered = useMemo(() => resources.filter((resource) =>
    (filterType === 'all' || resource.content_type === filterType) &&
    (resource.title.toLowerCase().includes(query.toLowerCase()) ||
      (resource.description || '').toLowerCase().includes(query.toLowerCase()))
  ), [resources, filterType, query])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    if (!title.trim()) return setError('Ingresá un título.')
    if ((!file && !externalUrl.trim()) || (file && externalUrl.trim())) {
      return setError('Adjuntá un archivo o ingresá una URL, pero no ambos.')
    }
    if (type !== 'video' && !file) return setError('PDF y presentaciones deben cargarse como archivo.')
    if (file && !ACCEPTED[type].includes(file.type)) return setError('El formato del archivo no coincide con el tipo seleccionado.')
    if (file && file.size > MAX_FILE_SIZE) return setError('El archivo supera el límite de 100 MB.')
    if (externalUrl.trim()) {
      try {
        const url = new URL(externalUrl)
        if (!['https:', 'http:'].includes(url.protocol)) throw new Error()
      } catch { return setError('Ingresá una URL HTTP o HTTPS válida.') }
    }

    setBusy(true)
    const supabase = createClient()
    let uploadedPath: string | null = null
    try {
      if (file) {
        const safeName = file.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '')
        uploadedPath = `${crypto.randomUUID()}/${safeName || 'resource'}`
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(uploadedPath, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false,
        })
        if (uploadError) throw uploadError
      }

      const { data, error: insertError } = await supabase.from('content_resources').insert({
        title: title.trim(),
        description: description.trim() || null,
        content_type: type,
        stage: Number(stage),
        step_number: step ? Number(step) : null,
        language,
        storage_path: uploadedPath,
        external_url: externalUrl.trim() || null,
        created_by: (await supabase.auth.getUser()).data.user?.id ?? null,
      }).select('*').single()
      if (insertError) throw insertError

      setResources((current) => [...current, data as ContentResource].sort((a, b) =>
        a.stage - b.stage || (a.step_number ?? 99) - (b.step_number ?? 99) || a.title.localeCompare(b.title)
      ))
      setTitle('')
      setDescription('')
      setExternalUrl('')
      setFile(null)
      const input = document.getElementById('content-file') as HTMLInputElement | null
      if (input) input.value = ''
      setSuccess('Contenido incorporado a la biblioteca.')
    } catch (cause) {
      if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath])
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el contenido.')
    } finally { setBusy(false) }
  }

  const openResource = async (resource: ContentResource) => {
    if (resource.external_url) {
      window.open(resource.external_url, '_blank', 'noopener,noreferrer')
      return
    }
    if (!resource.storage_path) return
    const { data, error: signedError } = await createClient().storage.from(BUCKET).createSignedUrl(resource.storage_path, 300)
    if (signedError) return setError(signedError.message)
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
  }

  const Icon = ({ kind }: { kind: ContentType }) => kind === 'video'
    ? <Film size={20} /> : kind === 'pdf' ? <FileText size={20} /> : <Presentation size={20} />

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-pxsol-blue">PXSOL · Gestión interna</p>
        <h1 className="mt-2 text-3xl font-bold text-pxsol-dark">Biblioteca de contenidos</h1>
        <p className="mt-2 text-pxsol-gray">Administrá videos, manuales PDF y presentaciones asociados al itinerario de onboarding.</p>
      </header>

      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-pxsol-dark">Incorporar contenido</h2>
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-pxsol-dark">Título
            <input required maxLength={255} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-pxsol-dark">Tipo
            <select value={type} onChange={(e) => { setType(e.target.value as ContentType); setFile(null) }} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
              {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-pxsol-dark">Etapa
            <select value={stage} onChange={(e) => setStage(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
              {STAGES.map((label, index) => <option key={label} value={index + 1}>{index + 1}. {label}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-pxsol-dark">Paso (opcional, 1–20)
            <input type="number" min="1" max="20" value={step} onChange={(e) => setStep(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-pxsol-dark">Idioma
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
              <option value="es">Español</option><option value="en">Inglés</option><option value="pt">Portugués</option>
            </select>
          </label>
          <label className="text-sm font-medium text-pxsol-dark">Archivo (máximo 100 MB)
            <input id="content-file" type="file" accept={type === 'video' ? 'video/mp4,video/webm' : type === 'pdf' ? 'application/pdf' : '.ppt,.pptx'} onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" />
          </label>
          {type === 'video' && <label className="text-sm font-medium text-pxsol-dark md:col-span-2">O URL externa del video
            <input type="url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://…" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>}
          <label className="text-sm font-medium text-pxsol-dark md:col-span-2">Descripción
            <textarea rows={3} maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          {error && <p role="alert" className="md:col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {success && <p role="status" className="md:col-span-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}
          <div className="md:col-span-2">
            <button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-pxsol-blue px-5 py-2.5 font-semibold text-white disabled:opacity-50">
              <UploadCloud size={18} />{busy ? 'Guardando…' : 'Agregar a la biblioteca'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-pxsol-dark">Contenido disponible ({filtered.length})</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input aria-label="Buscar contenido" placeholder="Buscar…" value={query} onChange={(e) => setQuery(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <select aria-label="Filtrar por tipo" value={filterType} onChange={(e) => setFilterType(e.target.value as typeof filterType)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="all">Todos los tipos</option><option value="video">Videos</option><option value="pdf">PDF</option><option value="presentation">Presentaciones</option>
            </select>
          </div>
        </div>
        {filtered.length === 0 ? <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-pxsol-gray">Todavía no hay materiales. Incorporá el primer recurso para comenzar a construir la biblioteca.</div> : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((resource) => (
              <article key={resource.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <span className="rounded-lg bg-blue-50 p-3 text-pxsol-blue"><Icon kind={resource.content_type} /></span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-pxsol-dark">{resource.title}</h3>
                    <p className="mt-1 text-xs text-pxsol-gray">{TYPE_LABELS[resource.content_type]} · {resource.language.toUpperCase()} · Etapa {resource.stage}{resource.step_number ? ` · Paso ${resource.step_number}` : ''}</p>
                  </div>
                </div>
                {resource.description && <p className="mt-3 line-clamp-3 text-sm text-pxsol-gray">{resource.description}</p>}
                <button type="button" onClick={() => void openResource(resource)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-pxsol-blue hover:underline">
                  Abrir recurso <ExternalLink size={15} />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
