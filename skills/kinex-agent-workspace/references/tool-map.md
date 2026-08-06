# Agent Workspace tool map

## Canonical records

- Production Plan: `plan_get`, `plan_save`.
- Project Bible: `context_get`, `context_update_section`.
- A useful early plan may contain labeled unknowns; empty boilerplate is not useful.
- Re-read after a source-derived write and before reporting the saved direction.

## Production surfaces

- Style: `style_list`, `style_set_from_catalog`, `style_set_custom`, `style_set_from_image`.
- Entities: `workspace_list_entities`, `workspace_read_entity`, `workspace_define_entity`, `workspace_update_entity`.
- Structure: `beat_list`, `beat_define`, `beat_update`, `shot_list`, `shot_define`, `shot_update`.
- External project media: `workspace_upload_external_media`, then `workspace_attach_external_media`.
- Current model capabilities: `generation_list_supported_media_models`.
- Generation router: `workspace_execute_command`.
- Progress: `task_list_project`, `task_get`.
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
4. Attach an uploaded image with `workspace_attach_external_media` to an entity `hero` or `identity_anchor`, or a shot `start_frame` or `end_frame`.
5. Re-read or preview the target and verify the lock.

These uploads are project-scoped. Do not use `library_upload_media` for Agent Workspace continuity locks. Do not also call Kinex generation when the user explicitly requested external generation.

The current attach target does not accept a variant key. To lock an externally generated named variant, re-read the entity, preserve every sibling in its existing `attributes.variants` map, merge the target variant with `status: locked`, the uploaded `mediaItemId`, and its returned image URL, then send the complete merged variants map through `workspace_update_entity.attributesPatch.variants`. Re-read the entity after writing. Never submit a one-variant map over an existing map because `attributesPatch` is shallow at the `variants` key.

## Entity variants

List and semantically match existing entities before defining a new one. Keep production states in the canonical entity's `attributes.variants` and use the live shot schema for its variant keys. Lock the canonical hero before the entity is referenced by a shot. A shot's assigned variants must exist, belong to its active entities, and have the required locked media before start-frame or video generation.

## Confirmation gates

- Approving a plan requires explicit user approval.
- Replacing a Project Bible section requires confirmation.
- Reference-image analysis and generation may spend credits; respect host confirmation.
- Save and export a timeline only after review and confirmation.
