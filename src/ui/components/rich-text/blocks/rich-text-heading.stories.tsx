import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { RichTextHeading } from "@/ui/components/rich-text/blocks/rich-text-heading";

const meta = {
  title: "Components/RichText/RichTextHeading",
  component: RichTextHeading,
  args: { id: "historia", text: "História" },
} satisfies Meta<typeof RichTextHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Subtítulo dentro de uma seção: h3 por padrão, com `id` para servir de âncora. */
export const Level3: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então é um título de nível 3 com id", async () => {
      const heading = within(canvasElement).getByRole("heading", {
        level: 3,
        name: "História",
      });
      await expect(heading).toHaveAttribute("id", "historia");
    });
  },
};

/** Subtítulo de quarto nível (h4). */
export const Level4: Story = {
  args: { level: 4, text: "Origens", id: "origens" },
  play: async ({ canvasElement, step }) => {
    await step("Então é um título de nível 4", async () => {
      await expect(
        within(canvasElement).getByRole("heading", {
          level: 4,
          name: "Origens",
        }),
      ).toBeInTheDocument();
    });
  },
};
