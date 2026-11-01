import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const library = JSON.parse(readFileSync(new URL('../content/onboarding/pxsol-onboarding-es.v1.json', import.meta.url), 'utf8'))

test('PXSOL Spanish onboarding library contains exactly 20 ordered steps', () => {
  assert.equal(library.language, 'es')
  assert.equal(library.videos.length, 20)
  assert.deepEqual(library.videos.map((video) => video.step_number), Array.from({ length: 20 }, (_, index) => index + 1))
})

test('all steps belong to the four documented stages', () => {
  assert.deepEqual(library.stages.map((stage) => stage.steps.length), [4, 6, 6, 4])
  for (const stage of library.stages) {
    for (const number of stage.steps) assert.equal(library.videos[number - 1].stage_id, stage.id)
  }
})

test('all scripts are draft screen recordings and contain validation notes', () => {
  for (const video of library.videos) {
    assert.equal(video.language, 'es')
    assert.equal(video.format, 'screen_recording')
    assert.equal(video.editorial_status, 'draft')
    assert.equal(video.video_status, 'not_recorded')
    assert.equal(video.video_url, null)
    assert.ok(video.objective.length > 20)
    assert.ok(video.screen_plan.length > 20)
    assert.ok(video.narration.length > 50)
    assert.ok(video.validation_required.length > 20)
    assert.ok(['proposed', 'pending_validation'].includes(video.verification_status))
  }
})

test('library explicitly prevents fabricated product claims and premature publication', () => {
  assert.equal(library.source_availability, 'none')
  assert.equal(library.publication_status, 'draft')
  assert.ok(library.production_rules.some((rule) => rule.includes('No inventar')))
  assert.ok(library.videos.every((video) => video.approved_by === null && video.approved_at === null))
})
