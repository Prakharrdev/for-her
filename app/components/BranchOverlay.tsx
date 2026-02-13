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

/**
 * Generates a 5-petal sakura flower SVG path centred at (cx, cy) with given radius.
 * Each petal is a heart-shaped curve radiating outward.
 */
function sakuraFlowerPath(cx: number, cy: number, r: number): string {
  const petals = 5;
  const paths: string[] = [];
  for (let i = 0; i < petals; i++) {
    const angle = (i * 360) / petals - 90; // start from top
    const rad = (angle * Math.PI) / 180;
    // Tip of petal
    const tipX = cx + Math.cos(rad) * r;
    const tipY = cy + Math.sin(rad) * r;
    // Control points for the rounded petal shape
    const spread = 0.42;
    const cp1Angle = rad - spread;
    const cp2Angle = rad + spread;
    const cpDist = r * 0.72;
    const cp1X = cx + Math.cos(cp1Angle) * cpDist;
    const cp1Y = cy + Math.sin(cp1Angle) * cpDist;
    const cp2X = cx + Math.cos(cp2Angle) * cpDist;
    const cp2Y = cy + Math.sin(cp2Angle) * cpDist;
    // Notch at petal tip (the characteristic sakura "V")
    const notchDepth = r * 0.18;
    const nRad = rad;
    const notchX = tipX - Math.cos(nRad) * notchDepth;
    const notchY = tipY - Math.sin(nRad) * notchDepth;
    paths.push(
      `M${cx},${cy} Q${cp1X},${cp1Y} ${tipX - Math.cos(rad + 0.15) * 1},${tipY - Math.sin(rad + 0.15) * 1}` +
      ` L${notchX},${notchY}` +
      ` L${tipX + Math.cos(rad - 0.15) * 1},${tipY + Math.sin(rad - 0.15) * 1}` +
      ` Q${cp2X},${cp2Y} ${cx},${cy}Z`
    );
  }
  return paths.join(' ');
}

// ── Sakura Flower Node ─────────────────────────────────────────────────────────

