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

For async work, poll `task_get` or recover with `task_list_library`. Re-list media after completion before delivering a URL. A queued task is not a completed asset.

Confirm entity deletion or media archival, then re-list the affected collection.

Read [tool map](references/tool-map.md) for library-versus-project boundaries.
