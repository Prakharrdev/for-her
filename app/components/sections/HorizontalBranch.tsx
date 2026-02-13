'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import memories, { Memory } from '@/app/data/memories';
import Image from 'next/image';

// ── Configuration ──────────────────────────────────────────────────────────────

/** Height of the outer container — controls how "long" the scroll feels */
const SCROLL_HEIGHT = '500vh';

/** How many branch segments to tile so the line looks continuous */
const BRANCH_SEGMENTS = 6;

/**
 * Each memory is positioned at a percentage along the track width.
 * Spread them evenly but with padding on both ends.
 */
const LEAF_POSITIONS = memories.map(
  (_, i) => 8 + (i * 84) / (memories.length - 1) // 8% → 92%
);

// ── Leaf Node ──────────────────────────────────────────────────────────────────

function LeafNode({
  memory,
  index,
  position,
  onHover,
  onLeave,
  isActive,
}: {
  memory: Memory;
  index: number;
  position: number;
  onHover: (index: number, rect: DOMRect) => void;
  onLeave: () => void;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      onHover(index, ref.current.getBoundingClientRect());
    }
  };

  return (
    <motion.div
      ref={ref}
      className="absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer"
      style={{ left: `${position}%` }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
      whileHover={{ scale: 1.25 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      {/* Outer Glow */}
      <div
        className={`
          absolute inset-0 -m-3 rounded-full transition-opacity duration-300
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background:
            'radial-gradient(circle, rgba(255,183,197,0.45) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Petal / Leaf Icon */}
      <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
        {/* Petal SVG */}
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full drop-shadow-lg"
          fill="none"
        >
          <path
            d="M20 4 C26 10, 34 18, 34 24 C34 30, 28 36, 20 36 C12 36, 6 30, 6 24 C6 18, 14 10, 20 4Z"
            fill="url(#petalGrad)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.5"
          />
          <defs>
            <radialGradient id="petalGrad" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#FFD1DC" />
              <stop offset="100%" stopColor="#FF8DA1" />
            </radialGradient>
          </defs>
        </svg>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-pink-300/40"
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Tiny label below petal */}
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-pink-200/60 whitespace-nowrap tracking-wider font-light">
        {memory.title}
      </span>
    </motion.div>
  );
}

// ── Hover Card (portal-style, screen-fixed) ────────────────────────────────────

function HoverCard({
  memory,
  rect,
}: {
  memory: Memory;
  rect: DOMRect;
}) {
  // Position the card above the leaf, centred horizontally
  const cardWidth = 320;
  const cardLeft = Math.max(
    16,
    Math.min(rect.left + rect.width / 2 - cardWidth / 2, window.innerWidth - cardWidth - 16)
  );
  const cardTop = Math.max(16, rect.top - 360);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed z-50 pointer-events-none"
      style={{
        left: cardLeft,
        top: cardTop,
        width: cardWidth,
      }}
    >
      <div
        className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Image */}
        <div className="relative w-full h-40 overflow-hidden">
          <Image
            src={memory.image}
            alt={memory.title}
            fill
            className="object-cover"
            sizes="320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          <span className="text-[10px] font-medium tracking-widest uppercase text-pink-200/70">
            {memory.date}
          </span>
          <h3 className="text-lg font-light text-white mt-1 mb-2 tracking-wide">
            {memory.title}
          </h3>
          <div className="h-px w-10 bg-gradient-to-r from-pink-300/50 to-transparent mb-3" />
          <p className="text-xs leading-relaxed text-white/70 font-light line-clamp-3">
            {memory.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Branch Line (SVG fallback if branch.png isn't available) ────────────────

function BranchLine() {
  return (
    <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
      {/* Attempt to render the real branch image tiled */}
      <div className="flex flex-row items-center h-24 w-full">
        {Array.from({ length: BRANCH_SEGMENTS }).map((_, i) => (
          <div key={i} className="relative h-full flex-1 min-w-0">
            {/* Real branch image — falls back to SVG line if 404 */}
            <Image
              src="/assets/branch.png"
              alt=""
              fill
              className="object-cover object-center opacity-70"
              sizes={`${100 / BRANCH_SEGMENTS}vw`}
              onError={(e) => {
                // Hide the broken image; the SVG fallback below will show
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>

      {/* SVG fallback branch line — always rendered behind the images */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1000 100"
      >
        {/* Main branch */}
        <path
          d="M0 50 Q100 45, 200 50 T400 48 T600 52 T800 49 T1000 50"
          stroke="rgba(255,183,197,0.25)"
          strokeWidth="3"
          fill="none"
        />
        {/* Thinner highlight */}
        <path
          d="M0 50 Q150 42, 300 50 T600 47 T1000 50"
          stroke="rgba(255,220,230,0.15)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function HorizontalBranch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [leafRect, setLeafRect] = useState<DOMRect | null>(null);

  // Scroll tracking on the tall outer container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map vertical scroll → horizontal translation
  // Track is wider than the viewport; we slide it from 0% to -75%
  // (leaving some padding so the last leaf is visible)
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-75%']);

  // Subtle parallax for the branch line
  const branchX = useTransform(scrollYProgress, [0, 1], ['2%', '-72%']);

  const handleLeafHover = (index: number, rect: DOMRect) => {
    setHoveredIndex(index);
    setLeafRect(rect);
  };

  const handleLeafLeave = () => {
    setHoveredIndex(null);
    setLeafRect(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative z-10"
      style={{ height: SCROLL_HEIGHT }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        {/* Section title */}
        <motion.div
          className="pt-16 pb-4 text-center flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-widest">
            Memory Lane
          </h2>
          <div className="h-px w-28 mx-auto bg-gradient-to-r from-transparent via-pink-300/40 to-transparent mt-4" />
          <p className="text-sm text-white/40 mt-3 tracking-wide font-light">
            Hover over a petal to relive the moment
          </p>
        </motion.div>

        {/* Horizontal track area — fills remaining height, centred vertically */}
        <div className="flex-1 relative flex items-center">
          {/* Branch line layer (slightly different parallax) */}
          <motion.div
            className="absolute h-full"
            style={{
              x: branchX,
              width: `${BRANCH_SEGMENTS * 100}%`,
            }}
          >
            <BranchLine />
          </motion.div>

          {/* Leaf nodes layer */}
          <motion.div
            className="absolute h-full"
            style={{
              x,
              width: `${BRANCH_SEGMENTS * 100}%`,
            }}
          >
            {memories.map((memory, index) => (
              <LeafNode
                key={memory.id}
                memory={memory}
                index={index}
                position={LEAF_POSITIONS[index]}
                onHover={handleLeafHover}
                onLeave={handleLeafLeave}
                isActive={hoveredIndex === index}
              />
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="pb-8 text-center flex-shrink-0"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
        >
          <motion.span
            className="text-xs text-white/30 tracking-widest uppercase"
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            scroll to explore →
          </motion.span>
        </motion.div>
      </div>

      {/* Hover card — rendered as fixed overlay outside the scrolling track */}
      <AnimatePresence>
        {hoveredIndex !== null && leafRect && (
          <HoverCard
            key={hoveredIndex}
            memory={memories[hoveredIndex]}
            rect={leafRect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
