import {
  ARTICLE_PATH,
  analyzeWcag,
  expect,
  presetAppearance,
  type StoredAppearance,
  TABLE_ARTICLE_PATH,
  test,
} from "./fixtures";

const scenarios: {
  name: string;
  path: string;
  appearance?: StoredAppearance;
}[] = [
  { name: "home", path: "/" },
  { name: "artigo", path: ARTICLE_PATH },
  { name: "artigo com tabela", path: TABLE_ARTICLE_PATH },
  { name: "artigo não encontrado", path: "/articles/Artigo_inexistente" },
  {
    name: "artigo em alto contraste",
    path: ARTICLE_PATH,
    appearance: { theme: "high-contrast" },
  },
  {
    name: "artigo no tema escuro",
    path: ARTICLE_PATH,
    appearance: { theme: "dark" },
  },
  {
    name: "home no tema escuro",
    path: "/",
    appearance: { theme: "dark" },
  },
  {
    name: "artigo com leitura facilitada",
    path: ARTICLE_PATH,
    appearance: { easyReading: true },
  },
  {
    name: "artigo com fonte para dislexia em 200%",
    path: ARTICLE_PATH,
    appearance: { dyslexicFont: true, fontScale: 200, spacing: "wider" },
  },
];

for (const scenario of scenarios) {
  test(`sem violações WCAG 2.1 AA: ${scenario.name}`, async ({ page }) => {
    if (scenario.appearance) await presetAppearance(page, scenario.appearance);
    await page.goto(scenario.path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForLoadState("networkidle");

    expect(await analyzeWcag(page)).toEqual([]);
  });
}

test("sem violações com o painel de aparência aberto", async ({ page }) => {
  await page.goto(ARTICLE_PATH);
  await page.getByRole("button", { name: "Aparência" }).click();
  await expect(
    page.getByRole("radio", { name: "Alto contraste" }),
  ).toBeVisible();

  expect(await analyzeWcag(page)).toEqual([]);
});
