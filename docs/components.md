# Components

## shadcn/ui (Radix base): install only these

Install command: `pnpm dlx shadcn@latest add button carousel accordion radio-group`

| Requirement (brief) | shadcn component | Why it fits | Changes needed |
|---|---|---|---|
| Buttons: primary, special (white with border), ghost, icon-only | `button` | `cva` variants, `asChild` (Radix Slot) for links | Replace the default variants with `primary`, `special`, `ghost`, `ghostDark`. Sizes `default` (h-10 px-4) and `icon` (size-10). Use `rounded-pill`, `text-cta`, `border`, the hover and pressed tokens, and the global focus outline (`outline-ring-inverse` on brand backgrounds). |
| Best sellers carousel: arrows, dots, swipe, arrows disabled at the ends | `carousel` (Embla) | Swipe and drag come native. `CarouselPrevious`/`Next` are already `disabled` when `!canScrollPrev`/`!canScrollNext`. Arrow-key navigation is built in. It sets `role="region"` and `aria-roledescription="carousel"` | Add `CarouselDots`, built from `api.scrollSnapList()`, `api.selectedScrollSnap()` and `api.on("select")`. The dots are buttons with `aria-label="Go to slide n"` and `aria-current`, visible from `lg` up. Move the arrows to a bottom-right row. Use `opts={{ align: "start" }}`. |
| Menu below 1200 px: opens and closes, keyboard, Escape | Radix `Collapsible` (from `radix-ui`, no shadcn file) | `aria-expanded` and `aria-controls` on the trigger; the panel stays inside the navbar, so nothing covers it | The navbar pill expands downwards: the root is `display: contents`, the trigger (Menu ↔ X icon, label "Open menu" / "Close menu") stays in the pill row and the panel wraps onto a full-width row (link list, full-width primary button). Escape closes it and returns focus to the trigger; choosing a link closes it. The header keeps a fixed `h-header`, so the open pill overlaps the page instead of pushing it down. Hidden at `lg`. Replaces the earlier `sheet` overlay. |
| Specification sections, Downloads included: accessible accordion | `accordion` | `button` trigger with `aria-expanded`/`aria-controls`, Radix keyboard support | `type="multiple"`, first item open by default. Card container `rounded-card bg-card px-5 py-1`. Items separated by a `border-b`. Chevron rotates when open. "Downloads" is the last item. |
| Colour selector: selected state | `radio-group` | `role="radiogroup"`, arrow keys, one item selected at a time | **Rewrite the root from `grid` to `flex`.** Each item is the 44 px ring with the 30 px swatch inside; the selected item has `border-primary`. The label "Colour - {name}" updates when the selection changes. |

Not installed, on purpose:
- `card`: its v4 markup uses `grid`, and our cards have their own variants.
- `navigation-menu`: there are no submenus.
- `aspect-ratio`: the Tailwind `aspect-*` utilities are enough.
- `separator`: borders are enough.

## Logo (`components/brand/logo.tsx`)
The three official variants are in `docs/design/assets/`. They come from the design files, with `fill="currentColor"` and the viewBox cropped to the artwork, so a height class sizes them exactly.

| File | Variant | Shape (ratio w:h) | Where |
|---|---|---|---|
| `logo-full.svg` | `full` | mark + "Octopus" wordmark + ™, horizontal (≈ 4.46:1) | navbar and mobile menu panel, `md` and up |
| `logo-mark.svg` | `mark` | mark + ™ only (≈ 1.39:1) | navbar and mobile menu panel, below `md` |
| `logo-stacked.svg` | `stacked` | mark above the wordmark (≈ 0.96:1) | footer, every breakpoint |

**Implementation.** One server component, `Logo`, with `variant: "full" | "mark" | "stacked"` and `className`.
- Inline the three SVGs as JSX. Keep the path data unchanged; only convert the attributes to JSX.
- Inline SVG is used, not `next/image`: it costs no extra request, and `currentColor` lets the colour come from a token class.
- Colour comes only from the parent text colour:
  - `text-brand` in the navbar and the menu panel;
  - `text-brand-foreground` in the footer.
- Sizing (≈, measured from the full-page screenshots):
  - `full`: `h-6`, which gives 24 × 107;
  - `mark`: `h-5.5`, which gives 22 × 31;
  - `stacked`: `h-26`, which gives 104 × 100.
- The navbar shows both variants and hides one per breakpoint: `mark` with `md:hidden`, `full` with `hidden md:block`.

