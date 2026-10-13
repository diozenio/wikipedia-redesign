import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyLayout } from "@/ui/layouts/empty-layout";
import { NotFoundProvider } from "@/ui/providers/not-found-provider";

const meta = {
  title: "Layouts/EmptyLayout",
  component: EmptyLayout,
  parameters: { center: false },
  decorators: [
    (Story) => (
      <NotFoundProvider>
        <Story />
      </NotFoundProvider>
    ),
  ],
} satisfies Meta<typeof EmptyLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = {};
