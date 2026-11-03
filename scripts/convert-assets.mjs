#!/usr/bin/env node
/**
 * Converts the original design assets into the WebP files the site uses.
 * Input:  docs/Octopus_assets/ (local only, git-ignored — the files as delivered by design).
 * Output: public/images/{products,categories,lifestyle,store,hero}/ and public/videos/ (committed).
 *
 * Every output is listed once in ASSETS below: where it comes from and its maximum width.
 * Images are never upscaled. Product shots are matched to the card colour (see below).
 * See docs/content.md → Images for where each file is used.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = join(ROOT, "docs/Octopus_assets");
const OUT = join(ROOT, "public/images");

if (!existsSync(SRC)) {
  console.error(
    "convert-assets: docs/Octopus_assets/ not found (originals are local only)",
  );
  process.exit(1);
}

const card = (name) => `Product Card/${name}.png`;

/**
 * Category banner crops are named "Category=<Name>, Breakpoint=<range>.png". The ranges contain
 * "≥" and a narrow no-break space, so they are matched by content rather than typed out.
 */
function categoryBanner(category, crop) {
  const match = readdirSync(SRC).find(
    (file) =>
      file.startsWith(`Category=${category}, Breakpoint=`) &&
      (crop === "lg"
        ? file.includes("≥")
        : crop === "md"
          ? file.includes("1199")
          : !file.includes("≥") && !file.includes("1199")),
  );
  if (!match) throw new Error(`no ${crop} banner for ${category}`);
  return match;
}

/**
 * Crops that replace the "Category=" file for one breakpoint. The Hair Care desktop banner puts
 * its text over the left half, and only this export leaves that half empty (it is 1200 px wide,
 * so it is not upscaled). Spec, Assumption 23.
 */
const BANNER_OVERRIDES = {
  "hair-care/lg": "Breakpoint=Desktop.png",
};

const PRODUCT_WIDTH = 1024;
const BANNER_WIDTH = { lg: 3200, md: 1620, base: 1080 };

/** [output path under public/images, source path under docs/Octopus_assets, max width] */
const ASSETS = [
  // Product shots (cards, carousels, first PDP image)
  [
    "products/octopus-countertop-blender.webp",
    card("Frame 112"),
    PRODUCT_WIDTH,
  ],
  ["products/octopus-blender.webp", card("Frame 112-1"), PRODUCT_WIDTH],
  ["products/octopus-air-fryer-5-7l.webp", card("Frame 112-2"), PRODUCT_WIDTH],
  ["products/octopus-kettle-1-7l.webp", card("Frame 112-3"), PRODUCT_WIDTH],
  ["products/octopus-indoor-camera.webp", card("Frame 112-4"), PRODUCT_WIDTH],
  ["products/octopus-video-doorbell.webp", card("Frame 112-5"), PRODUCT_WIDTH],
  ["products/octopus-outdoor-camera.webp", card("Frame 112-6"), PRODUCT_WIDTH],
  [
    "products/octopus-ionic-hair-dryer.webp",
    card("Frame 112-7"),
    PRODUCT_WIDTH,
  ],
  [
    "products/octopus-power-bank-10000.webp",
    card("Frame 112-12"),
    PRODUCT_WIDTH,
  ],
  [
    "products/octopus-power-board-usb.webp",
    card("Frame 112-14"),
    PRODUCT_WIDTH,
  ],
  [
    "products/octopus-3-in-1-charging-station.webp",
    card("Frame 112-15"),
    PRODUCT_WIDTH,
  ],

  // Explore tile without a matching product shot (the other tiles reuse product shots)
  ["categories/accessories-tile.webp", card("Frame 112-8"), PRODUCT_WIDTH],

  // Category banners: lg (≥ 1200), md (810–1199), base (< 810)
  ...[
    ["kitchen", "Kitchen"],
    ["hair-care", "Hair Care"],
    ["home-security", "Home Security"],
    ["accessories", "Accessories"],
  ].flatMap(([id, name]) =>
    ["lg", "md", "base"].map((crop) => [
      `categories/${id}-banner-${crop}.webp`,
      BANNER_OVERRIDES[`${id}/${crop}`] ?? categoryBanner(name, crop),
      BANNER_WIDTH[crop],
    ]),
  ),

  // Large-card lifestyle photos (spec, Assumption 24)
  ["lifestyle/octopus-kettle-1-7l.webp", "lifestyle-kettle.png", 1600],
  // Indoor Camera: wide for base and md, portrait for the tall vertical card from lg
  [
    "lifestyle/octopus-indoor-camera-wide.webp",
    "lifestyle-indoor-camera-wide.webp",
    1920,
  ],
  [
    "lifestyle/octopus-indoor-camera-tall.webp",
    "lifestyle-indoor-camera-tall.webp",
    1080,
  ],

  // "Find us at" store banner: wide from lg, the taller crop below lg
  [
    "store/store-banner-lg.webp",
    "49bd8e22e90232affb0c405a7b5a405e4a6d8c5e.png",
    3200,
  ],
  [
    "store/store-banner-mobile.webp",
    "765697dbce7e5894140bd537cf5629451271cb53.png",
    2400,
  ],
];