**Accessibility.**
- In the navbar and the menu panel, the logo is wrapped in a link to `/` with `aria-label="Octopus — home"`. The SVG gets `aria-hidden="true" focusable="false"`.
- In the footer, the logo is not a link. The SVG gets `role="img"` and `aria-label="Octopus"`.

**Favicon.** `app/icon.svg` is a copy of `logo-mark.svg` with `fill` set to the brand red, since a favicon can't inherit `currentColor`. It is the only place where the hex value appears outside the token file, and `check-tokens` doesn't scan `.svg` files.

## Icons (`lucide-react`)
The mapping from the Figma icon set (`Foundations → Icons`) to lucide-react:

| Figma | lucide-react | Used in scope |
|---|---|---|
| Placeholder | `Circle` | — |
| Filters | `ListFilter` (three decreasing lines; not `Filter`, which is a funnel) | — |
| Search | `Search` | — (search is out of scope) |
| Chevron Left / Right | `ChevronLeft` / `ChevronRight` | carousel arrows |
| Chevron Down / Up | `ChevronDown` / `ChevronUp` | accordion trigger (rotated when open) |
| Hamburger | `Menu` | mobile menu trigger |
| Close | `X` | mobile menu close |
| Pin (outline) | `MapPin` | — |
| Map | `Map` | — |
| Store | `List` (bulleted list) | — |
| Download | `Download` (arrow into a tray) | "User manual" in Downloads |
| Plus / Minus | `Plus` / `Minus` | — |
| Checkmark | `Check` | — |
| Pin (solid) | `MapPin` + `fill="currentColor"` + `icon-solid` | — |
| Alert-triangle (solid) | `TriangleAlert` + `fill="currentColor"` + `icon-solid` | — |
| Alert-circle (solid) | `CircleAlert` + `fill="currentColor"` + `icon-solid` | — |

**Solid variants.** Lucide has outline icons only. With `fill="currentColor"`, the inner details (the pin hole, the "!") take the same colour and disappear. The `icon-solid` class in `globals.css` redraws everything after the first SVG element in white:

```tsx
<MapPin size={24} fill="currentColor" className="icon-solid" />
```

This works for `MapPin`, `TriangleAlert` and `CircleAlert`, because in all three the first SVG element is the silhouette.

**Rules:**
- Figma sizes: 24 px by default, 16 px for small icons. Pass `size={24}` or `size={16}`.
- Decorative icons get `aria-hidden="true"`; the accessible name goes on the button or link that contains them.
- Only the icons marked as used are needed for the two pages. The others are documented for completeness and must not be imported until a feature needs them, so they don't add to the bundle.

## Custom components
| Component | Type | Used in | Notes |
|---|---|---|---|
| `Container` | server | everywhere | outer `px-gutter`, inner `mx-auto w-full max-w-content`: the gutter sits outside the content cap, so content lines up with the navbar pill |
| `Section` | server | everywhere | `<section aria-labelledby>`. Padding is chosen **only** through the props `top` and `bottom` (`"sm" \| "md" \| "lg" \| "none"`), which map to `*-section-*` tokens. |
| `SectionHeader` | server | home category sections, "Best sellers" (home and PDP), "Explore" | Props: `title`, `subtitle?`, `cta?`, `align: "center" \| "start"`, `level`. Typography follows the spec. |
| `Logo` | server | header, mobile menu, footer | variants `full`, `mark`, `stacked`; see the Logo section |
| `SiteHeader` | server + client leaf | both pages | sticky navbar pill with `Logo` (`mark` below `md`, `full` from `md`); `MobileMenu` (Radix Collapsible) is the client leaf |
| `SiteFooter` | server | both pages | from `data/navigation.json`; `Logo variant="stacked"` |
| `ProductImage` | server | everywhere | **always** `next/image` through `getImageProps` (`fill` + `sizes` + `object-cover`) inside a fixed `aspect-*` box. The caller adds `bg-card` and `rounded-card` through `className` where the design has them (cards, PDP), not on the full-bleed hero. Optional `md`/`lg` sources make a `<picture>` for art direction; `<source media>` reads `lib/breakpoints.ts`, which a test keeps in sync with `globals.css`. `priority`, only on the home hero and the first PDP image, means `loading="eager"` + `fetchPriority="high"` (Next 16 deprecates `priority`). |
| `Hero` | server | home | art-directed media (1:2 / 3:4 / 16:9) with `priority`, under the navbar via `-mt-header`, and centred overlay text on every breakpoint |
| `ProductCard` | server | home and PDP | variants `feature` (home carousel), `large`, `medium`, `small`, `compact` (PDP carousel); `orientation` for large and medium. "Learn more" uses `getProductHref(product)`. |
| `Carousel` (shadcn + `CarouselDots`) | client | home and PDP | the **shared primitive**: Embla, arrows in a bottom-right row and disabled at the edges, dots from `lg`. Both best-sellers carousels are built on it. |
| `HomeBestSellers` | client | home | **home carousel:** `feature` cards, one visible plus a peek of the next. Reference `card-carousel-home.png`. |
| `PdpBestSellers` | client | PDP | **PDP carousel**, different from the home one: `compact` cards, 5 visible on `lg`, 3 plus a peek on `md`, 2 plus a peek on base. References `carousel-pdp-large/medium/small.png`. |
| `CategorySection` | server | home | Applies the category rule in the spec: 0 products → nothing; 1 → `ProductBanner`; 2 or more → `SectionHeader` plus layout by `category.layout` |
| `ProductBanner` | server | home | the single-product category (today Hair Care); art direction: 2.4:1 image on `md`/`lg`, portrait image on base |
| `StoreBanner` | server | home | "Find us at"; same art direction |
| `ExploreCategories` | server | home | tiles from `getCategories()`; links to `#<category-id>` |
| `ProductInfo` | server + client leaf | PDP | title, description, `ColourSelector` (client), "Where to buy" |
| `FeatureBento` | server | PDP | feature cards from `product.pdp.features` |
| `ProductSpecs` | client | PDP | Accordion from `product.pdp.specs`, plus "Downloads" as the last item |
| `Reveal` | client | sections | IntersectionObserver plus `animate-reveal`; plays once; reduced-motion safe; never on LCP elements |

