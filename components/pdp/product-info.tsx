import { ColourSelector } from "@/components/pdp/colour-selector";
import type { Product, ProductDetail } from "@/types/catalog";

type ProductInfoProps = {
  product: Product;
  detail: ProductDetail;
};

/**
 * PDP info column (pdp-info.png, spec → PDP composition): title and description; the colour
 * selector and "Where to buy" follow. Below `md` it follows the product image; from `md` it is the
 * right column and stays in view (sticky below the navbar) while the gallery scrolls.
 */
export function ProductInfo({ product, detail }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-stack-sm px-gutter md:sticky md:top-header md:flex-555 md:px-0 md:pt-section-md">
      <h1 className="text-h2-s text-balance md:text-h2-m lg:text-h2-l">
        {product.name}
      </h1>
      <p className="text-body font-book text-muted-foreground">
        {detail.description}
      </p>
      <ColourSelector colours={detail.colours} />
    </div>
  );
}
