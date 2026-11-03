#!/usr/bin/env node
/**
 * Generates the neutral WebP placeholders used until the real product assets arrive, and the
 * Open Graph image placeholder (the stacked logo in brand red on the card colour).
 * Output: public/images/placeholders/*.webp and public/og.png (committed).
 *
 * The fill colour is read from app/globals.css (`--octo-neutral-50`, the `bg-card` colour),
 * so the token file stays the single place where colour values live.
 * Sizes are large enough for next/image to serve every srcset width up to 2x on desktop.
 */
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "public/images/placeholders");

const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
const match = css.match(/--octo-neutral-50:\s*(#[0-9a-fA-F]{6})/);
if (!match) {
  console.error(
    "generate-placeholders: --octo-neutral-50 not found in app/globals.css",
  );
  process.exit(1);
}
const background = match[1];

const red = css.match(/--octo-red-500:\s*(#[0-9a-fA-F]{6})/);
if (!red) {
  console.error("generate-placeholders: --octo-red-500 not found in app/globals.css");
  process.exit(1);
}

/** name → [width, height]; see docs/content.md → Images for where each ratio is used. */
const PLACEHOLDERS = {
  square: [1600, 1600], // 1:1
  portrait: [1200, 1600], // 3:4
  landscape: [2560, 1440], // 16:9
  banner: [2880, 1200], // 12:5 (2.4:1)
  "banner-portrait": [1200, 1500], // 4:5
};

mkdirSync(OUT_DIR, { recursive: true });

for (const [name, [width, height]] of Object.entries(PLACEHOLDERS)) {
  const file = join(OUT_DIR, `${name}.webp`);
  await sharp({ create: { width, height, channels: 3, background } })
    .webp({ quality: 80 })
    .toFile(file);
  console.log(`generate-placeholders: ${name}.webp ${width}×${height}`);
}

// Open Graph placeholder: 1200×630 PNG (the size and format every social preview accepts).
const OG = [1200, 630];
const logo = readFileSync(join(ROOT, "docs/design/assets/logo-stacked.svg"), "utf8")
  .replace('fill="currentColor"', `fill="${red[1]}"`);
const mark = await sharp(Buffer.from(logo), { density: 300 })
  .resize({ height: 360 })
  .png()
  .toBuffer();
await sharp({ create: { width: OG[0], height: OG[1], channels: 3, background } })
  .composite([{ input: mark, gravity: "center" }])
  .png()
  .toFile(join(ROOT, "public/og.png"));
console.log(`generate-placeholders: og.png ${OG[0]}×${OG[1]}`);
