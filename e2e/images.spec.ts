import type { Page } from "@playwright/test";
import { ARTICLE_PATH, expect, TABLE_ARTICLE_PATH, test } from "./fixtures";

async function loadFully(page: Page, path: string) {
  await page.goto(path);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.waitForLoadState("networkidle");
}

for (const path of ["/", ARTICLE_PATH, TABLE_ARTICLE_PATH]) {
  test.describe(path, () => {
    test("toda imagem tem alt e imagens de conteúdo têm descrição", async ({
      page,
    }) => {
      await loadFully(page, path);

      const images = await page.locator("img").evaluateAll((elements) =>
        elements.map((element) => ({
          src: element.getAttribute("src") ?? "",
          alt: element.getAttribute("alt"),
          content: element.closest("figure") !== null,
        })),
      );

      expect(images.filter((image) => image.alt === null)).toEqual([]);
      expect(
        images.filter((image) => image.content && !image.alt?.trim()),
      ).toEqual([]);
    });

    test("ícones svg são decorativos ou o controle tem nome", async ({
      page,
    }) => {
      await loadFully(page, path);

      const offenders = await page.locator("svg").evaluateAll((elements) =>
        elements
          .filter((svg) => {
            if (svg.closest('[aria-hidden="true"]')) return false;
            if (svg.getAttribute("role") === "img")
              return !svg.getAttribute("aria-label");
            const control = svg.closest("a, button, [role=button]");
            return !control;
          })
          .map((svg) => svg.outerHTML.slice(0, 80)),
      );

      expect(offenders).toEqual([]);
    });

    test("todo botão e link tem nome acessível", async ({ page }) => {
      await loadFully(page, path);

      const controls = page.locator(
        "a[href]:visible, button:visible, [role=button]:visible",
      );
      const count = await controls.count();
      const unnamed: string[] = [];

      for (let index = 0; index < count; index++) {
        const control = controls.nth(index);
        const snapshot = await control.ariaSnapshot();
        const named = /^- '?\w+ "[^"]+"/.test(snapshot.trim());
        if (!named) unnamed.push(snapshot.split("\n")[0]);
      }

      expect(unnamed).toEqual([]);
    });
  });
}
