---
name: kinex-agent-workspace
description: Create or continue Kinex Agent Workspace projects for still images, films, scenes, campaigns, or mixed-media production through a source-grounded Production Plan and Project Bible, variant-aware entities, optional beats and shots, external or Kinex generation, tasks, and interactive previews. Use when the user asks for a new agent project, plan-first creative work, project-scoped imagery, entity continuity, or Agent Workspace production. Not for classic script-wizard projects, standalone library assets, or export-only requests.
---

# Direct Kinex Agent Workspace

Use the Agent Workspace as a media-agnostic collaborative production system: one living roadmap, one source-grounded canon, and explicit gates between planning, design, generation, review, and delivery. A project may contain only images and entities, or may grow into beats, shots, scenes, video, and a timeline. Do not route to the classic video skill merely because one deliverable is a film. Apply the film production pipeline only to temporal work; do not burden image-only projects with film artifacts. Keep routine direction, canonical definitions, and cross-stage continuity with the main agent. Delegate only when the user requests it or a specialist adds clear execution or deep-review value without fragmenting context.

## Connect and bootstrap

1. If Kinex tools are absent, do not pretend project creation was attempted. State that the MCP dependency is unavailable, ask the user to connect or reauthorize Kinex, and tell them a new task may be required for the tool catalog to load.
2. Call `workspace_get_current` before creating work. Call `workspace_list` when the user asks to choose a workspace or the destination is ambiguous. If no workspace was named, use the active workspace when it is the default or the only membership; otherwise ask one concise selection question. If the chosen workspace is not active, stop before writing and ask the user to reconnect Kinex to that workspace; never silently use another workspace.
3. For an existing project, resolve it with `project_list` or `workspace_preview_projects`, then call `project_get`.
4. For a new Agent Workspace project, call `project_create_from_brief` with the active `workspaceId` and `workspaceMode: agent`, then call `project_get`.
5. Continue only after the returned project has `workflowType: agent`, `agentWorkspace: true`, or `formatConfig.agentWorkspaceV2: true`. Treat `formatConfig.agentWorkspace` as a legacy flag only.

“Create an Agent Workspace” means create an Agent Workspace-mode project inside an existing Kinex workspace. Create a new team or organization only when the user explicitly asks for one.

## Start plan-first

1. Read the immediate brief or supplied source plus `plan_get` and `context_get`.
2. Within the first few useful actions, save a substantive draft with `plan_save`. Use exactly `## Direction`, `## Assumptions and Open Questions`, `## Milestones`, and `## Checklist`; write checklist rows as `- [ ] (stable-step-id) concise outcome` (`[x]` complete, `[-]` blocked).
3. Put durable, sourced creative facts in the Project Bible with `context_update_section`; never use it for speculative options, unsupported product claims, or temporary tasks.
4. At the start of every later user turn, re-read the plan and reconcile its checklist with the latest direction before material action. Retain relevant outcomes, remove superseded work, and reorder priorities. Save only when the shared roadmap materially changes; do not create a confirmation loop by rewriting an unchanged plan.
5. Re-read each saved record after writing it. Use the latest `etag` as `expectedEtag` when replacing an existing plan.

The Production Plan is the living roadmap. The Project Bible is the durable creative canon. Do not create a shadow plan in chat.

## Respect the gates

- Do not generate before the relevant creative plan and Project Bible facts exist.
- Do not generate motion or video before explicit Production Plan approval.
- For film work, do not generate a scene's frames or motion until its breakdown, visual-system, asset, and scene-readiness gates are closed. A direct request to produce the scene approves the current creative plan but does not waive missing continuity prerequisites; complete them first and continue in the same turn when safe.
- Treat an unambiguous current-turn instruction to create, generate, render, make, produce, queue, start, or proceed with a named video, clip, scene, shot, storyboard, or frame as explicit approval of the current plan. Save it as approved with `approvalConfirmed: true`, then continue into the requested execution in the same turn. Questions, hypotheticals, and negative instructions are not approval.
- Distinguish creative plan approval from the host's confirmation of a pending MCP call. After the host approves a suspended `plan_save` or generation call, resume that exact call and continue; do not request creative approval again or restart planning solely because the tool resumed.
- Treat stop or cancel as authoritative. Cancel matching queued work with `task_cancel` when requested and never retry a cancelled task unless the user starts it again.
- Inspect every supplied source before making source-dependent decisions.
- Preserve what a reference proves; keep unseen construction, unsupported claims, and unknown identity details unknown.
- Define one canonical entity per identity. Represent wardrobe, condition, time, angle, or prop-reveal states as named variants, not duplicate identities.
- Before `workspace_define_entity` creates a location, save a source-grounded floor map in the Production Plan. Include entrances, exits, zones, anchor landmarks, relative distances, action paths, camera sides, working axis, occlusions, elevation, and motivated light; mark unsupported space as unresolved or a design proposal.
- Choose the lightest sufficient reference artifact from downstream use. A multi-view sheet is the default for a new recurring character; a single hero is an explicit one-off or opt-out, not the automatic continuity lock.
- Lock each referenced entity's canonical hero before defining or updating shots that depend on it.
- Lock every entity variant assigned to a shot before generating its start frame or motion.
- Treat exact copy, dialogue, product facts, geography, screen direction, and reference roles as continuity constraints.
- Treat queued work as pending until the task completes and the artifact is re-read.

