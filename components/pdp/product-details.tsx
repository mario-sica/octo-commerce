import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ProductImage } from "@/components/media/product-image";
import { Reveal } from "@/components/motion/reveal";
import { FeatureBento } from "@/components/pdp/feature-bento";
import { ProductGallery } from "@/components/pdp/product-gallery";
import { ProductInfo } from "@/components/pdp/product-info";
import { ProductSpecs } from "@/components/pdp/product-specs";
import { minWidth } from "@/lib/breakpoints";
import { getProduct } from "@/lib/data";

type ColumnsProps = { media: ReactNode; info: ReactNode; rest?: ReactNode };

/**
 * The PDP columns (spec → PDP composition), shared by the content and its placeholder. The DOM
 * order is the mobile reading order (image → info → rest), so focus order matches what is seen.
 * From `md` the row wraps: the image (709) and the sticky info (555) share the first line, and
 * `rest` takes the second line in the same 709 slot, with an empty 555 spacer beside it. The
 * info's sticky range is this whole container, so it stays in view while `rest` scrolls.
 */
function Columns({ media, info, rest }: ColumnsProps) {
  return (
    <div className="mx-auto flex max-w-content flex-col gap-stack-xl md:flex-row md:flex-wrap md:items-start">
      <div className="md:-ml-gutter md:flex-709">{media}</div>
      {info}
      {rest && (
        <div className="flex gap-stack-xl md:basis-full">
          {/* Same box as the image (out to the page edge), inset back to the page gutter. The
              inset sits on an inner div: padding on the flex item would change its share. */}
          <div className="min-w-0 flex-1 md:-ml-gutter md:flex-709">
            <div className="px-gutter md:pr-0">{rest}</div>
          </div>
          <div aria-hidden="true" className="hidden md:block md:flex-555" />
        </div>
      )}
    </div>
  );
}

/**
 * Everything on the PDP that depends on the URL. It reads `params` itself, inside the page's
 * `<Suspense>`, so the shared App Shell stays independent of the slug and a navigation to the page
 * is instant (Next's "URL data outside of Suspense" insight). Prerendered slugs still ship this
 * content in the static HTML, after the fallback.
 */
export async function ProductDetails({
  params,
}: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = getProduct(slug);
  // Only products with PDP content have a page (spec, Assumption 12).
  if (!product?.pdp) notFound();

  return (
    <Columns
      media={
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
      info={<ProductInfo product={product} detail={product.pdp} />}
      rest={
        <div className="flex flex-col gap-stack-xl">
          <ProductGallery images={product.pdp.gallery}>
            <FeatureBento features={product.pdp.features} />
          </ProductGallery>
          <Reveal variant="text">
            <ProductSpecs
              specs={product.pdp.specs}
              downloads={product.pdp.downloads}
            />
          </Reveal>
        </div>
      }
    />
  );
}

/**
 * Shown until the product streams in, on a client navigation and on a first load too: React puts
 * this fallback ahead of the large boundary in the HTML, so a paint can catch it. The empty 3:4
 * image box stays in the same place, and the viewport height keeps what follows the boundary below
 * the fold, where its move when the content arrives is not a layout shift.
 */
export function ProductDetailsPlaceholder() {
  return (
    <div aria-hidden="true" className="min-h-screen">
      <Columns
        media={<div className="aspect-3/4 w-full bg-card" />}
        info={<div className="md:flex-555" />}
      />
    </div>
  );
}
