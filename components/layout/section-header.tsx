import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  /** Heading id, used by the section's `aria-labelledby`. */
  id: string;
  title: string;
  subtitle?: string;
  /** Usually a button link, e.g. "Explore all products". */
  cta?: ReactNode;
  align?: "start" | "center";
  /**
   * Type scale. `large` is the category section heading (h2-s → h1-m → h1-l); `small` is the
   * "Best sellers" / "Explore all categories" heading (h3-s → h3-m → h3-l). Defaults from `align`.
   */
  size?: "large" | "small";
  level?: 2 | 3;
  className?: string;
};

const TITLE = {
  large: "text-h2-s md:text-h1-m lg:text-h1-l",
  small: "text-h3-s md:text-h3-m lg:text-h3-l",
};

/** Section heading block: title, optional subtitle and CTA (spec → Typography, heading.png). */
export function SectionHeader({
  id,
  title,
  subtitle,
  cta,
  align = "start",
  size = align === "center" ? "large" : "small",
  level = 2,
  className,
}: SectionHeaderProps) {
  const Heading = level === 2 ? "h2" : "h3";

  return (
    <div
      className={cn(
        "flex flex-col gap-stack-sm",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <Heading id={id} className={TITLE[size]}>
          {title}
        </Heading>
        {subtitle && (
          <p className="text-subtitle-s text-muted-foreground md:text-subtitle-m lg:text-subtitle-l">
            {subtitle}
          </p>
        )}
      </div>
      {cta}
    </div>
  );
}
