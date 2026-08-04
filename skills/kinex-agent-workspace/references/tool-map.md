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
- Generation router: `workspace_execute_command`.
- Progress: `task_list_project`, `task_get`.
- Human review: `workspace_preview_projects`, `workspace_preview_entity`, `workspace_preview_timeline`.

## Generation-router families

Use the live schema for exact payloads. Route entity heroes, scene images/video/SFX, beat frames/clips, shot regeneration, and image edits through `workspace_execute_command`. Entity CRUD, plan, context, style, beat, and shot writes have dedicated tools.

## Confirmation gates

- Approving a plan requires explicit user approval.
- Replacing a Project Bible section requires confirmation.
- Reference-image analysis and generation may spend credits; respect host confirmation.
- Save and export a timeline only after review and confirmation.
