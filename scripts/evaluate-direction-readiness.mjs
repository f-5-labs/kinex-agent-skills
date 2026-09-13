import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blockingCodes = new Set([
  'AUDIO_EVIDENCE_MISSING',
  'AUDIO_OWNERSHIP_FALSIFIED',
  'AUDIO_ROUTE_HELD',
  'FRAME_EVIDENCE_MISSING',
  'MOTION_EVIDENCE_MISSING',
  'SIGHTLINE_IMPOSSIBLE',
  'SIGHTLINE_UNVERIFIED',
]);
const earnedSplitReasons = new Set([
  'action_phase',
  'audience_delta',
  'feasibility',
  'performance_turn',
  'point_of_view',
  'source_transition',
]);

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function pushIssue(issues, code, scope, detail) {
  issues.push({ code, severity: blockingCodes.has(code) ? 'BLOCK' : 'REVISE', scope, detail });
}

/**
 * Evaluate a structured direction package. The package records decisions rather than prompt wording,
 * so the checks do not reward a long card or the presence of a particular heading.
 */
export function evaluateDirectionReadiness(production) {
  const issues = [];
  const shots = production.shots ?? [];
  const stage = production.targetStage ?? 'DIRECTION_READY';

  if (!production.evidence?.creativeReviewCompleted) {
    pushIssue(
      issues,
      'CREATIVE_REVIEW_MISSING',
      'production',
      'Saved fields are not a direction review.'
    );
  }

  if (
    !hasText(production.scene?.uncertaintyHolder) ||
    !hasText(production.scene?.audienceBefore) ||
    !hasText(production.scene?.audienceAfter)
  ) {
    pushIssue(
      issues,
      'AUDIENCE_INTENT_MISSING',
      'scene',
      'Name whose uncertainty matters and what the audience learns.'
    );
  }

  const requestedRatio = production.format?.requestedRatio;
  if (!hasText(requestedRatio) || requestedRatio !== production.format?.structuredRatio) {
    pushIssue(
      issues,
      'FORMAT_UNSYNCED',
      'production',
      'The requested ratio and executable structured ratio differ.'
    );
  }
  if (!hasText(production.format?.compositionPlan)) {
    pushIssue(
      issues,
      'COMPOSITION_PLAN_MISSING',
      'production',
      'Compose for the delivery frame before relying on a crop.'
    );
  }
  if (!production.format?.nativeCameraFieldsSynchronized) {
    pushIssue(
      issues,
      'CAMERA_FIELDS_UNSYNCED',
      'production',
      'Camera decisions remain only in planning prose rather than supported shot fields.'
    );
  }
  if (!production.visualSystem?.motivatedLight) {
    pushIssue(
      issues,
      'LIGHTING_UNMOTIVATED',
      'production',
      'A camera or stock description does not establish the light source and direction.'
    );
  }
  if (!hasText(production.visualSystem?.colorArc)) {
    pushIssue(
      issues,
      'COLOR_PROGRESSION_MISSING',
      'production',
      'The scene has no source-motivated colour progression.'
    );
  }
  if (!hasText(production.visualSystem?.colorProfile)) {
    pushIssue(
      issues,
      'COLOR_PROFILE_MISSING',
      'production',
      'The intended display or delivery profile is unresolved.'
    );
  }

  if (stage === 'FRAME_PASS' || stage === 'MOTION_PASS') {
    if (!production.evidence?.frameReviewCompleted || !production.format?.actualDimensionsVerified) {
      pushIssue(
        issues,
        'FRAME_EVIDENCE_MISSING',
        'production',
        'A frame pass requires an inspected frame and verified actual dimensions.'
      );
    }
  }
  if (stage === 'MOTION_PASS') {
    if (!production.evidence?.motionObserved) {
      pushIssue(
        issues,
        'MOTION_EVIDENCE_MISSING',
        'production',
        'A motion pass requires watching the generated action, performance, camera, and joins.'
      );
    }
    const hasAudio = shots.some((shot) => shot.audio?.kind !== 'none');
    if (hasAudio && !production.evidence?.audioReviewed) {
      pushIssue(
        issues,
        'AUDIO_EVIDENCE_MISSING',
        'production',
        'Audible material must be heard before it can pass.'
      );
    }
  }

  let unverifiedTiming = 0;
  let heldAudioRoutes = 0;
  let repeatedFrontalPairs = 0;

  for (const shot of shots) {
    const scope = shot.id ?? 'unnamed-shot';
    if (
      !hasText(shot.purpose) ||
      !hasText(shot.audience?.before) ||
      !hasText(shot.audience?.after)
    ) {
      pushIssue(
        issues,
        'SHOT_INFORMATION_CHANGE_MISSING',
        scope,
        'The shot does not state the audience information it changes.'
      );
    }

    const direction = shot.direction ?? {};
    for (const [field, code] of [
      ['objective', 'OBJECTIVE_MISSING'],
      ['tactic', 'TACTIC_MISSING'],
      ['trigger', 'TRIGGER_MISSING'],
      ['listening', 'LISTENING_MISSING'],
      ['response', 'RESPONSE_MISSING'],
      ['exitState', 'EXIT_STATE_MISSING'],
    ]) {
      if (!hasText(direction[field])) {
        pushIssue(issues, code, scope, `Direction is missing ${field}.`);
      }
    }

    const business = direction.physicalBusiness ?? { kind: 'none' };
    if (
      business.kind !== 'none' &&
      (!hasText(business.trigger) || business.causalRole === 'decorative')
    ) {
      pushIssue(
        issues,
        'PHYSICAL_BUSINESS_DECORATIVE',
        scope,
        'The gesture or task has no trigger and causal consequence.'
      );
    }
    if (hasText(business.object)) {
      const propPath = business.propPath ?? {};
      if (
        !hasText(propPath.startOwner) ||
        !hasText(propPath.path) ||
        !hasText(propPath.contact) ||
        !hasText(propPath.release) ||
        !hasText(propPath.endOwner)
      ) {
        pushIssue(
          issues,
          'PROP_PATH_INCOMPLETE',
          scope,
          `The ${business.object} custody path is incomplete.`
        );
      }
    }

    const sightlineStatus = shot.blocking?.sightlineStatus;
    if (sightlineStatus === 'impossible') {
      pushIssue(
        issues,
        'SIGHTLINE_IMPOSSIBLE',
        scope,
        'The required view cannot exist from the established floor map.'
      );
    } else if (sightlineStatus !== 'verified') {
      pushIssue(
        issues,
        'SIGHTLINE_UNVERIFIED',
        scope,
        'The required sightline has not been verified against the floor map.'
      );
    }

    const camera = shot.camera ?? {};
    if (!hasText(camera.plan) && (camera.prohibitions?.length ?? 0) > 0) {
      pushIssue(
        issues,
        'CAMERA_NEGATIVE_ONLY',
        scope,
        'Negative instructions do not define a usable camera position or behavior.'
      );
    }
    if (!hasText(camera.motivation) || !(camera.reads?.length > 0)) {
      pushIssue(
        issues,
        'CAMERA_PURPOSE_MISSING',
        scope,
        'The camera does not name the decisive information it makes legible.'
      );
    }

    if (!hasText(shot.edit?.cutMotivation)) {
      pushIssue(
        issues,
        'CUT_UNMOTIVATED',
        scope,
        'The cut has no causal, performance, information, or source motivation.'
      );
    }

    const timing = shot.timing ?? {};
    if ((timing.holdAfterActionSeconds ?? 0) > 1.5 && !hasText(timing.holdMotivation)) {
      pushIssue(
        issues,
        'ARBITRARY_HOLD',
        scope,
        'The finished action is held only to fill duration.'
      );
    }
    if (shot.audio?.kind === 'dialogue') {
      if (!Number.isFinite(timing.naturalReadSeconds)) {
        unverifiedTiming += 1;
        pushIssue(
          issues,
          'NATURAL_TIMING_UNVERIFIED',
          scope,
          'Dialogue duration has not been established by a natural read-through.'
        );
      } else if (timing.naturalReadSeconds > timing.targetSeconds) {
        pushIssue(
          issues,
          'DIALOGUE_TIMING_UNFIT',
          scope,
          'Natural speech cannot fit without rushing or dropping words.'
        );
      }
    }

    const audio = shot.audio ?? {};
    if (
      (audio.speakers?.length ?? 0) > 1 &&
      hasText(audio.assignedSpeaker) &&
      !audio.separateVoices
    ) {
      pushIssue(
        issues,
        'AUDIO_OWNERSHIP_FALSIFIED',
        scope,
        'Multiple speakers were assigned to one convenient voice.'
      );
    }
    if (audio.routeStatus === 'held') {
      heldAudioRoutes += 1;
      pushIssue(
        issues,
        'AUDIO_ROUTE_HELD',
        scope,
        'The audio route is unresolved and must remain held.'
      );
    }
  }

  for (let index = 1; index < shots.length; index += 1) {
    const previous = shots[index - 1];
    const current = shots[index];
    if (
      previous.camera?.setup === 'frontal_two_shot' &&
      current.camera?.setup === 'frontal_two_shot' &&
      (!hasText(previous.camera?.progressionReason) ||
        !hasText(current.camera?.progressionReason))
    ) {
      repeatedFrontalPairs += 1;
      pushIssue(
        issues,
        'CAMERA_REPETITION_UNEARNED',
        `${previous.id} → ${current.id}`,
        'Consecutive frontal two-shots repeat without a dramatic reason.'
      );
    }
  }

  const shotsBySource = new Map();
  for (const shot of shots) {
    const sourceUnit = shot.sourceUnit ?? shot.id;
    const group = shotsBySource.get(sourceUnit) ?? [];
    group.push(shot);
    shotsBySource.set(sourceUnit, group);
  }
  for (const [sourceUnit, group] of shotsBySource) {
    for (const shot of group.slice(1)) {
      if (!earnedSplitReasons.has(shot.splitReason)) {
        pushIssue(
          issues,
          'FRAGMENTATION_UNEARNED',
          shot.id,
          `${sourceUnit} was split for ${shot.splitReason ?? 'no stated reason'}.`
        );
      }
    }
  }

  const codes = [...new Set(issues.map((issue) => issue.code))].sort();
  const verdict = issues.some((issue) => issue.severity === 'BLOCK')
    ? 'BLOCK'
    : issues.length > 0
      ? 'REVISE'
      : 'PASS';

  return {
    verdict,
    codes,
    issues,
    metrics: {
      sourceUnitCount: production.sourceUnitCount ?? null,
      shotCount: shots.length,
      coverageDelta:
        Number.isFinite(production.sourceUnitCount) && production.sourceUnitCount > 0
          ? shots.length - production.sourceUnitCount
          : null,
      repeatedFrontalPairs,
      heldAudioRoutes,
      unverifiedTiming,
      savedFieldReadback: Boolean(production.evidence?.savedFieldReadback),
    },
  };
}

