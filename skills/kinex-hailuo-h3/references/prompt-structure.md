# Hailuo H3 prompt structure

Use this structure only for an H3 mixed-reference operation. It is the text placed in the operation's `prompt` field; image, video, audio, duration, resolution, and ratio remain structured operation inputs.

```text
Subject Definitions: <what each <Subject N> establishes; omit labels not attached>
Summary: <one-sentence intended audiovisual outcome>
Reference Retention: <what each <Picture N>, <Video N>, or <Audio N> must preserve or contribute>
Detailed Description: <one continuous shot: subject action, setting, composition, camera movement type + amplitude + speed, and visible final state>
Overall Soundscape: <diegetic sound, ambience, dialogue, and audio-reference relationship>
Non-diegetic Music: <music direction, or None>
```

Reference labels are literal: `<Subject N>`, `<Picture N>`, `<Video N>`, and `<Audio N>`. A reference-retention line must name the useful transfer, such as picture-derived appearance, video-derived hand motion, or audio-derived rhythm. It must not attribute a role to unattached material.

For frame-led H3 operations, do not add reference-retention sections. Start from the first frame and, when present, describe one continuous path to the final frame using the base three-section H3 structure from the skill.
