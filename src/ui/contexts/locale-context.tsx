"use client";

import { createContext, useContext } from "react";

export type Locale = "pt" | "en" | "es" | "fr" | "de";

export type LocaleOption = {
  code: Locale;
  label: string;
};

export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleContext provider");
  }

  return context;
}
