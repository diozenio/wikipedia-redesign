import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { RichText } from "@/ui/components/rich-text/rich-text";
import type { RichTextBlock } from "@/ui/components/rich-text/types";
import { SAMPLE_IMAGE_SRC } from "@/ui/testing/sample-image";
import { resetAppearance } from "@/ui/testing/story-helpers";

const BLOCKS: RichTextBlock[] = [
  {
    type: "paragraph",
    text: "Um sistema de informação coleta, processa e distribui dados.",
    segments: [
      {
        type: "text",
        text: "Um sistema de informação coleta, processa e distribui dados.",
      },
      { type: "note", number: 1, id: "ref-1", targetId: "nota-1" },
    ],
  },
  { type: "heading", id: "componentes", text: "Componentes" },
  {
    type: "list",
    ordered: false,
    items: ["Pessoas", "Processos", "Tecnologia"],
  },
  {
    type: "table",
    rows: [
      ["Componente", "Exemplo"],
      ["Hardware", "Servidor"],
    ],
  },
  {
    type: "image",
    src: SAMPLE_IMAGE_SRC,
    alt: "Paisagem ilustrativa",
    caption: "Legenda da imagem.",
    width: 640,
    height: 360,
  },
  {
    type: "references",
    items: [
      {
        number: 1,
        id: "nota-1",
        text: "Fonte de exemplo.",
        backlinkId: "ref-1",
      },
    ],
  },
];

const meta = {
  title: "Components/RichText/RichText",
  component: RichText,
  args: { blocks: BLOCKS },
  beforeEach: resetAppearance,
  decorators: [
    (Story) => (
      <div className="w-[40rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RichText>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * O RichText recebe uma lista de blocos e escolhe o componente de cada tipo:
 * parágrafo, subtítulo, lista, tabela, imagem e referências — na ordem.
 */
export const AllBlocks: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Então cada tipo de bloco aparece com o elemento certo",
      async () => {
        await expect(canvas.getByText(/Um sistema de informação/).tagName).toBe(
          "P",
        );
        await expect(
          canvas.getByRole("heading", { level: 3, name: "Componentes" }),
        ).toBeInTheDocument();
        await expect(canvas.getByRole("table")).toBeInTheDocument();
        await expect(
          canvas.getByRole("img", { name: "Paisagem ilustrativa" }),
        ).toBeInTheDocument();
        await expect(canvasElement.querySelector("li#nota-1")).not.toBeNull();
      },
    );

    await step(
      "Então a nota no texto aponta para a referência que existe",
      async () => {
        await expect(
          canvas.getByRole("link", { name: "Nota 1" }),
        ).toHaveAttribute("href", "#nota-1");
      },
    );
  },
};
