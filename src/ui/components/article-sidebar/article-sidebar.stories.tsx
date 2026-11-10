import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ArticleSidebar } from "@/ui/components/article-sidebar/article-sidebar";
import { MockArticleProvider } from "@/ui/providers/mocks/mock-article-provider";

const meta = {
  title: "Components/ArticleSidebar/ArticleSidebar",
  component: ArticleSidebar,
  parameters: { center: false },
} satisfies Meta<typeof ArticleSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A barra lateral é um landmark complementar ("Sobre o artigo") que junta os
 * cartões de ferramentas, idiomas e ver também.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então a barra lateral é a região complementar Sobre o artigo",
      async () => {
        await expect(
          canvas.getByRole("complementary", { name: "Sobre o artigo" }),
        ).toBeInTheDocument();
      },
    );

    await step("Então os cartões aparecem como regiões nomeadas", async () => {
      await expect(
        canvas.getByRole("region", { name: "Ferramentas" }),
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("region", { name: /idiomas$/ }),
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("region", { name: "Ver também" }),
      ).toBeInTheDocument();
    });
  },
};

/** Num artigo com infobox, o cartão de resumo rápido aparece primeiro. */
export const WithInfobox: Story = {
  decorators: [
    (Story) => (
      <MockArticleProvider slug="Shawn_Mendes">
        <Story />
      </MockArticleProvider>
    ),
  ],
  play: async ({ canvasElement, step }) => {
    await step("Então o primeiro cartão é o resumo rápido", async () => {
      const sidebar = within(canvasElement).getByRole("complementary", {
        name: "Sobre o artigo",
      });
      const regions = within(sidebar).getAllByRole("region");
      await expect(regions[0]).toHaveAccessibleName("Shawn Mendes");
    });
  },
};
