# Lighthouse — mobile

Lighthouse 13.6.0, mobile form factor, default simulated throttling (slow 4G, 4× CPU), run against the live deploy at <https://octo-commerce.vercel.app/>. Open the HTML reports in a browser.

| Page | Report | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|---|
| Home | [home-mobile.report.html](home-mobile.report.html) | 100 | 100 | 100 | 100 | 1.0 s | 1.0 s | 10 ms | 0 |
| PDP | [pdp-mobile.report.html](pdp-mobile.report.html) | 99 | 100 | 100 | 100 | 0.9 s | 2.1 s | 10 ms | 0 |

PDP CLS checked over 5 runs, all 0. The report is the run closest to the median LCP.

Targets: Performance ≥ 90 on the home page, Accessibility ≥ 90.

## Reproduce
```bash
# Lighthouse finds Chrome on its own; set CHROME_PATH if it doesn't.
pnpm dlx lighthouse@13.6.0 https://octo-commerce.vercel.app/ --output=html --output-path=docs/lighthouse/home-mobile.report.html
pnpm dlx lighthouse@13.6.0 https://octo-commerce.vercel.app/products/octopus-countertop-blender --output=html --output-path=docs/lighthouse/pdp-mobile.report.html
```
