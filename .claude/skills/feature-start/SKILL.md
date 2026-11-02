---
description: Start a feature branch from dev for the next item in docs/plan.md. Use when beginning any new section or feature.
argument-hint: <branch-name e.g. feat/carousel>
allowed-tools: Bash(git *), Read, Grep, Glob
---

# Start feature: $ARGUMENTS

Current state:
- Branch: !`git rev-parse --abbrev-ref HEAD`
- Working tree: !`git status --short`

Steps:

1. **Preconditions.** The working tree must be clean and the current branch must be `dev`.
   - If the tree is not clean, stop and report.
   - If you are on another branch, it must already be merged. Then run `git switch dev`.
2. **Branch name.** Validate `$ARGUMENTS` against `^(feat|fix|chore|test|docs|perf|refactor)/[a-z0-9-]+$` and check that it matches a branch in `docs/plan.md`. If the name doesn't match, stop and ask.
3. Create the branch with `git switch -c $ARGUMENTS`, as its own Bash call.
4. **Re-read what applies:**
   - the section of `docs/plan.md` for this branch;
   - the relevant parts of `docs/design/spec.md`, `docs/components.md` and `docs/content.md`;
   - the reference screenshots listed for this branch in the plan.
5. **Write a short plan.** List each commit you will make: message, files touched, and why the app still builds and renders after it. Keep commits small, about 1–3 files and one idea each. Present the plan, then start working on the first commit.

Rules reminder:
- Commit with `/checkpoint`.
- Never commit to `dev` or `main`.
- Never push.
- Use flexbox only, never grid.
- Use tokens only: no hex values and no px or rem arbitrary values.
