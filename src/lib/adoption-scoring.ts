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

function normalizeSignal(value: number, target: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(Math.max((value / target) * 100, 0), 100)
}

export function calculateAdoptionScore(metric: AdoptionMetric): number {
  // Normalizar cada señal a escala 0-100 y descartar valores inválidos/negativos.
  const reservationsScore = normalizeSignal(metric.reservations_7d, 150) // 150 = ideal
  const usersScore = normalizeSignal(metric.active_users, 5) // 5 = ideal
  const ratesScore = metric.rates_updated ? 100 : 0
  const reportsScore = normalizeSignal(metric.reports_generated, 10) // 10 = ideal
  const integrationsScore = normalizeSignal(metric.integrations_active, 4) // 4 = ideal

  const score =
    reservationsScore * DEFAULT_CONFIG.reservations_weight +
    usersScore * DEFAULT_CONFIG.active_users_weight +
    ratesScore * DEFAULT_CONFIG.rates_updated_weight +
    reportsScore * DEFAULT_CONFIG.reports_generated_weight +
    integrationsScore * DEFAULT_CONFIG.integrations_weight

  return Math.round(score)
}

export function getRiskLevel(score: number): 'alto' | 'medio' | 'bajo' {
  // El campo describe riesgo de churn: una adopción alta implica riesgo bajo.
  if (!Number.isFinite(score) || score < 40) return 'alto'
  if (score < 70) return 'medio'
  return 'bajo'
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
