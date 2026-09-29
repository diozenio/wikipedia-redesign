import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppHeader } from "@/ui/components/app-header";
import {
  HeaderContext,
  type HeaderContextValue,
} from "@/ui/contexts/header-context";

// The component takes no props: story args are the HeaderContext value.
const meta = {
  title: "Components/AppHeader",
  component: AppHeader,
  parameters: { center: false },
  render: (args) => (
    <HeaderContext value={args as unknown as HeaderContextValue}>
      <AppHeader />
    </HeaderContext>
  ),
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<HeaderContextValue>;

export const Default: Story = {
  args: { title: "Hello World", tag: { label: "@ada", variant: "outline" } },
};

export const WithoutTag: Story = { args: { title: "Hello World" } };
