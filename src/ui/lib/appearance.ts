export const THEMES = ["light", "dark", "high-contrast"] as const;
export type Theme = (typeof THEMES)[number];

export const FONT_SCALES = [87.5, 100, 112.5, 125, 150, 200] as const;
export type FontScale = (typeof FONT_SCALES)[number];

export const SPACINGS = ["default", "wide", "wider"] as const;
export type Spacing = (typeof SPACINGS)[number];

export type Appearance = {
  theme: Theme;
  fontScale: FontScale;
  spacing: Spacing;
  dyslexicFont: boolean;
};

export const APPEARANCE_STORAGE_KEY = "wikipedia-redesign:appearance";

export const DEFAULT_APPEARANCE: Appearance = {
  theme: "light",
  fontScale: 100,
  spacing: "default",
  dyslexicFont: false,
};

function includes<T>(list: readonly T[], value: unknown): value is T {
  return list.includes(value as T);
}

export function getSystemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) {
    return DEFAULT_APPEARANCE.theme;
  }
  if (window.matchMedia("(prefers-contrast: more)").matches) {
    return "high-contrast";
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function parseAppearance(value: unknown): Appearance | null {
  if (typeof value !== "object" || value === null) return null;

  const record = value as Record<string, unknown>;

  return {
    theme: includes(THEMES, record.theme) ? record.theme : getSystemTheme(),
    fontScale: includes(FONT_SCALES, record.fontScale)
      ? record.fontScale
      : DEFAULT_APPEARANCE.fontScale,
    spacing: includes(SPACINGS, record.spacing)
      ? record.spacing
      : DEFAULT_APPEARANCE.spacing,
    dyslexicFont: record.dyslexicFont === true,
  };
}

export function readStoredAppearance(): Appearance | null {
  try {
    const raw = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    return raw ? parseAppearance(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function writeStoredAppearance(appearance: Appearance) {
  try {
    window.localStorage.setItem(
      APPEARANCE_STORAGE_KEY,
      JSON.stringify(appearance),
    );
  } catch {}
}

export function clearStoredAppearance() {
  try {
    window.localStorage.removeItem(APPEARANCE_STORAGE_KEY);
  } catch {}
}

export function getInitialAppearance(): Appearance {
  return (
    readStoredAppearance() ?? {
      ...DEFAULT_APPEARANCE,
      theme: getSystemTheme(),
    }
  );
}

export function applyAppearance(
  appearance: Appearance,
  root: HTMLElement = document.documentElement,
) {
  root.dataset.theme = appearance.theme;
  root.dataset.fontScale = String(appearance.fontScale);
  root.dataset.spacing = appearance.spacing;
  if (appearance.dyslexicFont) {
    root.dataset.dyslexic = "true";
  } else {
    delete root.dataset.dyslexic;
  }
}

export const APPEARANCE_SCRIPT = `(function(){var d=document.documentElement,a={};try{a=JSON.parse(localStorage.getItem(${JSON.stringify(APPEARANCE_STORAGE_KEY)}))||{}}catch(e){}function m(q){return !!window.matchMedia&&matchMedia(q).matches}d.dataset.theme=${JSON.stringify(THEMES)}.indexOf(a.theme)>-1?a.theme:m("(prefers-contrast: more)")?"high-contrast":m("(prefers-color-scheme: dark)")?"dark":"light";d.dataset.fontScale=String(${JSON.stringify(FONT_SCALES)}.indexOf(a.fontScale)>-1?a.fontScale:${DEFAULT_APPEARANCE.fontScale});d.dataset.spacing=${JSON.stringify(SPACINGS)}.indexOf(a.spacing)>-1?a.spacing:${JSON.stringify(DEFAULT_APPEARANCE.spacing)};if(a.dyslexicFont===true)d.dataset.dyslexic="true"})()`;
