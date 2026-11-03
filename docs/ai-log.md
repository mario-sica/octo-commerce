# AI usage log

The README's "How AI tools were used" section is built from this file. Add one row per correction (`/ai-log`). Be specific and honest.

## Tools
- **Claude Code**: implementation, tests, and review through the `reviewer` subagent.
- **Claude (chat)**: brief analysis, design-token extraction from Figma in view-only mode, and the workflow design: CLAUDE.md, hooks, skills.

## Corrections

| Date | Branch | Area | What the AI produced | What was wrong | Fix |
|---|---|---|---|---|---|
| 2026-10-31 | — (planning) | Design tokens | Colours sampled from PNG screenshots | Thin strokes and small text were lighter because of anti-aliasing; the link colour `#414141` had been assumed to be `#1B1B1B` | Values re-read from the Figma Properties panel; screenshots kept only as layout references |
| 2026-11-01 | — (planning) | Design review | Missing text on the tablet frames treated as a screenshot rendering bug | The Figma frames really lack that text | Rule added to the spec: missing text uses the design system's M styles |
| 2026-11-01 | — (planning) | Data model | Category sections driven by hand-picked `featured` product lists | Contradicted the brief: "adding a product to the data should be enough" | Sections now come from the `category` field and JSON order; one-product categories render as a banner |
| 2026-11-01 | — (planning) | Accessibility | Spec copied the Figma hover (`#F23F45`) and focus ring (`#B1CBF7`) as-is | 3.77:1 and 1.65:1 fail the WCAG AA the brief requires | Replaced with existing Figma tokens `#C2151B` and `#1B1B1B`; logged as an assumption |
| 2026-11-01 | — (planning) | Images | Missing assets planned as grey `div` stand-ins | Grey divs don't exercise responsive, lazy-loaded, layout-stable images | Neutral WebP placeholder files through `next/image` |
| 2026-11-01 | — (planning) | Routing | PDP route with unrestricted `generateStaticParams` | Would build "other product pages", which are out of scope | Static params only for products with `pdp`, plus `dynamicParams = false` |
| 2026-11-02 | feat/button | UI | Button variants combining `text-cta` with a text colour through the default shadcn `cn` | `cn` read the custom `text-cta` as a colour and dropped it, so buttons lost the CTA type size and weight | `cn` built with `createCn`, registering the Octopus tokens, plus a test that keeps them in sync with `globals.css` |
| 2026-11-02 | feat/site-footer | Layout | `Container` with `px-gutter` inside `max-w-content`, as first written in the component docs | Content was one gutter narrower than the navbar pill, while the desktop reference aligns them | Outer `px-gutter` wrapper with an inner `max-w-content` box; component docs updated |
| 2026-11-02 | fix/navbar | Navigation / A11y | Mobile menu as a shadcn Sheet (Radix Dialog) overlay placed over the navbar pill | The overlay covered the navbar pill and behaved as a modal | Radix Collapsible that expands the pill itself, with focus rings drawn inset inside the clipped panel |
| 2026-11-02 | feat/home-best-sellers | Accessibility | Carousel dots specified as `bg-border` on white (Assumption 2) | About 1.2:1, below the 3:1 WCAG 1.4.11 asks for controls | Inactive dots `bg-muted-foreground`, current dot a wider `bg-foreground` pill; spec updated |
| 2026-11-02 | feat/home-best-sellers | Design fidelity | Feature card with the product shot in a 2/5-width square box | Products came out at about half the size of the reference, because the shots carry wide margins | Image box takes the card height and the shot is zoomed 1.2×; shot backgrounds matched to the card colour |
| 2026-11-02 | feat/category-sections | Accessibility | "Learn more" links with the product name in an sr-only span starting with a space | Name computation can drop that space ("Learn moreabout…" in jsdom), so the link name depended on the implementation | Space moved outside the span (`Learn more{" "}<span className="sr-only">about …</span>`) in all six components; a test checks the exact name |
| 2026-11-03 | feat/category-sections | Layout | Product banner overlay as a flex row (`lg:flex lg:items-center`) with a `lg:w-2/5` text block | The Container inside shrank to its content, so the column was 2/5 of an already narrow box and the title wrapped onto two lines | The overlay is a centred flex column, so the Container spans the page width; the text block is `lg:w-1/2` |
