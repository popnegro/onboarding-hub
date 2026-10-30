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
  assert.doesNotMatch(schema, /CREATE\s+POLICY/i)
  assert.doesNotMatch(schema, /USING\s*\(\s*true\s*\)/i)
  assert.match(schema, /Sin políticas explícitas, el acceso vía anon key\s+queda denegado por defecto/i)
})

test('prevents duplicate onboarding steps for the same client and step number', () => {
  assert.match(schema, /UNIQUE\s*\(client_id,\s*step_number\)/i)
})
