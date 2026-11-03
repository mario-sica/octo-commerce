import { expect, test } from "@playwright/test";
import { getPdpProducts, getProduct, getProductHref, getSite } from "@/lib/data";

const site = getSite();
const blender = getProduct("octopus-countertop-blender");

/** Title, meta description and Open Graph tags on both pages (brief → SEO; content.md → SEO). */
const PAGES = [
  {
    path: "/",
    title: site.home.title,
    description: site.home.description,
  },
  {
    path: "/products/octopus-countertop-blender",
    title: `${blender?.name} — ${site.name}`,
    description: blender?.pdp?.metaDescription ?? "",
  },
];

for (const { path, title, description } of PAGES) {
  test(`seo tags on ${path}`, async ({ page }) => {
    await page.goto(path);
    const meta = (selector: string) =>
      page.locator(selector).getAttribute("content");

    await expect(page).toHaveTitle(title);
    expect(await meta('meta[name="description"]')).toBe(description);
    expect(await meta('meta[property="og:title"]')).toBe(title);
    expect(await meta('meta[property="og:description"]')).toBe(description);
    expect(await meta('meta[property="og:type"]')).toBe("website");
    expect(await meta('meta[property="og:site_name"]')).toBe(site.name);
    expect(await meta('meta[property="og:locale"]')).toBe(site.locale);
    expect(new URL((await meta('meta[property="og:url"]')) ?? "").pathname).toBe(
      path,
    );
    expect(await meta('meta[property="og:image"]')).toMatch(/\/og\.png$/);

    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(new URL(canonical ?? "").pathname).toBe(path);
  });
}

test("robots and sitemap list only the real pages", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBe(true);
  const robots = await response.text();
  expect(robots).toMatch(/^Allow: \/$/m);
  expect(robots).not.toMatch(/^Disallow:/m);
  expect(robots).toMatch(/^Sitemap: \S+\/sitemap\.xml$/m);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, url]) => new URL(url).pathname,
  );
  expect(paths).toEqual(["/", ...getPdpProducts().map(getProductHref)]);
});

test("the placeholder route is noindex", async ({ page }) => {
  await page.goto("/coming-soon");
  expect(
    await page.locator('meta[name="robots"]').getAttribute("content"),
  ).toContain("noindex");
});
