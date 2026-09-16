import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { evaluateExternalTrace } from './evaluate-external-trace.mjs';
import { loadScenarios } from './load-scenarios.mjs';
import { evaluateDirectionReadiness } from './evaluate-direction-readiness.mjs';

const scenario = {
  id: 'nested-shot-repair',
  expectedTools: ['shot_get', 'shot_update'],
  orderedTools: ['shot_get', 'shot_update', 'shot_get'],
  forbiddenTools: ['workspace_execute_command', 'shot_delete'],
  requiredToolInputs: {
    shot_update: {
      projectId: 'p1', shotId: 's1',
      camera: { movement: 'locked-off' },
      castEntityIds: ['giver', 'listener'],
      audio: { intent: 'reference_audio', speakerEntityId: null },
    },
  },
};
const trace = {
  scenarioId: scenario.id,
  events: [
    { type: 'tool_call', tool: 'shot_get', input: { projectId: 'p1', shotId: 's1' } },
    { type: 'tool_call', tool: 'shot_update', input: {
      projectId: 'p1', shotId: 's1',
      camera: { movement: 'locked-off', lighting: 'window side-key' },
      castEntityIds: ['giver', 'listener'],
      audio: { intent: 'reference_audio', speakerEntityId: null, referenceMediaItemId: 'a1' },
    } },
    { type: 'tool_call', tool: 'shot_get', input: { projectId: 'p1', shotId: 's1' } },
  ],
};

test('nested matching permits additional fields, preserving exact arrays and null', () => {
  assert.deepEqual(evaluateExternalTrace(scenario, trace).failures, []);
});

for (const [name, mutate] of [
  ['wrong nested camera', (value) => { value.events[1].input.camera.movement = 'push-in'; }],
  ['lost cast member', (value) => { value.events[1].input.castEntityIds.pop(); }],
  ['omitted explicit clear', (value) => { delete value.events[1].input.audio.speakerEntityId; }],
  ['missing readback', (value) => { value.events.pop(); }],
  ['retired flat input', (value) => { value.events[1].input.cameraNotes = 'locked-off'; }],
  ['forbidden execution', (value) => { value.events.push({ type: 'tool_call', tool: 'workspace_execute_command' }); }],
  ['wrong scenario identity', (value) => { value.scenarioId = 'another-task'; }],
]) {
  test(`rejects ${name}`, () => {
    const changed = structuredClone(trace);
    mutate(changed);
    assert.ok(evaluateExternalTrace(scenario, changed).failures.length);
  });
}

test('required distinct calls cannot reuse a single write', () => {
  const changed = { ...scenario, requiredToolCalls: [
    { tool: 'shot_update', input: { shotId: 's1' } },
    { tool: 'shot_update', input: { shotId: 's1' } },
  ] };
  assert.ok(evaluateExternalTrace(changed, trace).failures.length);
});

test('shot creation supports explicit beat-local order', () => {
  const create = { id: 'create', expectedTools: ['shot_define'] };
  const result = evaluateExternalTrace(create, { scenarioId: 'create', events: [
    { type: 'tool_call', tool: 'shot_define', input: { order: 0 } },
  ] });
  assert.deepEqual(result.failures, []);
});

const { baseline } = JSON.parse(await readFile(
  new URL('../evals/fixtures/direction-readiness-cases.json', import.meta.url), 'utf8',
));

const suites = await loadScenarios();

