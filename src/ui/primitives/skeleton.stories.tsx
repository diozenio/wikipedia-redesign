import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "@/ui/primitives/skeleton";

const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  args: { className: "h-4 w-32" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shapes: Story = {
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
