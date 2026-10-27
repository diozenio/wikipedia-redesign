"use client";

import { createContext, useContext } from "react";
import type { Appearance } from "@/ui/lib/appearance";

export type AppearanceContextValue = {
  appearance: Appearance;
  updateAppearance: (patch: Partial<Appearance>) => void;
  resetAppearance: () => void;
};

export const AppearanceContext = createContext<AppearanceContextValue | null>(
  null,
);

export function useAppearance() {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error(
      "useAppearance must be used within an AppearanceContext provider",
    );
  }

  return context;
}
