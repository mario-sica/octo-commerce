import { join } from "node:path";
import { test } from "@playwright/test";

/**
 * `pnpm shots`: full-page screenshots of both pages at the three design widths, saved to
 * `.shots/` (git-ignored) for comparison with docs/design/ref/. Not part of `pnpm test:e2e`.
 */
const PAGES = [
  { name: "home", path: "/" },
  { name: "pdp", path: "/products/octopus-countertop-blender" },
];

const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 810, height: 1080 },
  { width: 1200, height: 900 },
];

const OUT_DIR = join(process.cwd(), ".shots");

for (const { name, path } of PAGES) {
  for (const viewport of VIEWPORTS) {
    test(`@shots ${name} ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const response = await page.goto(path);
      test.skip(
        response?.status() === 404,
        `${path} is not built yet (PDP route arrives in feat/pdp-route)`,
      );

      // Scroll through the page in half-screen steps so lazy images below the fold load and every
      // scroll-reveal block fires, then return to the top.
      await page.evaluate(async () => {
        for (
          let y = 0;
          y < document.body.scrollHeight;
          y += window.innerHeight / 2
        ) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);

      await page.screenshot({
        path: join(OUT_DIR, `${name}-${viewport.width}.png`),
        fullPage: true,
        animations: "disabled",
      });
    });
  }
}
