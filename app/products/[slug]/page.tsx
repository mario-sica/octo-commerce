import { notFound } from "next/navigation";
import { ProductImage } from "@/components/media/product-image";
import { ProductInfo } from "@/components/pdp/product-info";
import { minWidth } from "@/lib/breakpoints";
import { getPdpProducts, getProduct } from "@/lib/data";

/**
 * Only products with PDP content are prerendered. `dynamicParams = false` can't be used with
 * `cacheComponents` (next.config.ts); `proxy.ts` rewrites any other slug to the built-in
 * `/_not-found` route, a real 404 (spec, Assumption 12; covered by e2e). The `notFound()` below is
 * only a fallback: under `cacheComponents` it alone would answer with status 200.
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
            // The 1:1 shot (its background matches bg-card) shows whole, centred in the 3:4 box.
            imageClassName="object-contain"
          />
        </div>

        <ProductInfo product={product} detail={product.pdp} />
      </div>
    </div>
  );
}
