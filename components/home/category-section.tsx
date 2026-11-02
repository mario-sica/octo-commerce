import Link from "next/link";
import { LargeProductCard } from "@/components/cards/large-product-card";
import { MediumProductCard } from "@/components/cards/medium-product-card";
import { SmallProductCard } from "@/components/cards/small-product-card";
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
 * Home Security: from `lg`, the large card stands beside a column of two horizontal medium cards
 * and stretches to its height. On `md` it is the Kitchen layout; any further products follow as
 * medium rows.
 */
function LargeVerticalLayout({ products }: { products: Product[] }) {
  const [first, ...rest] = products;
  const beside = rest.slice(0, 2);
  const below = rest.slice(2);

  return (
    <div className="flex flex-col gap-cards">
      <div className="flex flex-col gap-cards lg:flex-row">
        <LargeProductCard
          product={first}
          orientation="vertical"
          className="lg:flex-1"
        />
        <div className="flex flex-col gap-cards md:flex-row lg:flex-1 lg:flex-col">
          {beside.map((product) => (
            <MediumProductCard
              key={product.id}
              product={product}
              orientation={beside.length === 1 ? "wide" : "horizontal"}
              className="md:flex-1"
            />
          ))}
        </div>
      </div>
      <MediumRows products={below} />
    </div>
  );
}

/** Accessories: small cards in rows of 3 from `md`. */
function SmallLayout({ products }: { products: Product[] }) {
  return (
    <div className="flex flex-col gap-cards">
      {rows(products, 3).map((row) => (
        <div key={row[0].id} className="flex flex-col gap-cards md:flex-row">
          {row.map((product) => (
            <SmallProductCard
              key={product.id}
              product={product}
              className="md:flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const LAYOUTS = {
  "large-horizontal": LargeHorizontalLayout,
  "large-vertical": LargeVerticalLayout,
  small: SmallLayout,
} satisfies Record<Category["layout"], unknown>;

/**
 * One section per category (spec → Category section rule). Products come from
 * `getProductsByCategory()` in JSON order; the first one takes the large slot.
 */
export function CategorySection({ category }: { category: Category }) {
  const products = getProductsByCategory(category.id);
  // A single product renders as that product's banner (added in a following step).
  if (products.length < 2) return null;

  const headingId = `${category.id}-title`;
  const Layout = LAYOUTS[category.layout];
  // Spec → Section spacing: the small-card section (Accessories) uses `py-section-md`.
  const small = category.layout === "small";

  return (
    <Section
      id={category.id}
      labelledBy={headingId}
      top={small ? "md" : "sm"}
      bottom={small ? "md" : "lg"}
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
        <Layout products={products} />
      </Container>
    </Section>
  );
}
