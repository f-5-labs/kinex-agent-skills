import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [scenarioId, tracePathArg] = process.argv.slice(2);

if (!scenarioId || !tracePathArg) {
  console.error(
    'Usage: node scripts/evaluate-external-trace.mjs <scenario-id> <external-trace.json>'
  );
  process.exit(2);
}

const scenarios = JSON.parse(await readFile(path.join(root, 'evals/scenarios.json'), 'utf8'));
const scenario = scenarios.scenarios.find((candidate) => candidate.id === scenarioId);
if (!scenario) {
  console.error(`Unknown external MCP scenario: ${scenarioId}`);
  process.exit(2);
}

const tracePath = path.resolve(process.cwd(), tracePathArg);
const trace = JSON.parse(await readFile(tracePath, 'utf8'));
const calls = (trace.events ?? []).filter((event) => event.type === 'tool_call');
const calledTools = calls.map((event) => event.tool);
const failures = [];

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

for (const [tool, expectedInput] of Object.entries(scenario.requiredToolInputs ?? {})) {
  const matchingCall = calls.find(
    (call) =>
      call.tool === tool &&
      Object.entries(expectedInput).every(([key, value]) => call.input?.[key] === value)
  );
  if (!matchingCall) {
    failures.push(`${tool} never received required input ${JSON.stringify(expectedInput)}`);
  }
}

const matchedRequiredCallIndexes = new Set();
for (const requirement of scenario.requiredToolCalls ?? []) {
  const matchingIndex = calls.findIndex(
    (call, index) =>
      !matchedRequiredCallIndexes.has(index) &&
      call.tool === requirement.tool &&
      Object.entries(requirement.input ?? {}).every(([key, value]) => call.input?.[key] === value)
  );
  if (matchingIndex === -1) {
    failures.push(
      `${requirement.tool} never received required distinct input ${JSON.stringify(requirement.input ?? {})}`
    );
  } else {
    matchedRequiredCallIndexes.add(matchingIndex);
  }
}

if (failures.length) {
  console.error(`External MCP trace failed ${scenarioId}:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`External MCP trace passed ${scenarioId}: ${calledTools.length} tool calls checked.`);
