"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { PlayerButton } from "@/ui/components/audio-player/player-button";
import { PlayerControls } from "@/ui/components/audio-player/player-controls";
import { PlayerTimeline } from "@/ui/components/audio-player/player-timeline";
import { PlayerVolume } from "@/ui/components/audio-player/player-volume";
import type { Playback } from "@/ui/lib/article-audio/audio-element";

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
    <div className="min-w-0 basis-full sm:order-2 sm:basis-auto sm:flex-1">
      <p className="text-xs text-muted-foreground">Ouvindo artigo</p>
      <p className="truncate text-sm font-medium text-foreground">{title}</p>
    </div>
  );
}

function playbackStatus({ isPlaying, muted }: Playback): string {
  const state = isPlaying ? "Reproduzindo" : "Pausado";
  return muted ? `${state}, som silenciado` : state;
}

function hasLostFocus(): boolean {
  const active = document.activeElement;
  return (
    !active ||
    active === document.body ||
    active.closest("[data-audio-trigger]") !== null
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
  const playButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hasLostFocus()) playButtonRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.section
      aria-label="Player do artigo"
      data-audio-player=""
      className="sticky bottom-0 z-40 px-4 pb-4"
      initial={{ y: "120%", opacity: 0, scale: 0.96 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: "120%", opacity: 0, scale: 0.96 }}
      transition={SLIDE}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <NowPlaying title={title} />
          <div className="sm:order-1">
            <PlayerControls
              isPlaying={playback.isPlaying}
              onTogglePlay={onTogglePlay}
              onSkip={onSkip}
              playButtonRef={playButtonRef}
            />
          </div>
          <PlayerVolume
            className="hidden sm:order-3 sm:flex"
            volume={playback.volume}
            muted={playback.muted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
          />
          <PlayerButton
            className="ml-auto sm:order-4 sm:ml-0"
            icon={<X />}
            label="Fechar"
            srLabel="o player e parar o áudio"
            onClick={onStop}
          />
        </div>
        <PlayerTimeline
          currentTime={playback.currentTime}
          duration={playback.duration}
          onSeek={onSeek}
        />
        <output className="sr-only">{playbackStatus(playback)}</output>
      </div>
    </motion.section>
  );
}
