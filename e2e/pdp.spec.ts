import { expect, test } from "@playwright/test";

const PDP = "/products/octopus-countertop-blender";

test("home → pdp: learn more opens the countertop blender page", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Learn more about Octopus Countertop Blender" })
    .click();

  await expect(page).toHaveURL(PDP);
  await expect(
    page.getByRole("heading", { level: 1, name: "Octopus Countertop Blender" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Where to buy" }).last(),
  ).toHaveAttribute("href", "/coming-soon");
});

test("only products with pdp content have a page", async ({ page }) => {
  for (const slug of ["octopus-kettle-1-7l", "not-a-product"]) {
    const response = await page.goto(`/products/${slug}`);
    expect(response?.status(), slug).toBe(404);
  }
});

test("the colour selector follows arrow keys", async ({ page }) => {
  await page.goto(PDP);
  const black = page.getByRole("radio", { name: "Black" });
  await black.focus();
  // Radix moves focus on a timer and checks the item only while the key is down, so hold it
  // as a person would (an instant press releases it before the focus moves).
  await page.keyboard.press("ArrowRight", { delay: 50 });

  await expect(page.getByRole("radio", { name: "Silver" })).toBeChecked();
  await expect(page.getByRole("radio", { name: "Silver" })).toBeFocused();
  await expect(
    page.getByRole("radiogroup", { name: "Colour - Silver" }),
  ).toBeVisible();
});
