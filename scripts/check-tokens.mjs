#!/usr/bin/env node
/**
 * Design-system guard (part of `pnpm gate`).
 * Fails if code in app/, components/, lib/ uses:
 *  - hard-coded colours (#hex, rgb(), hsl())          → use a token class
 *  - arbitrary length values like w-[13px], text-[1.1rem] → use a token / spacing scale
 *  - CSS grid utilities (grid, grid-cols-*, inline-grid…) → flexbox only
 * app/globals.css is the single place where values live, so it is excluded.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const DIRS = ["app", "components", "lib"];
const EXT = /\.(tsx?|jsx?|css|mdx)$/;
const IGNORE = [/^app\/globals\.css$/, /\.test\.tsx?$/, /\.spec\.tsx?$/];

const RULES = [
  {
    name: "hard-coded colour",
    re: /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(/g,
  },
  {
    name: "arbitrary length value",
    re: /\b[\w:-]+-\[\s*-?[\d.]+(?:px|rem|em|vh|vw|%)\s*\]/g,
  },
  {
    name: "CSS grid (flexbox only)",
    re: /(?<![\w-])(?:inline-)?grid(?:-(?:cols|rows|flow)-[\w[\]/.-]+)?(?![\w-])|\bdisplay:\s*grid/g,
  },
];

const violations = [];

for (const dir of DIRS) walk(join(ROOT, dir));

function walk(p) {
  let st;
  try {
    st = statSync(p);
  } catch {
    return;
  }
  if (st.isDirectory()) {
    for (const f of readdirSync(p)) walk(join(p, f));
    return;
  }
  const rel = relative(ROOT, p).replaceAll("\\", "/");
  if (!EXT.test(rel) || IGNORE.some((r) => r.test(rel))) return;
  const lines = readFileSync(p, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/check-tokens-ignore/.test(line)) return;
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments
    if (/^\s*import\s/.test(line)) return;
    for (const { name, re } of RULES) {
      re.lastIndex = 0;
      const m = line.match(re);
      if (m) violations.push(`${rel}:${i + 1}  ${name}: ${m.join(", ")}`);
    }
  });
}

if (violations.length) {
  console.error(`check-tokens: ${violations.length} violation(s)\n`);
  console.error(violations.join("\n"));
  console.error(
    "\nUse tokens from app/globals.css (see docs/design/spec.md). Flexbox only.\n" +
      "Escape hatch for a justified case: add `// check-tokens-ignore: <reason>` on that line and log it in the PR notes.",
  );
  process.exit(1);
}
console.log("check-tokens: ok");
