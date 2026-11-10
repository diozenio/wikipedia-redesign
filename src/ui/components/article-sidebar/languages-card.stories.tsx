import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LanguagesCard } from "@/ui/components/article-sidebar/languages-card";
import { MockArticleProvider } from "@/ui/providers/mocks/mock-article-provider";

const meta = {
  title: "Components/ArticleSidebar/LanguagesCard",
  component: LanguagesCard,
  parameters: { center: false },
} satisfies Meta<typeof LanguagesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutTranslations: Story = {
  decorators: [
    (Story) => (
      <MockArticleProvider slug="Malhação_2017">
        <Story />
      </MockArticleProvider>
    ),
  ],
};
