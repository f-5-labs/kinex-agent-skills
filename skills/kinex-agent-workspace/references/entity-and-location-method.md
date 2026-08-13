# Character and location method

Use this reference when a production needs recurring people, non-human characters, wardrobe, products, or places. It carries the same continuity judgments used by Kinex's internal production agents, but keeps execution with the external agent and the public MCP surface.

## Choose the lightest sufficient lock

Decide from downstream use before generating anything:

- **Reuse the existing lock:** when the current approved media already proves every view, state, and material the production needs. Do not generate a prettier duplicate.
- **Single hero:** only for a one-off appearance, an explicitly requested portrait, or a user-approved opt-out from multi-view coverage. A hero is a presentation image, not automatically a sufficient motion reference.
- **Quick character lock:** for one short piece with limited camera and performance range. Cover front, three-quarter, and back views; six useful expressions; wardrobe and props; and a small palette.
- **Character master sheet:** the default for a new recurring character, multiple clips, materially different shot sizes or angles, ensemble work, or demanding motion. Cover a dominant neutral identity view, three-quarter and profile views, full-body scale and proportions, wardrobe/accessories, identity-critical detail, expressions and micro-expressions, posture or movement, gestures or hands, and silhouette.
- **Wardrobe or garment lock:** when clothes change or their construction, pattern, seams, hardware, fit, or drape must survive multiple views. Keep it as a named variant of the same character; do not create a second identity.
- **Location reference sheet:** when a place recurs, architecture must survive multiple shots, action geography matters, or continuity risk is high. A one-off generic background does not need one.

Record the chosen strategy, downstream reuse, required coverage, unresolved facts, and acceptance criteria in the Production Plan before generation.

Maintain a compact asset passport for every recurring lock: canonical entity id and kind, source-grounded descriptor, declared reference roles, named variants, scenes or shots that require each state, version, status, acceptance criteria, and review evidence. Keep exploratory attempts and rejected media in history; do not silently replace the passport's approved lock.

## Define character canon

Inspect every supplied source first. It is evidence, not permission to redesign or invent hidden facts.

For a human character, persist only approved or source-visible identity facts: adult age descriptor, build and body proportions, facial structure and feature spacing, skin tone and texture, hair, distinctive marks, wardrobe construction and fit, footwear, accessories, and props. Preserve natural texture and asymmetry appropriate to the brief. Do not add sensitive traits or distinctive marks as generic realism cues.

For a non-human character, persist subject class, silhouette, proportions, limb or construction rules, species or material traits, palette, line and shape language, expression system, movement constraints, and source-visible distinctive features. Do not apply human casting, skin, makeup, or anatomy rules unless the subject is human.

Add observable performance behavior: default posture, gaze habits, hand business or equivalent gesture system, movement rhythm, behavior under pressure, and any approved voice or delivery facts. These are playable continuity facts, not emotion adjectives.

If a source is a single portrait or cropped view, mark occluded anatomy, wardrobe, accessories, back views, and construction unresolved. A derived sheet must preserve visible identity; it must not turn guesses into canon.

## Plan the floor map before defining a location

Do not call `workspace_define_entity` for a location until its floor map has been planned and saved in the Production Plan. Use a minimal map even for a simple one-off place; expand it when blocking, continuity, architecture, or recurring coverage matters.

Inspect supplied plans, images, text, and neighbouring locations first. Record:

- orientation, footprint, boundaries, and named zones;
- entrances, exits, doors, windows, corridors, and adjacent spaces;
- permanent anchor landmarks and story-significant set pieces;
- relative scale, distances, elevation changes, and levels;
- likely subject positions, action paths, and prop handoff points;
- usable camera zones, the working 180-degree axis, screen-left and screen-right relationships, and intentional axis-crossing options;
- foreground occlusions, mirrors, glass, choke points, hazards, and inaccessible areas;
- motivated practical light sources and their direction;
- source-proven facts, unresolved space, and explicit design proposals.

