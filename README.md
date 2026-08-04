# Kinex agent skills

[![Validate](https://github.com/f-5-labs/kinex-agent-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/f-5-labs/kinex-agent-skills/actions/workflows/validate.yml)

Plan-first creative direction and complete AI video production through [Kinex](https://kinex.studio). The bundle connects an agent to the authenticated Kinex MCP server and adds five focused skills for planning, production, media reuse, review, and delivery.

## Install

### Codex plugin

```bash
codex plugin marketplace add f-5-labs/kinex-agent-skills
codex plugin add kinex@kinex
```

### Cross-agent skills

```bash
npx skills add f-5-labs/kinex-agent-skills
```

### Claude Code marketplace

```text
/plugin marketplace add f-5-labs/kinex-agent-skills
/plugin install kinex@kinex
```

The first Kinex tool call opens browser sign-in and consent. No API key needs to be copied into the agent.

## Skills

| Skill                                                         | Best for                                                                                |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`kinex-create-video`](./skills/kinex-create-video)           | Taking a brief through story, production, review, and final cut.                        |
| [`kinex-script-and-story`](./skills/kinex-script-and-story)   | Developing scripts and shot plans without prematurely generating media.                 |
| [`kinex-agent-workspace`](./skills/kinex-agent-workspace)     | Directing the shared Production Plan, Project Bible, style, entities, beats, and shots. |
| [`kinex-media-library`](./skills/kinex-media-library)         | Generating, finding, and reusing standalone media and library entities.                 |
| [`kinex-review-and-export`](./skills/kinex-review-and-export) | Evidence-backed quality review, timeline assembly, render, and delivery.                |

## Six proven creative workflows

The current Kinex Agent Workspace release includes regression scenarios for six production shapes. These are workflow claims, not a gallery of fabricated customer results.

1. A vertical short film carried from source brief to Slate edit.
2. A neon performance music video with beat and sound planning.
3. A warm direct-to-camera UGC product ad with creator and product locks.
4. A source-grounded fashion campaign with editorial, vertical film, and creator variants.
5. A non-human mascot campaign with multi-view continuity gates.
6. A factual product explainer with claims and exact end-card copy grounded in the source.

See [creative examples](./examples/creative-prompts.md) for prompts you can adapt.

## Design principles

- Save a useful draft Production Plan early, label assumptions, and update it when direction changes.
- Keep the Project Bible source-grounded; unknown surfaces and unsupported claims stay unknown.
- Require approval before generation at scale.
- Treat queued work as pending, not complete.
- Re-read saved artifacts after writes and verify outputs before claiming success.
- Keep internal ids and tool mechanics out of the creative conversation.

## Validate

```bash
node scripts/validate.mjs
npx skills add . --list
```

Public tool reference and connection guidance live at [docs.kinex.studio/mcp](https://docs.kinex.studio/mcp).
