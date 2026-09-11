# Hailuo H3 operation map

## Discover before directing

- Confirm a live Atlas-backed Hailuo H3 operation from the current model notes in this skill and inspect its actual duration, resolution, ratio, frame, and typed-reference fields. Live duration wins over a remembered 4–15 second range.
- Do not assume direct MiniMax capabilities or borrow Seedance fields. In particular, the current H3 mixed-reference operation requires a visual reference and accepts no more than nine total image, video, and audio materials.

## Plan and execute

- Agent Workspace canon and approval: `plan_get`, `plan_save`, `context_get`, `context_update_section`.
- Structure and evidence: `beat_list`, `shot_list`, `workspace_read_entity`, `workspace_preview_entity`.
- Approved generation router: `workspace_execute_command`.
- Completion and cut review: `task_get`, then re-read the affected beat or shot and use `workspace_preview_timeline`.

Use `workspace_execute_command` once the Production Plan carries one recorded approval. A current-turn request to generate is that approval, but it still has to be written: save the plan with `approvalConfirmed: true`, then execute in the same turn. Kinex refuses video generation without that saved approval record, and an open checklist row is not a reason to wait. Do not invent classic `generation_*` scene-row tools, and do not use `library_upload_media` for project-scoped continuity media.
