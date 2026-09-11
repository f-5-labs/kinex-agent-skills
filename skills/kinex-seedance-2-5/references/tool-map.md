# Seedance operation map

## Discover before directing

- Discover the live Seedance 2.0 and 2.5 operations from the current model notes in this skill and read their actual fields, duration ranges, reference inputs, audio options, resolutions, and aspect-ratio choices. Those live notes are authoritative; do not remember “2.0 = 15s” or “2.5 = 30s”.
- Default an unqualified Seedance request to the full Seedance 2.0 / Standard SKU. Treat Fast, Mini, and 2.5 as explicit alternatives; record why one is selected.
- Do not assume a model identifier, media limit, fixed aspect ratio, or an edit/extension operation from another Seedance surface.

## Plan and execute

- Agent Workspace canon and approval: `plan_get`, `plan_save`, `context_get`, `context_update_section`.
- Structure and evidence: `beat_list`, `shot_list`, `workspace_read_entity`, `workspace_preview_entity`.
- Approved generation router: `workspace_execute_command`.
- Task completion: `task_get`, then re-read the affected beat or shot and use `workspace_preview_timeline` for cut review.

Use `workspace_execute_command` once the Production Plan carries one recorded approval. A current-turn request to generate is that approval, but it still has to be written: save the plan with `approvalConfirmed: true`, then execute in the same turn. Kinex refuses video generation without that saved approval record, and an open checklist row is not a reason to wait. Do not invent classic `generation_*` scene-row tools, and do not use `library_upload_media` for project-scoped continuity media.
