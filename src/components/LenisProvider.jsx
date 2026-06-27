"use client";
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

export default function LenisProvider({ children }) {
  return (
    <ReactLenis root options={{ 
      lerp: 0.05, // Lower lerp makes the scroll significantly "smoother" and buttery
      smoothWheel: true, 
      smoothTouch: true, // Enables smooth scrolling for touch devices
      wheelMultiplier: 1,
      touchMultiplier: 2, // Speeds up the touch scroll so it doesn't feel sluggish
      infinite: false
    }}>
      {children}
    </ReactLenis>
  );
}
