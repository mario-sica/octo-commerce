import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductImage } from "@/components/media/product-image";

describe("ProductImage", () => {
  it("renders an optimised, lazy image inside a fixed-ratio box", () => {
    render(
      <ProductImage
        src="/images/placeholders/square.webp"
        ratio="square"
        alt="Octopus Kettle 1.7 L"
        sizes="(min-width: 75rem) 33vw, 100vw"
      />,
    );

    const img = screen.getByRole("img", { name: "Octopus Kettle 1.7 L" });
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img.getAttribute("srcset")).toContain("/_next/image");
    expect(img).toHaveAttribute("sizes", "(min-width: 75rem) 33vw, 100vw");
    expect(img.closest("div")).toHaveClass("relative", "aspect-square");
    expect(img.closest("picture")?.querySelectorAll("source")).toHaveLength(0);
  });

  it("art-directs with a source and a ratio per breakpoint", () => {
    render(
      <ProductImage
        src="/images/placeholders/portrait.webp"
        ratio="tall"
        md={{ src: "/images/placeholders/portrait.webp", ratio: "portrait" }}
        lg={{ src: "/images/placeholders/landscape.webp", ratio: "landscape" }}
        alt="Octopus Ionic Hair Dryer"
        sizes="100vw"
      />,
    );

    const img = screen.getByRole("img", { name: "Octopus Ionic Hair Dryer" });
    const sources = img.closest("picture")?.querySelectorAll("source") ?? [];
    expect([...sources].map((s) => s.getAttribute("media"))).toEqual([
      "(min-width: 75rem)",
      "(min-width: 50.625rem)",
    ]);
    expect(sources[0]?.getAttribute("srcset")).toContain("landscape.webp");
    expect(img.closest("div")).toHaveClass(
      "aspect-1/2",
      "md:aspect-3/4",
      "lg:aspect-video",
    );
  });

  it("loads eagerly with high fetch priority when it is the LCP image", () => {
    render(
      <ProductImage
        src="/images/placeholders/landscape.webp"
        ratio="landscape"
        alt="Hero"
        sizes="100vw"
        priority
      />,
    );

    const img = screen.getByRole("img", { name: "Hero" });
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
  });
});
