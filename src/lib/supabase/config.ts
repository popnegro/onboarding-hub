export interface SupabasePublicEnvironment {
  NEXT_PUBLIC_SUPABASE_URL?: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string
}

export interface SupabasePublicConfig {
  url: string
  key: string
}

/**
 * Resolve the public Supabase project configuration.
 * Prefer the current publishable key and retain compatibility with legacy anon keys.
 */
export function getSupabasePublicConfig(
  environment: SupabasePublicEnvironment,
): SupabasePublicConfig | null {
  const url = environment.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = (
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    environment.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim()

  if (!url || !key) return null

  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) return null
  } catch {
    return null
  }

  return { url, key }
}
