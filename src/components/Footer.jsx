"use client";
import React, { useState, useEffect } from 'react';

const DINO_HEAD_BODY = [
  "        ████████    ",
  "       ██████████   ",
  "       ██████████   ",
  "       ███  █████   ",
  "       ██████████   ",
  "       ██████████   ",
  "       ████████     ",
  "       ██████       ",
  "█      ██████       ",
  "██     ██████  ██   ",
  "███    ██████████   ",
  " ██   ██████████    ",
  " ██████████████     ",
  "  ████████████      ",
  "   ██████████       ",
  "    ████████        ",
  "     ██████         "
];

const DINO_RUN1 = [
  ...DINO_HEAD_BODY,
  "      ██  ██        ",
  "      ██   █        ",
  "      ██            "
];

const DINO_RUN2 = [
  ...DINO_HEAD_BODY,
  "      ██  ██        ",
  "      █   ██        ",
  "           ██       "
];

const CACTUS = [
  "     ██     ",
  "     ██     ",
  "     ██     ",
  "█    ██     ",
  "██   ██  █  ",
  "██   ██ ██  ",
  "██████████  ",
  " ████████   ",
  "   ████     ",
  "   ████     ",
  "   ████     ",
  "   ████     "
];

const PixelSvg = ({ grid, scale = 2.5, className = "fill-on-background" }) => {
  const height = grid.length * scale;
  const width = grid[0].length * scale;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      {grid.map((row, y) => 
        row.split('').map((char, x) => 
          char !== ' ' ? <rect key={`${x}-${y}`} x={x * scale} y={y * scale} width={scale} height={scale} /> : null
        )
      )}
    </svg>
  );
};