## Build the production

- Style: `style_list`, then one of `style_set_from_catalog`, `style_seed_from_catalog`, `style_set_custom`, or `style_set_from_image`.
- Entities: list before creating, then use `workspace_read_entity`, `workspace_define_entity`, and `workspace_update_entity`. Keep named variants in entity attributes and assign only relevant locked variants to shots.
- Structure when the deliverable needs temporal coverage: `beat_list`, `beat_define`, `beat_update`, then `shot_list`, `shot_define`, `shot_update`. Do not invent beats or shots for an image-only project.
- For scenes or films, write preliminary shot cards in the Production Plan after the breakdown, reconcile scene-to-assets coverage and required variants, lock the needed assets, then define or finalize Kinex shots with `shot_define` or `shot_update` and `requireLockedEntities: true`. Advance ready scenes without waiting for unrelated project assets.
- Kinex generation: choose a current model from `generation_list_supported_media_models`, then use `workspace_execute_command` only for approved execution such as entity heroes, scene or beat media, sound effects, and image edits.
- External generation: when the user names host image generation or wants generation outside Kinex, generate there, call `workspace_upload_external_media`, then bind the project-scoped result. Use `workspace_attach_external_media` for an entity hero/identity anchor or shot start/end frame; use the safe variant merge in the tool map for a named entity variant.
- Progress: retain task ids internally, poll `task_get`, then re-read the affected object and its generation history.

Do not substitute classic `visual_*` or `generation_*` workflows when the project is Agent Workspace-based.

## Direct the shot, not just the prompt

Plan assets before shots. Stress-test identity locks across useful views, lighting, poses, and ensembles; create only the variants the production needs. For film work, give every shot an identity-and-asset lane, direction lane, camera lane, and edit lane before generation. Specify active cast and reference roles, first-frame occupancy and geography, observable framing, camera behavior, timed action, performance beats, physical behavior, lighting, exact audio or copy constraints, and the intended join. Keep unused references and unrelated scene history out of the prompt.

Prefer one coherent take unless a cut is intentional. Preserve gaze, screen direction, prop state, wardrobe, weather, and performance state across cuts. Keep a take ledger with the exact operation, structured inputs, active references, prompt, one changed control, result, and verdict. If repeated attempts exhaust the agreed retry budget, simplify or split the shot instead of adding prompt bulk.

Build and review the edit while generation proceeds. Missing coverage is a planning problem; do not conceal it with broad regeneration.

## Review with the user

For character and location review, keep four states distinct: selected preview, hero or master plate (`primaryMediaId`), continuity anchor (`identityAnchorMediaItemId`), and generation history. List entity image history with `media_list_project`, using the entity id as `sourceId` and its matching entity table as `sourceTable`; use `workspace_update_entity` to promote an existing item or clear an anchor. An upload may become the hero, the anchor, or both only when that is intentional.

Use `scene_get_media_history` and `scene_set_active_media` for shot alternatives. Use `workspace_preview_entity` for identity and look review and `workspace_preview_timeline` for the current cut. Keep the conversation about creative outcomes, decisions, evidence, and blockers—not ids or tool mechanics.

Hand final assembly and rendering to `$kinex-review-and-export` only when the project needs a timeline or final render.

Read [tool map](references/tool-map.md) for command families and confirmation boundaries.
Read [character and location method](references/entity-and-location-method.md) when choosing, generating, or reviewing recurring identity and environment locks.
Read [production method](references/production-method.md) when designing entities, variants, performance, shot prompts, or iteration passes.
Read [scene-gated production method](references/scene-production-method.md) for any project that contains scenes, motion, an edit, or final delivery.
