# Media and library boundaries

| Object                  | Read                                                      | Create or update                                                           | Remove                         |
| ----------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------ |
| Standalone media        | `library_list_media`, `task_list_library`                 | `library_upload_media`, `library_generate_image`, `library_generate_video` | `media_archive` when available |
| Reusable library entity | `library_list_entities`                                   | `library_create_entity`, `library_update_entity`                           | `library_delete_entity`        |
| Agent Workspace entity  | `workspace_list_entities`, `workspace_read_entity`        | `workspace_define_entity`, `workspace_update_entity`                       | Follow live surface            |
| Existing project media  | `media_list_project`, `media_get`, `media_get_public_url` | Generate through project tools                                             | `media_archive`                |

Reuse loop: search, retain the id, resolve the canonical URL only when needed, reuse the item as a reference, and avoid duplicate uploads or entities.

Model discovery loop: pick the exact image operation from the current library/model notes, preserve its scalar/reference fields, call `library_generate_image`, poll `task_get`, then re-list the library and inspect every persisted output.