/**
 * Product shots sit on `bg-card`, but their backgrounds vary by a few levels (#f7f7f8, #fafafa…),
 * which shows as a faint box. Scale each channel so the corner matches the card colour exactly
 * (read from --octo-neutral-50 in app/globals.css). A pure multiplier: black stays black.
 */
const cardHex = readFileSync(join(ROOT, "app/globals.css"), "utf8").match(
  /--octo-neutral-50:\s*#([0-9a-fA-F]{6})/,
)?.[1];
if (!cardHex) throw new Error("--octo-neutral-50 not found in app/globals.css");
const CARD_RGB = [0, 2, 4].map((i) => parseInt(cardHex.slice(i, i + 2), 16));

async function matchCardBackground(image) {
  const { data, info } = await image
    .clone()
    .extract({ left: 2, top: 2, width: 1, height: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const factors = CARD_RGB.map((target, c) => target / data[c]);
  const multipliers = info.channels === 4 ? [...factors, 1] : factors;
  return image.linear(
    multipliers,
    multipliers.map(() => 0),
  );
}

let total = 0;
for (const [out, src, maxWidth] of ASSETS) {
  const target = join(OUT, out);
  mkdirSync(dirname(target), { recursive: true });
  let image = sharp(join(SRC, src));
  if (src.startsWith("Product Card/")) image = await matchCardBackground(image);
  const info = await image
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(target);
  total += info.size;
  console.log(
    `convert-assets: ${out.padEnd(48)} ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
  );
}
console.log(
  `convert-assets: ${ASSETS.length} files, ${(total / 1024 / 1024).toFixed(1)} MB`,
);

/**
 * Home hero video (needs ffmpeg). The original is 2416×1360 at ≈6 Mbit/s with no audio track.
 * Each crop becomes a silent VP9 WebM (smallest, listed first) and an H.264 MP4 fallback
 * (libx264 when the local ffmpeg has it, otherwise OpenH264 at a fixed bitrate), plus a WebP
 * poster from the last frame (the clean, centred shot), which is also what reduced-motion users
 * see. The portrait crop is the centre 3:4 of the frame and covers the 1:2 (base) and 3:4 (`md`)
 * hero boxes.
 */
const HERO_VIDEO = "hair_dryer_hero.mp4";
const HERO_CROPS = [
  // [name, ffmpeg crop+scale filter, poster max width, H.264 fallback bitrate]
  ["hero-lg", "scale=1920:-2", 1920, "2500k"],
  ["hero-portrait", "crop=ih*3/4:ih,scale=810:-2", 810, "1200k"],
];

const ffmpeg = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args]);
const hasX264 = execFileSync("ffmpeg", ["-hide_banner", "-encoders"])
  .toString()
  .includes("libx264");
const h264 = (bitrate) =>
  hasX264
    ? ["-c:v", "libx264", "-preset", "slow", "-crf", "26"]
    : ["-c:v", "libopenh264", "-b:v", bitrate];

const videoOut = join(ROOT, "public/videos");
const posterOut = join(OUT, "hero");
mkdirSync(videoOut, { recursive: true });
mkdirSync(posterOut, { recursive: true });
const kb = (file) => `${(readFileSync(file).length / 1024).toFixed(0)} KB`;

for (const [name, filter, posterWidth, bitrate] of HERO_CROPS) {
  const input = ["-i", join(SRC, HERO_VIDEO), "-vf", filter, "-an"];
  const webm = join(videoOut, `${name}.webm`);
  const mp4 = join(videoOut, `${name}.mp4`);
  ffmpeg([
    ...input,
    ...["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1"],
    ...["-deadline", "good", "-cpu-used", "2", "-pix_fmt", "yuv420p"],
    webm,
  ]);
  ffmpeg([
    ...input,
    ...h264(bitrate),
    ...["-pix_fmt", "yuv420p", "-movflags", "+faststart"],
    mp4,
  ]);
  const frame = execFileSync("ffmpeg", [
    ...["-v", "error", "-sseof", "-0.1", "-i", join(SRC, HERO_VIDEO)],
    ...[
      "-frames:v",
      "1",
      "-vf",
      filter,
      "-f",
      "image2pipe",
      "-c:v",
      "png",
      "-",
    ],
  ]);
  const poster = await sharp(frame)
    .resize({ width: posterWidth, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(join(posterOut, `${name}.webp`));
  console.log(
    `convert-assets: ${name}: webm ${kb(webm)}, mp4 ${kb(mp4)}, poster ${poster.width}×${poster.height} ${(poster.size / 1024).toFixed(0)} KB`,
  );
}
