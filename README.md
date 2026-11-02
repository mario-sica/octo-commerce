# Octopus — Website

A responsive website for **Octopus**, a consumer-electronics brand: kitchen appliances, home security, hair care and accessories.

The project covers two pages:

- **Homepage**: a hero, a best-sellers carousel, a section for each product category, an "Explore all categories" grid, a store banner and the footer.
- **Product Detail Page** for the *Octopus Countertop Blender*: the product hero with a colour selector, a gallery with feature cards, an accordion of specifications, and best sellers.

Both pages are designed for three breakpoints (desktop ≥ 1200 px, tablet 810–1199 px, mobile < 810 px). They adapt fluidly between them, with no horizontal scrolling.

## Goals

- **Design fidelity:** layout, typography and spacing follow the design system. Design tokens are defined once.
- **Content from data:** products, categories and page sections come from local JSON. Adding a product to the data is enough for it to appear in the right places.
- **Reusable components:** product card, carousel, section header, accordion and button are shared by both pages.
- **Performance and accessibility:**
  - Lighthouse (mobile) Performance and Accessibility of at least 90;
  - semantic HTML, full keyboard navigation, visible focus and WCAG AA contrast;
  - responsive images without layout shift.
- **SEO basics:** titles, meta descriptions and Open Graph tags.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) with React and TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [pnpm](https://pnpm.io)

## Getting started

Requirements: Node.js 22 LTS and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Lint the project |

## Status

Work in progress. This README grows with the project: architecture, decisions and trade-offs, the test setup, and how AI coding tools were used will be documented here as each part lands.
