import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ProductDetails,
  ProductDetailsPlaceholder,
} from "@/components/pdp/product-details";
import { Reveal } from "@/components/motion/reveal";
import { PdpBestSellers } from "@/components/pdp/pdp-best-sellers";
import { getPdpProducts, getProduct, getProductHref, getSite } from "@/lib/data";
import { openGraph } from "@/lib/seo";

/**
 * Only products with PDP content are prerendered. Any other slug renders Next's not-found page
 * through `notFound()` in `ProductDetails` (spec, Assumption 12; covered by e2e).
 */
export function generateStaticParams() {
  return getPdpProducts().map((product) => ({ slug: product.slug }));
}

/** Title "{product} — Octopus" through the layout template; description from the PDP data. */
export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product?.pdp) return {};

  const url = getProductHref(product);
  return {
    title: product.name,
    description: product.pdp.metaDescription,
    alternates: { canonical: url },
    openGraph: openGraph({
      title: `${product.name} — ${getSite().name}`,
      description: product.pdp.metaDescription,
      url,
    }),
  };
}

/**
 * Product detail page (spec → PDP composition). One column on base; from `md`, two columns
 * (709/555) inside the page gutter. The product image starts below the navbar (unlike the
 * references, where it slides under it; Assumption 21) and runs to the page edge on the left; it
 * is the LCP element, so it gets `priority`.
 *
 * `params` is passed down unawaited: the URL-specific content renders inside `<Suspense>`, and
 * the frame around it stays in the shared App Shell, so navigating here is instant.
 */
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <>
      <div className="pb-section-lg md:px-gutter">
        <Suspense fallback={<ProductDetailsPlaceholder />}>
          <ProductDetails params={params} />
        </Suspense>
      </div>
      {/* Not slug-dependent, so it stays in the static shell, outside the Suspense boundary. */}
      <Reveal>
        <PdpBestSellers />
      </Reveal>
    </>
  );
}
