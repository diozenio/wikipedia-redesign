import { APPEARANCE_STORAGE_KEY } from "@/ui/lib/appearance";

const APPEARANCE_ATTRIBUTES = [
  "data-font-scale",
  "data-spacing",
  "data-dyslexic",
  "data-easy-reading",
  "data-footnotes",
] as const;

function clearAppearance() {
  try {
    window.localStorage.removeItem(APPEARANCE_STORAGE_KEY);
  } catch {}
  const root = document.documentElement;
  for (const attribute of APPEARANCE_ATTRIBUTES) {
    root.removeAttribute(attribute);
  }
  root.dataset.theme = "light";
}

/**
 * `beforeEach` para histórias que mexem nas preferências de acessibilidade.
 * Apaga as preferências salvas antes da história e devolve uma limpeza que
 * roda depois dela, para que uma história nunca influencie a seguinte.
 */
export function resetAppearance() {
  clearAppearance();
  return clearAppearance;
}

/** Salva preferências de acessibilidade antes da história ser montada. */
export function withStoredAppearance(appearance: Record<string, unknown>) {
  return () => {
    clearAppearance();
    window.localStorage.setItem(
      APPEARANCE_STORAGE_KEY,
      JSON.stringify(appearance),
    );
    return clearAppearance;
  };
}

/**
 * Espera as animações de entrada (motion/CSS) terminarem. Sem isso, a
 * verificação de acessibilidade (axe) pode medir o contraste de um elemento
 * ainda semitransparente.
 */
export async function waitForAnimations(element: Element) {
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    const running = element
      .getAnimations({ subtree: true })
      .filter((animation) => animation.playState === "running");
    const fading = [element, ...element.querySelectorAll("*")].some(
      (node) => Number(getComputedStyle(node).opacity) < 1,
    );
    if (running.length === 0 && !fading) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}
