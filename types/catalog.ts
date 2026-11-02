export type CategoryId =
  "kitchen" | "home-security" | "hair-care" | "accessories";

/** How a category with two or more products lays out its cards. */
export type CategoryLayout = "large-horizontal" | "large-vertical" | "small";

export type Category = {
  id: CategoryId;
  name: string;
  tagline: string;
  /** Used when the category has two or more products. */
  layout: CategoryLayout;
  /** Image for the "Explore all categories" tile. */
  tileImage: string;
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
  /** Wide image used when the product is shown as a category banner (from `md`). */
  bannerImage?: string;
  /** Portrait image used for the banner below `md`. */
  bannerImageMobile?: string;
  /** Banner copy, when it differs from `shortDescription`. */
  bannerSubtitle?: string;
  bestSeller: boolean;
  /** Order in both best-sellers carousels; best sellers without a rank go last. */
  bestSellerRank?: number;
  pdp?: ProductDetail;
};
