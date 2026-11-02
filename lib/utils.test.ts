import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cn, OCTOPUS_TOKENS } from "@/lib/utils";

describe("cn", () => {
  it("joins classes and drops falsy values", () => {
    expect(cn("flex", false, undefined, "gap-2")).toBe("flex gap-2");
  });

  it("lets the later tailwind class win on conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("keeps a type token next to a text colour", () => {
    expect(cn("text-cta", "text-brand-foreground")).toBe(
      "text-cta text-brand-foreground",
    );
  });

  it("resolves conflicts between octopus tokens", () => {
    expect(cn("text-cta", "text-h1-l")).toBe("text-h1-l");
    expect(cn("font-bold", "font-book")).toBe("font-book");
    expect(cn("px-gutter", "px-4")).toBe("px-4");
    expect(cn("gap-stack-xl", "gap-cards")).toBe("gap-cards");
    expect(cn("rounded-card", "rounded-pill")).toBe("rounded-pill");
  });
});

describe("OCTOPUS_TOKENS", () => {
  const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  const namesFor = (prefix: string) =>
    [...css.matchAll(new RegExp(`--${prefix}-([a-z0-9-]+?):`, "g"))]
      .map((match) => match[1])
      .filter((name) => !name.includes("--"));

  it("lists every spacing, radius, text and font-weight token in globals.css", () => {
    const sorted = (names: readonly string[]) => [...new Set(names)].sort();

    expect(sorted(OCTOPUS_TOKENS.spacing)).toEqual(sorted(namesFor("spacing")));
    expect(sorted(OCTOPUS_TOKENS.radius)).toEqual(sorted(namesFor("radius")));
    expect(sorted(OCTOPUS_TOKENS.text)).toEqual(sorted(namesFor("text")));
    expect(sorted(OCTOPUS_TOKENS.fontWeight)).toEqual(
      sorted(namesFor("font-weight")),
    );
  });
});
