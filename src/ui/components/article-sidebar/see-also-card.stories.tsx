import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { SeeAlsoCard } from "@/ui/components/article-sidebar/see-also-card";
import { SeeAlsoContext } from "@/ui/contexts/see-also-context";
import { MockArticleProvider } from "@/ui/providers/mocks/mock-article-provider";
import { MockSeeAlsoProvider } from "@/ui/providers/mocks/mock-see-also-provider";

const meta = {
  title: "Components/ArticleSidebar/SeeAlsoCard",
  component: SeeAlsoCard,
  parameters: { center: false },
} satisfies Meta<typeof SeeAlsoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * "Ver também" lista artigos relacionados (vindos do contexto de artigos
 * relacionados). Cada item é um link para a página do artigo.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então o cartão Ver também lista links para artigos",
      async () => {
        const region = canvas.getByRole("region", { name: "Ver também" });
        const links = within(region).getAllByRole("link");
        await expect(links.length).toBeGreaterThan(0);
        for (const link of links) {
          await expect(link.getAttribute("href")).toMatch(/^\/articles\//);
          await expect(link).toHaveAccessibleName();
        }
      },
    );
  },
};

/** Enquanto carrega, o cartão fica `aria-busy` e avisa leitores de tela. */
export const Loading: Story = {
  render: () => (
    <SeeAlsoContext value={{ status: "loading", articles: [] }}>
      <SeeAlsoCard />
    </SeeAlsoContext>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então aparece o aviso de carregamento", async () => {
      await expect(
        canvas.getByText("Carregando artigos relacionados"),
      ).toBeInTheDocument();
      await expect(
        canvasElement.querySelector('[aria-busy="true"]'),
      ).not.toBeNull();
    });
  },
};

/** Sem artigos relacionados, aparece uma mensagem em vez da lista. */
export const Empty: Story = {
  render: () => (
    <MockArticleProvider slug="Mega-Sena">
      <MockSeeAlsoProvider>
        <SeeAlsoCard />
      </MockSeeAlsoProvider>
    </MockArticleProvider>
  ),
  play: async ({ canvasElement, step }) => {
    await step(
      "Então aparece Nenhum artigo relacionado encontrado",
      async () => {
        await expect(
          within(canvasElement).getByText(
            "Nenhum artigo relacionado encontrado.",
          ),
        ).toBeVisible();
      },
    );
  },
};

/** Se a busca de relacionados falhar, o cartão explica o problema. */
export const Failed: Story = {
  render: () => (
    <SeeAlsoContext value={{ status: "error", articles: [] }}>
      <SeeAlsoCard />
    </SeeAlsoContext>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Então aparece a mensagem de erro", async () => {
      await expect(
        within(canvasElement).getByText(
          "Não foi possível carregar os artigos relacionados.",
        ),
      ).toBeVisible();
    });
  },
};
