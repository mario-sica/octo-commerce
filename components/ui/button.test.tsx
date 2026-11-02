import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders as a link with asChild, keeping the button styles", () => {
    render(
      <Button asChild>
        <a href="/coming-soon">Where to buy</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Where to buy" });
    expect(link).toHaveAttribute("href", "/coming-soon");
    expect(link).toHaveClass("rounded-pill", "text-cta", "bg-primary");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("is reachable with Tab and activates with Enter and Space", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Learn more</Button>);

    await user.tab();
    const button = screen.getByRole("button", { name: "Learn more" });
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("is skipped by Tab and does not fire when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <Button disabled onClick={onClick}>
          Learn more
        </Button>
        <Button variant="special">Explore all products</Button>
      </>,
    );

    await user.tab();
    expect(
      screen.getByRole("button", { name: "Explore all products" }),
    ).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Learn more" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps the type token next to the variant text colour", () => {
    render(<Button variant="ghostDark">Policies &amp; Terms</Button>);

    expect(
      screen.getByRole("button", { name: "Policies & Terms" }),
    ).toHaveClass("text-cta", "text-brand-foreground");
  });

  it("names an icon-only button through aria-label", () => {
    render(
      <Button variant="special" size="icon" aria-label="Next slide">
        <svg aria-hidden="true" />
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Next slide" })).toHaveClass(
      "size-10",
    );
  });
});
