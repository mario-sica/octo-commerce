import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProductImage } from "@/components/media/product-image";
import { Button } from "@/components/ui/button";
import { getProductById, getProductHref } from "@/lib/data";
import type { HomeSection } from "@/types/content";

type HeroProps = Extract<HomeSection, { type: "hero" }>;

/**
 * Home hero (spec, Assumptions 9 and 20–21): full-bleed image, 1:2 on base, 3:4 on `md`, 16:9 on
 * `lg`. It slides under the sticky navbar (`-mt-header`) and its text starts just below the pill.
 * The image is the LCP element, so it gets `priority` and never scroll-reveal.
 */
export function Hero({ productId, subtitle, image, imageMobile }: HeroProps) {
  const product = getProductById(productId);
  if (!product) notFound();

  return (
    <Section labelledBy="hero-title" className="relative -mt-header">
      <ProductImage
        src={imageMobile}
        ratio="tall"
        md={{ src: imageMobile, ratio: "portrait" }}
        lg={{ src: image, ratio: "landscape" }}
        alt={product.name}
        sizes="100vw"
        priority
        className="bg-card"
      />

      <div className="absolute inset-x-0 top-0 pt-header">
        <Container className="flex flex-col items-center gap-stack-sm pt-stack-md text-center">
          <div className="flex flex-col gap-2">
            <h1 id="hero-title" className="text-h2-s md:text-h2-m lg:text-h2-l">
              {product.name}
            </h1>
            <p className="text-subtitle-s text-muted-foreground md:text-subtitle-m lg:text-subtitle-l">
              {subtitle}
            </p>
          </div>
          <Button asChild>
            <Link href={getProductHref(product)}>
              Learn more <span className="sr-only">about {product.name}</span>
            </Link>
          </Button>
        </Container>
      </div>
    </Section>
  );
}
