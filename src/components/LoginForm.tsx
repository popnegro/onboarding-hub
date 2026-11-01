'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface LoginFormProps { nextPath: string }

export default function LoginForm({ nextPath }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (authError) {
        setError('No se pudo iniciar sesión. Verificá tus credenciales o solicitá acceso al administrador.')
        return
      }
      router.replace(nextPath)
      router.refresh()
    } catch {
      setError('No se pudo conectar con el servicio de autenticación. Intentá nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-pxsol-dark mb-2">Email corporativo</label>
        <input id="email" name="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-pxsol-blue focus:ring-2 focus:ring-blue-100" placeholder="nombre@empresa.com" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-pxsol-dark mb-2">Contraseña</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-pxsol-blue focus:ring-2 focus:ring-blue-100" placeholder="Tu contraseña" />
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={isSubmitting || !email.trim() || !password} className="w-full rounded-lg bg-pxsol-blue px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
        {isSubmitting ? 'Validando acceso…' : 'Ingresar al demo'}
      </button>
    </form>
  )
}
