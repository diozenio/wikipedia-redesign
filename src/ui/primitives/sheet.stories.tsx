import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@/ui/primitives/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/ui/primitives/sheet";

function Demo({ side }: { side: "bottom" | "left" }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Abrir gaveta</Button>} />
      <SheetContent side={side} className="gap-3 p-5">
        <SheetTitle className="font-semibold">Título da gaveta</SheetTitle>
        <SheetDescription className="text-sm text-muted-foreground">
          Conteúdo de exemplo.
        </SheetDescription>
        <SheetClose render={<Button>Fechar</Button>} />
      </SheetContent>
    </Sheet>
  );
}

const meta = {
  title: "Primitives/Sheet",
  component: Sheet,
  render: () => <Demo side="bottom" />,
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Gaveta (sheet) que sobe da parte de baixo. É um diálogo modal com título e
 * descrição; o botão de fechar e o Esc fecham e devolvem o foco.
 */
export const Bottom: Story = {
  play: async ({ canvasElement, step }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Abrir gaveta",
    });

    await step(
      "Quando o usuário abre a gaveta, então aparece um diálogo nomeado",
      async () => {
        await userEvent.click(trigger);
        const dialog = await screen.findByRole("dialog", {
          name: "Título da gaveta",
        });
        await expect(dialog).toHaveAccessibleDescription(
          "Conteúdo de exemplo.",
        );
      },
    );

    await step(
      "Quando o usuário clica em Fechar, então a gaveta fecha e o foco volta",
      async () => {
        await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
        await waitFor(() =>
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
        await expect(trigger).toHaveFocus();
      },
    );
  },
};

/** Gaveta lateral (esquerda), usada pelo menu do site. Esc fecha. */
export const Left: Story = {
  render: () => <Demo side="left" />,
  play: async ({ canvasElement, step }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Abrir gaveta",
    });

    await step(
      "Quando o usuário abre e aperta Esc, então a gaveta fecha",
      async () => {
        await userEvent.click(trigger);
        await screen.findByRole("dialog", { name: "Título da gaveta" });
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
        await expect(trigger).toHaveFocus();
      },
    );
  },
};
