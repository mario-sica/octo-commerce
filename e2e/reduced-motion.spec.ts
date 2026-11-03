import { expect, test, type Locator, type Page } from "@playwright/test";

/** The panel a disclosure trigger controls (Radix sets aria-controls while it is open). */
async function panelOf(page: Page, trigger: Locator) {
  const id = await trigger.getAttribute("aria-controls");
  expect(id, "an open trigger names its panel").toBeTruthy();
  // Attribute selector: Radix ids contain colons, which `#id` would need escaped.
  return page.locator(`[id="${id}"]`);
}

async function openMenu(page: Page) {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  return panelOf(page, page.getByRole("button", { name: "Close menu" }));
}

async function openDownloads(page: Page) {
  await page.goto("/products/octopus-countertop-blender");
  const downloads = page.getByRole("button", { name: "Downloads" });
  await downloads.click();
  return panelOf(page, downloads);
}

/**
 * Height animations of the menu and the accordion must not play with reduced motion. They are
 * gated with `motion-safe:`, because a `motion-reduce:animate-none` override loses to the
 * `data-[state]` rules (equal or higher specificity, later in the CSS).
 */
test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the menu panel opens without animating", async ({ page }) => {
    await expect(await openMenu(page)).toHaveCSS("animation-name", "none");
  });

  test("an accordion panel opens without animating", async ({ page }) => {
    await expect(await openDownloads(page)).toHaveCSS("animation-name", "none");
  });
});

test.describe("without a motion preference", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the menu panel animates", async ({ page }) => {
    await expect(await openMenu(page)).toHaveCSS(
      "animation-name",
      "collapsible-down",
    );
  });

  test("an accordion panel animates", async ({ page }) => {
    await expect(await openDownloads(page)).toHaveCSS(
      "animation-name",
      "accordion-down",
    );
  });
});
