import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateAdoptionScore,
  getRiskLevel,
  getScoreColor,
  getScoreLabel,
} from '../src/lib/adoption-scoring.ts'

const metric = (overrides = {}) => ({
  id: 'metric-1',
  client_id: 'client-1',
  measurement_date: '2026-10-30',
  reservations_7d: 0,
  active_users: 0,
  rates_updated: false,
  reports_generated: 0,
  integrations_active: 0,
  adoption_score: 0,
  risk_level: null,
  created_at: '2026-10-30T00:00:00.000Z',
  ...overrides,
})

test('calculateAdoptionScore returns zero when every adoption signal is zero', () => {
  assert.equal(calculateAdoptionScore(metric()), 0)
})

test('calculateAdoptionScore returns 100 when every signal reaches its target', () => {
  assert.equal(
    calculateAdoptionScore(metric({
      reservations_7d: 150,
      active_users: 5,
      rates_updated: true,
      reports_generated: 10,
      integrations_active: 4,
    })),
    100,
  )
})

test('calculateAdoptionScore applies the documented weights', () => {
  assert.equal(
    calculateAdoptionScore(metric({
      reservations_7d: 75,
      active_users: 2.5,
      rates_updated: true,
      reports_generated: 5,
      integrations_active: 2,
    })),
    60,
  )
})

test('calculateAdoptionScore caps signals above their target', () => {
  assert.equal(
    calculateAdoptionScore(metric({
      reservations_7d: 300,
      active_users: 10,
      rates_updated: true,
      reports_generated: 20,
      integrations_active: 8,
    })),
    100,
  )
})

test('getRiskLevel preserves the documented score boundaries', () => {
  assert.equal(getRiskLevel(70), 'alto')
  assert.equal(getRiskLevel(40), 'medio')
  assert.equal(getRiskLevel(39), 'bajo')
})

test('getScoreColor maps high, medium and low scores to their status colors', () => {
  assert.equal(getScoreColor(70), '#10b981')
  assert.equal(getScoreColor(40), '#f59e0b')
  assert.equal(getScoreColor(39), '#ef4444')
})

test('getScoreLabel describes each score band', () => {
  assert.equal(getScoreLabel(70), 'Alto (On Track)')
  assert.equal(getScoreLabel(40), 'Medio (Atención)')
  assert.equal(getScoreLabel(39), 'Bajo / Churn (Crítico)')
})
