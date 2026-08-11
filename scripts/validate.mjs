import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedSkills = [
  'kinex-agent-workspace',
  'kinex-create-video',
  'kinex-media-library',
  'kinex-review-and-export',
  'kinex-script-and-story',
  'kinex-seedance-2-5',
];
const failures = [];

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
  const scenarios = await readJson('evals/scenarios.json');

  check(codex.name === 'kinex', 'Codex manifest must use plugin name kinex.');
  check(codex.version === claude.version, 'Codex and Claude versions must match.');
  const claudeBundle = claudeMarketplace.plugins?.find((plugin) => plugin.name === 'kinex');
  check(claudeBundle?.version === codex.version, 'Claude marketplace and Codex versions must match.');
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

  const skillEntries = await readdir(path.join(root, 'skills'), { withFileTypes: true });
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

  for (const skill of expectedSkills) {
    const base = path.join(root, 'skills', skill);
    const source = await readFile(path.join(base, 'SKILL.md'), 'utf8');
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

  check(scenarios.version === 1, 'Eval fixture version must be 1.');
  check(scenarios.scenarios?.length >= 21, 'At least twenty-one routing scenarios are required.');
  const covered = new Set(scenarios.scenarios?.map((scenario) => scenario.skill));
  for (const skill of expectedSkills) check(covered.has(skill), `${skill}: no eval coverage.`);

  const scenarioIds = scenarios.scenarios?.map((scenario) => scenario.id) ?? [];
  check(new Set(scenarioIds).size === scenarioIds.length, 'Eval scenario ids must be unique.');
  for (const scenario of scenarios.scenarios ?? []) {
    check(expectedSkills.includes(scenario.skill), `${scenario.id}: unknown skill.`);
    check(Boolean(scenario.request?.trim()), `${scenario.id}: request is required.`);
    check(scenario.expectedTools?.length > 0, `${scenario.id}: expectedTools must not be empty.`);
    check(scenario.checks?.length > 0, `${scenario.id}: observable checks must not be empty.`);
    const forbidden = new Set(scenario.forbiddenTools ?? []);
    check(
      !(scenario.expectedTools ?? []).some((tool) => forbidden.has(tool)),
      `${scenario.id}: a tool cannot be both expected and forbidden.`
    );
  }
}

await validate();

if (failures.length) {
  console.error(`Kinex bundle validation failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

const scenarios = await readJson('evals/scenarios.json');
console.log(
  `Kinex bundle validation passed: ${expectedSkills.length} skills and ${scenarios.scenarios.length} scenarios.`
);
