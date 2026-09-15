---
name: kinex-agent-workspace
description: Create or continue Kinex Agent Workspace projects for still images, films, scenes, campaigns, or mixed-media production through a source-grounded Production Plan and Project Bible, variant-aware entities, optional beats and shots, external or Kinex generation, tasks, and interactive previews. Use when the user asks for a new agent project, plan-first creative work, project-scoped imagery, entity continuity, or Agent Workspace production. Not for standalone library assets or export-only requests.
---

# Direct Kinex Agent Workspace

Use the Agent Workspace as a media-agnostic collaborative production system: one living roadmap, one source-grounded canon, and a recommended path from planning through design, generation, review, and delivery. A project may contain only images and entities, or may grow into beats, shots, scenes, video, and a timeline. Stay in Agent Workspace when a deliverable is a film; do not leave this skill for a separate script pipeline. Apply the film production pipeline only to temporal work; do not burden image-only projects with film artifacts. Keep routine direction, canonical definitions, and cross-stage continuity with the main agent. Delegate only when the user requests it or a specialist adds clear execution or deep-review value without fragmenting context.

Empower the user without manufacturing readiness. A direct generation request authorizes the requested execution and any narrow, source-faithful direction repair needed immediately before it; it does not turn a weak card, successful save, or queued task into a creative pass. Repair a known `REVISE` issue without asking for another approval. Hold only the affected shot when truthful execution is `BLOCKED` by missing source, impossible geography, unsupported dialogue ownership, or an unavailable required control. Asset-lock gaps remain advice unless the user asked to stop on them.

## Connect and bootstrap

1. If Kinex tools are absent, do not pretend project creation was attempted. State that the MCP dependency is unavailable, ask the user to connect or reauthorize Kinex, and tell them a new task may be required for the tool catalog to load.
2. Call `workspace_get_current` before creating work. Call `workspace_list` when the user asks to choose a workspace or the destination is ambiguous. If no workspace was named, use the active workspace when it is the default or the only membership; otherwise ask one concise selection question. If the chosen workspace is not active, stop before writing and ask the user to reconnect Kinex to that workspace; never silently use another workspace.
3. For an existing project, resolve it with `project_list` or `workspace_preview_projects`, then call `project_get`.
4. For a new Agent Workspace project, call `project_create_from_brief` with the active `workspaceId` and `workspaceMode: agent`, then call `project_get`.
5. Continue only after the returned project has `workflowType: agent`, `agentWorkspace: true`, or `formatConfig.agentWorkspaceV2: true`. Treat `formatConfig.agentWorkspace` as a legacy flag only.

“Create an Agent Workspace” means create an Agent Workspace-mode project inside an existing Kinex workspace. Create a new team or organization only when the user explicitly asks for one.

## Start plan-first

1. Read the immediate brief or supplied source plus `plan_get` and `context_get`.
2. Within the first few useful actions, save a substantive draft with `plan_save`. Use exactly `## Direction`, `## Assumptions and Open Questions`, `## Milestones`, and `## Checklist`; write checklist rows as `- [ ] (stable-step-id) concise outcome` (`[x]` complete, `[-]` blocked).
3. When a story depends on a real geography, culture, era, community, institution, or work practice, complete the research-and-design pass before drafting an image or video prompt. Keep durable sourced facts in the Project Bible, label production choices as proposed, and preserve unknowns as unresolved. This is normal prompt preparation, not another approval gate: after the focused pass, continue a direct generation request in the same turn.
4. Put durable, sourced creative facts in the Project Bible with `context_update_section`; never use it for speculative options, unsupported product claims, or temporary tasks.
5. At the start of every later user turn, re-read the plan and reconcile its checklist with the latest direction before material action. Retain relevant outcomes, remove superseded work, and reorder priorities. Save only when the shared roadmap materially changes; do not create a confirmation loop by rewriting an unchanged plan.
6. Re-read each saved record after writing it. Use the latest `etag` as `expectedEtag` when replacing an existing plan.

The Production Plan is the living roadmap. The Project Bible is the durable creative canon. Do not create a shadow plan in chat.

## Recommend lock, still, then motion

Lock → still → motion is advice, not a product gate. Open checklist rows, unlocked assets, and incomplete film stages do not refuse generation. If the user asked to create, generate, render, make, produce, queue, start, or proceed, close any known direction-readiness defect in scope and then generate in the same turn. Name advisory locks and gaps without turning them into approval theatre.

