import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroVideo } from "@/components/home/hero-video";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProductImage } from "@/components/media/product-image";
import { Button } from "@/components/ui/button";
import { getProductById, getProductHref } from "@/lib/data";
import type { HomeSection } from "@/types/content";

type HeroProps = Extract<HomeSection, { type: "hero" }>;

/**
 * Home hero (spec, Assumptions 9, 20–21 and 25): full-bleed media, 1:2 on base, 3:4 on `md`, 16:9
 * on `lg`. It slides under the sticky navbar (`-mt-header`) and its text starts just below the
 * pill. The poster image and the text are the LCP candidates (on mobile Lighthouse picks the
 * subtitle), so the poster gets `priority` and the hero never gets scroll-reveal; the video loop
 * plays over it, under a light scrim that keeps the text readable on dark frames.
 */
export function Hero({
  productId,
  subtitle,
  image,
  imageMobile,
  video,
}: HeroProps) {
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
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-3/5 bg-linear-to-b from-background/80 via-background/40 to-transparent lg:h-1/2"
      />

      <div className="absolute inset-x-0 top-0 z-20 pt-header">
        <Container className="flex flex-col items-center gap-stack-sm pt-stack-xl text-center">
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
      {/* After the text in the DOM, so the pause button follows the CTA in tab order. */}
      {video && <HeroVideo video={video} />}
    </Section>
  );
}
