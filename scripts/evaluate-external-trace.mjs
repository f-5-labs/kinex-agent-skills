import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadScenarios } from './load-scenarios.mjs';
const retiredShotInputs = [
  'requireLockedEntities', 'cameraNotes', 'shotType', 'firstFrameBlocking',
  'performanceNotes', 'dialogue', 'voiceDirection', 'speakerEntityId',
  'breakdown', 'aspectRatio',
];

/** Matches nested expected fields while requiring arrays to retain exact membership and order. */
function containsExpected(actual, expected) {
  if (Array.isArray(expected)) {
    return Array.isArray(actual) && actual.length === expected.length &&
      expected.every((value, index) => containsExpected(actual[index], value));
  }
  if (expected !== null && typeof expected === 'object') {
    return actual !== null && typeof actual === 'object' && !Array.isArray(actual) &&
      Object.entries(expected).every(([key, value]) => containsExpected(actual[key], value));
  }
  return actual === expected;
}

/** Checks observable call routing and inputs, not server success or a scenario's prose rubric. */
export function evaluateExternalTrace(scenario, trace) {
  const failures = [];
  if (trace.scenarioId !== scenario.id) failures.push('trace scenarioId does not match the scenario');
  const calls = (trace.events ?? []).filter((event) => event.type === 'tool_call');
  const calledTools = calls.map((event) => event.tool);
  for (const tool of scenario.expectedTools ?? []) {
    if (!calledTools.includes(tool)) failures.push(`missing required tool: ${tool}`);
  }
  for (const tool of scenario.forbiddenTools ?? []) {
    if (calledTools.includes(tool)) failures.push(`called forbidden tool: ${tool}`);
  }
  let lastIndex = -1;
  for (const tool of scenario.orderedTools ?? []) {
    const index = calledTools.indexOf(tool, lastIndex + 1);
    if (index === -1) {
      failures.push(`required order not satisfied after index ${lastIndex}: ${tool}`);
      break;
    }
    lastIndex = index;
  }
  for (const [tool, input] of Object.entries(scenario.requiredToolInputs ?? {})) {
    if (!calls.some((call) => call.tool === tool && containsExpected(call.input, input))) {
      failures.push(`${tool} never received required input ${JSON.stringify(input)}`);
    }
  }
  const matched = new Set();
  for (const requirement of scenario.requiredToolCalls ?? []) {
    const index = calls.findIndex((call, index) => !matched.has(index) &&
      call.tool === requirement.tool && containsExpected(call.input, requirement.input ?? {}));
    if (index === -1) {
      failures.push(`${requirement.tool} never received required distinct input ${JSON.stringify(requirement.input ?? {})}`);
    } else {
      matched.add(index);
    }
  }
  for (const call of calls.filter((call) => ['shot_define', 'shot_update'].includes(call.tool))) {
    for (const key of retiredShotInputs) {
      if (Object.hasOwn(call.input ?? {}, key)) failures.push(`${call.tool} contains unsupported authoring field: ${key}`);
    }
  }
  return { failures, callCount: calls.length };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [scenarioId, tracePathArg] = process.argv.slice(2);
  if (!scenarioId || !tracePathArg) {
    console.error('Usage: node scripts/evaluate-external-trace.mjs <scenario-id> <external-trace.json>');
    process.exit(2);
  }
  const scenarios = await loadScenarios();
  const scenario = scenarios.scenarios.find((candidate) => candidate.id === scenarioId);
  if (!scenario) {
    console.error(`Unknown external MCP scenario: ${scenarioId}`);
    process.exit(2);
  }
  const trace = JSON.parse(await readFile(path.resolve(process.cwd(), tracePathArg), 'utf8'));
  const result = evaluateExternalTrace(scenario, trace);
  if (result.failures.length) {
    console.error(`External MCP trace failed ${scenarioId}:\n- ${result.failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log(`Trace routing passed ${scenarioId}: ${result.callCount} calls checked; execution and creative quality not assessed.`);
}
