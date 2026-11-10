import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { HomePageLayout } from "@/ui/layouts/home-page-layout";
import { mockFeaturedFeed } from "@/ui/providers/mocks/mock-featured-articles";

const meta = {
  title: "Layouts/HomePageLayout",
  component: HomePageLayout,
  parameters: { center: false },
} satisfies Meta<typeof HomePageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

async function checkLandmarks(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole("banner")).toBeInTheDocument();
  await expect(canvas.getByRole("main")).toHaveAttribute("id", "conteudo");
  await expect(canvas.getByRole("contentinfo")).toBeInTheDocument();
  await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
}

/**
 * Página inicial completa: link de pular, cabeçalho, conteúdo principal
 * (`main#conteudo`) com o título e os destaques, e o rodapé.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então a página tem banner, main e contentinfo e um único h1",
      async () => {
        await checkLandmarks(canvasElement);
      },
    );

    await step(
      "Quando o usuário aperta Tab, então o primeiro foco é Pular para o conteúdo",
      async () => {
        await userEvent.tab();
        await expect(
          canvas.getByRole("link", { name: "Pular para o conteúdo" }),
        ).toHaveFocus();
      },
    );

    await step("Então os artigos em destaque aparecem", async () => {
      await expect(
        canvas.getByRole("link", { name: mockFeaturedFeed.articles[0].title }),
      ).toBeVisible();
    });
  },
};

/** Mesma página em largura de tablet. */
export const Tablet: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
  play: async ({ canvasElement, step }) => {
    await step("Então os landmarks continuam presentes", async () => {
      await checkLandmarks(canvasElement);
    });
  },
};

/** Mesma página no celular: a pesquisa fica atrás do botão Pesquisar. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  play: async ({ canvasElement, step }) => {
    await step(
      "Então os landmarks continuam e o botão Pesquisar aparece",
      async () => {
        await checkLandmarks(canvasElement);
        await expect(
          within(canvasElement).getByRole("button", { name: "Pesquisar" }),
        ).toBeVisible();
      },
    );
  },
};
