# Image prompting tool map

## Discover before writing

- Read the live image operation and its actual fields before drafting. Aspect ratio, resolution, output count, seed, negative prompt, and reference slots are structured inputs; the prose prompt controls none of them.
- Confirm reference-input shape from the returned schema. Reference lists, a separate style reference, and text-only operations are not interchangeable, and an operation that accepts no source image cannot honour an identity reference.

## Route and execute

- Project-scoped stills, entity heroes, start frames, and edits: `workspace_execute_command` with the discovered operation.
- Standalone or reusable library images: `library_generate_image` through `$kinex-media-library`.
- Project canon and approval: `plan_get`, `plan_save`, `context_get`.
- Existing evidence: `shot_get`, `workspace_read_entity`, `media_list_project`, `workspace_preview_entity`.

When the user requests built-in ImageGen or external stills, keep that route through generation, visual inspection, actual pixel-dimension verification, project upload, attach, and `shot_get`/entity readback. Use the live supported target slot; never substitute library upload or a Kinex generation call.

## Review before reporting

Poll `task_get`, re-read the affected entity or shot, and inspect every persisted output before calling the image done. A queued task is not an image.

For a claimed camera change, review the image with captions and diagrams hidden. Compare foreground occlusion and scale, near/far face visibility, background parallax, action-path readability, handedness, prop ownership, and body-bound accessories against the planned floor-map station. Labels and focal-length metadata are not visual evidence. If the failed image is still current, withdraw its PASS and repair that selection only within the user's authorized scope; retain rejected media in history.

Check what already exists before generating: `workspace_read_entity` for an entity hero, `media_list_project` and `task_get` for a shot's still. Announce a repeat run as a numbered take using the prior-take count Kinex reports on the queued task, keep earlier takes available, and name the one control that changed for this take. Do not queue two generations of the same target in one turn.
