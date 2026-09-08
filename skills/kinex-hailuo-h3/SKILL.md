---
name: kinex-hailuo-h3
description: Direct Atlas-backed MiniMax Hailuo H3 video generation in Kinex with its own audiovisual prompt structure, first or first-and-last-frame controls, and up to nine typed image, video, and audio references. Use for “make this in Hailuo H3,” “turn this start frame into a 2K clip,” “land on this final frame,” or “use image, motion, and audio references in a 4–15 second H3 shot.” Not for Seedance 2.5 whole beats, provider billing, or direct MiniMax API calls.
---

# Direct Hailuo H3 in Kinex

Use this skill to direct one coherent 4–15 second Hailuo H3 audiovisual shot through the approved Kinex route. H3 is not a shorter Seedance variant: its inputs and prompt grammar are model-specific.

## Confirm the live H3 operation first

1. Confirm Hailuo H3 from the current model notes in this skill before choosing it. The live Kinex operation contract is authoritative for its available operations and fields.
2. Choose exactly one returned H3 operation:
   - **Text only** for a fresh prompt-led clip. It uses a concrete aspect ratio and supports 768P or 2K.
   - **Start frame** to continue a supplied first image. It uses the source-led adaptive ratio.
   - **Start + end frame** to travel continuously from a first image to a supplied final image. It uses the source-led adaptive ratio.
   - **Mixed references** for typed image, video, and audio materials. It accepts at most nine total materials and requires at least one image or video; audio alone is invalid.
3. If the Atlas-backed H3 operation is absent, say so and select a live supported alternative with the user. Do not call MiniMax directly or assume features from another Hailuo surface.

Keep duration, resolution, ratio, and uploaded materials as structured operation inputs. Do not invent a Seedance `generateAudio` switch: H3 has its own audiovisual prompting and may use a supplied audio reference when the live mixed-reference operation exposes it.

## Build an H3 shot, not a Seedance beat

H3 works best as one continuous 4–15 second audiovisual event. State an opening composition, a physically plausible action and camera path, and the exact visible ending state. Do not use Seedance staged 30-second beats, hard-cut timecodes, `@Image` tags, or Seedance reference-role prose.

For a frame-led operation, make the first frame motion-safe before submitting. With a final frame, describe a single path that lands on the final composition; do not ask for a montage or a sequence of cuts between the two images. Give camera direction as **movement type + amplitude + speed**, then ensure the subject and environmental movement agree with it.

For mixed references, attach only materials needed by this shot and label them in the prompt as `<Subject N>`, `<Picture N>`, `<Video N>`, and `<Audio N>`. Give each one a single retained role:

- `<Picture N>` locks an appearance, product, setting, or composition.
- `<Video N>` guides motion, pacing, or camera behavior.
- `<Audio N>` contributes timing, rhythm, dialogue, or sound context.

Never claim an unattached reference exists. Do not force every property from one source into another: say precisely what each material contributes and what visual or audio outcome must stay stable.

## Write the H3 audiovisual prompt

For text-only, start-frame, and start-and-end-frame work, put this structure in the operation's plain `prompt` field:

```text
Integrated Multimodal Description: <subject, action, setting, composition, camera path, and visible ending state>
Overall Soundscape: <diegetic sound, ambience, dialogue, and timing>
Non-diegetic Music: <music direction, or None>
```

When dialogue is essential, keep the provided words exact and write it as `<d>[language]spoken line</d>`. Keep the prompt specific and concise; use observable performance rather than emotion labels.

For the mixed-reference operation, use the reference-aware structure in [H3 prompt structure](references/prompt-structure.md). It adds `Subject Definitions`, `Summary`, and `Reference Retention` before the audiovisual description so the model receives explicit reference bindings. Do not substitute the Seedance reference template.

## Execute and review through Kinex

For an Agent Workspace project, read the Production Plan and Project Bible, confirm the relevant plan is approved, then call `workspace_execute_command` using the operation returned by the live registry. Record a duration split or reference-role decision in the plan when it affects coverage or continuity.

Poll `task_get`, inspect the completed beat or shot, and review the output before calling the work complete. Repair the failed control at its source—operation selection, frame selection, reference retention, camera path, or soundscape—rather than piling on generic prompt text.

Read [tool map](references/tool-map.md) for Kinex routing and review boundaries.
