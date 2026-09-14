import { readFile } from 'node:fs/promises';

/** Loads shared routing scenarios plus focused composition and Flow Builder handoffs. */
export async function loadScenarios() {
  const files = [
    'scenarios.json',
    'shot-composition-scenarios.json',
    'flow-builder-scenarios.json',
  ];
  const suites = await Promise.all(files.map(async (file) => JSON.parse(
    await readFile(new URL(`../evals/${file}`, import.meta.url), 'utf8'),
  )));
  for (const suite of suites) {
    if (suite.version !== 1 || !Array.isArray(suite.scenarios)) {
      throw new Error('Scenario suites require version 1 and a scenarios array.');
    }
  }
  return { version: 1, scenarios: suites.flatMap((suite) => suite.scenarios) };
}
