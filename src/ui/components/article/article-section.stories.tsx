import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleSection } from "@/ui/components/article/article-section";
import { Skeleton } from "@/ui/primitives/skeleton";

const meta = {
  title: "Components/Article/ArticleSection",
  component: ArticleSection,
  parameters: { center: false },
  args: {
    titleWidth: "w-48",
    children: (
      <>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
      </>
    ),
  },
} satisfies Meta<typeof ArticleSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
