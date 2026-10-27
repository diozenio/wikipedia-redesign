import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturedArticleCard } from "@/ui/components/home/featured-article-card";
import { mockFeaturedFeed } from "@/ui/providers/mocks/mock-featured-articles";

const meta = {
  title: "Components/Home/FeaturedArticleCard",
  component: FeaturedArticleCard,
  parameters: { center: false },
  args: { article: mockFeaturedFeed.articles[1] },
  decorators: [
    (Story) => (
      <div className="@container/page max-w-[24rem] p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeaturedArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Lead: Story = {
  args: { article: mockFeaturedFeed.articles[0], variant: "lead" },
  decorators: [
    (Story) => (
      <div className="@container/page w-[64rem] p-6">
        <Story />
      </div>
    ),
  ],
};
