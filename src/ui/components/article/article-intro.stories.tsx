import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ArticleIntro } from "@/ui/components/article/article-intro";
import { mockArticle } from "@/ui/providers/mocks/mock-article";
import { MockArticleProvider } from "@/ui/providers/mocks/mock-article-provider";
import {
  resetAppearance,
  withStoredAppearance,
} from "@/ui/testing/story-helpers";

const introParagraphs = mockArticle.introBlocks.filter(
  (block) => block.type === "paragraph",
).length;

const meta = {
  title: "Components/Article/ArticleIntro",
  component: ArticleIntro,
  parameters: { center: false },
  beforeEach: resetAppearance,
} satisfies Meta<typeof ArticleIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A introdução mostra os parágrafos com os números das notas de rodapé no
 * meio do texto. Cada número é um link chamado "Nota N" que leva para a nota
 * correspondente no fim do artigo (`#nota-N`).
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então cada parágrafo da introdução aparece", async () => {
      await expect(canvasElement.querySelectorAll("p")).toHaveLength(
        introParagraphs,
      );
    });

    await step(
      "Então os números das notas são links para as notas no fim do artigo",
      async () => {
        const notes = canvas.getAllByRole("link", { name: /^Nota \d+$/ });
        await expect(notes.length).toBeGreaterThan(0);
        for (const note of notes) {
          const number = note.getAttribute("aria-label")?.replace("Nota ", "");
          await expect(note).toHaveAttribute("href", `#nota-${number}`);
          await expect(note.id).toMatch(/^ref-/);
        }
      },
    );
  },
};

/** Outro artigo (Shawn Mendes), para conferir notas vindas de outra fonte. */
export const WithFootnotes: Story = {
  decorators: [
    (Story) => (
      <MockArticleProvider slug="Shawn_Mendes">
        <Story />
      </MockArticleProvider>
    ),
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então há pelo menos um link de nota", async () => {
      await expect(
        canvas.getAllByRole("link", { name: /^Nota \d+$/ }).length,
      ).toBeGreaterThan(0);
    });
  },
};

/**
 * Com a leitura facilitada ligada, cada parágrafo longo é dividido em blocos
 * de no máximo duas frases, então aparecem mais parágrafos do que no texto
 * original — sem perder as notas.
 */
export const EasyReading: Story = {
  beforeEach: withStoredAppearance({ easyReading: true }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então os parágrafos são divididos em blocos menores",
      async () => {
        await expect(
          canvasElement.querySelectorAll("p").length,
        ).toBeGreaterThan(introParagraphs);
      },
    );

    await step("Então as notas continuam no texto", async () => {
      await expect(
        canvas.getAllByRole("link", { name: /^Nota \d+$/ }).length,
      ).toBeGreaterThan(0);
    });
  },
};

/**
 * Com a opção "Números de notas de rodapé" desligada, os números somem do
 * meio do texto (inclusive para leitores de tela). O texto continua igual.
 */
export const WithoutFootnoteMarkers: Story = {
  beforeEach: withStoredAppearance({ footnoteMarkers: false }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então nenhum número de nota aparece no texto", async () => {
      await expect(
        canvas.queryAllByRole("link", { name: /^Nota \d+$/ }),
      ).toHaveLength(0);
      await expect(canvasElement.querySelector("sup")).toBeNull();
    });

    await step("Então os parágrafos continuam todos lá", async () => {
      await expect(canvasElement.querySelectorAll("p")).toHaveLength(
        introParagraphs,
      );
    });
  },
};
