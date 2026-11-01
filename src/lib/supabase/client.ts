import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabasePublicConfig } from './config'

let browserClient: SupabaseClient | undefined

/** Creates a browser Supabase client with cookie-based auth support. */
export function createClient(): SupabaseClient {
  const config = getSupabasePublicConfig({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  })

  if (!config) {
    throw new Error(
      'Supabase no está configurado. Definí NEXT_PUBLIC_SUPABASE_URL y una clave pública: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY o NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  browserClient ??= createBrowserClient(config.url, config.key)
  return browserClient
}
