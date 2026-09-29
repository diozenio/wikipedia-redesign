import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { EmptyState } from "@/ui/components/empty-state";
import {
  EmptyStateContext,
  type EmptyStateContextValue,
} from "@/ui/contexts/empty-state-context";

// The component takes no props: story args are the EmptyStateContext value.
const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  render: (args) => (
    <EmptyStateContext value={args as unknown as EmptyStateContextValue}>
      <EmptyState />
    </EmptyStateContext>
  ),
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<EmptyStateContextValue>;

export const NotFound: Story = {
  args: {
    media: "404",
    title: "Page not found",
    description: "The page you are looking for doesn't exist or was moved.",
    action: { label: "Go home", onClick: fn() },
  },
};

export const NoResults: Story = {
  args: {
    title: "No results",
    description: "Try adjusting your search.",
  },
};
