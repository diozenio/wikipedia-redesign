import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { LanguagesCard } from "@/ui/components/article-sidebar/languages-card";
import { mockArticle } from "@/ui/providers/mocks/mock-article";
import { MockArticleProvider } from "@/ui/providers/mocks/mock-article-provider";

const meta = {
  title: "Components/ArticleSidebar/LanguagesCard",
  component: LanguagesCard,
  parameters: { center: false },
} satisfies Meta<typeof LanguagesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Mostra os primeiros idiomas em destaque e um "Ver todos os N idiomas" que
 * expande a lista completa. Cada link é escrito no próprio idioma e tem
 * `lang`/`hreflang`, para o leitor de tela pronunciar certo.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const total = mockArticle.languages.length;

    await step("Então o título diz quantos idiomas existem", async () => {
      await expect(
        canvas.getByRole("region", { name: `${total} idiomas` }),
      ).toBeInTheDocument();
    });

    await step(
      "Então cada link de idioma informa o idioma em lang e hreflang",
      async () => {
        const [first] = mockArticle.languages;
        const link = canvas.getAllByRole("link", { name: first.autonym })[0];
        await expect(link).toHaveAttribute("lang", first.code);
        await expect(link).toHaveAttribute("hreflang", first.code);
        await expect(link).toHaveAttribute("href", first.url);
      },
    );

    await step(
      "Quando o usuário abre Ver todos, então a lista completa aparece",
      async () => {
        const summary = canvas.getByText(`Ver todos os ${total} idiomas`);
        const details = summary.closest("details");
        await expect(details).not.toHaveAttribute("open");
        await userEvent.click(summary);
        await expect(details).toHaveAttribute("open");
        const last = mockArticle.languages[total - 1];
        await expect(
          within(details as HTMLElement).getByRole("link", {
            name: last.autonym,
          }),
        ).toBeVisible();
      },
    );

    await step(
      "Quando o usuário clica de novo, então a lista recolhe",
      async () => {
        await userEvent.click(
          canvas.getByText(`Ver todos os ${total} idiomas`),
        );
        await expect(
          canvas.getByText(`Ver todos os ${total} idiomas`).closest("details"),
        ).not.toHaveAttribute("open");
      },
    );
  },
};

/** Artigo sem traduções: o cartão avisa que não há outros idiomas. */
export const WithoutTranslations: Story = {
  decorators: [
    (Story) => (
      <MockArticleProvider slug="Malhação_2017">
        <Story />
      </MockArticleProvider>
    ),
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então aparece a mensagem de que não há outros idiomas",
      async () => {
        await expect(
          canvas.getByRole("region", { name: "0 idiomas" }),
        ).toBeInTheDocument();
        await expect(
          canvas.getByText(
            "Este artigo não está disponível em outros idiomas.",
          ),
        ).toBeVisible();
        await expect(canvas.queryAllByRole("link")).toHaveLength(0);
      },
    );
  },
};
