import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProductSpecs } from "@/components/pdp/product-specs";
import { getProduct } from "@/lib/data";

const detail = getProduct("octopus-countertop-blender")?.pdp;
if (!detail) throw new Error("the countertop blender has pdp data");

function renderSpecs() {
  render(<ProductSpecs specs={detail!.specs} downloads={detail!.downloads} />);
  return screen.getAllByRole("button");
}

describe("ProductSpecs accordion", () => {
  it("renders one trigger per spec group, in data order, with Downloads last", () => {
    const triggers = renderSpecs();

    expect(triggers.map((trigger) => trigger.textContent)).toEqual([
      ...detail.specs.map((group) => group.title),
      "Downloads",
    ]);
    expect(
      screen.getByRole("region", { name: "Specifications" }),
    ).toBeInTheDocument();
  });

  it("opens the first item only; an open trigger controls its panel", () => {
    const triggers = renderSpecs();

    expect(triggers.map((trigger) => trigger.getAttribute("aria-expanded"))).toEqual([
      "true",
      ...triggers.slice(1).map(() => "false"),
    ]);
    // Radix sets aria-controls only while the panel is mounted (open), so it never points
    // at a missing element.
    const firstPanel = document.getElementById(
      triggers[0].getAttribute("aria-controls") ?? "",
    );
    expect(firstPanel).toHaveTextContent(detail.specs[0].items[0]);
    expect(firstPanel).toHaveAccessibleName(detail.specs[0].title);
  });

  it("toggles with Enter and Space, and arrows move between triggers", async () => {
    const user = userEvent.setup();
    const triggers = renderSpecs();
    const downloads = triggers[triggers.length - 1];

    await user.tab();
    expect(triggers[0]).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(triggers[0]).toHaveAttribute("aria-expanded", "false");

    await user.keyboard("{ArrowDown}");
    expect(triggers[1]).toHaveFocus();
    await user.keyboard(" ");
    expect(triggers[1]).toHaveAttribute("aria-expanded", "true");
    expect(
      document.getElementById(triggers[1].getAttribute("aria-controls") ?? ""),
    ).toHaveTextContent(detail.specs[1].items[0]);

    await user.keyboard("{End}");
    expect(downloads).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(downloads).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "User manual" })).toHaveAttribute(
      "href",
      "/coming-soon",
    );
  });
});
