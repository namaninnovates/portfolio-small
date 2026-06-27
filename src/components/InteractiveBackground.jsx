"use client";
import { useEffect, useRef, useCallback } from "react";
import { useLenis } from 'lenis/react';

export default function InteractiveBackground() {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const lensRef = useRef(null);
  const glowRef = useRef(null);
  const cloudRefs = useRef([]);
  
  // Store values in refs to avoid re-renders
  const cursorPosRef = useRef({ x: -100, y: -100 });
  const isHoveringRef = useRef(false);
  const cursorColorRef = useRef('var(--color-primary-container)');
  const scrollYRef = useRef(0);

  // Cloud configuration — static, never changes
  const CLOUDS = [
    // Background layer (z-0)
    { speed: -0.1, top: 10, left: 5, scale: 0.8 },
    { speed: -0.2, top: 45, left: 80, scale: 1.2 },
    { speed: -0.15, top: 75, left: 20, scale: 0.9 },
    { speed: -0.25, top: 110, left: 60, scale: 1.1 },
    { speed: -0.1, top: 180, left: 15, scale: 0.85 },
    { speed: -0.2, top: 240, left: 75, scale: 1.1 },
    { speed: -0.15, top: 320, left: 35, scale: 0.9 },
    { speed: -0.25, top: 400, left: 65, scale: 1.15 },
    // Foreground layer (z-20) — indices 8-14
    { speed: -0.4, top: 30, left: 65, scale: 1.5 },
    { speed: -0.5, top: 90, left: 10, scale: 1.3 },
    { speed: -0.6, top: 150, left: 75, scale: 1.6 },
    { speed: -0.45, top: 210, left: 55, scale: 1.4 },
    { speed: -0.55, top: 280, left: 25, scale: 1.2 },
    { speed: -0.5, top: 360, left: 85, scale: 1.5 },
    { speed: -0.6, top: 440, left: 15, scale: 1.3 },
  ];

  // Update cloud positions directly in DOM — no React re-renders
  const updateClouds = useCallback((scrollY) => {
    for (let i = 0; i < CLOUDS.length; i++) {
      const el = cloudRefs.current[i];
      if (!el) continue;
      el.style.transform = `scale(${CLOUDS[i].scale}) translate3d(0, ${scrollY * CLOUDS[i].speed}px, 0)`;
    }
  }, []);

  // Update cursor elements directly in DOM — no React re-renders
  const updateCursor = useCallback(() => {
    const { x, y } = cursorPosRef.current;
    const hovering = isHoveringRef.current;
    const color = cursorColorRef.current;
    
    if (cursorRef.current) {
      cursorRef.current.style.transform = 
        `translate(${x - 2}px, ${y - 2}px) ${hovering ? 'scale(1.2) rotate(-15deg)' : 'scale(1)'}`;
      const svg = cursorRef.current.querySelector('svg');
      if (svg) svg.style.fill = color;
    }
    
    if (lensRef.current) {
      lensRef.current.style.backgroundPosition = `-${x * 0.1}px -${y * 0.1}px`;
      lensRef.current.style.WebkitMaskImage = `radial-gradient(circle 200px at ${x}px ${y}px, black 30%, transparent 100%)`;
      lensRef.current.style.maskImage = `radial-gradient(circle 200px at ${x}px ${y}px, black 30%, transparent 100%)`;
    }
    
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle 180px at ${x}px ${y}px, var(--color-primary-container), transparent 100%)`;
    }
  }, []);

  // Use Lenis scroll callback instead of window scroll event
  // This is already synced to rAF so it's perfectly smooth
  useLenis(({ scroll }) => {
    scrollYRef.current = scroll;
    updateClouds(scroll);
  });

  useEffect(() => {
    let pointerRaf;
    
    const handlePointerMove = (e) => {
      cursorPosRef.current = { x: e.clientX, y: e.clientY };
      
      const target = e.target;
      isHoveringRef.current = target.closest('a, button, input, select, textarea, [role="button"], label') !== null;

      // Dynamic cursor color
      if (target.closest('.bg-primary-container, .bg-primary')) {
        cursorColorRef.current = 'var(--color-cobalt)';
      } else if (target.closest('.bg-secondary-container, .bg-secondary')) {
        cursorColorRef.current = 'var(--color-primary-container)';
      } else if (target.closest('.bg-cobalt')) {
        cursorColorRef.current = 'var(--color-secondary-container)';
      } else if (target.closest('.bg-on-background')) {
        cursorColorRef.current = 'var(--color-primary-container)';
      } else {
        cursorColorRef.current = 'var(--color-primary-container)';
      }

      // Batch DOM writes into a single rAF
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      pointerRaf = requestAnimationFrame(updateCursor);
    };

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      let normX = Math.max(-1, Math.min(1, e.gamma / 45));
      let normY = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
      
      cursorPosRef.current = { 
        x: window.innerWidth / 2 + normX * (window.innerWidth / 2), 
        y: window.innerHeight / 2 + normY * (window.innerHeight / 2) 
      };

      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      pointerRaf = requestAnimationFrame(updateCursor);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("deviceorientation", handleOrientation);
    
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleOrientation);
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
    };
  }, [updateCursor]);

  return (
    <>
      {/* Base Grid Background & Clouds */}
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[-1] bg-background overflow-hidden">
        
        {/* Background Clouds (z-0) */}
        {CLOUDS.slice(0, 8).map((cloud, i) => (
          <div
            key={i}
            ref={el => cloudRefs.current[i] = el}
            className="absolute pointer-events-none z-0 will-change-transform"
            style={{
              top: `${cloud.top}%`,
              left: `${cloud.left}%`,
              transform: `scale(${cloud.scale}) translate3d(0, 0, 0)`,
            }}
          >
            <svg width="150" height="90" viewBox="0 0 100 60" fill="var(--color-surface-container-high)" stroke="var(--color-on-background)" strokeWidth="3" style={{ filter: 'drop-shadow(4px 4px 0px #1b1c15)' }}>
              <path d="M20 30 Q 20 10 40 10 Q 50 -10 70 10 Q 90 10 90 30 Q 100 30 100 45 Q 100 60 80 60 L 20 60 Q 0 60 0 45 Q 0 30 20 30 Z" strokeLinejoin="round" />
            </svg>
          </div>
        ))}

        {/* Normal Grid Layer */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.70] z-10"></div>

        {/* Foreground Clouds (z-20) — move faster */}
        {CLOUDS.slice(8).map((cloud, i) => (
          <div
            key={i + 8}
            ref={el => cloudRefs.current[i + 8] = el}
            className="absolute pointer-events-none z-20 will-change-transform"
            style={{
              top: `${cloud.top}%`,
              left: `${cloud.left}%`,
              transform: `scale(${cloud.scale}) translate3d(0, 0, 0)`,
            }}
          >
            <svg width="150" height="90" viewBox="0 0 100 60" fill="var(--color-surface-container-high)" stroke="var(--color-on-background)" strokeWidth="3" style={{ filter: 'drop-shadow(4px 4px 0px #1b1c15)' }}>
              <path d="M20 30 Q 20 10 40 10 Q 50 -10 70 10 Q 90 10 90 30 Q 100 30 100 45 Q 100 60 80 60 L 20 60 Q 0 60 0 45 Q 0 30 20 30 Z" strokeLinejoin="round" />
            </svg>
          </div>
        ))}

        {/* Warped/Magnified Lens Layer on Mouse Cursor */}
        <div 
          ref={lensRef}
          className="hidden md:block absolute inset-0 bg-grid-pattern opacity-100 z-30"
          style={{
            backgroundSize: '80px 80px',
            backgroundPosition: '0px 0px',
            WebkitMaskImage: `radial-gradient(circle 200px at -1000px -1000px, black 30%, transparent 100%)`,
            maskImage: `radial-gradient(circle 200px at -1000px -1000px, black 30%, transparent 100%)`,
          }}
        ></div>
        
        {/* Glow behind the lens */}
        <div 
          ref={glowRef}
          className="hidden md:block absolute inset-0 opacity-80 mix-blend-overlay z-30"
          style={{
            background: `radial-gradient(circle 180px at -1000px -1000px, var(--color-primary-container), transparent 100%)`
          }}
        ></div>
      </div>

      {/* Custom Pointy Arrow Cursor */}
      <div 
        ref={cursorRef}
        className="hidden md:flex fixed top-0 left-0 pointer-events-none z-[9999] items-center justify-center"
        style={{ 
          transform: `translate(-100px, -100px)`,
          transformOrigin: 'top left',
          filter: 'drop-shadow(4px 4px 0px #1b1c15)',
          willChange: 'transform',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--color-primary-container)" stroke="var(--color-on-background)" strokeWidth="2" style={{ transition: 'fill 0.15s ease-out' }}>
          {/* Custom arrow shape starting at 2,2 */}
          <path d="M2 2l7.07 16.97 2.51-7.39 7.39-2.51L2 2z" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
}
