# Pre-production script review

Use this method when the user presents a draft, screenplay, narration, treatment, or proposed script for evaluation before shots or media generation.

## Establish the review contract

Determine whether the user wants:

- a read-only diagnosis;
- revision notes and options;
- a targeted rewrite;
- a full revised draft;
- or an approval recommendation before production.

Read-only review does not authorize `script_refine`, `script_planning_turn`, `script_import`, or `script_update_document`. When revision is requested, preserve the author's register and make the narrowest useful change before re-reading the saved result.

## Review from story to production

Ground every note in a scene, passage, line, or missing bridge. Review in this order:

1. **Intent and promise:** audience, format, premise, theme, point of view, target duration, and the experience promised by the opening.
2. **Causality and structure:** inciting pressure, decisions, reversals, escalation, climax, resolution, and whether each event causes or meaningfully conditions the next.
3. **Scene function:** for every scene identify entry state, active objective, obstacle, tactic, visible change, exit state, and causal handoff. Merge or remove scenes with no distinct work.
4. **Character and performance:** objectives, contradictions, relationships, subtext, playable behavior, reaction timing, and state carried into the next scene. Replace unsupported emotion labels with observable choices.
5. **Dialogue, narration, and action:** speaker distinction, compression, exposition, speakability, exact required copy, visual action, and whether the image is merely repeating the words.
6. **Rhythm and duration:** estimated running time, scene balance, setup and payoff spacing, silence, transitions, and fit for the target platform.
7. **Continuity and production load:** cast, locations, props, wardrobe or condition variants, time and weather states, designed screens or text, sound needs, and complex elements such as crowds, vehicles, animals, water, fire, smoke, stunts, or lip sync.
8. **Truth, rights, and unresolved facts:** source fidelity, factual or product claims, real-person likeness or voice, copyrighted material, sensitive details, and any assumption that must remain unresolved.

Do not solve a story problem by prescribing camera coverage before the story decision is made. Do flag likely production pressure when it changes the feasibility, cost, continuity burden, or form of the script.

## Return a decision-ready review

Report:

- an overall verdict: `PASS`, `REVISE`, or `BLOCK`;
- what the script is currently doing and what it wants to become;
- strengths that must survive revision;
- blocking notes first, then high-value improvements;
- for each note: exact location, observed effect, reason it matters, and smallest useful change;
- production consequences: runtime, assets and variants, complex scenes, exact copy, sound, rights, and unresolved decisions;
- the recommended next action.

Distinguish a defect from a preference. Offer alternatives when more than one story choice is valid. Do not produce a surprise rewrite when the user asked for evaluation.

## Apply the pre-production gate

Recommend `PASS` only when:

- the intended audience, format, and duration are coherent;
- the story has a causal spine and a clear ending state;
- every retained scene performs distinct dramatic or informational work;
- character behavior and dialogue are playable;
- exact copy, claims, and source-dependent facts are known or explicitly unresolved;
- the production asset list includes required identities and state variants;
- complex elements and finishing dependencies are visible;
- no unresolved blocker would force the generated coverage to invent story.

`PASS` authorizes shot planning only after the user approves the script or explicitly accepts the remaining non-blocking notes. It does not authorize media generation.
