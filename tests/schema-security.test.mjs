import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const schema = readFileSync(new URL('../schema.sql', import.meta.url), 'utf8')

test('enables row-level security on every application table', () => {
  for (const table of ['videos', 'clients', 'onboarding_steps', 'adoption_metrics', 'video_sends']) {
    assert.match(schema, new RegExp('ALTER TABLE\\s+' + table + '\\s+ENABLE ROW LEVEL SECURITY', 'i'))
  }
})

test('keeps default-deny policy posture until ownership and roles are defined', () => {
  assert.equal(schema.toUpperCase().includes('CREATE POLICY'), false)
  assert.equal(schema.toUpperCase().includes('USING (TRUE)'), false)
  assert.ok(schema.includes('Sin políticas explícitas, el acceso vía anon key'))
  assert.ok(schema.includes('queda denegado por defecto.'))
})

test('prevents duplicate onboarding steps for the same client and step number', () => {
  assert.ok(schema.includes('UNIQUE (client_id, step_number)'))
})
