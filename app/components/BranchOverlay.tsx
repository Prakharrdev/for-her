'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useTransform,
  AnimatePresence,
  MotionValue,
} from 'framer-motion';
import memories, { Memory } from '@/app/data/memories';
import Image from 'next/image';

// ── Configuration ──────────────────────────────────────────────────────────────

/**
 * Each memory is positioned as a percentage along the branch.
 * Spread them evenly with padding so petals don't cluster at the edges.
 */
const LEAF_POSITIONS = memories.map(
  (_, i) => 10 + (i * 80) / (memories.length - 1) // 10% → 90%
);

// ── Petal Node ─────────────────────────────────────────────────────────────────

function PetalNode({
  memory,
  index,
  position,
  branchProgress,
  onHover,
  onLeave,
  isActive,
}: {
  memory: Memory;
  index: number;
  position: number; // 0-100 percentage along branch
  branchProgress: MotionValue<number>; // 0-1 how far the branch has grown
  onHover: (index: number, rect: DOMRect) => void;
  onLeave: () => void;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Petal blooms when the branch growth reaches its position
  const threshold = position / 100;
  const petalScale = useTransform(branchProgress, 
    [threshold - 0.02, threshold + 0.04], 
    [0, 1]
  );
  const petalOpacity = useTransform(branchProgress, 
    [threshold - 0.02, threshold + 0.04], 
    [0, 1]
  );

  const handleMouseEnter = () => {
    if (ref.current) {
      onHover(index, ref.current.getBoundingClientRect());
    }
  };

  // Alternate vertical offset for visual interest
  const yOffset = index % 2 === 0 ? -14 : 14;

  return (
    <motion.div
      ref={ref}
      className="absolute z-20 cursor-pointer"
      style={{
        left: `${position}%`,
        top: '50%',
        y: yOffset,
        scale: petalScale,
        opacity: petalOpacity,
        translateX: '-50%',
        translateY: '-50%',
      }}
      whileHover={{ scale: 1.3 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      {/* Outer glow on hover */}
      <div
        className={`
          absolute inset-0 -m-4 rounded-full transition-all duration-300
          ${isActive ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}
        `}
        style={{
          background:
            'radial-gradient(circle, rgba(255,183,197,0.5) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Petal SVG */}
      <div className="relative w-8 h-8 md:w-10 md:h-10">
        <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-lg" fill="none">
          <path
            d="M20 4 C26 10, 34 18, 34 24 C34 30, 28 36, 20 36 C12 36, 6 30, 6 24 C6 18, 14 10, 20 4Z"
            fill={`url(#petalGrad-${index})`}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.5"
          />
          <defs>
            <radialGradient id={`petalGrad-${index}`} cx="50%" cy="40%">
              <stop offset="0%" stopColor="#FFD1DC" />
              <stop offset="100%" stopColor="#FF8DA1" />
            </radialGradient>
          </defs>
        </svg>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-pink-300/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
        />
      </div>

      {/* Label */}
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] text-pink-200/50 whitespace-nowrap tracking-wider font-light">
        {memory.title}
      </span>
    </motion.div>
  );
}

// ── Hover Card ─────────────────────────────────────────────────────────────────

function HoverCard({ memory, rect }: { memory: Memory; rect: DOMRect }) {
  const cardWidth = 300;
  // Position above the petal, clamped to viewport
  const cardLeft = Math.max(
    12,
    Math.min(rect.left + rect.width / 2 - cardWidth / 2, window.innerWidth - cardWidth - 12)
  );
  // Place card above the petal
  const cardTop = Math.max(12, rect.top - 320);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed z-[60] pointer-events-none"
      style={{ left: cardLeft, top: cardTop, width: cardWidth }}
    >
      <div
        className="rounded-xl overflow-hidden border border-white/15 shadow-2xl"
        style={{
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Image */}
        <div className="relative w-full h-36 overflow-hidden">
          <Image
            src={memory.image}
            alt={memory.title}
            fill
            className="object-cover"
            sizes="300px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4">
          <span className="text-[10px] font-medium tracking-widest uppercase text-pink-300/70">
            {memory.date}
          </span>
          <h3 className="text-base font-light text-white mt-1 mb-2 tracking-wide">
            {memory.title}
          </h3>
          <div className="h-px w-8 bg-gradient-to-r from-pink-400/40 to-transparent mb-2" />
          <p className="text-[11px] leading-relaxed text-white/60 font-light line-clamp-3">
            {memory.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main BranchOverlay ─────────────────────────────────────────────────────────

interface BranchOverlayProps {
  scrollYProgress: MotionValue<number>;
  /** Scroll fraction where the text pause ends (branch starts growing) */
  branchStart: number;
  /** Scroll fraction where the branch should be fully grown */
  branchEnd: number;
}

export default function BranchOverlay({
  scrollYProgress,
  branchStart,
  branchEnd,
}: BranchOverlayProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [leafRect, setLeafRect] = useState<DOMRect | null>(null);

  // Normalize scroll progress into branch growth (0 → 1)
  const branchProgress = useTransform(
    scrollYProgress,
    [branchStart, branchEnd],
    [0, 1]
  );

  // Overall overlay opacity — fade in right after text disappears
  const overlayOpacity = useTransform(
    scrollYProgress,
    [branchStart, branchStart + 0.03],
    [0, 1]
  );

  // Branch line width grows with scroll (0% → 100%)
  const branchWidth = useTransform(branchProgress, [0, 1], ['0%', '100%']);

  // Subtle glow that intensifies as more of the branch is revealed
  const glowOpacity = useTransform(branchProgress, [0, 0.5, 1], [0, 0.3, 0.5]);

  const handleLeafHover = (index: number, rect: DOMRect) => {
    setHoveredIndex(index);
    setLeafRect(rect);
  };

  const handleLeafLeave = () => {
    setHoveredIndex(null);
    setLeafRect(null);
  };

  return (
    <>
      <motion.div
        className="absolute left-0 right-0 pointer-events-auto"
        style={{
          bottom: '12%',
          height: '120px',
          opacity: overlayOpacity,
          zIndex: 25,
        }}
      >
        {/* Growing branch line */}
        <div className="absolute inset-0 flex items-center px-8 md:px-16">
          {/* Branch track container */}
          <div className="relative w-full h-full">
            {/* Background track (subtle hint of full path) */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1px] bg-white/[0.04]" />

            {/* Growing branch line */}
            <motion.div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] origin-left"
              style={{ width: branchWidth }}
            >
              {/* Main line */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-300/50 via-pink-200/30 to-pink-100/10" />
              {/* Glow */}
              <motion.div
                className="absolute inset-0 -my-2 blur-md bg-gradient-to-r from-pink-400/30 via-pink-300/20 to-transparent"
                style={{ opacity: glowOpacity }}
              />
              {/* Tip glow */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,200,210,0.6) 0%, transparent 70%)',
                  filter: 'blur(3px)',
                }}
              />
            </motion.div>

            {/* Small decorative twigs branching off */}
            {[20, 40, 55, 72, 88].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute -translate-x-1/2 origin-bottom"
                style={{
                  left: `${pos}%`,
                  top: '50%',
                  opacity: useTransform(
                    branchProgress,
                    [pos / 100 - 0.02, pos / 100 + 0.03],
                    [0, 0.25]
                  ),
                  rotate: i % 2 === 0 ? -35 : 35,
                  transformOrigin: 'bottom center',
                }}
              >
                <div
                  className="w-[1px] bg-gradient-to-t from-pink-300/40 to-transparent"
                  style={{ height: i % 2 === 0 ? '18px' : '14px' }}
                />
              </motion.div>
            ))}

            {/* Petal nodes */}
            {memories.map((memory, index) => (
              <PetalNode
                key={memory.id}
                memory={memory}
                index={index}
                position={LEAF_POSITIONS[index]}
                branchProgress={branchProgress}
                onHover={handleLeafHover}
                onLeave={handleLeafLeave}
                isActive={hoveredIndex === index}
              />
            ))}
          </div>
        </div>

        {/* "Scroll to explore" hint */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          style={{
            opacity: useTransform(branchProgress, [0, 0.15], [0.5, 0]),
          }}
        >
          <motion.span
            className="text-[10px] text-white/25 tracking-[0.2em] uppercase"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            scroll to grow →
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Hover card portal */}
      <AnimatePresence>
        {hoveredIndex !== null && leafRect && (
          <HoverCard
            key={hoveredIndex}
            memory={memories[hoveredIndex]}
            rect={leafRect}
          />
        )}
      </AnimatePresence>
    </>
  );
}
