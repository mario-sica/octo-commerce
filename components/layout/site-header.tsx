import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";
import { getNavigation } from "@/lib/data";

/**
 * Sticky navbar pill. The full nav shows from `md`; below it, the mobile menu takes over and
 * expands the pill downwards. The header keeps a fixed `h-header`, so the open pill overflows
 * over the page instead of pushing it down.
 */
export function SiteHeader() {
  const { header } = getNavigation();

  return (
    <header className="sticky top-0 z-50 h-header px-gutter pt-4">
      <div className="mx-auto flex min-h-16 max-w-content flex-wrap items-center justify-between rounded-pill bg-navbar py-3 pr-3 pl-5 shadow-navbar backdrop-blur-navbar">
        {/* `#top` is the standard fragment for the top of the page, so the logo also works on the
            home page itself, where a plain `/` has nothing to navigate to. */}
        <Link
          href="/#top"
          aria-label="Octopus — home"
          className="flex items-center rounded-pill text-brand"
        >
          <Logo variant="mark" className="h-5.5 md:hidden" />
          <Logo variant="full" className="hidden h-6 md:block" />
        </Link>

        {/* From md the links fill the space between logo and CTA: centred there on tablet,
            against the CTA from lg (spec, Assumption 1). */}
        <nav aria-label="Main" className="hidden flex-1 items-center gap-2 pl-2 md:flex lg:pl-0">
          <ul className="flex flex-1 items-center justify-center gap-1 lg:justify-end lg:gap-2">
            {header.links.map((link) => (
              <li key={link.href}>
                {/* Tighter below lg, so logo, links and CTA fit one line at 810 px. */}
                <Button asChild variant="ghost" className="px-2.5 lg:px-4">
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
