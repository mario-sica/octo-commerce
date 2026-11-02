import type { CategoryId } from "@/types/catalog";

export type NavLink = {
  label: string;
  href: string;
};

export type HomeSection =
  | {
      type: "hero";
      /** The product the hero presents; its name is the hero title. */
      productId: string;
      subtitle: string;
      image: string;
    }
  | { type: "best-sellers"; title: string }
  /** One category section per category, in `categories.json` order. */
  | { type: "categories" }
  | {
      type: "explore";
      title: string;
      /** Tile order, which differs from the section order in `categories.json`. */
      categoryIds: CategoryId[];
    }
  | {
      type: "store-banner";
      title: string;
      /** Retailer name, rendered as styled text. */
      wordmark: string;
      cta: NavLink;
      /** Wide image (from `md`). */
      image: string;
      /** Portrait image (below `md`). */
      imageMobile: string;
    };

export type FooterColumn = {
  title: string;
  links: NavLink[];
};

export type Navigation = {
  header: {
    links: NavLink[];
    cta: NavLink;
  };
  footer: {
    columns: FooterColumn[];
    copyright: string;
    legal: NavLink;
  };
};
