import { ProductImage } from "@/components/media/product-image";
import { Reveal } from "@/components/motion/reveal";
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

/**
 * A bento card. Its photo is shot for its slot: a half card's 3:4 photo leaves the top empty, a
 * wide card's ≈2.26:1 photo leaves the left half empty (spec, Assumption 26).
 * - Half card: 3:4 on every breakpoint, the text over the top of the photo (centred below `lg`,
 *   top-left from `lg`).
 * - Wide card: from `lg` the text sits over the empty left half of a 2.4:1 photo. Below `lg` a 3:4
 *   crop would put the subject under the text, so the text stacks above the whole 2.4:1 photo.
 */
function BentoCard({ feature, wide }: { feature: ProductFeature; wide: boolean }) {
  const text = (
    <div
      className={cn(
        "flex flex-col items-center gap-stack-xs p-card-sm text-center lg:items-start lg:text-left",
        wide
          ? "relative lg:absolute lg:inset-y-0 lg:left-0 lg:z-10 lg:w-1/2 lg:justify-center"
          : "absolute inset-0 lg:p-card-xs",
      )}
    >
      <h2 className="text-title font-bold text-balance">{feature.title}</h2>
      <p className="text-body font-book">{feature.description}</p>
    </div>
  );

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-card bg-card">
      {wide && text}
      <ProductImage
        src={feature.image}
        ratio={wide ? "banner" : "portrait"}
        // Illustrates the text beside it.
        alt=""
        sizes={`${minWidth("lg")} ${wide ? "55vw" : "28vw"}, ${minWidth("md")} 55vw, 100vw`}
      />
      {!wide && text}
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
      {/* Each row reveals on its own: stacked, the bento is several screens tall. */}
      {bentoRows(features).map((row) => (
        <Reveal
          key={row[0].title}
          className="flex flex-col gap-cards lg:flex-row"
        >
          {row.map((feature) => (
            <BentoCard
              key={feature.title}
              feature={feature}
              wide={row.length === 1}
            />
          ))}
        </Reveal>
      ))}
    </div>
  );
}
