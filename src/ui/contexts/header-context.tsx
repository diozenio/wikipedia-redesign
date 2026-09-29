"use client";

import { createContext, useContext } from "react";

export type HeaderContextValue = {
  title: string;
  tag?: { label: string; variant?: "default" | "secondary" | "outline" };
};

export const HeaderContext = createContext<HeaderContextValue | null>(null);

export function useHeader() {
  const context = useContext(HeaderContext);

  if (!context) {
    throw new Error("useHeader must be used within a HeaderContext provider");
  }

  return context;
}
