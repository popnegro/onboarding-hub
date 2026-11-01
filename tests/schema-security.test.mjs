import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const schema = readFileSync(new URL('../schema.sql', import.meta.url), 'utf8')
const library = JSON.parse(readFileSync(new URL('../content/onboarding/pxsol-onboarding-es.v1.json', import.meta.url), 'utf8'))
const clientCard = readFileSync(new URL('../src/components/ClientCard.tsx', import.meta.url), 'utf8')
const clientPage = readFileSync(new URL('../src/app/clients/[id]/ClientPageContent.tsx', import.meta.url), 'utf8')
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
    assert.match(migration, new RegExp('CREATE TABLE public\\.' + table, 'i'))
    assert.match(migration, new RegExp('ALTER TABLE public\\.' + table + ' ENABLE ROW LEVEL SECURITY', 'i'))
    assert.match(migration, new RegExp('CREATE POLICY internal_authenticated_all_' + table, 'i'))
  }
  assert.ok(migration.toUpperCase().indexOf('CREATE TABLE PUBLIC.VIDEOS') < migration.toUpperCase().indexOf('CREATE POLICY'))
  assert.match(migration, /REVOKE ALL ON TABLE[\s\S]+FROM anon/i)
  assert.match(migration, /GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE[\s\S]+TO authenticated/i)
})

test('seeds one clearly fictional client and all 20 approved editorial steps idempotently', () => {
  assert.ok(migration.includes('HOTEL DEMO PXSOL — DATOS FICTICIOS'))
  assert.ok(migration.includes('demo@pxsol.invalid'))
  assert.ok(migration.includes('00000000-0000-4000-8000-000000000001'))
  assert.ok(migration.toUpperCase().includes('ON CONFLICT (CLIENT_ID, STEP_NUMBER) DO NOTHING'))
  const seedValues = migration.split('cross join (')[1]?.split(') as demo_steps')[0] ?? ''
  const seededTitles = seedValues.split('\n').map((line) => {
    const match = line.trim().match(/^\(\d+,\s*\d+,\s*'(.+)'\),?$/)
    return match?.[1].replaceAll("''", "'")
  }).filter(Boolean)
  assert.deepEqual(seededTitles, library.videos.map((video) => video.title))
})

test('stage labels in dashboard and detail match the approved onboarding library', () => {
  for (const stage of library.stages) {
    const expected = `${stage.id}: '${stage.name}'`
    assert.ok(clientCard.includes(expected), `ClientCard missing stage label: ${stage.name}`)
    assert.ok(clientPage.includes(expected), `ClientPageContent missing stage label: ${stage.name}`)
  }
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
