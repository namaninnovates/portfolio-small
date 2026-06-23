"use client";
import { useState, useRef } from "react";

const PhysicsCard = ({ children, baseRotate, bgClass, textClass }) => {
  const ref = useRef(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // max tilt 20 deg
    setRot({ x: -(y / (rect.height / 2)) * 20, y: (x / (rect.width / 2)) * 20 });
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => { setHover(false); setRot({ x: 0, y: 0 }); }}
      className={`w-64 border-4 border-on-background px-8 py-4 neo-shadow font-headline-md uppercase text-center cursor-none ${bgClass} ${textClass || "text-on-background"}`}
      style={{
        transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
        transform: `perspective(1000px) rotateX(${hover ? rot.x : 0}deg) rotateY(${hover ? rot.y : 0}deg) rotateZ(${hover ? 0 : baseRotate}deg) scale(${hover ? 1.05 : 1})`,
        transformStyle: 'preserve-3d'
      }}
    >
      <div style={{ 
        transform: hover ? 'translateZ(40px)' : 'translateZ(0px)', 
        transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        pointerEvents: 'none'
      }}>
        {children}
      </div>
    </div>
  );
};

export default function Stats() {
  return (
    <section className="w-full bg-background py-16 px-margin-mobile md:px-margin-desktop border-b-4 border-on-background relative z-20">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 perspective-[2000px]">
        <PhysicsCard baseRotate={-3} bgClass="bg-primary-container">
          <span className="block text-4xl mb-2 drop-shadow-[2px_2px_0_rgba(27,28,21,0.2)]">100+</span>
          <span className="text-xl drop-shadow-[2px_2px_0_rgba(27,28,21,0.2)]">PROJECTS SHIPPED</span>
        </PhysicsCard>
        
        <PhysicsCard baseRotate={2} bgClass="bg-secondary-container" textClass="text-on-secondary">
          <span className="block text-4xl mb-2 drop-shadow-[2px_2px_0_rgba(27,28,21,0.5)]">6+</span>
          <span className="text-xl drop-shadow-[2px_2px_0_rgba(27,28,21,0.5)]">YEARS</span>
        </PhysicsCard>
        
        <PhysicsCard baseRotate={-2} bgClass="bg-cobalt" textClass="text-on-primary">
          <span className="block text-4xl mb-2 drop-shadow-[2px_2px_0_rgba(27,28,21,0.5)]">8</span>
          <span className="text-xl drop-shadow-[2px_2px_0_rgba(27,28,21,0.5)]">TOOLS MASTERED</span>
        </PhysicsCard>
        
        <PhysicsCard baseRotate={3} bgClass="bg-primary-container">
          <span className="block text-4xl mb-2 drop-shadow-[2px_2px_0_rgba(27,28,21,0.2)]">100%</span>
          <span className="text-xl drop-shadow-[2px_2px_0_rgba(27,28,21,0.2)]">RELENTLESS</span>
        </PhysicsCard>
      </div>
    </section>
  );
}