- Prefer a useful Production Plan and sourced Project Bible facts before spending on media. If they asked to generate first, save a draft and generate.
- Prefer locking recurring identities and assigned variants before start frames or motion. Recommend the gap; do not wait for a library or scene-readiness row to close.
- Treat an unambiguous current-turn instruction to create, generate, render, make, produce, queue, start, or proceed with a named video, clip, scene, shot, storyboard, or frame as explicit approval of the current plan. Save it as approved with `approvalConfirmed: true`, then continue into the requested execution in the same turn. Questions, hypotheticals, and negative instructions are not approval.
- Distinguish creative plan approval from the host's confirmation of a pending MCP call. After the host approves a suspended `plan_save` or generation call, resume that exact call and continue; do not request creative approval again or restart planning solely because the tool resumed.
- Treat stop or cancel as authoritative. Cancel matching queued work with `task_cancel` when requested and never retry a cancelled task unless the user starts it again.
- Inspect every supplied source before making source-dependent decisions.
- Preserve what a reference proves; keep unseen construction, unsupported claims, and unknown identity details unknown.
- Define one canonical entity per identity. Represent wardrobe, condition, time, angle, or prop-reveal states as named variants, not duplicate identities.
- Before `workspace_define_entity` creates a location, save a source-grounded floor map in the Production Plan. Include entrances, exits, zones, anchor landmarks, relative distances, action paths, camera sides, working axis, occlusions, elevation, and motivated light; mark unsupported space as unresolved or a design proposal.
- Choose the lightest sufficient reference artifact from downstream use. A multi-view sheet is the default for a new recurring character; a single hero is an explicit one-off or opt-out, not the automatic continuity lock.
- Treat `status: locked` as a claim, not proof. A locked variant should have reviewed media distinct from both the entity's `primaryMediaId` and every sibling locked variant's media.
- Treat exact copy, dialogue, product facts, geography, screen direction, and reference roles as continuity constraints.
- Treat queued work as pending until the task completes and the artifact is re-read. Never fabricate a completed clip, still, or lock.

## Know what already exists before you generate

Generating is still the user's call: an existing asset never refuses a new one. But a repeat run that arrives silently leaves the user with duplicate heroes and clips and no way to tell which one is current.

- Look before generating. Read the entity with `workspace_read_entity` before a hero; check `media_list_project` and `task_get` before a shot's still or clip.
- Announce a repeat as a numbered take rather than quietly adding another asset. Kinex reports prior takes on the queued task, so use that number instead of guessing one.
- Earlier takes stay available. Do not delete them and do not imply one replaced another until the user picks the take they want.
- When iterating, say what changed for this take. One changed control per take.
- Queueing two generations of the same target in one turn is a mistake, not thoroughness. Poll the existing task instead.

## Build the production

- Style: `style_list`, then one of `style_set_from_catalog`, `style_seed_from_catalog`, `style_set_custom`, or `style_set_from_image`.
- Entities: list before creating, then use `workspace_read_entity`, `workspace_define_entity`, and `workspace_update_entity`. Keep named variants in entity attributes and assign only relevant variants to shots. Prefer locked media when it exists.
- Structure when the deliverable needs temporal coverage: `beat_list`, `beat_define`, `beat_update`, then `shot_list`, `shot_get`, `shot_define`, `shot_update`. Do not invent beats or shots for an image-only project.
- For scenes or films, write preliminary shot cards in the Production Plan after the breakdown, reconcile scene-to-assets coverage and required variants, and recommend locking the needed assets. Run the direction-readiness gate across the proposed coverage before motion: repair `REVISE`, hold only `BLOCKED`, and do not confuse a field readback with a directing verdict. Define or finalize Kinex shots with `shot_define` or `shot_update` using the shared nested composition; read each affected card with `shot_get`. Advance a requested scene without waiting for unrelated project assets or an open checklist row.
- Kinex generation: choose a current model from the live operation notes for the shot, then use `workspace_execute_command` for requested execution such as entity heroes, scene or beat media, sound effects, and image edits.
- External generation: when the user names host image generation or wants generation outside Kinex, generate there, call `workspace_upload_external_media`, then bind the project-scoped result with `workspace_attach_external_media`. Use target kind `entity` for a hero or identity anchor, `entity_variant` with the exact canonical entity and `variantKey` for a named state, or `shot` for a start/end frame. Never author `status` or media lock fields through `workspace_update_entity`.
- Progress: retain task ids internally, poll `task_get`, then re-read the affected object and its generation history.

Do not invent classic `script_*`, `visual_*`, `scene_*`, or `generation_*` wizard tools. Use `workspace_*`, `plan_*`, `context_*`, `beat_*`, and `shot_*` instead.

## Direct the shot, not just the prompt

