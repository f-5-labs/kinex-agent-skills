---
name: kinex-image-prompting
description: Write the image prompt itself for Kinex work — identity locks, hero stills, storyboard and start frames, layout stills, and targeted edits — with job-first classification, dense control where it matters, positive constraints, and exact on-image copy. Use for “write the prompt for this still,” “why does this image keep drifting,” “make a start frame that animates well,” or “edit this frame without losing the rest.” Not for choosing a model or SKU, operation discovery, video direction, or library and project bookkeeping.
---

# Write the image, not a pile of adjectives

This skill is about prompt craft. Model choice belongs to `$kinex-media-library`, project routing to `$kinex-agent-workspace`, and motion to the model skills. What arrives here is one image that has to do one job.

## Classify the job before writing a word

A prompt that mixes jobs drifts, because the jobs pull against each other:

- **Identity lock** — a neutral, evenly lit reference whose only purpose is to be recognisable later. Cinematic grade, atmosphere, and a strong key light make it a worse reference, not a better image.
- **Hero still** — the finished picture. Grade, mood, and lens character belong here.
- **Storyboard or start frame** — blocking and readable action for the shot that follows.
- **Layout still** — composition, product placement, and copy space carry the frame.
- **Edit** — an existing frame changes in one respect and holds everywhere else.

Name the job out loud, then write only for that job.

## Read the operation before the prose

Aspect ratio, resolution, output count, seed, and negative prompt are structured inputs on the live operation. Read them there and fill them there. Writing `--ar 16:9` or “16:9, 4K” in the prompt text controls nothing and spends attention. Confirm the fields from the live registry rather than a remembered schema.

## Be dense where control matters, thin everywhere else

Write coherent description, not stacked keywords. `cinematic, 8k, masterpiece, highly detailed` does nothing — those words describe no visible thing. Spend the words here instead:

- **Subject and identity** named once. When a reference already carries the face, wardrobe, or product geometry, say what it contributes and move on; re-describing it invites the model to reinterpret it.
- **Materials** that are real and finished: `brushed aluminium, matte`, `waxed canvas`, `wet asphalt`. Not `high-quality materials`.
- **Spatial grounding**: what is where, what touches what, what sits in front of what.
- **Light** by source and direction — `low window light from frame left`, `single tungsten practical behind her` — never `dramatic lighting`.
- **Palette** as two or three named hues, or a 60/30/10 split. Never `colorful`.
- **Framing** as the visible result: what fills the frame, what is cropped, where the horizon sits.

Everything outside that list can be one clause or none.

## State constraints positively

None of these operations take a negative prompt in the prose, and naming what to avoid tends to introduce it. Write the desired state: `both hands visible and complete`, `label legible and square to camera`, `background stays empty above the shoulder`.

## Copy, start frames, and edits

- **On-image text** is quoted verbatim with its real weight and case, plus its surface and placement. Never invent wording, never approximate a supplied line.
- **Motion-safe start frames** follow the sourced incoming action phase in `direction.blocking`. They can show anticipation, stillness, permission, or action already underway. Show the cause before its payoff; never skip approach, consent, contact, or transfer simply to start mid-action.
- **Edits** change the minimum and preserve the rest explicitly: one change per pass, and name what fills the space a removed object leaves behind. A frame that needs several unrelated changes needs a rebuild, not an edit chain — regenerate it.

For project frames, read `shot_get` and the assigned entities/variants first. Compile `imagePrompt` from `direction.blocking`, `camera`, and `spatialLayout`; preserve the executable assignments. Compose for the exact target ratio before cropping, then inspect actual dimensions and action readability. An Adaptive operation inherits the source frame ratio. Follow [shared shot composition](../kinex-agent-workspace/references/shot-composition.md) when a frame changes the shot.

## Prove the camera in the pixels

Choose what the audience must learn before choosing the viewpoint. Put the camera at a named floor-map station on the intended side of the action axis, then describe visible geometry rather than relying on “south,” “reverse,” “OTS,” or a focal length. For OTS work, specify which near back/shoulder masks the frame, how large it is, whose face is hidden or dominant, which hand/object path remains visible, and which background landmarks shift with parallax. A head turn, tighter crop, or lens label inside the same frontal two-person composition is not a camera change.

Use identity sheets to preserve people and approved location references to preserve space, while explicitly withholding their composition. Do not feed a rejected frontal shot back as the composition anchor for a new OTS or detail. If a targeted edit preserves the wrong perspective, rebuild the image from the identity and location references. Across reverses, verify left/right hands, complete fingers, prop ownership, and visible body-bound accessories such as a watch before accepting the frame. When an accessory's correct limb is hidden, report it as unverified instead of inferring continuity from its absence on the wrong limb.

## Cut, then generate, then look

Before sending, delete every clause that is not doing work. Past a point, extra sentences dilute attention rather than adding control; a shorter prompt with the same specifics beats a longer one.

Then generate through the route the project uses, poll the task, and actually look at the returned image. Hide captions, panel labels, and diagrams while judging a claimed camera change. Compare foreground occlusion and scale, face visibility, action-path readability, and background perspective against the planned station. Disqualify an attractive sheet when the uncaptioned image contradicts the camera plan. Repair at the source — job classification, reference role, light, framing, structured field — rather than appending adjectives to the prompt that already failed.

Read [tool map](references/tool-map.md) for discovery, routing, and review boundaries.

For a standalone installation without the sibling reference, read the [published shot composition contract](https://github.com/f-5-labs/kinex-agent-skills/blob/main/skills/kinex-agent-workspace/references/shot-composition.md) and refresh the live tool schema before project writes. If neither is available, keep the proposed patch local and report the gap; prompt-only work can continue.
