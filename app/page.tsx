'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ScrollScene from "@/app/components/ScrollScene";
import ValentineProposal from "@/app/components/ValentineProposal";
import Prologue from "@/app/components/sections/Prologue";
import TransitionText from "@/app/components/sections/TransitionText";
import AudioPlayer from "@/app/components/ui/AudioPlayer";
import SakuraCursor from "@/app/components/ui/SakuraCursor";

export default function Home() {
  const scrollSceneRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  const handleStart = useCallback(() => {
    setStarted(true);
  }, []);

  return (
    <main className="min-h-screen bg-black">
      {/* Custom sakura cursor */}
      <SakuraCursor />

      {/* Audio — fullscreen prompt + persistent mini player */}
      <AudioPlayer onStart={handleStart} />

      {/* All content fades in after button press */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 1 : 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* Scroll‑driven date overlay (fixed, z‑22) */}
        <TransitionText containerRef={scrollSceneRef} />

        {/* Act I — Animated Prologue */}
        <Prologue />

        {/* Act II — Canvas / Video / Branch scroll experience */}
        <div ref={scrollSceneRef}>
          <ScrollScene />
        </div>

        {/* Act III — Finale */}
        <section className="relative z-20">
          {/* Top gradient bleed from ScrollScene */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
          <ValentineProposal />
        </section>
      </motion.div>
    </main>
  );
}
