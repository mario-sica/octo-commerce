import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * Octopus button (spec → Buttons). Focus uses the global `outline-ring` from globals.css;
 * `ghostDark` sits on brand red, so it switches to `outline-ring-inverse`.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-pill border text-cta whitespace-nowrap transition-colors select-none motion-reduce:transition-none disabled:pointer-events-none aria-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-primary-stroke bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground",
        special:
          "border-border bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-pressed disabled:bg-disabled disabled:text-disabled-foreground",
        ghost:
          "border-transparent text-subtle-foreground hover:bg-accent hover:text-foreground active:bg-muted disabled:text-disabled-foreground",
        ghostDark:
          "border-transparent text-brand-foreground underline-offset-4 hover:underline focus-visible:outline-ring-inverse",
      },
      size: {
        default: "h-10 px-4",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element (e.g. a link) with button styles instead of a `<button>`. */
    asChild?: boolean;
  };

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
