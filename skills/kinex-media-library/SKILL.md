---
name: kinex-media-library
description: Generate, upload, find, reuse, update, and organize standalone Kinex workspace media and reusable library characters, locations, or props. Use for “make an image in my library,” “upload these references,” “create a reusable character,” “find my recent generations,” or “use that earlier asset again.” Not for project-scoped scene generation, Agent Workspace entities, story development, or timeline export.
---

# Create and organize Kinex media

Treat the workspace library as reusable source material, not as a substitute for project-scoped entities or scene media. External assets intended to lock an Agent Workspace entity or shot must use `$kinex-agent-workspace`, which uploads them into the project before attachment.

Destination determines ownership, not cultural specificity. A researched reusable character, workshop, or prop stays in the library unless the user requests project attachment. During asset design, use the source and design-review checks in [grounded production design](../kinex-agent-workspace/references/grounded-production-design.md) when available; retain sourced facts, proposed choices, reference limits, and unresolved details with the asset's supported description/attributes. Those checks also apply standalone without creating a project. Review before its first image; downstream prompts inherit the design instead of restarting research.

## Route the request

- Find standalone work with `library_list_media`.
- Upload local image or video files with `library_upload_media` within the live per-call limit.
- Generate non-project media with `library_generate_image` or `library_generate_video`.
- Manage reusable library characters, locations, and props with `library_list_entities`, `library_create_entity`, and `library_update_entity`.
- Inspect project media records with `media_list_project`, `media_get`, and `media_get_public_url`.

Switch to `$kinex-agent-workspace` for project-scoped entities, variants, and continuity locks.

## Select an image model by its live schema

Before a model-specific request, pick the exact image operation and fields from the current library/model notes. Do not flatten image models into shared folklore:

- **Seedream 5 Pro:** prefer it for camera-real people, products, and multi-reference edits. Keep its output tier, file format, prompt-thinking option, and up-to-ten reference contract as structured inputs. For realistic people, describe natural skin microtexture, facial asymmetry, believable hands, fabric response, lens character, and motivated light; avoid generic “beautiful” or “ultra-realistic” filler.
- **Midjourney V8.1 on Atlas (Youchuan):** this is a natural-language image-generation model, not a language model. Put subject, environment, composition, aesthetic, light and color, lens or viewpoint, and material texture in the prose prompt. Send aspect ratio, style reference, stylize, chaos, weirdness, quality, HD, and seed through the operation fields—never append `--ar`, `--stylize`, or similar command suffixes. Expect the live operation to create four related outputs from one task and review all four before choosing a reusable hero.
- **Imagen 4 Ultra:** use it for flagship photoreal hero images, product photography, architecture, natural materials, diverse skin tones, or accurate text inside a photographic scene. Its live Atlas operation is text-to-image only. Keep negative prompt, prompt expansion, aspect ratio, 1K/2K resolution, one-to-four output count, and seed in their structured fields. Write subject, environment, composition, physically motivated light, lens and depth of field, then skin or material behavior; quote any required visible wording exactly.
- **Qwen Image Max:** use it when a realistic scene also contains complex spatial instructions or important readable text. Its live Atlas operation is text-to-image only and produces one image at one of five fixed sizes. Keep negative prompt, prompt expansion, aspect ratio, and seed structured. In prose, state spatial relationships explicitly and quote required text with its location, surface, type treatment, and viewing angle.

If a requested model is absent from the live registry, say so and choose a supported model with the user. Reference roles remain model-specific: Seedream accepts a reference list, Midjourney separates the content image from an optional style reference, and the current Imagen 4 Ultra and Qwen Image Max operations accept no source image. Preserve those differences when assembling inputs.

## Preserve continuity

Search before creating duplicates. Keep media and entity ids internally, reuse prior media as references, and surface canonical URLs with human labels rather than storage keys.

For a reusable recurring character, location, or prop, treat the library entity and its media as a compact reference passport: stable identity, source-grounded description, explicit role for every reference, required views or states, current approved version, and unresolved facts. Gather references by asset purpose—identity, wardrobe, geometry, material, scale, or state—and separately by craft purpose—light, palette, optics, movement, texture, edit rhythm, or sound. State what each reference controls and what must not transfer.

Keep variants and alternate views linked to the same reusable identity when the live entity schema supports them. Do not treat a library item as a project continuity lock automatically: when production begins, use `$kinex-agent-workspace` and verify the project-scoped hero, anchor, variants, and exact `castVariantKeys`, `locationVariantKey`, and `propVariantKeys` assignments there. Re-read the target with `shot_get`; a library selection or prompt mention alone changes none of those fields.

Before `library_create_entity` creates a reusable location, plan a minimal floor map from available evidence: footprint, zones, entrances and exits, permanent landmarks, relative scale, elevation, occlusions, and motivated light. Put supported stable geometry in the location description or live schema fields and mark unknown space unresolved. A library location still needs project-specific blocking and axis decisions when reused.

For async work, poll `task_get` or recover with `task_list_library`. Re-list media after completion before delivering a URL. A queued task is not a completed asset.

Confirm entity deletion or media archival, then re-list the affected collection.

Read [tool map](references/tool-map.md) for library-versus-project boundaries.
Read [shared shot composition](../kinex-agent-workspace/references/shot-composition.md) when handing library assets into project-shot assignments.

For a standalone installation without the sibling reference, read the [published shot composition contract](https://github.com/f-5-labs/kinex-agent-skills/blob/main/skills/kinex-agent-workspace/references/shot-composition.md) and refresh the live tool schema before project writes. If neither is available, keep the proposed patch local and report the gap; prompt-only work can continue.
