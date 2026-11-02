import { Hero } from "@/components/home/hero";
import { HomeBestSellers } from "@/components/home/home-best-sellers";
import { getHomeSections } from "@/lib/data";

/** Home: the sections listed in data/home.json, in order. Section types are added as they are built. */
export default function Home() {
  return getHomeSections().map((section, index) => {
    const key = `${section.type}-${index}`;
    switch (section.type) {
      case "hero":
        return <Hero key={key} {...section} />;
      case "best-sellers":
        return <HomeBestSellers key={key} title={section.title} />;
      default:
        return null;
    }
  });
}
