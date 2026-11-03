import { CategorySection } from "@/components/home/category-section";
import { ExploreCategories } from "@/components/home/explore-categories";
import { Hero } from "@/components/home/hero";
import { HomeBestSellers } from "@/components/home/home-best-sellers";
import { StoreBanner } from "@/components/home/store-banner";
import { getCategories, getHomeSections } from "@/lib/data";

/** Home: the sections listed in data/home.json, in order. Section types are added as they are built. */
export default function Home() {
  return getHomeSections().map((section, index) => {
    const key = `${section.type}-${index}`;
    switch (section.type) {
      case "hero":
        return <Hero key={key} {...section} />;
      case "best-sellers":
        return <HomeBestSellers key={key} title={section.title} />;
      case "categories":
        return getCategories().map((category) => (
          <CategorySection key={category.id} category={category} />
        ));
      case "explore":
        return (
          <ExploreCategories
            key={key}
            title={section.title}
            categoryIds={section.categoryIds}
          />
        );
      case "store-banner":
        return <StoreBanner key={key} {...section} />;
      default:
        return null;
    }
  });
}
