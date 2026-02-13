'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * TransitionText – shows the relationship date as a scroll‑driven overlay.
 *
 * It wraps around <ScrollScene /> in page.tsx via a container ref so it can
 * track progress through the scroll‑scene section. No modifications to
 * ScrollScene itself are required.
 *
 * Timing is set AFTER ScrollScene's built‑in "This is where it all started"
 * text fades (textPauseEnd ≈ 0.362) and BEFORE the branch overlay grows
 * prominent, so there's no visual conflict.
 */

interface TransitionTextProps {
  /** Ref to wrapper div around ScrollScene */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function TransitionText({ containerRef }: TransitionTextProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Date reveal — appears after ScrollScene's text fades out (~0.362)
  // Fade in 0.37 → 0.41, hold 0.41 → 0.46, fade out 0.46 → 0.50
  const dateOpacity = useTransform(
    scrollYProgress,
    [0.37, 0.41, 0.46, 0.50],
    [0, 1, 1, 0]
  );
  const dateScale = useTransform(
    scrollYProgress,
    [0.37, 0.41],
    [0.92, 1]
  );
  const dateGlow = useTransform(
    scrollYProgress,
    [0.37, 0.43],
    [0, 50]
  );
  const subtitleOpacity = useTransform(
    scrollYProgress,
    [0.40, 0.43, 0.46, 0.50],
    [0, 1, 1, 0]
  );

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 22 }}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: dateOpacity, scale: dateScale }}
      >
        <div className="text-center px-8">
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-cormorant font-light tracking-[0.08em] text-white"
            style={{
              textShadow: useTransform(
                dateGlow,
                (v) =>
                  `0 0 ${v}px rgba(255,182,193,0.5), 0 0 ${v * 2}px rgba(255,182,193,0.2)`
              ),
            }}
          >
            September 6th, 2023
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-pink-200/40 font-light tracking-[0.2em] mt-6 uppercase"
            style={{ opacity: subtitleOpacity }}
          >
            The day everything changed
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
