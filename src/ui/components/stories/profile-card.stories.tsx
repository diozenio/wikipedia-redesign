import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ProfileCard } from "@/ui/components/profile-card";
import {
  ProfileCardContext,
  type ProfileCardContextValue,
} from "@/ui/contexts/profile-card-context";

// The component takes no props: everything comes from ProfileCardContext,
// so the story args are the context value.
const meta = {
  title: "Components/ProfileCard",
  component: ProfileCard,
  render: (args) => (
    <ProfileCardContext value={args as unknown as ProfileCardContextValue}>
      <ProfileCard />
    </ProfileCardContext>
  ),
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<ProfileCardContextValue>;

export const Default: Story = {
  args: {
    title: "Ada Lovelace",
    subtitle: "@ada",
    tag: "Engineer",
    avatarFallback: "AL",
    description: "Writing the first programs before computers existed.",
    action: { label: "Follow", onClick: fn() },
  },
};

export const SecondaryAction: Story = {
  args: {
    ...Default.args,
    action: { label: "Following", variant: "outline", onClick: fn() },
  },
};

export const Minimal: Story = { args: { title: "Ada Lovelace" } };
