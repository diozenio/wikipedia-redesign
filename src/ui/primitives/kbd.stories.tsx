import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Kbd, KbdGroup } from "@/ui/primitives/kbd";

const meta = {
  title: "Primitives/Kbd",
  component: Kbd,
  args: { children: "Ctrl K" },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tecla de atalho, renderizada como `<kbd>`. */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então o atalho aparece num elemento kbd", async () => {
      await expect(within(canvasElement).getByText("Ctrl K").tagName).toBe(
        "KBD",
      );
    });
  },
};

/** Combinação de teclas agrupadas. */
export const Group: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Então as três teclas aparecem", async () => {
      await expect(
        canvasElement.querySelectorAll('[data-slot="kbd"]'),
      ).toHaveLength(3);
    });
  },
};
