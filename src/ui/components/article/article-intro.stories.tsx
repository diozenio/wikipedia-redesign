import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleIntro } from "@/ui/components/article/article-intro";
import { AppearanceContext } from "@/ui/contexts/appearance-context";
import { DEFAULT_APPEARANCE } from "@/ui/lib/appearance";
import { MockArticleProvider } from "@/ui/providers/mocks/mock-article-provider";

const meta = {
  title: "Components/Article/ArticleIntro",
  component: ArticleIntro,
  parameters: { center: false },
} satisfies Meta<typeof ArticleIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFootnotes: Story = {
  decorators: [
    (Story) => (
      <MockArticleProvider slug="Shawn_Mendes">
        <Story />
      </MockArticleProvider>
    ),
  ],
};

export const EasyReading: Story = {
  decorators: [
    (Story) => (
      <AppearanceContext
        value={{
          appearance: { ...DEFAULT_APPEARANCE, easyReading: true },
          updateAppearance: () => {},
          resetAppearance: () => {},
        }}
      >
        <MockArticleProvider slug="Shawn_Mendes">
          <Story />
        </MockArticleProvider>
      </AppearanceContext>
    ),
  ],
};
