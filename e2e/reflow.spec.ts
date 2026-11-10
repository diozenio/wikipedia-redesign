import type { Page } from "@playwright/test";
import {
  ARTICLE_PATH,
  expect,
  presetAppearance,
  TABLE_ARTICLE_PATH,
  test,
} from "./fixtures";

test.beforeEach(() => {
  test.skip(
    test.info().project.name !== "desktop",
    "os viewports são definidos em cada teste",
  );
});

const PATHS = ["/", ARTICLE_PATH, TABLE_ARTICLE_PATH];

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const root = document.scrollingElement ?? document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
}

for (const path of PATHS) {
  test(`sem rolagem horizontal em 320px de largura (${path})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForLoadState("networkidle");

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test(`sem rolagem horizontal com texto em 200% (${path})`, async ({
    page,
  }) => {
    await presetAppearance(page, { fontScale: 200 });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForLoadState("networkidle");

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test(`sem rolagem horizontal em 320px com texto em 200% (${path})`, async ({
    page,
  }) => {
    await presetAppearance(page, { fontScale: 200, spacing: "wider" });
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForLoadState("networkidle");

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
}
