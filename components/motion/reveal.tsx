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
 * reaches the lower 15% of the viewport. With reduced motion it only fades in (`reveal-fade`,
 * app/globals.css), picked with `motion-reduce:`.
 *
 * - Only blocks below the fold when the page loads are hidden, then revealed; anything on screen
 *   or above it is left alone, so nothing visible flashes out and back in. Focus inside a hidden
 *   block reveals it at once, and print shows everything.
 * - The state lives in a `data-reveal` attribute set on the DOM node, so revealing never
 *   re-renders the children. Without JavaScript or IntersectionObserver, content stays visible.
 * - Never wrap the LCP element (home hero media, first PDP image): hiding it would delay LCP.
 */
export function Reveal({ children, variant = "media", className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;

    // Only blocks below the fold are hidden. Blocks on screen, or already scrolled past (deep link,
    // restored scroll position), stay as they are.
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    element.dataset.reveal = "hidden";
    const reveal = (state: "shown" | "visible") => {
      element.dataset.reveal = state;
      observer.disconnect();
      element.removeEventListener("focusin", showNow);
    };
    // Focus shows the block at once, without the rise: focus comes on mousedown too, and a block
    // that starts moving between mousedown and mouseup would swallow the click.
    const showNow = () => reveal("visible");
    // A bottom margin instead of a ratio threshold: a block taller than the viewport would never
    // reach a 15% ratio, while its top always crosses the line.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) reveal("shown");
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(element);
    // Keyboard focus can land in the bottom 15% before the observer fires: never leave focus on an
    // invisible element.
    element.addEventListener("focusin", showNow);
    return () => {
      observer.disconnect();
      element.removeEventListener("focusin", showNow);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "data-[reveal=hidden]:opacity-0 motion-reduce:data-[reveal=shown]:animate-reveal-fade",
        // Printing never scrolls, so hidden blocks would print blank.
        "print:animate-none print:data-[reveal=hidden]:opacity-100",
        variant === "text"
          ? "motion-safe:data-[reveal=shown]:animate-reveal-text"
          : "motion-safe:data-[reveal=shown]:animate-reveal",
        className,
      )}
    >
      {children}
    </div>
  );
}
