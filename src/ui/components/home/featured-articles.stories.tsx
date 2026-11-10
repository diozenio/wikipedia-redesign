import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { FeaturedArticles } from "@/ui/components/home/featured-articles";
import { FeaturedArticlesContext } from "@/ui/contexts/featured-articles-context";
import { mockFeaturedFeed } from "@/ui/providers/mocks/mock-featured-articles";
import { MockFeaturedArticlesProvider } from "@/ui/providers/mocks/mock-featured-articles-provider";

const meta = {
  title: "Components/Home/FeaturedArticles",
  component: FeaturedArticles,
  parameters: { center: false },
  decorators: [
    (Story) => (
      <div className="@container/page p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeaturedArticles>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Seção "Artigos em destaque": um cartão principal e os demais em grade,
 * com a data dos dados num elemento `<time>`.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então a seção é nomeada pelo título Artigos em destaque",
      async () => {
        await expect(
          canvas.getByRole("region", { name: "Artigos em destaque" }),
        ).toBeInTheDocument();
      },
    );

    await step("Então há um link para cada artigo em destaque", async () => {
      await expect(canvas.getAllByRole("link")).toHaveLength(
        mockFeaturedFeed.articles.length,
      );
    });

    await step("Então a data aparece num elemento time", async () => {
      await expect(canvasElement.querySelector("time")).toHaveAttribute(
        "datetime",
        mockFeaturedFeed.date,
      );
    });
  },
};

/** Enquanto os destaques carregam, a área fica `aria-busy` e avisa “Carregando destaques…”. */
export const Loading: Story = {
  render: () => (
    <FeaturedArticlesContext
      value={{ ...mockFeaturedFeed, articles: [], status: "loading" }}
    >
      <FeaturedArticles />
    </FeaturedArticlesContext>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Então aparece o aviso de carregamento", async () => {
      await expect(
        within(canvasElement).getByText("Carregando destaques…"),
      ).toBeInTheDocument();
      await expect(
        canvasElement.querySelector('[aria-busy="true"]'),
      ).not.toBeNull();
    });
  },
};

/** Se der erro, aparece uma mensagem pedindo para tentar mais tarde. */
export const Failed: Story = {
  render: () => (
    <FeaturedArticlesContext
      value={{ ...mockFeaturedFeed, articles: [], status: "error" }}
    >
      <FeaturedArticles />
    </FeaturedArticlesContext>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Então aparece a mensagem de erro", async () => {
      await expect(
        within(canvasElement).getByText(
          /Não foi possível carregar os destaques/,
        ),
      ).toBeVisible();
    });
  },
};

/** Para uma data sem dados, a seção avisa que não há destaques. */
export const Empty: Story = {
  render: () => (
    <MockFeaturedArticlesProvider date="1999-01-01">
      <FeaturedArticles />
    </MockFeaturedArticlesProvider>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Então aparece Nenhum destaque disponível", async () => {
      await expect(
        within(canvasElement).getByText(
          "Nenhum destaque disponível para esta data.",
        ),
      ).toBeVisible();
    });
  },
};
