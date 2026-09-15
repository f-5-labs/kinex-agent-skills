---
name: kinex-hailuo-h3
description: Direct Atlas-backed MiniMax Hailuo H3 video generation in Kinex with its own audiovisual prompt structure, first or first-and-last-frame controls, and up to nine typed image, video, and audio references. Use for “make this in Hailuo H3,” “turn this start frame into a 2K clip,” “land on this final frame,” or “use image, motion, and audio references in a 4–15 second H3 shot.” Not for Seedance 2.5 whole beats, provider billing, or direct MiniMax API calls.
---

# Direct Hailuo H3 in Kinex

Use this skill to direct one coherent Hailuo H3 audiovisual shot through the approved Kinex route. H3 is not a shorter Seedance variant: its inputs and prompt grammar are model-specific. If they asked to generate, generate.

## Confirm the live H3 operation first

1. Confirm Hailuo H3 from the current model notes in this skill before choosing it. The live Kinex operation contract is authoritative for its available operations and fields.
2. Choose exactly one returned H3 operation:
   - **Text only** for a fresh prompt-led clip. It uses a concrete aspect ratio and supports 768P or 2K.
   - **Start frame** to continue a supplied first image. It uses the source-led adaptive ratio.
   - **Start + end frame** to travel continuously from a first image to a supplied final image. It uses the source-led adaptive ratio.
   - **Mixed references** for typed image, video, and audio materials. It accepts at most nine total materials and requires at least one image or video; audio alone is invalid.
3. If the Atlas-backed H3 operation is absent, say so and select a live supported alternative with the user. Do not call MiniMax directly or assume features from another Hailuo surface.

Keep duration, resolution, ratio, and uploaded materials as structured operation inputs. Read the live duration range from the current model notes; do not hardcode a remembered 4–15 second ceiling. Do not invent a Seedance `generateAudio` switch: H3 has its own audiovisual prompting and may use a supplied audio reference when the live mixed-reference operation exposes it.

## Build an H3 shot, not a Seedance beat

One Agent Workspace shot record still owns one generated H3 clip; do not create records per storyboard panel or micro-action. H3 works best as one continuous audiovisual event within the live duration range. State an opening composition, a physically plausible action and camera path, and the exact visible ending state. If a sequence sheet calls for internal hard cuts that the live H3 operation cannot execute, choose a capable route or split at an earned state boundary instead of hiding the limitation. Do not use Seedance `@Image` tags, staged multi-beat grammar, hard-cut timecodes, or Seedance reference-role prose. A board may remain planning evidence, but it is not an H3 start frame unless a clean single panel is explicitly selected as that frame.

Fill the same production spine H3 can hold, in H3 language:

- **GEO:** stable layout, subject positions, eyelines, axis, screen direction.
- **First frame:** motion-safe occupancy, pose, prop contact, and the readable start of the action.
- **One coherent camera plan:** movement type + amplitude + speed. Prefer a simple path the shot can sustain; complexity must serve the action. Make subject and environment motion agree with that one path.
- **One continuous shot, no cuts, no zoom.** With a final frame, describe a single path that lands on the final composition; do not write a montage between the two images.
- **Slow motion:** describe the desired temporal effect and use advertised speed/frame controls when available. Capture/playback numbers in prose express intent, not verified recording metadata.
- **Performance and physics:** observable behavior, contact, weight, cloth, hair, water. No emotion adjectives.
- **Must-hold outcomes:** identity, product geometry, composition, and the useful transfer from each attached reference. H3 has no separate `Preserve:` line — state these inside the description for text-only and frame-led work, and in `Reference Retention` for the mixed-reference operation. Review the actual take to verify they held.
- **No negative prompts.** Write the desired state: “identity holds”, “label stays legible”, “edges stay stable”.

For mixed references, attach only materials needed by this shot and label them in the prompt as `<Subject N>`, `<Picture N>`, `<Video N>`, and `<Audio N>`. Give each one a single retained role:

