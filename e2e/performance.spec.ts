import { ARTICLE_PATH, ARTICLE_TITLE, expect, test } from "./fixtures";

const BUDGET_MS = 3000;

test(`artigo carrega em menos de ${BUDGET_MS} ms`, async ({ page }) => {
  const start = Date.now();
  await page.goto(ARTICLE_PATH, { waitUntil: "commit" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    ARTICLE_TITLE,
    { timeout: BUDGET_MS },
  );

  expect(Date.now() - start).toBeLessThan(BUDGET_MS);
});

test.describe("rede real", () => {
  test.skip(
    process.env.E2E_LIVE !== "1",
    "defina E2E_LIVE=1 e E2E_LIVE_BASE_URL para medir contra pt.wikipedia",
  );

  test(`artigo real carrega em menos de ${BUDGET_MS} ms`, async ({ page }) => {
    const baseUrl = process.env.E2E_LIVE_BASE_URL ?? "http://localhost:3000";
    const start = Date.now();
    await page.goto(`${baseUrl}${ARTICLE_PATH}`, { waitUntil: "commit" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      ARTICLE_TITLE,
      { timeout: BUDGET_MS },
    );

    expect(Date.now() - start).toBeLessThan(BUDGET_MS);
  });
});
