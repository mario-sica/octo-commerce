# Delivery plan

Each branch starts from `dev` (`/feature-start`), is built through small gated commits (`/checkpoint`), is verified with `/feature-finish`, and is merged by the user with `/merge-feature`.

**Every commit must leave the app building and rendering.** To make that true, a component is introduced together with its first use, or behind data that renders it. Never leave a page importing something that doesn't exist yet.

Commit lists are guidance. Split them further if a step grows past one idea.

## Reference images (`docs/design/ref/`, local only, git-ignored)
Design screenshots used as visual references. They stay on the developer's machine and are never committed.

- `pages/home-desktop.png`
- `pages/home-tablet.png`
- `pages/home-mobile.png`
- `pages/pdp-desktop.png`
- `pages/pdp-tablet.png`
- `pages/pdp-mobile.png`
- `navbar.png`
- `heading.png`
- `card-carousel-home.png`
- `carousel-pdp-large.png`
- `carousel-pdp-medium.png`
- `carousel-pdp-small.png`
- `card-large.png`
- `card-medium.png`
- `card-small.png`
- `pdp-info.png`
- `pdp-specs.png`

---

## 0 · Bootstrap, on `main` (the only commit ever made on main)

The first commit is **the bare create-next-app project, with only the README replaced**. There is no workflow, no shadcn and no tokens in it.

1. **User:** create the app without its automatic git commit:
   `pnpm create next-app@latest octopus --ts --eslint --tailwind --app --no-src-dir --import-alias "@/*" --use-pnpm --disable-git`
2. **User:** in the new folder, run `git init -b main`, then unzip the workflow bundle there.
   - The bundle adds `CLAUDE.md`, `.claude/`, `docs/` and `scripts/`, which stay **untracked** for now.
   - Its `README.md` replaces the create-next-app one.
   - The requirements summary is kept locally in `docs/private/`. This folder is never committed (see branch 1).
3. **Claude:**
   1. Review `README.md`. It describes the product only, with no reference to why, how or for whom the project was produced.
   2. Stage only the create-next-app files and the README, as one call:
      `git add . ':!CLAUDE.md' ':!.claude' ':!docs' ':!scripts'`
   3. Check with `git status --short` that nothing from the bundle is staged.
   4. Commit: `chore: initial next.js project`. For this first commit the hook gate runs only `pnpm build`, because the project doesn't have a `gate` script yet.
4. Run `git switch -c dev`. This creates a branch, not a commit. **From here on, main is frozen.**

## 1 · `chore/workflow-setup`
This is the first feature branch. It turns the bare app into the gated workflow. Every commit builds.
- Commits:
  1. `chore(tooling): add gate scripts and design-token guard`.
     - Add the `package.json` scripts below, without the test scripts yet.
     - Add `scripts/check-tokens.mjs`.
     - Replace the demo `app/page.tsx` with a minimal flex-only placeholder (a `main` with an `h1` "Octopus"), because the demo uses `grid` and arbitrary values.
     - Delete the demo SVGs in `public/`.
     - In `eslint.config.mjs`, add `.claude/**` and `docs/**` to the ignores.
  2. `chore(workflow): add claude code rules, hooks and skills`.
     - Add `CLAUDE.md` and `.claude/`.
     - In `.gitignore`, add the block in `docs/plan.md → .gitignore additions`.
  3. `docs: add design spec, plan, components and content docs`. Adds `docs/` except `docs/private/`.
  4. `chore(ui): initialise shadcn with radix primitives`.
     - Run `pnpm dlx shadcn@latest init -b radix`.
     - Keep the generated `globals.css` for now; the tokens arrive in branch 3.
     - Remove the `.dark` block.

`package.json` scripts. The test scripts are added in branch 2.
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "check:tokens": "node scripts/check-tokens.mjs",
  "gate": "pnpm typecheck && pnpm lint && pnpm check:tokens && pnpm build",
  "test:unit": "vitest run",
  "test:e2e": "playwright test --grep-invert @shots",
  "shots": "playwright test --grep @shots",
  "test": "pnpm test:unit && pnpm test:e2e"
}
```

### .gitignore additions (branch 1)
```gitignore
# local-only project material
/docs/private/
/docs/design/ref/

# claude code personal settings
/.claude/settings.local.json

