"use client";

import { AnimatePresence } from "motion/react";
import { AudioPlayerBar } from "@/ui/components/audio-player/audio-player-bar";
import { useArticleAudioContext } from "@/ui/contexts/article-audio-context";
import { useArticle } from "@/ui/contexts/article-context";

export function ArticleAudioPlayer() {
  const { title } = useArticle();
  const audio = useArticleAudioContext();
  const open = audio.phase === "active";

  return (
    <AnimatePresence>
      {open && (
        <AudioPlayerBar
          key="player-bar"
          title={title}
          playback={audio.playback}
          onTogglePlay={audio.togglePlay}
          onSeek={audio.seek}
          onSkip={audio.skip}
          onVolumeChange={audio.changeVolume}
          onToggleMute={audio.toggleMute}
          onStop={audio.stop}
        />
      )}
    </AnimatePresence>
  );
}
