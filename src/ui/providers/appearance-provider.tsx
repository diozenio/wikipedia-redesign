"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppearanceContext } from "@/ui/contexts/appearance-context";
import {
  APPEARANCE_STORAGE_KEY,
  type Appearance,
  applyAppearance,
  clearStoredAppearance,
  DEFAULT_APPEARANCE,
  getInitialAppearance,
  getSystemTheme,
  writeStoredAppearance,
} from "@/ui/lib/appearance";

export function AppearanceProvider({ children }: { children: ReactNode }) {
  // Lazy init reads the same storage as the inline script in the root layout,
  // so React state matches the attributes already applied to <html>.
  const [appearance, setAppearance] = useState<Appearance>(() =>
    typeof window === "undefined" ? DEFAULT_APPEARANCE : getInitialAppearance(),
  );
  // Only persist after an explicit change, so visitors who never touch the
  // panel keep following their system theme.
  const shouldPersist = useRef(false);

  // Also re-applies after React's dev remount resets <html> attributes.
  useLayoutEffect(() => {
    applyAppearance(appearance);
    if (shouldPersist.current) {
      writeStoredAppearance(appearance);
    }
  }, [appearance]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === APPEARANCE_STORAGE_KEY) {
        setAppearance(getInitialAppearance());
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateAppearance = useCallback((patch: Partial<Appearance>) => {
    shouldPersist.current = true;
    setAppearance((previous) => ({ ...previous, ...patch }));
  }, []);

  const resetAppearance = useCallback(() => {
    shouldPersist.current = false;
    clearStoredAppearance();
    setAppearance({ ...DEFAULT_APPEARANCE, theme: getSystemTheme() });
  }, []);

  const value = useMemo(
    () => ({ appearance, updateAppearance, resetAppearance }),
    [appearance, updateAppearance, resetAppearance],
  );

  return <AppearanceContext value={value}>{children}</AppearanceContext>;
}
