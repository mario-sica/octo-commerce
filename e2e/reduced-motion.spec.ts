import { expect, test, type Locator, type Page } from "@playwright/test";

/** The computed animation of the panel a disclosure trigger controls (Radix sets aria-controls when open). */
async function panelAnimation(page: Page, trigger: Locator) {
  const id = await trigger.getAttribute("aria-controls");
  return page.evaluate(
    (panelId) => getComputedStyle(document.getElementById(panelId ?? "")!).animationName,
    id,
  );
}

async function openMenu(page: Page) {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  return page.getByRole("button", { name: "Close menu" });
}

async function openDownloads(page: Page) {
  await page.goto("/products/octopus-countertop-blender");
  const downloads = page.getByRole("button", { name: "Downloads" });
  await downloads.click();
  return downloads;
}

/**
 * Height animations of the menu and the accordion must not play with reduced motion. They are
 * gated with `motion-safe:`, because a `motion-reduce:animate-none` override loses to the
 * `data-[state]` rules (equal or higher specificity, later in the CSS).
 */
test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the menu panel opens without animating", async ({ page }) => {
    expect(await panelAnimation(page, await openMenu(page))).toBe("none");
  });

  test("an accordion panel opens without animating", async ({ page }) => {
    expect(await panelAnimation(page, await openDownloads(page))).toBe("none");
  });
});

test.describe("without a motion preference", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the menu and accordion panels animate", async ({ page }) => {
    expect(await panelAnimation(page, await openMenu(page))).toBe(
      "collapsible-down",
    );
    expect(await panelAnimation(page, await openDownloads(page))).toBe(
      "accordion-down",
    );
  });
});