// Synthetic ordering contract, not evidence that a real generated image passed review.
const heroPromotion = {
  id: 'review-before-hero-promotion',
  beforeTool: 'workspace_update_entity',
  orderedTools: ['workspace_read_entity', 'workspace_update_entity', 'workspace_read_entity'],
  requiredToolInputs: { workspace_update_entity: {
    projectId: 'p1', kind: 'character', entityId: 'c1', primaryMediaId: 'candidate-1',
  } },
  requiredEvents: [
    { type: 'tool_result', tool: 'workspace_read_entity', output: { primaryMediaId: null } },
    { type: 'review_result', verdict: 'PASS', mediaItemId: 'candidate-1', pixelEvidence: ['inspected candidate pixels'] },
  ],
};
const heroPromotionTrace = {
  scenarioId: heroPromotion.id,
  events: [
    { type: 'tool_call', tool: 'workspace_read_entity' },
    { type: 'tool_result', tool: 'workspace_read_entity', output: { primaryMediaId: null } },
    { type: 'review_result', verdict: 'PASS', mediaItemId: 'candidate-1', pixelEvidence: ['inspected candidate pixels'] },
    { type: 'tool_call', tool: 'workspace_update_entity', input: heroPromotion.requiredToolInputs.workspace_update_entity },
    { type: 'tool_call', tool: 'workspace_read_entity' },
  ],
};
test('explicit hero promotion follows candidate pixel review', () => {
  assert.deepEqual(evaluateExternalTrace(heroPromotion, heroPromotionTrace).failures, []);
});
for (const [name, mutate] of [
  ['early assignment', (value) => value.events.unshift(structuredClone(value.events[3]))],
  ['failed pixel review', (value) => { value.events[2].verdict = 'REJECT'; }],
  ['metadata-only review', (value) => { value.events[2].pixelEvidence = []; }],
  ['wrong reviewed candidate', (value) => { value.events[2].mediaItemId = 'another-image'; }],
  ['missing assignment readback', (value) => value.events.pop()],
]) {
  test(`hero promotion rejects ${name}`, () => {
    const changed = structuredClone(heroPromotionTrace);
    mutate(changed);
    assert.ok(evaluateExternalTrace(heroPromotion, changed).failures.length);
  });
}
const grounded = suites.scenarios.find((value) => value.id === 'grounded-story-research-design-before-prompt');
const groundedTrace = JSON.parse(await readFile(new URL(
  '../evals/fixtures/grounded-story-research-design-before-prompt.trace.json', import.meta.url,
), 'utf8'));

for (const [name, mutate] of [
  ['generation before design writes', (value) => {
    const generation = value.events.findIndex((event) => event.tool === 'workspace_execute_command');
    value.events.unshift(...value.events.splice(generation, 1));
  }],
  ['empty call inputs', (value) => {
    value.events.filter((event) => event.type === 'tool_call').forEach((event) => { event.input = {}; });
  }],
  ['invalid shot command', (value) => {
    value.events.find((event) => event.tool === 'workspace_execute_command').input.type = 'shot.generateImage';
  }],
  ['research only in prose', (value) => {
    delete value.events.find((event) => event.tool === 'workspace_update_entity').input.attributesPatch;
  }],
  ['failed entity persistence', (value) => {
    value.events.find((event) => event.type === 'tool_result' && event.tool === 'workspace_read_entity')
      .output.entity.attributes.visualLock = 'Generic interior';
  }],
  ['missing shot readback', (value) => {
    value.events = value.events.filter((event) => !(event.type === 'tool_result' && event.tool === 'shot_get'));
  }],
  ['wrong saved prop custody', (value) => {
    value.events.find((event) => event.type === 'tool_result' && event.tool === 'shot_get')
      .output.shot.direction.blocking = 'Visitor already holds the latch';
  }],
  ['an early generation hidden by a later retry', (value) => {
    value.events.unshift(structuredClone(value.events.find((event) => event.tool === 'workspace_execute_command')));
  }],
]) {
  test(`grounded preflight rejects ${name}`, () => {
    const changed = structuredClone(groundedTrace);
    mutate(changed);
    assert.ok(evaluateExternalTrace(grounded, changed).failures.length);
  });
}

