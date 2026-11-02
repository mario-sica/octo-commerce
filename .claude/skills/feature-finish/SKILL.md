---
description: Verify a finished feature branch (full tests + independent review) and prepare it for the user's merge approval. Never merges.
allowed-tools: Bash(git *), Bash(pnpm *), Read, Grep, Glob, Agent
---

# Finish feature

Branch: !`git rev-parse --abbrev-ref HEAD`
Commits on this branch: !`git log --oneline dev..HEAD`
Working tree: !`git status --short`

1. The working tree must be clean. Commit leftovers with `/checkpoint`, or stop.
2. **Run the full verification**, as separate calls:
   - `pnpm gate`: typecheck, lint, token check, build.
   - `pnpm test:unit`: Vitest.
   - `pnpm test:e2e`: Playwright. It includes the home → PDP flow and the **no-horizontal-overflow check at 375, 809, 810, 1000, 1199, 1200 and 1440 px** on both pages. It is available from the `test/e2e-setup` branch onwards.
3. **Visual self-check.** Run `pnpm shots`, which saves screenshots of both pages at 375, 810 and 1200 px to `.shots/` (git-ignored). Open the ones for the sections this branch touches and compare them with the reference images listed in `docs/plan.md`. Note any difference you are not fixing.
4. **Independent review.** Invoke the `reviewer` subagent with the branch name and the plan section. Do not tell it how you implemented things; let it read the diff (`git diff dev...HEAD`).
5. **Handle the findings.**
   - Fix every *must-fix* finding with new small commits (`/checkpoint`).
   - List the *nice-to-have* findings.
6. **Report to the user and STOP.** The report contains:
   - the commit list;
   - the test results;
   - the review findings and how each was handled;
   - the assumptions made, which also go to `docs/design/spec.md → Assumptions` if they are new;
   - this exact closing line: "Ready to merge `<branch>` into `dev`. Run `/merge-feature` to approve."

Do **not** run `git merge`. Merging is the user's decision.
