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
