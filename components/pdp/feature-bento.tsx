import { ProductImage } from "@/components/media/product-image";
import { minWidth } from "@/lib/breakpoints";
import { cn } from "@/lib/utils";
import type { ProductFeature } from "@/types/catalog";

/**
 * Groups the features into rows of 1, 2, 1, 2… in data order: from `lg` a row of one is a wide
 * card and a row of two is a pair of half cards (pdp-desktop.png: wide, two halves, wide).
 */
export function bentoRows<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  let index = 0;
  while (index < items.length) {
    const size = rows.length % 2 === 0 ? 1 : 2;
    rows.push(items.slice(index, index + size));
    index += size;
  }
  return rows;
}

function BentoCard({ feature, wide }: { feature: ProductFeature; wide: boolean }) {
  return (
    <div className="relative min-w-0 flex-1 overflow-hidden rounded-card bg-card">
      <ProductImage
        src={feature.image}
        ratio="portrait"
        lg={wide ? { src: feature.image, ratio: "banner" } : undefined}
        // Illustrates the text beside it, and the slots still hold placeholders.
        alt=""
        sizes={`${minWidth("lg")} ${wide ? "55vw" : "28vw"}, ${minWidth("md")} 55vw, 100vw`}
      />
      {/* Text on top, centred below `lg` (pdp-tablet.png); from `lg` top-left, or the left
          half and vertically centred on a wide card (pdp-desktop.png). */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center gap-stack-xs p-card-sm text-center lg:items-start lg:text-left",
          wide && "lg:w-1/2 lg:justify-center",
        )}
      >
        <h2 className="text-title font-bold text-balance">{feature.title}</h2>
        <p className="text-body font-book">{feature.description}</p>
      </div>
    </div>
  );
}

/**
 * PDP feature bento (spec → PDP composition): one card per `product.pdp.features` entry, in data
 * order. A single column of 3:4 cards below `lg`; from `lg`, rows of one wide card or two halves.
 * Each title is an h2 under the page's h1.
 */
export function FeatureBento({ features }: { features: ProductFeature[] }) {
  if (features.length === 0) return null;

  return (
    <div className="flex flex-col gap-cards">
      {bentoRows(features).map((row) => (
        <div key={row[0].title} className="flex flex-col gap-cards lg:flex-row">
          {row.map((feature) => (
            <BentoCard
              key={feature.title}
              feature={feature}
              wide={row.length === 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
