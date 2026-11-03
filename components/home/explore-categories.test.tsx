import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExploreCategories } from "@/components/home/explore-categories";

describe("ExploreCategories", () => {
  it("renders the tiles in the configured order, each linking to its section", () => {
    render(
      <ExploreCategories
        title="Explore all categories"
        categoryIds={["kitchen", "home-security", "hair-care", "accessories"]}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Explore all categories" }),
    ).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Kitchen",
      "Home Security",
      "Hair Care",
      "Accessories",
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/#kitchen",
      "/#home-security",
      "/#hair-care",
      "/#accessories",
    ]);
  });
});
