'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Memory } from '@/app/data/memories';
import Image from 'next/image';

interface GlassCardProps {
  memory: Memory;
  index: number;
}

export default function GlassCard({ memory, index }: GlassCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className="
          relative max-w-md w-full
          rounded-2xl overflow-hidden
          border border-white/20
          shadow-2xl
        "
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Image */}
        <div className="relative w-full h-52 overflow-hidden">
          <Image
            src={memory.image}
            alt={memory.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 448px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <span className="text-xs font-medium tracking-widest uppercase text-pink-200/70">
            {memory.date}
          </span>

          <h3 className="text-2xl font-light text-white mt-2 mb-3 tracking-wide">
            {memory.title}
          </h3>

          <div className="h-px w-12 bg-gradient-to-r from-pink-300/50 to-transparent mb-4" />

          <p className="text-sm leading-relaxed text-white/70 font-light">
            {memory.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
