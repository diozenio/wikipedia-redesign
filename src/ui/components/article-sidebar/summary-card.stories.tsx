import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { SummaryCard } from "@/ui/components/article-sidebar/summary-card";
import { ArticleContext } from "@/ui/contexts/article-context";
import { findMockArticleBySlug } from "@/ui/providers/mocks/mock-article";
import { MockArticleProvider } from "@/ui/providers/mocks/mock-article-provider";

const shawn = findMockArticleBySlug("Shawn_Mendes");

const meta = {
  title: "Components/ArticleSidebar/SummaryCard",
  component: SummaryCard,
  parameters: { center: false },
  decorators: [
    (Story) => (
      <MockArticleProvider slug="Shawn_Mendes">
        <Story />
      </MockArticleProvider>
    ),
  ],
} satisfies Meta<typeof SummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * O resumo rápido (infobox) do artigo: uma região com título, a foto com
 * texto alternativo e legenda, e os dados numa lista de definições
 * (`dl` com `dt` para o rótulo e `dd` para o valor).
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const infobox = shawn?.infobox;

    await step(
      "Então o cartão é uma região com o título do infobox",
      async () => {
        await expect(
          canvas.getByRole("region", {
            name: infobox?.caption ?? "Resumo rápido",
          }),
        ).toBeInTheDocument();
      },
    );

    await step("Então a foto tem texto alternativo e legenda", async () => {
      const image = canvas.getByRole("img");
      await expect(image).toHaveAttribute("alt", infobox?.image?.alt);
      await expect(image.getAttribute("alt")?.trim()).toBeTruthy();
      await expect(canvasElement.querySelector("figcaption")).not.toBeNull();
    });

    await step("Então cada dado aparece como termo e definição", async () => {
      const terms = canvas.getAllByRole("term");
      const definitions = canvas.getAllByRole("definition");
      await expect(terms).toHaveLength(infobox?.rows.length ?? 0);
      await expect(definitions).toHaveLength(terms.length);
      await expect(terms[0]).toHaveTextContent(infobox?.rows[0].label ?? "");
    });
  },
};

/** Infobox de outro tipo de artigo (evento esportivo). */
export const SportsEventInfobox: Story = {
  decorators: [
    (Story) => (
      <MockArticleProvider slug="Corrida_Internacional_de_São_Silvestre">
        <Story />
      </MockArticleProvider>
    ),
  ],
  play: async ({ canvasElement, step }) => {
    await step("Então os dados aparecem numa lista de definições", async () => {
      await expect(
        within(canvasElement).getAllByRole("term").length,
      ).toBeGreaterThan(0);
    });
  },
};

/** Artigos sem infobox não mostram o cartão. */
export const WithoutInfobox: Story = {
  decorators: [
    (Story) => (
      <MockArticleProvider slug="Mega-Sena">
        <Story />
      </MockArticleProvider>
    ),
  ],
  play: async ({ canvasElement, step }) => {
    await step("Então nada é exibido", async () => {
      await expect(
        within(canvasElement).queryByRole("heading"),
      ).not.toBeInTheDocument();
      await expect(
        within(canvasElement).queryByRole("term"),
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * Se a foto da capa não carregar, aparece o mesmo quadro “Imagem
 * indisponível” das imagens do artigo, com a descrição acessível, e a
 * legenda e os dados continuam no cartão.
 */
export const BrokenImage: Story = {
  render: () =>
    shawn?.infobox?.image ? (
      <ArticleContext
        value={{
          ...shawn,
          infobox: {
            ...shawn.infobox,
            image: {
              ...shawn.infobox.image,
              src: "data:image/png;base64,AAAA",
            },
          },
        }}
      >
        <SummaryCard />
      </ArticleContext>
    ) : (
      <SummaryCard />
    ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alt = shawn?.infobox?.image?.alt ?? "";

    await step(
      "Quando a foto não carrega, então aparece Imagem indisponível com a descrição",
      async () => {
        const fallback = await canvas.findByRole("img", {
          name: `Imagem indisponível: ${alt}`,
        });
        await expect(fallback).toHaveTextContent("Imagem indisponível");
        await expect(canvasElement.querySelector("img")).toBeNull();
      },
    );

    await step("Então a legenda e os dados continuam no cartão", async () => {
      await expect(canvasElement.querySelector("figcaption")).not.toBeNull();
      await expect(canvas.getAllByRole("term").length).toBeGreaterThan(0);
    });
  },
};
