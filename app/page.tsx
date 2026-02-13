'use client';

import { useRef } from 'react';
import ScrollScene from "@/app/components/ScrollScene";
import ValentineProposal from "@/app/components/ValentineProposal";
import Prologue from "@/app/components/sections/Prologue";
import TransitionText from "@/app/components/sections/TransitionText";
import AudioPlayer from "@/app/components/ui/AudioPlayer";
import SakuraCursor from "@/app/components/ui/SakuraCursor";

export default function Home() {
  const scrollSceneRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen bg-black">
      {/* Custom sakura cursor */}
      <SakuraCursor />

      {/* Audio — fullscreen prompt + persistent mini player */}
      <AudioPlayer />

      {/* Scroll‑driven date overlay (fixed, z‑22) */}
      <TransitionText containerRef={scrollSceneRef} />

      {/* Act I — Animated Prologue */}
      <Prologue />

      {/* Act II — Canvas / Video / Branch scroll experience */}
      <div ref={scrollSceneRef}>
        <ScrollScene />
      </div>

      {/* Act III — Finale */}
      <section className="relative z-20 bg-black/50 backdrop-blur-sm">
        <ValentineProposal />
      </section>
    </main>
  );
}
