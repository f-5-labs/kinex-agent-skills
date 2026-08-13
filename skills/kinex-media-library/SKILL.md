---
name: kinex-media-library
description: Generate, upload, find, reuse, update, and organize standalone Kinex workspace media and reusable library characters, locations, or props. Use for “make an image in my library,” “upload these references,” “create a reusable character,” “find my recent generations,” or “use that earlier asset again.” Not for project-scoped scene generation, Agent Workspace entities, story development, or timeline export.
---

# Create and organize Kinex media

Treat the workspace library as reusable source material, not as a substitute for project-scoped entities or scene media. External assets intended to lock an Agent Workspace entity or shot must use `$kinex-agent-workspace`, which uploads them into the project before attachment.

## Route the request

- Find standalone work with `library_list_media`.
- Upload local image or video files with `library_upload_media` within the live per-call limit.
- Generate non-project media with `library_generate_image` or `library_generate_video`.
- Manage reusable library characters, locations, and props with `library_list_entities`, `library_create_entity`, and `library_update_entity`.
- Inspect project media records with `media_list_project`, `media_get`, and `media_get_public_url`.

Switch to classic `visual_*` for a classic project look bible or `$kinex-agent-workspace` for Agent Workspace entities.

## Preserve continuity

Search before creating duplicates. Keep media and entity ids internally, reuse prior media as references, and surface canonical URLs with human labels rather than storage keys.

For a reusable recurring character, location, or prop, treat the library entity and its media as a compact reference passport: stable identity, source-grounded description, explicit role for every reference, required views or states, current approved version, and unresolved facts. Gather references by asset purpose—identity, wardrobe, geometry, material, scale, or state—and separately by craft purpose—light, palette, optics, movement, texture, edit rhythm, or sound. State what each reference controls and what must not transfer.

Keep variants and alternate views linked to the same reusable identity when the live entity schema supports them. Do not treat a library item as a project continuity lock automatically: when production begins, use the classic look-bible or Agent Workspace project lane and verify the project-scoped hero, anchor, variants, and shot assignments there.

Before `library_create_entity` creates a reusable location, plan a minimal floor map from available evidence: footprint, zones, entrances and exits, permanent landmarks, relative scale, elevation, occlusions, and motivated light. Put supported stable geometry in the location description or live schema fields and mark unknown space unresolved. A library location still needs project-specific blocking and axis decisions when reused.

For async work, poll `task_get` or recover with `task_list_library`. Re-list media after completion before delivering a URL. A queued task is not a completed asset.

Confirm entity deletion or media archival, then re-list the affected collection.

Read [tool map](references/tool-map.md) for library-versus-project boundaries.
