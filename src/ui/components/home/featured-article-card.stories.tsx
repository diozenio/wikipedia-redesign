import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { FeaturedArticleCard } from "@/ui/components/home/featured-article-card";
import { mockFeaturedFeed } from "@/ui/providers/mocks/mock-featured-articles";

const [leadArticle, article] = mockFeaturedFeed.articles;

const meta = {
  title: "Components/Home/FeaturedArticleCard",
  component: FeaturedArticleCard,
  parameters: { center: false },
  args: { article },
  decorators: [
    (Story) => (
      <div className="@container/page max-w-[24rem] p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeaturedArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * O cartão inteiro é clicável, mas para tecnologias assistivas existe um
 * único link: o título do artigo, dentro de um h3. O "Ler artigo" é só
 * visual e fica escondido de leitores de tela.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então há um único link, que é o título do artigo", async () => {
      const links = canvas.getAllByRole("link");
      await expect(links).toHaveLength(1);
      await expect(links[0]).toHaveAccessibleName(article.title);
      await expect(links[0]).toHaveAttribute(
        "href",
        `/articles/${encodeURIComponent(article.slug)}`,
      );
    });

    await step("Então o título é um h3", async () => {
      await expect(
        canvas.getByRole("heading", { level: 3, name: article.title }),
      ).toBeInTheDocument();
    });

    await step(
      "Então “Ler artigo” não é lido pelo leitor de tela",
      async () => {
        await expect(canvas.getByText("Ler artigo")).toHaveAttribute(
          "aria-hidden",
          "true",
        );
      },
    );
  },
};

/** Variante de destaque, com imagem decorativa (alt vazio, pois o título já descreve). */
export const Lead: Story = {
  args: { article: leadArticle, variant: "lead" },
  decorators: [
    (Story) => (
      <div className="@container/page w-[64rem] p-6">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então o link do título aparece e a imagem é decorativa",
      async () => {
        await expect(
          canvas.getByRole("link", { name: leadArticle.title }),
        ).toBeVisible();
        if (leadArticle.thumbnail) {
          await expect(canvasElement.querySelector("img")).toHaveAttribute(
            "alt",
            "",
          );
        }
      },
    );
  },
};
