import type { Locator, Page } from "@playwright/test";
import {
  ARTICLE_PATH,
  ARTICLE_TITLE,
  expect,
  gotoArticle,
  test,
} from "./fixtures";

async function hasVisibleFocusIndicator(locator: Locator) {
  return locator.evaluate(async (element) => {
    const style = getComputedStyle(element);
    const outline =
      style.outlineStyle !== "none" &&
      Number.parseFloat(style.outlineWidth) > 0;
    const shadow = style.boxShadow !== "none" && style.boxShadow !== "";
    return outline || shadow;
  });
}

async function focusChangesAppearance(locator: Locator) {
  return locator.evaluate(async (element) => {
    const snapshot = () => {
      const chain: string[] = [];
      let current: Element | null = element;
      for (let depth = 0; current && depth < 6; depth++) {
        const style = getComputedStyle(current);
        chain.push(
          [
            style.outlineStyle,
            style.outlineWidth,
            style.outlineColor,
            style.boxShadow,
            style.borderColor,
          ].join("|"),
        );
        current = current.parentElement;
      }
      return chain.join("\n");
    };
    const focused = snapshot();
    const nextFrame = () =>
      new Promise((resolve) => requestAnimationFrame(resolve));
    (element as HTMLElement).blur();
    await nextFrame();
    const blurred = snapshot();
    (element as HTMLElement).focus();
    return focused !== blurred;
  });
}

async function openSearch(page: Page) {
  const combobox = page.getByRole("combobox", {
    name: "Pesquisar na Wikipédia",
  });
  if (!(await combobox.isVisible())) {
    await page.getByRole("button", { name: "Pesquisar", exact: true }).click();
  }
  await combobox.focus();
  return combobox;
}

for (const path of ["/", ARTICLE_PATH]) {
  test(`skip link é o primeiro foco e leva ao conteúdo principal (${path})`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
    expect(await hasVisibleFocusIndicator(skipLink)).toBe(true);

    await page.keyboard.press("Enter");
    await expect(page.locator("main#conteudo")).toBeFocused();
  });
}

test("link do sumário move o foco para o título da seção", async ({ page }) => {
  await gotoArticle(page);

  const toc = page.getByRole("navigation", { name: "Neste artigo" });
  const toggle = toc.getByRole("button", { name: /Neste artigo/ });
  if (await toggle.isVisible()) {
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  }

  const link = toc.getByRole("list").getByRole("link").nth(1);
  const sectionId = (await link.getAttribute("href"))?.slice(1);
  const sectionTitle = await link.innerText();
  await link.focus();
  await page.keyboard.press("Enter");

  const heading = page.locator(`#${sectionId}`).getByRole("heading").first();
  await expect(heading).toBeFocused();
  await expect(heading).toHaveText(sectionTitle);
  await expect(heading).toBeInViewport();
});

test("busca por teclado abre o artigo escolhido", async ({ page }) => {
  await page.goto("/");
  const combobox = await openSearch(page);

  await page.keyboard.type("Sistema de inf");
  const option = page.getByRole("option", { name: new RegExp(ARTICLE_TITLE) });
  await expect(option).toBeVisible();
  await expect(combobox).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("ArrowDown");
  await expect(option).toHaveAttribute("aria-selected", "true");
  await expect(combobox).toHaveAttribute(
    "aria-activedescendant",
    (await option.getAttribute("id")) ?? "",
  );

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${ARTICLE_PATH}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    ARTICLE_TITLE,
  );
});

test("Escape fecha as sugestões da busca", async ({ page }) => {
  await page.goto("/");
  const combobox = await openSearch(page);
  await page.keyboard.type("Mega");
  await expect(combobox).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(combobox).toHaveAttribute("aria-expanded", "false");
});

for (const path of ["/", ARTICLE_PATH]) {
  test(`todo elemento focado por Tab tem indicador visível (${path})`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const missing: string[] = [];
    for (let step = 0; step < 40; step++) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      if ((await focused.count()) === 0) continue;
      if (!(await focusChangesAppearance(focused))) {
        missing.push(
          await focused.evaluate(
            (element) =>
              `${element.tagName.toLowerCase()} "${(element.getAttribute("aria-label") ?? element.textContent ?? "").trim().slice(0, 40)}"`,
          ),
        );
      }
    }

    expect(missing).toEqual([]);
  });
}

test("painel de acessibilidade abre e fecha pelo teclado", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Acessibilidade" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const highContrast = page.getByRole("radio", { name: "Alto contraste" });
  await expect(highContrast).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(highContrast).toBeHidden();
  await expect(trigger).toBeFocused();
});
