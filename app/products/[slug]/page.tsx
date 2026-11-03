import { notFound } from "next/navigation";
import { ProductImage } from "@/components/media/product-image";
import { minWidth } from "@/lib/breakpoints";
import { getPdpProducts, getProduct } from "@/lib/data";

/**
 * Only products with PDP content are prerendered. `dynamicParams = false` can't be used with
 * `cacheComponents` (next.config.ts), so any other slug reaches `notFound()` below and gets a 404
 * (spec, Assumption 12; covered by an e2e test).
 */
export function generateStaticParams() {
  return getPdpProducts().map((product) => ({ slug: product.slug }));
}

/**
 * Product detail page (spec → PDP composition). One column on base; from `md`, two columns
 * (709/555) inside the page gutter. The product image slides under the navbar (`-mt-header`) and
 * runs to the page edge on the left, as in the references (Assumption 21); it is the LCP element,
 * so it gets `priority`.
 */
export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product?.pdp) notFound();

  return (
    <div className="-mt-header md:px-gutter">
      <div className="mx-auto flex max-w-content flex-col gap-stack-xl md:flex-row md:items-start">
        <div className="flex flex-col gap-stack-xl md:-ml-gutter md:flex-709">
          <ProductImage
            src={product.image}
            ratio="portrait"
            alt={product.name}
            sizes={`${minWidth("md")} 60vw, 100vw`}
            priority
            className="bg-card"
          />
        </div>

        <div className="flex flex-col gap-stack-sm px-gutter md:flex-555 md:px-0 md:pt-section-md">
          <h1 className="text-h2-s md:text-h2-m lg:text-h2-l">
            {product.name}
          </h1>
        </div>
      </div>
    </div>
  );
}
