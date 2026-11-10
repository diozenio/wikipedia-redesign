import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ArticleBreadcrumb } from "@/ui/components/article/article-breadcrumb";
import { mockArticle } from "@/ui/providers/mocks/mock-article";

const meta = {
  title: "Components/Article/ArticleBreadcrumb",
  component: ArticleBreadcrumb,
  parameters: { center: false },
} satisfies Meta<typeof ArticleBreadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A trilha de navegação é uma região `navigation` chamada "Trilha de
 * navegação", com os itens em uma lista ordenada. O último item é a página
 * atual (`aria-current="page"`).
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Trilha de navegação" });

    await step("Então a trilha lista todos os níveis em ordem", async () => {
      const items = within(nav).getAllByRole("listitem");
      await expect(items).toHaveLength(mockArticle.breadcrumb.length);
      items.forEach((item, index) => {
        expect(item).toHaveTextContent(mockArticle.breadcrumb[index].label);
      });
    });

    await step(
      "Então só o último item é marcado como página atual",
      async () => {
        const current = nav.querySelectorAll('[aria-current="page"]');
        await expect(current).toHaveLength(1);
        await expect(current[0]).toHaveTextContent(
          mockArticle.breadcrumb.at(-1)?.label ?? "",
        );
      },
    );
  },
};
