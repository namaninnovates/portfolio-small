"use client";
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

export default function LenisProvider({ children }) {
  return (
    <ReactLenis root options={{ 
      lerp: 0.07,
      duration: 1.2,
      smoothWheel: true, 
      syncTouch: true,
      syncTouchLerp: 0.04,
      touchInertiaMultiplier: 35,
      wheelMultiplier: 1,
      infinite: false,
      autoResize: true,
    }}>
      {children}
    </ReactLenis>
  );
}
