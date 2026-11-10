import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor } from "storybook/test";
import { AnimatedPercent } from "@/ui/components/motion/animated-percent";

const meta = {
  title: "Components/Motion/AnimatedPercent",
  component: AnimatedPercent,
  args: { value: 42 },
  render: (args) => (
    <span className="text-2xl font-semibold text-foreground">
      <AnimatedPercent {...args} />
    </span>
  ),
} satisfies Meta<typeof AnimatedPercent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mostra uma porcentagem arredondada; quando o valor muda, o número “corre” até o novo valor. */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então o valor aparece como 42%", async () => {
      await waitFor(() => expect(canvasElement).toHaveTextContent("42%"));
    });
  },
};

/** Valores quebrados são arredondados. */
export const Rounded: Story = {
  args: { value: 66.6 },
  play: async ({ canvasElement, step }) => {
    await step("Então 66,6 aparece como 67%", async () => {
      await waitFor(() => expect(canvasElement).toHaveTextContent("67%"));
    });
  },
};
