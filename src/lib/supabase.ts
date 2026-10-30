export type ClientStatus = 'active' | 'completed' | 'archived'
export type OnboardingStepStatus = 'not_started' | 'in_progress' | 'completed' | 'verified'
export type AdoptionRiskLevel = 'alto' | 'medio' | 'bajo'

export interface Client {
  id: string
  hubspot_deal_id: string | null
  name: string
  email: string
  assigned_onboarder_id: string | null
  current_etapa: number
  progress_percentage: number
  adoption_score: number
  status: ClientStatus
  created_at: string
  updated_at: string
}

export interface OnboardingStep {
  id: string
  client_id: string
  step_number: number
  etapa: number
  title: string
  description: string | null
  status: OnboardingStepStatus
  estimated_date: string | null
  completed_date: string | null
  notes: string | null
  blocker_reason: string | null
  video_id: string | null
  depends_on_step: number | null
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  step_number: number
  title: string
  description: string | null
  url_es: string | null
  url_en: string | null
  url_pt: string | null
  duration_seconds: number | null
  thumbnail_url: string | null
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
  risk_level: AdoptionRiskLevel | null
  created_at: string
}
