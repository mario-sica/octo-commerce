import type { MetadataRoute } from "next";
import { getPdpProducts, getProductHref } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

/** The home page and every product page that is generated (today only the Countertop Blender). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL.href, priority: 1 },
    ...getPdpProducts().map((product) => ({
      url: new URL(getProductHref(product), SITE_URL).href,
      priority: 0.8,
    })),
  ];
}
