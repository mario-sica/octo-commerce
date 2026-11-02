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
  it("opens a named dialog with the links and the CTA", async () => {
    const { user, trigger } = setup();
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
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
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes from the close button and returns focus to the trigger", async () => {
    const { user, trigger } = setup();
    await user.click(trigger);

    await user.click(screen.getByRole("button", { name: "Close menu" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it("closes when a link is chosen", async () => {
    const { user, trigger } = setup();
    await user.click(trigger);

    await user.click(screen.getByRole("link", { name: "Home Security" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
});