test('metadata-only review cannot claim a pixel PASS', async () => {
  const spec = suites.scenarios.find((value) => value.id === 'visual-realism-pixel-review');
  const value = JSON.parse(await readFile(new URL(
    '../evals/fixtures/visual-realism-pixel-review.trace.json', import.meta.url,
  ), 'utf8'));
  const accepted = evaluateExternalTrace(spec, value);
  assert.deepEqual(accepted.failures, []);
  assert.equal(accepted.creativeAcceptance, 'NOT_ASSESSED');
  value.events.push({ type: 'assistant_message', text: 'PASS. I did not inspect any pixels.' });
  assert.ok(evaluateExternalTrace(spec, value).failures.length);
  value.events.pop();
  value.events.at(-1).verdict = 'PASS';
  assert.ok(evaluateExternalTrace(spec, value).failures.length);
  value.events.pop();
  assert.ok(evaluateExternalTrace(spec, value).failures.length);
});

test('character design review precedes the first identity image, not only shot generation', async () => {
  const id = 'grounded-character-design-before-first-image';
  const spec = suites.scenarios.find((value) => value.id === id);
  const value = JSON.parse(await readFile(new URL(`../evals/fixtures/${id}.trace.json`, import.meta.url), 'utf8'));
  assert.deepEqual(evaluateExternalTrace(spec, value).failures, []);
  const index = value.events.findIndex((event) => event.type === 'design_review');
  value.events.push(...value.events.splice(index, 1));
  assert.ok(evaluateExternalTrace(spec, value).failures.length);
});

for (const [id, forbiddenTool] of [
  ['grounded-library-design-stays-library', 'project_create_from_brief'],
  ['grounded-prompt-only-no-project-writes', 'workspace_update_entity'],
]) {
  test(`${id} rejects scope expansion`, async () => {
    const spec = suites.scenarios.find((value) => value.id === id);
    const value = JSON.parse(await readFile(new URL(`../evals/fixtures/${id}.trace.json`, import.meta.url), 'utf8'));
    assert.deepEqual(evaluateExternalTrace(spec, value).failures, []);
    value.events.push({ type: 'tool_call', tool: forbiddenTool, input: {} });
    assert.ok(evaluateExternalTrace(spec, value).failures.length);
  });
}

for (const [name, record] of [
  ['empty coverage', { ...baseline, shots: [] }],
  ['unknown stage', { ...baseline, targetStage: 'APPROVED' }],
  ['missing stage', { ...baseline, targetStage: undefined }],
  ['duplicate shot identity', { ...baseline, shots: [baseline.shots[0], baseline.shots[0]] }],
  ['missing record', null],
]) {
  test(`review lint rejects ${name}`, () => {
    assert.deepEqual(evaluateDirectionReadiness(record).codes, ['REVIEW_RECORD_INVALID']);
  });
}

test('equivalent numeric ratios match without asserting an operation enum', () => {
  assert.ok(!evaluateDirectionReadiness(baseline).codes.includes('FORMAT_UNSYNCED'));
});

test('all self-reported evidence still cannot grant creative acceptance', () => {
  const claimed = structuredClone(baseline);
  claimed.targetStage = 'MOTION_PASS';
  claimed.format.actualDimensionsVerified = true;
  for (const key of Object.keys(claimed.evidence)) claimed.evidence[key] = true;
  const result = evaluateDirectionReadiness(claimed);
  assert.equal(result.verdict, 'PASS');
  assert.equal(result.acceptance, 'NOT_ASSESSED');
});

test('every checked-in trace passes its declared routing scenario', async () => {
  const { readdir } = await import('node:fs/promises');
  const { scenarios } = await loadScenarios();
  const directory = new URL('../evals/fixtures/', import.meta.url);
  for (const file of (await readdir(directory)).filter((name) => name.endsWith('.trace.json'))) {
    const value = JSON.parse(await readFile(new URL(file, directory), 'utf8'));
    const spec = scenarios.find((candidate) => candidate.id === value.scenarioId);
    assert.ok(spec, `Unknown scenario in ${file}`);
    assert.deepEqual(evaluateExternalTrace(spec, value).failures, [], file);
  }
});
