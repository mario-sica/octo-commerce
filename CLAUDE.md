# Octopus — project rules for Claude Code

A demo of two pages: the **Homepage** and the **Product Detail Page** (`/products/octopus-countertop-blender`). Each page has three breakpoints. Requirements: `docs/private/brief.md` (local only, git-ignored). Plan: `docs/plan.md`.

## Stack
- Next.js (App Router), React, TypeScript in `strict` mode, pnpm, Node 22.
- Tailwind CSS v4. Every token is in `app/globals.css`.
- shadcn/ui on **Radix** primitives (`init -b radix`). Only the components listed in `docs/components.md`.
- Icons from `lucide-react`, following the Figma → lucide mapping in `docs/components.md → Icons`. Use no other icon set and no inline SVG icons; the logo is the only exception (`components/brand/logo.tsx`, built from `docs/design/assets/`, see `docs/components.md → Logo`). Solid variants use `fill="currentColor"` plus the `icon-solid` class.
- Embla, through the shadcn `carousel`.
- Tests: Vitest with Testing Library for components, Playwright for e2e, responsive overflow checks and screenshots.

## Commands
| Command | What it does |
|---|---|
| `pnpm dev` | dev server |
| `pnpm gate` | typecheck, lint, token check, build. **This runs automatically before every commit.** |
| `pnpm test:unit` | Vitest |
| `pnpm test:e2e` | Playwright: home → PDP flow, plus the no-overflow check at 7 widths |
| `pnpm test` | unit and e2e together; the single test command |
| `pnpm shots` | screenshots of both pages at 375, 810 and 1200 px into `.shots/` |

## Git workflow (enforced by `.claude/hooks/guard-git.mjs`)
- `main` holds **only the first commit**: the bare create-next-app project plus `README.md`. You never commit to it or merge into it; the user merges `dev → main`.
- `dev` receives **only** `git merge --no-ff` from feature branches. Never commit directly on `dev`.
- One branch per feature or section, as listed in `docs/plan.md`. Branch prefixes: `feat/`, `fix/`, `test/`, `docs/`, `perf/`, `chore/`, `refactor/`.
- **Small commits.** Each commit holds one idea, and the app must build and render after every one of them.
- **Every commit and merge message is a Conventional Commit:** a type prefix (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`, `perf:`, `style:`, `build:`, `ci:`), an optional scope, and a lowercase subject of at most 72 characters. Use a single `-m` with the subject only.
  - Merges: `git merge --no-ff <branch> -m "chore(merge): merge <branch> into dev"`.
- **No AI attribution, ever.** No `Co-Authored-By`, no "Generated with Claude Code", no `--trailer`, in commits or anywhere in the repo. The hook blocks it, and `attribution` is disabled in `.claude/settings.json`.
- **Never push.** Never add or change remotes. Never rebase, amend, `reset --hard` or `--no-verify`.
- Run git commands one per Bash call. Never chain `git switch` with `git commit` or `git merge`.
- The loop is:
  1. `/feature-start <branch>`
  2. `/checkpoint` for each step
  3. `/feature-finish`
  4. **stop** until the user runs `/merge-feature`.

## Design system rules
- Values live **only** in `app/globals.css`. In `app/`, `components/` and `lib/`:
  - no hex or rgb colours;
  - no arbitrary px or rem values such as `w-[13px]`;
  - no inline style values. The only exception is values that come from data, such as the swatch colour in `style={{ backgroundColor: colour.hex }}`.

  `pnpm check:tokens` fails if any of these appear.
- **Flexbox only.** Never use `grid`, `grid-cols-*` or `inline-grid`, and that includes shadcn components (rewrite them to flex). For 2×2 layouts use `flex flex-wrap` with `basis-*`.
- Mobile-first, with only two breakpoints: `md` (810 px) and `lg` (1200 px). Page gutter `px-gutter`, content width `max-w-content mx-auto`.
- **Spacing is defined once.** Section padding, stacks, card padding and card gaps always use the semantic spacing tokens (`*-section-*`, `gap-stack-*`, `gap-cards`, `p*-card-*`). Section padding is set only through the `Section` component's props. Use raw scale steps (`gap-2`, `p-1.5`) only for small component internals.
- Focus uses the global outline (`outline-ring`). On red backgrounds use `outline-ring-inverse`. Don't reintroduce the Figma's light-blue ring or `#F23F45` hover: both fail AA (spec, Assumption 5).
- `docs/design/spec.md` says which token and typography class goes on which element at each breakpoint. Read the relevant part before building a section. If a value is missing, follow the "missing text" rule in the spec or **ask**; never invent a value.
- Reference images are in `docs/design/ref/`. The plan lists the ones to use for each branch.

## Code rules
- **Content comes from data.** Products, categories and page sections live in `data/*.json`, typed in `types/`, and are read only through `lib/data.ts`.
  - **Never hard-code or hand-pick product lists.** Category sections come from `getProductsByCategory()` in JSON order, and best sellers from `getBestSellers()`.
  - Adding one product object to `products.json` must be enough for it to appear in its category section and, if it is a best seller, in both carousels.
  - A category with one product renders as that product's banner.
- **PDP route.** There is one dynamic route, `app/products/[slug]`. `generateStaticParams` returns only `getPdpProducts()`, with `dynamicParams = false`; today that is only the Countertop Blender. Building other product pages is out of scope. "Learn more" links always go through `getProductHref()`.
- Server Components by default. Use `"use client"` only for interactive leaves: menu, carousel, colour selector, accordion, scroll-reveal.
- Reuse the components in `components/`: `Button`, `ProductCard` and its variants, `Carousel`, `SectionHeader`, `Accordion`, `Section`, `Container`. Don't duplicate them.
- **Two different best-sellers carousels:** `HomeBestSellers` (feature cards) and `PdpBestSellers` (compact cards). Both are built on the same shared `Carousel` primitive; never copy the carousel logic into either of them.
- No `any`. Use `@/` imports. File names in kebab-case and components in PascalCase.
- **Images:** always `next/image` (`fill` + `sizes`) inside a box with a fixed aspect ratio, never a `div` stand-in. Missing assets point to the neutral WebP placeholders in `public/images/placeholders/`. Only the home hero and the first PDP image get `priority`. Never put scroll-reveal on them.

## Accessibility (required)
- Use semantic landmarks: `header`, `nav`, `main`, `footer`, `section` with headings, and keep heading levels in order.
- Every interactive element is a `button` or `a` with an accessible name. Never make a `div` clickable.
- Menu and accordion triggers have `aria-expanded` and `aria-controls`. The menu closes on Escape and returns focus to its trigger.
- The colour selector is a radiogroup. Carousel arrows are disabled at the start and end.
- Focus is visible (`:focus-visible` ring). Contrast is WCAG AA. Respect `prefers-reduced-motion`.

## Out of scope — do not build
Cart, checkout, accounts, search, CMS or backend, other product or category pages (only the Countertop Blender PDP is generated), the store locator, contact forms, cookie banners. Links that go outside the two pages point to the placeholder route `/coming-soon`.

## README
- `README.md` presents Octopus as a product project: what it is, stack, setup, architecture, decisions, how AI tools were used.
- **It describes the product only.** No reference to why, how or for whom the project was produced. The same goes for every file committed to the repo. That kind of context stays in `docs/private/`, which is git-ignored.

## Docs to keep up to date
- `docs/ai-log.md`: add a row every time AI output had to be corrected (`/ai-log`).
- `docs/design/spec.md → Assumptions`: record every decision where the brief or the Figma is unclear or contradictory.
