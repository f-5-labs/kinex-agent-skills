# Scene production method

Use this reference only when the deliverable contains scenes, shots, motion, or an edited film. Keep image-only and non-temporal Agent Workspace projects on the lighter plan, canon, entity, generation, and review path.

The durable lesson is production control, not allegiance to one model. Use the live Kinex registry for capabilities and treat every provider recommendation as replaceable. Lock → still → motion is the recommended path. It does not refuse generation. If the user asked to produce the scene, generate; name missing locks as advice.

## Recommend scene-level production

Represent the following as stable Production Plan checklist outcomes. They are a recommended film OS, not release valves. A direct instruction to produce a scene approves the current creative plan and is authority to generate. Suggest closing source, continuity, and asset gaps in the same turn; do not refuse because a checklist row is open.

1. **Story gate:** inspect the source; lock the requested story range, target duration, dialogue or copy, and unresolved facts.
2. **Breakdown gate:** create the scene breakdown, preliminary coverage, full scene asset list, state variants, complex elements, and visual-dramaturgy notes.
3. **Visual-system gate:** approve the style direction, reference roles, palette, light logic, optics, movement language, image texture, cutting rhythm, and sound direction.
4. **Asset gate:** define canonical entities, make only required variants, attach or generate their reference media, stress-test recurring locks, and record a review verdict.
5. **Scene-readiness gate:** verify the scene-to-assets coverage and whether every entity or variant assigned to the scene has distinct reviewed evidence. A variant's lock should carry media different from its canonical Base and sibling state locks; `status: locked` alone is not proof. Recommend this check before motion; it does not block generation.
6. **Selects gate:** retain accepted takes, their exact prompts and inputs, and the reason each was chosen. A completed generation is not automatically a select.
7. **Picture-lock gate:** assemble scenes, close coverage holes, verify joins and runtime, save the approved cut, and freeze picture before global finishing.
8. **Finish-and-master gate:** close artifact repairs before color treatment, verify sound and rights, run technical QC, export required versions, and retain reproducibility records.

Advance by scene or production block. Do not wait for every asset in a long project before starting a requested scene. Do not scatter generation across unrelated scenes when a scene-sized batch would preserve light, performance, and editorial continuity.

## Review the proposed script first

When the project starts from a screenplay, narration, treatment, or proposed script, review it before the breakdown. Identify intent and audience, causal structure, scene function, character objectives and playable behavior, dialogue or narration, rhythm and duration, source fidelity, production load, exact copy, rights, and unresolved facts.

For every scene, identify its entry state, active objective, obstacle, tactic, visible change, exit state, and causal handoff. Return `PASS`, `REVISE`, or `BLOCK` with location-specific evidence and the smallest useful changes. Preserve strengths and distinguish defects from preferences. Do not rewrite a script during a read-only review.

Release the breakdown after the user approves the script or explicitly accepts remaining non-blocking notes. Script approval is planning advice, not a media-generation lock. If they asked to generate, generate.

## Break down each scene

Create one preliminary shot card per intended piece of coverage. Keep four lanes distinct so an attractive image cannot hide weak dramatic or editorial reasoning.

### Identity and asset lane

- stable scene and shot label;
- interior or exterior, physical location, time, weather, and story condition;
- active cast including extras or animals, with exact named variants;
- story-significant props, vehicles, screens, titles, or in-frame text;
- observable action or dialogue, estimated duration, and complexity risks.

Treat vehicle interiors, designed screens, typography, crowds, water, fire, smoke, stunts, and other failure-prone elements as explicit production needs. Separate in-frame text into a dedicated generation or finishing task when the selected model cannot hold it reliably.

### Direction lane

- why the shot exists;
- the playable task stated as a verb;
- the visible change from start to end;
- blocking and first-frame occupancy;
- performance objective, obstacle, tactics, subtext, eye behavior, hand business, interruption, and reaction;
- the shot's visual device or story motif.

### Camera lane

- observable shot size and any intentional size change;
- camera movement plus what must remain stable;
- field of view or lens behavior;
- camera height, side, angle, and the scene's working action axis.

### Edit lane

