# Script tool boundaries

| Tool                            | Choose it for                             | Avoid it for                  |
| ------------------------------- | ----------------------------------------- | ----------------------------- |
| `script_get_current`            | Selected record, duration, word count     | Planning-document state       |
| `script_get_document`           | Canonical story artifact                  | A write                       |
| `script_planning_turn`          | Open-ended development and broad revision | One deterministic edit        |
| `script_refine`                 | One explicit change                       | Exploration or full overwrite |
| `script_import`                 | Complete user-supplied script             | Generating from an idea       |
| `script_update_document`        | Existing complete replacement markdown    | Vague editing intent          |
| `script_plan_shots`             | Approved script to shot plan              | Unapproved changing story     |
| `script_generate_visual_script` | Shot plan to visual artifact              | Agent Workspace planning      |

Approval sequence: read, make the narrowest write, re-read, review, obtain story approval, plan shots, generate visual script, poll, and verify alignment.
