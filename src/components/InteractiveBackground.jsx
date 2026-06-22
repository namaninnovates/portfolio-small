"use client";
import { useState, useEffect } from "react";

export default function InteractiveBackground() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handlePointerMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const target = e.target;
      setIsHovering(window.getComputedStyle(target).cursor === 'pointer');
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      let normX = Math.max(-1, Math.min(1, e.gamma / 45));
      let normY = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
      
      setCursorPos({ 
        x: window.innerWidth / 2 + normX * (window.innerWidth / 2), 
        y: window.innerHeight / 2 + normY * (window.innerHeight / 2) 
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("deviceorientation", handleOrientation);
    
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Neobrutalist Cloud SVG Component
  const Cloud = ({ speed, top, left, scale, z }) => (
    <div 
      className={`absolute pointer-events-none ${z}`}
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `scale(${scale}) translateY(${scrollY * speed}px)`,
        // remove transition so it sticks tightly to scroll
      }}
    >
      <svg width="150" height="90" viewBox="0 0 100 60" fill="var(--color-surface-container-high)" stroke="var(--color-on-background)" strokeWidth="3" style={{ filter: 'drop-shadow(4px 4px 0px #1b1c15)' }}>
        <path d="M20 30 Q 20 10 40 10 Q 50 -10 70 10 Q 90 10 90 30 Q 100 30 100 45 Q 100 60 80 60 L 20 60 Q 0 60 0 45 Q 0 30 20 30 Z" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <>
      {/* Base Grid Background & Clouds */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-background overflow-hidden">
        
        {/* Parallax Clouds (Background layer) */}
        <Cloud speed={-0.1} top={10} left={5} scale={0.8} z="z-0" />
        <Cloud speed={-0.2} top={45} left={80} scale={1.2} z="z-0" />
        <Cloud speed={-0.15} top={75} left={20} scale={0.9} z="z-0" />
        <Cloud speed={-0.25} top={110} left={60} scale={1.1} z="z-0" />
        {/* Deep Scroll Clouds */}
        <Cloud speed={-0.1} top={180} left={15} scale={0.85} z="z-0" />
        <Cloud speed={-0.2} top={240} left={75} scale={1.1} z="z-0" />
        <Cloud speed={-0.15} top={320} left={35} scale={0.9} z="z-0" />
        <Cloud speed={-0.25} top={400} left={65} scale={1.15} z="z-0" />

        {/* Normal Grid Layer */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.70] z-10"></div>

        {/* Parallax Clouds (Foreground layer - move faster) */}
        <Cloud speed={-0.4} top={30} left={65} scale={1.5} z="z-20" />
        <Cloud speed={-0.5} top={90} left={10} scale={1.3} z="z-20" />
        <Cloud speed={-0.6} top={150} left={75} scale={1.6} z="z-20" />
        {/* Deep Scroll Clouds */}
        <Cloud speed={-0.45} top={210} left={55} scale={1.4} z="z-20" />
        <Cloud speed={-0.55} top={280} left={25} scale={1.2} z="z-20" />
        <Cloud speed={-0.5} top={360} left={85} scale={1.5} z="z-20" />
        <Cloud speed={-0.6} top={440} left={15} scale={1.3} z="z-20" />

        {/* Warped/Magnified Lens Layer on Mouse Cursor */}
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-100 transition-none z-30"
          style={{
            backgroundSize: '80px 80px', // EXTREME warp size
            backgroundPosition: `-${cursorPos.x * 0.1}px -${cursorPos.y * 0.1}px`, // more parallax drag
            WebkitMaskImage: `radial-gradient(circle 200px at ${cursorPos.x}px ${cursorPos.y}px, black 30%, transparent 100%)`,
            maskImage: `radial-gradient(circle 200px at ${cursorPos.x}px ${cursorPos.y}px, black 30%, transparent 100%)`,
          }}
        ></div>
        
        {/* Glow behind the lens to accentuate the warp */}
        <div 
          className="absolute inset-0 transition-none opacity-80 mix-blend-overlay z-30"
          style={{
            background: `radial-gradient(circle 180px at ${cursorPos.x}px ${cursorPos.y}px, var(--color-primary-container), transparent 100%)`
          }}
        ></div>
      </div>

      {/* Custom Pointy Arrow Cursor */}
      <div 
        className={`fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center transition-transform duration-75 ease-out`}
        style={{ 
          transform: `translate(${cursorPos.x - 2}px, ${cursorPos.y - 2}px) ${isHovering ? 'scale(1.2) rotate(-15deg)' : 'scale(1)'}`,
          transformOrigin: 'top left',
          filter: 'drop-shadow(4px 4px 0px #1b1c15)'
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--color-primary-container)" stroke="var(--color-on-background)" strokeWidth="2">
          {/* Custom arrow shape starting at 2,2 */}
          <path d="M2 2l7.07 16.97 2.51-7.39 7.39-2.51L2 2z" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
}
