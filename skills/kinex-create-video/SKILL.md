---
name: kinex-create-video
description: Turn a creative brief or one-line idea into a complete classic Kinex video through the manual script, look-bible, scene, generation, timeline, and export pipeline. Use when the user explicitly wants the classic script wizard or an existing project reports manual workflow mode. Not for Agent Workspace projects, image-only creative projects, script-only revisions, standalone library media, or export-only requests.
---

# Create a classic Kinex video

Drive the project from intent to a verified result. Infer safe defaults, keep internal ids private, and ask at most one question when the answer materially changes creative direction or safety.

## Route the project

1. Confirm the active OAuth workspace with `workspace_get_current`, then resolve existing work with `project_list`.
2. Create a new project only when the user explicitly wants the classic workflow; call `project_create_from_brief` with `workspaceMode: manual` and the active `workspaceId`.
3. Read `project_get` and `project_get_pipeline`.
4. If the project reports `workflowType: agent`, `agentWorkspace: true`, or `formatConfig.agentWorkspaceV2: true`, stop this workflow and use `$kinex-agent-workspace`.
5. Otherwise continue through the classic story pipeline below.

## Build before generating

1. Read `script_get_document`.
2. Develop the story with `script_planning_turn` or make one precise change with `script_refine`.
3. Re-read and apply a `pass`, `revise`, or `block` editorial verdict.
4. Run `script_plan_shots`, then `script_generate_visual_script`; poll `task_get` and verify the result.
5. Check the visual script as production coverage: every shot needs its story purpose, active cast and state, location and time, significant props, observable action, performance beat, camera behavior, duration, intended cut, and any complex generation risk.
6. Stabilize the look bible with `visual_list_entities` and required entity updates before generating thumbnails. Before creating or finalizing a location, plan its footprint, zones, access points, landmarks, distances, action paths, camera sides, working axis, occlusions, elevation, and motivated light in the script or visual-planning artifact. Treat wardrobe, condition, time, weather, and prop changes as explicit production states rather than prose hidden inside prompts.
7. Create storyboard rows only after story, coverage, and look-bible approval. Do not release a scene whose required visual entities are missing or unreviewed.

## Generate selectively

Read `scene_list_project`, repair order or prompts, and choose a current model using `generation_list_supported_media_models` when needed. Generate scene-sized production blocks rather than scattered shots; generate only affected scenes for targeted revisions. Batch only several approved scenes sharing settings. Poll every task, inspect `scene_get_media_history`, and choose canonical media with `scene_set_active_media`. When iterating, preserve the last working prompt and inputs, change one failing control, and retain the result and verdict.

## Review and deliver

Run a light evidence-backed review after story, look bible, scenes, and media. Review neighbouring shots for eyelines, action axis, identity and prop continuity, light, movement tempo, and audio tails. Fix blockers at their source layer. Hand final assembly and rendering to `$kinex-review-and-export`.

Never call a queued task complete or hide unresolved continuity risks.

Read [tool map](references/tool-map.md) for classic-project tool boundaries.
