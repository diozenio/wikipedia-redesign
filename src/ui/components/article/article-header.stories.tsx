import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ArticleHeader } from "@/ui/components/article/article-header";
import { mockArticle } from "@/ui/providers/mocks/mock-article";

const meta = {
  title: "Components/Article/ArticleHeader",
  component: ArticleHeader,
  parameters: { center: false },
} satisfies Meta<typeof ArticleHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * O cabeçalho do artigo tem um único título de nível 1, a origem, os selos e
 * as informações (idiomas, última edição e quem acompanha) em listas nomeadas.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então o título do artigo é o único h1", async () => {
      await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(
        1,
      );
      await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
        mockArticle.title,
      );
    });

    await step(
      "Então os selos aparecem numa lista chamada Selos do artigo",
      async () => {
        const badges = canvas.getByRole("list", { name: "Selos do artigo" });
        await expect(within(badges).getAllByRole("listitem")).toHaveLength(
          mockArticle.badges.length,
        );
      },
    );

    await step(
      "Então as informações mostram a quantidade de idiomas",
      async () => {
        const info = canvas.getByRole("list", {
          name: "Informações do artigo",
        });
        await expect(info).toHaveTextContent(
          `${mockArticle.meta.languages} idiomas`,
        );
      },
    );
  },
};
