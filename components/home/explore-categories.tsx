import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { ProductImage } from "@/components/media/product-image";
import { minWidth } from "@/lib/breakpoints";
import { getCategories } from "@/lib/data";
import type { Category, CategoryId } from "@/types/catalog";

type ExploreCategoriesProps = {
  title: string;
  /** Tile order, which differs from the section order in `categories.json`. */
  categoryIds: CategoryId[];
};

function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/#${category.id}`}
      className="group flex flex-1 flex-col items-center gap-stack-xs rounded-card text-center"
    >
      {/* The tile is square; the shot is contained inside its padding. */}
      <div className="flex aspect-square w-full rounded-card bg-card px-card-sm py-card-md">
        <ProductImage
          src={category.tileImage}
          ratio="square"
          alt=""
          sizes={`${minWidth("md")} 20vw, 40vw`}
          className="aspect-auto size-full"
          // The shots carry wide margins in the card colour (as in the best-sellers cards), so
          // they are zoomed to the size of the reference.
          imageClassName="scale-120 object-contain transition-transform duration-300 group-hover:scale-125 motion-reduce:transition-none"
        />
      </div>
      <span className="text-title font-book">{category.name}</span>
    </Link>
  );
}

/**
 * "Explore all categories" (spec → Explore): square tiles with the label below, each linking to
 * its category section. Two rows of two on base, one row of four from `md`; rows are nested flex
 * containers, so every tile has the same width without `basis` arithmetic against the gap.
 */
export function ExploreCategories({ title, categoryIds }: ExploreCategoriesProps) {
  const categories = categoryIds
    .map((id) => getCategories().find((category) => category.id === id))
    .filter((category): category is Category => category !== undefined);
  const pairs = [categories.slice(0, 2), categories.slice(2)].filter(
    (pair) => pair.length > 0,
  );

  return (
    <Section labelledBy="explore-title" top="md" bottom="lg">
      <Container className="flex flex-col gap-stack-lg">
        <SectionHeader id="explore-title" title={title} />
        <div className="flex flex-col gap-cards md:flex-row">
          {pairs.map((pair) => (
            <div key={pair[0].id} className="flex gap-cards md:flex-1">
              {pair.map((category) => (
                <CategoryTile key={category.id} category={category} />
              ))}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
