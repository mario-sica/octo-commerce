"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavLink } from "@/types/content";

type MobileMenuProps = {
  links: NavLink[];
  cta: NavLink;
};

/**
 * Menu below `lg` (spec, Assumption 1). Radix Dialog gives the trigger `aria-expanded` and
 * `aria-controls`, traps focus, closes on Escape and returns focus to the trigger.
 * The panel opens over the navbar pill, with the logo and close button in the same place.
 */
export function MobileMenu({ links, cta }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="lg:hidden"
        >
          <Menu size={24} aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="top"
        showCloseButton={false}
        aria-describedby={undefined}
        className="gap-0 rounded-pill bg-background py-3 pr-3 pl-5 shadow-navbar data-[side=top]:inset-x-gutter data-[side=top]:top-4 data-[side=top]:border-0 lg:hidden"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>

        <div className="flex h-10 items-center justify-between">
          <SheetClose asChild>
            <Link
              href="/"
              aria-label="Octopus — home"
              className="flex items-center rounded-pill text-brand"
            >
              <Logo variant="mark" className="h-5.5 md:hidden" />
              <Logo variant="full" className="hidden h-6 md:block" />
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close menu">
              <X size={24} aria-hidden="true" />
            </Button>
          </SheetClose>
        </div>

        <nav aria-label="Main" className="flex flex-col gap-1 pt-3">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className="flex h-11 items-center text-cta text-subtle-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
          <SheetClose asChild>
            <Button asChild className="w-full">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
