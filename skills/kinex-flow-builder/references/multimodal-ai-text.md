# Multimodal LLM Flow

Use this pattern when a Flow must accept a subject image, a style or motion video, and written instructions; analyze all three; then generate a new video from both the analysis and the original references.

## Reusable graph

| Source or stage | Brief-specific label | Connection |
| --- | --- | --- |
| Upload Media image | `Subject image` | `output` to LLM `images`; also to the generator's discovered image-reference port |
| Upload Media video | `Style video` | `output` to LLM `videos`; also to the generator's discovered video-reference port |
| Text source | `Creative instructions` | `output` to LLM `prompt` |
| LLM | `Prompt director` | `output` to the generator's discovered text-prompt port |
| Video generation | `Directed motion clip` | final generated video |

The LLM stage extracts useful direction; the direct media connections preserve the actual visual and motion references. Do not replace those references with prose alone.

## Build sequence

1. Find or upload the two workspace media items. Create the Flow, read it, and save a concise shared plan when the board is new and empty.
2. Call `flow_capabilities_get` without assumptions. Identify:
   - `flow.asset.static` and its instance-aware image/video outputs;
   - `flow.text.prompt`;
   - `flow.ai.llm` plus a current model whose returned ports support both image and video input; and
   - a video node/model with the required image-reference and video-reference roles.
3. Add the five nodes with the unique labels above. Carry each mutation's returned `graphRevision` into the next write.
4. Bind the real image and video records using separate `flow_media_input_set` calls. Re-read, then resolve each Upload Media node with its saved config so the image node proves an image output and the video node proves a video output.
5. Re-run `flow_capabilities_get` for `flow.ai.llm` with its saved `modelId`. Connect only the returned supported ports and limits.
6. Connect the original media to the video generator only through roles advertised for its selected model. A subject still is normally an image reference; a style or movement clip is a reference video, not a first frame.
7. Validate and re-read. Run only when requested.

## Mention contract

Mention handles belong to source nodes, not target connectors. Derive the handle from the source's current brief-specific label using lowercase kebab case:

- `Subject image` becomes `@subject-image`.
- `Style video` becomes `@style-video`.
- `Creative instructions` becomes `@creative-instructions` when another prompt refers to that source.
- `images`, `videos`, `prompt`, and `referenceVideo` are connector ids and must not become user-facing mentions.

Keep labels unique. If duplicate labels already exist, Kinex assigns deterministic numeric suffixes based on node identity; rename them to clear unique labels before authoring prompts whenever possible. Re-read after a rename so the saved label, prompt text, and connections stay aligned.

An instruction source for this graph can contain:

```text
Analyze @style-video for choreography, action timing, camera movement, framing,
lighting, material behavior, and transition rhythm. Preserve the recognizable
identity, proportions, and silhouette in @subject-image. Apply the user's stated
creative constraints. Return only one production-ready video prompt with a clear
subject lock, ordered motion beats, camera direction, continuity constraints, and
negative constraints against identity drift, extra limbs, flicker, and text.
```

This is an example structure, not a fixed provider prompt. Tailor the analysis dimensions to the user's brief and the live generator's capabilities.

## Model changes

LLM inputs are model-specific. After selecting or changing `modelId`, call `flow_capabilities_get` again with `typeId: flow.ai.llm` and that config. If `images` or `videos` returns `supported: false`, do one of two things:

- select another currently advertised model that supports the required modality; or
- deliberately remove that media edge and explain the reduced analysis.

Do not leave an unsupported edge in place, silently omit a requested source, or claim the model watched a video when only text or image input was accepted.

## Run and proof

When execution is requested:

1. Validate immediately before the run.
2. Run the graph or the final video node's ancestor closure with a fresh caller-stable `requestKey`.
3. Poll the returned run id until success, failure, or cancellation. The LLM must succeed before its generated prompt can feed the video node.
4. On success, inspect node results and call `flow_list_media` for the persisted Flow-owned output.
5. Re-read the Flow and confirm that server-written output bundles and their selected outputs remain present. Never patch artifact URLs into `outputBundle` yourself.

Structural validation proves port compatibility, not creative fidelity. Review the actual result for subject identity, motion timing, pose and contact accuracy, camera/style match, occlusion, temporal flicker, and instruction compliance before calling the template successful.
