import Link from "next/link";
import { LargeProductCard } from "@/components/cards/large-product-card";
import { MediumProductCard } from "@/components/cards/medium-product-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { getProductsByCategory } from "@/lib/data";
import type { Category, Product } from "@/types/catalog";

/** Splits products into rows of `size`; the last row may be shorter. */
function rows(products: Product[], size: number): Product[][] {
  const out: Product[][] = [];
  for (let i = 0; i < products.length; i += size) {
    out.push(products.slice(i, i + size));
  }
  return out;
}

/** Medium cards in rows of 2 from `md`; a card alone in its row fills it (`wide`). */
function MediumRows({ products }: { products: Product[] }) {
  return rows(products, 2).map((row) => (
    <div key={row[0].id} className="flex flex-col gap-cards md:flex-row">
      {row.map((product) => (
        <MediumProductCard
          key={product.id}
          product={product}
          orientation={row.length === 1 ? "wide" : "vertical"}
          className="md:flex-1"
        />
      ))}
    </div>
  ));
}

/** Kitchen: the first product in the large slot, the rest as medium cards below. */
function LargeHorizontalLayout({ products }: { products: Product[] }) {
  const [first, ...rest] = products;
  return (
    <div className="flex flex-col gap-cards">
      <LargeProductCard product={first} orientation="horizontal" />
      <MediumRows products={rest} />
    </div>
  );
}

/**
 * One section per category (spec → Category section rule). Products come from
 * `getProductsByCategory()` in JSON order; the first one takes the large slot.
 */
export function CategorySection({ category }: { category: Category }) {
  const products = getProductsByCategory(category.id);
  // A single product renders as that product's banner (added in a following step).
  if (products.length < 2) return null;

  const headingId = `${category.id}-title`;

  return (
    <Section
      id={category.id}
      labelledBy={headingId}
      top="sm"
      bottom="lg"
      className="scroll-mt-header"
    >
      <Container className="flex flex-col gap-stack-xl">
        <SectionHeader
          id={headingId}
          title={category.name}
          subtitle={category.tagline}
          align="center"
          cta={
            <Button asChild variant="special">
              <Link href="/coming-soon">
                Explore all products
                <span className="sr-only"> in {category.name}</span>
              </Link>
            </Button>
          }
        />
        <LargeHorizontalLayout products={products} />
      </Container>
    </Section>
  );
}
