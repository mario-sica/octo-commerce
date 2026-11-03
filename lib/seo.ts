import type { Metadata } from "next";
import { getSite } from "@/lib/data";

/**
 * Absolute origin for metadata (canonical URLs, Open Graph, sitemap). Set `SITE_URL` in the
 * deployment; on Vercel the production domain is used; locally it falls back to the dev server.
 */
export const SITE_URL = new URL(
  process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Open Graph for a page. Next replaces a parent's `openGraph` object instead of merging it, so
 * every page spreads the shared fields (type, site name, locale, image) through this helper.
 */
export function openGraph(page: Omit<OpenGraph, "type">): OpenGraph {
  const site = getSite();
  return {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    // Placeholder made by `pnpm placeholders` (docs/content.md → SEO).
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
    ...page,
  };
}
