import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const schema = readFileSync(new URL('../schema.sql', import.meta.url), 'utf8')
const migration = readFileSync(
  new URL('../supabase/migrations/20261031_internal_demo_access.sql', import.meta.url),
  'utf8',
)

test('enables row-level security on every application table in the reference schema', () => {
  for (const table of ['videos', 'clients', 'onboarding_steps', 'adoption_metrics', 'video_sends']) {
    assert.match(schema, new RegExp('ALTER TABLE\\s+' + table + '\\s+ENABLE ROW LEVEL SECURITY', 'i'))
  }
})

test('initial migration creates all application tables before applying access policies', () => {
  const tables = ['videos', 'clients', 'onboarding_steps', 'adoption_metrics', 'video_sends']
  for (const table of tables) {
    assert.match(migration, new RegExp('CREATE TABLE IF NOT EXISTS public\\.' + table, 'i'))
    assert.match(migration, new RegExp('ALTER TABLE public\\.' + table + ' ENABLE ROW LEVEL SECURITY', 'i'))
    assert.match(migration, new RegExp('CREATE POLICY internal_authenticated_all_' + table, 'i'))
  }
  assert.ok(migration.indexOf('CREATE TABLE IF NOT EXISTS public.videos') < migration.indexOf('CREATE POLICY'))
  assert.match(migration, /REVOKE ALL ON TABLE[\\s\\S]+FROM anon/i)
  assert.match(migration, /GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE[\\s\\S]+TO authenticated/i)
})

test('reference schema keeps default-deny posture until the internal access migration is applied', () => {
  assert.equal(schema.toUpperCase().includes('CREATE POLICY'), false)
  assert.equal(schema.toUpperCase().includes('USING (TRUE)'), false)
  assert.ok(schema.includes('Sin políticas explícitas, el acceso vía anon key'))
  assert.ok(schema.includes('queda denegado por defecto.'))
})

test('prevents duplicate onboarding steps for the same client and step number', () => {
  assert.ok(schema.includes('UNIQUE (client_id, step_number)'))
})
