import test from 'node:test'
import assert from 'node:assert/strict'
import {
  arrayToRecord,
  cn,
  daysSince,
  formatDate,
  formatDateTime,
  truncate,
} from '../src/lib/utils.ts'

test('formatDate renders an es-AR date', () => {
  assert.equal(formatDate('2025-12-31T12:00:00.000Z'), '31/12/2025')
})

test('formatDateTime includes date and time components', () => {
  const result = formatDateTime('2025-12-31T15:45:00.000Z')
  assert.match(result, /31\/12\/2025/)
  assert.match(result, /\d{2}:\d{2}/)
})

test('daysSince floors elapsed full days', () => {
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
  assert.equal(daysSince(twoDaysAgo), 2)
})

test('truncate leaves short text untouched and adds an ellipsis to long text', () => {
  assert.equal(truncate('short', 10), 'short')
  assert.equal(truncate('abcdefgh', 5), 'abcde...')
})

test('cn joins truthy classes and ignores false or undefined values', () => {
  assert.equal(cn('block', false, undefined, 'text-sm'), 'block text-sm')
})

test('arrayToRecord indexes items by the selected key', () => {
  assert.deepEqual(
    arrayToRecord([{ id: 'a', value: 1 }, { id: 'b', value: 2 }], 'id'),
    { a: { id: 'a', value: 1 }, b: { id: 'b', value: 2 } },
  )
})
