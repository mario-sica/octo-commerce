import categoriesJson from "@/data/categories.json";
import homeJson from "@/data/home.json";
import navigationJson from "@/data/navigation.json";
import productsJson from "@/data/products.json";
import siteJson from "@/data/site.json";
import type { Category, CategoryId, Product } from "@/types/catalog";
import type { HomeSection, Navigation, Site } from "@/types/content";

/**
 * Single access point for site content. Components never import `data/*.json` directly.
 * Lists keep JSON order: that order decides the large slot in category sections.
 */

const products = productsJson as readonly Product[];
const categories = categoriesJson as readonly Category[];
const homeSections = homeJson as readonly HomeSection[];
const navigation = navigationJson as Navigation;
const site = siteJson as Site;

/** Products without their own PDP link here (spec, Assumption 12). */
export const DEFAULT_PDP_SLUG = "octopus-countertop-blender";

export function getProducts(): readonly Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/** The category's products in JSON order. This drives the category sections. */
export function getProductsByCategory(id: CategoryId): Product[] {
  return products.filter((product) => product.category === id);
}

/** Best sellers by `bestSellerRank`; those without a rank go last, in JSON order. */
export function getBestSellers(): Product[] {
  return products
    .filter((product) => product.bestSeller)
    .map((product, index) => ({ product, index }))
    .sort(
      (a, b) =>
        (a.product.bestSellerRank ?? Infinity) -
          (b.product.bestSellerRank ?? Infinity) || a.index - b.index,
    )
    .map(({ product }) => product);
}

/** Products that have PDP content. Used by `generateStaticParams`. */
export function getPdpProducts(): Product[] {
  return products.filter((product) => product.pdp !== undefined);
}

/** The product's own PDP when it has one, otherwise the default PDP. */
export function getProductHref(product: Pick<Product, "slug" | "pdp">): string {
  const slug = product.pdp ? product.slug : DEFAULT_PDP_SLUG;
  return `/products/${slug}`;
}

export function getCategories(): readonly Category[] {
  return categories;
}

export function getHomeSections(): readonly HomeSection[] {
  return homeSections;
}

export function getNavigation(): Navigation {
  return navigation;
}

export function getSite(): Site {
  return site;
}
