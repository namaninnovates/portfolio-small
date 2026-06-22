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

const PixelSvg = ({ grid, scale = 2.5 }) => {
  const height = grid.length * scale;
  const width = grid[0].length * scale;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="fill-on-background">
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
    <div className="absolute bottom-8 right-4 md:bottom-12 md:right-12 w-32 h-32 md:w-48 md:h-48 z-40 drop-shadow-[6px_6px_0_#1b1c15]">
      {/* The Dino */}
      <div 
        className="absolute -top-[28px] md:-top-[42px] left-1/2 z-10 animate-[planetJump_3s_linear_infinite]"
      >
        <div className="hidden md:block">
          <PixelSvg grid={step === 0 ? DINO_RUN1 : DINO_RUN2} scale={2} />
        </div>
        <div className="block md:hidden">
          <PixelSvg grid={step === 0 ? DINO_RUN1 : DINO_RUN2} scale={1.5} />
        </div>
      </div>

      {/* Spinning Container */}
      <div className="absolute inset-0 animate-[planetSpin_6s_linear_infinite]">
        {/* The Earth */}
        <div className="absolute inset-0 bg-cobalt border-[4px] md:border-[6px] border-on-background rounded-full overflow-hidden">
          {/* Continents */}
          <div className="absolute top-2 left-2 md:top-4 md:left-4 w-10 h-6 md:w-16 md:h-10 bg-primary-container rounded-lg md:rounded-xl border-[2px] md:border-[4px] border-on-background"></div>
          <div className="absolute bottom-4 right-6 md:bottom-6 md:right-8 w-12 h-8 md:w-20 md:h-12 bg-primary-container rounded-xl md:rounded-[20px] border-[2px] md:border-[4px] border-on-background"></div>
          <div className="absolute top-12 left-16 md:top-20 md:left-24 w-8 h-8 md:w-12 md:h-12 bg-primary-container rounded-full border-[2px] md:border-[4px] border-on-background"></div>
        </div>

        {/* Cactus 1 (Starts Right/90deg) */}
        <div className="absolute top-1/2 right-0 translate-x-[85%] -translate-y-1/2 rotate-90">
          <div className="hidden md:block"><PixelSvg grid={CACTUS} scale={2} /></div>
          <div className="block md:hidden"><PixelSvg grid={CACTUS} scale={1.5} /></div>
        </div>
        
        {/* Cactus 2 (Starts Left/270deg) */}
        <div className="absolute top-1/2 left-0 -translate-x-[85%] -translate-y-1/2 -rotate-90">
          <div className="hidden md:block"><PixelSvg grid={CACTUS} scale={2.5} /></div>
          <div className="block md:hidden"><PixelSvg grid={CACTUS} scale={1.8} /></div>
        </div>
      </div>

      <style>{`
        @keyframes planetSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
    <footer className="w-full mt-stack-overlap border-t-8 border-on-background shadow-[8px_8px_0px_0px_#000000] bg-secondary text-on-secondary relative z-30" style={{ overflowX: 'clip' }}>
      <DinoPlanet />
      {/* Decorative Background Starburst */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-container rotate-45 border-8 border-on-background opacity-20"></div>
      <div className="absolute left-[40%] top-10 w-12 h-12 border-t-4 border-r-4 border-cobalt rounded-tr-full -rotate-45 opacity-60"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-center w-full p-margin-mobile md:p-margin-desktop gap-gutter relative z-10">
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
          <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase mb-4 text-center md:text-left drop-shadow-[4px_4px_0_#1b1c15]">LET&apos;S BUILD SOMETHING</h2>
          <p className="font-body-lg text-body-lg mb-8 max-w-md text-center md:text-left">Ready to break the grid? Drop a line and let&apos;s get weird.</p>
          <a className="bg-primary-container text-on-background border-4 border-on-background px-8 py-4 font-headline-md text-headline-md uppercase neo-shadow neo-shadow-hover transition-all duration-150 rotate-1 inline-block" href="mailto:hello@neobrutalist.com">
            START A PROJECT
          </a>
        </div>
        <div className="flex flex-col items-center md:items-end gap-12 w-full md:w-1/2 mt-12 md:mt-0">
          <div className="flex gap-6 flex-wrap justify-center">
            <a className="w-16 h-16 bg-background border-4 border-on-background text-on-background flex items-center justify-center neo-shadow hover:bg-cobalt hover:text-on-primary hover:rotate-6 transition-all -rotate-3 rounded-full" href="#">
              <span className="font-label-mono font-bold text-xl">X</span>
            </a>
            <a className="w-16 h-16 bg-background border-4 border-on-background text-on-background flex items-center justify-center neo-shadow hover:bg-cobalt hover:text-on-primary hover:-rotate-6 transition-all rotate-3 rounded-md" href="#">
              <span className="font-label-mono font-bold text-xl">GH</span>
            </a>
            <a className="w-16 h-16 bg-background border-4 border-on-background text-on-background flex items-center justify-center neo-shadow hover:bg-cobalt hover:text-on-primary hover:rotate-12 transition-all -rotate-6 rounded-none" href="#">
              <span className="font-label-mono font-bold text-xl">IN</span>
            </a>
          </div>
          <div className="font-label-mono text-label-mono bg-on-background text-background px-4 py-2 border-2 border-transparent">
            © 2024 NEOBRUTALIST ARCHIVE
          </div>
        </div>
      </div>
    </footer>
  );
}
