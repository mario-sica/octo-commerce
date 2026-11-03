import { expect, test } from "@playwright/test";

/**
 * One visitor's path on a phone, covering the brief's acceptance criteria end to end:
 * the collapsed menu (2), "Learn more" to the PDP (4), the colour selector (7), the
 * specifications accordion with Downloads (8) and "Where to buy" to the placeholder route.
 */
test("mobile journey: menu, learn more, colour, specs, where to buy", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");

  // Below 1200 px the navigation is behind a menu button that closes on Escape.
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  const close = page.getByRole("button", { name: "Close menu" });
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("navigation", { name: "Main" }).getByRole("link", {
      name: "Kitchen",
    }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();

  // "Learn more" on the Countertop Blender opens its PDP.
  await page
    .getByRole("link", { name: "Learn more about Octopus Countertop Blender" })
    .click();
  await expect(page).toHaveURL("/products/octopus-countertop-blender");
  await expect(
    page.getByRole("heading", { level: 1, name: "Octopus Countertop Blender" }),
  ).toBeVisible();

  // Selecting a colour updates the selected state and the visible label.
  await page.getByRole("radio", { name: "Silver" }).click();
  await expect(page.getByRole("radio", { name: "Silver" })).toBeChecked();
  await expect(page.getByText("Colour - Silver")).toBeVisible();

  // Specifications: the first item starts open; items collapse and expand.
  const specs = page.getByRole("region", { name: "Specifications" });
  const technical = specs.getByRole("button", {
    name: "Technical specifications",
  });
  await expect(technical).toHaveAttribute("aria-expanded", "true");
  await technical.click();
  await expect(technical).toHaveAttribute("aria-expanded", "false");
  await expect(specs.getByText("Power: 1500W")).toBeHidden();

  const downloads = specs.getByRole("button", { name: "Downloads" });
  await downloads.click();
  await expect(downloads).toHaveAttribute("aria-expanded", "true");
  await expect(specs.getByRole("link", { name: "User manual" })).toBeVisible();

  // "Where to buy" leads to the placeholder route.
  await page.getByRole("main").getByRole("link", { name: "Where to buy" }).click();
  await expect(page).toHaveURL("/coming-soon");
  await expect(
    page.getByRole("heading", { level: 1, name: "Coming soon" }),
  ).toBeVisible();
});
