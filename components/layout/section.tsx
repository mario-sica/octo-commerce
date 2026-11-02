import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SectionSpacing = "none" | "sm" | "md" | "lg";

// Literal class names so Tailwind can detect them. Section padding is set only here.
const TOP: Record<SectionSpacing, string> = {
  none: "",
  sm: "pt-section-sm",
  md: "pt-section-md",
  lg: "pt-section-lg",
};

const BOTTOM: Record<SectionSpacing, string> = {
  none: "",
  sm: "pb-section-sm",
  md: "pb-section-md",
  lg: "pb-section-lg",
};

type SectionProps = Omit<ComponentProps<"section">, "aria-labelledby"> & {
  /** id of the heading that names this section. */
  labelledBy: string;
  top?: SectionSpacing;
  bottom?: SectionSpacing;
};

/** A landmark section named by its heading. Vertical padding comes only from `top`/`bottom`. */
export function Section({
  labelledBy,
  top = "none",
  bottom = "none",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(TOP[top], BOTTOM[bottom], className)}
      {...props}
    />
  );
}
