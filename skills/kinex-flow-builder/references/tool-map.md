# Flow Builder tool map

Use only tools currently advertised by the connected Kinex server. Input schemas and returned ids win over these summaries.

| Job | Public tools | Boundary |
| --- | --- | --- |
| Find or create a board | `flow_list`, `flow_create` | Normal editable Flows only |
| Read board and plan | `flow_get`, `flow_plan_get` | Read before graph writes |
| Save the shared plan | `flow_plan_save` | Pass the current `graphRevision` as `expectedRevision`; automatic only for a newly created empty board; an existing plan changes only with explicit user direction |
| Discover graph vocabulary | `flow_capabilities_get` | Source of node types, instance-aware ports, model-specific AI Text modalities, media models, fields, roles, and current limits |
| Add or patch a node | `flow_node_add`, `flow_node_update` | Prompts, text, scripts, and supported model settings are caller-editable; generated output artifacts are not |
| Bind real input media | `flow_media_input_set` | Verifies workspace ownership, active media, modality, and backing object |
| Connect typed ports | `flow_nodes_connect` | Use returned node ids and discovered source/target port ids |
| Remove graph parts | `flow_edge_remove`, `flow_node_remove` | Revisioned repair only; the Plan node is protected |
| Validate | `flow_validate` | Does not start generation |
| Run | `flow_run_graph`, `flow_run_node` | Explicit request plus a caller-stable idempotency `requestKey` |
| Poll or stop | `flow_run_get`, `flow_run_cancel` | Never call a pending run complete; confirm cancellation |
| Inspect persisted outputs | `flow_list_media` | Flow-owned outputs, not workspace upload discovery |
| Manage cover or delete | `flow_update_thumbnail`, `flow_delete` | Use only when explicitly requested; deletion is destructive |

## Workspace inputs

`library_list_media` may locate an existing workspace upload. `library_upload_media` may upload a file the user supplied for this Flow. Neither authorizes standalone library generation, reusable-entity work, or a broader library cleanup.

Add an empty Upload Media node, then bind the chosen item with `flow_media_input_set` rather than patching a URL or storage key into node config. Re-read with `flow_get`, then call `flow_capabilities_get` with the static node's saved config because its output port is instance-aware: image, video, and audio assets expose different modalities.

Node add/update, typed connect, and media binding use optimistic concurrency. Start with the `graphRevision` from `flow_get`, pass it as `expectedRevision`, then carry the canonical graph and new revision returned by each successful mutation into the next write. Re-read on a conflict, when saved instance config is needed for port discovery, and for the final readback.

Plan saves use the same optimistic-concurrency contract with the `graphRevision` returned by `flow_plan_get` or `flow_get`. A static text node may receive caller-supplied text through its discovered config. For generated nodes, never add or replace `outputBundle.artifacts`; only `outputBundle.selectedIndex` may be patched after the server has written the bundle.

`flow.ai.llm` is the multimodal AI Text node. Resolve it once to choose a live `modelId`, then call `flow_capabilities_get` again with that saved config before wiring `images` or `videos`; their `supported` flags vary by model. Its text output can feed a media generator's prompt input. Name every upstream source clearly and use the source node's lowercase kebab-case label as the downstream mention handle (`Style video` becomes `@style-video`). Input port ids such as `videos`, `images`, or `prompt` are not mention handles. Keep source labels unique so duplicate-token suffixes are unnecessary.

`flow_get` also reports the active native board run. Do not start a duplicate run when matching work is already active; use `flow_run_get` with the known run id. Starting graph or node execution also requires the OAuth grant to include `generation:queue`.

## Not part of this skill

- Agent Workspace, Project Bible, beats, shots, timelines, or Agent Workspace export.
- Flow templates, template runs, template publishing, recipes, or admin review.
- Standalone image, video, audio, or reusable-entity generation in the workspace library.
- Specialist creative-production workflows or unpublished capabilities.

When a required public Flow tool is absent, do not substitute an internal in-app tool name. Continue with safe read-only or build-only work that the live surface supports and report the missing operation.
