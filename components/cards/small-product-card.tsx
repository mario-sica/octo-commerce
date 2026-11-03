import Link from "next/link";
import { ProductImage } from "@/components/media/product-image";
import { Button } from "@/components/ui/button";
import { minWidth } from "@/lib/breakpoints";
import { getProductHref } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

type SmallProductCardProps = {
  product: Product;
  className?: string;
};

/**
 * Accessories card (card-small.png). Base: text centred above the image. From `md`: image on top,
 * left-aligned text below. The text stays first in the DOM, so the reading order never changes.
 */
export function SmallProductCard({
  product,
  className,
}: SmallProductCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-stack-sm rounded-card bg-card p-card-sm",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-stack-sm text-center md:items-start md:text-left">
        <div className="flex flex-col gap-stack-xs">
          <h3 className="text-title-lg font-bold text-balance">
            {product.name}
          </h3>
          <p className="text-body-lg font-book text-muted-foreground md:text-title">
            {product.shortDescription}
          </p>
        </div>
        <Button asChild>
          <Link href={getProductHref(product)}>
            Learn more <span className="sr-only">about {product.name}</span>
          </Link>
        </Button>
      </div>

      <ProductImage
        src={product.image}
        ratio="square"
        alt=""
        sizes={`${minWidth("md")} 33vw, 100vw`}
        className="w-full md:order-first"
        imageClassName="object-contain"
      />
    </article>
  );
}
