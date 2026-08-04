# Review and export state machine

| Stage      | Evidence                                            | Common blockers                                 |
| ---------- | --------------------------------------------------- | ----------------------------------------------- |
| Intent     | `project_get`, `project_get_pipeline`               | Wrong format, duration, or unfinished stage     |
| Story      | `script_get_document` or `plan_get` + `context_get` | Structural drift or canon conflict              |
| Look bible | `visual_list_entities` or `workspace_list_entities` | Missing reference or stray entity               |
| Scenes     | `scene_list_project`, `scene_get`                   | Wrong order, stale prompt, missing active media |
| Media      | `scene_get_media_history`, `task_get`               | Failed task or unreviewed variant               |
| Cut        | `timeline_get`, `workspace_preview_timeline`        | Stale sequence id, missing clip, timing issue   |

States: not ready → repair; ready for save → load latest; saved → verify; verified → confirm export; queued/rendering → poll; complete → deliver URL; failed → diagnose smallest repair.
