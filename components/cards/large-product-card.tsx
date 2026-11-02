import Link from "next/link";
import { ProductImage } from "@/components/media/product-image";
import { Button } from "@/components/ui/button";
import { minWidth } from "@/lib/breakpoints";
import { getProductHref } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

type LargeProductCardProps = {
  product: Product;
  /**
   * `horizontal`: text on the left from `md` (Kitchen). `vertical`: the same up to `lg`, then
   * text on top and the card stretches to the height of its row (Home Security; no fixed
   * height, so the row's default stretch applies).
   * Below `md` both stack the text above the image.
   */
  orientation: "horizontal" | "vertical";
  className?: string;
};

/**
 * The large slot of a category section (card-large.png): a full-image background with the text on
 * top. Without a lifestyle photo, the product shot sits in the half of the card away from the text.
 */
export function LargeProductCard({
  product,
  orientation,
  className,
}: LargeProductCardProps) {
  const vertical = orientation === "vertical";

  return (
    <article
      className={cn(
        "relative flex aspect-2/3 flex-col overflow-hidden rounded-card bg-card md:aspect-video md:flex-row md:items-center",
        vertical && "lg:aspect-auto lg:flex-col lg:items-stretch",
        className,
      )}
    >
      {product.lifestyleImage ? (
        <ProductImage
          src={product.lifestyleImage}
          ratio="landscape"
          alt=""
          sizes={`${minWidth("lg")} ${vertical ? "50vw" : "90vw"}, 100vw`}
          className="absolute inset-0 size-full"
        />
      ) : (
        <ProductImage
          src={product.image}
          ratio="square"
          alt=""
          sizes={`${minWidth("md")} 50vw, 100vw`}
          className={cn(
            "absolute inset-x-0 bottom-0 h-1/2 w-full md:inset-y-0 md:left-1/2 md:h-full md:w-1/2",
            vertical && "lg:top-1/2 lg:left-0 lg:h-1/2 lg:w-full",
          )}
        />
      )}

      <div
        className={cn(
          "relative flex w-full flex-col items-center gap-stack-sm p-card-lg text-center md:w-1/2 md:items-start md:text-left",
          vertical && "lg:w-full lg:items-center lg:text-center",
        )}
      >
        <div className="flex flex-col gap-stack-xs">
          <h3 className="text-h3-s text-balance md:text-h3-m lg:text-h3-l">
            {product.name}
          </h3>
          <p className="text-body-lg font-book md:text-title">
            {product.shortDescription}
          </p>
        </div>
        <Button asChild>
          <Link href={getProductHref(product)}>
            Learn more <span className="sr-only">about {product.name}</span>
          </Link>
        </Button>
      </div>
    </article>
  );
}
