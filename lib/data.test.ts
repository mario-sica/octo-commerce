import { existsSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Product } from "@/types/catalog";

function makeProduct(overrides: Partial<Product> & { slug: string }): Product {
  return {
    id: overrides.slug,
    name: `Test ${overrides.slug}`,
    category: "kitchen",
    shortDescription: "A test product",
    image: "/images/placeholders/square.webp",
    bestSeller: false,
    ...overrides,
  };
}

/** Loads `lib/data` as if these products had been appended to `products.json`. */
async function loadWithExtraProducts(...extra: Product[]) {
  vi.resetModules();
  vi.doMock("@/data/products.json", async (importOriginal) => {
    const original = await importOriginal<{ default: Product[] }>();
    return { default: [...original.default, ...extra] };
  });
  return import("@/lib/data");
}

afterEach(() => {
  vi.doUnmock("@/data/products.json");
  vi.resetModules();
});

describe("adding a product to products.json is enough to show it", () => {
  it("a new kitchen product joins the kitchen section, after the existing ones", async () => {
    const data = await loadWithExtraProducts(
      makeProduct({ slug: "test-toaster", category: "kitchen" }),
    );
    const kitchen = data.getProductsByCategory("kitchen").map((p) => p.slug);

    expect(kitchen.at(-1)).toBe("test-toaster");
    expect(kitchen[0]).toBe("octopus-kettle-1-7l");
  });

  it("a second hair-care product turns hair care into a multi-product category", async () => {
    const before = await loadWithExtraProducts();
    expect(before.getProductsByCategory("hair-care")).toHaveLength(1);

    const after = await loadWithExtraProducts(
      makeProduct({ slug: "test-straightener", category: "hair-care" }),
    );
    expect(after.getProductsByCategory("hair-care")).toHaveLength(2);
  });

  it("a new best seller joins the list in rank order", async () => {
    const data = await loadWithExtraProducts(
      makeProduct({ slug: "test-ranked", bestSeller: true, bestSellerRank: 2 }),
    );
    const ranked = data.getBestSellers().map((p) => p.slug);

    expect(ranked).toContain("test-ranked");
    expect(ranked.indexOf("test-ranked")).toBeGreaterThan(
      ranked.indexOf("octopus-air-fryer-5-7l"),
    );
    expect(ranked.indexOf("test-ranked")).toBeLessThan(
      ranked.indexOf("octopus-kettle-1-7l"),
    );
  });

  it("a best seller without a rank goes last", async () => {
    const data = await loadWithExtraProducts(
      makeProduct({ slug: "test-unranked", bestSeller: true }),
    );

    expect(data.getBestSellers().at(-1)?.slug).toBe("test-unranked");
  });

  it("a product without pdp links to the default PDP", async () => {
    const data = await loadWithExtraProducts(
      makeProduct({ slug: "test-no-pdp" }),
    );
    const product = data.getProduct("test-no-pdp");

    expect(product).toBeDefined();
    expect(data.getProductHref(product!)).toBe(
      `/products/${data.DEFAULT_PDP_SLUG}`,
    );
  });

  it("only products with pdp are in getPdpProducts, and they link to themselves", async () => {
    const countertop = await loadWithExtraProducts();
    const base = countertop.getProduct(countertop.DEFAULT_PDP_SLUG);
    const data = await loadWithExtraProducts(
      makeProduct({ slug: "test-with-pdp", pdp: base?.pdp }),
      makeProduct({ slug: "test-without-pdp" }),
    );
    const slugs = data.getPdpProducts().map((p) => p.slug);

    expect(slugs).toEqual([data.DEFAULT_PDP_SLUG, "test-with-pdp"]);
    expect(data.getProductHref(data.getProduct("test-with-pdp")!)).toBe(
      "/products/test-with-pdp",
    );
  });
});

describe("content data integrity", () => {
  it("has unique ids and slugs, and only known categories", async () => {
    const data = await import("@/lib/data");
    const products = data.getProducts();
    const categoryIds = data.getCategories().map((c) => c.id);

    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    for (const product of products) {
      expect(categoryIds).toContain(product.category);
    }
  });

  it("has no repeated best-seller rank", async () => {
    const data = await import("@/lib/data");
    const ranks = data
      .getProducts()
      .map((p) => p.bestSellerRank)
      .filter((rank) => rank !== undefined);

    expect(new Set(ranks).size).toBe(ranks.length);
  });

  it("points the hero at an existing product and builds the default PDP", async () => {
    const data = await import("@/lib/data");
    const hero = data.getHomeSections().find((s) => s.type === "hero");

    expect(hero && data.getProductById(hero.productId)).toBeDefined();
    expect(data.getPdpProducts().map((p) => p.slug)).toContain(
      data.DEFAULT_PDP_SLUG,
    );
  });

  it("lists every category exactly once in the explore tiles", async () => {
    const data = await import("@/lib/data");
    const explore = data.getHomeSections().find((s) => s.type === "explore");
    const categoryIds = data.getCategories().map((c) => c.id);

    expect(explore?.categoryIds).toHaveLength(categoryIds.length);
    expect([...(explore?.categoryIds ?? [])].sort()).toEqual(
      [...categoryIds].sort(),
    );
  });

  it("references only image files that exist in public/", async () => {
    const data = await import("@/lib/data");
    const json = JSON.stringify([
      data.getProducts(),
      data.getCategories(),
      data.getHomeSections(),
    ]);
    const paths = new Set(json.match(/\/images\/[^"]+/g) ?? []);

    expect(paths.size).toBeGreaterThan(0);
    for (const path of paths) {
      expect(existsSync(join(process.cwd(), "public", path)), path).toBe(true);
    }
  });
});
