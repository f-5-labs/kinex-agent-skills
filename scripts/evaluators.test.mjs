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
