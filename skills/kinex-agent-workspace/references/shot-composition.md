# Shared shot composition and pipeline handoffs

Source: [Helios PR #196](https://github.com/ehimah/helios_app/pull/196), final head `8dea2f2d99d957828d60649af6bdce10ba3d5542`. This is the merged authoring contract; refresh the connected MCP schema before use. Merge does not prove deployment. If the connected server lacks it, retain the proposed patch locally and report the capability gap; never submit retired inputs or switch to a browser without the user's approval.

## One shot, shared authors

MCP uses `shot_define / shot_get / shot_update / shot_delete` with `projectId`, `beatId`, and `shotId`. Director uses `define_shot / get_shot / update_shot / delete_shot`, its project context, and `beat_id / shot_id`. Composition fields are camelCase on both surfaces. Do not send Director tool names through MCP.

| Concern | Authorable fields |
| --- | --- |
| Meaning and performance | `direction.goal/task/dramaturgy/style/blocking/acting` |
| Camera and light | `camera.cameraPackageId/cameraModel/shotSize/lens/angle/movement/lighting/colorHuePresetId/notes` |
| Edit | `edit.cut/pace/transition/notes` |
| Sound | `audio.intent/speakerEntityId/dialogue/voiceDirection/referenceMediaItemId` |
| Continuity | `castEntityIds`, `locationEntityId`, `propEntityIds`, `castVariantKeys`, `locationVariantKey`, `propVariantKeys`, `spatialLayout` |
| Coverage and prompts | `actionLine`, `targetDurationSeconds`, `imagePrompt`, `videoPrompt`, `shotStrategy`, `generationModel`, `skipOpeningWide`, `shotCode`, `intExt`, `complexity` |
| Placement and source review | `order`, optional destination `beatId`, `breakdownReviewStatus: "complete"` |

These are fields on the shot-tool input, not wrapped in `breakdown`. Read responses may also expose `breakdown` and flat convenience projections; they are not extra authoring inputs. Do not copy the whole response into a write. Removed inputs include `requireLockedEntities`, `cameraNotes`, `shotType`, `firstFrameBlocking`, `performanceNotes`, top-level dialogue/voice fields, and the retired flat snake_case camera adapter. A camera preset catalogue is unnecessary; use optional live package/hue ids only when useful.

## One record owns one generated clip

A shot record is the unit sent to one video-generation operation. It can direct a coherent event with intentional internal camera cuts, micro-actions, listener reactions, and exact dialogue; it is not a database row for each panel, angle, cut, or gesture. Keep the complete clip contract together: source coverage, cast and variants, props, location, opening state, action/reaction progression, audio ownership, prompt, duration, internal cuts, and outgoing handoff.

Choose a 4-, 9-, or 12-panel sequence sheet—or another supported size—from the complexity needed to communicate that clip. Panel count does not dictate generated clips or timeline cuts. If the live `shotStrategy` enum lacks the desired size, omit that field from the patch or preserve its current truthful supported value and record the board plan in supported plan/prompt fields; never relabel another enum as the requested count. Use `first-frame-prose` only when it truthfully describes a continuous event and the live schema advertises it. A sequence sheet is a typed generation reference that describes progression; never bind the whole grid as `startFrame`, `openingFrame`, or literal frame zero. If the live surface has no sequence-reference role, retain its ownership in the Production Plan and report the capability gap.

### Patch and re-read

1. Read current plan/canon and `shot_get`; list the relevant beat when placement matters.
2. Send only intended fields. Omitted groups and omitted nested keys are preserved. Supplied assignment maps/arrays replace those collections: read their full current membership before changing one entry.
3. Clear supported text with an empty string, assignment collections with empty arrays/maps, and nullable location/audio fields with `null`. Keep cast, location, props, and their variant selectors consistent in the same patch.
4. Re-read the shot and compare changed and load-bearing untouched values. On a concurrent-write or missing-variant error, re-read and reconcile the intended patch. There is no client `expectedEtag` on shot tools; internal snapshot guards do not protect a stale full-record payload authored earlier.
5. An `isStale` shot needs review against the current script. Set `breakdownReviewStatus: "complete"` only after that whole-card review. This clears source staleness; it does not approve frames, sound, motion, or the cut.

Illustrative camera repair (replace placeholders only with tool-returned ids):

```json
{
  "projectId": "<project>",
  "shotId": "<shot>",
  "camera": {
    "shotSize": "oblique medium two-shot, both hand paths and listener's eyes readable",
    "angle": "waist height, south of the established axis",
    "movement": "locked-off while the offered object crosses the shared gap",
    "lighting": "soft window side-key from frame-right; practical behind the giver"
  },
  "edit": {
    "cut": "Cut after the listener refuses and the giver withdraws the object."
  }
}
```

Use `direction.goal/dramaturgy` for audience uncertainty and information before/after, `task/acting` for objective, tactic, perceived trigger, listening and response, `blocking` for occupancy and full prop custody/path, and `edit` for motivated joins and natural pacing. Do not invent schema fields for every review question.

## Camera choices serve the moment

Choose framing and camera position for what must read, then lens character, angle, and movement. A wide, normal, or telephoto lens supports that view; perspective depends on camera position. Separate actor movement in `direction.blocking` from camera movement in `camera.movement`. For a move, name its trigger, start, path, speed, and landing; stillness can carry the whole event.

For multi-station coverage, state the audience information revealed at each station before naming an angle. Place every station on the floor map and keep paired views on the intended side of the action axis. Preserve the full visible action path—especially hands, offered objects, connectors, microphones, tools, and their starting/ending owners. A dirty OTS should visibly contain a near back/shoulder at meaningful foreground scale, suppress or partly hide that near face, privilege the far face, and shift the background through real parallax. A reverse must exchange those foreground/background roles. A crop, focal-length label, or turned head inside the same frontal geometry is not a new camera position.

When generating a new viewpoint, use approved identity sheets for appearance and a location sheet or floor map for geometry. Declare that these references do not control composition. Do not use a failed frontal frame as the image-to-image composition anchor for an OTS or detail; if an edit preserves the wrong perspective, rebuild from the identity/location references. Review the uncaptioned pixels before trusting a sheet's labels. Attractive light and likeness cannot rescue a frame that contradicts the planned station. Verify handedness, complete anatomy, prop custody, and visible body-bound accessories such as a watch across OTS reverses. If the correct limb is occluded, mark accessory custody unverified; absence from the wrong limb is not positive proof.

`camera.cameraModel` is optional visual intent, not a physical-capture guarantee. A brand does not establish lighting, palette, or colour management. Put source/direction/softness/contrast/practicals in `camera.lighting`; keep the scene's palette progression and proposed delivery colour profile in canon/plan. Verify actual media colour tags before promising a final profile.

## Order, strategy, and removal

`shot_define` requires `beatId` and `actionLine`; omit `order` to append. Both create and update accept `order` as a zero-based position inside the destination beat. An update without order preserves position in the current beat; a move to a different beat without order appends there. List both beats after reparenting. Content and placement commit together, but existing beat prompts, boards, media, and saved timelines do not update themselves.

After any coverage/order change, refresh affected beat frame/clip prompts through advertised beat fields, image/video prompts, source-to-shot coverage, and join dependencies. Compare the saved cut separately before editing it. A `4-panel`, `9-panel`, `12-panel`, or `16-panel` strategy is a coverage artifact, not an instruction to create that many shot records or cuts. Prefer `first-frame-prose` when the event should play continuously. Set `skipOpeningWide` when the source should begin directly in the authored framing; otherwise inspect the compiler's opening-wide/lead-in behavior rather than silently adding a beat before speech or action. Evaluate added units by audience information, action, performance and audio cost.

When consolidating over-fragmented records, do not delete first. Read the plan, beat and shot records, relevant entities, media history, project tasks, and saved master/beat timelines. Write an auditable old-record → survivor-record map, then reconcile source and dialogue coverage, combined cast/variant/prop/location assignments, audio routes, prompts, opening and tail states, sequence-sheet ownership, plan counts, and each asset variant's `requiredShotIds`. Inspect the live entity/reference schemas, patch complete intended collection membership, and never guess a transfer field. Update and re-read survivor records and dependent entities before considering deletion. Only delete obsolete records when the user explicitly authorized deletion, their work is represented, no running task or saved timeline still depends on them, and all timeline reads succeeded. Retain their generated media. Delete safe obsolete records individually, then normalize final zero-based survivor order because indices may shift; re-list and re-read the final structure. If a blocker leaves obsolete rows in place, report three prepared generation targets rather than claiming the record count is three.

For a user-requested deletion, read the shot, its shot/beat tasks, and master/beat timelines, then call `shot_delete` with `confirmDelete: true`. Running generation, a saved-cut reference, or a timeline read error blocks deletion. Resolve those only within the user's scope; do not cancel jobs or rewrite an approved cut merely to force the delete. Re-list after success. Generated media is retained; deletion is not media cleanup.

## Audio is an executable choice

| Intent | Persist and verify |
| --- | --- |
| `dialogue` | Exact non-empty dialogue and one assigned cast `speakerEntityId`; delivery in `voiceDirection`. No reference-audio id. |
| `reference_audio` | `referenceMediaItemId` must resolve to project-owned audio; generation also requires an active asset and an operation accepting audio references. Do not include generated dialogue or speaker fields. |
| `native_sound` | Provider production sound without generated dialogue/voice/reference fields. |
| `silent_master` | Silent picture acquisition; do not carry dialogue/voice/reference fields. |
| `post_only` | Picture with a documented separate sound-post handoff; do not carry dialogue/voice/reference fields. |
| `undecided` | Unresolved planning route. It may retain provisional dialogue but cannot be reported as sound-ready. |

Omitting audio intent preserves it. Changing intent may clear incompatible fields; re-read the result. Multi-speaker dialogue, voice-only speakers, device sound and playback need explicit ownership and perspective. Never change speaker identity or fragment an otherwise coherent clip merely to satisfy a single-speaker contract. Assigned cast also become visual subjects/references; adding a voice-only or offscreen speaker to cast is not an offscreen-audio solution. Require an explicitly supported compiler path or use reference/post audio. Use a supported reference track, an intentional post route, or earned coverage after considering timing and fragmentation.

For `reference_audio`, `silent_master`, and `post_only`, the queue sets generated sound off only when the operation exposes `generateAudio`. An audio reference is attached only when that operation supports it. Check the returned inputs/assets and the audible take; a saved route does not prove either happened. Do not paste the same dialogue into a native-sound prompt after switching to reference or post audio.

## Carry the decision through delivery

- **Source → canon:** preserve exact words, physical identities, floor map, meaningful props, and source precedence. Keep unknowns explicit.
- **Canon → assets:** preserve canonical entities and exact live variant selectors. For requested external stills use built-in ImageGen, inspect, verify actual pixels, upload project media, bind the correct entity/variant/frame slot, then re-read.
- **Card → frame:** read `shot_get` and assigned references; compile only the incoming action phase, current camera/light, and geography into `imagePrompt`. Do not begin at a payoff whose trigger must be shown.
- **Card → motion:** after direction, camera, audio, assignment, or timing changes, reconcile existing authored `imagePrompt/videoPrompt` explicitly. Synthesized prompts may refresh, but authored prompts are preserved. A nested camera patch alone cannot prove the final prompt is current.
- **Frame → operation:** match the selected model's actual fields, assets and audio path. Exact 21:9 means 7:3 mathematically; use an advertised equivalent token or an Adaptive frame with measured pixels, never invent a 7:3 enum. Aspect ratio is an operation/project-format choice, not a shot-authoring field. If unsupported, propose a composition-first acquisition and finishing route.
- **Operation → take:** poll the existing task; inspect compiled inputs, actual frames, action, listening, camera and audible results. Keep persistence, creative review, frame inspection, motion and sound outcomes separate.
- **Take → cut:** preserve selected media, hand/object states, eyelines, sound tails and timing across joins. Save authorized timeline changes and re-read before exporting. Poll export completion and deliver the verified result.

A requested test of unresolved creative choices may proceed within authorization; label its limitations and keep the failed or unverified review state. Quality verdicts describe evidence and never grant generation, deletion, or export permission.
