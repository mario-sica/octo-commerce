import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ColourSelector } from "@/components/pdp/colour-selector";

const COLOURS = [
  { name: "Black", hex: "#000000" },
  { name: "Silver", hex: "#C0C0C0" },
];

describe("ColourSelector", () => {
  it("starts on the first colour, labelled by the visible text", () => {
    render(<ColourSelector colours={COLOURS} />);

    const group = screen.getByRole("radiogroup", { name: "Colour - Black" });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Black" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Silver" })).not.toBeChecked();
  });

  it("selecting a colour updates the selected state and the label", async () => {
    const user = userEvent.setup();
    render(<ColourSelector colours={COLOURS} />);

    await user.click(screen.getByRole("radio", { name: "Silver" }));

    expect(screen.getByRole("radio", { name: "Silver" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Black" })).not.toBeChecked();
    expect(screen.getByText("Colour - Silver")).toBeInTheDocument();
  });
});
