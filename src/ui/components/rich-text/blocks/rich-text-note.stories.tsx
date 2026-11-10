import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { RichTextNote } from "@/ui/components/rich-text/blocks/rich-text-note";

const meta = {
  title: "Components/RichText/RichTextNote",
  component: RichTextNote,
  args: { id: "ref-3", number: 3, targetId: "nota-3" },
  render: (args) => (
    <p className="reading-text text-base text-foreground">
      Um trecho do artigo com uma nota de rodapé
      <RichTextNote {...args} /> no meio do texto.
    </p>
  ),
} satisfies Meta<typeof RichTextNote>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Número de nota no meio do texto: mostra "[3]" sobrescrito e é um link
 * chamado "Nota 3" que leva para `#nota-3`. Seu próprio `id` (`ref-3`) é o
 * destino do link "Voltar ao texto".
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então a nota é um link sobrescrito para a nota 3", async () => {
      const link = within(canvasElement).getByRole("link", { name: "Nota 3" });
      await expect(link).toHaveAttribute("href", "#nota-3");
      await expect(link).toHaveAttribute("id", "ref-3");
      await expect(link).toHaveTextContent("[3]");
      await expect(link.closest("sup")).not.toBeNull();
    });
  },
};
