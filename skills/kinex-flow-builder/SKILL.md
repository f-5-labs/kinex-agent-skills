---
name: kinex-flow-builder
description: Build, inspect, repair, validate, and optionally run normal editable Kinex Flow boards through typed nodes, live ports, model-aware multimodal LLM analysis, source-node mentions, and real workspace media references. Use for new or existing Flow canvases and graph workflows. Not for Agent Workspace production, standalone library generation, templates, publishing, or specialized creative-direction work.
---

# Build Kinex Flows

Turn the user's outcome into the smallest useful editable graph. Treat the live Kinex capability response and every returned board revision as authoritative. Do not infer a provider's current models, prices, limits, fields, or reference roles from memory.

This skill owns graph shape and persistence for ordinary Flow boards. Agent Workspace production, standalone generation, template workflows, publishing, and specialized creative direction are outside its scope. Use only the public Flow contract plus workspace upload/list operations needed to bind user-supplied media.

## Inspect before writing

1. Resolve the target with `flow_list`, or create the requested board with `flow_create`.
2. Read the complete current board with `flow_get`. Preserve useful node ids, labels, settings, media bindings, and edges on an existing board.
3. Read the shared board plan with `flow_plan_get`. For a newly created empty Flow with no plan, save a concise plan with `flow_plan_save` before graph construction, passing the returned `graphRevision` as `expectedRevision`. On an existing board, preserve the shared plan unless the user explicitly requests or approves changing it. Keep any saved plan about the outcome, inputs, graph shape, validation criteria, and suggested run order, not tool mechanics.
4. Inspect each supplied attachment or reference enough to know its modality, purpose, and transfer intent. Do not silently treat a motion reference as a first frame or a subject still as a style reference.
5. Call `flow_capabilities_get` before selecting node types, port ids, models, or capability-sensitive config. Re-run discovery when the server rejects a remembered choice or the requested mode changes.

For an ambiguous brief, ask only for information that changes the graph materially. If the user grants autonomy, make reasonable choices from the live catalog and state them briefly.

## Build the smallest graph

- Every node must have a clear job. Prefer a direct source-to-generation chain over speculative branches and duplicate helpers.
- Add nodes with `flow_node_add`, update existing nodes with `flow_node_update`, and connect only compatible discovered ports with `flow_nodes_connect`.
- Remove an obsolete edge with `flow_edge_remove` before rewiring a single-capacity input. Use `flow_node_remove` only when the user-requested repair makes a production node obsolete; it also removes incident edges, while the canonical Plan node remains protected.
- For `flow_node_add`, `flow_node_update`, `flow_nodes_connect`, and `flow_media_input_set`, start with the `graphRevision` from `flow_get`, then use the canonical graph and new revision returned by each successful mutation for the next write. Re-read on a revision conflict, before resolving ports whose shape depends on saved instance config, and for the final readback. Do not blindly retry a stale graph.
- Use the exact node ids returned by writes. Never invent ids for existing nodes or assume a write succeeded.
- Keep labels specific to the user's outcome. Keep prompts and settings source-grounded and limited to the requested Flow.
- Treat each source node's current label as its mention identity everywhere downstream. Give every source a concise unique label before writing prompts, then mention its lowercase kebab-case handle: a source labelled `Style video` is `@style-video`, not `@videos` or the target connector label. Duplicate source labels receive stable numeric suffixes, so avoid duplicates and re-read after renaming. Never invent a mention from an input-port name.
- Treat board-editable user input as valid MCP input. Supply prompts, text, scripts, and supported model settings through discovered node config on `flow_node_add` or `flow_node_update`; for a static text node, use the discovered text modality and text field. Do not confuse caller-authored input with generated output.
- Use actual media records for references. For user-supplied local image or video files, `library_upload_media` may prepare a workspace asset; `library_list_media` may locate an already uploaded asset. Add an Upload Media node without media config, then bind it with `flow_media_input_set` and re-read the board. Do not put a guessed URL or storage key directly into node config.
- Never supply or replace generated `outputBundle.artifacts`. Those outputs are server-owned. After a server-written multi-sample result exists, `flow_node_update` may change only its `outputBundle.selectedIndex` to select the downstream winner.
- `flow_list_media` lists output media owned by the Flow. It is not workspace-upload discovery and must not substitute for `library_list_media`.
- After binding a static asset, call `flow_capabilities_get` with that node's type and saved config to resolve its instance-aware ports. A video upload must expose a video output before it can feed a video-reference port; a subject still must expose an image output before it can feed an image-reference port.
- Connect a source according to the role advertised for the target port. `startFrame`, image reference, reference video, and reference audio are different controls.