**Art direction for banners.** Use `getImageProps()` from `next/image` with two sources inside `<picture>`: the portrait image below `md`, 2.4:1 from `md`. This keeps responsive `srcset` and lazy loading.

## Data model (`types/`)
It adapts the brief's sample shape, which the brief allows. `image` stays a required `string`, as in the brief, because placeholders are real files.

```ts
export type CategoryId = "kitchen" | "home-security" | "hair-care" | "accessories";
export type CategoryLayout = "large-horizontal" | "large-vertical" | "small";

export type Category = {
  id: CategoryId; name: string; tagline: string;
  layout: CategoryLayout;   // used when the category has ≥ 2 products
  tileImage: string;        // Explore tile
};

export type Colour = { name: string; hex: string };

export type ProductDetail = {
  description: string;
  colours: Colour[];
  gallery: string[];                                  // lifestyle images, in order
  features: { title: string; description: string; image: string }[];
  specs: { title: string; items: string[] }[];
  downloads: { label: string; href: string }[];
};

export type Product = {
  id: string; slug: string; name: string; category: CategoryId;
  shortDescription: string;
  image: string;                      // product shot (placeholder until assets arrive)
  bannerImage?: string;               // used when the product is shown as a category banner
  bannerSubtitle?: string;            // banner copy, when the Figma uses different text from shortDescription
  bestSeller: boolean;
  bestSellerRank?: number;
  pdp?: ProductDetail;                // present ⇔ the product has a PDP
};

export type HomeSection =
  | { type: "hero"; productId: string; subtitle: string; image: string; imageMobile: string }
  | { type: "best-sellers"; title: string }
  | { type: "categories" }            // one CategorySection per category, categories.json order
  | { type: "explore"; title: string; categoryIds: CategoryId[] }   // tile order
  | { type: "store-banner"; title: string; wordmark: string; cta: NavLink; image: string; imageMobile: string };
```

## `lib/data.ts`
| Function | Returns |
|---|---|
| `getProducts()` | all products, in JSON order |
| `getProduct(slug)` | one product by slug |
| `getProductsByCategory(id)` | the category's products, in JSON order. **This drives the sections**, with no hand-picked lists. |
| `getBestSellers()` | products with `bestSeller: true`, sorted by `bestSellerRank`; products without a rank go last |
| `getPdpProducts()` | products that have `pdp`. Used by `generateStaticParams`. |
| `getProductHref(product)` | `/products/<slug>` if the product has `pdp`, otherwise `/products/<DEFAULT_PDP_SLUG>` (the Countertop Blender) |
| `getCategories()` | all categories |
| `getHomeSections()` | the homepage sections |
| `getNavigation()` | header and footer links |

**Invariant, tested in `feat/data-layer`:** adding one product object to `products.json` is enough:
- with `category: "kitchen"`, it appears in the Kitchen section;
- with `bestSeller: true`, it appears in both carousels;
- with `category: "hair-care"`, Hair Care switches from the banner to a full section with cards.
