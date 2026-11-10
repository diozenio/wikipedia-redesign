import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { RichTextReferences } from "@/ui/components/rich-text/blocks/rich-text-references";
import type { RichTextReference } from "@/ui/components/rich-text/types";
import {
  resetAppearance,
  withStoredAppearance,
} from "@/ui/testing/story-helpers";

const ITEMS: RichTextReference[] = [
  { number: 1, id: "nota-1", text: "IBGE. Censo 2022.", backlinkId: "ref-1" },
  {
    number: 2,
    id: "nota-2",
    text: "Atlas geográfico escolar.",
    backlinkId: "ref-2",
  },
  {
    number: 3,
    id: "nota-3",
    text: "Referência sem chamada no texto.",
    backlinkId: null,
  },
];

const meta = {
  title: "Components/RichText/RichTextReferences",
  component: RichTextReferences,
  args: { items: ITEMS },
  beforeEach: resetAppearance,
} satisfies Meta<typeof RichTextReferences>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Lista numerada de notas e referências. Cada nota tem o `id` `nota-N` (o
 * destino do número no texto) e, quando existe chamada no texto, um link
 * "Voltar ao texto" que diz, para leitores de tela, a qual nota se refere.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então cada nota é um item numerado com id nota-N", async () => {
      const items = canvas.getAllByRole("listitem");
      await expect(items).toHaveLength(3);
      await expect(items[0]).toHaveAttribute("id", "nota-1");
      await expect(items[2]).toHaveAttribute("value", "3");
    });

    await step(
      "Então as notas com chamada no texto têm Voltar ao texto",
      async () => {
        const backLinks = canvas.getAllByRole("link", {
          name: /Voltar ao texto/,
        });
        await expect(backLinks).toHaveLength(2);
        await expect(backLinks[0]).toHaveAttribute("href", "#ref-1");
        await expect(backLinks[0]).toHaveAccessibleName(
          "Voltar ao texto (voltar à chamada da nota 1)",
        );
      },
    );
  },
};

/**
 * Com os números de notas desligados, a lista continua, mas os links
 * "Voltar ao texto" somem (não existe mais o número para onde voltar).
 */
export const WithoutFootnoteMarkers: Story = {
  beforeEach: withStoredAppearance({ footnoteMarkers: false }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então a lista aparece sem links de volta", async () => {
      await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
      await expect(canvas.queryAllByRole("link")).toHaveLength(0);
    });
  },
};
