/**
 * The two breakpoints, for places CSS classes can't reach (`<source media>` in art-directed
 * images). The values must match `--breakpoint-md` and `--breakpoint-lg` in app/globals.css;
 * lib/breakpoints.test.ts fails if they drift.
 */
export const BREAKPOINTS = {
  md: "50.625rem",
  lg: "75rem",
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Media query that matches from the breakpoint up, like the `md:` / `lg:` variants. */
export function minWidth(breakpoint: Breakpoint): string {
  return `(min-width: ${BREAKPOINTS[breakpoint]})`;
}
