import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { RichTextList } from "@/ui/components/rich-text/blocks/rich-text-list";

const ITEMS = [
  "Coleta de dados",
  "Processamento",
  "Distribuição da informação",
];

const meta = {
  title: "Components/RichText/RichTextList",
  component: RichTextList,
  args: { ordered: false, items: ITEMS },
} satisfies Meta<typeof RichTextList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Lista com marcadores (`ul`): cada item vira um `li`. */
export const Unordered: Story = {
  play: async ({ canvasElement, step }) => {
    await step(
      "Então é uma lista não ordenada com todos os itens",
      async () => {
        const list = within(canvasElement).getByRole("list");
        await expect(list.tagName).toBe("UL");
        await expect(within(list).getAllByRole("listitem")).toHaveLength(
          ITEMS.length,
        );
      },
    );
  },
};

/** Lista numerada (`ol`). */
export const Ordered: Story = {
  args: { ordered: true },
  play: async ({ canvasElement, step }) => {
    await step("Então é uma lista ordenada", async () => {
      await expect(within(canvasElement).getByRole("list").tagName).toBe("OL");
    });
  },
};
