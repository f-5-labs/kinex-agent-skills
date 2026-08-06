# Agent Workspace production method

Use this reference selectively. It turns the Project Bible into usable production constraints without turning a creative workflow into a tool call.

## Deconstruct and diagnose

Extract the deliverable, audience, duration, aspect ratio, exact copy or dialogue, factual claims, cast, locations, props, states, references, and approval boundary. Mark missing facts as unresolved. Diagnose the hardest continuity risks before choosing models or generating media.

For campaigns, give each deliverable family its own beat and artifact target. Share canon and identity locks across the campaign; do not invent a batch abstraction or encode a marketing skill as a tool.

## Build references before coverage

- Keep a neutral canonical identity lock for each recurring character, location, or prop. Let shot prompts carry the cinematic treatment.
- Model a recurring identity once. Put wardrobe, wet/dry, damaged/clean, day/night, emotional carryover, product configuration, and other needed states in named variants.
- Generate only variants the approved beats require. A shot may reference only variants belonging to its active entities.
- Character definitions should include observable behavior under pressure, not only appearance and emotion labels.
- Location definitions should preserve anchor landmarks, distances, frame-left/frame-right relationships, the working 180-degree axis, materials, and light logic. Reference images prove space and material; they do not automatically dictate the next camera angle.

## Write sealed shot instructions

Treat each generation prompt as the current shot's sealed document. Include only active references and state each role. A useful conditional order is:

1. active cast, count, and exact entity variants;
2. location and spatial map;
3. first-frame occupancy and blocking;
4. format, observable field of view, framing, and camera behavior;
5. timed action, contact, mass, inertia, cloth or hair response, and state changes;
6. objective, obstacle, tactics, subtext, eye behavior, hand business, interruption, and reaction timing;
7. lighting and material response;
8. exact dialogue, copy, ambience, and exclusions;
9. positive quality and continuity constraints.

Use exact quoted text for dialogue and on-screen copy. Do not add claims, ad-libs, music, extra cast, or unseen construction unless approved. Keep model parameters in structured inputs when the live tool schema provides them instead of duplicating them in prose.

The first frame normally establishes occupancy and geography. Use an empty establishing image only when the story calls for one. Default to a single take; state hard cuts explicitly and restate continuity after each cut.

## Direct performance and motion

Translate adjectives into playable behavior: an objective, obstacle, tactics, physical business, and reactions. Preserve performance state across cuts. Let reactions begin before dialogue fully lands, keep eyes responsive, and give hands purposeful activity where appropriate.

Describe physics concretely through contact, weight, acceleration, settling, and delayed secondary motion. Choose optics and camera language for the visible result; do not depend on lens metadata alone.

Select video models from Kinex's live capability registry. Prefer demonstrated support for the shot's actual controls—reference or first-frame input, end-frame control, aspect and duration, audio, motion class, cost, and latency—over a globally favored model. Test one representative difficult shot before committing a beat or campaign. Do not hardcode vendor-specific prompt folklore into durable canon.

## Iterate and review

Change one control at a time and retain the prompt version, change, and verdict in the Production Plan or task notes. Inspect start frames before spending on motion. If a shot repeatedly fails, remove simultaneous actions, simplify blocking, split the action, or change the angle.

Assemble the cut in parallel. Trim unstable clip edges, repair identity and cleanup before global color treatment, and use continuous ambience or state tails to support edits. Report `pass`, `revise`, or `block` with artifact evidence and the smallest corrective action.
