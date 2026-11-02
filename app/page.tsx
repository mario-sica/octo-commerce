import { Hero } from "@/components/home/hero";
import { getHomeSections } from "@/lib/data";

/** Home: the sections listed in data/home.json, in order. Section types are added as they are built. */
export default function Home() {
  return getHomeSections().map((section) => {
    switch (section.type) {
      case "hero":
        return <Hero key={section.type} {...section} />;
      default:
        return null;
    }
  });
}
