# Octopus — Website

A responsive website for **Octopus**, a consumer-electronics brand: kitchen appliances, home security, hair care and accessories.

The project covers two pages:

- **Homepage**: a hero, a best-sellers carousel, a section for each product category, an "Explore all categories" grid, a store banner and the footer.
- **Product Detail Page** for the *Octopus Countertop Blender* (`/products/octopus-countertop-blender`): the product hero with a colour selector, a gallery with feature cards, an accordion of specifications, and best sellers.

Both pages are designed for three breakpoints (desktop ≥ 1200 px, tablet 810–1199 px, mobile < 810 px). They adapt fluidly between them, with no horizontal scrolling.

## Goals

- **Design fidelity:** layout, typography and spacing follow the design system. Design tokens are defined once.
- **Content from data:** products, categories and page sections come from local JSON. Adding a product to the data is enough for it to appear in the right places.
- **Reusable components:** product card variants, carousel, section header, accordion and button are reused across sections and pages.
- **Performance and accessibility:**
  - Lighthouse (mobile) Performance and Accessibility of at least 90;
  - semantic HTML, full keyboard navigation, visible focus and WCAG AA contrast;
  - responsive images without layout shift.
- **SEO basics:** titles, meta descriptions and Open Graph tags.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, Cache Components with partial prefetching) with React 19 and TypeScript in strict mode
- [Tailwind CSS](https://tailwindcss.com) v4: every design token lives in `app/globals.css`
- [shadcn/ui](https://ui.shadcn.com) on [Radix](https://www.radix-ui.com) primitives (button, carousel, accordion, radio group), restyled to the design system
- [Embla Carousel](https://www.embla-carousel.com) through the shadcn carousel
- [lucide-react](https://lucide.dev) icons
- [Vitest](https://vitest.dev) + Testing Library for components, [Playwright](https://playwright.dev) for end-to-end tests
- [pnpm](https://pnpm.io), Node.js 22

## Getting started

Requirements: Node.js 22 LTS and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Playwright needs a browser the first time: `pnpm exec playwright install chromium`.

`SITE_URL` sets the absolute origin used by canonical URLs, Open Graph and the sitemap. Without it, Vercel's production domain is used, then `http://localhost:3000`.

| Script | Description |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm gate` | Typecheck, lint, design-token check and build: the quality gate run before every commit |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm check:tokens` | Fails on hex/rgb colours, arbitrary px/rem values, inline styles or `grid` outside the token file |
| `pnpm test` | **All tests:** unit, then end-to-end |
| `pnpm test:unit` | Vitest component tests |
| `pnpm test:e2e` | Playwright against a production build on port 3100 |
| `pnpm shots` | Full-page screenshots of both pages at 375, 810 and 1200 px into `.shots/` |
| `pnpm format` / `pnpm format:check` | Prettier (with the Tailwind class sorter) |
| `pnpm assets` | Converts the original assets into WebP (and the hero video into WebM/MP4) under `public/` |
| `pnpm placeholders` | Generates the neutral WebP placeholders and the Open Graph image |

## Architecture

```
app/                    routes, layout, metadata, robots, sitemap, favicon; globals.css holds every token
  page.tsx              home: renders data/home.json sections in order
  products/[slug]/      the product route (only products with PDP data are generated)
  coming-soon/          placeholder for every link that leaves the two pages
components/
  ui/                   shadcn primitives restyled to the design system (button, carousel, accordion, radio group)
  layout/               header, mobile menu, footer, Section, Container, SectionHeader
  cards/                product card variants (feature, large, medium, small, compact)
  home/ pdp/            page sections
  media/                ProductImage: next/image in a fixed-ratio box, with art direction per breakpoint
  motion/               Reveal: one-shot scroll reveal
  brand/                the logo
data/                   products, categories, home sections, navigation, site metadata (JSON)
types/                  types for the data
lib/                    data access, SEO helpers, breakpoints, shared hooks
proxy.ts                sends product slugs without a page to a real 404
e2e/                    Playwright tests
scripts/                token check, asset conversion, placeholder generation
docs/                   design spec, component and content docs, AI log, Lighthouse reports
```

### Content from data
Every page reads its content through `lib/data.ts`; components never import JSON directly.

- **Category sections** come from `getProductsByCategory()` in JSON order, with no hand-picked lists. A category's `layout` decides how its cards are arranged; a category with a single product renders as a full-width banner, and one with none renders nothing.
- **Best sellers** come from `getBestSellers()`, ordered by `bestSellerRank`. The home page shows them as feature cards and the PDP as compact cards, on the same carousel primitive.
- **Adding a product** to `data/products.json` is enough for it to appear in its category section and, if it is a best seller, in both carousels.
- **Product pages** exist only for products with a `pdp` object (today the Countertop Blender). Every "Learn more" goes through `getProductHref()`, which falls back to that page. `generateStaticParams` builds only those products, and `proxy.ts` answers any other slug with a real 404.

### Design system
- **Tokens:** colours, type scale, spacing, radii and motion are defined once in `app/globals.css`. Spacing is semantic (`section-*`, `stack-*`, `card-*`, `cards`, `gutter`) and changes per breakpoint inside the token, so components use one class.
- **Breakpoints:** mobile-first with two breakpoints, `md` (810 px) and `lg` (1200 px).
- **Layout:** flexbox only. `pnpm check:tokens` rejects `grid`, arbitrary values, hex colours and inline styles in `app/`, `components/` and `lib/`; the only inline style is a swatch colour that comes from data.
- **Images:** always Next's image optimisation (`next/image` props via `getImageProps`) inside a fixed-ratio box, with `sizes`, lazy below the fold and `priority` only on the LCP candidates (home hero, first PDP image). Banners use art direction (`<picture>` with a crop per breakpoint).
- **Server first:** components are Server Components; only interactive leaves are client components (mobile menu, carousel, colour selector, accordion, hero video, scroll reveal).

### Accessibility
- Landmarks and headings in order on both pages, a skip link, and a visible focus outline everywhere (white on red backgrounds).
- The mobile menu is a disclosure (`aria-expanded`, `aria-controls`); Escape closes it and returns focus to its trigger.
- The colour selector is a radio group labelled by the visible "Colour - {name}" text; arrow keys move and select.
- The specifications accordion has `button` triggers inside headings, with Radix keyboard support.
- Carousel arrows are disabled at the start and end; the dots are named buttons with `aria-current`.
- `prefers-reduced-motion` is respected: no hero video, no carousel slide animation, no panel height animations, and the scroll reveal only fades.
- Colour pairs meet WCAG AA, including two interaction colours that were adjusted from the design (see the spec).

### Testing
`pnpm test` runs everything.

- **Unit (Vitest + Testing Library):** the data rules (`lib/data.ts`), helpers, button, product image, category section rules, Explore tiles, mobile menu, colour selector, feature bento, specifications accordion.
- **End-to-end (Playwright, production build):**
  - home → PDP through "Learn more", and a full mobile journey (menu, colour, accordion, "Where to buy");
  - no horizontal overflow on both pages at 375, 809, 810, 1000, 1199, 1200 and 1440 px;
  - the home carousel: arrows disabled at the edges, dots, keyboard and reduced motion; the product-page carousel: compact cards from data, arrows disabled at the edges, dots only when there is more than one position;
  - 404 for product slugs without a page;
  - titles, descriptions, Open Graph, canonical URLs, robots and sitemap;
  - reduced motion for the menu, the accordion and the scroll reveal;
  - the scroll reveal: below-the-fold only, deep links, focus and print.

## Decisions and trade-offs
Every place where the design and the requirements were unclear or disagreed is recorded, with its reason, in [`docs/design/spec.md` → Assumptions](docs/design/spec.md). The main ones:

- **Requirements over the design file when they conflict.** The navigation collapses into a menu below 1200 px, the best-sellers carousels have pagination dots on desktop, and two interaction colours from the design (a hover red and a light-blue focus ring) are replaced by existing palette colours because they fail WCAG AA.
- **Missing design content follows the design system.** Text missing from some tablet and mobile frames, the second product colour and the truncated product dimensions are filled in with the design system's styles and marked as placeholders in the data where relevant.
- **One product page.** Only the Countertop Blender has a product page. Other products' cards link to it, and any other product URL returns a real 404 (Cache Components rules out `dynamicParams`, so `proxy.ts` handles it before rendering).
- **Instant navigation to the product page.** The product content reads the URL inside a `<Suspense>` boundary, so the page shell is shared and prefetched once for every product link.
- **Assets.** Product shots, category tiles, banners and the hero video come from the original files, converted to WebP (and WebM/MP4) by `pnpm assets`. Slots without an asset fall back to neutral WebP placeholders of the right ratio; adding a photo only means converting it and changing a JSON path.
- **Mobile menu as a disclosure,** not a modal: it expands the navbar pill and closes on Escape, with no focus trap.
- **The "Downloads" box is the last accordion item,** so all product information follows one accessible pattern.
- **Motion is optional.** Sections fade and rise once as they scroll into view; with reduced motion they only fade, and the hero media and first product image are never animated.

## Performance
Lighthouse mobile, production build ([reports and method](docs/lighthouse/README.md)):

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Home | 100 | 100 | 100 | 100 |
| Product page | 99 | 100 | 100 | 100 |

## Next steps
- Give gallery and feature images an optional `alt` in the data for when they carry information.
- Run Lighthouse against a deployed URL: the product page's simulated LCP from a localhost trace overstates the real figure.
- Add an `apple-icon` and a `.ico` fallback next to the SVG favicon.

## How AI tools were used
- **Claude (chat):** analysis of the requirements, extraction of the design tokens from the design file (view-only), and the design of the development workflow.
- **Claude Code:** implementation, tests and documentation, branch by branch, following [`CLAUDE.md`](CLAUDE.md) and the [delivery plan](docs/plan.md).
- **Independent review:** a read-only `reviewer` subagent checked every finished branch against the requirements, the design spec and the project rules, without being told how the code was written. Its must-fix findings were fixed before merging.

### Guardrails
- A Claude Code pre-tool hook (`.claude/hooks/guard-git.mjs`) checks every git command the agent runs: it runs `pnpm gate` before every commit, enforces Conventional Commits, blocks pushes, rebases, amends and AI attribution, and allows merges only into `dev` with `--no-ff`.
- `pnpm check:tokens` keeps hand-written values out of the code, so generated code cannot drift from the design system.
- Project skills define one loop per branch: start, small gated commits, full verification (gate, unit and e2e tests, screenshots against the references, independent review), then a merge only after explicit human approval.

### What had to be corrected
Every time AI output had to be corrected, it was logged with what was wrong and how it was fixed: [`docs/ai-log.md`](docs/ai-log.md) lists 20 corrections. They fall into a few patterns:

- **Following the design file where it fails the requirements.** Interaction colours copied from the design failed WCAG AA; carousel dots were first drawn at about 1.2:1 contrast; the product-page carousel first dropped the pagination dots because the design had none.
- **Reduced motion that looked handled but wasn't.** Three times a `motion-reduce:` override, or a keyframes redefinition inside a media query, lost to a more specific or later CSS rule, so the animation still played. They were found in review, by measuring the computed animation in a real browser and by a new end-to-end test; each was fixed with `motion-safe:` or a separate animation and is now covered by an end-to-end test.
- **Design-system plumbing.** Colour tokens first sampled from anti-aliased screenshots came out too light; the default shadcn `cn` read the custom `text-cta` size as a colour and dropped it.
- **Framework behaviour.** With Cache Components, `dynamicParams` is unavailable and `notFound()` after streaming gave a 404 page with status 200; reading the URL outside `<Suspense>` blocked instant navigation (flagged by a Next.js dev insight).
- **Layout details found in screenshots.** A flex row that shrank a banner's text column, a container one gutter narrower than the navbar, a product shot rendered at half the reference size.
- **Data and interaction design.** Hand-picked product lists instead of data-driven sections; a mobile menu first built as a modal overlay; a reveal-on-focus that started moving the element between mousedown and mouseup and swallowed clicks.
