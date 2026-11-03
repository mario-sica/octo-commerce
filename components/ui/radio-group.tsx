"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * shadcn `radio-group` on Radix, rewritten for the colour selector (components.md):
 * - the root is `flex` (not `grid`), so items sit in a row and wrap;
 * - each item is a 44 px ring with its content (the swatch) inside; the checked item gets
 *   `border-primary`; focus uses the global outline, not the default ring.
 * Radix provides `role="radiogroup"`, arrow-key navigation and one checked item at a time.
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-transparent p-1.5 transition-colors aria-checked:border-primary disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
