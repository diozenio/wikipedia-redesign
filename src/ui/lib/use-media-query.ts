"use client";

import { useCallback, useSyncExternalStore } from "react";

// Server snapshot is `false`, so SSR renders the narrow-screen variant and the
// client corrects itself right after hydration without a mismatch.
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
