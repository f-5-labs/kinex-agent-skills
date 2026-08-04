---
name: kinex-review-and-export
description: Review Kinex plans, scripts, entities, scenes, generated media, and the saved timeline; repair blockers; save an approved cut; queue the final render; and monitor export to delivery. Use for quality checks, preflight reviews, choosing active media, timeline assembly, final-cut approval, export, render status, and failed-output recovery. Not for greenfield story creation or unapproved destructive timeline replacement.
---

# Review and export Kinex work

Separate building from judging. Ground each verdict in current Kinex artifacts, then render only a reviewed saved cut.

## Run the review ladder

Read the smallest relevant evidence: project and pipeline, classic script or Agent Workspace plan and context, look-bible entities, scenes and media history, project tasks, then `timeline_get` and optionally `workspace_preview_timeline`.

At each stage return `pass`, `revise`, or `block`, plus the evidence and smallest corrective action.

## Repair before assembly

- Fix story problems in the story layer.
- Fix identity or continuity before broad regeneration.
- Regenerate only affected media.
- Review history before `scene_set_active_media`.
- Poll repair tasks and re-read affected artifacts.

## Save and export

1. Load `timeline_get` immediately before editing and preserve its latest `sequenceId`.
2. Confirm before `timeline_save`, reload, and verify the saved structure.
3. Preview when human visual review helps.
4. Confirm the final render, call `timeline_export`, and poll `timeline_export_status`.
5. Deliver only the canonical final URL after completion.

On failure, report the failing stage and repair path; do not blindly restart an expensive render. Never call queued work complete or hide unresolved risks.

Read [tool map](references/tool-map.md) for the export state machine.
