import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Same focus ring the Button primitive uses, for custom interactive elements.
export const focusRing =
  "outline-none focus-visible:ring-3 focus-visible:ring-ring/50";
