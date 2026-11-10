import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";

export const ARTICLE_PATH = "/articles/Sistema_de_informa%C3%A7%C3%A3o";
export const ARTICLE_TITLE = "Sistema de informação";
export const TABLE_ARTICLE_PATH = "/articles/Shawn_Mendes";

export const APPEARANCE_STORAGE_KEY = "wikipedia-redesign:appearance";

export type StoredAppearance = Partial<{
  theme: "light" | "dark" | "high-contrast";
  fontScale: number;
  spacing: "default" | "wide" | "wider";
  dyslexicFont: boolean;
  easyReading: boolean;
}>;

export const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("**/api/articles/*/summary", (route) =>
      route.fulfill({ status: 503, json: { error: "not_configured" } }),
    );
    await use(page);
  },
});

export { expect };

export async function presetAppearance(
  page: Page,
  appearance: StoredAppearance,
) {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [APPEARANCE_STORAGE_KEY, JSON.stringify(appearance)] as const,
  );
}

export async function gotoArticle(page: Page, path = ARTICLE_PATH) {
  await page.goto(path);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

export async function analyzeWcag(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    targets: violation.nodes.map((node) => node.target.join(" ")),
  }));
}

export async function openAppearancePanel(page: Page) {
  await page.getByRole("button", { name: "Aparência" }).click();
  await expect(
    page.getByRole("radio", { name: "Alto contraste" }),
  ).toBeVisible();
}
