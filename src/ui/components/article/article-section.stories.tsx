import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ArticleSection } from "@/ui/components/article/article-section";
import { Skeleton } from "@/ui/primitives/skeleton";

const meta = {
  title: "Components/Article/ArticleSection",
  component: ArticleSection,
  parameters: { center: false },
  args: {
    id: "atividades-envolvidas",
    title: "Atividades envolvidas",
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

/**
 * Cada seção é uma região nomeada pelo seu título (h2) e tem um `id` que o
 * sumário usa como âncora.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então a seção é uma região com o nome do título", async () => {
      const region = canvas.getByRole("region", {
        name: "Atividades envolvidas",
      });
      await expect(region).toHaveAttribute("id", "atividades-envolvidas");
      await expect(
        within(region).getByRole("heading", {
          level: 2,
          name: "Atividades envolvidas",
        }),
      ).toBeInTheDocument();
    });
  },
};
