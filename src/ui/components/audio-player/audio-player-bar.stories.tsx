import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { AudioPlayerBar } from "@/ui/components/audio-player/audio-player-bar";

const meta = {
  title: "Components/AudioPlayer/AudioPlayerBar",
  component: AudioPlayerBar,
  parameters: { center: false },
  args: {
    title: "Sistema de informação",
    playback: {
      isPlaying: true,
      currentTime: 754,
      duration: 2410,
      volume: 0.8,
      muted: false,
    },
    onTogglePlay: fn(),
    onSeek: fn(),
    onSkip: fn(),
    onVolumeChange: fn(),
    onToggleMute: fn(),
    onStop: fn(),
  },
} satisfies Meta<typeof AudioPlayerBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playing: Story = {};

export const PausedAndMuted: Story = {
  args: {
    playback: {
      isPlaying: false,
      currentTime: 120,
      duration: 2410,
      volume: 0.8,
      muted: true,
    },
  },
};
