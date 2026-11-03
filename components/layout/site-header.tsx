import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { HomeLink } from "@/components/layout/home-link";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";
import { getNavigation } from "@/lib/data";

/**
 * Sticky navbar pill. The full nav shows from `lg`; below it, the mobile menu takes over and
 * expands the pill downwards. The header keeps a fixed `h-header`, so the open pill overflows
 * over the page instead of pushing it down.
 */
export function SiteHeader() {
  const { header } = getNavigation();

  return (
    <header className="sticky top-0 z-50 h-header px-gutter pt-4">
      <div className="mx-auto flex min-h-16 max-w-content flex-wrap items-center justify-between rounded-pill bg-navbar py-3 pr-3 pl-5 shadow-navbar backdrop-blur-navbar">
        <HomeLink
          aria-label="Octopus — home"
          className="flex items-center rounded-pill text-brand"
        >
          <Logo variant="mark" className="h-5.5 md:hidden" />
          <Logo variant="full" className="hidden h-6 md:block" />
        </HomeLink>

        <nav aria-label="Main" className="hidden items-center gap-2 lg:flex">
          <ul className="flex items-center gap-2">
            {header.links.map((link) => (
              <li key={link.href}>
                <Button asChild variant="ghost">
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              </li>
            ))}
          </ul>
          <Button asChild>
            <Link href={header.cta.href}>{header.cta.label}</Link>
          </Button>
        </nav>

        <MobileMenu links={header.links} cta={header.cta} />
      </div>
    </header>
  );
}