function SakuraNode({
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
  position: number;
  branchProgress: MotionValue<number>;
  onHover: (index: number, rect: DOMRect) => void;
  onLeave: () => void;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const threshold = position / 100;
  const petalScale = useTransform(branchProgress,
    [threshold - 0.02, threshold + 0.06],
    [0, 1]
  );
  const petalOpacity = useTransform(branchProgress,
    [threshold - 0.02, threshold + 0.06],
    [0, 1]
  );

  const handleMouseEnter = () => {
    if (ref.current) {
      onHover(index, ref.current.getBoundingClientRect());
    }
  };

  // Alternate above/below the branch
  const yOffset = index % 2 === 0 ? -28 : 28;
  // Slight rotation per flower for organic feel
  const rotation = [0, 15, -10, 20, -15][index % 5];

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
        rotate: rotation,
      }}
      whileHover={{ scale: 1.35, rotate: rotation + 10 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      {/* Ambient sakura glow */}
      <div
        className="absolute inset-0 -m-6 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,183,197,0.4) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Hover glow */}
      <div
        className={`
          absolute inset-0 -m-8 rounded-full transition-all duration-300
          ${isActive ? 'opacity-100 scale-130' : 'opacity-0 scale-100'}
        `}
        style={{
          background:
            'radial-gradient(circle, rgba(255,183,197,0.8) 0%, transparent 70%)',
          filter: 'blur(14px)',
        }}
      />

      {/* 5-petal Sakura Flower SVG */}
      <div className="relative w-12 h-12 md:w-16 md:h-16">
        <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-lg" fill="none">
          {/* Flower petals */}
          <path
            d={sakuraFlowerPath(25, 25, 18)}
            fill={`url(#sakuraGrad-${index})`}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.4"
          />
          {/* Centre pistil */}
          <circle cx="25" cy="25" r="3.5" fill={`url(#centreGrad-${index})`} />
          {/* Tiny stamen dots */}
          {[0, 72, 144, 216, 288].map((deg, j) => {
            const sRad = (deg - 90) * Math.PI / 180;
            const sx = 25 + Math.cos(sRad) * 6;
            const sy = 25 + Math.sin(sRad) * 6;
            return <circle key={j} cx={sx} cy={sy} r="1" fill="#FFE5B4" opacity="0.7" />;
          })}
          <defs>
            <radialGradient id={`sakuraGrad-${index}`} cx="50%" cy="45%">
              <stop offset="0%" stopColor="#FFF0F3" />
              <stop offset="40%" stopColor="#FFD1DC" />
              <stop offset="100%" stopColor="#FF8DA1" />
            </radialGradient>
            <radialGradient id={`centreGrad-${index}`} cx="50%" cy="45%">
              <stop offset="0%" stopColor="#FFFACD" />
              <stop offset="100%" stopColor="#FFD700" />
            </radialGradient>
          </defs>
        </svg>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-pink-300/25"
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        />
      </div>

      {/* Label */}
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-pink-200/80 whitespace-nowrap tracking-wider font-light drop-shadow-lg">
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

  // Glow that intensifies as more of the branch is revealed
  const glowOpacity = useTransform(branchProgress, [0, 0.5, 1], [0, 0.5, 0.8]);

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
          bottom: '14%',
          height: '200px',
          opacity: overlayOpacity,
          zIndex: 25,
        }}
      >
        <div className="absolute inset-0 flex items-center px-4 md:px-12">
          <div className="relative w-full h-full">

            {/* ── Organic Branch SVG ── */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Background track hint */}
              <path
                d="M0 100 Q100 85, 200 95 T400 90 T600 105 T800 92 T1000 100"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1.5"
                fill="none"
              />

              {/* Growing main branch (masked by clip-path) */}
              <motion.g
                style={{
                  clipPath: useTransform(branchWidth, (w) => `inset(0 ${100 - parseFloat(w as string)}% 0 0)`),
                }}
              >
                {/* Thick woody branch */}
                <path
                  d="M0 100 Q80 82, 160 92 Q240 102, 320 88 Q400 74, 480 90 Q560 106, 640 94 Q720 82, 800 96 Q880 110, 960 98 L1000 100"
                  stroke="url(#branchStroke)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Thinner inner highlight */}
                <path
                  d="M0 100 Q80 82, 160 92 Q240 102, 320 88 Q400 74, 480 90 Q560 106, 640 94 Q720 82, 800 96 Q880 110, 960 98 L1000 100"
                  stroke="url(#branchHighlight)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Sub-branches / twigs */}
                <path d="M160 92 Q140 65, 130 50" stroke="rgba(180,130,100,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M160 92 Q175 70, 185 55" stroke="rgba(180,130,100,0.4)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M320 88 Q310 115, 300 135" stroke="rgba(180,130,100,0.45)" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M480 90 Q465 60, 455 45" stroke="rgba(180,130,100,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M480 90 Q500 65, 510 50" stroke="rgba(180,130,100,0.35)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M640 94 Q655 120, 665 140" stroke="rgba(180,130,100,0.45)" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M640 94 Q625 70, 615 55" stroke="rgba(180,130,100,0.4)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M800 96 Q785 65, 775 48" stroke="rgba(180,130,100,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M800 96 Q820 120, 830 138" stroke="rgba(180,130,100,0.35)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M960 98 Q945 70, 935 52" stroke="rgba(180,130,100,0.4)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </motion.g>

              {/* Gradients */}
              <defs>
                <linearGradient id="branchStroke" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(140,100,70,0.8)" />
                  <stop offset="50%" stopColor="rgba(160,115,80,0.6)" />
                  <stop offset="100%" stopColor="rgba(140,100,70,0.3)" />
                </linearGradient>
                <linearGradient id="branchHighlight" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(200,170,140,0.5)" />
                  <stop offset="50%" stopColor="rgba(220,190,160,0.3)" />
                  <stop offset="100%" stopColor="rgba(200,170,140,0.1)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Branch glow */}
            <motion.div
              className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-4 blur-xl"
              style={{
                opacity: glowOpacity,
                background: 'linear-gradient(90deg, rgba(255,180,200,0.25) 0%, rgba(255,200,210,0.15) 50%, transparent 100%)',
              }}
            />

            {/* Sakura flower nodes */}
            {memories.map((memory, index) => (
              <SakuraNode
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

            {/* Small decorative falling petals near each flower */}
            {LEAF_POSITIONS.map((pos, i) => (
              <motion.div
                key={`deco-${i}`}
                className="absolute"
                style={{
                  left: `${pos + 2}%`,
                  top: '65%',
                  opacity: useTransform(
                    branchProgress,
                    [pos / 100, pos / 100 + 0.06],
                    [0, 0.5]
                  ),
                }}
              >
                <motion.svg
                  viewBox="0 0 12 12"
                  className="w-3 h-3"
                  animate={{ y: [0, 8, 0], rotate: [0, 20, -10, 0], opacity: [0.5, 0.3, 0.5] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path
                    d="M6 1 Q8 4, 8 6 Q8 9, 6 11 Q4 9, 4 6 Q4 4, 6 1Z"
                    fill="rgba(255,200,210,0.6)"
                  />
                </motion.svg>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
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
            scroll to bloom →
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
