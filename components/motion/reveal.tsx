"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  /** `text` for text-only blocks (a shorter rise, spec → Motion); media blocks use the default. */
  variant?: "media" | "text";
  className?: string;
};

/**
 * One-shot scroll reveal (spec → Motion). Everything inside fires together, once, when the block
 * reaches the lower 15% of the viewport. With reduced motion the keyframes animate opacity only
 * (app/globals.css).
 *
 * - A block already on screen when the page loads is left alone, so nothing visible flashes out
 *   and back in; only blocks below the fold are hidden, then revealed.
 * - The state lives in a `data-reveal` attribute set on the DOM node, so revealing never
 *   re-renders the children. Without JavaScript or IntersectionObserver, content stays visible.
 * - Never wrap the LCP element (home hero media, first PDP image): hiding it would delay LCP.
 */
export function Reveal({ children, variant = "media", className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const { top, bottom } = element.getBoundingClientRect();
    if (top < window.innerHeight && bottom > 0) return;

    element.dataset.reveal = "hidden";
    // A bottom margin instead of a ratio threshold: a block taller than the viewport would never
    // reach a 15% ratio, while its top always crosses the line.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "data-[reveal=hidden]:opacity-0",
        variant === "text"
          ? "data-[reveal=shown]:animate-reveal-text"
          : "data-[reveal=shown]:animate-reveal",
        className,
      )}
    >
      {children}
    </div>
  );
}
