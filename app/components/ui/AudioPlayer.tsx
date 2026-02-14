'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
  onStart?: () => void;
}

export default function AudioPlayer({ onStart }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [mounted, setMounted] = useState(false);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // SSR hydration guard — intentional one-time setState
    if (!mounted) setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, [mounted]);

  // Lock scroll while prompt is showing
  useEffect(() => {
    if (showPrompt) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [showPrompt]);

  const startExperience = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.play().then(() => {
      setIsPlaying(true);
      setShowPrompt(false);
      onStart?.();
    }).catch(() => {
      // Autoplay blocked — user will need to click the player itself
      setShowPrompt(false);
      onStart?.();
    });
  }, [volume, onStart]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = isMuted ? 0 : volume;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, isMuted, volume]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = newVolume;
    setIsMuted(newVolume === 0);
  }, []);

  const handleVolumeHoverEnter = useCallback(() => {
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    setShowVolumeSlider(true);
  }, []);

  const handleVolumeHoverLeave = useCallback(() => {
    volumeTimeoutRef.current = setTimeout(() => setShowVolumeSlider(false), 300);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/assets/Taylor Swift Mine.mp3" loop preload="auto" />

      {/* Initial prompt overlay — liquid glass over page content */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            {/* Liquid glass blur layer */}
            <div
              className="absolute inset-0"
              style={{
                backdropFilter: 'blur(40px) saturate(1.6) brightness(0.4)',
                WebkitBackdropFilter: 'blur(40px) saturate(1.6) brightness(0.4)',
                background: 'rgba(0,0,0,0.3)',
              }}
            />

            {/* Subtle refraction highlight at top */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.15) 100%)',
              }}
            />

            {/* Centre content — just the button */}
            <div className="relative z-10 flex flex-col items-center">
              {/* CTA Button */}
              <motion.button
                className="relative cursor-pointer group"
                onClick={startExperience}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Soft pulsing glow */}
                <motion.div
                  className="absolute -inset-6 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,182,193,0.2) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div
                  className="relative px-14 py-5 rounded-full border border-white/20 text-white font-light tracking-[0.2em] text-sm md:text-base"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(30px) saturate(1.8)',
                    WebkitBackdropFilter: 'blur(30px) saturate(1.8)',
                    boxShadow:
                      '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  <span className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-pink-200/90" fill="none">
                      <path d="M8 5.14v14l11-7-11-7z" fill="currentColor" />
                    </svg>
                    Begin the Experience
                  </span>
                </div>

                {/* Hover glow ring */}
                <motion.div
                  className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,182,193,0.2) 0%, transparent 70%)',
                    filter: 'blur(14px)',
                  }}
                />
              </motion.button>
            </div>

            {/* Bottom credit */}
            <motion.div
              className="absolute bottom-8 flex items-center gap-2 text-xs text-white/20 font-light tracking-[0.15em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <span>Made by <a href="https://perkkk.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">Perk</a> with ♥</span>
              <a
                href="https://www.linkedin.com/in/prakharrdev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white/60 transition-colors"
                aria-label="Connect on LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent mini player — bottom right */}
      <AnimatePresence>
        {!showPrompt && (
          <motion.div
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-full border border-white/15"
              style={{
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Vinyl / disc icon */}
              <motion.div
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center relative overflow-hidden"
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={isPlaying ? { duration: 3, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-900/60 to-black flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-pink-300/60" />
                </div>
                {/* Grooves */}
                <div className="absolute inset-1 rounded-full border border-white/[0.06]" />
                <div className="absolute inset-2 rounded-full border border-white/[0.04]" />
              </motion.div>

              {/* Equalizer bars */}
              <div className="flex items-end gap-[2px] h-4">
                {[0, 0.15, 0.3, 0.1].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-pink-300/60"
                    animate={
                      isPlaying && !isMuted
                        ? { height: ['4px', '16px', '8px', '14px', '4px'] }
                        : { height: '4px' }
                    }
                    transition={
                      isPlaying && !isMuted
                        ? { duration: 1.2, repeat: Infinity, delay, ease: 'easeInOut' }
                        : { duration: 0.3 }
                    }
                  />
                ))}
              </div>

              {/* Play/Pause button */}
              <button
                onClick={togglePlay}
                className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M8 5.14v14l11-7-11-7z" fill="currentColor" />
                  </svg>
                )}
              </button>

              {/* Mute button + Volume slider */}
              <div
                className="relative flex items-center"
                onMouseEnter={handleVolumeHoverEnter}
                onMouseLeave={handleVolumeHoverLeave}
              >
                <button
                  onClick={toggleMute}
                  className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M16.5 12A4.5 4.5 0 0 0 14 8.18v1.7l2.4 2.4c.06-.27.1-.55.1-.84zm2 0c0 .94-.21 1.82-.58 2.62l1.28 1.28A8.94 8.94 0 0 0 20.5 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor" />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.18v7.64a4.5 4.5 0 0 0 2.5-3.82z" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.18v7.64a4.5 4.5 0 0 0 2.5-3.82zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor" />
                    </svg>
                  )}
                </button>

                {/* Volume slider popup */}
                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-4 rounded-xl border border-white/15"
                      style={{
                        background: 'rgba(0,0,0,0.55)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                      }}
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={handleVolumeHoverEnter}
                      onMouseLeave={handleVolumeHoverLeave}
                    >
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                        style={{
                          writingMode: 'vertical-lr',
                          direction: 'rtl',
                          width: '4px',
                          height: '80px',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
