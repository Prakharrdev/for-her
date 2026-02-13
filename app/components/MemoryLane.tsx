'use client';

import React from 'react';
import { motion } from 'framer-motion';
import memories from '@/app/data/memories';
import GlassCard from './GlassCard';

export default function MemoryLane() {
  return (
    <div className="relative z-10 pb-40">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center pt-[30vh] pb-[20vh]"
      >
        <h2 className="text-5xl md:text-7xl font-light text-white tracking-widest">
          Memory Lane
        </h2>
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-pink-300/50 to-transparent mt-6" />
        <p className="text-lg text-white/50 mt-6 font-light tracking-wide">
          A walk through the moments that made us
        </p>
      </motion.div>

      {/* Cards */}
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {memories.map((memory, index) => (
          <div
            key={memory.id}
            className={index < memories.length - 1 ? 'mb-[80vh]' : ''}
          >
            <GlassCard memory={memory} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
