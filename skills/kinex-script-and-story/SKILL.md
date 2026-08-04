---
name: kinex-script-and-story
description: Develop, import, inspect, and revise classic Kinex scripts, then produce an approved shot plan and visual script without prematurely generating media. Use for screenplay writing, outlines, story structure, dialogue or narration changes, script imports, continuity passes, shot planning, and visual-script preparation. Not for full production, Agent Workspace beat editing, library generation, or final export.
---

# Write scripts and story in Kinex

Shape the canonical story artifact before scenes or expensive generation. Preserve the user's language and creative register unless asked to change them.

## Orient and route

Resolve the project, then read `project_get`, `project_get_pipeline`, `script_get_current`, and `script_get_document`. If the project is Agent Workspace-based, use `$kinex-agent-workspace` so the shared Production Plan and Project Bible remain canonical.

## Choose the narrowest write

- `script_planning_turn`: ideation, outlining, structure, continuity, or broad rewriting.
- `script_refine`: one explicit revision to the selected script.
- `script_import`: a complete supplied screenplay; confirm before selection.
- `script_update_document`: only when complete replacement markdown already exists.

Re-read after every write and verify the requested change landed.

## Apply the editorial gate

Review intent, audience, structure, stakes, dialogue versus narration, duration, platform fit, cast and locations, and visual continuity risks. Return `pass`, `revise`, or `block` with evidence from the current artifact. Fix blockers before shot planning.

## Plan production

Run `script_plan_shots`, then `script_generate_visual_script`. Poll the task, re-read `script_get_document`, and compare the visual plan with the approved story. If it drifted, repair the source story or plan and repeat.

Stop after the approved plan unless the user also requested production. For full production, use `$kinex-create-video`.

Read [tool map](references/tool-map.md) for exact write boundaries.
