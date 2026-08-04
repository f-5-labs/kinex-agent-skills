---
name: kinex-agent-workspace
description: Direct Kinex Agent Workspace projects through the shared Production Plan and Project Bible, then style, entities, beats, shots, generation, tasks, and interactive previews. Use when a project reports Agent Workspace mode or the user asks for plan-first direction, source-grounded canon, beat or shot design, entity locks, or workspace generation. Not for classic script-wizard projects, standalone library assets, or export-only requests.
---

# Direct Kinex Agent Workspace

Use the Agent Workspace surface as a production system: one living roadmap, one source-grounded creative canon, and explicit gates between planning, design, generation, review, and delivery.

## Start plan-first

1. Resolve the project with `project_list` or `workspace_preview_projects`, then confirm its mode with `project_get`.
2. Read the immediate brief or supplied source plus `plan_get` and `context_get`.
3. Within the first few useful actions, save a substantive draft with `plan_save`. Label assumptions, unknowns, dependencies, approval state, and the smallest honest next milestone.
4. Put durable, sourced creative facts in the Project Bible with `context_update_section`; never use it for speculative options or temporary tasks.
5. Re-read each saved record after writing it. Replace superseded direction when the user changes scope.

The Production Plan is the living roadmap. The Project Bible is the durable creative canon. Do not create a shadow plan in chat.

## Respect the gates

- Do not generate before the story plan and relevant Project Bible facts exist.
- Do not scale motion generation before explicit plan approval.
- Inspect every supplied source before making source-dependent decisions.
- Preserve what a reference proves; keep unseen construction, unsupported claims, and unknown identity details unknown.
- Lock required entity heroes before shots depend on them.
- Treat queued work as pending until the task completes and the artifact is re-read.

## Build the production

- Style: `style_list`, then one of `style_set_from_catalog`, `style_set_custom`, or `style_set_from_image`.
- Entities: `workspace_list_entities`, `workspace_read_entity`, `workspace_define_entity`, `workspace_update_entity`.
- Structure: `beat_list`, `beat_define`, `beat_update`, then `shot_list`, `shot_define`, `shot_update`.
- Generation: `workspace_execute_command` for entity heroes, scene or beat media, sound effects, and image edits.
- Progress: retain task ids internally, poll `task_get`, then re-read the affected object.

Do not substitute classic `visual_*` or `generation_*` workflows when the project is Agent Workspace-based.

## Review with the user

Use `workspace_preview_entity` for identity and look review and `workspace_preview_timeline` for the current cut. Keep the conversation about creative outcomes, decisions, evidence, and blockers—not ids or tool mechanics.

Hand final assembly and rendering to `$kinex-review-and-export`.

Read [tool map](references/tool-map.md) for command families and confirmation boundaries.
