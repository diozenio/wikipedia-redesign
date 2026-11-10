import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { RichTextTable } from "@/ui/components/rich-text/blocks/rich-text-table";

const ROWS = [
  ["Ano", "Vencedor", "Tempo"],
  ["2023", "Timothy Kiptoo", "44:46"],
  ["2024", "Wilson Too", "44:32"],
];

const meta = {
  title: "Components/RichText/RichTextTable",
  component: RichTextTable,
  args: { rows: ROWS },
} satisfies Meta<typeof RichTextTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Tabela do artigo: a primeira linha vira cabeçalho (`th scope="col"`). A
 * área da tabela pode receber foco pelo teclado para rolar tabelas largas.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então a primeira linha são cabeçalhos de coluna", async () => {
      const headers = canvas.getAllByRole("columnheader");
      await expect(headers.map((header) => header.textContent)).toEqual(
        ROWS[0],
      );
    });

    await step("Então as demais linhas são dados", async () => {
      await expect(canvas.getAllByRole("row")).toHaveLength(ROWS.length);
      await expect(canvas.getAllByRole("cell")).toHaveLength(6);
    });

    await step(
      "Quando o usuário aperta Tab, então a área da tabela recebe foco",
      async () => {
        await userEvent.tab();
        await expect(
          canvas.getByRole("region", { name: "Tabela: Ano" }),
        ).toHaveFocus();
      },
    );
  },
};
