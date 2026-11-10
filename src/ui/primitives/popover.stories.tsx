import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/ui/primitives/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/ui/primitives/popover";

const meta = {
  title: "Primitives/Popover",
  component: Popover,
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Abrir balão</Button>} />
      <PopoverContent className="w-72 p-4">
        <PopoverTitle className="font-semibold">Título do balão</PopoverTitle>
        <PopoverDescription className="text-sm text-muted-foreground">
          Descrição do balão.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Balão (popover) que abre a partir de um botão. Ele é um diálogo nomeado
 * pelo título e descrito pela descrição; o Esc fecha e o foco volta ao botão.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Abrir balão",
    });

    await step(
      "Quando o usuário clica no botão, então o balão abre",
      async () => {
        await userEvent.click(trigger);
        const dialog = await screen.findByRole("dialog", {
          name: "Título do balão",
        });
        await expect(dialog).toHaveAccessibleDescription("Descrição do balão.");
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
      },
    );

    await step(
      "Quando o usuário aperta Esc, então o balão fecha e o foco volta ao botão",
      async () => {
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
        await expect(trigger).toHaveFocus();
      },
    );
  },
};
