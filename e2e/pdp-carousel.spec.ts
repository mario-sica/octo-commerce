import { expect, test } from "@playwright/test";
import { getBestSellers } from "@/lib/data";

const PDP = "/products/octopus-countertop-blender";
const BEST_SELLERS = getBestSellers().length;

/** The PDP best-sellers carousel: compact cards on the shared Carousel primitive. */
test.describe("pdp best-sellers carousel", () => {
  test("shows one compact card per best seller and disables arrows at the edges", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(PDP);
    const region = page.getByRole("region", { name: "Best sellers slides" });
    const prev = region.getByRole("button", { name: "Previous slide" });
    const next = region.getByRole("button", { name: "Next slide" });

    // Compact cards: each one is an article whose name links to a product page.
    const cards = region.getByRole("article");
    await expect(cards).toHaveCount(BEST_SELLERS);
    await expect(cards.first().getByRole("link")).toHaveAttribute(
      "href",
      /^\/products\//,
    );

    await expect(prev).toBeDisabled();
    await expect(next).toBeEnabled();

    // Walk to the end: the next arrow disables on the last snap.
    for (let i = 0; i < BEST_SELLERS && (await next.isEnabled()); i++) {
      await next.click();
    }
    await expect(next).toBeDisabled();
    await expect(prev).toBeEnabled();
  });

  test("on lg five cards fit: arrows and dots follow the number of snaps", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PDP);
    const region = page.getByRole("region", { name: "Best sellers slides" });
    const next = region.getByRole("button", { name: "Next slide" });
    const dots = region.getByRole("button", { name: /^Go to slide \d+$/ });

    await expect(
      region.getByRole("button", { name: "Previous slide" }),
    ).toBeDisabled();
    if (BEST_SELLERS <= 5) {
      // Everything fits: a single snap, so no dots and nothing to scroll to.
      await expect(next).toBeDisabled();
      await expect(dots).toHaveCount(0);
    } else {
      // More than five: dots appear on desktop (spec, Assumption 2).
      await expect(next).toBeEnabled();
      await expect(dots.first()).toBeVisible();
    }
  });
});
