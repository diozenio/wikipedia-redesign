import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EmptyState } from "@/ui/components/empty-state";
import {
  EmptyStateContext,
  type EmptyStateContextValue,
} from "@/ui/contexts/empty-state-context";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  render: (args) => (
    <EmptyStateContext value={args as unknown as EmptyStateContextValue}>
      <EmptyState />
    </EmptyStateContext>
  ),
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<EmptyStateContextValue>;

/**
 * Estado vazio de "página não encontrada": título h1, descrição e um botão de
 * ação. O "404" grande é decorativo e fica escondido de leitores de tela.
 */
export const NotFound: Story = {
  args: {
    media: "404",
    title: "Página não encontrada",
    description: "A página que você procura não existe ou foi movida.",
    action: { label: "Ir para a página principal", onClick: fn() },
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então o título é o h1 da página", async () => {
      await expect(
        canvas.getByRole("heading", {
          level: 1,
          name: "Página não encontrada",
        }),
      ).toBeVisible();
      await expect(canvas.getByText("404")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    await step(
      "Quando o usuário clica no botão, então a ação é executada",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Ir para a página principal" }),
        );
        await expect(args.action?.onClick).toHaveBeenCalledTimes(1);
      },
    );
  },
};

/** Sem ação nem mídia: só o título e a descrição. */
export const NoResults: Story = {
  args: {
    title: "Nenhum resultado",
    description: "Tente pesquisar com outras palavras.",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Então aparecem título e descrição, sem botão", async () => {
      await expect(
        canvas.getByRole("heading", { level: 1, name: "Nenhum resultado" }),
      ).toBeVisible();
      await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
    });
  },
};
