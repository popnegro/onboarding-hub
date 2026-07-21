import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de datos
export interface Client {
  id: string
  hubspot_deal_id?: string
  name: string
  email: string
  assigned_onboarder_id?: string
  current_etapa: number
  progress_percentage: number
  adoption_score: number
  status: 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export interface OnboardingStep {
  id: string
  client_id: string
  step_number: number
  etapa: number
  title: string
  description?: string
  status: 'not_started' | 'in_progress' | 'completed' | 'verified'
  estimated_date?: string
  completed_date?: string
  notes?: string
  blocker_reason?: string
  video_id?: string
  depends_on_step?: number
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  step_number: number
  title: string
  description?: string
  url_es?: string
  url_en?: string
  url_pt?: string
  duration_seconds?: number
  thumbnail_url?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface AdoptionMetric {
  id: string
  client_id: string
  measurement_date: string
  reservations_7d: number
  active_users: number
  rates_updated: boolean
  reports_generated: number
  integrations_active: number
  adoption_score: number
  risk_level: 'alto' | 'medio' | 'bajo'
  created_at: string
}
