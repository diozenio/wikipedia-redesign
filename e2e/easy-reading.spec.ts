import { expect, gotoArticle, openAppearancePanel, test } from "./fixtures";

const INTRO_PARAGRAPHS = "#inicio p.reading-text";

test("leitura facilitada divide parágrafos e mostra a introdução sem IA", async ({
  page,
}) => {
  await gotoArticle(page);
  const before = await page.locator(INTRO_PARAGRAPHS).count();
  expect(before).toBeGreaterThan(0);

  await openAppearancePanel(page);
  const toggle = page.getByRole("switch", { name: "Leitura facilitada" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Escape");

  await expect
    .poll(() => page.locator(INTRO_PARAGRAPHS).count())
    .toBeGreaterThan(before);

  const summary = page.getByRole("complementary", {
    name: "Introdução do artigo",
  });
  await expect(summary).toBeVisible();
  await expect(summary).toContainText("Resumo por IA indisponível");
});

test("leitura facilitada mostra o resumo gerado por IA", async ({ page }) => {
  const summaryText =
    "Um sistema de informação organiza dados para ajudar pessoas.";
  await page.route("**/api/articles/*/summary", async (route) => {
    const body = route.request().postDataJSON();
    expect(body.title).toBe("Sistema de informação");
    expect(body.text.length).toBeGreaterThan(0);
    await route.fulfill({ json: { summary: summaryText, source: "ai" } });
  });

  await gotoArticle(page);
  await openAppearancePanel(page);
  await page.getByRole("switch", { name: "Leitura facilitada" }).click();
  await page.keyboard.press("Escape");

  const summary = page.getByRole("complementary", {
    name: "Resumo simplificado",
  });
  await expect(summary).toBeVisible();
  await expect(summary).toContainText(summaryText);
  await expect(summary).toContainText("Gerado por IA");
});
