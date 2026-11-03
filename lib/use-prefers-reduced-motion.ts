import { useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * True when the user asks for reduced motion; follows changes to the setting. During server
 * rendering it returns `serverValue`: `false` where motion is only a transition (carousel), `true`
 * where motion means downloading media (hero video), so nothing loads before the client knows.
 */
export function usePrefersReducedMotion(serverValue = false) {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => serverValue,
  );
}
