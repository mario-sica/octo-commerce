# Lighthouse — mobile

Lighthouse 13.6.0, mobile form factor, default simulated throttling (slow 4G, 4× CPU), run against the production build (`pnpm build && next start`) on localhost. Open the HTML reports in a browser.

| Page | Report | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|---|
| Home | [home-mobile.report.html](home-mobile.report.html) | 100 | 100 | 100 | 100 | 0.9 s | 0.9 s | 10 ms | 0 |
| PDP | [pdp-mobile.report.html](pdp-mobile.report.html) | 99 | 100 | 100 | 100 | 0.9 s | 2.3 s | 10 ms | 0 |

Targets: Performance ≥ 90 on the home page, Accessibility ≥ 90.

## Reading the PDP LCP
The PDP's LCP element is the product image (14 KiB, preloaded, `fetchpriority="high"`, never revealed). Its simulated LCP varies between 2.3 and 2.9 s across runs (score 95–99), while the observed LCP is about 30 ms. On localhost every request — including about 200 KiB of JavaScript chunks — starts before that observed paint, so the simulation charges them all to the image. With applied DevTools throttling (`--throttling-method=devtools`), which delays each request for real, the PDP scores 99 with LCP 1.6 s.

The home page's LCP element is the hero subtitle text, painted with the first frame (the hero poster has `priority`; the video loads only on the client and only without reduced motion).

## Reproduce
```bash
# Lighthouse finds Chrome on its own; set CHROME_PATH if it doesn't.
pnpm build && pnpm exec next start -p 3200
pnpm dlx lighthouse@13.6.0 http://localhost:3200/ --output=html --output-path=docs/lighthouse/home-mobile.report.html
pnpm dlx lighthouse@13.6.0 http://localhost:3200/products/octopus-countertop-blender --output=html --output-path=docs/lighthouse/pdp-mobile.report.html
```