- intended cut or transition;
- pace and trim expectation;
- incoming and outgoing movement, eyeline, sound, or composition hook;
- neighbouring shot dependencies and required cutaways.

The shot card is the source for the generation instruction and later join review. Do not let the prompt introduce a new cast member, prop, geography, action, or line that is absent from the approved card.

Keep the complete four-lane card in the Production Plan. Map only supported fields into `shot_define` or `shot_update`; do not invent tool inputs for dramatic purpose, edit intent, or transition notes. When recommended locks already exist, finalize film shots with `requireLockedEntities: true`. If the user asked to produce without them, generate and name the gap.

## Build a reference map and visual system

Gather evidence along two axes:

- **By production asset:** identity, wardrobe, location geometry and materials, props, scale, and required states.
- **By cross-cutting craft choice:** light, palette and grade direction, optics and composition, camera movement, texture, editing rhythm, sound, and music.

Give each reference one declared job and record what must not transfer. A location reference may control geometry, materials, and light without controlling the next shot's framing. A motion reference may control timing or camera path without transferring its performer or set.

Persist approved facts and visual rules in the Project Bible. Keep exploratory boards, rejected directions, temporary task notes, provider settings, and take logs in the Production Plan or media history. Convert visual agreements into observable language; a moodboard without written decisions is not a lock.

## Maintain an asset passport

For each recurring character, location, or prop, keep a compact passport in its entity record and the Production Plan:

- canonical entity id, kind, and human label;
- source-grounded descriptor and unresolved facts;
- explicit reference roles and continuity anchor;
- named variants and the scenes or shots that require them;
- version, status (`planned`, `review`, `locked`, or `superseded`), and acceptance criteria;
- review evidence and the smallest required repair.

One physical identity remains one Kinex entity. State variants remain named variants of that identity even when they need separate reference media. This preserves project semantics while giving every production state its own lock.

Stress-test a recurring asset before motion: useful wide and close framing, more than one angle, required lighting states, movement or gesture, and at least one ensemble composition with the assets it will share a frame with. Do not promote a lucky single image into a continuity lock when the production demands more coverage.

Before generating a scene, reconcile a scene-to-assets matrix in the plan: scene or shot, active entity, required variant, reference media, lock status, and recommended next lock. Report missing locks as advice for that scene, not a generate ban.

## Keep a take and prompt ledger

For every attempted shot, retain:

- shot id and attempt number;
- exact operation, model, structured inputs, active reference roles, and prompt;
- the one control changed from the previous attempt;
- output media or task id;
- observable result and verdict (`select`, `revise`, `reject`, or `blocked`).

Use generation history as evidence and keep concise decisions in the Production Plan. Do not turn the Project Bible into an attempt log. Change one failing control at a time. If the agreed retry budget is exhausted, simplify blocking, reduce simultaneous actions, split the shot, add a cutaway, or change angle rather than growing the prompt indiscriminately.

The current active-media field is not a separate editorial-select state. Until the surface exposes one, record the select verdict in the Production Plan and use `media_list_project` plus the shot's current media as evidence of the canonical choice the user intends. Do not report an active alternative as an approved select without that evidence.

## Edit while production continues

Once a scene has usable selects, assemble it while the next ready scene is generating. Review the rough scene before scaling generation because the edit exposes missing coverage earlier than isolated clip review.

At every join check:

- eyelines and action axis;
- character identity, wardrobe, hair, prop ownership, and state carryover;
- location geography, light direction, palette, and weather;
- incoming and outgoing movement, performance intensity, and tempo;
- dialogue, ambience, and sound tails.

Trim unstable clip edges. Treat missing coverage as a new or revised shot order. Do not hide a structural hole with generic regeneration.

## Finish within the real surface

Use Kinex for the timeline, active media, previews, export, and the media operations actually advertised by the live registry. When professional cleanup, grade, sound post, subtitles, DCP, stems, or interchange files are outside the current surface, prepare a precise handoff instead of claiming Kinex completed them.

Retain the reproducibility package that Kinex can represent: approved plan and canon, entity locks and versions, final prompts and structured inputs, generation history, selects, saved timeline, export records, exact copy and dialogue, and documented reference or voice rights.
