import { expect, test } from "@playwright/test";

/** Both sides of each breakpoint (810, 1200), plus common phone and desktop widths. */
const WIDTHS = [375, 809, 810, 1000, 1199, 1200, 1440];

test.describe("no horizontal overflow on home", () => {
  for (const width of WIDTHS) {
    test(`${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);

      const result = await page.evaluate(() => {
        const root = document.documentElement;
        const viewport = root.clientWidth;
        // Name the elements that stick out, so a failure points at the cause.
        const offenders = [...document.body.querySelectorAll("*")]
          .filter((el) => el.getBoundingClientRect().right > viewport + 0.5)
          .slice(0, 5)
          .map((el) => {
            const id = el.id ? `#${el.id}` : "";
            const cls = el
              .getAttribute("class")
              ?.split(" ")
              .slice(0, 3)
              .join(".");
            return `${el.tagName.toLowerCase()}${id}${cls ? `.${cls}` : ""}`;
          });
        return { scrollWidth: root.scrollWidth, viewport, offenders };
      });

      expect(
        result.scrollWidth,
        `page is wider than the viewport; widest elements: ${result.offenders.join(", ")}`,
      ).toBeLessThanOrEqual(result.viewport);
    });
  }
});
