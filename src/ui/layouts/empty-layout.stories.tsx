import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { EmptyLayout } from "@/ui/layouts/empty-layout";
import { ArticleNotFoundProvider } from "@/ui/providers/article-not-found-provider";
import { NotFoundProvider } from "@/ui/providers/not-found-provider";

const meta = {
  title: "Layouts/EmptyLayout",
  component: EmptyLayout,
  parameters: { center: false },
  decorators: [
    (Story) => (
      <NotFoundProvider>
        <Story />
      </NotFoundProvider>
    ),
  ],
} satisfies Meta<typeof EmptyLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Página 404: conteúdo principal com título h1 "Página não encontrada" e um
 * botão para voltar à página principal.
 */
export const NotFound: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então o main tem o h1 Página não encontrada", async () => {
      const main = canvas.getByRole("main");
      await expect(
        within(main).getByRole("heading", {
          level: 1,
          name: "Página não encontrada",
        }),
      ).toBeVisible();
    });

    await step(
      "Então o botão leva de volta à página principal e pode ser clicado",
      async () => {
        const button = canvas.getByRole("button", {
          name: "Ir para a página principal",
        });
        await userEvent.click(button);
        await expect(button).toBeInTheDocument();
      },
    );
  },
};

/** Variante para quando o artigo pedido não existe. */
export const ArticleNotFound: Story = {
  decorators: [
    (Story) => (
      <ArticleNotFoundProvider>
        <Story />
      </ArticleNotFoundProvider>
    ),
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então o h1 é Artigo não encontrado e há o botão Ir para a página inicial",
      async () => {
        await expect(
          canvas.getByRole("heading", {
            level: 1,
            name: "Artigo não encontrado",
          }),
        ).toBeVisible();
        await expect(
          canvas.getByRole("button", { name: "Ir para a página inicial" }),
        ).toBeVisible();
      },
    );
  },
};