Use readable text, compact ASCII, or both. Do not turn an inferred room behind a closed door into canon. After the floor map exists, define the location from its stable geometry and materials. Persist approved cross-scene geography in the Project Bible; keep temporary blocking and camera choices on beats or shots.

## Define location and world canon

Use one entity for one physical place. Day, night, rain, damage, crowd level, and mood are conditions or named variants—not duplicate locations.

Persist the stable place:

- name, type, geography, climate, era, and season;
- architecture, spatial layout, entrances and exits, permanent landmarks, distances, and elevation changes;
- construction materials, surfaces, characteristic set dressing, signs, and recurring props;
- baseline atmosphere and regional palette;
- motivated practical sources such as window orientation, streetlamps, fireplaces, or industrial fixtures;
- working 180-degree axis, screen-left and screen-right relationships, and relationships to other places when story geography depends on them.

Put multi-location rules and cultural or geographic logic in the Project Bible. Put temporary time, weather, lighting, and story condition on the relevant beat, shot, or named location variant. Every shot must still state the applicable condition and one motivated dominant light source; a preset id is not a substitute for visual direction.

When useful, persist `locationHuePresetId` as readable steering and `visuals` with stable `atmosphere`, baseline `lighting`, and `colorPalette`. These fields support later grounding; they do not replace the full written place definition or shot-level conditions.

A useful location sheet covers:

1. a canonical wide establishing view;
2. a secondary angle or the principal action area;
3. a material, landmark, prop, or sign detail that grounds the place;
4. the canonical angle under one required alternate time, weather, or lighting state.

Architecture, distances, materials, permanent set dressing, and palette must remain the same across the sheet. The alternate condition is not a second place.

## Generate and persist the lock

1. List and read existing entities before defining a new one.
2. Persist stable canon on the entity and Project Bible before asking any image model to visualize it.
   Store each materially different production state under a stable key in `attributes.variants` with `label`, `descriptor`, `stateDelta`, `requiredShotIds`, and `status` (`planned`, `queued`, or `locked`); add `mediaItemId` and `imageUrl` only when media is actually locked.
3. Give every supplied or generated reference one job: identity, wardrobe or garment, location geometry and materials, style, composition, or another explicit role. Identity and physical geometry outrank mood and style when references conflict.
4. When generation happens outside Kinex, use the host image generator, upload the result as project-scoped media, and attach it deliberately as hero, continuity anchor, or both. For a named variant, preserve sibling variants and use the safe merge procedure in the tool map.
5. Keep the neutral canonical lock separate from cinematic shot treatment. Shot prompts carry angle, action, weather, emotion, and lighting unless those facts define a named approved variant.

Do not assign a recurring entity to downstream shots until its required canonical and variant media are locked.

Before motion, stress-test a recurring lock in the production conditions that are most likely to expose drift: useful wide and close framing, more than one angle, required light or weather states, movement or gesture, and at least one ensemble frame with its scene partners. Record which tests passed. One attractive image is not sufficient evidence when the asset must survive broader coverage.

## Review before locking

Inspect the actual completed artifact against the source and the recorded acceptance criteria. Never infer quality from the prompt, provider response, or queued task.

For characters, compare identity, proportions, anatomy or construction, hair or silhouette, distinctive traits, wardrobe, accessories, expression coverage, and cross-panel consistency. For locations, compare architecture, spatial geometry, entrances, landmarks, materials, set dressing, palette, light direction, and alternate-condition continuity.

Return one verdict:

- **PASS:** every load-bearing criterion holds; the artifact may be locked and reused.
- **REVISE:** one localized defect can be corrected without redesigning the lock.
- **REJECT:** identity, geometry, architecture, or the core reference purpose fails; regenerate from the approved source and constraints.
- **BLOCKED:** a required source, view, fact, or inspection capability is missing.

Record criterion-linked evidence and the smallest next action. Promote media to hero, continuity anchor, master plate, or locked variant only after PASS. A visually attractive sheet is not sufficient when its identity or geography drifts.
