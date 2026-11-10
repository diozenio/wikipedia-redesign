import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { HomeHero } from "@/ui/components/home/home-hero";

const meta = {
  title: "Components/Home/HomeHero",
  component: HomeHero,
  parameters: { center: false },
} satisfies Meta<typeof HomeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A abertura da página inicial tem o título principal (h1) "Bem-vindo à Wikipédia". */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    await step("Então o título principal da página aparece", async () => {
      await expect(
        within(canvasElement).getByRole("heading", {
          level: 1,
          name: "Bem-vindo à Wikipédia",
        }),
      ).toBeVisible();
    });
  },
};
