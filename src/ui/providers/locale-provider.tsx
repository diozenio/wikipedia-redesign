"use client";

import { type ReactNode, useMemo, useState } from "react";
import { type Locale, LocaleContext } from "@/ui/contexts/locale-context";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LocaleContext value={value}>{children}</LocaleContext>;
}
