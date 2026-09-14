# Audio prompting tool map

## Discover before writing

- Read the live audio operation and its actual fields before drafting. Duration, sample rate, channel layout, format, and any voice or reference slots are structured inputs; the prose prompt controls none of them.
- Confirm which audio jobs the live surface exposes. Do not assume a voice, music, sound-effect, or ambience operation exists because another surface has one, and do not fold two jobs into one call because only one operation was returned — say what is unavailable.

## Route and execute

- Project-scoped voice, music, sound effects, and ambience: `workspace_execute_command` with the discovered operation, one layer per call.
- Standalone or reusable audio: `$kinex-media-library`.
- Project canon and approval: `plan_get`, `plan_save`, `context_get`, `context_update_section`. Keep a recurring character's stored vocal identity in the Project Bible so every scene reuses the same wording.
- Existing evidence: `media_list_project`, `shot_list`, `shot_get`, `beat_list`.
- Shot sound contract: `shot_update` with nested `audio`; re-read `shot_get` after changing intent. Generation remains a separate authorized operation.

## Review before reporting

Poll `task_get`, re-read the affected shot or beat, and listen to the result against picture before calling the cue done. A queued task is not a cue.

Check what already exists before generating: `media_list_project` and `task_get` for a shot's existing audio. Announce a repeat run as a numbered take using the prior-take count Kinex reports on the queued task, keep earlier takes available, and name the one control that changed for this take. Do not queue two generations of the same target in one turn.

Hand final mixing, level balance, render, and delivery to `$kinex-review-and-export`. This skill writes cues; it does not assemble or ship them.
