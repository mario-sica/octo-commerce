import type { Metadata } from "next";
import { CategorySection } from "@/components/home/category-section";
import { ExploreCategories } from "@/components/home/explore-categories";
import { Hero } from "@/components/home/hero";
import { HomeBestSellers } from "@/components/home/home-best-sellers";
import { StoreBanner } from "@/components/home/store-banner";
import { Reveal } from "@/components/motion/reveal";
import { getCategories, getHomeSections, getSite } from "@/lib/data";
import { openGraph } from "@/lib/seo";

const { home } = getSite();

export const metadata: Metadata = {
  title: { absolute: home.title },
  description: home.description,
  alternates: { canonical: "/" },
  openGraph: openGraph({
    title: home.title,
    description: home.description,
    url: "/",
  }),
};

/** Home: the sections listed in data/home.json, in order. Section types are added as they are built. */
export default function Home() {
  return getHomeSections().map((section, index) => {
    const key = `${section.type}-${index}`;
    switch (section.type) {
      case "hero":
        return <Hero key={key} {...section} />;
      // The hero is the LCP element, so it is never revealed (spec → Motion).
      case "best-sellers":
        return (
          <Reveal key={key}>
            <HomeBestSellers title={section.title} />
          </Reveal>
        );
      case "categories":
        return getCategories().map((category) => (
          <Reveal key={category.id}>
            <CategorySection category={category} />
          </Reveal>
        ));
      case "explore":
        return (
          <Reveal key={key}>
            <ExploreCategories
              title={section.title}
              categoryIds={section.categoryIds}
            />
          </Reveal>
        );
      // The store banner sits on the footer and reads as part of it, so it is not revealed.
      case "store-banner":
        return <StoreBanner key={key} {...section} />;
      default:
        return null;
    }
  });
}
