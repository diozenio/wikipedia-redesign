import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "@/ui/primitives/input";

const meta = {
  title: "Primitives/Input",
  component: Input,
  args: { placeholder: "Type something...", "aria-label": "Campo de exemplo" },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Campo de texto: aceita digitação. */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Campo de exemplo",
    });
    await step(
      "Quando o usuário digita, então o texto aparece no campo",
      async () => {
        await userEvent.type(input, "Olá");
        await expect(input).toHaveValue("Olá");
      },
    );
  },
};

/** Desativado: não aceita digitação. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, step }) => {
    await step("Então o campo está desativado", async () => {
      await expect(
        within(canvasElement).getByRole("textbox", {
          name: "Campo de exemplo",
        }),
      ).toBeDisabled();
    });
  },
};

/** Inválido: marcado com `aria-invalid` para leitores de tela. */
export const Invalid: Story = {
  args: { "aria-invalid": true },
  play: async ({ canvasElement, step }) => {
    await step("Então o campo é anunciado como inválido", async () => {
      await expect(
        within(canvasElement).getByRole("textbox", {
          name: "Campo de exemplo",
        }),
      ).toBeInvalid();
    });
  },
};
