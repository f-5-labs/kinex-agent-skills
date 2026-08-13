---
name: kinex-review-and-export
description: Review Kinex plans, scripts, entities, scenes, generated media, and the saved timeline; repair blockers; save an approved cut; queue the final render; and monitor export to delivery. Use for quality checks, preflight reviews, choosing active media, timeline assembly, final-cut approval, export, render status, and failed-output recovery. Not for greenfield story creation or unapproved destructive timeline replacement.
---

# Review and export Kinex work

Separate building from judging. Ground each verdict in current Kinex artifacts, then render only a reviewed saved cut.

## Run the review ladder

Read the smallest relevant evidence: project and pipeline, classic script or Agent Workspace plan and context, look-bible entities, entity and scene generation histories, project tasks, then `timeline_get` and optionally `workspace_preview_timeline`.

At each stage return `pass`, `revise`, or `block`, plus the evidence and smallest corrective action.

For films, keep generated, accepted, active, and selected states distinct. The current active-media field is not a separate editorial-select state; record select verdicts in the Production Plan until the surface exposes one. Accept a take only when identity and location hold, artifacts are tolerable or explicitly repairable, camera behavior matches the plan, performance and lip sync serve the scene, and it can join its neighbours. Retain the exact prompt and inputs for every selected take.

## Repair before assembly

- Fix story problems in the story layer.
- Fix identity or continuity before broad regeneration. Confirm that every shot-assigned entity variant has its required locked project media.
- For Agent Workspace characters and locations, distinguish the hero/master plate, continuity anchor, selected preview, and history. Use `media_list_project` with entity source filters; do not treat preview selection as a lock change.
- Regenerate only affected media.
- Review history before `scene_set_active_media`; externally uploaded project media is valid only after it is attached to the intended entity or shot slot.
- Poll repair tasks and re-read affected artifacts.

Review every join for eyelines, action axis, wardrobe, hair, props, geography, light, palette, movement tempo, performance carryover, dialogue, ambience, and sound tails. Treat a missing cutaway or connective shot as a coverage blocker, not an invitation to regenerate unrelated material.

Close visible artifact repairs before global color treatment. Treat generated audio as production sound and timing evidence unless the user has approved it as final; verify dialogue cleanliness, ambience continuity, music and voice rights, target loudness, and any required stems or subtitles before delivery.

## Save and export

1. Load `timeline_get` immediately before editing and preserve its latest `sequenceId`.
2. Assemble first, then review rhythm and coverage, make fine trims, and declare picture lock only when runtime and joins are approved.
3. Confirm before `timeline_save`, reload, and verify the saved structure.
4. Preview when human visual review helps.
5. Confirm the final render, call `timeline_export`, and poll `timeline_export_status`.
6. Deliver only the canonical final URL after completion.

Do not imply that Kinex created professional grade, sound post, stems, subtitles, DCP, or interchange files unless the current project and live surface prove it. When those steps happen elsewhere, deliver a precise handoff and keep the Kinex reproducibility package: plan, canon, entity locks, selected media, exact prompts and inputs, generation history, saved timeline, export records, and documented rights.

On failure, report the failing stage and repair path; do not blindly restart an expensive render. Never call queued work complete or hide unresolved risks.

Read [tool map](references/tool-map.md) for the export state machine.
