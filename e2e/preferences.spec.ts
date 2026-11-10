import type { Page } from "@playwright/test";
import {
  APPEARANCE_STORAGE_KEY,
  ARTICLE_PATH,
  expect,
  gotoArticle,
  openAppearancePanel,
  test,
} from "./fixtures";

async function captureAttributesAtDomContentLoaded(page: Page) {
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      const { theme, fontScale } = document.documentElement.dataset;
      (window as unknown as Record<string, unknown>).__appearanceAtDcl = {
        theme,
        fontScale,
      };
    });
  });
}

function readCapturedAttributes(page: Page) {
  return page.evaluate(
    () => (window as unknown as Record<string, unknown>).__appearanceAtDcl,
  );
}

test("tema e tamanho do texto persistem entre recargas e novas abas", async ({
  page,
  context,
}) => {
  await gotoArticle(page);
  await openAppearancePanel(page);

  await page.getByRole("radio", { name: "Alto contraste" }).check();
  await page.getByRole("button", { name: "Aumentar texto" }).click();
  await page.getByRole("button", { name: "Aumentar texto" }).click();

  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "high-contrast");
  await expect(html).toHaveAttribute("data-font-scale", "125");

  const stored = await page.evaluate(
    (key) => JSON.parse(window.localStorage.getItem(key) ?? "{}"),
    APPEARANCE_STORAGE_KEY,
  );
  expect(stored).toMatchObject({ theme: "high-contrast", fontScale: 125 });

  await captureAttributesAtDomContentLoaded(page);
  await page.reload();
  expect(await readCapturedAttributes(page)).toEqual({
    theme: "high-contrast",
    fontScale: "125",
  });
  await expect(html).toHaveAttribute("data-theme", "high-contrast");
  await expect(html).toHaveAttribute("data-font-scale", "125");

  const secondPage = await context.newPage();
  await captureAttributesAtDomContentLoaded(secondPage);
  await secondPage.goto("/");
  expect(await readCapturedAttributes(secondPage)).toEqual({
    theme: "high-contrast",
    fontScale: "125",
  });
  await expect(secondPage.locator("html")).toHaveAttribute(
    "data-theme",
    "high-contrast",
  );

  await secondPage.getByRole("button", { name: "Aparência" }).click();
  await expect(
    secondPage.getByRole("radio", { name: "Alto contraste" }),
  ).toBeChecked();
  await expect(secondPage.getByText("125%")).toBeVisible();
});

test("restaurar padrão limpa as preferências salvas", async ({ page }) => {
  await page.goto(ARTICLE_PATH);
  await openAppearancePanel(page);
  await page.getByRole("radio", { name: "Escuro" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Restaurar padrão" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-font-scale", "100");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
