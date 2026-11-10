import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Badge } from "@/ui/primitives/badge";

const variants = ["default", "secondary", "destructive", "outline"] as const;

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  args: { children: "Badge" },
  argTypes: {
    variant: { control: "select", options: variants },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Selo simples com texto. */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então o texto do selo aparece", async () => {
      await expect(within(canvasElement).getByText("Badge")).toBeVisible();
    });
  },
};

/** Todas as variantes de cor. */
export const Variants: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então as quatro variantes aparecem", async () => {
      for (const variant of variants) {
        await expect(within(canvasElement).getByText(variant)).toBeVisible();
      }
    });
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};