Prefer planning assets before shots. Stress-test identity locks across useful views, lighting, poses, and ensembles; create only the variants the production needs. For film work, give every shot an identity-and-asset lane, direction lane, camera lane, and edit lane; when generation is requested, repair a known lane defect in scope before invoking motion. Specify active cast and reference roles, first-frame occupancy and geography, observable framing, camera behavior, timed action, performance beats, physical behavior, lighting, exact audio or copy constraints, and the intended join. Keep unused references and unrelated scene history out of the prompt.

Choose the audience information before choosing the angle. Map each camera station against the action axis and the prop paths that must remain visible. A caption, compass label, crop, lens change, or head turn does not prove that the generated viewpoint changed. Before a camera sheet or start frame passes, inspect it with captions hidden and verify the intended foreground occlusion, near/far scale, face visibility, and background perspective. Use identity and location sheets to rebuild a failed viewpoint; do not let a rejected frontal shot keep anchoring the composition.

Treat one shot record as one coherent generated clip, not one storyboard panel, camera angle, cut, gesture, or reaction. Its sequence sheet and video prompt may direct intentional internal cuts, micro-actions, reactions, and exact dialogue while the record retains the complete cast, variants, props, audio route, opening state, and outgoing handoff. Choose the board size from the event's complexity; panel count never dictates record count or edit count, and an unsupported board-size enum belongs in the plan rather than an invented tool field. A sequence sheet is a typed generation reference, never literal frame zero.

Prefer one coherent clip unless the event exceeds the live operation, combines unrelated coverage, or cannot retain continuity. Use a useful 10–15-second window when the selected operation advertises it and the action/dialogue naturally needs it; do not pad a short exchange, rush speech, or compress a long proof into a nominal 30–45-second clip. Every record split should earn its place through an audience-information change, a performance turn, a necessary action phase, a feasibility boundary, or a source-motivated transition. Shot count is never a quality target; audit repeated setups, tiny units, natural speech timing, and new multi-speaker or playback routes as fragmentation and audio debt before adding coverage. Preserve gaze, screen direction, complete prop custody, wardrobe, weather, and performance state across internal and external cuts. Keep a take ledger with the exact operation, structured inputs, active references, prompt, one changed control, result, and verdict. If repeated attempts exhaust the agreed retry budget, simplify or split the clip instead of adding prompt bulk.

Build and review the edit while generation proceeds. Missing coverage is a planning problem; do not conceal it with broad regeneration.

## Review with the user

For character and location review, keep four states distinct: selected preview, hero or master plate (`primaryMediaId`), continuity anchor (`identityAnchorMediaItemId`), and generation history. List entity image history with `media_list_project`, using the entity id as `sourceId` and its matching entity table as `sourceTable`; use `workspace_update_entity` to promote an existing item or clear an anchor. An upload may become the hero, the anchor, or both only when that is intentional.

A generated hero is not an assigned hero. Kinex auto-assigns the first hero when an entity has none; every later replacement stays a deliberate act. Assign the take the user chose with `workspace_update_entity`, then re-read the entity and compare ids to confirm `primaryMediaId` points at that take — verify the assignment rather than trusting the write.

Use `media_list_project` and `task_get` for shot alternatives. Use `workspace_preview_entity` for identity and look review and `workspace_preview_timeline` for the current cut. Keep the conversation about creative outcomes, decisions, evidence, and blockers—not ids or tool mechanics.

When visual evidence contradicts a prior PASS, withdraw that PASS immediately. Keep the failed media in history, but do not describe it as the current approved hero, anchor, start frame, or selected take. When the user's scope and live surface support selection repair, promote a valid replacement or clear the failed role and re-read it; otherwise record the mismatch and exact required action without claiming the selection changed.

Hand final assembly and rendering to `$kinex-review-and-export` only when the project needs a timeline or final render.

Read [tool map](references/tool-map.md) for command families and confirmation boundaries.
Read [character and location method](references/entity-and-location-method.md) when choosing, generating, or reviewing recurring identity and environment locks.
Read [grounded production design](references/grounded-production-design.md) before prompting a story whose real-world setting or cultural context carries dramatic or visual meaning.
Read [production method](references/production-method.md) when designing entities, variants, performance, shot prompts, or iteration passes.
Read [scene production method](references/scene-production-method.md) for any project that contains scenes, motion, an edit, or final delivery.
Read [direction readiness](references/direction-readiness.md) before finalizing motion coverage or invoking motion generation for a scene.
Read [shared shot composition](references/shot-composition.md) for shot reads, partial writes, ordering, deletion, and downstream prompt/audio handoffs.
