"use client";

import { firstValue } from "@/ui/components/audio-player/slider-value";
import { describeTime, formatTime } from "@/ui/lib/article-audio/format-time";
import { Slider } from "@/ui/primitives/slider";

type PlayerTimelineProps = {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
};

export function PlayerTimeline({
  currentTime,
  duration,
  onSeek,
}: PlayerTimelineProps) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
      <span className="min-w-10 text-right">{formatTime(currentTime)}</span>
      <Slider
        className="flex-1"
        value={[currentTime]}
        max={duration || 1}
        step={1}
        disabled={!duration}
        thumbLabel="Progresso do áudio"
        getAriaValueText={(_formatted, value) => describeTime(value)}
        onValueChange={(value) => onSeek(firstValue(value))}
      />
      <span className="min-w-10">{formatTime(duration)}</span>
    </div>
  );
}
