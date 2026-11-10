import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ArticleToolbar } from "@/ui/components/article/article-toolbar";
import { waitForAnimations } from "@/ui/testing/story-helpers";

const meta = {
  title: "Components/Article/ArticleToolbar",
  component: ArticleToolbar,
  parameters: { center: false },
} satisfies Meta<typeof ArticleToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A barra do artigo alterna entre Artigo e Discussão (botões com
 * `aria-pressed`) e oferece ler em voz alta, ver histórico, favoritar e mais
 * opções — todos com nome acessível.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então a aba Artigo está pressionada e Discussão não",
      async () => {
        await expect(
          canvas.getByRole("button", { name: "Artigo" }),
        ).toHaveAttribute("aria-pressed", "true");
        await expect(
          canvas.getByRole("button", { name: "Discussão" }),
        ).toHaveAttribute("aria-pressed", "false");
      },
    );

    await step("Então as ações têm nomes que dizem o que fazem", async () => {
      await expect(
        canvas.getByRole("button", { name: "Ler o artigo em voz alta" }),
      ).toBeVisible();
      await expect(
        canvas.getByRole("button", { name: "Ver histórico" }),
      ).toBeVisible();
      await expect(
        canvas.getByRole("button", { name: "Favoritar artigo" }),
      ).toHaveAttribute("aria-pressed", "false");
      await expect(
        canvas.getByRole("button", { name: "Mais opções" }),
      ).toBeVisible();
    });
    await waitForAnimations(
      canvas.getByRole("button", { name: "Ler o artigo em voz alta" }),
    );
  },
};
