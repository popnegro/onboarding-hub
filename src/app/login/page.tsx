import { LockKeyhole, ShieldCheck } from 'lucide-react'
import LoginForm from '@/components/LoginForm'
import { getSupabasePublicConfig } from '@/lib/supabase/config'

interface LoginPageProps { searchParams: Promise<{ next?: string }> }

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams
  const nextPath = next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/login') ? next : '/dashboard'
  const configured = Boolean(getSupabasePublicConfig({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }))

  return (
    <div className="min-h-[70vh] bg-pxsol-light px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 sm:p-9">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-pxsol-blue"><LockKeyhole size={24} /></div>
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-pxsol-blue mb-2">PXSOL · Demo interno</p>
            <h1 className="text-2xl font-bold text-pxsol-dark">Acceso al Onboarding Hub</h1>
            <p className="mt-2 text-sm text-pxsol-gray">Ingresá con una cuenta interna habilitada por el administrador.</p>
          </div>
          {configured ? (
            <LoginForm nextPath={nextPath} />
          ) : (
            <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Supabase Auth todavía no está configurado para este entorno. El acceso al dashboard permanece bloqueado.</div>
          )}
          <div className="mt-7 flex items-start gap-3 border-t border-gray-100 pt-5 text-xs leading-relaxed text-pxsol-gray">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-green-700" />
            <p>Acceso privado para el equipo PXSOL. No hay registro público ni acceso para clientes hoteleros.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
