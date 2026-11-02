import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins classes and drops falsy values", () => {
    expect(cn("flex", false, undefined, "gap-2")).toBe("flex gap-2");
  });

  it("lets the later tailwind class win on conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
