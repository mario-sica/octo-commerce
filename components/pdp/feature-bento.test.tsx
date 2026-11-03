import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { bentoRows, FeatureBento } from "@/components/pdp/feature-bento";
import { getProduct } from "@/lib/data";

describe("bentoRows", () => {
  it("groups items into rows of 1, 2, 1, 2 in order", () => {
    expect(bentoRows([1, 2, 3, 4])).toEqual([[1], [2, 3], [4]]);
    expect(bentoRows([1, 2, 3, 4, 5, 6])).toEqual([[1], [2, 3], [4], [5, 6]]);
    expect(bentoRows([1, 2])).toEqual([[1], [2]]);
    expect(bentoRows([])).toEqual([]);
  });
});

describe("FeatureBento", () => {
  it("renders one card per feature from data, titled by an h2, in data order", () => {
    const features = getProduct("octopus-countertop-blender")?.pdp?.features ?? [];
    render(<FeatureBento features={features} />);

    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.map((heading) => heading.textContent)).toEqual(
      features.map((feature) => feature.title),
    );
    for (const feature of features) {
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    }
  });

  it("renders nothing without features", () => {
    const { container } = render(<FeatureBento features={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
