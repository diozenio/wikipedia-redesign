"use client";

import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import type { Ref } from "react";
import { PlayerButton } from "@/ui/components/audio-player/player-button";
import { AnimatedIcon } from "@/ui/components/motion/animated-icon";

const SKIP_SECONDS = 10;

type PlayerControlsProps = {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  playButtonRef?: Ref<HTMLButtonElement>;
};

export function PlayerControls({
  isPlaying,
  onTogglePlay,
  onSkip,
  playButtonRef,
}: PlayerControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-0.5">
      <PlayerButton
        icon={<RotateCcw />}
        label="Voltar"
        srLabel={`${SKIP_SECONDS} segundos`}
        onClick={() => onSkip(-SKIP_SECONDS)}
      />
      <PlayerButton
        ref={playButtonRef}
        primary
        icon={
          <AnimatedIcon iconKey={isPlaying ? "pause" : "play"}>
            {isPlaying ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
          </AnimatedIcon>
        }
        label={isPlaying ? "Pausar" : "Reproduzir"}
        onClick={onTogglePlay}
      />
      <PlayerButton
        icon={<RotateCw />}
        label="Avançar"
        srLabel={`${SKIP_SECONDS} segundos`}
        onClick={() => onSkip(SKIP_SECONDS)}
      />
    </div>
  );
}
