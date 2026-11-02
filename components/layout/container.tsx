import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Page-width wrapper. The gutter sits outside the content cap, so content is `max-w-content`
 * wide and lines up with the navbar pill (which uses the same `px-gutter` + `max-w-content`).
 * `className` styles the inner content box.
 */
export function Container({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className="px-gutter" {...props}>
      <div className={cn("mx-auto w-full max-w-content", className)}>
        {children}
      </div>
    </div>
  );
}
