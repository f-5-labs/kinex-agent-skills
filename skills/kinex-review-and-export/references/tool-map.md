# Review and export state machine

| Stage      | Evidence                                            | Common blockers                                 |
| ---------- | --------------------------------------------------- | ----------------------------------------------- |
| Intent     | `project_get`                                       | Wrong format, duration, or unfinished stage     |
| Story      | `plan_get` + `context_get`                          | Structural drift or canon conflict              |
| Entities   | `workspace_list_entities`; `media_list_project` for entity history | Missing hero/master plate, anchor, or stray entity |
| Shots      | `beat_list`, `shot_list`, `shot_get`                            | Wrong coverage, stale direction, missing assignment |
| Media      | `media_list_project`, `task_get`, `workspace_preview_entity` | Failed task or unreviewed alternative           |
| Cut        | `timeline_get`, `workspace_preview_timeline`        | Stale sequence id, missing clip, timing issue   |

States: not ready → repair; ready for save → load latest; saved → verify; verified → export when authorized; queued/rendering → poll; complete → deliver URL; failed → diagnose smallest repair.

Camera-sheet and start-frame review uses the actual media returned by project history or preview. Hide captions before comparing the pixels with the card and floor map. A label saying OTS/reverse is not a camera proof; require changed foreground mask and scale, face visibility, background parallax, and complete hand/prop/accessory continuity. Withdraw any contradicted PASS and do not leave a rejected image described as current or approved.
