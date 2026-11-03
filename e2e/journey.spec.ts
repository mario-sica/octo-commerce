import { expect, test } from "@playwright/test";
import { DEFAULT_PDP_SLUG, getProduct } from "@/lib/data";

const blender = getProduct(DEFAULT_PDP_SLUG);
if (!blender?.pdp) throw new Error("the countertop blender has pdp data");
const firstSpec = blender.pdp.specs[0];

/**
 * One visitor's path on a phone, end to end: the collapsed menu, "Learn more" to the PDP, the
 * colour selector, the specifications accordion with Downloads and "Where to buy" to the
 * placeholder route.
 */
test("mobile journey: menu, learn more, colour, specs, where to buy", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");

  // Below 1200 px the navigation is behind a menu button that closes on Escape.
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.focus();
  await page.keyboard.press("Enter");
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
  await expect(
    page.getByRole("radiogroup", { name: "Colour - Silver" }),
  ).toBeVisible();

  // Specifications: the first item starts open; items collapse and expand.
  const specs = page.getByRole("region", { name: "Specifications" });
  const first = specs.getByRole("button", { name: firstSpec.title });
  const firstValue = specs.getByText(firstSpec.items[0]);
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(firstValue).toBeVisible();
  await first.click();
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(firstValue).toBeHidden();

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
