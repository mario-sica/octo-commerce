import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MobileMenu } from "@/components/layout/mobile-menu";

const links = [
  { label: "Kitchen", href: "/#kitchen" },
  { label: "Home Security", href: "/#home-security" },
];
const cta = { label: "Where to buy", href: "/coming-soon" };

function setup() {
  const user = userEvent.setup();
  render(<MobileMenu links={links} cta={cta} />);
  const trigger = screen.getByRole("button", { name: "Open menu" });
  return { user, trigger };
}

describe("MobileMenu", () => {
  it("expands to show the links and the CTA", async () => {
    const { user, trigger } = setup();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

    await user.click(trigger);

    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAccessibleName("Close menu");
    expect(
      document.getElementById(trigger.getAttribute("aria-controls") ?? ""),
    ).toContainElement(nav);
    expect(screen.getByRole("link", { name: "Kitchen" })).toHaveAttribute(
      "href",
      "/#kitchen",
    );
    expect(screen.getByRole("link", { name: "Where to buy" })).toHaveAttribute(
      "href",
      "/coming-soon",
    );
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const { user, trigger } = setup();
    await user.click(trigger);
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes from the close button and returns focus to the trigger", async () => {
    const { user, trigger } = setup();
    await user.click(trigger);

    await user.click(screen.getByRole("button", { name: "Close menu" }));

    await waitFor(() =>
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it("closes when a link is chosen", async () => {
    const { user, trigger } = setup();
    await user.click(trigger);

    await user.click(screen.getByRole("link", { name: "Home Security" }));

    await waitFor(() =>
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument(),
    );
  });
});
