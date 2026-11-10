import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { RichTextParagraph } from "@/ui/components/rich-text/blocks/rich-text-paragraph";
import type { RichTextInline } from "@/ui/components/rich-text/types";
import {
  resetAppearance,
  withStoredAppearance,
} from "@/ui/testing/story-helpers";

const SEGMENTS: RichTextInline[] = [
  { type: "text", text: "O Brasil é o maior país da América do Sul." },
  { type: "note", number: 1, id: "ref-1", targetId: "nota-1" },
  {
    type: "text",
    text: " Tem mais de 200 milhões de habitantes. A capital é Brasília. A maior cidade é São Paulo.",
  },
  { type: "note", number: 2, id: "ref-2", targetId: "nota-2" },
];
const TEXT = SEGMENTS.map((segment) =>
  segment.type === "text" ? segment.text : "",
).join("");

const meta = {
  title: "Components/RichText/RichTextParagraph",
  component: RichTextParagraph,
  args: { text: TEXT, segments: SEGMENTS },
  beforeEach: resetAppearance,
  decorators: [
    (Story) => (
      <div className="w-[40rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RichTextParagraph>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Parágrafo normal: um único `<p>` com os números das notas no texto. */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então há um parágrafo com duas notas", async () => {
      await expect(canvasElement.querySelectorAll("p")).toHaveLength(1);
      await expect(
        within(canvasElement).getAllByRole("link", { name: /^Nota \d$/ }),
      ).toHaveLength(2);
    });
  },
};

/**
 * Leitura facilitada: o parágrafo é quebrado em blocos de até duas frases.
 * As notas ficam junto da frase a que pertencem.
 */
export const EasyReading: Story = {
  beforeEach: withStoredAppearance({ easyReading: true }),
  play: async ({ canvasElement, step }) => {
    await step(
      "Então o parágrafo vira dois blocos e as notas continuam",
      async () => {
        const paragraphs = canvasElement.querySelectorAll("p");
        await expect(paragraphs).toHaveLength(2);
        await expect(
          within(paragraphs[0] as HTMLElement).getByRole("link", {
            name: "Nota 1",
          }),
        ).toBeInTheDocument();
        await expect(
          within(canvasElement).getAllByRole("link", { name: /^Nota \d$/ }),
        ).toHaveLength(2);
      },
    );
  },
};

/** Com os números de notas desligados, o texto aparece sem os links de nota. */
export const WithoutFootnoteMarkers: Story = {
  beforeEach: withStoredAppearance({ footnoteMarkers: false }),
  play: async ({ canvasElement, step }) => {
    await step(
      "Então o texto aparece inteiro e sem números de nota",
      async () => {
        await expect(canvasElement.querySelector("p")).toHaveTextContent(TEXT);
        await expect(within(canvasElement).queryAllByRole("link")).toHaveLength(
          0,
        );
      },
    );
  },
};
