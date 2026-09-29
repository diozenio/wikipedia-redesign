"use client";

import { createContext, useContext } from "react";
import type { Action } from "@/ui/lib/action";

export type EmptyStateContextValue = {
  title: string;
  media?: string;
  description?: string;
  action?: Action;
};

export const EmptyStateContext = createContext<EmptyStateContextValue | null>(
  null,
);

export function useEmptyState() {
  const context = useContext(EmptyStateContext);

  if (!context) {
    throw new Error(
      "useEmptyState must be used within an EmptyStateContext provider",
    );
  }

  return context;
}
