"use client";

import { useSyncExternalStore } from "react";
import { APPEARANCE_SCRIPT } from "@/ui/lib/appearance";

const subscribe = () => () => {};

export function AppearanceScript() {
  const isServerRender = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );

  if (!isServerRender) return null;

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static script that applies saved appearance before the first paint
      dangerouslySetInnerHTML={{ __html: APPEARANCE_SCRIPT }}
    />
  );
}
