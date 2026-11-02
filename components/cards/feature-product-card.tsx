import Link from "next/link";
import { ProductImage } from "@/components/media/product-image";
import { Button } from "@/components/ui/button";
import { minWidth } from "@/lib/breakpoints";
import { getProductHref } from "@/lib/data";
import type { Product } from "@/types/catalog";

type FeatureProductCardProps = {
  product: Product;
  /** Shown above the product name in brand colour. */
  categoryName: string;
};

/**
 * The home best-sellers card (card-carousel-home.png). Base: text centred above the image.
 * From `md`: text on the left, image on the right, in a 5:3 (`md`) / 16:9 (`lg`) card.
 * The image is decorative: the product name is the heading right next to it. Product shots are
 * framed with wide margins in the card colour, so the image is zoomed 1.2× to match the size of
 * the products in the reference; the tallest shots still fit.
 */
export function FeatureProductCard({
  product,
  categoryName,
}: FeatureProductCardProps) {
  return (
    <article className="flex h-full flex-col items-center justify-between gap-stack-sm rounded-card bg-card p-card-lg text-center md:aspect-5/3 md:h-auto md:flex-row md:text-left lg:aspect-video">
      <div className="flex flex-col items-center gap-stack-sm md:flex-1 md:items-start">
        <div className="flex flex-col gap-stack-xs">
          <div className="flex flex-col gap-2">
            <p className="text-body-lg font-book text-brand">{categoryName}</p>
            <h3 className="text-h3-s text-balance md:text-h3-m lg:text-h3-l">
              {product.name}
            </h3>
          </div>
          <p className="text-body-lg font-book text-muted-foreground md:text-title">
            {product.shortDescription}
          </p>
        </div>
        <Button asChild>
          <Link href={getProductHref(product)}>
            Learn more<span className="sr-only"> about {product.name}</span>
          </Link>
        </Button>
      </div>

      <ProductImage
        src={product.image}
        ratio="square"
        alt=""
        sizes={`${minWidth("lg")} 35vw, ${minWidth("md")} 40vw, 80vw`}
        className="w-full shrink-0 md:h-full md:w-auto"
        imageClassName="scale-120"
      />
    </article>
  );
}
