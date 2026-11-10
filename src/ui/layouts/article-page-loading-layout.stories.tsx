import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ArticlePageLoadingLayout } from "@/ui/layouts/article-page-loading-layout";

const meta = {
  title: "Layouts/ArticlePageLoadingLayout",
  component: ArticlePageLoadingLayout,
  parameters: { center: false },
} satisfies Meta<typeof ArticlePageLoadingLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Tela exibida enquanto o artigo carrega: o cabeçalho já funciona, o
 * conteúdo fica `aria-busy` e um aviso escondido diz “Carregando artigo…”.
 * Os blocos cinza (skeleton) são decorativos.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então o conteúdo principal está ocupado e anuncia o carregamento",
      async () => {
        const main = canvas.getByRole("main");
        await expect(main).toHaveAttribute("aria-busy", "true");
        await expect(within(main).getByRole("status")).toHaveTextContent(
          "Carregando artigo…",
        );
      },
    );

    await step(
      "Então o cabeçalho e o link de pular já estão disponíveis",
      async () => {
        await expect(canvas.getByRole("banner")).toBeInTheDocument();
        await expect(
          canvas.getByRole("link", { name: "Pular para o conteúdo" }),
        ).toHaveAttribute("href", "#conteudo");
      },
    );
  },
};
