import { expect, test } from "@playwright/test";

/** Both sides of each breakpoint (810, 1200), plus common phone and desktop widths. */
const WIDTHS = [375, 809, 810, 1000, 1199, 1200, 1440];

const PAGES = [
  { name: "home", path: "/" },
  { name: "pdp", path: "/products/octopus-countertop-blender" },
];

for (const { name, path } of PAGES) {
  test.describe(`no horizontal overflow on ${name}`, () => {
    for (const width of WIDTHS) {
      test(`${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        await page.evaluate(async () => {
          await document.fonts.ready;
        });

        const result = await page.evaluate(() => {
          const root = document.documentElement;
          const viewport = root.clientWidth;

          // Elements inside an ancestor that clips horizontally (e.g. carousel slides
          // off-screen) cannot widen the page, so they are not reported.
          const isClipped = (el: Element) => {
            for (
              let p = el.parentElement;
              p && p !== document.body;
              p = p.parentElement
            ) {
              const { overflowX } = getComputedStyle(p);
              if (overflowX === "hidden" || overflowX === "clip") return true;
            }
            return false;
          };

          // Name the elements that stick out furthest, so a failure points at the cause.
          const offenders = [...document.body.querySelectorAll("*")]
            .map((el) => ({ el, right: el.getBoundingClientRect().right }))
            .filter(({ el, right }) => right > viewport + 0.5 && !isClipped(el))
            .sort((a, b) => b.right - a.right)
            .slice(0, 5)
            .map(({ el, right }) => {
              const id = el.id ? `#${el.id}` : "";
              const cls = el
                .getAttribute("class")
                ?.split(" ")
                .slice(0, 3)
                .join(".");
              return `${el.tagName.toLowerCase()}${id}${cls ? `.${cls}` : ""} (right ${Math.round(right)}px)`;
            });
          return { scrollWidth: root.scrollWidth, viewport, offenders };
        });

        expect(
          result.scrollWidth,
          `page is wider than the viewport; elements sticking out furthest: ${result.offenders.join(", ")}`,
        ).toBeLessThanOrEqual(result.viewport);
      });
    }
  });
}
