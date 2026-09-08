# Hailuo H3 operation map

## Discover before directing

- Use `generation_list_supported_media_models` to confirm a live Atlas-backed Hailuo H3 operation and inspect its actual duration, resolution, ratio, frame, and typed-reference fields.
- Do not assume direct MiniMax capabilities or borrow Seedance fields. In particular, the current H3 mixed-reference operation requires a visual reference and accepts no more than nine total image, video, and audio materials.

## Plan and execute

- Agent Workspace canon and approval: `plan_get`, `plan_save`, `context_get`, `context_update_section`.
- Structure and evidence: `beat_list`, `shot_list`, `workspace_read_entity`, `workspace_preview_entity`.
- Approved generation router: `workspace_execute_command`.
- Completion and cut review: `task_get`, then re-read the affected beat or shot and use `workspace_preview_timeline`.

Use `workspace_execute_command` only after the relevant Production Plan is approved. Do not call `generation_generate_video` for an Agent Workspace beat, and do not use `library_upload_media` for project-scoped continuity media.
