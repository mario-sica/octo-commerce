import { expect, test } from "@playwright/test";

const PDP = "/products/octopus-countertop-blender";

/** The PDP best-sellers carousel: compact cards on the shared Carousel primitive. */
test.describe("pdp best-sellers carousel", () => {
  test("shows compact cards, no dots, and disables arrows at the edges", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(PDP);
    const region = page.getByRole("region", { name: "Best sellers slides" });
    const prev = region.getByRole("button", { name: "Previous slide" });
    const next = region.getByRole("button", { name: "Next slide" });

    // Compact cards: each one is an article whose name links to a product page.
    const cards = region.getByRole("article");
    await expect(cards).toHaveCount(5);
    const firstLink = cards.first().getByRole("link");
    await expect(firstLink).toHaveAttribute("href", /^\/products\//);
    await expect(
      region.getByRole("button", { name: /^Go to slide/ }),
    ).toHaveCount(0);

    await expect(prev).toBeDisabled();
    await expect(next).toBeEnabled();

    // Walk to the end: the next arrow disables on the last snap.
    for (let i = 0; i < 5 && (await next.isEnabled()); i++) await next.click();
    await expect(next).toBeDisabled();
    await expect(prev).toBeEnabled();
  });

  test("on lg all five cards fit, so both arrows are disabled", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PDP);
    const region = page.getByRole("region", { name: "Best sellers slides" });

    await expect(region.getByRole("article")).toHaveCount(5);
    await expect(
      region.getByRole("button", { name: "Previous slide" }),
    ).toBeDisabled();
    await expect(
      region.getByRole("button", { name: "Next slide" }),
    ).toBeDisabled();
  });
});
