# Octopus — Design spec

Token **values** live only in `app/globals.css` (source: `docs/design/globals.octopus.css`). This file says **which token goes where**, how sections compose, and which assumptions were made.

Source: the Octopus design file (Figma), which is view-only with export disabled. It was inspected on 31 Oct 2026. Reference images are in `docs/design/ref/` (local only).

Legend: ✅ read from Figma · ≈ estimated · ? not in Figma, see the missing-text rule

---

## Breakpoints (mobile-first)
| Name | Range | Gutter (`px-gutter`) | Figma frame |
|---|---|---|---|
| base | < 810 | 16 | 402 |
| `md` | 810–1199 | 32 | 810 |
| `lg` | ≥ 1200 | 48, content `max-w-content` (1344) | 1600 |

## Spacing tokens (defined once, in `globals.css`)
Every recurring layout value is a semantic token that changes per breakpoint inside the token file. **Components use the token, never a raw scale step, for these roles.**

| Utility | base → md → lg (px) | Role |
|---|---|---|
| `px-gutter` | 16 → 32 → 48 ✅ | page side margin |
| `*-section-sm` | 40 → 48 → 60 | short section padding: Kitchen and Security top, Best sellers bottom |
| `*-section-md` | 64 → 96 → 120 | standard section padding: Best sellers top, Accessories, Explore top |
| `*-section-lg` | 80 → 120 → 180 | long section padding: category bottom, Explore bottom, PDP bottom |
| `gap-stack-xs` | 16 | title ↔ description inside cards |
| `gap-stack-sm` | 24 → 32 → 32 | heading block (title / subtitle / CTA), card text ↔ image |
| `gap-stack-md` | 24 → 32 → 40 | "Best sellers" title ↔ carousel |
| `gap-stack-lg` | 32 → 40 → 48 | "Explore" title ↔ tiles |
| `gap-stack-xl` | 40 → 56 → 80 | section header ↔ cards; PDP column gap and left-column stack |
| `gap-cards` | 16 → 16 → 24 | between cards (rows and columns) |
| `p*-card-sm` | 24 → 32 → 40 | small card, tile sides, bento card |
| `p*-card-md` | 32 → 40 → 64 | medium card top, tile top and bottom |
| `p*-card-lg` | 24 → 40 → 80 | large card, medium card sides, carousel feature card |

The lg values are ✅. The base and md values are ≈, taken from the full-page screenshots; adjust them **in the token file only**.

## Colour mapping
| Element | Utility |
|---|---|
| Page and section background | `bg-background` |
| Cards, category tiles, product images, accordion | `bg-card` |
| Titles, product names | `text-foreground` |
| Descriptions, subtitles, spec lists, "Colour - …" | `text-muted-foreground` |
| Category label above product name (home carousel) | `text-brand` |
| Navbar links, "User manual" | `text-subtle-foreground` |
| Footer | `bg-brand text-brand-foreground` |
| Navbar pill | `bg-navbar shadow-navbar backdrop-blur-navbar` ✅ |
| Store banner top border | `border-t border-border-light` |
| Logo in navbar and mobile menu | `text-brand` (the SVG uses `currentColor`) |
| Logo in footer | `text-brand-foreground` |
| Focus | global `outline-2 outline-offset-2 outline-ring`; on `bg-brand` use `outline-ring-inverse` |

## Typography

**Missing-text rule.** The Figma lacks some text: on tablet, the section headings, subtitles and card text; on the PDP for tablet and mobile, the title and description. We add it following the design system:
- **tablet (`md`)**: use the **M** variant of the desktop style, for example `text-h1-l` becomes `text-h1-m`;
- styles without an M variant (Title, Body, CTA) stay the same as desktop;
- text placement inside cards follows `card-*.png` and `heading.png`;
- **mobile**: use the base column below.

