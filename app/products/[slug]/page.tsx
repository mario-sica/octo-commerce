import { Suspense } from "react";
import {
  ProductDetails,
  ProductDetailsPlaceholder,
} from "@/components/pdp/product-details";
import { PdpBestSellers } from "@/components/pdp/pdp-best-sellers";
import { getPdpProducts } from "@/lib/data";

/**
 * Only products with PDP content are prerendered. `dynamicParams = false` can't be used with
 * `cacheComponents` (next.config.ts); `proxy.ts` rewrites any other slug to the built-in
 * `/_not-found` route, a real 404 (spec, Assumption 12; covered by e2e).
 */
export function generateStaticParams() {
  return getPdpProducts().map((product) => ({ slug: product.slug }));
}

/**
 * Product detail page (spec → PDP composition). One column on base; from `md`, two columns
 * (709/555) inside the page gutter. The product image slides under the navbar (`-mt-header`) and
 * runs to the page edge on the left, as in the references (Assumption 21); it is the LCP element,
 * so it gets `priority`.
 *
 * `params` is passed down unawaited: the URL-specific content renders inside `<Suspense>`, and
 * the frame around it stays in the shared App Shell, so navigating here is instant.
 */
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <>
      <div className="-mt-header pb-section-lg md:px-gutter">
        <Suspense fallback={<ProductDetailsPlaceholder />}>
          <ProductDetails params={params} />
        </Suspense>
      </div>
      {/* Not slug-dependent, so it stays in the static shell, outside the Suspense boundary. */}
      <PdpBestSellers />
    </>
  );
}
