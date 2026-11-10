import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SummaryCard } from "@/ui/components/article-sidebar/summary-card";
import { MockArticleProvider } from "@/ui/providers/mocks/mock-article-provider";

const meta = {
  title: "Components/ArticleSidebar/SummaryCard",
  component: SummaryCard,
  parameters: { center: false },
  decorators: [
    (Story) => (
      <MockArticleProvider slug="Shawn_Mendes">
        <Story />
      </MockArticleProvider>
    ),
  ],
} satisfies Meta<typeof SummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SportsEventInfobox: Story = {
  decorators: [
    (Story) => (
      <MockArticleProvider slug="Corrida_Internacional_de_São_Silvestre">
        <Story />
      </MockArticleProvider>
    ),
  ],
};