function setPath(target, dottedPath, value) {
  const segments = dottedPath.split('.');
  let cursor = target;
  for (const segment of segments.slice(0, -1)) {
    cursor = cursor[Number.isInteger(Number(segment)) ? Number(segment) : segment];
  }
  const finalSegment = segments.at(-1);
  cursor[Number.isInteger(Number(finalSegment)) ? Number(finalSegment) : finalSegment] = value;
}

/** Run the anonymized fail/pass fixtures and compare exact verdicts and defect codes. */
export async function validateDirectionFixtures(fixturePath) {
  const source = JSON.parse(await readFile(fixturePath, 'utf8'));
  const failures = [];
  const results = [];

  if (source.version !== 1) failures.push('direction fixtures: version must be 1.');
  if (!source.baseline || !(source.cases?.length > 0)) {
    failures.push('direction fixtures: baseline and cases are required.');
    return { failures, results, caseCount: source.cases?.length ?? 0 };
  }
  const caseIds = source.cases.map((fixture) => fixture.id);
  if (new Set(caseIds).size !== caseIds.length) {
    failures.push('direction fixtures: case ids must be unique.');
  }

  for (const fixture of source.cases ?? []) {
    const production = JSON.parse(JSON.stringify(source.baseline));
    for (const mutation of fixture.mutations ?? []) {
      setPath(production, mutation.path, mutation.value);
    }
    const actual = evaluateDirectionReadiness(production);
    const expectedCodes = [...(fixture.expected?.codes ?? [])].sort();
    if (actual.verdict !== fixture.expected?.verdict) {
      failures.push(
        `${fixture.id}: expected ${fixture.expected?.verdict}, received ${actual.verdict}.`
      );
    }
    if (JSON.stringify(actual.codes) !== JSON.stringify(expectedCodes)) {
      failures.push(
        `${fixture.id}: expected codes ${JSON.stringify(expectedCodes)}, received ${JSON.stringify(actual.codes)}.`
      );
    }
    results.push({ id: fixture.id, verdict: actual.verdict, codes: actual.codes });
  }

  return { failures, results, caseCount: source.cases?.length ?? 0 };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const fixturePath = path.resolve(
    process.cwd(),
    process.argv[2] ?? path.join(root, 'evals', 'fixtures', 'direction-readiness-cases.json')
  );
  const result = await validateDirectionFixtures(fixturePath);
  if (result.failures.length > 0) {
    console.error(`Direction readiness fixtures failed:\n- ${result.failures.join('\n- ')}`);
    process.exit(1);
  }
  for (const fixture of result.results) {
    console.log(
      `${fixture.id}: ${fixture.verdict}${fixture.codes.length ? ` (${fixture.codes.join(', ')})` : ''}`
    );
  }
  console.log(`Direction readiness fixtures passed: ${result.caseCount} cases.`);
}
