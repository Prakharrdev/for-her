'use client';

import React, { useEffect, useRef, useCallback } from 'react';

export default function SakuraCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });

  const onMove = useCallback((e: MouseEvent) => {
    pos.current.x = e.clientX;
    pos.current.y = e.clientY;
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
      cursorRef.current.style.opacity = '1';
    }
  }, []);

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const hide = () => { if (cursorRef.current) cursorRef.current.style.opacity = '0'; };
    const show = () => { if (cursorRef.current) cursorRef.current.style.opacity = '1'; };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
    };
  }, [onMove]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        willChange: 'transform',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/sakura-cursor.png"
        alt=""
        width={40}
        height={40}
        draggable={false}
        style={{ display: 'block' }}
      />
    </div>
  );
}
