---
name: kinex-create-video
description: Turn a creative brief or one-line idea into a complete Kinex video by chaining project, plan, script, entity, scene, generation, task, timeline, preview, and export tools. Use for “make a short film,” “create a product video,” “turn this idea into a video,” or “finish this Kinex project.” Not for a script-only revision, standalone library media, or a narrow Agent Workspace milestone.
---

# Create a Kinex video

Drive the project from intent to a verified result. Infer safe defaults, keep internal ids private, and ask at most one question when the answer materially changes creative direction or safety.

## Route the project

1. Resolve existing work and the OAuth-authorized workspace with `project_list`; use `project_create_from_brief` only for a new project. Preserve the returned `workspaceId` when creating, and let Kinex use the authorized default workspace when none was selected.
2. Read `project_get` and `project_get_pipeline`.
3. New externally directed projects default to Agent Workspace mode. If `formatConfig.agentWorkspace` is active, use `$kinex-agent-workspace`; its Production Plan and Project Bible are the source of truth.
4. Otherwise continue through the classic story pipeline below.

## Build before generating

1. Read `script_get_document`.
2. Develop the story with `script_planning_turn` or make one precise change with `script_refine`.
3. Re-read and apply a `pass`, `revise`, or `block` editorial verdict.
4. Run `script_plan_shots`, then `script_generate_visual_script`; poll `task_get` and verify the result.
5. Stabilize the look bible with `visual_list_entities` and required entity updates before generating thumbnails.
6. Create storyboard rows only after story and look-bible approval.

## Generate selectively

Read `scene_list_project`, repair order or prompts, and choose a current model using `generation_list_supported_media_models` when needed. Generate only affected scenes for targeted revisions; batch only several approved scenes sharing settings. Poll every task, inspect `scene_get_media_history`, and choose canonical media with `scene_set_active_media`.

## Review and deliver

Run a light evidence-backed review after story, look bible, scenes, and media. Fix blockers at their source layer. Hand final assembly and rendering to `$kinex-review-and-export`.

Never call a queued task complete or hide unresolved continuity risks.

Read [tool map](references/tool-map.md) for classic-project tool boundaries.
