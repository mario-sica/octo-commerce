export type CategoryId =
  "kitchen" | "home-security" | "hair-care" | "accessories";

/** How a category with two or more products lays out its cards. */
export type CategoryLayout = "large-horizontal" | "large-vertical" | "small";

/** Art-directed banner images: one crop per breakpoint. */
export type CategoryBanner = {
  /** From `lg` (≥ 1200). */
  lg: string;
  /** From `md` (810–1199). */
  md: string;
  /** Below `md`. */
  base: string;
};

export type Category = {
  id: CategoryId;
  name: string;
  tagline: string;
  /** Used when the category has two or more products. */
  layout: CategoryLayout;
  /** Image for the "Explore all categories" tile. */
  tileImage: string;
  /** Shown when the category has exactly one product (the product banner). */
  banner: CategoryBanner;
};

export type Colour = {
  name: string;
  /** Swatch colour, applied through `style` because it comes from data. */
  hex: string;
};

export type ProductFeature = {
  title: string;
  description: string;
  image: string;
};

export type ProductSpecGroup = {
  title: string;
  items: string[];
  /** True when the values are placeholders rather than confirmed figures. */
  estimated?: boolean;
};

export type ProductDownload = {
  label: string;
  href: string;
};

/** Product detail page content. Present only for products that have a PDP. */
export type ProductDetail = {
  description: string;
  /** Meta and Open Graph description for the product page (≈ 150 characters at most). */
  metaDescription: string;
  colours: Colour[];
  /** Lifestyle images, in order. */
  gallery: string[];
  features: ProductFeature[];
  specs: ProductSpecGroup[];
  downloads: ProductDownload[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  shortDescription: string;
  /** Product shot. */
  image: string;
  /**
   * Lifestyle photo used as the full-image background when the product takes the large card slot.
   * Without it, the large card shows the product shot instead.
   */
  lifestyleImage?: string;
  /**
   * Optional portrait crop for the `large-vertical` layout, where the card is tall from `lg`
   * (Home Security). Without it, that card crops `lifestyleImage`.
   */
  lifestyleImageTall?: string;
  /** Banner copy, when it differs from `shortDescription` (banner images live on the category). */
  bannerSubtitle?: string;
  bestSeller: boolean;
  /** Order in both best-sellers carousels; best sellers without a rank go last. */
  bestSellerRank?: number;
  pdp?: ProductDetail;
};
