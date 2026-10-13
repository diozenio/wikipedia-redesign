import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LanguagesCard } from "@/ui/components/article-sidebar/languages-card";

const meta = {
  title: "Components/ArticleSidebar/LanguagesCard",
  component: LanguagesCard,
  parameters: { center: false },
} satisfies Meta<typeof LanguagesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
