import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EasyReadingSummaryCard } from "@/ui/components/article/easy-reading-summary";

const INTRO_TEXT =
  "O Brasil é o maior país da América do Sul. Tem mais de 200 milhões de habitantes. A capital é Brasília, e a maior cidade é São Paulo.";

const meta = {
  title: "Components/Article/EasyReadingSummaryCard",
  component: EasyReadingSummaryCard,
  args: {
    introText: INTRO_TEXT,
    state: {
      status: "ready",
      summary:
        "O Brasil é o maior país da América do Sul. Mais de 200 milhões de pessoas moram lá. A capital é Brasília.",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[40rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EasyReadingSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Loading: Story = {
  args: { state: { status: "loading" } },
};

export const NotConfigured: Story = {
  args: { state: { status: "unavailable", reason: "not_configured" } },
};

export const Failed: Story = {
  args: { state: { status: "unavailable", reason: "error" } },
};
