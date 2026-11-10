import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ArticleColumn } from "@/ui/components/article/article-column";
import { TableOfContents } from "@/ui/components/table-of-contents/table-of-contents";
import { mockArticle } from "@/ui/providers/mocks/mock-article";
import { resetAppearance } from "@/ui/testing/story-helpers";

const meta = {
  title: "Components/TableOfContents",
  component: TableOfContents,
  parameters: { center: false },
  beforeEach: resetAppearance,
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Em telas menores, o sumário fica recolhido atrás do botão "Neste artigo".
 * O botão informa se está aberto (`aria-expanded`) e mostra a seção atual.
 * O sumário tem um link para o início e um para cada seção do artigo.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: /Neste artigo/ });

    await step("Então o sumário começa recolhido", async () => {
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(
        canvas.queryByRole("link", { name: "Início" }),
      ).not.toBeInTheDocument();
    });

    await step(
      "Quando o usuário clica em Neste artigo, então a lista de seções abre",
      async () => {
        await userEvent.click(toggle);
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await expect(
          canvas.getByRole("link", { name: "Início" }),
        ).toHaveAttribute("href", "#inicio");
      },
    );

    await step("Então existe um link para cada seção do artigo", async () => {
      for (const section of mockArticle.sections) {
        await expect(
          canvas.getByRole("link", { name: section.title }),
        ).toHaveAttribute("href", `#${section.id}`);
      }
    });

    await step(
      "Quando o usuário clica de novo, então o sumário recolhe",
      async () => {
        await userEvent.click(toggle);
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
      },
    );
  },
};

/**
 * Sumário ao lado do artigo, como na página real em telas largas. Clicar em
 * uma seção leva o foco para o título dela (quem usa teclado ou leitor de
 * tela continua a leitura dali) e marca o link com `aria-current`.
 */
export const WithArticle: Story = {
  render: () => (
    <div className="@container/page w-full">
      <div className="grid grid-cols-[16rem_minmax(0,1fr)] gap-8 p-8">
        <TableOfContents />
        <ArticleColumn />
      </div>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const toc = canvas.getByRole("navigation", { name: "Neste artigo" });
    const section = mockArticle.sections[1];

    await step(
      "Quando o usuário abre o sumário, então a navegação Neste artigo mostra o link Início",
      async () => {
        await userEvent.click(
          within(toc).getByRole("button", { name: /Neste artigo/ }),
        );
        await expect(
          within(toc).getByRole("link", { name: "Início" }),
        ).toBeVisible();
      },
    );

    await step(
      `Quando o usuário clica em “${section.title}”, então o foco vai para o título da seção`,
      async () => {
        const link = within(toc).getByRole("link", { name: section.title });
        await userEvent.click(link);
        await expect(
          canvas.getByRole("heading", { level: 2, name: section.title }),
        ).toHaveFocus();
        await waitFor(() =>
          expect(link).toHaveAttribute("aria-current", "location"),
        );
      },
    );

    await step(
      "Então o sumário recolhe e o botão mostra a seção atual",
      async () => {
        const toggle = within(toc).getByRole("button", {
          name: /Neste artigo/,
        });
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(toggle).toHaveTextContent(section.title);
        const current = toc.querySelectorAll('[aria-current="location"]');
        await expect(current).toHaveLength(1);
      },
    );
  },
};
