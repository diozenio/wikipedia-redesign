import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/primitives/dropdown-menu";

const onEdit = fn();

function Demo() {
  const [size, setSize] = useState("medio");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Opções</Button>} />
      <DropdownMenuContent className="min-w-44">
        <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={size} onValueChange={setSize}>
          <DropdownMenuRadioItem value="pequeno">Pequeno</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="medio">Médio</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const meta = {
  title: "Primitives/DropdownMenu",
  component: DropdownMenu,
  render: () => <Demo />,
  beforeEach: () => {
    onEdit.mockClear();
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Menu suspenso: abre por botão, é navegável pelas setas e tem itens comuns
 * e itens de rádio (`menuitemradio` com `aria-checked`).
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Opções",
    });

    await step(
      "Quando o usuário abre o menu, então as opções aparecem",
      async () => {
        await userEvent.click(trigger);
        const menu = await screen.findByRole("menu");
        await waitFor(() =>
          expect(
            within(menu).getByRole("menuitem", { name: "Editar" }),
          ).toBeVisible(),
        );
        await expect(
          within(menu).getByRole("menuitemradio", { name: "Médio" }),
        ).toHaveAttribute("aria-checked", "true");
      },
    );

    await step(
      "Quando o usuário escolhe Pequeno, então ele fica marcado",
      async () => {
        const small = screen.getByRole("menuitemradio", { name: "Pequeno" });
        await userEvent.click(small);
        await expect(small).toHaveAttribute("aria-checked", "true");
      },
    );

    await step(
      "Quando o usuário clica em Editar, então a ação roda e o menu fecha",
      async () => {
        await userEvent.click(screen.getByRole("menuitem", { name: "Editar" }));
        await expect(onEdit).toHaveBeenCalledTimes(1);
        await waitFor(() =>
          expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
        );
      },
    );
  },
};
