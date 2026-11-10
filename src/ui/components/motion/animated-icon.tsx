"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

export function AnimatedIcon({
  iconKey,
  children,
}: {
  iconKey: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={iconKey}
        className="flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}
