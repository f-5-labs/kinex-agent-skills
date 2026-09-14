import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPaths = [
  '.codex-plugin/plugin.json',
  '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  '.cursor-plugin/plugin.json',
];
const publishedPrefixes = [
  'skills/',
  'assets/',
  '.codex-plugin/',
  '.claude-plugin/',
  '.cursor-plugin/',
  '.agents/plugins/',
];

/** Returns the Kinex bundle version from one supported manifest shape. */
function manifestVersion(file, value) {
  if (file === '.claude-plugin/marketplace.json') {
    return value.plugins?.find((plugin) => plugin.name === 'kinex')?.version;
  }
  return value.version;
}

/** Parses the repository's required three-part semantic version. */
export function parseVersion(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/u.exec(value ?? '');
  return match ? match.slice(1).map(Number) : null;
}

/** Reports whether candidate is a strictly newer semantic version than baseline. */
export function isNewerVersion(candidate, baseline) {
  const next = parseVersion(candidate);
  const previous = parseVersion(baseline);
  if (!next || !previous) return false;
  for (let index = 0; index < next.length; index += 1) {
    if (next[index] !== previous[index]) return next[index] > previous[index];
  }
  return false;
}

/** Identifies changes that alter the installable plugin bundle. */
export function changesPublishedBundle(files) {
  return files.some(
    (file) => file === '.mcp.json' || publishedPrefixes.some((prefix) => file.startsWith(prefix))
  );
}

/** Validates synchronized manifests and a strict version increase when bundle files changed. */
export function validateVersionTransition({ baseVersions, headVersions, changedFiles }) {
  const failures = [];
  const uniqueHead = new Set(Object.values(headVersions));
  if (uniqueHead.size !== 1) failures.push('Current plugin manifest versions are not synchronized.');
  for (const [file, value] of Object.entries(headVersions)) {
    if (!parseVersion(value)) failures.push(`${file} has an invalid semantic version: ${value ?? 'missing'}.`);
  }
  if (!changesPublishedBundle(changedFiles)) return failures;

  const uniqueBase = new Set(Object.values(baseVersions));
  if (uniqueBase.size !== 1) {
    failures.push('Base plugin manifest versions are not synchronized.');
    return failures;
  }
  const [baseVersion] = uniqueBase;
  const [headVersion] = uniqueHead;
  if (!isNewerVersion(headVersion, baseVersion)) {
    failures.push(
      `Published bundle files changed, but version ${headVersion ?? 'missing'} is not newer than ${baseVersion ?? 'missing'}.`
    );
  }
  return failures;
}

/** Reads all supported plugin versions from a Git ref or the current worktree. */
function readVersions(ref) {
  return Object.fromEntries(
    manifestPaths.map((file) => {
      const source =
        ref === 'WORKTREE'
          ? readFileSync(path.join(root, file), 'utf8')
          : execFileSync('git', ['show', `${ref}:${file}`], {
              cwd: root,
              encoding: 'utf8',
            });
      return [file, manifestVersion(file, JSON.parse(source))];
    })
  );
}

/** Lists paths changed between two committed Git states. */
function changedFiles(baseRef, headRef) {
  const args =
    headRef === 'WORKTREE'
      ? ['diff', '--name-only', baseRef, '--']
      : ['diff', '--name-only', baseRef, headRef, '--'];
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [baseRef, headRef = 'HEAD'] = process.argv.slice(2);
  if (!baseRef) {
    console.error('Usage: node scripts/check-version-bump.mjs <base-ref> [head-ref|WORKTREE]');
    process.exit(2);
  }
  try {
    const changed = changedFiles(baseRef, headRef);
    const failures = validateVersionTransition({
      baseVersions: readVersions(baseRef),
      headVersions: readVersions(headRef),
      changedFiles: changed,
    });
    if (failures.length > 0) {
      console.error(`Plugin version check failed:\n- ${failures.join('\n- ')}`);
      process.exit(1);
    }
    const version = new Set(Object.values(readVersions(headRef))).values().next().value;
    console.log(
      changesPublishedBundle(changed)
        ? `Published bundle version advanced to ${version}.`
        : `No published bundle changes require a version bump; manifests remain synchronized at ${version}.`
    );
  } catch (error) {
    console.error(`Plugin version check could not run: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(2);
  }
}
