---
name: kinex-seedance-2-5
description: Direct Atlas-backed Seedance video generation in Kinex, defaulting to full-quality Seedance 2.0 with explicit image, motion, and audio reference roles and source-frame continuity. Use for “make this with Seedance,” “use Seedance 2.0,” “make a Seedance 2.5 clip,” or “use these visual, motion, and audio references together.” Not for model billing, provider configuration, or Dreamina-only editing and extension features.
---

# Direct Seedance in Kinex

Use this skill to turn a requested creative direction and a small, intentional set of source materials into one controlled Seedance operation. Default an unqualified “Seedance” request to full-quality Seedance 2.0. Seedance 2.5 is opt-in: select it only when the user explicitly asks for 2.5 or when a requirement that 2.0 cannot satisfy has been explained and accepted. The skill improves the creative instruction; it does not bypass Kinex task polling or review. If they asked to generate, generate.

## Confirm the live operation first

1. Confirm the Seedance operation from the current model notes in this skill before selecting it. Use only the model, operation, and fields the live Kinex contract returns.
2. For an unqualified Seedance request, prefer the full `Seedance 2.0` / Standard SKU. Do not silently substitute 2.0 Fast, Mini, or 2.5 because they are separate creative and cost choices.
3. Select Seedance 2.5 only for an explicit 2.5 request or an accepted requirement such as a coherent clip beyond Seedance 2.0's live duration ceiling. State the reason in the Production Plan.
4. If the selected Atlas-backed operation is unavailable, say so and choose a supported alternative with the user; do not invent a direct ByteDance, Dreamina, or browser workflow.
5. Keep price, resolution, duration, audio, and aspect ratio as structured operation inputs. The Atlas integrations may expose text, image/frame, and full-modal-reference operations; select the operation that the returned schema actually supports.

Read duration, resolution, native audio, reference counts, and aspect-ratio choices from the live registry / current model notes. Do not hardcode remembered ceilings such as “2.0 = 15s” or “2.5 = 30s”. A longer advertised ceiling is not evidence of better creative quality.

Do not promise Dreamina-only video editing, extension, ultra-long generation, or a setting that the live Kinex operation does not expose. Seedance frame operations are source-ratio driven when the returned field says Adaptive; do not offer a fixed ratio in that case.

## Build a reference cast, not a pile of uploads

Inspect the supplied assets and activate only material needed for the present scene. Assign one explicit job to every activated material and name a reusable token:

```text
@Image1 = Amina's face, braids, and amber jacket — call it "Amina". Do not use its cafe background.
@Image2 = the bottle's square silhouette and frosted blue glass — call it "the bottle". Do not use the hand holding it.
@Video1 = motion / camera only — the slow orbit and the moment the bottle turns toward camera. Do not transfer its performer or set.
@Audio1 = Amina's exact spoken line and close-mic voice; retain the city ambience under her voice.
```

Map people, products, props, and locations separately. Do not use upload order, contact-sheet labels, or a broad range such as “images 1–4 define the cast” as a substitute for roles. Leave unused materials inactive and say so. Reuse the token everywhere after the role line; never re-describe the look the image already carries.

## Compile the shot from this spine

Seedance 2 reasons before it generates. Hand it a clear problem and a short, unambiguous prompt. Say each thing once.

- **No negative prompts.** Phrase the desired state: “edges stay stable”, “identity holds”, “label stays legible”. “No warping” and “don’t change the face” spend words without helping.
- **Time ranges describe pacing.** State a cut explicitly when intended; do not treat each action timestamp as an automatic camera change. A continuous shot can contain multiple timed triggers and responses.
- **One coherent camera plan per shot.** Prefer a simple path the shot can sustain; complexity must serve the action. If unsure, use `locked-off`.
- **One continuous shot** unless a cut is intentional. Say it: “one continuous shot, no cuts, no zoom”. Without that line Seedance often cuts between angles.
- **Slow motion:** describe the desired temporal effect and use advertised speed/frame controls when available. Capture/playback numbers in prose express intent, not verified recording metadata.
- **Preserve:** collect the shot's must-hold outcomes once, then verify them in the actual take.

```text
@Image1 = <role> — call it "<token>"
@Video1 = motion / camera only
@Audio1 = timing / beat / lip-sync
(one line per reference, one job each; skip unused)

Format: <duration, aspect ratio, resolution from the live operation>
Style: <look + grade>            (omit if a reference already sets it)
GEO: <stable layout, subject positions, eyelines, axis, screen direction>
First frame: <exact frame-zero blocking and readable action state>

Shot 1 (0–Xs): <size> — <one numbered action + one ambient drift> — <one camera rig>
(Use only the action beats the source requires; label intentional cuts explicitly.)

Performance: <observable behavior, physical business, gaze, breath, pause, reaction>
Physics: <contact, weight, cloth/hair/water response, secondary motion>
Audio: <diegetic sound, quoted dialogue, ambience>
Preserve: <identity / product / style / composition>, stays as-is
— <duration>, <ratio>
```

Sizes: `EWS WS MWS MS MCU CU ECU`. Rigs: `gimbal-smooth` / `handheld micro-wobble` / `locked-off`. Ratios: use the live operation's choices, commonly `9:16` `1:1` `16:9`.

When the beat has story, named characters, or spoken lines, swap the one-liner `Shot` rows for a shot block. Everything else stays.

