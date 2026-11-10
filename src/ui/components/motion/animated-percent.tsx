"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

function toPercentLabel(value: number): string {
  return `${Math.round(value)}%`;
}

export function AnimatedPercent({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 120, damping: 20 });
  const label = useTransform(spring, toPercentLabel);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className="tabular-nums">{label}</motion.span>;
}
