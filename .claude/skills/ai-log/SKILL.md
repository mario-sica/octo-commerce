---
description: Append an entry to docs/ai-log.md when AI output had to be corrected or rewritten. Use whenever a generated change was wrong, insecure, inaccessible or off-design.
argument-hint: <short description of what was corrected>
allowed-tools: Read, Edit
---

# Log an AI correction

Append one row to the table in `docs/ai-log.md`:

| Date | Branch | Area | What the AI produced | What was wrong | Fix |
|---|---|---|---|---|---|

Rules:
- Be specific and honest. The README's "How AI tools were used" section is built from this file.
- One row per correction. Keep each cell to one short sentence.
- Use the current branch name: `git rev-parse --abbrev-ref HEAD`.
- Don't commit on your own. The entry goes into the next `/checkpoint`, as a `docs:` commit or together with the related fix.

Entry to log: $ARGUMENTS
