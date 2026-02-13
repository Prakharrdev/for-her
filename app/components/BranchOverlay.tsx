'use client';

import React, { useState } from 'react';
import {
  motion,
  useTransform,
  AnimatePresence,
  MotionValue,
} from 'framer-motion';
import memories, { Memory } from '@/app/data/memories';
import Image from 'next/image';

// ── Configuration ──────────────────────────────────────────────────────────────

const CARD_WIDTH = 320;
const CARD_GAP = 80;
const STRIP_WIDTH = memories.length * (CARD_WIDTH + CARD_GAP) + 200;

function sakuraFlowerPath(cx: number, cy: number, r: number): string {
  const petals = 5;
  const paths: string[] = [];
  for (let i = 0; i < petals; i++) {
    const angle = (i * 360) / petals - 90;
    const rad = (angle * Math.PI) / 180;
    const tipX = cx + Math.cos(rad) * r;
    const tipY = cy + Math.sin(rad) * r;
    const spread = 0.42;
    const cpDist = r * 0.72;
    const cp1X = cx + Math.cos(rad - spread) * cpDist;
    const cp1Y = cy + Math.sin(rad - spread) * cpDist;
    const cp2X = cx + Math.cos(rad + spread) * cpDist;
    const cp2Y = cy + Math.sin(rad + spread) * cpDist;
    const notchDepth = r * 0.18;
    const notchX = tipX - Math.cos(rad) * notchDepth;
    const notchY = tipY - Math.sin(rad) * notchDepth;
    paths.push(
      `M${cx},${cy} Q${cp1X},${cp1Y} ${tipX - Math.cos(rad + 0.15)},${tipY - Math.sin(rad + 0.15)}` +
        ` L${notchX},${notchY}` +
        ` L${tipX + Math.cos(rad - 0.15)},${tipY + Math.sin(rad - 0.15)}` +
        ` Q${cp2X},${cp2Y} ${cx},${cy}Z`
    );
  }
  return paths.join(' ');
}

// ── Memory Card ────────────────────────────────────────────────────────────────

function MemoryCard({ memory, index }: { memory: Memory; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const yOffset = index % 2 === 0 ? -30 : 30;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: CARD_WIDTH, marginTop: yOffset }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Sakura flower connector dot */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        style={{
          top: index % 2 === 0 ? 'auto' : -32,
          bottom: index % 2 === 0 ? -32 : 'auto',
        }}
      >
        <svg viewBox="0 0 40 40" className="w-7 h-7 drop-shadow-md" fill="none">
          <path
            d={sakuraFlowerPath(20, 20, 13)}
            fill="url(#sakuraGrad)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.3"
          />
          <circle cx="20" cy="20" r="2.2" fill="#FFD700" opacity="0.7" />
          <defs>
            <radialGradient id="sakuraGrad" cx="50%" cy="45%">
              <stop offset="0%" stopColor="#FFF0F3" />
              <stop offset="40%" stopColor="#FFD1DC" />
              <stop offset="100%" stopColor="#FF8DA1" />
            </radialGradient>
          </defs>
        </svg>
        <div
          className="absolute inset-0 -m-2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,183,197,0.3) 0%, transparent 70%)',
            filter: 'blur(5px)',
          }}
        />
      </div>

      {/* Card body */}
      <motion.div
        className="rounded-xl overflow-hidden border border-white/10"
        style={{
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        animate={
          expanded
            ? { scale: 1.03, borderColor: 'rgba(255,183,197,0.3)' }
            : { scale: 1, borderColor: 'rgba(255,255,255,0.1)' }
        }
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Image */}
        <div className="relative w-full h-36 overflow-hidden">
          <Image
            src={memory.image}
            alt={memory.title}
            fill
            className="object-cover"
            sizes="320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute bottom-2 left-3 text-[9px] font-medium tracking-widest uppercase text-pink-300/80 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {memory.date}
          </span>
        </div>

        {/* Text */}
        <div className="p-4">
          <h3 className="text-sm font-light text-white tracking-wide mb-2">
            {memory.title}
          </h3>
          <div className="h-px w-8 bg-gradient-to-r from-pink-400/40 to-transparent mb-2" />
          <AnimatePresence mode="wait">
            {expanded ? (
              <motion.p
                key="full"
                className="text-[11px] leading-relaxed text-white/55 font-light"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {memory.description}
              </motion.p>
            ) : (
              <motion.p
                key="short"
                className="text-[11px] leading-relaxed text-white/55 font-light line-clamp-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {memory.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main BranchOverlay ─────────────────────────────────────────────────────────

interface BranchOverlayProps {
  scrollYProgress: MotionValue<number>;
  branchStart: number;
  branchEnd: number;
}

export default function BranchOverlay({
  scrollYProgress,
  branchStart,
  branchEnd,
}: BranchOverlayProps) {
  // Normalize scroll into branch growth 0→1
  const branchProgress = useTransform(
    scrollYProgress,
    [branchStart, branchEnd],
    [0, 1]
  );

  // Fade in
  const overlayOpacity = useTransform(
    scrollYProgress,
    [branchStart, branchStart + 0.03],
    [0, 1]
  );

  // Horizontal slide: cards enter from the right edge and scroll left
  // Start off-screen right (~viewport width), end fully scrolled left
  const translateX = useTransform(
    branchProgress,
    [0, 0.15, 1],
    [typeof window !== 'undefined' ? window.innerWidth : 1400, 0, -(STRIP_WIDTH - 1200)]
  );

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      style={{ opacity: overlayOpacity, zIndex: 25 }}
    >
      {/* Horizontally sliding strip */}
      <motion.div
        className="absolute flex items-center"
        style={{
          top: '80%',
          translateY: '-50%',
          x: translateX,
          gap: CARD_GAP,
          paddingLeft: 80,
          paddingRight: 120,
        }}
      >
        {/* Branch line */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[3px] left-0 rounded-full"
          style={{
            width: STRIP_WIDTH,
            background:
              'linear-gradient(90deg, rgba(140,100,70,0.5) 0%, rgba(160,115,80,0.3) 50%, rgba(140,100,70,0.12) 100%)',
          }}
        />
        {/* Branch glow */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 left-0 blur-sm rounded-full"
          style={{
            width: STRIP_WIDTH,
            background:
              'linear-gradient(90deg, rgba(255,180,200,0.18) 0%, rgba(255,200,210,0.08) 50%, transparent 100%)',
          }}
        />

        {/* Memory cards */}
        {memories.map((memory, index) => (
          <MemoryCard key={memory.id} memory={memory} index={index} />
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{
          opacity: useTransform(branchProgress, [0, 0.1], [0.5, 0]),
        }}
      >
        <motion.span
          className="text-[10px] text-white/25 tracking-[0.2em] uppercase"
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          scroll to explore memories →
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
