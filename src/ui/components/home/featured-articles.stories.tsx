import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturedArticles } from "@/ui/components/home/featured-articles";

const meta = {
  title: "Components/Home/FeaturedArticles",
  component: FeaturedArticles,
  parameters: { center: false },
  decorators: [
    (Story) => (
      <div className="@container/page p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeaturedArticles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
