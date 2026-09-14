import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadScenarios } from './load-scenarios.mjs';
import { validateDirectionFixtures } from './evaluate-direction-readiness.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedSkills = [
  'kinex-agent-workspace',
  'kinex-audio-prompting',
  'kinex-hailuo-h3',
  'kinex-image-prompting',
  'kinex-media-library',
  'kinex-review-and-export',
  'kinex-seedance-2-5',
];
const failures = [];
let directionCaseCount = 0;

/** Reads a required JSON file from the repository root. */
async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

/** Records a validation failure while allowing the remaining checks to run. */
function check(condition, message) {
  if (!condition) failures.push(message);
}

/** Reads a scalar field from a skill's YAML frontmatter. */
function frontmatterValue(source, key) {
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? '';
  return frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'mu'))?.[1]?.trim() ?? '';
}

/** Validates manifests, skill structure, MCP wiring, brand assets, and eval coverage. */
async function validate() {
  const codex = await readJson('.codex-plugin/plugin.json');
  const claude = await readJson('.claude-plugin/plugin.json');
  const claudeMarketplace = await readJson('.claude-plugin/marketplace.json');
  const cursor = await readJson('.cursor-plugin/plugin.json');
  const mcp = await readJson('.mcp.json');
  const marketplace = await readJson('.agents/plugins/marketplace.json');
  const scenarios = await loadScenarios();

  check(codex.name === 'kinex', 'Codex manifest must use plugin name kinex.');
  check(codex.version === claude.version, 'Codex and Claude versions must match.');
  const claudeBundle = claudeMarketplace.plugins?.find((plugin) => plugin.name === 'kinex');
  check(
    claudeBundle?.version === codex.version,
    'Claude marketplace and Codex versions must match.'
  );
  check(codex.version === cursor.version, 'Codex and Cursor versions must match.');
  check(codex.skills === './skills/', 'Codex manifest must discover the skills directory.');
  check(codex.mcpServers === './.mcp.json', 'Codex manifest must expose the MCP config.');
  check(
    mcp.mcpServers?.kinex?.url === 'https://api.kinex.studio/mcp',
    'MCP config must target the Kinex production endpoint.'
  );
  check(
    marketplace.plugins?.some((plugin) => plugin.name === 'kinex'),
    'Codex marketplace must list the Kinex plugin.'
  );
  check(
    codex.repository === 'https://github.com/f-5-labs/kinex-agent-skills',
    'Plugin repository must point to the public bundle.'
  );

  for (const asset of ['assets/icon.svg', 'assets/logo.svg']) await access(path.join(root, asset));

  const skillEntries = await readdir(path.join(root, 'skills'), {
    withFileTypes: true,
  });
  const skills = skillEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  check(JSON.stringify(skills) === JSON.stringify(expectedSkills), 'Unexpected focused skill set.');
  const marketplaceSkills = (claudeBundle?.skills ?? [])
    .map((skill) => skill.path?.replace(/^skills\//u, ''))
    .sort();
  check(
    JSON.stringify(marketplaceSkills) === JSON.stringify(expectedSkills),
    'Claude marketplace skills must match the focused skill set.'
  );

  const skillSources = new Map();
  for (const skill of expectedSkills) {
    const base = path.join(root, 'skills', skill);
    const source = await readFile(path.join(base, 'SKILL.md'), 'utf8');
    skillSources.set(skill, source);
    const openai = await readFile(path.join(base, 'agents', 'openai.yaml'), 'utf8');
    check(frontmatterValue(source, 'name') === skill, `${skill}: frontmatter name mismatch.`);
    check(frontmatterValue(source, 'description').length >= 80, `${skill}: trigger is too vague.`);
    check(!/\bTODO\b|\[TODO/u.test(source), `${skill}: unresolved template marker.`);
    check(source.includes('references/tool-map.md'), `${skill}: tool map link is missing.`);
    check(openai.includes(`$${skill}`), `${skill}: default prompt must invoke the skill.`);
    check(/type:\s*['"]?mcp['"]?/u.test(openai), `${skill}: MCP dependency is missing.`);
    check(openai.includes('https://api.kinex.studio/mcp'), `${skill}: MCP URL is missing.`);
    await access(path.join(base, 'references', 'tool-map.md'));
  }

  const agentWorkspaceSource = skillSources.get('kinex-agent-workspace') ?? '';
  check(
    agentWorkspaceSource.includes('references/entity-and-location-method.md'),
    'kinex-agent-workspace: character and location method link is missing.'
  );
  check(
    agentWorkspaceSource.includes('references/scene-production-method.md'),
    'kinex-agent-workspace: scene production method link is missing.'
  );
  check(
    agentWorkspaceSource.includes('references/direction-readiness.md'),
    'kinex-agent-workspace: direction readiness link is missing.'
  );
  const entityLocationMethod = await readFile(
    path.join(
      root,
      'skills',
      'kinex-agent-workspace',
      'references',
      'entity-and-location-method.md'
    ),
    'utf8'
  );
  for (const requiredPhrase of [
    'Single hero',
    'Quick character lock',
    'Character master sheet',
    'Wardrobe or garment lock',
    'Location reference sheet',
    'Plan the floor map before defining a location',
    'action paths',
    'working 180-degree axis',
    'PASS:',
    'BLOCKED:',
  ]) {
    check(
      entityLocationMethod.includes(requiredPhrase),
      `kinex-agent-workspace: character/location method is missing ${requiredPhrase}.`
    );
  }

  const directionReadinessMethod = await readFile(
    path.join(root, 'skills', 'kinex-agent-workspace', 'references', 'direction-readiness.md'),
    'utf8'
  );
  for (const requiredPhrase of [
    'Receive an incoming production',
    'whose uncertainty matters',
    'starting owner/state',
    'Repeated frontal two-shots',
    'Shot count is a consequence',
    'native camera fields',
    'colour profile',
    'successful field readback is not visual or motion evidence',
  ]) {
    check(
      directionReadinessMethod.toLowerCase().includes(requiredPhrase.toLowerCase()),
      `kinex-agent-workspace: direction readiness is missing ${requiredPhrase}.`
    );
  }

  const reviewSource = skillSources.get('kinex-review-and-export') ?? '';
  check(
    reviewSource.includes('references/direction-review.md'),
    'kinex-review-and-export: direction review link is missing.'
  );
  const directionReviewMethod = await readFile(
    path.join(root, 'skills', 'kinex-review-and-export', 'references', 'direction-review.md'),
    'utf8'
  );
  for (const requiredPhrase of [
    'Persistence',
    'Direction',
    'Frame',
    'Motion',
    'Sound',
    'Audit coverage and route debt',
  ]) {
    check(
      directionReviewMethod.includes(requiredPhrase),
      `kinex-review-and-export: direction review is missing ${requiredPhrase}.`
    );
  }

  const sceneProductionMethod = await readFile(
    path.join(root, 'skills', 'kinex-agent-workspace', 'references', 'scene-production-method.md'),
    'utf8'
  );
  for (const requiredPhrase of [
    'Direction-readiness gate',
    'Identity and asset lane',
    'Direction lane',
    'Camera lane',
    'Edit lane',
    'asset passport',
    'scene-to-assets matrix',
    'take and prompt ledger',
    'Finish within the real surface',
  ]) {
    check(
      sceneProductionMethod.toLowerCase().includes(requiredPhrase.toLowerCase()),
      `kinex-agent-workspace: scene production method is missing ${requiredPhrase}.`
    );
  }

  check(scenarios.version === 1, 'Eval fixture version must be 1.');
  check(scenarios.scenarios?.length >= 30, 'At least thirty routing scenarios are required.');
  const covered = new Set(scenarios.scenarios?.map((scenario) => scenario.skill));
  for (const skill of expectedSkills) check(covered.has(skill), `${skill}: no eval coverage.`);

  const scenarioIds = scenarios.scenarios?.map((scenario) => scenario.id) ?? [];
  check(new Set(scenarioIds).size === scenarioIds.length, 'Eval scenario ids must be unique.');
  for (const scenario of scenarios.scenarios ?? []) {
    check(expectedSkills.includes(scenario.skill), `${scenario.id}: unknown skill.`);
    check(Boolean(scenario.request?.trim()), `${scenario.id}: request is required.`);
    check(scenario.expectedTools?.length > 0, `${scenario.id}: expectedTools must not be empty.`);
    check(scenario.checks?.length > 0, `${scenario.id}: observable checks must not be empty.`);
    check(
      (scenario.orderedTools ?? []).every((tool) => scenario.expectedTools?.includes(tool)),
      `${scenario.id}: orderedTools must also be expectedTools.`
    );
    check(
      Object.keys(scenario.requiredToolInputs ?? {}).every((tool) =>
        scenario.expectedTools?.includes(tool)
      ),
      `${scenario.id}: requiredToolInputs must target expectedTools.`
    );
    check(
      (scenario.requiredToolCalls ?? []).every((call) =>
        scenario.expectedTools?.includes(call.tool)
      ),
      `${scenario.id}: requiredToolCalls must target expectedTools.`
    );
    const forbidden = new Set(scenario.forbiddenTools ?? []);
    check(
      !(scenario.expectedTools ?? []).some((tool) => forbidden.has(tool)),
      `${scenario.id}: a tool cannot be both expected and forbidden.`
    );
  }

  const directionFixtureResult = await validateDirectionFixtures(
    path.join(root, 'evals', 'fixtures', 'direction-readiness-cases.json')
  );
  directionCaseCount = directionFixtureResult.caseCount;
  failures.push(...directionFixtureResult.failures);
  for (const requiredCase of [
    'pass-motivated-coverage',
    'fail-audience-and-playable-intent',
    'fail-repeated-frontal-two-shots',
    'fail-inert-prop-gesture',
    'fail-negative-camera-and-eight-second-hold',
    'block-impossible-elevated-sightline',
    'block-falsified-speaker-ownership',
    'block-held-dialogue-route',
    'block-readback-claimed-as-motion-pass',
    'fail-unsynced-format-and-generic-colour',
    'fail-natural-spoken-timing',
  ]) {
    check(
      directionFixtureResult.results.some((result) => result.id === requiredCase),
      `direction fixtures: required case is missing ${requiredCase}.`
    );
  }
}

await validate();

if (failures.length) {
  console.error(`Kinex bundle validation failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

const scenarios = await loadScenarios();
console.log(
  `Kinex bundle validation passed: ${expectedSkills.length} skills, ${scenarios.scenarios.length} scenarios, and ${directionCaseCount} direction cases.`
);
