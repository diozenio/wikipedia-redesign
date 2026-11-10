import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { Skeleton } from "@/ui/primitives/skeleton";

const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  args: { className: "h-4 w-32" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bloco de carregamento (skeleton), puramente visual. */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então o bloco de carregamento aparece", async () => {
      await expect(
        canvasElement.querySelector('[data-slot="skeleton"]'),
      ).toBeVisible();
    });
  },
};

/** Formatos combinados (avatar e linhas de texto). */
export const Shapes: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então aparecem três blocos", async () => {
      await expect(
        canvasElement.querySelectorAll('[data-slot="skeleton"]'),
      ).toHaveLength(3);
    });
  },
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  ),
};
