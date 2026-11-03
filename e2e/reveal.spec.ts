import { expect, test, type Page } from "@playwright/test";

const PDP = "/products/octopus-countertop-blender";

/** The Reveal wrapper around the section named by `heading` (a direct child of `main` on home). */
const revealOf = (page: Page, heading: string) =>
  page
    .locator("main > div")
    .filter({ has: page.getByRole("heading", { level: 2, name: heading }) });

test.describe("scroll reveal", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test("a section below the fold is hidden, then revealed once in view", async ({
    page,
  }) => {
    await page.goto("/");
    const explore = revealOf(page, "Explore all categories");

    await expect(explore).toHaveAttribute("data-reveal", "hidden");
    await expect(explore).toHaveCSS("opacity", "0");

    await explore.scrollIntoViewIfNeeded();
    await expect(explore).toHaveAttribute("data-reveal", "shown");
    await expect(explore).toHaveCSS("animation-name", "reveal");
    await expect(explore).toHaveCSS("opacity", "1");
  });

  test("a section already on screen at load is left alone", async ({ page }) => {
    await page.goto("/");
    // At 375×812 the best-sellers section starts inside the first screen, under the hero.
    await expect(revealOf(page, "Best sellers")).not.toHaveAttribute(
      "data-reveal",
      /.*/,
    );
  });

  test("a deep link shows its section without scrolling", async ({ page }) => {
    await page.goto("/#accessories");
    const accessories = revealOf(page, "Accessories");
    await expect(accessories).toBeInViewport();
    await expect(accessories).toHaveCSS("opacity", "1");
  });

  test("a fast scroll past a section never leaves it hidden", async ({ page }) => {
    await page.goto("/");
    await expect(revealOf(page, "Kitchen")).toHaveAttribute("data-reveal", "hidden");

    // One jump to the bottom: the sections in between are never inside the viewport.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(page.locator('[data-reveal="hidden"]')).toHaveCount(0);
  });

  test("keyboard focus inside a hidden section reveals it", async ({ page }) => {
    await page.goto("/");
    const explore = revealOf(page, "Explore all categories");
    await expect(explore).toHaveAttribute("data-reveal", "hidden");
    await explore.getByRole("link").first().focus();
    // Shown at once, without the rise, so nothing moves under the focus (or under a click).
    await expect(explore).toHaveAttribute("data-reveal", "visible");
    await expect(explore).toHaveCSS("opacity", "1");
    await expect(explore).toHaveCSS("animation-name", "none");
  });

  test("hidden sections print", async ({ page }) => {
    await page.goto("/");
    const explore = revealOf(page, "Explore all categories");
    await expect(explore).toHaveAttribute("data-reveal", "hidden");
    await page.emulateMedia({ media: "print" });
    await expect(explore).toHaveCSS("opacity", "1");
  });

  test("the LCP elements are never hidden", async ({ page }) => {
    await page.goto("/");
    // The hero is not wrapped: no hidden ancestor above its poster.
    const poster = page.locator("main img").first();
    await expect(poster.locator("xpath=ancestor::*[@data-reveal]")).toHaveCount(0);

    await page.goto(PDP);
    const productImage = page.getByRole("img", {
      name: "Octopus Countertop Blender",
    });
    await expect(
      productImage.locator("xpath=ancestor::*[@data-reveal]"),
    ).toHaveCount(0);
    await expect(productImage).toHaveCSS("opacity", "1");
  });

  test("the store banner above the footer is never revealed", async ({
    page,
  }) => {
    await page.goto("/");
    const banner = page.getByRole("heading", { level: 2, name: /^Find us at/ });
    await expect(banner.locator("xpath=ancestor::*[@data-reveal]")).toHaveCount(0);
  });
});

test.describe("pdp product image", () => {
  for (const width of [375, 810, 1200]) {
    test(`starts below the navbar at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(PDP);
      const header = await page.locator("header").first().boundingBox();
      const image = await page
        .getByRole("img", { name: "Octopus Countertop Blender" })
        .boundingBox();
      expect(header).not.toBeNull();
      expect(image).not.toBeNull();
      expect(image!.y).toBeGreaterThanOrEqual(header!.y + header!.height - 0.5);
    });
  }
});

test.describe("scroll reveal with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("only the opacity animates", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const explore = revealOf(page, "Explore all categories");
    await explore.scrollIntoViewIfNeeded();
    await expect(explore).toHaveAttribute("data-reveal", "shown");

    // Under reduced motion the animation is `reveal-fade`, which has no transform step.
    await expect(explore).toHaveCSS("animation-name", "reveal-fade");
    const transforms = await explore.evaluate((element) =>
      element
        .getAnimations()
        .flatMap((animation) =>
          (animation.effect as KeyframeEffect).getKeyframes(),
        )
        .map((frame) => frame.transform ?? "none"),
    );
    expect(transforms.length).toBeGreaterThan(0);
    expect(new Set(transforms)).toEqual(new Set(["none"]));
  });
});
