import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { SiteHeader } from "@/ui/components/header/site-header";

const meta = {
  title: "Components/Header/SiteHeader",
  component: SiteHeader,
  parameters: { center: false },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * No computador, o cabeçalho é um landmark `banner` com o menu, o logotipo
 * (link para a página principal), a pesquisa sempre visível e as ações
 * (idioma, acessibilidade, criar conta e entrar).
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então o cabeçalho é o banner da página", async () => {
      await expect(canvas.getByRole("banner")).toBeInTheDocument();
    });

    await step("Então o logotipo leva para a página principal", async () => {
      await expect(
        canvas.getByRole("link", {
          name: "Wikipédia, a enciclopédia livre — Página principal",
        }),
      ).toHaveAttribute("href", "/");
    });

    await step(
      "Então a pesquisa fica visível dentro de um landmark search",
      async () => {
        const input = canvas.getByRole("combobox", {
          name: "Pesquisar na Wikipédia",
        });
        await expect(input).toBeVisible();
        // O elemento <search> é o landmark de pesquisa do HTML.
        await expect(input.closest("search")).not.toBeNull();
        await expect(
          canvas.queryByRole("button", { name: "Pesquisar" }),
        ).not.toBeInTheDocument();
      },
    );

    await step("Então os botões de ação têm nomes acessíveis", async () => {
      await expect(
        canvas.getByRole("button", { name: "Abrir menu" }),
      ).toBeVisible();
      await expect(
        canvas.getByRole("button", { name: /Idioma da interface/ }),
      ).toBeVisible();
      await expect(
        canvas.getByRole("button", { name: "Acessibilidade" }),
      ).toBeVisible();
      await expect(
        canvas.getByRole("button", { name: "Criar conta" }),
      ).toBeVisible();
      await expect(
        canvas.getByRole("button", { name: "Entrar" }),
      ).toBeVisible();
    });
  },
};

/**
 * No celular, a pesquisa fica escondida atrás do botão "Pesquisar". Ao tocar
 * nele, o campo aparece já focado e o botão informa que está expandido.
 */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Pesquisar" });

    await step("Então a pesquisa começa escondida", async () => {
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(
        canvas.queryByRole("combobox", { name: "Pesquisar na Wikipédia" }),
      ).not.toBeInTheDocument();
    });

    await step(
      "Quando o usuário toca em Pesquisar, então o campo aparece focado",
      async () => {
        await userEvent.click(toggle);
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await expect(toggle).toHaveAttribute(
          "aria-controls",
          "header-search-mobile",
        );
        await expect(
          canvas.getByRole("combobox", { name: "Pesquisar na Wikipédia" }),
        ).toHaveFocus();
      },
    );

    await step(
      "Quando o usuário toca em Pesquisar de novo, então o campo some",
      async () => {
        await userEvent.click(toggle);
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(
          canvas.queryByRole("combobox", { name: "Pesquisar na Wikipédia" }),
        ).not.toBeInTheDocument();
      },
    );
  },
};
