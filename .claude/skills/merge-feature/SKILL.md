---
description: Merge the approved feature branch into dev with --no-ff. Only the user can invoke this.
disable-model-invocation: true
allowed-tools: Bash(git *), Bash(pnpm *)
---

# Merge approved feature into dev

Feature branch: !`git rev-parse --abbrev-ref HEAD`

1. Record the feature branch name shown above. It must be a feature branch, not `dev` or `main`, and its tree must be clean.
2. Run `git switch dev` as its own call.
3. Run `git merge --no-ff <feature-branch> -m "chore(merge): merge <feature-branch> into dev"` as its own call. Use exactly one `-m` with no trailers.
   - If there are conflicts, stop and report them. Do not resolve them silently.
4. **Verify that `dev`** builds after the merge: run `pnpm gate` and `pnpm test:unit`.
   - If anything fails, stop and report. Do not commit on `dev`. The fix goes on a new `fix/<name>` branch.
5. Delete the merged branch with `git branch -d <feature-branch>`. Lowercase `-d` only.
6. **Report:**
   - the merge commit;
   - the next branch in `docs/plan.md`;
   - a reminder that pushing, and the final `dev → main` merge, are done by the user.
