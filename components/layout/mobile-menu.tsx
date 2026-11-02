"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Collapsible } from "radix-ui";
import { Button } from "@/components/ui/button";
import type { NavLink } from "@/types/content";

type MobileMenuProps = {
  links: NavLink[];
  cta: NavLink;
};

/**
 * Menu below `lg` (spec, Assumption 1). The compact navbar pill expands downwards to show the
 * links: the root uses `display: contents`, so the trigger stays in the pill's top row and the
 * panel wraps onto a full-width row below it. Radix Collapsible gives the trigger
 * `aria-expanded` and `aria-controls`; Escape closes the menu and returns focus to the trigger.
 */
export function MobileMenu({ links, cta }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      onKeyDown={handleKeyDown}
      className="contents lg:hidden"
    >
      <Collapsible.Trigger asChild>
        <Button
          ref={triggerRef}
          variant="ghost"
          size="icon"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </Button>
      </Collapsible.Trigger>

      {/* overflow-hidden is needed for the height animation, so focus rings inside are drawn inset. */}
      <Collapsible.Content className="basis-full overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:animate-none">
        <nav aria-label="Main" className="flex flex-col gap-1 pt-3">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center rounded-card text-cta text-subtle-foreground hover:text-foreground focus-visible:-outline-offset-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild className="w-full focus-visible:-outline-offset-2">
            <Link href={cta.href} onClick={() => setOpen(false)}>
              {cta.label}
            </Link>
          </Button>
        </nav>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
