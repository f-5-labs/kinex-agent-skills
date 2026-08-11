# Seedance 2.5 operation map

## Discover before directing

- Use `generation_list_supported_media_models` to confirm that an Atlas-backed Seedance 2.5 operation is live and to read its actual fields, duration range, reference inputs, audio option, resolution, and aspect-ratio choices.
- Do not assume a model identifier, media limit, fixed aspect ratio, or an edit/extension operation from another Seedance surface.

## Plan and execute

- Agent Workspace canon and approval: `plan_get`, `plan_save`, `context_get`, `context_update_section`.
- Structure and evidence: `beat_list`, `shot_list`, `workspace_read_entity`, `workspace_preview_entity`.
- Approved generation router: `workspace_execute_command`.
- Task completion: `task_get`, then re-read the affected beat or shot and use `workspace_preview_timeline` for cut review.

Use `workspace_execute_command` only after the relevant Production Plan is approved. Do not call classic `generation_generate_video` for an Agent Workspace beat, and do not use `library_upload_media` for project-scoped continuity media.
