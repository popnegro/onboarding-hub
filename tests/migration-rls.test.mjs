import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'

test('initial Supabase migration applies schema, seeds demo data and enforces role-based RLS', async () => {
  const database = new PGlite()

  try {
    await database.exec(`
      CREATE ROLE anon NOLOGIN;
      CREATE ROLE authenticated NOLOGIN;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users (id uuid PRIMARY KEY);
      CREATE FUNCTION auth.uid() RETURNS uuid
      LANGUAGE sql STABLE
      AS $$ SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    `)

    const migration = (await readFile(
      new URL('../supabase/migrations/20261031_internal_demo_access.sql', import.meta.url),
      'utf8',
    )).replace(
      'create extension if not exists pgcrypto;',
      '-- PGlite test: gen_random_uuid() is provided by PostgreSQL core; pgcrypto is Supabase-hosted.',
    )

    await database.exec(migration)

    const policies = await database.query(`
      SELECT count(*)::int AS count
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename IN ('videos', 'clients', 'onboarding_steps', 'adoption_metrics', 'video_sends')
    `)
    assert.equal(policies.rows[0].count, 5)

    const steps = await database.query('SELECT count(*)::int AS count FROM public.onboarding_steps')
    assert.equal(steps.rows[0].count, 20)

    const anonPrivileges = await database.query(
      "SELECT has_table_privilege('anon', 'public.clients', 'select') AS allowed",
    )
    assert.equal(anonPrivileges.rows[0].allowed, false)

    await database.exec('SET ROLE authenticated')
    const unauthenticatedRows = await database.query('SELECT count(*)::int AS count FROM public.clients')
    assert.equal(unauthenticatedRows.rows[0].count, 0)

    await database.exec("SELECT set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', false)")
    const authenticatedRows = await database.query('SELECT count(*)::int AS count FROM public.clients')
    assert.equal(authenticatedRows.rows[0].count, 1)

    await database.query(`
      INSERT INTO public.clients (name, email)
      VALUES ('QA INTERNAL USER', 'qa-internal@pxsol.invalid')
    `)
    const insertedRows = await database.query(
      "SELECT count(*)::int AS count FROM public.clients WHERE email = 'qa-internal@pxsol.invalid'",
    )
    assert.equal(insertedRows.rows[0].count, 1)

    await database.exec('RESET ROLE')
    await database.exec('SET ROLE anon')
    await assert.rejects(database.query('SELECT * FROM public.clients'))
  } finally {
    await database.close()
  }
})