| Element | base (<810) | `lg` (≥1200) |
|---|---|---|
| Hero title (all breakpoints, see Assumption 9) | `text-h2-s` ✅ | `text-h2-l` ≈ |
| Hero subtitle | `text-subtitle-s` ✅ | `text-subtitle-l` ≈ |
| Category section heading | `text-h2-s` ✅ | `text-h1-l` ✅ |
| Section subtitle | `text-subtitle-s` ✅ | `text-subtitle-l` ✅ |
| "Best sellers", "Explore all categories" (SectionHeader, left-aligned, no subtitle) | `text-h3-s` ? | `text-h3-l` ✅ |
| Home carousel: category label | `text-body-lg font-book` ? | `text-body-lg font-book` ✅ |
| Home carousel: product name | `text-h3-s` ? | `text-h3-l` ✅ |
| Home carousel: description | `text-body-lg font-book` ? | `text-title font-book text-muted-foreground` ✅ |
| Large / medium card: name | `text-h3-s` ✅ | `text-h3-l` ✅ |
| Large card: description (**foreground** colour) | `text-body-lg font-book` ✅ | `text-title font-book` ✅ |
| Small card: name | `text-title-lg font-bold` ? | `text-title-lg font-bold` ✅ |
| Small card: description | `text-body-lg font-book text-muted-foreground` ? | `text-title font-book text-muted-foreground` ✅ |
| Product banner: title | `text-h2-s` ✅ | `text-h2-l` ✅ |
| Product banner: subtitle (foreground) | `text-subtitle-s` ✅ | `text-subtitle-l` ✅ |
| Store banner "Find us at" (white) | `text-h3-s font-book` ? | `text-h3-l font-book` ≈ |
| Category tile label | `text-title font-book` ? | `text-title font-book` ✅ |
| Navbar links, button labels | `text-cta` ✅ | `text-cta` ✅ |
| Footer column titles | `text-body font-bold` ✅ | `text-body font-bold` ✅ |
| Footer links | `text-cta` ✅ | `text-cta` ✅ |
| Footer copyright, "Policies & Terms" | `text-label` ≈ | `text-label` ≈ |
| PDP title | `text-h2-s` ? | `text-h2-l` ✅ |
| PDP description, "Colour - …" | `text-body font-book text-muted-foreground` ✅ | same ✅ |
| Bento title | `text-title font-bold` ✅ | `text-title font-bold` ✅ |
| Bento description (foreground) | `text-body font-book` ✅ | `text-body font-book` ✅ |
| Accordion trigger (including "Downloads") | `text-body font-bold` ✅ | `text-body font-bold` ✅ |
| Accordion content | `text-body font-book text-muted-foreground` ✅ | same ✅ |
| PDP compact card: name | `text-body-lg font-bold` ≈ | `text-title font-bold` ≈ |
| PDP compact card: description | `text-body font-book text-muted-foreground` ≈ | `text-body-lg font-book text-muted-foreground` ≈ |

## Buttons (`components/ui/button.tsx`, `cva`)
| Variant | Default | Hover | Pressed (`active:`) | Disabled |
|---|---|---|---|---|
| `primary` | `bg-primary border-primary-stroke text-primary-foreground` | `bg-primary-hover` (= stroke red, see Assumption 5) | `bg-primary-pressed` | `bg-disabled border-disabled text-disabled-foreground` |
| `special` | `bg-secondary border-border text-secondary-foreground` | `bg-secondary-hover` | `bg-secondary-pressed` | `bg-disabled text-disabled-foreground` |
| `ghost` | `text-subtle-foreground` | `bg-accent text-foreground` | `bg-muted` | `text-disabled-foreground` |
| `ghostDark` | `text-brand-foreground` (on brand) | underline | — | — |

Common to every variant:
- `inline-flex items-center gap-2.5 h-10 px-4 border rounded-pill text-cta`.
- Icon-only buttons use `size-10 px-0`.
- Focus: the global `outline-ring`; on brand backgrounds, `outline-ring-inverse`.

Where each variant is used:
- `special`: carousel arrows, "Explore all products", "Find your nearest store".
- `primary`: "Learn more", "Where to buy".

## Colour selector
- Ring: `size-11 rounded-full border-2 border-transparent p-1.5`. When selected it adds `border-primary` ✅.
- Swatch: `size-7.5 rounded-full border border-swatch-stroke`. The colour comes from data through `style`.
- Semantics: Radix RadioGroup (`role="radiogroup"`). The visible label "Colour - {name}" updates on change.

---

