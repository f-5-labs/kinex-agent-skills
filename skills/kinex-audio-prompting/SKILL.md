---
name: kinex-audio-prompting
description: Write voice, music, sound-effect, and ambience prompts for Kinex production, keeping the four jobs on separate layers, holding a recurring character's vocal identity stable across scenes, and fitting each cue to the shot it plays under. Use for “write the VO prompt,” “score this cut,” “make the footsteps for this shot,” “why does this character sound different in scene four,” or “build a room tone bed.” Not for model or SKU selection, timeline assembly, final mix, or export.
---

# Write audio that fits the cut

Audio is not one prompt problem. Voice, music, sound effects, and ambience have different grammars, and asking one prompt for a music bed plus footsteps plus a line reading produces mud. Generate each layer separately and let the mix combine them.

## Name the job first

- **Voice** — someone says something.
- **Music** — a scored bed under a stretch of picture.
- **SFX** — one event, one sound.
- **Ambience** — a place with continuous character.

If a request spans jobs, plan separate layers. Prompt writing alone does not authorize generation. Native production sound may contain incidental ambience and effects; deliberate voice, score, effects, and ambience tracks are separate assets when the requested workflow needs them.

## Voice

Write copy that is speakable. Read it aloud before sending it: if it trips your own tongue, it will trip the model's.

- Supplied words are exact. Never paraphrase a scripted line, a legal line, or a product claim to make it scan better — flag the problem instead.
- Separate what is said from how it is said. Delivery direction — pace, warmth, breath, where the emphasis lands — goes in a short preface, not as stage directions buried inside the spoken text, where the model may read them aloud.
- A recurring character has one stored vocal identity: age, timbre, accent, register, habitual pace. Reuse that description **verbatim** in every scene and change only the line. Rewriting a character's voice description per scene is why voices drift between scenes.
- Fit the runtime. Count the line against the shot it plays under; record an honest timed read when one is available and label word-count estimates as estimates. If speech cannot fit, extend the shot or propose an earned split within the live limit. Changing exact supplied words needs the user's authorization.

## Save one shot audio route

For project work, read `shot_get` and use the nested `audio` group described in [shared shot composition](../kinex-agent-workspace/references/shot-composition.md). `dialogue` requires exact text and one `speakerEntityId` in the assigned cast. Cast membership also feeds visual subjects and identity references: do not add an offscreen, device, or voice-only speaker to cast just to satisfy this field. Use supported reference audio or a post route unless the connected compiler explicitly supports keeping that role out of picture. A multi-speaker or playback track can use `reference_audio` with project-owned audio and a supporting operation; do not force the exchange into one speaker id. Keep unresolved routes `undecided` and distinguish them from an intentional `post_only` route with a finishing handoff.

Preserve the stored vocal identity (`attributes.voicePrompt` and canon); write momentary delivery in `audio.voiceDirection`. A change of audio intent can clear incompatible old fields. Re-read the saved route, compile only that route, and verify that the selected operation actually receives the audio reference or generated-sound setting. Provider support cannot be inferred from a successful shot save.

## Music

State genre, tempo, instrumentation, and the emotional arc across the stretch — where it starts, where it turns, where it lands. Then say where it sits and what it must leave room for: dialogue, a product line, a silence before the end card.

Name two or three specific instruments rather than piling on mood words. `Upright bass, brushed kit, and a single muted trumpet` gives the model a target; `epic emotional inspiring cinematic` does not.

## SFX

One event, described physically: the material, the force, and the space it happens in. A boot on wet gravel is not a boot on a wooden stage, and the same event in a tiled corridor is a different sound from the same event outdoors. Give the model the object, the impact, and the room.

Generate one event per prompt. A list of five sounds returns a blurred approximation of all five.

## Ambience

Describe a place, not a moment: what persists underneath everything for the whole stretch — traffic distance, room tone, weather, crowd density, machine hum. Say where it carries across a cut and where it should change, because a bed that changes at every edit tells the audience the location changed.

## Duration and format are operation inputs

Length, sample rate, channel layout, and format are structured fields on the live operation. Read them from the live registry and set them there; asking for “about eight seconds” in the prose controls nothing.

## Review by listening

Poll the task, then listen to the result against picture — not against the prompt. A cue that reads correctly on paper and fights the cut is a failed cue. Repair at the source: the wrong job, a vocal identity that was rewritten, an arc that peaks in the wrong place, a room that does not match the shot.

Read [tool map](references/tool-map.md) for discovery, routing, and the handoff to final mix.

For a standalone installation without the sibling reference, read the [published shot composition contract](https://github.com/f-5-labs/kinex-agent-skills/blob/main/skills/kinex-agent-workspace/references/shot-composition.md) and refresh the live tool schema before project writes. If neither is available, keep the proposed patch local and report the gap; prompt-only work can continue.
