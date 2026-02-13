'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EternalCounterProps {
  startDate: string; // ISO date string e.g. "2023-09-06"
}

interface TimeElapsed {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateElapsed(start: Date): TimeElapsed {
  const now = new Date();
  const diff = now.getTime() - start.getTime();

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  // Calculate years and remaining days
  let years = now.getFullYear() - start.getFullYear();
  const anniversaryThisYear = new Date(
    now.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  if (now < anniversaryThisYear) {
    years--;
  }
  // Days since last anniversary
  const lastAnniversary = new Date(
    start.getFullYear() + years,
    start.getMonth(),
    start.getDate()
  );
  const daysDiff = Math.floor(
    (now.getTime() - lastAnniversary.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    years,
    days: daysDiff,
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
  };
}

function Digit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="font-mono text-5xl md:text-7xl font-light text-white tracking-tight tabular-nums"
          style={{
            textShadow: '0 0 30px rgba(255,182,193,0.3)',
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className="text-[10px] md:text-xs text-pink-300/50 uppercase tracking-[0.25em] mt-2 font-light">
        {label}
      </span>
    </div>
  );
}

function SmallDigit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="font-mono text-3xl md:text-5xl font-extralight text-white/80 tracking-tight tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className="text-[9px] md:text-[10px] text-pink-200/40 uppercase tracking-[0.2em] mt-1.5 font-light">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <motion.span
      className="text-3xl md:text-5xl font-extralight text-pink-300/30 self-start mt-0"
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      :
    </motion.span>
  );
}

export default function EternalCounter({ startDate }: EternalCounterProps) {
  const [elapsed, setElapsed] = useState<TimeElapsed>(() =>
    calculateElapsed(new Date(startDate)),
  );

  useEffect(() => {
    const start = new Date(startDate);
    // Tick every second
    const interval = setInterval(() => {
      setElapsed(calculateElapsed(start));
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const pad = (n: number, digits = 2) => n.toString().padStart(digits, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center gap-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.p
          className="text-sm md:text-base text-pink-200/50 tracking-[0.3em] uppercase font-light mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Together for
        </motion.p>
        <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-pink-300/30 to-transparent" />
      </div>

      {/* Row 1: Years & Days */}
      <div className="flex items-end gap-10 md:gap-16">
        <Digit value={elapsed.years.toString()} label="Years" />
        <Digit value={pad(elapsed.days, 3)} label="Days" />
      </div>

      {/* Divider */}
      <div className="h-px w-32 bg-gradient-to-r from-transparent via-pink-300/20 to-transparent" />

      {/* Row 2: Hours : Minutes : Seconds */}
      <div className="flex items-center gap-4 md:gap-6">
        <SmallDigit value={pad(elapsed.hours)} label="Hours" />
        <Separator />
        <SmallDigit value={pad(elapsed.minutes)} label="Min" />
        <Separator />
        <SmallDigit value={pad(elapsed.seconds)} label="Sec" />
      </div>

      {/* Footer */}
      <motion.p
        className="text-xs md:text-sm text-pink-200/30 font-light italic mt-4 tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        …and counting, forever.
      </motion.p>
    </motion.div>
  );
}