- `<Picture N>` locks an appearance, product, setting, or composition.
- `<Video N>` guides motion, pacing, or camera behavior.
- `<Audio N>` contributes timing, rhythm, dialogue, or sound context.

Never claim an unattached reference exists. Do not force every property from one source into another: say precisely what each material contributes and what visual or audio outcome must stay stable.

## Write the H3 audiovisual prompt

For text-only, start-frame, and start-and-end-frame work, put this structure in the operation's plain `prompt` field:

```text
Integrated Multimodal Description: <GEO, first-frame blocking, subject, one action, one camera path with amplitude and speed, physics, and visible ending state>
Overall Soundscape: <diegetic sound, ambience, dialogue, and timing>
Non-diegetic Music: <music direction, or None>
```

Those three sections are the whole base structure. Do not append a Seedance-style `Preserve:` line: fold the must-hold outcomes — identity, product geometry, composition — into the `Integrated Multimodal Description` as positive statements. `Reference Retention` is where they go instead, and only for the mixed-reference operation.

When dialogue is essential, keep the provided words exact and write it as `<d>[language]spoken line</d>`. Keep the prompt specific and concise.

For the mixed-reference operation, use the reference-aware structure in [H3 prompt structure](references/prompt-structure.md). It adds `Subject Definitions`, `Summary`, and `Reference Retention` before the audiovisual description so the model receives explicit reference bindings. Put must-hold outcomes in `Reference Retention` — that is H3's Preserve line. Do not substitute the Seedance template.

## Preflight, then generate

Read the current shot with `shot_get` and apply [shared shot composition](../kinex-agent-workspace/references/shot-composition.md) before compiling the provider prompt. Repair known direction or audio contradictions within scope, then run this preflight and execute authorized generation. If the user explicitly requests a test with open creative issues, record those issues and keep the verdict unverified; do not turn preflight into another approval loop.

For a grounded story, read or complete [grounded production design](../kinex-agent-workspace/references/grounded-production-design.md) before compiling the clip. Carry the relevant sourced or proposed context into reference roles, wardrobe, work, prop paths, occupancy, materials, signage, and blocking; never use a country or community label as a style shortcut. This focused pass remains part of preflight, so an otherwise executable direct request continues after it.

1. One H3 operation from the live notes; duration and ratio match that contract.
2. GEO and a motion-safe first frame are stated.
3. One coherent camera plan, including locked-off, through the ending state.
4. Each attached reference has one retained role; no unattached labels.
5. Performance is observable; quoted or `<d>` dialogue is exact.
6. Must-hold outcomes are stated positively — inside the description, or in `Reference Retention` for mixed references.
7. No Seedance `@Image` tags, staged beats, or hard-cut timecodes.

If they asked to generate, do not stop the turn after the checklist.

## Execute and review through Kinex

For an Agent Workspace project, read the Production Plan, Project Bible, current `shot_get` card, and assigned variants. Reconcile authored `imagePrompt/videoPrompt` after card changes, verify the chosen nested `audio` route, and retain the actual compiled prompt and operation inputs. A current-turn generate request approves the current plan; then call `workspace_execute_command` using the operation returned by the live registry. Record a duration split or reference-role decision in the plan when it affects coverage or continuity.

Poll `task_get`, inspect the completed beat or shot, and review the output before calling the work complete. Repair the failed control at its source—operation selection, frame selection, reference retention, camera path, or soundscape—rather than piling on generic prompt text. Never fabricate a completed clip.

Read [tool map](references/tool-map.md) for Kinex routing and review boundaries.

For a standalone installation without the sibling reference, read the [published shot composition contract](https://github.com/f-5-labs/kinex-agent-skills/blob/main/skills/kinex-agent-workspace/references/shot-composition.md) and refresh the live tool schema before project writes. If neither is available, keep the proposed patch local and report the gap; prompt-only work can continue.
