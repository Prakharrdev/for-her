'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

/**
 * SeasonCanvas — a sticky full-screen gradient that transitions through
 * four seasons as the parent section is scrolled.
 *
 * Spring  → soft pink / pale green
 * Summer  → warm gold / lush green
 * Autumn  → amber / burnt orange
 * Winter  → cool blue / white
 *
 * It reads scroll progress from its nearest scrollable ancestor
 * (the wrapping <section>) so it stays perfectly in sync with MemoryLane.
 */

// Season color stops (from / via / to for a radial gradient)
const SEASONS = {
  spring: { from: '#2d1b33', via: '#4a2040', to: '#1a1a2e' },
  summer: { from: '#1a2e1a', via: '#2d4a20', to: '#1a331b' },
  autumn: { from: '#331b1b', via: '#4a2d20', to: '#2e1a1a' },
  winter: { from: '#1a1a2e', via: '#203040', to: '#1b1b33' },
};

export default function SeasonCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the parent section (the <section> wrapper)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress → individual colour channel values
  // Spring (0) → Summer (0.33) → Autumn (0.66) → Winter (1)
  const bgFrom = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [
    SEASONS.spring.from,
    SEASONS.summer.from,
    SEASONS.autumn.from,
    SEASONS.winter.from,
  ]);
  const bgVia = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [
    SEASONS.spring.via,
    SEASONS.summer.via,
    SEASONS.autumn.via,
    SEASONS.winter.via,
  ]);
  const bgTo = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [
    SEASONS.spring.to,
    SEASONS.summer.to,
    SEASONS.autumn.to,
    SEASONS.winter.to,
  ]);

  // Compose into a CSS radial gradient string
  const background = useTransform(
    [bgFrom, bgVia, bgTo],
    ([f, v, t]: string[]) =>
      `radial-gradient(ellipse at 50% 60%, ${f} 0%, ${v} 45%, ${t} 100%)`
  );

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 h-full w-full"
      style={{ background }}
    />
  );
}
