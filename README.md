# Kinex agent skills

[![Validate](https://github.com/f-5-labs/kinex-agent-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/f-5-labs/kinex-agent-skills/actions/workflows/validate.yml)

Plan-first image, video, and mixed-media production through [Kinex](https://kinex.studio). The bundle connects an agent to the authenticated Kinex MCP server and adds seven focused skills for Agent Workspace production, model-specific direction, image and audio prompt craft, media reuse, review, and delivery. Agent Workspace is the only production path; the old project-page skills are not shipped.

## Install

### Claude

```text
/plugin marketplace add f-5-labs/kinex-agent-skills
/plugin install kinex@kinex
```

### Codex

```bash
codex plugin marketplace add f-5-labs/kinex-agent-skills
codex plugin add kinex@kinex
```

### Gemini

```bash
gemini mcp add kinex https://api.kinex.studio/mcp --transport http
```

### Any MCP client

```json
{
  "mcpServers": {
    "kinex": {
      "type": "http",
      "url": "https://api.kinex.studio/mcp"
    }
  }
}
```

### Portable skills

```bash
npx skills add f-5-labs/kinex-agent-skills --skill '*'
```

For end-to-end project work, install all seven skills together: the specialist skills share the Agent Workspace composition reference. Individual prompt-only installs can use the published fallback linked from their skill.

The first Kinex tool call opens browser sign-in and consent. No API key needs to be copied into the agent.

## Skills

| Skill                                                         | Best for                                                                                |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`kinex-agent-workspace`](./skills/kinex-agent-workspace)     | Creating or continuing image, film, campaign, and mixed-media Agent Workspace projects. |
| [`kinex-media-library`](./skills/kinex-media-library)         | Generating, finding, and reusing standalone media and library entities.                 |
| [`kinex-review-and-export`](./skills/kinex-review-and-export) | Evidence-backed quality review, timeline assembly, render, and delivery.                |
| [`kinex-hailuo-h3`](./skills/kinex-hailuo-h3)                 | Directing H3 audiovisual shots with its own frame, reference, and sound prompt grammar. |
| [`kinex-seedance-2-5`](./skills/kinex-seedance-2-5)           | Directing Seedance references and beats, defaulting to full-quality Seedance 2.0.       |
| [`kinex-image-prompting`](./skills/kinex-image-prompting)     | Writing identity locks, hero stills, start frames, layout stills, and targeted edits.   |
| [`kinex-audio-prompting`](./skills/kinex-audio-prompting)     | Writing voice, music, sound-effect, and ambience cues as separate, cut-aware layers.    |

## Six example creative workflows

The bundle includes example requests and routing scenarios for six production shapes. These are synthetic coverage, not evidence of live generation or completed customer productions.

1. A vertical short film carried from source brief to Slate edit.
2. A neon performance music video with beat and sound planning.
3. A warm direct-to-camera UGC product ad with creator and product locks.
4. A source-grounded fashion campaign with editorial, vertical film, and creator variants.
5. A non-human mascot campaign with multi-view continuity gates.
6. A factual product explainer with claims and exact end-card copy grounded in the source.

See [creative examples](./examples/creative-prompts.md) for prompts you can adapt.

## Design principles

- Save a valid four-section Production Plan early, then re-read and reconcile its checklist at each new turn without rewriting an unchanged roadmap.
- Keep the Project Bible source-grounded; unknown surfaces and unsupported claims stay unknown.
- Keep routine planning and continuity with the main director; delegate only when the boundary adds value.
- Model production states as named variants of canonical entities and recommend locking assigned variants before generation.
- Plan and save a source-grounded floor map before defining a location; keep unknown space unresolved.
- For films, recommend lock → still → motion and keep the eight-stage checklist as advice; if the user asked to generate, generate. Advance requested scenes without waiting on unrelated assets.
- Keep shot direction, camera, edit intent, exact prompt inputs, take verdicts, and join QC reproducible rather than relying on agent memory.
- Require direction-ready motion coverage to earn its audience change, blocking, camera, cut, natural timing, and audio route; a successful record readback proves persistence, not creative or motion quality.
- Treat camera position as a visual claim: hide captions and verify foreground occlusion/scale, face visibility, background parallax, action paths, handedness, prop custody, and body-bound accessories before a sheet or frame passes.
- Generate images externally when requested, then upload and attach them as project-scoped continuity media.
- Keep hero/master plate, continuity anchor, selected preview, and generation history distinct for characters and locations.
- Treat a direct request to create a named visual deliverable as plan approval and continue execution after host confirmation instead of asking again.
- Treat stop and cancel as authoritative; never retry cancelled work without a new instruction.
- Check what already exists before generating, announce a repeat run as a numbered take, and keep earlier takes available until the user picks one.
- Treat a generated hero as unassigned until `primaryMediaId` is verified by re-reading the entity; Kinex auto-assigns only an entity's first hero.
- Treat queued work as pending, not complete.
- Re-read saved artifacts after writes and verify outputs before claiming success.
- Claim only finishing work the live Kinex surface proves; prepare an explicit external handoff for grade, sound post, interchange, or delivery formats outside it.
- Keep internal ids and tool mechanics out of the creative conversation.

## Validate

```bash
node scripts/validate.mjs
node scripts/evaluate-direction-readiness.mjs
node --test scripts/*.test.mjs
npx skills add . --list
```

The seven skills share [shot composition and pipeline handoffs](./skills/kinex-agent-workspace/references/shot-composition.md), aligned to the final merged Helios PR #196. Confirm the connected server advertises that contract before writing; merged source is not deployment proof.

Validation checks packaging, nested trace expectations, and review-record consistency. Checked-in traces are synthetic tool-call examples, not server executions. Review-record PASS means only that declared fields are consistent; creative quality, saved-state integrity, operation compilation, image dimensions, motion, and sound require their own evidence. Scenarios' prose `checks` are a manual evaluation rubric, not assertions executed by the trace checker.

Public tool reference and connection guidance live at [docs.kinex.studio/mcp](https://docs.kinex.studio/mcp).