const DinoPlanet = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Just for leg running animation
    const interval = setInterval(() => {
      setStep(s => (s === 0 ? 1 : 0));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 translate-y-[65%] md:translate-y-[70%] left-1/2 -translate-x-1/2 w-[320px] h-[320px] md:w-[600px] md:h-[600px] z-40 drop-shadow-[8px_8px_0_#1b1c15]">
      {/* The Dino */}
      <div 
        className="absolute -top-[34px] md:-top-[48px] left-1/2 z-10 animate-[planetJump_3s_linear_infinite]"
      >
        <div className="hidden md:block">
          <PixelSvg grid={step === 0 ? DINO_RUN1 : DINO_RUN2} scale={2.5} className="fill-white" />
        </div>
        <div className="block md:hidden">
          <PixelSvg grid={step === 0 ? DINO_RUN1 : DINO_RUN2} scale={1.8} className="fill-white" />
        </div>
      </div>

      {/* Spinning Container */}
      <div className="absolute inset-0 animate-[planetSpin_9s_linear_infinite]">
        {/* The Earth */}
        <div className="absolute inset-0 bg-cobalt border-[4px] md:border-[8px] border-on-background rounded-full overflow-hidden shadow-[inset_-20px_-20px_60px_rgba(0,0,0,0.4)]">
          {/* Ocean Grid Texture */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 mix-blend-overlay"></div>
          
          {/* Real World Map SVG */}
          <div className="absolute inset-[-10%] w-[120%] h-[120%] opacity-90">
            <img src="/world-map.svg" alt="" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Cactus 1 (-60deg) */}
        <div className="absolute inset-0 -rotate-[60deg]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[92%]">
            <div className="hidden md:block"><PixelSvg grid={CACTUS} scale={3} className="fill-on-background" /></div>
            <div className="block md:hidden"><PixelSvg grid={CACTUS} scale={2} className="fill-on-background" /></div>
          </div>
        </div>
        
        {/* Cactus 2 (180deg) */}
        <div className="absolute inset-0 rotate-[180deg]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[92%]">
            <div className="hidden md:block"><PixelSvg grid={CACTUS} scale={3} className="fill-on-background" /></div>
            <div className="block md:hidden"><PixelSvg grid={CACTUS} scale={2} className="fill-on-background" /></div>
          </div>
        </div>

        {/* Cactus 3 (60deg) */}
        <div className="absolute inset-0 rotate-[60deg]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[92%]">
            <div className="hidden md:block"><PixelSvg grid={CACTUS} scale={3} className="fill-on-background" /></div>
            <div className="block md:hidden"><PixelSvg grid={CACTUS} scale={2} className="fill-on-background" /></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes planetSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes planetJump {
          0%, 35%, 65%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -60px); }
        }
        @media (max-width: 768px) {
          @keyframes planetJump {
            0%, 35%, 65%, 100% { transform: translate(-50%, 0); }
            50% { transform: translate(-50%, -40px); }
          }
        }
      `}</style>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="w-full mt-stack-overlap border-t-8 border-on-background shadow-[8px_8px_0px_0px_#000000] bg-secondary text-on-secondary relative z-30 overflow-hidden">
      <DinoPlanet />
      {/* Decorative Background Starburst */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-container rotate-45 border-8 border-on-background opacity-20"></div>
      <div className="absolute left-[40%] top-10 w-12 h-12 border-t-4 border-r-4 border-cobalt rounded-tr-full -rotate-45 opacity-60"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-center w-full p-margin-mobile md:p-margin-desktop gap-gutter relative z-10">
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
          <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase mb-4 text-center md:text-left drop-shadow-[4px_4px_0_#1b1c15]">LET&apos;S BUILD SOMETHING</h2>
          <p className="font-body-lg text-body-lg mb-8 max-w-md text-center md:text-left">Ready to break the grid? Drop a line and let&apos;s get weird.</p>
          <a className="bg-primary-container text-on-background border-4 border-on-background px-8 py-4 font-headline-md text-headline-md uppercase neo-shadow neo-shadow-hover transition-all duration-150 rotate-1 inline-block" href="mailto:naman.innovates@gmail.com">
            START A PROJECT
          </a>
        </div>
        <div className="flex flex-col items-center md:items-end gap-12 w-full md:w-1/2 mt-12 mb-32 md:mb-0 md:mt-0">
          <div className="flex gap-6 flex-wrap justify-center">
            <a className="w-16 h-16 bg-background border-4 border-on-background text-on-background flex items-center justify-center neo-shadow hover:bg-cobalt hover:text-on-primary hover:rotate-6 transition-all -rotate-3 rounded-full" href="https://www.instagram.com/iamnamang/" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a className="w-16 h-16 bg-background border-4 border-on-background text-on-background flex items-center justify-center neo-shadow hover:bg-cobalt hover:text-on-primary hover:-rotate-6 transition-all rotate-3 rounded-md" href="https://github.com/namaninnovates" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.18-.3 6.74-1.54 6.74-7.95 0-1.47-.5-2.68-1.36-3.63.16-.4.59-1.72-.14-3.58 0 0-1.1-.35-3.6 1.3a12.4 12.4 0 0 0-6.6 0c-2.5-1.65-3.6-1.3-3.6-1.3-.73 1.86-.3 3.18-.14 3.58-.86.95-1.36 2.16-1.36 3.63 0 6.4 3.55 7.65 6.74 7.95-.4.3-1 .85-1.15 2.5-.5.2-1.8.65-2.65-.75-.4-.65-1-1.1-1.6-1.1-.6 0-.3.45-.15.6.3.3.9 1 1.25 1.75.5.95 1.55 1.45 2.5 1.2.1.8.1 1.8.1 2.5"/>
              </svg>
            </a>
            <a className="w-16 h-16 bg-background border-4 border-on-background text-on-background flex items-center justify-center neo-shadow hover:bg-cobalt hover:text-on-primary hover:rotate-12 transition-all -rotate-6 rounded-none" href="https://www.linkedin.com/in/namangupta30/" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a className="w-16 h-16 bg-background border-4 border-on-background text-on-background flex items-center justify-center neo-shadow hover:bg-cobalt hover:text-on-primary hover:-rotate-12 transition-all rotate-6 rounded-xl" href="mailto:naman.innovates@gmail.com" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </div>
          <div className="font-label-mono text-label-mono bg-on-background text-background px-4 py-2 border-2 border-transparent">
            © 2026 NAMAN GUPTA
          </div>
        </div>
      </div>
    </footer>
  );
}
