import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ScrollArea } from "@/ui/primitives/scroll-area";

const ITEMS = Array.from({ length: 30 }, (_, index) => `Item ${index + 1}`);

const meta = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
  render: () => (
    <ScrollArea className="h-48 w-56 rounded-md border border-border">
      <ul className="p-3 text-sm">
        {ITEMS.map((item) => (
          <li key={item} className="py-1">
            {item}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Área com rolagem própria: o conteúdo maior que a caixa pode ser rolado. */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );

    await step(
      "Então todo o conteúdo está lá, mesmo o que não cabe",
      async () => {
        await expect(
          within(canvasElement).getAllByRole("listitem"),
        ).toHaveLength(30);
      },
    );

    await step(
      "Quando a área é rolada até o fim, então o último item fica visível",
      async () => {
        await expect(viewport?.scrollHeight).toBeGreaterThan(
          viewport?.clientHeight ?? 0,
        );
        viewport?.scrollTo({ top: viewport.scrollHeight });
        await expect(viewport?.scrollTop).toBeGreaterThan(0);
      },
    );
  },
};
