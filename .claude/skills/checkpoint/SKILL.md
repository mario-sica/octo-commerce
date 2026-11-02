---
description: Make one small, gated Conventional Commit on the current feature branch. Use after each small step that leaves the app building and rendering.
argument-hint: "<type>(<scope>): <subject>"
allowed-tools: Bash(git *), Bash(pnpm *), Read
---

# Checkpoint commit

Branch: !`git rev-parse --abbrev-ref HEAD`
Changes: !`git status --short`

1. **Check the branch.** It must be a feature branch (`feat|fix|chore|test|docs|perf|refactor/*`). On `dev` or `main`, stop.
2. **Check the size.** The diff must be **one idea**. If it mixes concerns, for example a new component plus an unrelated refactor, split it: stage only the files for this step.
3. **Self-check before staging.**
   - No hex colours, no `[13px]`-style arbitrary values, no `grid` classes in `app/`, `components/` or `lib/`.
   - New interactive elements are `button` or `a` elements with an accessible name.
   - New images use `next/image` with explicit size or `fill` plus an aspect-ratio box, and alt text.
4. Stage the files with `git add <files>`. Never use `git add -A` blindly; review `git diff --cached --stat`.
5. **Commit as a single Bash call:** `git commit -m "$ARGUMENTS"`. If no argument was given, write the message yourself: Conventional Commit with a type prefix, lowercase subject, at most 72 characters, in the imperative mood. Use one `-m` only: no body, and **never** `Co-Authored-By` or any AI attribution.
   - The `guard-git` hook runs `pnpm gate` (typecheck, lint, token check, build). If it fails, **fix the cause** and retry. Never bypass the gate.
6. **Log AI corrections.** If during this step you corrected AI-generated output in a meaningful way (wrong API, a11y issue, broken layout), append one line to `docs/ai-log.md` and include that file in a following `docs:` commit, or in the same commit if it is related.
