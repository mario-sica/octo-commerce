import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Category, Product } from "@/types/catalog";

/** Loads CategorySection as if products.json had been changed by `change`. */
async function loadSection(
  change: (products: Product[]) => Product[] = (products) => products,
) {
  vi.resetModules();
  vi.doMock("@/data/products.json", async (importOriginal) => {
    const original = await importOriginal<{ default: Product[] }>();
    return { default: change(original.default) };
  });
  // Import in sequence, so both modules see the mocked JSON.
  const data = await import("@/lib/data");
  const { CategorySection } =
    await import("@/components/home/category-section");
  const category = (id: Category["id"]) =>
    data.getCategories().find((c) => c.id === id)!;
  return { CategorySection, category };
}

afterEach(() => {
  vi.doUnmock("@/data/products.json");
  vi.resetModules();
});

describe("CategorySection", () => {
  it("renders a one-product category as that product's banner", async () => {
    const { CategorySection, category } = await loadSection();
    const { container } = render(
      <CategorySection category={category("hair-care")} />,
    );

    expect(container.querySelector("section#hair-care")).not.toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Octopus Ionic Hair Dryer",
      }),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(
      screen.getByRole("link", {
        name: "Learn more about Octopus Ionic Hair Dryer",
      }),
    ).toBeInTheDocument();
  });

  it("renders a multi-product category as a header plus one card per product, in JSON order", async () => {
    const { CategorySection, category } = await loadSection();
    render(<CategorySection category={category("kitchen")} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Kitchen" }),
    ).toBeInTheDocument();
    const names = screen
      .getAllByRole("article")
      .map(
        (card) => within(card).getByRole("heading", { level: 3 }).textContent,
      );
    expect(names).toEqual([
      "Octopus Kettle 1.7 L",
      "Octopus Blender",
      "Octopus Countertop Blender",
      "Octopus Air Fryer 5.7 L",
    ]);
  });

  it("switches from banner to cards when a second product joins the category", async () => {
    const { CategorySection, category } = await loadSection((products) => [
      ...products,
      {
        ...products.find((p) => p.category === "hair-care")!,
        id: "test-straightener",
        slug: "test-straightener",
        name: "Test Straightener",
      },
    ]);
    render(<CategorySection category={category("hair-care")} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Hair Care" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("renders nothing for a category without products", async () => {
    const { CategorySection, category } = await loadSection((products) =>
      products.filter((p) => p.category !== "accessories"),
    );
    const { container } = render(
      <CategorySection category={category("accessories")} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
