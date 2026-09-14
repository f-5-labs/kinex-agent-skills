import assert from 'node:assert/strict';
import test from 'node:test';

import {
  changesPublishedBundle,
  isNewerVersion,
  parseVersion,
  validateVersionTransition,
} from './check-version-bump.mjs';

const versions = (version) => ({
  '.codex-plugin/plugin.json': version,
  '.claude-plugin/plugin.json': version,
  '.claude-plugin/marketplace.json': version,
  '.cursor-plugin/plugin.json': version,
});

test('recognizes strict semantic versions and forward movement', () => {
  assert.deepEqual(parseVersion('0.6.1'), [0, 6, 1]);
  assert.equal(parseVersion('v0.6.1'), null);
  assert.equal(isNewerVersion('0.6.1', '0.6.0'), true);
  assert.equal(isNewerVersion('0.6.0', '0.6.0'), false);
  assert.equal(isNewerVersion('0.5.9', '0.6.0'), false);
  assert.equal(isNewerVersion('0.7.0', '0.6.9'), true);
});

test('identifies installable bundle paths without treating tests and docs as releases', () => {
  for (const file of [
    'skills/kinex-agent-workspace/SKILL.md',
    'assets/icon.svg',
    '.mcp.json',
    '.codex-plugin/plugin.json',
    '.claude-plugin/marketplace.json',
    '.cursor-plugin/plugin.json',
    '.agents/plugins/marketplace.json',
  ]) {
    assert.equal(changesPublishedBundle([file]), true, file);
  }
  assert.equal(changesPublishedBundle(['scripts/validate.mjs', 'README.md']), false);
});

test('rejects a published change with an unchanged version', () => {
  assert.deepEqual(
    validateVersionTransition({
      baseVersions: versions('0.6.0'),
      headVersions: versions('0.6.0'),
      changedFiles: ['skills/kinex-agent-workspace/SKILL.md'],
    }),
    ['Published bundle files changed, but version 0.6.0 is not newer than 0.6.0.']
  );
});

test('accepts a synchronized patch bump for published changes', () => {
  assert.deepEqual(
    validateVersionTransition({
      baseVersions: versions('0.6.0'),
      headVersions: versions('0.6.1'),
      changedFiles: ['skills/kinex-agent-workspace/SKILL.md'],
    }),
    []
  );
});

test('rejects unsynchronized or invalid current manifests', () => {
  const mismatched = versions('0.6.1');
  mismatched['.cursor-plugin/plugin.json'] = '0.6.0';
  assert.ok(
    validateVersionTransition({
      baseVersions: versions('0.6.0'),
      headVersions: mismatched,
      changedFiles: ['skills/kinex-agent-workspace/SKILL.md'],
    }).some((failure) => failure.includes('not synchronized'))
  );

  const invalid = versions('0.6.1');
  invalid['.codex-plugin/plugin.json'] = 'next';
  assert.ok(
    validateVersionTransition({
      baseVersions: versions('0.6.0'),
      headVersions: invalid,
      changedFiles: ['skills/kinex-agent-workspace/SKILL.md'],
    }).some((failure) => failure.includes('invalid semantic version'))
  );
});

test('allows non-bundle changes without a release bump', () => {
  assert.deepEqual(
    validateVersionTransition({
      baseVersions: versions('0.6.0'),
      headVersions: versions('0.6.0'),
      changedFiles: ['README.md', 'scripts/validate.mjs'],
    }),
    []
  );
});
