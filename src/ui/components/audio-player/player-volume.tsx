"use client";

import { Volume1, Volume2, VolumeX } from "lucide-react";
import { firstValue } from "@/ui/components/audio-player/slider-value";
import { AnimatedIcon } from "@/ui/components/motion/animated-icon";
import { cn } from "@/ui/lib/utils";
import { Button } from "@/ui/primitives/button";
import { Slider } from "@/ui/primitives/slider";

type PlayerVolumeProps = {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  className?: string;
};

function volumeIcon(level: number) {
  if (level === 0) return { key: "muted", Icon: VolumeX };
  if (level < 0.5) return { key: "low", Icon: Volume1 };
  return { key: "high", Icon: Volume2 };
}

export function PlayerVolume({
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
  className,
}: PlayerVolumeProps) {
  const level = muted ? 0 : volume;
  const { key, Icon } = volumeIcon(level);

  return (
    <div className={cn("flex w-36 items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={muted ? "Ativar som" : "Silenciar"}
        onClick={onToggleMute}
      >
        <AnimatedIcon iconKey={key}>
          <Icon className="size-4" />
        </AnimatedIcon>
      </Button>
      <Slider
        className="flex-1"
        value={[level]}
        max={1}
        step={0.05}
        thumbLabel="Volume"
        getAriaValueText={(_formatted, value) => `${Math.round(value * 100)}%`}
        onValueChange={(value) => onVolumeChange(firstValue(value))}
      />
    </div>
  );
}
