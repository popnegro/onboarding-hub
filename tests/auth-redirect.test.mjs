import test from 'node:test'
import assert from 'node:assert/strict'
import { getSafeRedirectPath } from '../src/lib/auth-redirect.ts'

test('uses dashboard when destination is missing', () => assert.equal(getSafeRedirectPath(), '/dashboard'))
test('allows an internal route', () => assert.equal(getSafeRedirectPath('/clients/123?tab=steps'), '/clients/123?tab=steps'))
test('rejects protocol-relative external destinations', () => assert.equal(getSafeRedirectPath('//evil.example'), '/dashboard'))
test('rejects absolute external destinations', () => assert.equal(getSafeRedirectPath('https://evil.example'), '/dashboard'))
test('prevents redirects back to login', () => assert.equal(getSafeRedirectPath('/login?next=/dashboard'), '/dashboard'))
