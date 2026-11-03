"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type HomeLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onClick">;

/**
 * Link to the home page. On the home page itself Next has nothing to navigate to, so the click
 * would do nothing: it scrolls back to the top instead, and clears a `/#section` hash. The path is
 * read at click time, because `usePathname` in the layout would tie the App Shell to the URL.
 * Modified clicks (new tab, new window) keep the browser's behaviour.
 */
export function HomeLink(props: HomeLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname !== "/") return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    if (window.location.hash) window.history.replaceState(null, "", "/");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  }

  return <Link href="/" onClick={handleClick} {...props} />;
}
