import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BREAKPOINTS, minWidth } from "@/lib/breakpoints";

describe("BREAKPOINTS", () => {
  const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

  it.each(Object.entries(BREAKPOINTS))(
    "%s matches --breakpoint-%s in globals.css",
    (name, value) => {
      const match = css.match(
        new RegExp(`--breakpoint-${name}:\\s*([0-9.]+rem)`),
      );
      expect(match?.[1]).toBe(value);
    },
  );

  it("builds a min-width media query", () => {
    expect(minWidth("lg")).toBe("(min-width: 75rem)");
  });
});
