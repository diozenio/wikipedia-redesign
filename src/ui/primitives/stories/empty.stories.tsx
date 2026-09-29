import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/ui/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/primitives/empty";

const meta = {
  title: "Primitives/Empty",
  component: Empty,
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia className="text-5xl font-semibold">404</EmptyMedia>
        <EmptyTitle>Nothing here</EmptyTitle>
        <EmptyDescription>There is no content to show yet.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Go back</Button>
      </EmptyContent>
    </Empty>
  ),
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
