import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ProductImage } from "@/components/media/product-image";
import { ProductInfo } from "@/components/pdp/product-info";
import { minWidth } from "@/lib/breakpoints";
import { getProduct } from "@/lib/data";

/** The two PDP columns (spec → PDP composition), shared by the content and its placeholder. */
function Columns({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-content flex-col gap-stack-xl md:flex-row md:items-start">
      <div className="flex flex-col gap-stack-xl md:-ml-gutter md:flex-709">
        {left}
      </div>
      {right}
    </div>
  );
}

/**
 * Everything on the PDP that depends on the URL. It reads `params` itself, inside the page's
 * `<Suspense>`, so the shared App Shell stays independent of the slug and a navigation to the page
 * is instant (Next's "URL data outside of Suspense" insight). Prerendered slugs still ship this
 * content in the static HTML.
 */
export async function ProductDetails({
  params,
}: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = getProduct(slug);
  // Other slugs get their 404 from proxy.ts; this is only a fallback (spec, Assumption 12).
  if (!product?.pdp) notFound();

  return (
    <Columns
      left={
        <ProductImage
          src={product.image}
          ratio="portrait"
          alt={product.name}
          sizes={`${minWidth("md")} 60vw, 100vw`}
          priority
          className="bg-card"
          // The 1:1 shot (its background matches bg-card) shows whole, centred in the 3:4 box.
          imageClassName="object-contain"
        />
      }
      right={<ProductInfo product={product} detail={product.pdp} />}
    />
  );
}

/**
 * Shown for the moment the product streams in after a client navigation: the empty 3:4 image box
 * in the same place, so nothing shifts when the content arrives.
 */
export function ProductDetailsPlaceholder() {
  return (
    <div aria-hidden="true">
      <Columns
        left={<div className="aspect-3/4 w-full bg-card" />}
        right={<div className="md:flex-555" />}
      />
    </div>
  );
}
