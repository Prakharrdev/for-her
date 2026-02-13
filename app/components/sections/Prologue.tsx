'use client';

import React from 'react';
import { motion } from 'framer-motion';

/* ---------- tiny helper: sakura petal SVG ---------- */
function SakuraPetal({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 30 30"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 2 C18 8, 26 10, 28 15 C26 20, 18 22, 15 28 C12 22, 4 20, 2 15 C4 10, 12 8, 15 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ---------- drifting petal particles ---------- */
const DRIFTING_PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${((i * 8 + 5) * 7) % 100}%`,
  delay: ((i * 3 + 2) % 8),
  duration: 8 + ((i * 5 + 1) % 6),
  size: 10 + ((i * 4 + 3) % 14),
  opacity: 0.15 + ((i * 7 + 2) % 25) / 100,
  drift: 40 + ((i * 6 + 1) % 60),
}));

function DriftingPetals() {
  const petals = DRIFTING_PETALS;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-pink-300"
          style={{ left: p.left, top: '-24px', opacity: p.opacity }}
          animate={{
            y: ['0vh', '105vh'],
            x: [0, p.drift],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <SakuraPetal style={{ width: p.size, height: p.size }} />
        </motion.div>
      ))}
    </div>
  );
}

/* ========== PROLOGUE SECTION ========== */
export default function Prologue() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background gradient layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0d0208] to-[#1a0510]" />
        {/* Radial accent */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(255,105,135,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Drifting petals */}
      <DriftingPetals />

      {/* Centre content */}
      <div className="relative z-10 text-center px-8 max-w-3xl mx-auto">
        {/* Small sakura icon */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <div className="text-pink-300/50">
            <SakuraPetal style={{ width: 28, height: 28 }} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-playfair font-light tracking-[0.12em] text-5xl md:text-7xl lg:text-8xl"
          style={{
            background:
              'linear-gradient(135deg, #FFE5E5 0%, #FFB6C1 40%, #FFC0CB 60%, #FFE5E5 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 6s ease-in-out infinite',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
        >
          Eternal Sakura
        </motion.h1>

        {/* Thin divider line */}
        <motion.div
          className="h-px mx-auto mt-8 bg-gradient-to-r from-transparent via-pink-200/30 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: '12rem' }}
          transition={{ duration: 1.6, delay: 0.9, ease: 'easeOut' }}
        />

        {/* Sub-text */}
        <motion.p
          className="font-cormorant font-light italic text-lg md:text-2xl text-pink-100/50 mt-8 tracking-wide"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.3, ease: 'easeOut' }}
        >
          Scroll down to witness the eternal bloom
        </motion.p>

        {/* Scroll indicator arrow */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-1 text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom vignette fade into black (seamless transition to ScrollScene) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
