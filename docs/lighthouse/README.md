# Lighthouse — mobile

Lighthouse 13.6.0, mobile form factor, default simulated throttling (slow 4G, 4× CPU), run against the production build (`pnpm build && next start`) on localhost. Open the HTML reports in a browser.

| Page | Report | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|---|
| Home | [home-mobile.report.html](home-mobile.report.html) | 100 | 100 | 100 | 100 | 0.9 s | 0.9 s | 10 ms | 0 |
| PDP | [pdp-mobile.report.html](pdp-mobile.report.html) | 99 | 100 | 100 | 100 | 0.9 s | 2.3 s | 10 ms | 0 |

Targets: Performance ≥ 90 on the home page, Accessibility ≥ 90.

## Reading the PDP LCP
The PDP's LCP element is the product image (14 KiB, in the initial HTML, `loading="eager"` and `fetchpriority="high"`, never revealed). Its simulated LCP varied between 2.3 and 2.9 s across local runs (score 95–99), while the observed LCP is about 30 ms. Lighthouse simulates LCP from the trace: requests that completed before the observed paint are kept as its dependencies, and on localhost that includes about 200 KiB of JavaScript chunks and the 42 KiB font, so on the simulated slow 4G the image shares bandwidth with all of them. The home page is not affected the same way: its LCP is text, which paints with the first frame, so its simulated LCP equals FCP. A local run with applied DevTools throttling (`--throttling-method=devtools`), which slows each request for real, gave the PDP 99 with LCP 1.6 s. The simulated figure is therefore largely an artifact of simulating from a localhost trace; a run against a deployed URL gives the real-network number.

The home page's LCP element is the hero subtitle text (the hero poster still has `priority`; the video loads only on the client and only without reduced motion).

## Reproduce
```bash
# Lighthouse finds Chrome on its own; set CHROME_PATH if it doesn't.
pnpm build && pnpm exec next start -p 3200
pnpm dlx lighthouse@13.6.0 http://localhost:3200/ --output=html --output-path=docs/lighthouse/home-mobile.report.html
pnpm dlx lighthouse@13.6.0 http://localhost:3200/products/octopus-countertop-blender --output=html --output-path=docs/lighthouse/pdp-mobile.report.html
```