## Homepage composition ✅ (data-driven)

Section order comes from `data/home.json`:

hero → best sellers → **one section per category, in `categories.json` order** (Kitchen, Hair Care, Home Security, Accessories) → explore → store banner → footer.

### Category section rule (`CategorySection`)
`products = getProductsByCategory(category.id)`, in JSON order.

| Products in category | Renders | Today |
|---|---|---|
| 0 | nothing | — |
| 1 | **Product banner** for that product: title, subtitle, "Learn more", image. No section header. | Hair Care (Ionic Hair Dryer) ✅ matches Figma |
| ≥ 2 | **SectionHeader** (category name, tagline, "Explore all products") + cards laid out by `category.layout` | Kitchen, Home Security, Accessories |

| `category.layout` | Slot 1 | Slots 2…n | Figma |
|---|---|---|---|
| `large-horizontal` | Large card, horizontal, image background | Medium **vertical** cards, rows of 2 | Kitchen |
| `large-vertical` | Large card, vertical, image background, next to… | …a column of 2 Medium **horizontal** cards; further products go in rows of 2 Medium below | Home Security |
| `small` | — | Small cards, rows of 3 | Accessories |

A single leftover card in the last row grows to the full row width: a medium card alone in its row turns `wide` (text left, image right, 16:9 from `md`) instead of becoming a full-width 3:4 card. On base, everything stacks into one column. `large-vertical` is the side-by-side layout only from `lg`; on `md` it behaves like `large-horizontal`, as in the tablet reference. Cards (≈, from card-large/medium/small.png and the page references):
- **Large:** `p-card-lg`, full-image background from the product's `lifestyleImage` (Assumption 24); 2:3 with the text on top on base, 16:9 with the text on the left half from `md`; `vertical` turns back to text-on-top from `lg` and stretches to the height of its row.
- **Medium:** text `pt-card-md px-card-lg` above the product shot, which fills the rest of the card with `object-contain`; 3:4. `horizontal` (Home Security column, `lg` only): 4:3, text on the left half with `px-card-sm`, because `card-lg` sides leave too little room for the text.
- **Small:** `p-card-sm`; text above a square product shot on base, the image first from `md`.
- Each section has `id={category.id}` and `scroll-mt-header`, so the navbar links land below the sticky header.

### Section spacing
| Section | Padding | Inner gap |
|---|---|---|
| Best sellers | `pt-section-md pb-section-sm` | `gap-stack-md` |
| Category (≥ 2 products) | `pt-section-sm pb-section-lg` | header ↔ cards `gap-stack-xl`, cards `gap-cards` |
| Accessories | `py-section-md` | same |
| Product banner | none; full-bleed; ratios and text placement in Assumption 23 | content `gap-stack-sm`, text block `py-stack-xl` when stacked |
| Explore | `pt-section-md pb-section-lg` | `gap-stack-lg`, tiles `gap-cards` |
| Store banner | none; ratios in Assumption 23, `border-t border-border-light` | content `gap-stack-sm` |
| Footer | `pt-section-sm pb-6` | columns `gap-stack-xl` |

### Section details
- **Navbar (sticky):**
  - wrapper `sticky top-0 z-50 h-header px-gutter pt-4`: a fixed height, so the open mobile menu overlaps the page instead of pushing it down;
  - pill `mx-auto max-w-content min-h-16 rounded-pill pl-5 pr-3 py-3 flex flex-wrap items-center justify-between` (64 px tall when closed);
  - from `lg`: logo, links and primary CTA; below `lg`: logo plus an icon-only menu button that expands the pill downwards (Assumption 22);
  - logo: `Logo variant="mark"` with `h-5.5` below `md`, and `Logo variant="full"` with `h-6` from `md` ≈ (see `components.md → Logo`).
