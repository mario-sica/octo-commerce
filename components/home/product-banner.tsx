import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProductImage } from "@/components/media/product-image";
import { Button } from "@/components/ui/button";
import { getProductHref } from "@/lib/data";
import type { Category, Product } from "@/types/catalog";

type ProductBannerProps = {
  category: Category;
  product: Product;
};

/**
 * A category with exactly one product renders as that product's banner (today Hair Care).
 * Full-bleed and art-directed from the category's banner crops (spec, Assumption 23): below `lg`
 * the text sits centred above the image (3:4 on base, 2.4:1 on `md`), so it never covers the
 * subject; from `lg` it sits over the empty left of the 2.4:1 desktop crop.
 */
export function ProductBanner({ category, product }: ProductBannerProps) {
  const headingId = `${category.id}-title`;

  return (
    <Section
      id={category.id}
      labelledBy={headingId}
      className="relative flex scroll-mt-header flex-col bg-card"
    >
      <div className="relative z-10 lg:absolute lg:inset-0 lg:flex lg:items-center">
        <Container>
          <div className="flex flex-col items-center gap-stack-sm py-stack-xl text-center lg:w-2/5 lg:items-start lg:py-0 lg:text-left">
            <div className="flex flex-col gap-2">
              <h2
                id={headingId}
                className="text-h2-s text-balance md:text-h2-m lg:text-h2-l"
              >
                {product.name}
              </h2>
              <p className="text-subtitle-s md:text-subtitle-m lg:text-subtitle-l">
                {product.bannerSubtitle ?? product.shortDescription}
              </p>
            </div>
            <Button asChild>
              <Link href={getProductHref(product)}>
                Learn more <span className="sr-only">about {product.name}</span>
              </Link>
            </Button>
          </div>
        </Container>
      </div>

      <ProductImage
        src={category.banner.base}
        ratio="portrait"
        md={{ src: category.banner.md, ratio: "banner" }}
        lg={{ src: category.banner.lg, ratio: "banner" }}
        alt=""
        sizes="100vw"
        className="w-full"
      />
    </Section>
  );
}
