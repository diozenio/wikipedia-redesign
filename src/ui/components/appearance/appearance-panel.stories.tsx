import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppearancePanel } from "@/ui/components/appearance/appearance-panel";

const meta = {
  title: "Components/Appearance/AppearancePanel",
  component: AppearancePanel,
  args: {
    header: (
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-semibold text-foreground">
          Aparência
        </span>
        <span className="text-[0.8125rem] text-muted-foreground">
          Suas preferências ficam salvas neste navegador.
        </span>
      </div>
    ),
    footerHint: "Esc para fechar",
  },
  decorators: [
    (Story) => (
      <div className="w-[24.5rem] max-w-full rounded-lg border border-border bg-popover p-5 shadow-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppearancePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
