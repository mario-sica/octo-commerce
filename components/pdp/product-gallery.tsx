import type { ReactNode } from "react";
import { ProductImage } from "@/components/media/product-image";
import { Reveal } from "@/components/motion/reveal";
import { minWidth } from "@/lib/breakpoints";

type ProductGalleryProps = {
  /** Lifestyle images, in order (`product.pdp.gallery`). */
  images: string[];
  /** Rendered after the first image (the feature bento). */
  children?: ReactNode;
};

/**
 * PDP gallery (spec → PDP composition): the first lifestyle image, then `children`, then the
 * remaining images. Each image is a rounded 3:4 box. The images are mood shots that illustrate the
 * content next to them, so they are decorative (`alt=""`).
 */
export function ProductGallery({ images, children }: ProductGalleryProps) {
  const [first, ...rest] = images;

  // Each image reveals on its own: the column is several screens tall (spec → Motion).
  const image = (src: string, index: number) => (
    <Reveal key={`${src}-${index}`}>
      <ProductImage
        src={src}
        ratio="portrait"
        alt=""
        sizes={`${minWidth("md")} 55vw, 100vw`}
        className="rounded-card bg-card"
      />
    </Reveal>
  );

  return (
    <div className="flex flex-col gap-stack-xl">
      {first && image(first, 0)}
      {children}
      {rest.map((src, index) => image(src, index + 1))}
    </div>
  );
}
