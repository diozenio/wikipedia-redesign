import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MainLayout } from "@/ui/layouts/main-layout";
import { AppProvider } from "@/ui/providers/app-provider";

const meta = {
  title: "Layouts/MainLayout",
  component: MainLayout,
  parameters: { center: false },
  decorators: [
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof MainLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
