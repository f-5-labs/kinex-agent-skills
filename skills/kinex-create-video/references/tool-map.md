# Classic video tool map

| Need                 | Tool                               | Follow with                           |
| -------------------- | ---------------------------------- | ------------------------------------- |
| Find work            | `project_list`                     | `project_get`, `project_get_pipeline` |
| Start from a brief   | `project_create_from_brief`        | `project_get_pipeline`                |
| Develop story        | `script_planning_turn`             | `script_get_document`                 |
| Precise story edit   | `script_refine`                    | `script_get_current`                  |
| Plan shots           | `script_plan_shots`                | `script_generate_visual_script`       |
| Build visual script  | `script_generate_visual_script`    | `task_get`, `script_get_document`     |
| Review entities      | `visual_list_entities`             | update, re-read, then thumbnails      |
| Create scene rows    | `script_generate_storyboard_shots` | `scene_list_project`                  |
| Pick canonical media | `scene_set_active_media`           | review history first                  |

Use single-scene generation for isolated changes, batch generation for several approved scenes with shared settings, and multi-shot generation only when ordered shots must become one continuous clip. Switch to `workspace_execute_command` when the project is Agent Workspace-based.