- **Hero:** full-bleed, art-directed media (`priority` poster, video loop over it, Assumption 25): 1:2 on base, 3:4 on `md`, 16:9 on `lg` (Assumption 20). It slides under the navbar with `-mt-header` (Assumption 21). The overlay text is centred horizontally and starts below the pill (`pt-header`, then `pt-stack-md`): title and subtitle `gap-2` ≈, then `gap-stack-sm` to the CTA.
- **Best sellers (home carousel, reference `card-carousel-home.png`):**
  - `feature` cards with `p-card-lg`: text on the left and image on the right from `md`, in a 5:3 (`md`) / 16:9 (`lg`) card ≈; on base, text above the image, centred, and the card takes its content's height;
  - 1 card visible plus a peek of the next: slides are `basis-7/8` on base, `basis-11/12` on `md`, `basis-4/5` on `lg` ≈, spaced by `gap-cards`;
  - the peek runs past the content column to the page edge, as in the references: the Embla viewport is not clipped and the section clips at the page edge (`overflow-x-clip`), so the page never scrolls sideways;
  - the product image is the full card height from `md` (full width on base) and zoomed 1.2× ≈, because the product shots carry wide margins in the card colour;
  - arrows bottom-right (`special` icon buttons), dots from `lg` (Assumption 2); title ↔ carousel ↔ controls `gap-stack-md`.
- **Explore:** square tiles (`pt-card-md pb-card-md px-card-sm`), the product shot contained and zoomed 1.2× (its built-in margins, as in the best-sellers cards), label below. Four in a row on `md` and `lg`, 2×2 on base: two nested flex rows of two (not `flex-wrap` with `basis-1/2`, which would need the gap subtracted from the basis), so every tile has the same width.
- **Banners:** full-bleed and art-directed (see `components.md`); ratios and where the text sits follow Assumption 23.
- **Footer:**
  - `lg`/`md`: logo on the left (`Logo variant="stacked"`, `h-26` ≈); "Our Products" (2 columns) and "Learn" on the right; a bottom bar with copyright and "Policies & Terms";
  - base: everything stacked.
  - internals ≈, measured from the full-page screenshots:
    - column title ↔ link list: `gap-stack-sm`;
    - link rows: `h-9` on base, `h-7` from `md`;
    - "Our Products" columns: CSS `columns-2` with `gap-x-10`, which fills top to bottom like the Figma (Kitchen, Home Security | Hair Care, Accessories). It is multi-column, not `grid`, and `flex-wrap` would fill row by row (Assumption 18);
    - bottom bar: `gap-1` between copyright and "Policies & Terms" on base.

## PDP composition ✅
- **`md` and `lg`:** two columns in `max-w-content`, `gap-stack-xl`.
  - **Left column** (flex 709/555), `gap-stack-xl pb-section-lg`. In order:
    1. product image (`aspect-3/4`, `priority`): the 1:1 shot contained on `bg-card`, square corners, under the navbar (`-mt-header`) and out to the page edge on the left (`-ml-gutter`), as in the references; full-bleed on base;
    2. lifestyle image;
    3. feature bento (`gap-cards`; Assumption 26);
    4. second lifestyle image;
    5. specifications accordion, whose last item is "Downloads".
  - **Right column** (555), `sticky top-24 pt-section-md`, `gap-stack-sm`. In order: title, description, colour selector (block gap 12), **"Where to buy"** (`w-full`).
- **Base:** a single column. In order:
  1. product image;
  2. title and description;
  3. colour selector;
  4. **"Where to buy"**;
  5. gallery and bento;
  6. accordion;
  7. Best sellers;
  8. footer.
- **Best sellers (PDP carousel, different from the home one):** SectionHeader "Best sellers" with `compact` cards: 5 visible on `lg`, 3 plus a peek on `md`, 2 plus a peek on base. Arrows bottom-right, dots from `lg` when there is more than one snap (Assumption 2). Built on the same `Carousel` primitive as the home carousel (Assumption 28). References: `carousel-pdp-large.png`, `carousel-pdp-medium.png`, `carousel-pdp-small.png`.
- **Accordion:** `rounded-card bg-card px-5 py-1`, items `border-b`, trigger `py-4`, content `gap-2` (Assumption 27).

## Radius
| Utility | Value |
|---|---|
| `rounded-pill` (buttons, navbar) | 32 ✅ |
| `rounded-card` (cards, images, accordion, tiles) | 16 ≈ |