For an existing board, change only what the request requires. Validate before repairing an unclear failure, preserve unaffected branches, and do not remove or replace nodes without a reason grounded in the current board.

## Use the LLM node for multimodal analysis

Use `flow.ai.llm` when the workflow needs a model to inspect connected text, images, or video and produce text for a later node. It is the normal Flow reasoning node; do not invent a separate media-analysis node when the LLM exposes the required live modalities.

1. Call `flow_capabilities_get` for `flow.ai.llm` and the intended saved `modelId`. Its returned `supported` flags on `prompt`, `context`, `images`, and `videos` are authoritative. Model menus and modality support can change; never infer video understanding from a model name.
2. Add or update the LLM with that supported `modelId`, then re-run capability discovery with the saved config before connecting media. A model change can enable or invalidate image/video ports.
3. Connect one instruction source to `prompt`, optional supporting text sources to `context`, image sources to `images`, and video sources to `videos` only when those exact live ports are supported. Respect returned connection limits.
4. Write the instruction using the connected source-node handles, for example: `Analyze @style-video for motion, timing, camera, and texture. Preserve the identity and silhouette in @subject-image. Follow @creative-instructions. Return only a production-ready video prompt.` The handles come from source labels; `images`, `videos`, and `prompt` remain connector ids, not mention names.
5. Connect the LLM's text output to the downstream generator's discovered prompt port. When visual fidelity matters, also connect the original subject image and style video directly to the generator's compatible reference ports. The analysis augments real references; it does not replace them.
6. Validate after every model or media-modality change. If a saved edge is now unsupported, choose a live model that accepts it or remove the edge deliberately before proceeding.

Read [multimodal LLM example](references/multimodal-ai-text.md) for the full reusable graph, mention rules, and run proof.

## Validate and re-read

Call `flow_validate` after construction or repair. Check both its graph/model issues and the separate availability result for every bound media input. Resolve every issue that blocks the requested workflow, then validate again. If a requested connection or field is unsupported:

- report the exact missing capability or incompatible modality;
- offer a supported graph shape only when the live catalog proves it;
- leave unrelated valid work intact; and
- never claim approximate feature parity, exact motion transfer, or ComfyUI-workflow fidelity.

Finish build-only work by calling `flow_get` again and checking that the saved graph, bindings, typed edges, and shared plan match the intended workflow. A successful mutation response is not a full-board readback.

## Keep build and run separate

Do not start generation merely because the board validates. Run only when the user clearly asks to generate or execute.

- Validate immediately before execution.
- Check the active-run summary from `flow_get`. If the same work is already active, poll it instead of starting a duplicate.
- Use `flow_run_graph` for the whole board and `flow_run_node` only for the requested node and its required upstream closure. Supply a fresh caller-stable `requestKey` for the intended run and reuse that same key if transport failure makes a retry necessary; changing inputs under one key is a conflict.
- Flow execution requires the connected OAuth grant to include `generation:queue`. If that scope is missing, report the authorization requirement instead of treating the board as invalid.
- Poll the returned run with `flow_run_get`. Treat queued, pending, or running work as in progress, not output.
- If the user asks to stop an active run, call `flow_run_cancel`, then confirm the terminal status with `flow_run_get`. Never restart it without a new request.
- When a run succeeds, inspect the run's node results and use `flow_list_media` when persisted Flow-owned output inventory is needed. Report only outputs the live responses prove.
- If polling cannot reach a terminal result in the available turn, return the run as in progress with its known status and next check. Do not fabricate a URL or completed asset.

If run tools or required capabilities are missing from the connected Kinex server, the board may still be built and validated. State precisely which requested execution step remains unavailable.

## Example: motion reference plus subject still

For “use this movement clip to animate this subject photo,” do not promise exact motion cloning or node-for-node ComfyUI parity.

1. Inspect or upload the movement video and subject image as two distinct workspace media records.
2. Read or create the Flow and its shared plan.
3. Discover a video node whose current model exposes both a compatible image-reference role and a video-reference role.
4. Add two empty Upload Media nodes and the discovered video node, carrying forward each mutation's returned revision. Bind the image and video to their own nodes with separate `flow_media_input_set` calls.
5. Re-read when each saved binding must supply instance config, resolve the static node's actual output with `flow_capabilities_get`, then connect the image and video outputs to their corresponding discovered target ports using mutation-returned revisions.
6. Validate and re-read. Stop there unless the user asked to run; if they did, follow the bounded run lifecycle above.

Read [tool map](references/tool-map.md) for the public Flow command families and boundary notes.
