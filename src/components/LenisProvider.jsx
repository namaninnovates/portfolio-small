"use client";
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

export default function LenisProvider({ children }) {
  return (
    <ReactLenis root options={{ 
      lerp: 0.1,
      smoothWheel: true, 
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchInertiaMultiplier: 35,
      touchMultiplier: 2.5,
      wheelMultiplier: 1,
      infinite: false,
      autoResize: true,
    }}>
      {children}
    </ReactLenis>
  );
}