## Images
- Every image is a real file rendered with `next/image` inside an aspect-ratio box (`fill` + `sizes`). This gives responsive `srcset`, lazy loading below the fold, and no layout shift.
- Only the hero (home) and the first product image (PDP) get `priority`.
- Product shots, Explore tiles and the category and store banners are the original assets, converted to WebP by `scripts/convert-assets.mjs` (see `docs/content.md → Images`). The home hero is a video loop over a WebP poster (Assumption 25). Slots whose asset is still missing (PDP lifestyle and bento images) use **neutral WebP placeholders** (`bg-card` colour, one per aspect ratio) made by `scripts/generate-placeholders.mjs`. SVG is not used, because Next doesn't optimise it.

## Motion (bonus)
- `animate-reveal` on media blocks and `animate-reveal-text` on text-only blocks.
- Plays once, when the section enters the viewport (IntersectionObserver, threshold about 0.15).
- All elements of a section fire together, with no stagger.
- With reduced motion, only the opacity animates.
- **Never on the LCP element** (hero media, PDP first image).

---

## Assumptions (copy them into the README)
1. **Menu:** the Figma shows the full nav on tablet, but the brief requires it to collapse below 1200 → **follow the brief**.
2. **Carousel dots:** missing in the Figma, required by the brief on desktop → shown from `lg` up, styled with tokens: 6 px dots in `bg-muted-foreground` (≈7:1 on white; `bg-border` would be ≈1.2:1 and fail WCAG 1.4.11), the current one a 16 px `bg-foreground` pill so it differs by shape too; each dot sits in a 24 px button.
3. **Assets:** images were meant to be exported from the design file, but export is disabled → assets were requested from the design owner and later delivered as files. The delivered set covers the product shots, the Explore tiles, the category and store banners and, later, the hero video (Assumption 25); the Kettle and Indoor Camera large-card photos arrived later; the PDP lifestyle and bento images were not included, so those slots keep neutral WebP placeholders of the right ratio, as the brief allows. Banner images belong to the **category** (the files are named per category), not to the product.
4. **Line-height "Auto"** ≈ 1.35, measured from the height of multi-line layers. **Card radius** ≈ 16, because it can't be read in view-only mode.
5. **Contrast (WCAG AA, required by the brief):** two Figma interaction colours fail AA.
   - The primary **hover** `#F23F45` with white text is 3.77:1, against 4.5:1 required → it uses `#C2151B`, the Figma "Primary/Stroke" token (6.15:1).
   - The **focus ring** `#B1CBF7` on white is 1.65:1, against 3:1 required → it uses "Text/Primary" `#1B1B1B` (17:1), and white on red backgrounds (4.84:1).
   - Default states are unchanged.
6. **Dark mode:** not in the design → shadcn's `.dark` block is removed.
7. **Missing text** on tablet and on the PDP for tablet and mobile → added with the design-system rule above.
8. **Figma inconsistencies, not replicated:**
   - PDP desktop: "Colour - Black" overlaps the description;
   - PDP desktop: the navbar isn't centred;
   - PDP desktop: the accordion chevron sits outside its box;
   - PDP desktop: there are stray lines over the images;
   - PDP mobile: "Where to buy" is a fixed bottom bar. It is placed in the hero under the colour selector on every breakpoint, as the brief describes the PDP hero.
9. **Hero text:** the desktop Figma hero has no text. The mobile hero's text (title, subtitle, "Learn more") is used on every breakpoint, so the hero always communicates "Octopus Ionic Hair Dryer", as the brief describes it.
10. **Category sections are data-driven:** products come from their `category` field, with no hand-picked lists.
    - The first product in JSON order takes the large slot; extra products add rows.
    - A category with **one** product renders that product's banner. This is how Hair Care matches the Figma today, and why adding a hair-care product turns it into a full section with cards.
    - **Accepted consequence:** the Octopus Air Fryer is a Kitchen product, so the Kitchen section shows it as an extra card, which the Figma doesn't show. This is deliberate: the data model wins over a hand-picked layout, because the brief asks that adding a product to the data be enough.
