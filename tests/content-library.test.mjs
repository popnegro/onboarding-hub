import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const migration = await readFile(new URL('../supabase/migrations/20261101170000_content_resources.sql', import.meta.url), 'utf8')
const page = await readFile(new URL('../src/app/content/page.tsx', import.meta.url), 'utf8')
const library = await readFile(new URL('../src/components/ContentLibrary.tsx', import.meta.url), 'utf8')
const middleware = await readFile(new URL('../src/middleware.ts', import.meta.url), 'utf8')

test('content catalog restricts supported formats and stage/language values', () => {
  assert.match(migration, /content_type in \('video', 'pdf', 'presentation'\)/)
  assert.match(migration, /stage between 1 and 4/)
  assert.match(migration, /language in \('es', 'en', 'pt'\)/)
})

test('content catalog and private storage are restricted to authenticated users', () => {
  assert.match(migration, /alter table public\.content_resources enable row level security/i)
  assert.match(migration, /revoke all on table public\.content_resources from anon/i)
  assert.match(migration, /to authenticated/i)
  assert.match(migration, /values \([\s\S]*'pxsol-onboarding-content'[\s\S]*false/i)
  assert.match(migration, /create policy pxsol_content_authenticated_insert[\s\S]*bucket_id = 'pxsol-onboarding-content'/i)
})

test('library uploads enforce size and MIME validation and use private signed URLs', () => {
  assert.match(library, /100 \* 1024 \* 1024/)
  assert.match(library, /ACCEPTED\[type\]/)
  assert.match(library, /upsert: false/)
  assert.match(library, /createSignedUrl\([^,]+, 300\)/)
  assert.doesNotMatch(library, /getPublicUrl/)
})

test('content library route is protected by the existing authentication middleware', () => {
  assert.match(middleware, /pathname === '\/content'/)
  assert.match(page, /content_resources/)
})
