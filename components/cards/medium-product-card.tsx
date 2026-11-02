import Link from "next/link";
import { ProductImage } from "@/components/media/product-image";
import { Button } from "@/components/ui/button";
import { minWidth } from "@/lib/breakpoints";
import { getProductHref } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

type MediumProductCardProps = {
  product: Product;
  /**
   * `vertical`: text centred above the image (3:4). `horizontal`: the same below `lg`; from `lg`,
   * text on the left and image on the right (4:3), as in the Home Security column.
   */
  orientation: "vertical" | "horizontal";
  className?: string;
};

/**
 * Secondary card of a category section (card-medium.png). The product shot fills the space the
 * text leaves; its background is the card colour, so cropping its margins is invisible.
 */
export function MediumProductCard({
  product,
  orientation,
  className,
}: MediumProductCardProps) {
  const horizontal = orientation === "horizontal";

  return (
    <article
      className={cn(
        "flex aspect-3/4 flex-col overflow-hidden rounded-card bg-card",
        horizontal && "lg:aspect-4/3 lg:flex-row lg:items-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-stack-sm px-card-lg pt-card-md text-center",
          horizontal &&
            "lg:w-1/2 lg:items-start lg:px-card-sm lg:pt-0 lg:text-left",
        )}
      >
        <div className="flex flex-col gap-stack-xs">
          <h3 className="text-h3-s text-balance md:text-h3-m lg:text-h3-l">
            {product.name}
          </h3>
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
        sizes={`${minWidth("md")} 50vw, 100vw`}
        className={cn(
          "aspect-auto min-h-0 w-full flex-1",
          horizontal && "lg:h-full lg:w-1/2 lg:flex-none",
        )}
      />
    </article>
  );
}
