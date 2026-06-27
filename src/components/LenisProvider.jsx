"use client";
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

export default function LenisProvider({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, syncTouch: true }}>
      {children}
    </ReactLenis>
  );
}