```text
BEAT N — LABEL.  <one-line stage direction>
[MM:SS – MM:SS] <CODE>. <who + @ref + token>, <action, CAPS the verb that must read>. "<dialogue>"
Audio: <score or room>. <who> — <delivery>.
```

Keep quoted dialogue exact and short. Re-anchor the token each beat: `Amina (@Image1)`, not bare `@Image1`.

## Words it loves and hates

Prefer concrete camera, pacing, light, and material words over adjectives.

**Camera (choose a coherent plan):** `dolly in/out` · `push-in` · `pan left/right` · `tilt up/down` · `tracking / follow` · `orbit / arc` · `crane rise/descend` · `drone-style forward glide` · `rack focus` · `zoom` (sparingly).

**Pacing:** `slow` · `smooth` · `stable` · `gentle` · `slowly` · `quickly` · `violently` · `with large amplitude`. Demand “fast” and you often lose coherence.

**Cuts, if intentional:** `camera switch` · `cut to` · `camera cut to` · `dissolve` · `match cut` · `fade to black`.

**Light and color:** name the source and two or three hues — `golden hour`, `tungsten`, `neon`, `natural window light`, `warm orange and teal`. Never “colorful”.

**Audio:** dialogue in `"double quotes"` (the lip-sync signal) · SFX as acoustic descriptors · `score bed` · `ambient room tone`.

**Style anchors:** one strong reference beats ten adjectives. Name a film stock (`35mm, Kodak palette`), a director (`Wes Anderson symmetry`, `Wong Kar-wai`), a sensor (`ARRI ALEXA aesthetic`), or a brand (`Apple keynote style`). A single concrete anchor gives the model a target to hit; piling on adjectives gives it nothing to aim at.

**Avoid:** `beautiful` / `amazing` / `epic` / bare `cinematic` · `dynamic` · `fast` as the only motion word · `slow motion` · stacked camera moves · traditional negative prompts.

## Direct a whole beat deliberately

When a requested beat is at most the selected operation's advertised duration, represent it as one shot record and one Seedance clip only when it is one coherent dramatic event. That clip may contain motivated internal camera cuts described by a sequence sheet and prompt; do not create records per panel, angle, micro-action, or reaction. A capability maximum is not a creative recommendation. Prefer Seedance 2.0 for this route unless the user has opted into 2.5. Use a natural 10–15-second window when the live operation supports it and the event needs it, but do not pad a short exchange, rush exact dialogue, or compress an unrelated long proof into a nominal 30–45-second clip. Write consecutive stages, not unrelated scenes:

1. Give each stage one main state change and a concrete end state.
2. At each transition, state what carries forward from the previous stage.
3. Use exact time ranges only for a genuinely critical entrance, handoff, exit, transition, or user-requested beat.
4. If the runtime exceeds the live maximum, the beat contains unrelated coverage, or continuity cannot survive the requested action, split at a clear end state and retain the existing per-shot route.

A sequence sheet may guide these stages as a typed reference, but the full grid is never `startFrame`, `openingFrame`, or literal frame zero. When the selected operation needs a frame input, use a clean single-frame asset and keep the sheet in its advertised sequence/reference role.

For a start-frame or start-and-end-frame operation, bind only the required source frames and preserve their visual continuity. If the operation reports an Adaptive-only ratio, the source image governs composition. Use the full-modal reference operation when the scene genuinely needs image, motion, and audio materials together.

## Preflight, then generate

Read the current shot with `shot_get` and apply [shared shot composition](../kinex-agent-workspace/references/shot-composition.md) before compiling the provider prompt. Repair known direction or audio contradictions within scope, then run this preflight and execute authorized generation. If the user explicitly requests a test with open creative issues, record those issues and keep the verdict unverified; do not turn preflight into another approval loop.

1. Each activated reference has one job and a token.
2. GEO, first frame, and screen direction are stated.
3. One coherent camera plan, including locked-off; one continuous shot unless a cut is intentional.
4. Performance is observable; quoted dialogue is exact.
5. Physics and one motivated light source are concrete.
6. Constraints are positive. Preserve is present.
7. Duration, ratio, resolution, audio, and reference counts match the live operation.

If they asked to generate, do not stop the turn after the checklist.

## Execute only through the approved Kinex path

For an Agent Workspace project, read the Production Plan, Project Bible, current `shot_get` card, and assigned variants. Reconcile authored `imagePrompt/videoPrompt` after card changes, verify the chosen nested `audio` route, and retain the actual compiled prompt and operation inputs. A current-turn generate request approves the current plan; save it with `approvalConfirmed: true` when that write is still needed, then use `workspace_execute_command` with the discovered operation and a fresh clip prompt. Keep model selection, reference-role reasoning, and any duration split in the Production Plan when it affects coverage.

Poll `task_get`, re-read the affected beat or shot, and review the actual output before calling it complete. Repair a failed control at its source—role mapping, Preserve, camera move, end state, frame selection, or structured operation input—rather than adding generic prompt bulk. Never fabricate a completed clip.

Read [tool map](references/tool-map.md) for operation discovery, routing, and review boundaries.

For a standalone installation without the sibling reference, read the [published shot composition contract](https://github.com/f-5-labs/kinex-agent-skills/blob/main/skills/kinex-agent-workspace/references/shot-composition.md) and refresh the live tool schema before project writes. If neither is available, keep the proposed patch local and report the gap; prompt-only work can continue.
