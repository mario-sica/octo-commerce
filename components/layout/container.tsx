import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Page-width wrapper: centred, capped at `max-w-content`, with the responsive page gutter. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-content px-gutter", className)}
      {...props}
    />
  );
}
