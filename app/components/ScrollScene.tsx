'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import BranchOverlay from './BranchOverlay';

const GENESIS_FRAME_COUNT = 200;
const TRANSITION_FRAME_COUNT = 134; // Only use first 134 frames
const TEXT_PAUSE_DURATION = 120; // Hold frame for text display (extra scroll distance)
const END_FRAME_COUNT = 200;
const END_LOOP_COUNT = 4; // End sequence loops 4 times
// Logical frame count includes Genesis + Transition + Text Pause + End loops
const LOGICAL_FRAME_COUNT = GENESIS_FRAME_COUNT + TRANSITION_FRAME_COUNT + TEXT_PAUSE_DURATION + (END_FRAME_COUNT * END_LOOP_COUNT);
// Actual loaded frames (End is only loaded once, text pause reuses last transition frame)
const TOTAL_FRAME_COUNT = GENESIS_FRAME_COUNT + TRANSITION_FRAME_COUNT + END_FRAME_COUNT;
const SCROLL_HEIGHT = 55000; // Extended for 1254 logical frames (200 + 134 + 120 + 800) - ~44px per frame

export default function ScrollScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Use a ref to store images for immediate access during scroll without re-renders
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Framer Motion scroll tracking - use window scroll to avoid hydration issues
  const { scrollY } = useScroll();
  
  // Manual scroll progress calculation based on container position
  const scrollYProgress = useTransform(scrollY, (latest) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollableHeight = rect.height - window.innerHeight;
    const scrolled = -rect.top;
    return Math.max(0, Math.min(1, scrolled / scrollableHeight));
  });

  // Calculate scroll positions for text pause section
  const textPauseStart = (GENESIS_FRAME_COUNT + TRANSITION_FRAME_COUNT) / LOGICAL_FRAME_COUNT;
  const textPauseEnd = (GENESIS_FRAME_COUNT + TRANSITION_FRAME_COUNT + TEXT_PAUSE_DURATION) / LOGICAL_FRAME_COUNT;
  
  // Canvas scale during text pause: scale up to fill screen with petal
  const canvasScale = useTransform(scrollYProgress, 
    [textPauseStart - 0.02, textPauseStart + 0.02], 
    [1.0, 1.4]
  );
  
  // Canvas opacity: Fade out during text pause, stay hidden (video takes over)
  const canvasOpacity = useTransform(scrollYProgress, 
    [textPauseStart - 0.02, textPauseStart, 0.99], 
    [1, 0, 0]
  );

  // Video opacity: Fade in after text disappears, stay visible for the rest
  const videoOpacity = useTransform(scrollYProgress,
    [textPauseEnd, textPauseEnd + 0.03],
    [0, 1]
  );
  
  // Text opacity: Fade in during text pause section
  const textOpacity = useTransform(scrollYProgress, 
    [textPauseStart + 0.01, textPauseStart + 0.05, textPauseEnd - 0.03, textPauseEnd], 
    [0, 1, 1, 0]
  );
  
  // Title fade out opacity (early in scroll)
  const titleOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  // Preload images
  useEffect(() => {
    let isMounted = true;
    const loadImages = async () => {
      // Create a large array to hold all frames from both scenes
      const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAME_COUNT).fill(null);
      let loadedCount = 0;

      const promises = Array.from({ length: TOTAL_FRAME_COUNT }, (_, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          
          let src = '';
          if (i < GENESIS_FRAME_COUNT) {
            // Genesis frames: 1 to 200
            const frameIndex = (i + 1).toString().padStart(3, '0');
            src = `/genesis/ezgif-frame-${frameIndex}.jpg`;
          } else if (i < GENESIS_FRAME_COUNT + TRANSITION_FRAME_COUNT) {
            // Transition frames: 201 to 400
            const frameIndex = (i - GENESIS_FRAME_COUNT + 1).toString().padStart(3, '0');
            src = `/Transition/ezgif-frame-${frameIndex}.jpg`;
          } else {
            // End frames: 401 to 600
            const frameIndex = (i - GENESIS_FRAME_COUNT - TRANSITION_FRAME_COUNT + 1).toString().padStart(3, '0');
            src = `/end/ezgif-frame-${frameIndex}.jpg`;
          }

          img.src = src;
          
          img.onload = () => {
            if (!isMounted) return;
            loadedImages[i] = img;
            loadedCount++;
            setLoadingProgress(Math.round((loadedCount / TOTAL_FRAME_COUNT) * 100));
            resolve();
          };
          
          img.onerror = () => {
            console.warn(`Failed to load frame ${src}`);
            // Resolve anyway to not break Promise.all
            resolve();
          };
        });
      });

      await Promise.all(promises);
      
      if (isMounted) {
        // Keep all images including nulls to preserve frame indices
        // This prevents jumps caused by index shifting
        imagesRef.current = loadedImages;
        setIsReady(true);
      }
    };

    loadImages();
    return () => { isMounted = false; };
  }, []);

  // Handle scroll and drawing
  useEffect(() => {
    if (!isReady || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: alpha false
    if (!ctx) return;

    let animationFrameId: number;
    // We use a float for the current frame to support smooth interpolation
    let currentFrameVal = 0; 

    // Map logical frame index to actual loaded frame index
    const getActualFrameIndex = (logicalIndex: number): number => {
        const flooredIndex = Math.floor(logicalIndex);
        
        if (flooredIndex < GENESIS_FRAME_COUNT) {
            // Genesis: frames 0-199 map directly
            return flooredIndex;
        } else if (flooredIndex < GENESIS_FRAME_COUNT + TRANSITION_FRAME_COUNT) {
            // Transition: frames 200-333 (only 134 frames)
            return flooredIndex;
        } else if (flooredIndex < GENESIS_FRAME_COUNT + TRANSITION_FRAME_COUNT + TEXT_PAUSE_DURATION) {
            // Text Pause: frames 334-453 - hold at last transition frame (frame 333)
            return GENESIS_FRAME_COUNT + TRANSITION_FRAME_COUNT - 1;
        } else {
            // End: logical frames 454-1253 map to actual frames 334-533 (looping 4 times)
            const endLogicalIndex = flooredIndex - GENESIS_FRAME_COUNT - TRANSITION_FRAME_COUNT - TEXT_PAUSE_DURATION;
            const endActualIndex = endLogicalIndex % END_FRAME_COUNT;
            return GENESIS_FRAME_COUNT + TRANSITION_FRAME_COUNT + endActualIndex;
        }
    };

    // Helper to draw image 'cover' style
    const drawImage = (logicalIndex: number) => {
        // Map logical index to actual frame index
        const actualIndex = getActualFrameIndex(logicalIndex);
        const safeIndex = Math.max(0, Math.min(actualIndex, imagesRef.current.length - 1));
        const img = imagesRef.current[safeIndex];
        // Skip drawing if image failed to load
        if (!img) {
            console.warn(`Skipping null frame at logical index ${logicalIndex}, actual index ${safeIndex}`);
            return;
        }

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // Calculate aspect ratios
        const imgRatio = img.width / img.height;
        const canvasRatio = canvasWidth / canvasHeight;
        
        let renderWidth, renderHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            renderWidth = canvasWidth;
            renderHeight = canvasWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvasHeight - renderHeight) / 2;
        } else {
            renderWidth = canvasHeight * imgRatio;
            renderHeight = canvasHeight;
            offsetX = (canvasWidth - renderWidth) / 2;
            offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
    };

    const render = () => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const scrollDist = -rect.top;
        const maxScroll = rect.height - viewportHeight;
        
        if (maxScroll <= 0) {
            animationFrameId = requestAnimationFrame(render);
            return;
        }

        let progress = scrollDist / maxScroll;
        progress = Math.max(0, Math.min(1, progress));
        
        // Use LOGICAL_FRAME_COUNT which includes 4x loops of End sequence
        const targetFrameIndex = progress * (LOGICAL_FRAME_COUNT - 1);
        
        // Linear Interpolation (Lerp) for smoothness
        // The ease factor determines the "heaviness" or "butteryness". 
        // Lower = smoother/slower, Higher = snappier.
        const ease = 0.15; 
        currentFrameVal += (targetFrameIndex - currentFrameVal) * ease;
        
        // Snap to target if very close to stop micro-calculations
        if (Math.abs(targetFrameIndex - currentFrameVal) < 0.01) {
            currentFrameVal = targetFrameIndex;
        }

        drawImage(currentFrameVal);
        
        animationFrameId = requestAnimationFrame(render);
    };

    // Set initial canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Force immediate redraw of current state
      drawImage(currentFrameVal);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size
    
    // Start render loop
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isReady]);

  // Infinite scroll: Loop back to the beginning when reaching the end
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    let isLooping = false;

    const handleScroll = () => {
      if (!containerRef.current || isLooping) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = scrolled / scrollableHeight;

      // When we reach 99.5% of the scroll, loop back instantly
      if (progress >= 0.995) {
        isLooping = true;
        // Scroll back to the start of the container
        const containerTop = rect.top + window.scrollY;
        window.scrollTo({
          top: containerTop + 1, // Start slightly past top to avoid triggering again
          behavior: 'instant' as ScrollBehavior
        });
        // Reset flag after a brief delay
        setTimeout(() => {
          isLooping = false;
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  if (!isReady) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,105,180,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Sakura petal icon */}
        <motion.div
          className="mb-8 text-pink-300/40"
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 30 30" width={24} height={24} fill="currentColor">
            <path d="M15 2 C18 8, 26 10, 28 15 C26 20, 18 22, 15 28 C12 22, 4 20, 2 15 C4 10, 12 8, 15 2Z" />
          </svg>
        </motion.div>

        {/* Title */}
        <p
          className="text-sm md:text-base mb-6 font-light tracking-[0.25em] uppercase"
          style={{
            background: 'linear-gradient(135deg, #FFE5E5 0%, #FFB6C1 50%, #FFE5E5 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 4s ease-in-out infinite',
          }}
        >
          Loading Memories
        </p>

        {/* Progress bar */}
        <div className="w-48 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${loadingProgress}%`,
              background: 'linear-gradient(90deg, rgba(255,182,193,0.4), rgba(255,105,180,0.7))',
              boxShadow: '0 0 8px rgba(255,105,180,0.4)',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        <p className="text-[10px] mt-3 text-pink-200/20 tracking-widest">{loadingProgress}%</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: `${SCROLL_HEIGHT}px` }} className="relative bg-black">
      {/* Top gradient — seamless blend from Prologue */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-30" />
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        
        {/* Background Video Layer — loops after text fades out, z-index: 5 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: videoOpacity, zIndex: 5 }}
        >
          <video
            ref={videoRef}
            className="min-w-full min-h-full object-cover"
            style={{ transform: 'scale(1.25)' }}
            src="/Bg-video.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </motion.div>

        {/* Canvas Layer - z-index: 10 */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            scale: canvasScale,
            opacity: canvasOpacity,
            zIndex: 10
          }}
        >
          <canvas ref={canvasRef} className="block w-full h-full" />
        </motion.div>
        
        {/* Text Layer - z-index: 20 (on top of canvas) */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            opacity: textOpacity,
            zIndex: 20
          }}
        >
          <div className="text-center px-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <h1 
                className="text-6xl md:text-8xl lg:text-9xl font-playfair font-light tracking-wide mb-4"
                style={{
                  background: 'linear-gradient(135deg, #FFE5E5 0%, #FFB6C1 25%, #FFC0CB 50%, #FFB6C1 75%, #FFE5E5 100%)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 40px rgba(255, 182, 193, 0.5)',
                  animation: 'shimmer 4s ease-in-out infinite',
                  letterSpacing: '0.05em'
                }}
              >
                This is where it all started
              </h1>
              <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-pink-200/50 to-transparent mt-8" />
              <p className="text-xl md:text-2xl font-cormorant text-pink-100/80 mt-8 font-light italic">
                A moment frozen in time
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Title overlay (early in scroll) */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            opacity: titleOpacity,
            zIndex: 15
          }}
        >
          <h1 className="text-4xl md:text-6xl text-white font-thin mix-blend-difference tracking-widest">
            ETERNAL SAKURA
          </h1>
        </motion.div>

        {/* Memory Lane Branch Overlay — grows after text fades out */}
        <BranchOverlay
          scrollYProgress={scrollYProgress}
          branchStart={textPauseEnd + 0.16}
          branchEnd={0.92}
        />
      </div>

      {/* Bottom gradient — seamless blend into Finale */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-30" />
    </div>
  );
}
