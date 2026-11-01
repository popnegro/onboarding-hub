import test from 'node:test'
import assert from 'node:assert/strict'
import { getSupabasePublicConfig } from '../src/lib/supabase/config.ts'

test('requires both a valid project URL and a public key', () => {
  assert.equal(getSupabasePublicConfig({}), null)
  assert.equal(getSupabasePublicConfig({
    NEXT_PUBLIC_SUPABASE_URL: 'https://project.supabase.co',
  }), null)
  assert.equal(getSupabasePublicConfig({
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public-key',
  }), null)
})

test('accepts the legacy anon key for backward compatibility', () => {
  assert.deepEqual(
    getSupabasePublicConfig({
      NEXT_PUBLIC_SUPABASE_URL: 'https://project.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'legacy-anon-key',
    }),
    { url: 'https://project.supabase.co', key: 'legacy-anon-key' },
  )
})

test('prefers the current publishable key when both public keys exist', () => {
  assert.deepEqual(
    getSupabasePublicConfig({
      NEXT_PUBLIC_SUPABASE_URL: 'https://project.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'legacy-anon-key',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_key',
    }),
    { url: 'https://project.supabase.co', key: 'sb_publishable_key' },
  )
})

test('trims values and rejects invalid URL protocols', () => {
  assert.deepEqual(
    getSupabasePublicConfig({
      NEXT_PUBLIC_SUPABASE_URL: ' https://project.supabase.co ',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ' public-key ',
    }),
    { url: 'https://project.supabase.co', key: 'public-key' },
  )
  assert.equal(getSupabasePublicConfig({
    NEXT_PUBLIC_SUPABASE_URL: 'javascript:alert(1)',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'public-key',
  }), null)
})
