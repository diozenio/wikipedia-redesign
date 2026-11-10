import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { ArticleColumn } from "@/ui/components/article/article-column";
import { mockArticle } from "@/ui/providers/mocks/mock-article";
import {
  resetAppearance,
  withStoredAppearance,
} from "@/ui/testing/story-helpers";

const meta = {
  title: "Components/Article/ArticleColumn",
  component: ArticleColumn,
  parameters: { center: false },
  beforeEach: resetAppearance,
} satisfies Meta<typeof ArticleColumn>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * O artigo completo: trilha de navegação, título, introdução, uma seção para
 * cada parte do texto, imagens com texto alternativo e legenda e a lista de
 * notas e referências com links de ida e volta.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então o artigo é nomeado pelo seu título (h1)", async () => {
      await expect(
        canvas.getByRole("article", { name: mockArticle.title }),
      ).toBeInTheDocument();
      await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
        mockArticle.title,
      );
    });

    await step(
      "Então a trilha de navegação vem antes do conteúdo",
      async () => {
        await expect(
          canvas.getByRole("navigation", { name: "Trilha de navegação" }),
        ).toBeInTheDocument();
      },
    );

    await step(
      "Então cada seção aparece com seu título de nível 2",
      async () => {
        for (const section of mockArticle.sections) {
          await expect(
            canvas.getByRole("region", { name: section.title }),
          ).toBeInTheDocument();
        }
      },
    );

    await step(
      "Então toda imagem tem texto alternativo e legenda",
      async () => {
        const figures = canvasElement.querySelectorAll("figure");
        await expect(figures.length).toBeGreaterThan(0);
        for (const figure of figures) {
          const image = within(figure as HTMLElement).getByRole("img");
          await expect(image.getAttribute("alt")?.trim()).toBeTruthy();
          await expect(figure.querySelector("figcaption")).not.toBeNull();
        }
      },
    );

    await step(
      "Então cada número de nota leva a uma nota que existe na lista de referências",
      async () => {
        const notes = canvas.getAllByRole("link", { name: /^Nota \d+$/ });
        for (const note of notes) {
          const targetId = note.getAttribute("href")?.slice(1) ?? "";
          const target = canvasElement.querySelector(`[id="${targetId}"]`);
          await expect(target?.tagName).toBe("LI");
        }
      },
    );

    await step(
      "Então as notas têm o link Voltar ao texto apontando para o número no texto",
      async () => {
        const backLinks = canvas.getAllByRole("link", {
          name: /Voltar ao texto/,
        });
        await expect(backLinks.length).toBeGreaterThan(0);
        const targetId = backLinks[0].getAttribute("href")?.slice(1) ?? "";
        await expect(
          canvasElement.querySelector(`[id="${targetId}"]`),
        ).not.toBeNull();
      },
    );
  },
};

/**
 * Com os números de notas desligados, o texto fica sem os números, mas a
 * lista de notas e referências continua no fim. Os links "Voltar ao texto"
 * somem, porque não há mais para onde voltar.
 */
export const WithoutFootnoteMarkers: Story = {
  beforeEach: withStoredAppearance({ footnoteMarkers: false }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então não há números de nota no texto", async () => {
      await expect(
        canvas.queryAllByRole("link", { name: /^Nota \d+$/ }),
      ).toHaveLength(0);
    });

    await step(
      "Então a lista de notas continua, mas sem Voltar ao texto",
      async () => {
        await expect(
          canvasElement.querySelector('li[id^="nota-"]'),
        ).not.toBeNull();
        await expect(
          canvas.queryAllByRole("link", { name: /Voltar ao texto/ }),
        ).toHaveLength(0);
      },
    );
  },
};

/** Com a leitura facilitada, o resumo simplificado aparece logo antes da introdução. */
export const EasyReading: Story = {
  beforeEach: withStoredAppearance({ easyReading: true }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então o cartão de resumo aparece com o resumo do provedor simulado",
      async () => {
        const card = await canvas.findByRole("complementary", {
          name: "Resumo simplificado",
        });
        await waitFor(() => expect(card).toHaveAttribute("aria-busy", "false"));
      },
    );
  },
};