# playwright
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
/.shots/
```

## 2 · `chore/tooling-tests`
- Add the `test:*` and `shots` scripts.
- Install the dev dependencies: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `@playwright/test`.
- Commits:
  1. `chore(test): add vitest with testing library and jsdom`. Includes `vitest.config.ts` and `vitest.setup.ts`, which mocks `matchMedia`, `IntersectionObserver` and `ResizeObserver` for Embla, plus one sanity test.
  2. `chore(test): add playwright config with chromium project`.
     - `webServer` runs `pnpm build && pnpm start -p 3100`, with `reuseExistingServer`.
     - Only the Chromium project runs locally.
  3. `chore(lint): add prettier with tailwind class sorting`. Optional; skip it if it adds friction.

## 3 · `feat/design-tokens`
- References: `docs/design/spec.md` and `docs/design/globals.octopus.css`.
- Commits:
  1. `feat(tokens): add octopus design tokens and tailwind theme`.
     - Copy `docs/design/globals.octopus.css` into `app/globals.css`, keeping shadcn's `tw-animate-css` import.
     - Remove the `.dark` block and shadcn's default colour variables.
     - Check that `components.json` still points to `app/globals.css`.
  2. `feat(fonts): load satoshi variable with next/font/local`.
     - Download `Satoshi-Variable.woff2` from Fontshare into `app/fonts/`. It is free for commercial use under the Fontshare licence.
     - Set `display: "swap"` and `variable: "--font-satoshi"`.
  3. `feat(layout): add container, section and base page shell`.
     - Root layout `<html lang="en">`, a skip link, and a `main` holding a temporary heading.
     - `Section` takes `top`/`bottom` props that map to the `*-section-*` spacing tokens, so section padding is defined only there.

## 4 · `feat/data-layer`
- References: `docs/components.md → Data model` and `docs/content.md`.
- Commits:
  1. `feat(data): add typed product, category and section models`. Includes `ProductDetail` (`pdp`), `Category.layout` and `bestSellerRank`.
  2. `chore(media): add neutral webp placeholder generator`.
     - Adds `scripts/generate-placeholders.mjs`, which uses `sharp` (already a Next dependency).
     - Outputs `public/images/placeholders/*.webp`, and the generated files are committed.
  3. `feat(data): add products and categories json from figma content`. JSON order follows `docs/content.md`.
  4. `feat(data): add home sections and navigation json`
  5. `feat(data): add data access helpers`, in `lib/data.ts`: `getProductsByCategory`, `getBestSellers`, `getPdpProducts`, `getProductHref`…
  6. `test(data): adding a product to the json is enough to show it`. Asserts each of these:
     - a new kitchen product joins `getProductsByCategory("kitchen")`;
     - a new best seller joins `getBestSellers()`, and one without a rank goes last;
     - a product without `pdp` links to the default PDP;
     - only products with `pdp` are in `getPdpProducts()`.

## 5 · `feat/button`
- References: the spec's "Buttons" section and `docs/components.md → Icons`.
- Commits:
  1. `feat(ui): add shadcn button` (unchanged).
  2. `feat(ui): restyle button variants to octopus tokens` (`primary`, `special`, `ghost`, `ghostDark`; `icon` size).
  3. `test(ui): button renders as link with asChild and is keyboard focusable`

## 6 · `feat/site-header`
- References: `navbar.png` and `pages/*` (top of each page).
- Commits:
  1. `feat(brand): add logo component with full, mark and stacked variants`. Converts the three files in `docs/design/assets/` into `components/brand/logo.tsx` (see `docs/components.md → Logo`).
  2. `feat(header): add sticky navbar pill with logo and desktop nav`. `mark` below `md`, `full` from `md`, inside a link to `/`. Data comes from navigation.json.
  3. `feat(header): add mobile menu with shadcn sheet below 1200px`. Hidden at `lg`; trigger with `aria-expanded`/`aria-controls`.
  4. `test(header): menu opens, closes on escape and restores focus`
- **Assumption:** the menu collapses below 1200 px, following the requirements. The Figma shows the full nav on tablet.

## 7 · `feat/site-footer`
- References: `pages/*` (bottom of each page).
- Commits:
  1. `feat(footer): add footer with product and learn columns from data`. `stacked` logo; flex columns on `lg`/`md`, stacked on mobile.
  2. `feat(routes): add coming-soon placeholder route`

## 8 · `test/e2e-setup`
- Commits:
  1. `test(e2e): check no horizontal overflow at 7 widths on home`. Widths: 375, 809, 810, 1000, 1199, 1200, 1440.
  2. `test(e2e): add @shots screenshot script for both pages`
- From this branch on, `/feature-finish` runs the overflow check on every feature.

## 9 · `feat/home-hero`
- References: `pages/home-*`.
- Commits:
  1. `feat(media): add product image with next/image and aspect box`. Always `next/image` with `fill` and `sizes`; `priority` only through a prop.
  2. `feat(home): add hero with overlay text on every breakpoint`. Uses the 16:9 placeholder with `priority`. The text is the mobile Figma hero copy, used everywhere (spec, Assumption 9).

## 10 · `feat/home-best-sellers`
- References: `card-carousel-home.png` and `pages/home-*`.
- The homepage and the PDP have **two different carousels**. This branch builds the shared `Carousel` primitive and the **home** one; the PDP one comes in branch 16.
- Commits:
  1. `feat(ui): add shadcn carousel` (unchanged).
  2. `feat(carousel): add pagination dots and bottom-right arrow row`. This stays in the shared primitive, so both carousels get it.
  3. `feat(home): add section header with responsive type scale`. Supports `align`, an optional subtitle and an optional CTA; reused later on the PDP.
  4. `feat(cards): add feature product card variant`
  5. `feat(home): render home best sellers carousel from data`. `HomeBestSellers`: one feature card plus a peek; title through `SectionHeader`.
  6. `test(carousel): arrows disable at edges, dots reflect and change slide`
- **Assumption:** the requirements ask for dots on desktop, and the Figma has none. Dots are shown from `lg` up, styled with tokens.

## 11 · `feat/category-sections`
- References: `heading.png`, `card-large.png`, `card-medium.png`, `card-small.png`, `pages/home-*`, and the spec's "Category section rule".
- Sections are generated from `getCategories()` and `getProductsByCategory()`. There are **no hand-picked product lists anywhere**.
- Commits:
  1. `feat(cards): add large product card with horizontal and vertical layouts`
  2. `feat(cards): add medium product card with both orientations`
  3. `feat(home): render category sections from data with large-horizontal layout`. Kitchen renders: Kettle in the large slot, 2 medium cards, then Air Fryer as an extra row.
  4. `feat(home): support large-vertical layout for home security`
  5. `feat(cards): add small product card`
  6. `feat(home): support small layout for accessories`
  7. `feat(home): render single-product categories as product banner`. Hair Care becomes the hair dryer banner, with art direction through `getImageProps`.
  8. `test(home): category section renders banner for one product and cards for many`
- Each section gets an `id` matching its category (`#kitchen`, `#hair-care`…), for the nav and Explore links.

## 12 · `feat/explore-store-banner`
- References: `pages/home-*`.
- Commits:
  1. `feat(home): add explore all categories tiles`. Flex-wrap 2×2 on mobile.
  2. `feat(home): add find us at store banner`

## 13 · `feat/pdp-route`
- References: `pdp-info.png` and `pages/pdp-*`.
- Commits:
  1. `feat(pdp): add product route generated only for products with pdp data`.
     - `generateStaticParams` maps over `getPdpProducts()`; other slugs get a 404 from `proxy.ts` (`dynamicParams` is not available with `cacheComponents`).
     - Includes `notFound()` and the page shell.
  2. ~~`feat(cards): link learn more through getProductHref`~~: already true on `dev` (every card, the hero and the product banner link through `getProductHref()` since `feat/category-sections`).
  3. `feat(pdp): add product info with title and description`
  4. `feat(ui): add radio group rewritten to flex as colour selector`
  5. `feat(pdp): add where to buy below the colour selector`. On every breakpoint, with no fixed bar (spec, Assumption 8).
  6. `test(pdp): selecting a colour updates selected state and label`
- **Layout:** two columns on `md` and `lg`, with the right column sticky. A single column on mobile, in the order image → info → colour → Where to buy → gallery.
- **Out of scope check:** only `/products/octopus-countertop-blender` is built, and any other slug returns 404.

## 14 · `feat/pdp-gallery`
- References: `pages/pdp-*`.
- Commits:
  1. `feat(pdp): add product gallery images with 3:4 placeholders`
  2. `feat(pdp): add feature bento cards from data`

## 15 · `feat/pdp-specs`
- References: `pdp-specs.png` and `pages/pdp-*`.
- Commits:
  1. `feat(ui): add shadcn accordion` (unchanged).
  2. `feat(pdp): render specifications accordion from product data`
  3. `feat(pdp): add downloads as last accordion item`
  4. `test(accordion): toggles with keyboard and exposes aria-expanded`

## 16 · `feat/pdp-best-sellers`
- References: `carousel-pdp-large.png` (≥ 1200), `carousel-pdp-medium.png` (810–1199), `carousel-pdp-small.png` (< 810) and `pages/pdp-*`.
- Commits:
  1. `feat(cards): add compact product card variant`. Image on top (`bg-card`, `rounded-card`), name and description below.
  2. `feat(pdp): add pdp best sellers carousel`. `PdpBestSellers` reuses the shared `Carousel` primitive, `SectionHeader` and `getBestSellers()`: 5 cards visible on `lg`, 3 plus a peek on `md`, 2 plus a peek on base.
  3. `test(pdp): pdp carousel shows compact cards and disables arrows at the edges`

## 17 · `feat/seo`
- Commits:
  1. `feat(seo): add metadata and open graph for home`
  2. `feat(seo): add generateMetadata for product pages`
  3. `feat(seo): add og image placeholder, robots and sitemap`
  4. `feat(seo): add favicon from the logo mark`. `app/icon.svg`, the mark in brand red.

## 18 · `test/e2e-flow`
- Commits:
  1. ~~`test(e2e): home learn more on countertop blender opens pdp`~~: already on `dev` (`e2e/pdp.spec.ts`, since `feat/pdp-route`).
  2. ~~`test(e2e): extend overflow check to pdp`~~: already on `dev` (`e2e/overflow.spec.ts` loops over both pages, since `feat/pdp-route`).
  3. `test(e2e): walk the home to pdp journey on mobile`. One path at 375 px through acceptance criteria 2, 4, 7 and 8, ending on `/coming-soon`.
  4. `test(e2e): check titles, descriptions and open graph on both pages`. Plus robots and the sitemap.

## 19 · `feat/motion`
This branch is a bonus: only do it if branches 1–18 are done.
- Commits:
  1. `feat(motion): add one-shot scroll reveal with reduced motion fallback`
     - Never apply it to LCP elements (hero media, first PDP image), because opacity 0 would delay LCP and cost Lighthouse points.
  2. `feat(motion): apply reveal to home and pdp sections`

## 20 · `perf/lighthouse`
- Commits:
  1. ~~`perf(images): tune sizes and priority for lcp`~~: nothing to change. The hero poster and the first PDP image already have `priority`, the PDP image is served at 750 w for a 412 px phone (14 KiB), and no image audit fails. The PDP's simulated LCP is largely an artifact of simulating from a localhost trace (`docs/lighthouse/README.md`).
  2. ~~`fix(a11y): address lighthouse findings`~~: none; Accessibility is 100 on both pages.
  3. `docs(lighthouse): add mobile reports for both pages`, saved to `docs/lighthouse/`.

## 21 · `docs/readme`
- `README.md` has existed since the first commit. This branch completes it.
- **README rule:** it presents Octopus as a product project, with no reference to why, how or for whom it was produced (see `CLAUDE.md → README`).
- Commits:
  1. `docs(readme): add setup, scripts and architecture`
  2. `docs(readme): add trade-offs, assumptions and next steps`
  3. `docs(readme): add ai usage and corrections from ai-log`

---

## Handled by the user, outside Claude Code
- **Real assets:** when more original files are available (the PDP lifestyle and feature photos), drop them into `docs/Octopus_assets/`, add them to `scripts/convert-assets.mjs` and change the JSON paths on a `chore/real-assets` branch.
- **Push** the branches and **merge `dev → main`** at the end.
- **Deploy:** connect the GitHub repo to Vercel and add the live link to the README.
- Run Lighthouse on the live URL. This can go back into branch 20 as an update.
