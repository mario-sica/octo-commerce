import { expect, test } from "@playwright/test";

const PDP = "/products/octopus-countertop-blender";

const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 412, height: 915 },
  { width: 810, height: 1080 },
  { width: 1200, height: 800 },
];

// Without JavaScript the streamed content is never swapped in, so the page stays on the Suspense
// fallback: the state a first paint can catch. Timing would make a CLS assertion flaky; this is not.
test.use({ javaScriptEnabled: false });

for (const viewport of VIEWPORTS) {
  test(`the pdp placeholder keeps best sellers below the fold at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto(PDP);

    // Still on the fallback: the product heading has not been swapped in.
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(0);

    const box = await page
      .getByRole("region", { name: "Best sellers", exact: true })
      .boundingBox();
    expect(box?.y).toBeGreaterThanOrEqual(viewport.height);
  });
}
