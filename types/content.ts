import type { CategoryId } from "@/types/catalog";

export type NavLink = {
  label: string;
  href: string;
};

/** One hero video crop: VP9 WebM first, H.264 MP4 as the fallback. */
export type VideoSources = { webm: string; mp4: string };

/** The hero loop: the wide crop from `lg`, the portrait crop below. */
export type HeroVideo = { lg: VideoSources; portrait: VideoSources };

export type HomeSection =
  | {
      type: "hero";
      /** The product the hero presents; its name is the hero title. */
      productId: string;
      subtitle: string;
      /** Wide image (from `lg`, 16:9); the video's poster. */
      image: string;
      /** Portrait image (below `lg`: 1:2 on base, 3:4 on `md`); the video's poster. */
      imageMobile: string;
      /** Optional loop over the poster; without it the hero is the image alone. */
      video?: HeroVideo;
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
  /** Split the links into two columns (filled top to bottom) from `md`. */
  twoColumns?: boolean;
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
