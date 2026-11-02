import { expect, test, type Locator } from "@playwright/test";

/** The home best-sellers carousel (shared Carousel primitive). */
function carousel(page: import("@playwright/test").Page): Locator {
  return page.getByRole("region", { name: "Best sellers slides" });
}

const currentDot = (region: Locator) =>
  region.locator('button[aria-current="true"]');

test.describe("home best-sellers carousel", () => {
  test("arrows disable at the edges and dots follow the selected slide", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const region = carousel(page);
    const prev = region.getByRole("button", { name: "Previous slide" });
    const next = region.getByRole("button", { name: "Next slide" });
    const dots = region.getByRole("button", { name: /^Go to slide \d+$/ });

    await expect(prev).toBeDisabled();
    await expect(next).toBeEnabled();
    await expect(currentDot(region)).toHaveAccessibleName("Go to slide 1");

    await next.click();
    await expect(prev).toBeEnabled();
    await expect(currentDot(region)).toHaveAccessibleName("Go to slide 2");

    // Walk to the end: the next arrow disables on the last snap.
    const count = await dots.count();
    for (let i = 2; i < count; i++) await next.click();
    await expect(next).toBeDisabled();
    await expect(currentDot(region)).toHaveAccessibleName(
      `Go to slide ${count}`,
    );

    // A dot jumps straight to its slide.
    await dots.first().click();
    await expect(currentDot(region)).toHaveAccessibleName("Go to slide 1");
    await expect(prev).toBeDisabled();
  });

  test("arrow keys move the carousel when focus is inside it", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const region = carousel(page);

    await region
      .getByRole("link", { name: /^Learn more/ })
      .first()
      .focus();
    await page.keyboard.press("ArrowRight");
    await expect(currentDot(region)).toHaveAccessibleName("Go to slide 2");
  });

  test("below lg the dots are hidden and the arrows stay", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const region = carousel(page);

    await expect(
      region.getByRole("button", { name: /^Go to slide/ }),
    ).toHaveCount(0);
    await expect(
      region.getByRole("button", { name: "Next slide" }),
    ).toBeVisible();
  });
});
