"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * shadcn `accordion` on Radix, restyled for the PDP specifications (spec → Accordion):
 * - items are separated by a `border-b`; the trigger is `py-4 text-body font-bold`;
 * - focus uses the global outline instead of the default ring (CLAUDE.md → focus);
 * - content is `text-body font-book text-muted-foreground`, `gap-2`;
 * - the open/close animation is off under `prefers-reduced-motion`.
 * Radix provides the `button` trigger with `aria-expanded`/`aria-controls`, an `h3` around each
 * trigger, and keyboard support (Enter/Space toggle; arrows, Home and End move between triggers).
 */
function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-border-light not-last:border-b", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 items-center justify-between gap-4 py-4 text-left text-body font-bold disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        {/* Down when closed, up when open (components.md → Icons). */}
        <ChevronDownIcon
          aria-hidden="true"
          className="size-5 shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <ChevronUpIcon
          aria-hidden="true"
          className="hidden size-5 shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up motion-reduce:animate-none"
      {...props}
    >
      <div
        className={cn(
          "flex flex-col gap-2 pb-4 text-body font-book text-muted-foreground",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
