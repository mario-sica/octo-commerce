import { CompactProductCard } from "@/components/cards/compact-product-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselItem,
} from "@/components/ui/carousel";
import { getBestSellers } from "@/lib/data";

const TITLE = "Best sellers";
const HEADING_ID = "pdp-best-sellers-title";

/**
 * PDP best-sellers carousel (carousel-pdp-*.png), different from the home one: compact cards from
 * `getBestSellers()` on the shared `Carousel` primitive. 2 plus a peek on base, 3 plus a peek on
 * `md`, 5 on `lg`; arrows bottom-right, dots from `lg` when there is more than one snap (brief;
 * spec, Assumption 2). As on the home carousel, the peek runs past the
 * content column to the page edge: the viewport is unclipped and the section clips (`overflow-x-clip`).
 */
export function PdpBestSellers() {
  const products = getBestSellers();
  if (products.length === 0) return null;

  return (
    <Section labelledBy={HEADING_ID} bottom="md" className="overflow-x-clip">
      <Container className="flex flex-col gap-stack-md">
        <SectionHeader id={HEADING_ID} title={TITLE} />
        <Carousel
          opts={{ align: "start" }}
          aria-label={`${TITLE} slides`}
          className="flex flex-col gap-stack-md"
        >
          <CarouselContent viewportClassName="overflow-visible">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-4/9 md:basis-3/10 lg:basis-1/5"
              >
                <CompactProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls />
        </Carousel>
      </Container>
    </Section>
  );
}
