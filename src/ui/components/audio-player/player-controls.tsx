"use client";

import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { AnimatedIcon } from "@/ui/components/motion/animated-icon";
import { Button } from "@/ui/primitives/button";

const SKIP_SECONDS = 10;

type PlayerControlsProps = {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
};

export function PlayerControls({
  isPlaying,
  onTogglePlay,
  onSkip,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Voltar ${SKIP_SECONDS} segundos`}
        onClick={() => onSkip(-SKIP_SECONDS)}
      >
        <RotateCcw />
      </Button>
      <Button
        size="icon-lg"
        className="rounded-full"
        aria-label={isPlaying ? "Pausar" : "Reproduzir"}
        onClick={onTogglePlay}
      >
        <AnimatedIcon iconKey={isPlaying ? "pause" : "play"}>
          {isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </AnimatedIcon>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Avançar ${SKIP_SECONDS} segundos`}
        onClick={() => onSkip(SKIP_SECONDS)}
      >
        <RotateCw />
      </Button>
    </div>
  );
}
