import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { getNavigation } from "@/lib/data";

/** Links sit on brand red, so focus switches to the inverse ring (spec, Assumption 5). */
const linkClass =
  "rounded-pill underline-offset-4 hover:underline focus-visible:outline-ring-inverse";

/** Brand footer: stacked logo, link columns from data, and a bottom bar. */
export function SiteFooter() {
  const { footer } = getNavigation();

  return (
    <footer className="bg-brand pt-section-sm pb-6 text-brand-foreground">
      <Container className="flex flex-col gap-stack-xl">
        <div className="flex flex-col gap-stack-xl md:flex-row md:items-start md:justify-between">
          <Logo variant="stacked" label="Octopus" className="h-26 self-start" />

          <nav
            aria-label="Footer"
            className="flex flex-col gap-stack-xl md:flex-row"
          >
            {footer.columns.map((column) => {
              const headingId = `footer-${column.title.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <div
                  key={column.title}
                  className="flex flex-col gap-8 md:gap-6"
                >
                  <h2 id={headingId} className="text-body font-bold">
                    {column.title}
                  </h2>
                  <ul
                    aria-labelledby={headingId}
                    className={cn(
                      "md:gap-x-10",
                      column.twoColumns && "md:w-max md:columns-2",
                    )}
                  >
                    {column.links.map((link) => (
                      <li key={link.label} className="break-inside-avoid">
                        <Link
                          href={link.href}
                          className={cn(
                            "flex h-9 w-max items-center text-cta md:h-7",
                            linkClass,
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-1 text-label md:flex-row md:items-center md:justify-between">
          <p>{footer.copyright}</p>
          <Link
            href={footer.legal.href}
            className={cn("flex h-9 w-max items-center md:h-7", linkClass)}
          >
            {footer.legal.label}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
