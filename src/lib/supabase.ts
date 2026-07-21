import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isRealSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl.startsWith('http') && 
  supabaseAnonKey && 
  supabaseAnonKey.length > 10;

export const supabase = isRealSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (mockSupabase as any); // Excelente fallback local para desarrollo