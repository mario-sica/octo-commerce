import Link from "next/link";
import { ProductImage } from "@/components/media/product-image";
import { minWidth } from "@/lib/breakpoints";
import { getProductHref } from "@/lib/data";
import type { Product } from "@/types/catalog";

/**
 * PDP carousel card (carousel-pdp-*.png): the product shot contained in a rounded 3:4 `bg-card`
 * box, then name and description. The references show no button, so the name is the card's link
 * (through `getProductHref`), stretched over the whole card with an `after:` overlay.
 */
export function CompactProductCard({ product }: { product: Product }) {
  return (
    <article className="relative flex flex-col gap-stack-sm">
      <ProductImage
        src={product.image}
        ratio="portrait"
        alt=""
        sizes={`${minWidth("lg")} 20vw, ${minWidth("md")} 30vw, 45vw`}
        className="rounded-card bg-card"
        imageClassName="object-contain"
      />
      <div className="flex flex-col gap-2">
        <h3 className="text-body-lg font-bold text-balance lg:text-title">
          <Link
            href={getProductHref(product)}
            className="after:absolute after:inset-0 hover:underline"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-body font-book text-muted-foreground lg:text-body-lg">
          {product.shortDescription}
        </p>
      </div>
    </article>
  );
}
