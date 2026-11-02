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

A single leftover card in the last row grows to the full row width (`flex-1`). On base, everything stacks into one column.

### Section spacing
| Section | Padding | Inner gap |
|---|---|---|
| Best sellers | `pt-section-md pb-section-sm` | `gap-stack-md` |
| Category (≥ 2 products) | `pt-section-sm pb-section-lg` | header ↔ cards `gap-stack-xl`, cards `gap-cards` |
| Accessories | `py-section-md` | same |
| Product banner | none; full-bleed `aspect-banner` on `md`+ | content `gap-stack-sm` |
| Explore | `pt-section-md pb-section-lg` | `gap-stack-lg`, tiles `gap-cards` |
| Store banner | none; `aspect-banner`, `border-t border-border-light` | content `gap-stack-sm` |
| Footer | `pt-section-sm pb-6` | columns `gap-stack-xl` |

### Section details
- **Navbar (sticky):**
  - wrapper `sticky top-0 z-50 py-4 px-gutter`;
  - pill `mx-auto max-w-content h-16 rounded-pill pl-5 pr-3 py-3 flex items-center justify-between`;
  - from `lg`: logo, links and primary CTA; below `lg`: logo plus an icon-only menu button;
  - logo: `Logo variant="mark"` with `h-5.5` below `md`, and `Logo variant="full"` with `h-6` from `md` ≈ (see `components.md → Logo`).
- **Hero:** 16:9 media (`priority`), with the overlay text centred on every breakpoint.
- **Best sellers (home carousel, reference `card-carousel-home.png`):**
  - `feature` cards with `p-card-lg`, text on the left and image on the right on `lg`;
  - on base, text above the image, centred;
  - 1 card visible plus a peek of the next;
  - arrows bottom-right, dots on `lg`.
- **Explore:** square tiles (`pt-card-md pb-card-md px-card-sm`), label below. Four in a row on `md` and `lg`; on base, `flex-wrap` with tiles at `basis-1/2` (2×2).
- **Banners:** on `md` and `lg`, text on the left and image on the right (2.4:1). On base, text on top, centred, image below; the image changes per breakpoint (art direction, see `components.md`).
- **Footer:**
  - `lg`/`md`: logo on the left (`Logo variant="stacked"`, `h-26` ≈); "Our Products" (2 columns) and "Learn" on the right; a bottom bar with copyright and "Policies & Terms";
  - base: everything stacked.

## PDP composition ✅
- **`md` and `lg`:** two columns in `max-w-content`, `gap-stack-xl`.
  - **Left column** (flex 709/555), `gap-stack-xl pb-section-lg`. In order:
    1. product image (`aspect-3/4`, `priority`);
    2. lifestyle image;
    3. feature bento (`gap-cards`);
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
- **Best sellers (PDP carousel, different from the home one):** SectionHeader "Best sellers" with `compact` cards: 5 visible on `lg`, 3 plus a peek on `md`, 2 plus a peek on base. Arrows bottom-right. Built on the same `Carousel` primitive as the home carousel. References: `carousel-pdp-large.png`, `carousel-pdp-medium.png`, `carousel-pdp-small.png`.
- **Accordion:** `rounded-card bg-card px-5 py-1`, items `border-b`, trigger `py-4`, content `gap-2`.

## Radius
| Utility | Value |
|---|---|
| `rounded-pill` (buttons, navbar) | 32 ✅ |
| `rounded-card` (cards, images, accordion, tiles) | 16 ≈ |

## Images
- Every image is a real file rendered with `next/image` inside an aspect-ratio box (`fill` + `sizes`). This gives responsive `srcset`, lazy loading below the fold, and no layout shift.
- Only the hero (home) and the first product image (PDP) get `priority`.
- Until the real assets arrive, the files are **neutral WebP placeholders** (`bg-card` colour, one per aspect ratio) made by `scripts/generate-placeholders.mjs`. SVG is not used, because Next doesn't optimise it.

## Motion (bonus)
- `animate-reveal` on media blocks and `animate-reveal-text` on text-only blocks.
- Plays once, when the section enters the viewport (IntersectionObserver, threshold about 0.15).
- All elements of a section fire together, with no stagger.
- With reduced motion, only the opacity animates.
- **Never on the LCP element** (hero media, PDP first image).

---

## Assumptions (copy them into the README)
1. **Menu:** the Figma shows the full nav on tablet, but the brief requires it to collapse below 1200 → **follow the brief**.
2. **Carousel dots:** missing in the Figma, required by the brief on desktop → shown from `lg` up, styled with tokens (6 px dots, `bg-border`, active `bg-foreground`).
3. **Assets:** images were meant to be exported from the design file, but export is disabled → assets were requested from the design owner. Meanwhile neutral WebP placeholders of the right size and ratio are used, as the brief allows.
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
    - There is one dynamic route, `/products/[slug]`, but static params are generated **only** for products with PDP data (today only the Countertop Blender), and `dynamicParams = false`.
    - Cards link to their own PDP when it exists, otherwise to the Countertop Blender PDP.
13. **Second colour:** the Figma has only Black. Silver is added so the selector can switch, as the brief asks.
14. **Dimensions & weight:** the value is truncated in the Figma → realistic placeholder values, marked in the data.
15. **Product copy:** where the Figma has several versions of a product's description, one `shortDescription` per product is used.
16. **Best sellers order:** a single `bestSellerRank` drives both carousels. A best seller without a rank goes last.
17. **Spacing** is defined once, as semantic tokens. The lg values come from Figma; the tablet and mobile values are estimated from the full-page screenshots.
