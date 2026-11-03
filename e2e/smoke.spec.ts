import { expect, test } from "@playwright/test";

test("home page loads with a main landmark", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole("main")).toBeVisible();
});

test("the navbar logo returns to the top of the home page", async ({ page }) => {
  await page.goto("/#kitchen");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  await page.getByRole("link", { name: "Octopus — home" }).click();

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page).toHaveURL("/");
});

test("the navbar logo goes home from the product page", async ({ page }) => {
  await page.goto("/products/octopus-countertop-blender");
  await page.getByRole("link", { name: "Octopus — home" }).click();
  await expect(page).toHaveURL("/");
});

test("on tablet the navbar shows the full nav, centred on one line", async ({
  page,
}) => {
  for (const width of [810, 1000, 1199]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();

    const nav = page.getByRole("navigation", { name: "Main" });
    const logo = await page
      .getByRole("link", { name: "Octopus — home" })
      .boundingBox();
    const first = await nav.getByRole("link", { name: "Kitchen" }).boundingBox();
    const last = await nav
      .getByRole("link", { name: "Accessories" })
      .boundingBox();
    const cta = await nav.getByRole("link", { name: "Where to buy" }).boundingBox();
    if (!logo || !first || !last || !cta) throw new Error("navbar item missing");

    // One line: every item shares the same vertical centre.
    expect(Math.abs(first.y + first.height / 2 - (cta.y + cta.height / 2))).toBeLessThan(1);
    // Centred between logo and CTA.
    const left = first.x - (logo.x + logo.width);
    const right = cta.x - (last.x + last.width);
    expect(Math.abs(left - right)).toBeLessThanOrEqual(2);
  }
});

test("below 810 px the mobile menu replaces the nav", async ({ page }) => {
  await page.setViewportSize({ width: 809, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();
});
