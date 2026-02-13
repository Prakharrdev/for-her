'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import EternalCounter from './EternalCounter';

// ── Configuration ──────────────────────────────────────────────────────────────

/** Relationship start date — change this to yours */
const RELATIONSHIP_START = '2023-09-06';

// ── Confetti burst ─────────────────────────────────────────────────────────────

function fireConfetti() {
  const duration = 4000;
  const end = Date.now() + duration;

  const sakuraColors = ['#FFB7C5', '#FF69B4', '#FFC0CB', '#FFD1DC', '#FF8DA1', '#FFFFFF'];

  // Initial big burst
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
    colors: sakuraColors,
    shapes: ['circle'],
    scalar: 1.2,
    gravity: 0.6,
    drift: 0,
    ticks: 300,
  });

  // Continuous side cannons
  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: sakuraColors,
      shapes: ['circle'],
      scalar: 0.9,
      gravity: 0.5,
      ticks: 200,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: sakuraColors,
      shapes: ['circle'],
      scalar: 0.9,
      gravity: 0.5,
      ticks: 200,
    });

    requestAnimationFrame(frame);
  };
  frame();

  // Delayed shower from top
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 160,
      origin: { x: 0.5, y: 0 },
      colors: sakuraColors,
      shapes: ['circle'],
      scalar: 1,
      gravity: 0.4,
      ticks: 350,
    });
  }, 800);
}

// ── Floating petal background decoration ───────────────────────────────────────

function FloatingPetals() {
  const petals = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    delay: Math.random() * 5,
    duration: 6 + Math.random() * 6,
    size: 6 + Math.random() * 10,
    drift: -30 + Math.random() * 60,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: p.left, top: '-5%' }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.drift],
            rotate: [0, 360],
            opacity: [0, 0.5, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 12 12" width={p.size} height={p.size}>
            <path
              d="M6 1 Q8.5 4, 8 6 Q7.5 9, 6 11 Q4.5 9, 4 6 Q3.5 4, 6 1Z"
              fill="rgba(255,200,210,0.4)"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ValentineProposal() {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = useCallback(() => {
    setIsAccepted(true);
    fireConfetti();
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(30,10,20,0.9) 0%, rgba(0,0,0,0.95) 70%)',
        }}
      />

      {/* Floating petals */}
      <FloatingPetals />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {!isAccepted ? (
            /* ── State 1: The Question ── */
            <motion.div
              key="question"
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Decorative sakura icon */}
              <motion.div
                className="mb-8"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 60 60" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg" fill="none">
                  {[0, 72, 144, 216, 288].map((deg, j) => {
                    const rad = ((deg - 90) * Math.PI) / 180;
                    const tx = 30 + Math.cos(rad) * 16;
                    const ty = 30 + Math.sin(rad) * 16;
                    const cp1Rad = rad - 0.4;
                    const cp2Rad = rad + 0.4;
                    const cpD = 12;
                    return (
                      <path
                        key={j}
                        d={`M30,30 Q${30 + Math.cos(cp1Rad) * cpD},${30 + Math.sin(cp1Rad) * cpD} ${tx},${ty} Q${30 + Math.cos(cp2Rad) * cpD},${30 + Math.sin(cp2Rad) * cpD} 30,30Z`}
                        fill="rgba(255,200,210,0.6)"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="0.3"
                      />
                    );
                  })}
                  <circle cx="30" cy="30" r="4" fill="rgba(255,215,0,0.6)" />
                </svg>
              </motion.div>

              {/* Headline */}
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wide mb-6"
                style={{
                  background:
                    'linear-gradient(135deg, #FFE5E5 0%, #FFB6C1 30%, #FFC0CB 50%, #FFB6C1 70%, #FFE5E5 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 4s ease-in-out infinite',
                }}
              >
                Will you be my Valentine?
              </h1>

              {/* Subtext */}
              <p className="text-base md:text-lg text-pink-200/50 font-light tracking-wide mb-12 max-w-md">
                For this season, and every season after.
              </p>

              {/* Yes Button */}
              <motion.button
                onClick={handleAccept}
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Pulsing glow behind button */}
                <motion.div
                  className="absolute -inset-3 rounded-full opacity-60 blur-xl"
                  style={{
                    background:
                      'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 50%, #FF69B4 100%)',
                  }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                <span
                  className="relative block px-14 py-4 rounded-full text-lg md:text-xl font-light tracking-[0.15em] text-white border border-white/20"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,105,180,0.6) 0%, rgba(255,182,193,0.4) 50%, rgba(255,105,180,0.6) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  Yes
                </span>
              </motion.button>
            </motion.div>
          ) : (
            /* ── State 2: The Counter ── */
            <motion.div
              key="counter"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1,
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Success message */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <h2
                  className="text-3xl md:text-5xl font-light tracking-wide mb-3"
                  style={{
                    background:
                      'linear-gradient(135deg, #FFE5E5 0%, #FFB6C1 50%, #FFE5E5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Forever starts now
                </h2>
                <div className="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-pink-300/30 to-transparent" />
              </motion.div>

              {/* The timer */}
              <EternalCounter startDate={RELATIONSHIP_START} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer credit */}
      <motion.p
        className="absolute bottom-6 left-0 right-0 text-center text-xs text-pink-200/30 font-light tracking-[0.15em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        made by Perk with ♥
      </motion.p>
    </div>
  );
}