11. **Downloads:** the brief lists it as an accordion section, while the Figma shows a separate box → it is the **last accordion item**, expanding to the "User manual" link.
12. **Product pages:** the brief puts "other product pages" out of scope and lets other cards link to the same page.
    - There is one dynamic route, `/products/[slug]`, but static params are generated **only** for products with PDP data (today only the Countertop Blender). The scaffold enables `cacheComponents`, which rules out `dynamicParams = false` and streams the page shell before `notFound()` can set the status, so `proxy.ts` rewrites any other slug to the built-in not-found page before rendering: a real 404, checked by an e2e test.
    - Cards link to their own PDP when it exists, otherwise to the Countertop Blender PDP.
13. **Second colour:** the Figma has only Black. Silver is added so the selector can switch, as the brief asks.
14. **Dimensions & weight:** the value is truncated in the Figma → realistic placeholder values, marked in the data.
15. **Product copy:** where the Figma has several versions of a product's description, one `shortDescription` per product is used.
16. **Best sellers order:** a single `bestSellerRank` drives both carousels. A best seller without a rank goes last.
17. **Spacing** is defined once, as semantic tokens. The lg values come from Figma; the tablet and mobile values are estimated from the full-page screenshots.
18. **Footer "Our Products" columns:** the Figma fills the two columns top to bottom. CSS multi-column (`columns-2`) does this without `grid`; `flex-wrap` would fill row by row, so it is used here instead of the usual `flex-wrap` + `basis-*`.
19. **`/coming-soon` page:** not in the Figma. It is the placeholder for every link that leaves the two pages, built only from existing styles: `Section top="md" bottom="lg"`, an `h1` styled like a product banner title (`text-h2-s`, `text-h2-l` on `lg`), a subtitle (`text-subtitle-s`, `text-subtitle-l` on `lg`, `text-muted-foreground`), `gap-stack-sm`, and a `special` "Back to home" button. It is `noindex`.
20. **Hero ratios:** the spec gave 16:9 on every breakpoint, but the Figma hero is 16:9 only on desktop (≈5:7 on tablet, ≈1:2 on mobile), and at 16:9 a phone hero is too short for the overlay text under the navbar. The hero follows the Figma: 1:2 on base, 3:4 on `md`, 16:9 on `lg`, art-directed with a portrait image below `lg`.
21. **Navbar over the first block:** every page reference shows the navbar pill floating over the first block. The header stays sticky and in flow; the first full-bleed block (the home hero, later the PDP's first image) pulls up under it with `-mt-header`, the `--header` token (6rem: the header's fixed height, `pt-4` + the 64 px pill + 16 px below it). Text inside that block starts with `pt-header`, so it never sits behind the pill.
22. **Mobile menu:** below `lg` the menu is a disclosure, not a dialog. A Radix Collapsible expands the navbar pill downwards, so the panel never covers the pill as the earlier Sheet overlay did. The header keeps its fixed `h-header`, so the open pill overlaps the page instead of pushing it down. The trigger swaps Menu ↔ X with the label "Open menu" / "Close menu" and exposes `aria-expanded` and `aria-controls`; Escape closes it and returns focus to the trigger, and choosing a link closes it. There is no focus trap or scroll lock, as fits a disclosure. The panel clips its content for the height animation, so focus rings inside it are drawn inset (`-outline-offset-2`).
23. **Banner ratios:** the spec gave banners 2.4:1 from `md` and 4:5 below. The page references show the full-bleed banners at 2.4:1 on desktop, ≈1.62:1 on tablet and ≈9:16 on mobile, with the text over the empty left of the photo, but the delivered high-resolution crops (≈2.9:1, 2.5:1, 3:4) have the subject in the centre, where overlaid text would cover it. **Product banner:** from `lg` the text sits over the left of a 2.4:1 box filled by `Breakpoint=Desktop.png` recoloured to a pink tone (the designer's export with an empty left half; 1200 px wide, so slightly soft on larger screens); below `lg` the text is centred above the image, 2.4:1 on `md` and 3:4 on base, from the sharp crops, so nothing covers the subject. **Store banner:** both delivered photos leave plain red where the text goes, so the text sits on the photo at every breakpoint, as in the references: centred over the empty top of a 3:4 crop of the mobile photo, anchored right (`object-right`) so the products stay in frame, on base; on the left of the same photo at 16:9 on `md` (the tablet reference uses the mobile composition); on the left of the 2.4:1 wide photo from `lg`. The retailer name is styled text ("the" book + "warehouse" bold, `text-h2-*`), without the logo's slash badge, as there is no asset; the heading's `aria-label` keeps the two words apart.
24. **Large-card photos:** the large card has a full-image lifestyle background, which is not the product shot. It is an optional `lifestyleImage` on the product; the Kettle and Indoor Camera photos were delivered later. The vertical card (Home Security) is tall from `lg`, so a product can add `lifestyleImageTall`, a portrait crop used there; the Indoor Camera has a wide photo (base and `md`) and a portrait one (`lg`). From `md` the photo fills the card behind the text; below `md` the text sits above it and the photo fills the lower half, anchored right, so the text never covers the subject (as for the banners, Assumption 23). A product that lands in the large slot without one shows its product shot, contained, in the half of the card away from the text.
25. **Hero video:** the Figma hero is a looping dryer video (`OctopusHairDryer_4K.mp4`). It plays over the poster image, which stays the LCP element with `priority`: two crops (16:9 from `lg`, the centre 3:4 below), each a VP9 WebM with an H.264 MP4 fallback, silent and looping, made by `pnpm assets` (≈0.9 MB / 0.6 MB WebM against the 8.8 MB original). The video element is added only on the client and only without `prefers-reduced-motion`, so reduced-motion users never download it and see the poster (the last frame). A pause button (lucide `Pause` / `Play`, not in the Figma icon set) sits bottom right, because a loop longer than 5 s needs one (WCAG 2.2.2). The first seconds show the dark dryer body behind the centred text, so a light `bg-background` gradient sits over the top of the hero to keep the text at AA contrast.
26. **PDP gallery and bento:** the references show the bento only on desktop as rows (a wide card, two half cards, a wide card); tablet and mobile stack 3:4 cards. Rows are built from `pdp.features` in data order, 1, 2, 1, 2…: from `lg` a row of one is a 2.4:1 card with its text on the left half, vertically centred, and a row of two is a pair of 3:4 halves with the text top-left; below `lg` every card is 3:4 with the text centred at the top (tablet reference; the mobile reference has no card text, so the missing-text rule applies). Each card title is an `h2` under the product `h1`. The lifestyle and bento images are decorative (`alt=""`): they illustrate the text and the slots still hold placeholders. The DOM order is image → info → gallery on every breakpoint, so on mobile the gallery follows "Where to buy" without CSS `order`, and focus order matches what is seen; from `md` the columns wrap (image + sticky info on the first line, the gallery in the left slot of the second, beside an empty spacer), and the info stays sticky through the gallery.
27. **PDP specifications:** the accordion follows `pdp-specs.png` (bold triggers, bulleted values, a single value as plain text) and the components table: chevron down when closed, up when open. Radix wraps each trigger in an `h3`, so the section has an `h2` "Specifications" read only by screen readers, keeping heading levels in order after the bento `h2`s. Radix sets `aria-controls` only while an item is open, when its panel is in the DOM, so it never points at a missing element; `aria-expanded` is always set. Values marked `estimated` in the data (Dimensions & weight, Assumption 14) are shown as they are, with no visible flag. The panel clips its content for the height animation, so the Downloads list is inset by the focus outline's offset + width and its focus ring is drawn in full.
28. **PDP best sellers:** the compact-card references show no button, so the product name is the card's link (through `getProductHref`), stretched over the whole card; its `h3` sits under the section's "Best sellers" `h2`. Card: the 1:1 shot contained in a rounded 3:4 `bg-card` box, then name and description. "2 plus a peek" and "3 plus a peek" are `basis-4/9` (base) and `basis-3/10` (`md`); `lg` shows all five (`basis-1/5`), so both arrows are disabled there. The references show no dots, but the brief asks for arrows and dots on desktop, so the shared controls apply as on home (Assumption 2): dots from `lg`, rendered only when there is more than one snap, so with today's five best sellers there are none on `lg`. Spacing: the space above comes from the PDP content's `pb-section-lg`; below, `Section bottom="md"` (the desktop reference shows ≈90 px above the footer, between `sm` and `md`). The current product is not removed from the list (the Countertop Blender is not a best seller).
