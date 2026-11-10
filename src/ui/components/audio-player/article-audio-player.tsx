"use client";

import { AnimatePresence, motion } from "motion/react";
import { AudioPlayerBar } from "@/ui/components/audio-player/audio-player-bar";
import { useArticleAudioContext } from "@/ui/contexts/article-audio-context";
import { useArticle } from "@/ui/contexts/article-context";

const PLAYER_SPACE = 136;

function PlayerSpacer() {
  return (
    <motion.div
      aria-hidden
      initial={{ height: 0 }}
      animate={{ height: PLAYER_SPACE }}
      exit={{ height: 0 }}
    />
  );
}

export function ArticleAudioPlayer() {
  const { title } = useArticle();
  const audio = useArticleAudioContext();
  const open = audio.phase === "active";

  return (
    <AnimatePresence>
      {open && <PlayerSpacer key="player-spacer" />}
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
