# Kinex agent skills

[![Validate](https://github.com/f-5-labs/kinex-agent-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/f-5-labs/kinex-agent-skills/actions/workflows/validate.yml)

Plan-first image, video, and mixed-media production through [Kinex](https://kinex.studio). The bundle connects an agent to the authenticated Kinex MCP server and adds six focused skills for planning, production, model-specific direction, media reuse, review, and delivery.

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
npx skills add f-5-labs/kinex-agent-skills
```

The first Kinex tool call opens browser sign-in and consent. No API key needs to be copied into the agent.

## Skills

| Skill                                                         | Best for                                                                                |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`kinex-create-video`](./skills/kinex-create-video)           | Taking a classic script-wizard project through story, production, and final cut.        |
| [`kinex-script-and-story`](./skills/kinex-script-and-story)   | Developing scripts and shot plans without prematurely generating media.                 |
| [`kinex-agent-workspace`](./skills/kinex-agent-workspace)     | Creating or continuing image, film, campaign, and mixed-media Agent Workspace projects. |
| [`kinex-media-library`](./skills/kinex-media-library)         | Generating, finding, and reusing standalone media and library entities.                 |
| [`kinex-review-and-export`](./skills/kinex-review-and-export) | Evidence-backed quality review, timeline assembly, render, and delivery.                |
| [`kinex-seedance-2-5`](./skills/kinex-seedance-2-5)           | Directing Atlas-backed Seedance 2.5 references, frame controls, and whole video beats. |

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

- Save a valid four-section Production Plan early, then re-read and reconcile its checklist at each new turn without rewriting an unchanged roadmap.
- Keep the Project Bible source-grounded; unknown surfaces and unsupported claims stay unknown.
- Keep routine planning and continuity with the main director; delegate only when the boundary adds value.
- Model production states as named variants of canonical entities and lock assigned variants before generation.
- Generate images externally when requested, then upload and attach them as project-scoped continuity media.
- Keep hero/master plate, continuity anchor, selected preview, and generation history distinct for characters and locations.
- Treat a direct request to create a named visual deliverable as plan approval and continue execution after host confirmation instead of asking again.
- Treat stop and cancel as authoritative; never retry cancelled work without a new instruction.
- Treat queued work as pending, not complete.
- Re-read saved artifacts after writes and verify outputs before claiming success.
- Keep internal ids and tool mechanics out of the creative conversation.

## Validate

```bash
node scripts/validate.mjs
npx skills add . --list
```

Public tool reference and connection guidance live at [docs.kinex.studio/mcp](https://docs.kinex.studio/mcp).
