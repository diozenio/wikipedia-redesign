"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { PlayerControls } from "@/ui/components/audio-player/player-controls";
import { PlayerTimeline } from "@/ui/components/audio-player/player-timeline";
import { PlayerVolume } from "@/ui/components/audio-player/player-volume";
import type { Playback } from "@/ui/lib/article-audio/audio-element";
import { Button } from "@/ui/primitives/button";

export type AudioPlayerBarProps = {
  title: string;
  playback: Playback;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onSkip: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onStop: () => void;
};

const SLIDE = { type: "spring", stiffness: 260, damping: 30 } as const;

function NowPlaying({ title }: { title: string }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground">Ouvindo artigo</p>
      <p className="truncate text-sm font-medium text-foreground">{title}</p>
    </div>
  );
}

export function AudioPlayerBar({
  title,
  playback,
  onTogglePlay,
  onSeek,
  onSkip,
  onVolumeChange,
  onToggleMute,
  onStop,
}: AudioPlayerBarProps) {
  return (
    <motion.section
      aria-label="Player do artigo"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4"
      initial={{ y: "120%", opacity: 0, scale: 0.96 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: "120%", opacity: 0, scale: 0.96 }}
      transition={SLIDE}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          <PlayerControls
            isPlaying={playback.isPlaying}
            onTogglePlay={onTogglePlay}
            onSkip={onSkip}
          />
          <NowPlaying title={title} />
          <PlayerVolume
            className="hidden sm:flex"
            volume={playback.volume}
            muted={playback.muted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
          />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Parar e fechar o player"
            onClick={onStop}
          >
            <X />
          </Button>
        </div>
        <PlayerTimeline
          currentTime={playback.currentTime}
          duration={playback.duration}
          onSeek={onSeek}
        />
      </div>
    </motion.section>
  );
}
