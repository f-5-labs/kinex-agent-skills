---
name: kinex-seedance-2-5
description: Direct Atlas-backed Seedance video generation in Kinex, defaulting to full-quality Seedance 2.0 with explicit image, motion, and audio reference roles and source-frame continuity. Use for “make this with Seedance,” “use Seedance 2.0,” “make a Seedance 2.5 clip,” or “use these visual, motion, and audio references together.” Not for model billing, provider configuration, or Dreamina-only editing and extension features.
---

# Direct Seedance in Kinex

Use this skill to turn an approved creative direction and a small, intentional set of source materials into one controlled Seedance operation. Default an unqualified “Seedance” request to full-quality Seedance 2.0. Seedance 2.5 is opt-in: select it only when the user explicitly asks for 2.5 or when a requirement that 2.0 cannot satisfy has been explained and accepted. The skill improves the creative instruction; it does not bypass Kinex approval, task polling, or review.

## Confirm the live operation first

1. Call `generation_list_supported_media_models` before selecting a Seedance operation. Use only the model, operation, and fields the live Kinex registry returns.
2. For an unqualified Seedance request, prefer the full `Seedance 2.0` / Standard SKU. Do not silently substitute 2.0 Fast, Mini, or 2.5 because they are separate creative and cost choices.
3. Select Seedance 2.5 only for an explicit 2.5 request or an accepted requirement such as a coherent clip beyond Seedance 2.0's live duration ceiling. State the reason in the Production Plan.
4. If the selected Atlas-backed operation is unavailable, say so and choose a supported alternative with the user; do not invent a direct ByteDance, Dreamina, or browser workflow.
5. Keep price, resolution, duration, audio, and aspect ratio as structured operation inputs. The Atlas integrations may expose text, image/frame, and full-modal-reference operations; select the operation that the returned schema actually supports.

For the currently verified Kinex catalog, Seedance 2.0 supports clips up to 15 seconds while Seedance 2.5 can advertise up to 30 seconds. Reference counts, resolution, native audio, and mode availability differ by SKU and operation. Re-check the live limits before submitting: the registry is authoritative, and a longer ceiling is not evidence of better creative quality.

Do not promise Dreamina-only video editing, extension, ultra-long generation, or a setting that the live Kinex operation does not expose. Seedance frame operations are source-ratio driven when the returned field says Adaptive; do not offer a fixed ratio in that case.

## Build a reference cast, not a pile of uploads

Inspect the supplied assets and activate only material needed for the present scene. Assign one explicit job to every activated material in the creative prompt:

- **Image:** a character's visible identity and wardrobe; a product's structure and material; a prop; or a location's layout and lighting.
- **Motion video:** only the action, camera path, or pacing to inherit. State which identity, clothing, scene, or audio must _not_ transfer from it.
- **Audio:** one speaker's voice or dialogue, ambience, music, or a specific sound effect. Preserve the stated speaker and relationship to the picture.

Map people, products, props, and locations separately. Do not use upload order, contact-sheet labels, or a broad range such as “images 1–4 define the cast” as a substitute for roles. Leave irrelevant materials inactive and say so. A strong full-modal prompt makes the handoff legible:

```text
Image 1 defines Amina's face, braids, and amber jacket; do not use its cafe background.
Image 2 defines the bottle's square silhouette and frosted blue glass; do not use the hand holding it.
Video 1 defines the slow orbit and the moment the bottle turns toward camera; do not transfer its performer or set.
Audio 1 defines Amina's exact spoken line and close-mic voice; retain the city ambience under her voice.
```

Then state the opening state, primary event, visible ending state, and the invariants to preserve: identity and count, wardrobe, prop ownership, screen direction, spatial relationships, and audio relationships.

## Direct a whole beat deliberately

When an approved beat is at most the selected operation's advertised duration, it can be one Seedance clip only when it is one coherent dramatic event. A capability maximum is not a creative recommendation. Prefer Seedance 2.0 for this route unless the user has opted into 2.5. Write consecutive stages, not unrelated shots:

1. Give each stage one main state change and a concrete end state.
2. At each transition, state what carries forward from the previous stage.
3. Use exact time ranges only for a genuinely critical entrance, handoff, exit, transition, or user-requested beat.
4. If the runtime exceeds the live maximum, the beat contains unrelated coverage, or continuity cannot survive the requested action, split at a clear end state and retain the existing per-shot route.

For a start-frame or start-and-end-frame operation, bind only the required source frames and preserve their visual continuity. If the operation reports an Adaptive-only ratio, the source image governs composition. Use the full-modal reference operation when the scene genuinely needs image, motion, and audio materials together.

Assemble a stable shot instruction from scene context, active reference roles, spatial map, first frame, format and cuts, optics, camera behavior, timed action, physics, motivated light, exact audio, per-character acting, approved style, observable quality, and positive continuity constraints. Keep counts, speaker relationships, silence, and exclusions explicit. During iteration, preserve the working instruction and structured inputs, change one failing control, and record the result and verdict.

## Execute only through the approved Kinex path

For an Agent Workspace project, read the Production Plan and Project Bible, verify that the relevant plan is approved, then use `workspace_execute_command` with the discovered operation and a fresh clip prompt. Keep model selection, reference-role reasoning, and any duration split in the Production Plan when it affects coverage.

Poll `task_get`, re-read the affected beat or shot, and review the actual output before calling it complete. Repair a failed control at its source—role mapping, end state, frame selection, or structured operation input—rather than adding generic prompt bulk.

Read [tool map](references/tool-map.md) for operation discovery, routing, and review boundaries.
