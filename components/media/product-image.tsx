import { getImageProps } from "next/image";
import { minWidth } from "@/lib/breakpoints";
import { cn } from "@/lib/utils";

/** Aspect ratios used in the design; each placeholder in public/images/placeholders matches one. */
export type ImageRatio =
  "square" | "portrait" | "landscape" | "banner" | "banner-portrait" | "tall";

// Literal class names per breakpoint, so Tailwind can detect them.
const RATIO: Record<ImageRatio, string> = {
  square: "aspect-square",
  portrait: "aspect-3/4",
  landscape: "aspect-video",
  banner: "aspect-banner",
  "banner-portrait": "aspect-4/5",
  tall: "aspect-1/2",
};
const MD_RATIO: Record<ImageRatio, string> = {
  square: "md:aspect-square",
  portrait: "md:aspect-3/4",
  landscape: "md:aspect-video",
  banner: "md:aspect-banner",
  "banner-portrait": "md:aspect-4/5",
  tall: "md:aspect-1/2",
};
const LG_RATIO: Record<ImageRatio, string> = {
  square: "lg:aspect-square",
  portrait: "lg:aspect-3/4",
  landscape: "lg:aspect-video",
  banner: "lg:aspect-banner",
  "banner-portrait": "lg:aspect-4/5",
  tall: "lg:aspect-1/2",
};

export type ImageSource = {
  src: string;
  ratio: ImageRatio;
};

type ProductImageProps = ImageSource & {
  alt: string;
  /** Rendered width per breakpoint, so the browser picks the right srcset entry. */
  sizes: string;
  /** Art direction: a different image and ratio from `md` and/or from `lg`. */
  md?: ImageSource;
  lg?: ImageSource;
  /**
   * For the LCP image only (home hero, first PDP image). Loads eagerly with high fetch
   * priority; inside `<picture>` only the matching source is downloaded.
   */
  priority?: boolean;
  /** Classes for the ratio box. */
  className?: string;
  /** Classes for the image itself, e.g. a zoom; the box clips it. */
  imageClassName?: string;
};

/**
 * `next/image` in a box with a fixed aspect ratio (`fill` + `object-cover`), so the layout never
 * shifts while the image loads. Below the fold it lazy-loads by default.
 */
export function ProductImage({
  src,
  ratio,
  alt,
  sizes,
  md,
  lg,
  priority = false,
  className,
  imageClassName,
}: ProductImageProps) {
  const common = {
    alt,
    sizes,
    fill: true,
    ...(priority
      ? { loading: "eager" as const, fetchPriority: "high" as const }
      : {}),
  };
  const { props: base } = getImageProps({ ...common, src });
  const srcSetFor = (source?: ImageSource) =>
    source && getImageProps({ ...common, src: source.src }).props.srcSet;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        RATIO[ratio],
        md && MD_RATIO[md.ratio],
        lg && LG_RATIO[lg.ratio],
        className,
      )}
    >
      <picture>
        {lg && (
          <source media={minWidth("lg")} srcSet={srcSetFor(lg)} sizes={sizes} />
        )}
        {md && (
          <source media={minWidth("md")} srcSet={srcSetFor(md)} sizes={sizes} />
        )}
        {/* Plain <img> carrying next/image props from getImageProps: needed inside <picture>. */}
        <img
          {...base}
          alt={alt}
          className={cn("object-cover", imageClassName)}
        />
      </picture>
    </div>
  );
}
