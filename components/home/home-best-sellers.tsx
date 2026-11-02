import { FeatureProductCard } from "@/components/cards/feature-product-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselItem,
} from "@/components/ui/carousel";
import { getBestSellers, getCategories } from "@/lib/data";

type HomeBestSellersProps = {
  title: string;
};

const HEADING_ID = "best-sellers-title";

/**
 * Home best-sellers carousel: one feature card plus a peek of the next, which runs past the
 * content column to the page edge. The Embla viewport is left unclipped and the section clips
 * at the page edge instead (`overflow-x-clip`), so the page never scrolls sideways.
 */
export function HomeBestSellers({ title }: HomeBestSellersProps) {
  const products = getBestSellers();
  if (products.length === 0) return null;

  const categoryNames = new Map(
    getCategories().map((category) => [category.id, category.name]),
  );

  return (
    <Section
      labelledBy={HEADING_ID}
      top="md"
      bottom="sm"
      className="overflow-x-clip"
    >
      <Container className="flex flex-col gap-stack-md">
        <SectionHeader id={HEADING_ID} title={title} />
        <Carousel
          opts={{ align: "start" }}
          aria-label={`${title} slides`}
          className="flex flex-col gap-stack-md"
        >
          <CarouselContent viewportClassName="overflow-visible">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-7/8 md:basis-11/12 lg:basis-4/5"
              >
                <FeatureProductCard
                  product={product}
                  categoryName={categoryNames.get(product.category) ?? ""}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls />
        </Carousel>
      </Container>
    </Section>
  );
}
