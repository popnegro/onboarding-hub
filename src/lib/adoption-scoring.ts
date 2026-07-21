import type { AdoptionMetric } from './supabase'

export interface ScoringConfig {
  reservations_weight: number
  active_users_weight: number
  rates_updated_weight: number
  reports_generated_weight: number
  integrations_weight: number
}

const DEFAULT_CONFIG: ScoringConfig = {
  reservations_weight: 0.3,
  active_users_weight: 0.2,
  rates_updated_weight: 0.2,
  reports_generated_weight: 0.15,
  integrations_weight: 0.15,
}

export function calculateAdoptionScore(metric: AdoptionMetric): number {
  // Normalizar cada métrica a escala 0-100
  const reservationsScore = Math.min((metric.reservations_7d / 150) * 100, 100) // 150 = ideal
  const usersScore = Math.min((metric.active_users / 5) * 100, 100) // 5 = ideal
  const ratesScore = metric.rates_updated ? 100 : 0
  const reportsScore = Math.min((metric.reports_generated / 10) * 100, 100) // 10 = ideal
  const integrationsScore = Math.min((metric.integrations_active / 4) * 100, 100) // 4 = ideal

  const score =
    reservationsScore * DEFAULT_CONFIG.reservations_weight +
    usersScore * DEFAULT_CONFIG.active_users_weight +
    ratesScore * DEFAULT_CONFIG.rates_updated_weight +
    reportsScore * DEFAULT_CONFIG.reports_generated_weight +
    integrationsScore * DEFAULT_CONFIG.integrations_weight

  return Math.round(score)
}

export function getRiskLevel(score: number): 'alto' | 'medio' | 'bajo' {
  if (score >= 70) return 'alto' // No es riesgo, es "On Track"
  if (score >= 40) return 'medio'
  return 'bajo' // Bajo/Crítico
}

export function getScoreColor(score: number): string {
  if (score >= 70) return '#10b981' // Verde
  if (score >= 40) return '#f59e0b' // Ámbar
  return '#ef4444' // Rojo
}

export function getScoreLabel(score: number): string {
  if (score >= 70) return 'Alto (On Track)'
  if (score >= 40) return 'Medio (Atención)'
  return 'Bajo / Churn (Crítico)'
}
