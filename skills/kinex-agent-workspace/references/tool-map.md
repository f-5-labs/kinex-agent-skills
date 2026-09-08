# Agent Workspace tool map

## Workspace and project bootstrap

- Current OAuth workspace: `workspace_get_current`.
- Available memberships: `workspace_list`. When no destination was named, use the active workspace only if it is the default or sole membership; otherwise ask the user to choose. A non-active choice requires OAuth reconnection before any write.
- Existing project: `project_list` or `workspace_preview_projects`, then `project_get`.
- New Agent Workspace project: `project_create_from_brief` with `workspaceMode: agent`, then `project_get` and verify `workflowType: agent` or `formatConfig.agentWorkspaceV2: true`.
- Missing tools are a connection or host-loading failure, not an empty workspace. Ask for Kinex reauthorization and a new task instead of claiming the project does not exist.

## Canonical records

- Production Plan: `plan_get`, `plan_save`.
- Project Bible: `context_get`, `context_update_section`.
- A useful early plan may contain labeled unknowns; empty boilerplate is not useful.
- A valid plan uses exactly `## Direction`, `## Assumptions and Open Questions`, `## Milestones`, and `## Checklist`. Checklist rows use `- [ ] (stable-step-id) concise outcome`, with `[x]` for complete and `[-]` for blocked.
- At each new user turn, read the current checklist and reconcile it with the latest direction before material work. Persist only material roadmap changes; keep stable step ids for retained outcomes and do not rewrite an unchanged plan merely to prove it was reviewed.
- Re-read after a source-derived write and before reporting the saved direction.

## Production surfaces

- Style: `style_list`, `style_set_from_catalog`, `style_seed_from_catalog`, `style_set_custom`, `style_set_from_image`.
- Entities: `workspace_list_entities`, `workspace_read_entity`, `workspace_define_entity`, `workspace_update_entity`.
- Optional temporal structure: `beat_list`, `beat_define`, `beat_update`, `shot_list`, `shot_define`, `shot_update`.
- External project media: `workspace_upload_external_media`, then `workspace_attach_external_media`.
- Generation router: `workspace_execute_command`.
- Progress and cancellation: `task_list_project`, `task_get`, `task_cancel`.
- Project and shot histories: `media_list_project`, `media_get`, `media_get_public_url`.
- Human review: `workspace_preview_projects`, `workspace_preview_entity`, `workspace_preview_timeline`.

## Generation-router families

Use the live schema for exact payloads. Route entity heroes, scene images/video/SFX, beat frames/clips, shot regeneration, and image edits through `workspace_execute_command`. Entity CRUD, plan, context, style, beat, and shot writes have dedicated tools.

Choose models from the live registry rather than memory. Match the shot's needs—reference-image support, aspect ratio, duration, audio, first/end-frame controls, motion complexity, cost, and latency—to advertised capabilities. Keep model choice separate from creative canon, record it in the Production Plan when it affects coverage, and do a small representative test before scaling. A current internal planning-model default is not a requirement for an external MCP client.

The generation router executes approved work; it is not a substitute for a production skill. Do not invent campaign, shot-batch, prompt-director, or specialist tools.

## External-media lane

Use this lane when generation happens in the host agent or another approved system:

1. Define and re-read the target entity or shot.
2. Generate the asset externally from the current Kinex canon.
3. Upload image, video, or audio bytes with `workspace_upload_external_media`. Default to one large file per call; use only small bounded groups that fit the live limit and avoid oversized base64 payloads.
4. Attach an uploaded image with `workspace_attach_external_media` to an entity `hero` or `identity_anchor`, a named `entity_variant`, or a shot `start_frame` or `end_frame`.
5. Re-read or preview the target and verify the lock. For a named variant, confirm its `mediaItemId` is present, differs from the entity's `primaryMediaId`, and is not reused by any sibling locked variant.

These uploads are project-scoped. Do not use `library_upload_media` for Agent Workspace continuity locks. Do not also call Kinex generation when the user explicitly requested external generation.

To lock an externally generated named variant, call `workspace_attach_external_media` with `target.kind: "entity_variant"`, the canonical `entityKind` and `entityId`, and the exact `variantKey`. The named state must already exist. Re-read the entity after attachment; never use `workspace_update_entity` to forge system-owned `status`, `mediaItemId`, `sourceMediaItemId`, or `imageUrl` fields.

## Character and location media states

Keep these independent:

- Selected preview: presentation state only; it does not change continuity.
- Hero or master plate: `primaryMediaId`, the project's default entity image.
- Continuity or environment anchor: `identityAnchorMediaItemId`, the image future generation should preserve. Clear it with `workspace_update_entity` and `identityAnchorMediaItemId: null`.
- Generation history: call `media_list_project` with `sourceId` set to the entity id and `sourceTable` set to its table (`entity_characters`, `entity_locations`, or `entity_props`), then sort or inspect returned items without silently promoting one.

Use `workspace_attach_external_media` after upload to set an entity `hero` or `identity_anchor`. To promote an existing history item without re-uploading it, use `workspace_update_entity` with `primaryMediaId` or `identityAnchorMediaItemId`. Set both only when the user intends the same image to serve both roles. Re-read the entity and, when useful, preview it after each promotion.

For shot generations, re-read `media_list_project` and `task_get` before choosing an alternative. Do not claim a queued result is part of history until `task_get` settles and the relevant history has been re-read.

## Entity variants

List and semantically match existing entities before defining a new one. Keep production states in the canonical entity's `attributes.variants` and use the live shot schema for its variant keys. Lock the canonical hero before the entity is referenced by a shot. A shot's assigned variants must exist, belong to its active entities, and have the required locked media before start-frame or video generation.

After every generated or external variant lock, re-read the entity and compare ids. `status: locked` alone is never evidence: the variant needs a non-empty `mediaItemId` different from `primaryMediaId` and every sibling locked variant's `mediaItemId`. The Base may be a generation reference, but never a variant placeholder. If an earlier treatment left unassigned planned variants behind, remove each explicitly superseded key with `workspace_update_entity` and `attributesPatch.variants.<variantKey>: null` only after confirming no shot still assigns it.

## Location-definition gate

Before `workspace_define_entity` with `kind: location`, read the current plan and sources, then save the floor map in the Production Plan. Include stable zones, access points, landmarks, relative distances, action paths, camera sides, working axis, occlusions, elevation, and motivated light. Define the location only after that plan exists; then re-read it and persist approved cross-scene geography in the Project Bible when appropriate. Do not invent a floor-map tool.

## Confirmation gates

- Approving a plan requires explicit current-turn user approval. A direct instruction to create, generate, render, make, produce, queue, start, or proceed with a named visual deliverable counts; a question, hypothetical, or negative instruction does not. When it counts, call `plan_save` with `status: approved` and `approvalConfirmed: true`, then continue execution in that turn.
- Host confirmation for a pending MCP call is separate from creative approval. After approval, resume the suspended call; do not ask for the plan to be approved again.
- Replacing a Project Bible section requires confirmation.
- Reference-image analysis and generation may spend credits; respect host confirmation.
- Save and export a timeline only after review and confirmation.
- A stop or cancel request is authoritative. Use `task_cancel` for the matching queued task and do not retry unless the user later requests a restart.
