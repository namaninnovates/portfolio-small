"use client";
import { useState, useEffect, useRef } from "react";
import { useLenis } from 'lenis/react';
import { SiJavascript, SiReact, SiNextdotjs, SiTailwindcss, SiNodedotjs, SiFigma } from "react-icons/si";

// --- Mario Retro Elements ---
const MarioCoin = () => (
  <div className="drop-shadow-[4px_4px_0_#1b1c15]" style={{
    width: 28, height: 36, borderRadius: '40%',
    background: 'radial-gradient(ellipse at 35% 35%, #ffe066, #e8a000)',
    border: '3px solid #b87800',
    boxShadow: 'inset -3px -3px 0 #cc8800'
  }}/>
);

const MarioPipe = () => (
  <div className="drop-shadow-[4px_4px_0_#1b1c15]" style={{ width: 48, height: 50, position: 'relative' }}>
    <div style={{ position:'absolute', top:0, left:-4, right:-4, height:16, background:'#00c800', border:'3px solid #000' }}/>
    <div style={{ position:'absolute', top:13, left:2, right:2, bottom:0, background:'#00a000', border:'3px solid #000', borderTop:'none' }}/>
    <div style={{ position:'absolute', top:0, left:6, width:4, height: '100%', background:'#fff', opacity: 0.3 }}/>
  </div>
);

const MarioBrick = () => (
  <div className="drop-shadow-[4px_4px_0_#1b1c15]" style={{
    width: 40, height: 40, background: '#c84c0c', border: '3px solid #000',
    boxShadow: 'inset 3px 3px 0 #ff9c6c, inset -3px -3px 0 #6c2400',
    display: 'flex', flexDirection: 'column', gap: 2, padding: 3
  }}>
    <div style={{ borderBottom: '2px solid #6c2400', flex: 1, display: 'flex', gap: 2 }}>
      <div style={{ borderRight: '2px solid #6c2400', flex: 1 }}/>
      <div style={{ flex: 1 }}/>
    </div>
    <div style={{ flex: 1, display: 'flex', gap: 2 }}>
      <div style={{ flex: 1 }}/>
      <div style={{ borderLeft: '2px solid #6c2400', flex: 1 }}/>
    </div>
  </div>
);

const MarioQuestion = () => (
  <div className="drop-shadow-[4px_4px_0_#1b1c15]" style={{
    width: 40, height: 40, background: '#e89000', border: '3px solid #000',
    boxShadow: 'inset 3px 3px 0 #ffc86c, inset -3px -3px 0 #885000',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 900, fontSize: 22, color: '#e89000', WebkitTextStroke: '1.5px #000', WebkitTextFillColor: '#e89000'
  }}>?</div>
);

// --- Pixel Art SVG Component ---
const PixelIcon = ({ art, color, className = "" }) => {
  const sizeX = art[0].length;
  const sizeY = art.length;
  return (
    <svg 
      viewBox={`0 0 ${sizeX} ${sizeY}`} 
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {art.map((row, y) => 
        row.split('').map((cell, x) => {
          if (cell === '.') return null;
          let fill = color;
          if (cell === 'X') fill = "#1b1c15";
          else if (cell === 'W') fill = "#ffffff";
          else if (cell === 'O') fill = "#d43f00";
          else if (cell === 'Y') fill = "#ffcc00";
          else if (cell === 'R') fill = "#f24e1e";
          else if (cell === 'F') fill = "#ff7262";
          else if (cell === 'P') fill = "#a259ff";
          else if (cell === 'B') fill = "#1abc9c";
          else if (cell === 'G') fill = "#0acf83";
          else if (cell === 'T') fill = "#38bdf8";
          else if (cell === 'A') fill = "#61dafb";
          else if (cell === 'D') fill = "#00005b";
          else if (cell === 'E') fill = "#e23237";
          else if (cell === 'C') fill = color;
          else return null;
          
          return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill} />;
        })
      )}
    </svg>
  );
};

const coffeeArt = [
  "................",
  ".....X...X......",
  "....X...X.......",
  ".....X...X......",
  "................",
  "....XXXXXXXX....",
  "...XCCCCCCCCX...",
  "...XCCCCCCCCXX..",
  "...XCCCCCCCCX.X.",
  "...XCCCCCCCCXX..",
  "...XCCCCCCCCX...",
  "....XXXXXXXX....",
  "...XCCCCCCCCX...",
  "..XCCCCCCCCCCX..",
  "..XXXXXXXXXXXX..",
  "................"
];

const hammerArt = [
  "..........XXX...",
  ".........XCCCX..",
  "........XCCCCCX.",
  ".........XCCCX.X",
  ".......XXXCCCXX.",
  "......XCCXXXXX..",
  ".....XCCX.......",
  "....XCCX........",
  "...XCCX.........",
  "..XCCX..........",
  "..XCCX..........",
  "..XXXX..........",
  "................",
  "................",
  "................",
  "................"
];

const starArt = [
  ".......XX.......",
  "......XCCX......",
  "......XCCX......",
  ".....XCCCCX.....",
  "XX..XCCCCCCX..XX",
  ".XXXXCCCCCCXXXX.",
  "..XCCCCCCCCCCX..",
  "...XCCCXXCCCX...",
  "...XCCCXXCCCX...",
  "...XCCCCCCCCX...",
  "...XCCCCCCCCX...",
  "..XCCCX..XCCCX..",
  "..XCCX....XCCX..",
  ".XXXX......XXXX.",
  "................",
  "................"
];

const rocketArt = [
  ".......XX.......",
  "......XCCX......",
  ".....XCCCCX.....",
  ".....XCWWCX.....",
  "....XCWWWWCX....",
  "....XCWCCWCX....",
  "...XCCCCCCCCX...",
  "...XCCCCCCCCX...",
  "..XCCCXXXXCCCX..",
  "..XCCX.XX.XCCX..",
  ".XCCX..XX..XCCX.",
  ".XXX...XX...XXX.",
  "......XYYX......",
  ".....XOOOOX.....",
  "......XXXX......",
  "................"
];

// --- Tech Stack Logos ---
const FloatingLogo = ({ bg, color, text, icon, rotate, positionClasses, parallaxSpeed, sizeClass = "w-14 h-14 md:w-20 md:h-20" }) => (
  <div 
    className={`absolute ${positionClasses} z-10 transition-transform duration-[400ms] md:duration-200 ease-out`}
    style={{ transform: `translate3d(calc(var(--mx, 0) * ${parallaxSpeed}px), calc(var(--my, 0) * ${parallaxSpeed}px), 0)` }}
  >
    <div className={`flex items-center justify-center border-4 border-on-background shadow-[4px_4px_0_0_#1b1c15] md:shadow-[6px_6px_0_0_#1b1c15] ${bg} ${color} ${sizeClass} ${rotate}`}>
      {text && <span className="font-sans font-bold tracking-tight text-3xl md:text-5xl leading-none">{text}</span>}
      {icon && icon}
    </div>
  </div>
);

const FigmaLogo = ({ className }) => (
  <svg viewBox="0 0 200 300" className={className}>
    <path fill="#f24e1e" d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z"/>
    <path fill="#ff7262" d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z"/>
    <path fill="#a259ff" d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z"/>
    <path fill="#1abcfe" d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z"/>
    <path fill="#0acf83" d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z"/>
  </svg>
);

export default function Hero() {
  const [isBulbHit, setIsBulbHit] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isBulbSwinging, setIsBulbSwinging] = useState(false);
  
  const heroRef = useRef(null);
  const b1Ref = useRef(null);
  const b2Ref = useRef(null);
  const b3Ref = useRef(null);
  const m1Ref = useRef(null);
  const m2Ref = useRef(null);
  const m3Ref = useRef(null);
  const roadmapSvgRef = useRef(null);
  const roadmapContainerRef = useRef(null);
  
  const activeStepRef = useRef(0);
  const bulbSwingingRef = useRef(false);
  const viewportHeightRef = useRef(1000);

  const handleBulbHit = () => {
    if (isBulbHit) return;
    setIsBulbHit(true);
    setTimeout(() => setIsBulbHit(false), 2000);
  };

  useEffect(() => {
    const handleResize = () => {
      if (heroRef.current) {
        viewportHeightRef.current = heroRef.current.clientHeight / 5;
      } else {
        viewportHeightRef.current = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    
    let pointerRaf;
    const handlePointerMove = (e) => {
      if (e.pointerType === "touch") return; 
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      pointerRaf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        if (heroRef.current) {
          heroRef.current.style.setProperty('--mx', x);
          heroRef.current.style.setProperty('--my', y);
          heroRef.current.style.setProperty('--cx', e.clientX + 'px');
          heroRef.current.style.setProperty('--cy', e.clientY + 'px');
        }
      });
    };

    let gyroRaf;
    let lastGyroTime = 0;
    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      const now = performance.now();
      if (now - lastGyroTime < 33) return;
      lastGyroTime = now;
      if (gyroRaf) cancelAnimationFrame(gyroRaf);
      gyroRaf = requestAnimationFrame(() => {
        let x = Math.max(-1, Math.min(1, e.gamma / 90)) * 0.4;
        let y = Math.max(-1, Math.min(1, (e.beta - 45) / 90)) * 0.4;
        if (heroRef.current) {
          heroRef.current.style.setProperty('--mx', x);
          heroRef.current.style.setProperty('--my', y);
        }
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("deviceorientation", handleOrientation);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleOrientation);
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      if (gyroRaf) cancelAnimationFrame(gyroRaf);
    };
  }, []);

  useLenis(({ scroll }) => {
    const rectTop = -scroll;
    let progress = 0;
    
    if (rectTop <= 0) {
      progress = Math.max(0, Math.min(5, -rectTop / viewportHeightRef.current));
    }
    
    const e1 = Math.max(0, Math.min(1, progress));
    const e2 = Math.max(0, Math.min(1, progress - 1.2));
    
    if (b1Ref.current) {
      const b1Y = -e1 * 50;
      b1Ref.current.style.transform = `translate3d(0, ${b1Y}dvh, 0)`;
      b1Ref.current.style.opacity = 1 - e1;
      b1Ref.current.style.pointerEvents = progress < 0.8 ? 'auto' : 'none';
    }

    if (b2Ref.current) {
      const b2Y = e1 < 1 ? (1 - e1) * 100 : -e2 * 50;
      b2Ref.current.style.transform = `translate3d(0, ${b2Y}dvh, 0)`;
      b2Ref.current.style.opacity = e1 < 1 ? e1 : (1 - e2);
      b2Ref.current.style.pointerEvents = (progress > 0.2 && progress < 2.0) ? 'auto' : 'none';
    }

    if (b3Ref.current) {
      b3Ref.current.style.transform = `translate3d(0, ${(1 - e2) * 100}dvh, 0)`;
      b3Ref.current.style.opacity = e2;
      b3Ref.current.style.pointerEvents = progress > 1.8 ? 'auto' : 'none';
    }

    const rp = Math.max(0, Math.min(1, (progress - 2.2) / 2.3));
    const maxScroll = typeof window !== 'undefined' && window.innerWidth < 768 ? 650 : 600;
    const isy = -rp * maxScroll;

    if (m1Ref.current) m1Ref.current.style.transform = `translate3d(calc(var(--mx, 0) * -2px), calc(var(--my, 0) * -2px), 0) translateY(${isy * 0.1}px)`;
    if (m2Ref.current) m2Ref.current.style.transform = `translate3d(calc(var(--mx, 0) * -4px), calc(var(--my, 0) * -4px), 0) translateY(${isy * 0.25}px)`;
    if (m3Ref.current) m3Ref.current.style.transform = `translate3d(calc(var(--mx, 0) * -7px), calc(var(--my, 0) * -7px), 0) translateY(${isy * 0.45}px)`;
    
    if (roadmapContainerRef.current) {
      roadmapContainerRef.current.style.transform = `translate3d(calc(var(--mx, 0) * -20px), calc(var(--my, 0) * -20px), 0) translateY(${isy}px)`;
    }

    if (roadmapSvgRef.current) {
      roadmapSvgRef.current.style.strokeDashoffset = 100 - rp * 100;
    }
    
    if (progress > 0.4 && !bulbSwingingRef.current) {
       bulbSwingingRef.current = true;
       setIsBulbSwinging(true);
    }

    let step = 0;
    if (rp >= 0.85) step = 4;
    else if (rp >= 0.67) step = 3;
    else if (rp >= 0.40) step = 2;
    else if (rp >= 0.13) step = 1;
    
    if (step !== activeStepRef.current) {
      activeStepRef.current = step;
      setActiveStep(step);
    }
  });

  return (
    <section ref={heroRef} className="relative h-[500dvh] w-full">
      <div className="sticky top-[90px] md:top-[110px] h-[calc(100dvh-90px)] md:h-[calc(100dvh-110px)] w-full overflow-hidden" style={{ overflow: 'clip' }}>
        <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none z-0"></div>
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none z-0"
          style={{
            backgroundSize: '80px 80px',
            backgroundPosition: `calc(var(--mx, 0) * -20px) calc(var(--my, 0) * -20px)`,
            WebkitMaskImage: `radial-gradient(circle 250px at var(--cx, -1000px) var(--cy, -1000px), black 30%, transparent 100%)`,
            maskImage: `radial-gradient(circle 250px at var(--cx, -1000px) var(--cy, -1000px), black 30%, transparent 100%)`,
          }}
        ></div>
        
        {/* --- BLOCK 1: INTRO --- */}
        <div 
          ref={b1Ref}
          className="absolute inset-0 flex flex-col justify-center px-margin-mobile md:px-margin-desktop will-change-[transform,opacity]"
        >
          <div 
            className="absolute top-20 right-10 md:right-32 w-32 h-32 bg-primary-container border-4 border-on-background rounded-full mix-blend-multiply opacity-50 blur-3xl animate-pulse"
            style={{ transform: `translate3d(calc(var(--mx, 0) * 40px), calc(var(--my, 0) * 40px), 0)` }}
          ></div>
          <div 
            className="absolute bottom-20 left-10 md:left-32 w-48 h-48 bg-secondary-container border-4 border-on-background mix-blend-multiply opacity-40 blur-2xl animate-pulse delay-1000"
            style={{ transform: `translate3d(calc(var(--mx, 0) * 60px), calc(var(--my, 0) * 60px), 0)` }}
          ></div>
          
          <div 
            className="absolute top-2 md:top-10 left-2 md:left-4 bg-secondary-container text-on-secondary border-4 border-on-background py-1 px-4 md:py-2 md:px-8 -rotate-6 neo-shadow z-10 w-auto"
            style={{ transform: `translate3d(calc(var(--mx, 0) * -20px), calc(var(--my, 0) * -20px), 0) rotate(-6deg)` }}
          >
            <span className="font-label-mono text-[10px] md:text-label-mono uppercase whitespace-nowrap">6+ YEARS OF EDITING &amp; BUILDING</span>
          </div>
          
          <div 
            className="absolute top-10 right-2 md:right-4 bg-background border-4 border-on-background py-3 px-6 rotate-12 neo-shadow z-10 hidden md:block"
            style={{ transform: `translate3d(calc(var(--mx, 0) * -15px), calc(var(--my, 0) * -15px), 0) rotate(12deg)` }}
          >
            <span className="font-label-mono text-label-mono uppercase flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-fixed animate-ping"></div>
              AVAILABLE FOR HIRE
            </span>
          </div>

          <div 
            className="relative z-20 max-w-5xl mx-auto text-center md:text-left mt-12 md:mt-24"
            style={{ transform: `translate3d(calc(var(--mx, 0) * -30px), calc(var(--my, 0) * -30px), 0)` }}
          >
            <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl uppercase leading-[1.1] md:leading-none mb-4 md:mb-8 tracking-tighter">
              <span className="block md:-ml-2 hover:ml-2 transition-all duration-300"><span className="text-cobalt">CREATIVE</span> <span className="text-primary-container drop-shadow-[4px_4px_0_#1b1c15] md:drop-shadow-[8px_8px_0_#1b1c15] stroke-on-background" style={{ WebkitTextStroke: '2px #1b1c15' }}>BY DESIGN,</span></span>
              <span className="block md:ml-4 hover:-ml-2 transition-all duration-300">EDITOR <span className="bg-on-background text-background px-2 md:px-4 inline-block -rotate-2">BY CRAFT,</span></span>
              <span className="block text-secondary-container">DEV BY CHOICE</span>
            </h1>
            <p className="font-body-sm md:font-body-lg text-sm md:text-body-lg max-w-2xl bg-background border-l-8 border-primary-container pl-4 md:pl-6 py-1 md:py-2 mb-6 md:mb-12 relative mx-auto md:mx-0">
              <span className="absolute -left-6 -top-6 text-5xl md:text-6xl text-on-background opacity-20 font-display-xl">&quot;</span>
              I build websites that break the grid and edit videos that move the needle. Punchy, fast, and unapologetically loud.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-8 md:gap-12 relative">
              <button 
                onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary-container text-on-background border-4 border-on-background px-10 py-5 font-headline-md text-headline-md uppercase neo-shadow neo-shadow-hover transition-all duration-150 rotate-2 w-full sm:w-auto relative group"
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  SEE MY WORK
                  <span className="material-symbols-outlined font-bold group-hover:translate-x-2 transition-transform">ads_click</span>
                </span>
                <div className="absolute inset-0 bg-dots opacity-20"></div>
              </button>
              <div className="hidden md:block w-32 h-16 border-t-4 border-r-4 border-cobalt rounded-tr-full -ml-8 mt-12 opacity-80"></div>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-60 md:opacity-100">
            <FloatingLogo bg="bg-[#f7df1e]" color="text-black" icon={<SiJavascript className="w-8 h-8 md:w-12 md:h-12" />} rotate="-rotate-[15deg]" positionClasses="top-[5%] md:top-[8%] left-[2%] md:left-[5%]" parallaxSpeed={40} />
            <FloatingLogo bg="bg-[#282c34]" color="text-[#61dafb]" icon={<SiReact className="w-8 h-8 md:w-12 md:h-12" />} rotate="rotate-[20deg]" positionClasses="top-[10%] md:top-[12%] right-[2%] md:right-[5%]" parallaxSpeed={-60} />
            <FloatingLogo bg="bg-[#000000]" color="text-white" icon={<SiNextdotjs className="w-8 h-8 md:w-12 md:h-12" />} rotate="-rotate-6" positionClasses="bottom-[5%] md:bottom-[8%] right-[5%] md:right-[10%]" parallaxSpeed={25} />
            <FloatingLogo bg="bg-[#00005b]" color="text-[#9999ff]" text="Ae" rotate="-rotate-[20deg]" positionClasses="top-[5%] md:top-[8%] right-[25%] md:right-[35%]" parallaxSpeed={50} />
            <FloatingLogo bg="bg-[#00005b]" color="text-[#ea77ff]" text="Pr" rotate="rotate-[25deg]" positionClasses="top-[65%] md:top-[70%] right-[5%] md:right-[15%]" parallaxSpeed={-70} />
            <FloatingLogo bg="bg-white" color="text-[#38bdf8]" icon={<SiTailwindcss className="w-8 h-8 md:w-12 md:h-12" />} rotate="rotate-[15deg]" positionClasses="top-[45%] md:top-[50%] right-[2%] md:right-[5%]" parallaxSpeed={-35} />
            <FloatingLogo bg="bg-white" color="text-[#339933]" icon={<SiNodedotjs className="w-8 h-8 md:w-12 md:h-12" />} rotate="rotate-12" positionClasses="top-[30%] md:top-[40%] left-[5%] md:left-[8%]" parallaxSpeed={-20} />
            <FloatingLogo bg="bg-black" color="text-white" icon={<FigmaLogo className="w-8 h-8 md:w-12 md:h-12" />} rotate="-rotate-12" positionClasses="bottom-[10%] md:bottom-[15%] left-[3%] md:left-[8%] hidden md:block" parallaxSpeed={55} />
            <div className="absolute top-[15%] left-[50%] bg-dots w-16 h-16 rounded-full border-2 border-on-background opacity-50 hidden md:block"></div>
            <span className="absolute top-[5%] right-[30%] text-cobalt material-symbols-outlined text-4xl rotate-12 hidden md:inline-block">bolt</span>
          </div>
        </div>

        {/* --- BLOCK 2: IMPACT STATEMENT --- */}
        <div 
          ref={b2Ref}
          className="absolute inset-0 flex flex-col justify-center items-center text-center px-margin-mobile md:px-margin-desktop will-change-[transform,opacity] opacity-0"
        >
          <div 
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-cobalt border-4 border-on-background rounded-full mix-blend-multiply opacity-30 blur-3xl animate-pulse"
            style={{ transform: `translate3d(calc(var(--mx, 0) * 60px), calc(var(--my, 0) * 60px), 0)` }}
          ></div>
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-container border-4 border-on-background mix-blend-multiply opacity-20 blur-3xl animate-pulse delay-700"
            style={{ transform: `translate3d(calc(var(--mx, 0) * -60px), calc(var(--my, 0) * -60px), 0)` }}
          ></div>

          {isBulbSwinging && (
            <div className="absolute top-0 left-[5%] md:left-[10%] origin-top animate-[bulb-swing_2.5s_ease-in-out_forwards] z-40 pointer-events-none" style={{ transformOrigin: 'top center' }}>
              <div 
                className="origin-top flex flex-col items-center cursor-pointer px-8 pointer-events-auto" 
                style={{ 
                  transformOrigin: 'top center',
                  animation: isBulbHit ? 'bulb-hit 2s ease-in-out forwards' : 'none'
                }}
                onMouseEnter={handleBulbHit}
                onClick={handleBulbHit}
              >
                <div className="w-2 bg-on-background h-48 md:h-[350px] mx-auto shadow-[4px_0_0_0_#1b1c15]"></div>
                <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-on-background bg-surface-variant mx-auto -mt-1 relative z-20 shadow-[4px_4px_0_0_#1b1c15] flex flex-col justify-evenly">
                  <div className="w-full h-[2px] bg-on-background opacity-40"></div>
                  <div className="w-full h-[2px] bg-on-background opacity-40"></div>
                </div>
                <div className="w-10 h-10 md:w-16 md:h-16 border-4 border-on-background rounded-full mx-auto -mt-2 relative flex flex-col items-center justify-center bg-surface-container-high shadow-[4px_4px_0_0_#1b1c15] animate-[bulb-glow_0.1s_linear_2.2s_forwards] overflow-hidden">
                  <div className="w-4 h-4 md:w-6 md:h-6 border-4 border-on-background rounded-t-full border-b-0 absolute bottom-1 md:bottom-2 opacity-80"></div>
                </div>
              </div>
            </div>
          )}

          <div 
            className="absolute inset-0 pointer-events-none opacity-30 md:opacity-100 scale-75 md:scale-100"
            style={{ transform: `translate3d(calc(var(--mx, 0) * 80px), calc(var(--my, 0) * 80px), 0)` }}
          >
            <span className="absolute top-[5%] md:top-[15%] right-[5%] md:right-[15%] bg-cobalt text-on-primary border-4 border-on-background px-4 md:px-6 py-1 md:py-2 font-headline-md text-headline-md uppercase rotate-6 neo-shadow drop-shadow-[8px_8px_0_#1b1c15]">FAST</span>
            <span className="absolute bottom-[10%] md:bottom-[20%] left-[5%] md:left-[10%] bg-secondary-container text-on-secondary border-4 border-on-background px-4 md:px-6 py-1 md:py-2 font-headline-md text-headline-md uppercase -rotate-12 neo-shadow drop-shadow-[8px_8px_0_#1b1c15]">KINETIC</span>
            <span className="absolute top-[80%] md:top-[40%] left-[10%] md:left-[5%] bg-primary-container text-on-background border-4 border-on-background px-4 md:px-6 py-1 md:py-2 font-headline-md text-headline-md uppercase rotate-3 neo-shadow drop-shadow-[8px_8px_0_#1b1c15]">LOUD</span>
          </div>

          <div 
            className="relative z-20 max-w-4xl mx-auto"
            style={{ transform: `translate3d(calc(var(--mx, 0) * -40px), calc(var(--my, 0) * -40px), 0)` }}
          >
            <h2 className="font-display-xl text-headline-lg-mobile md:text-display-xl uppercase leading-none mb-6">
              NOT JUST <br/>
              <span className="bg-on-background text-background px-4 inline-block -rotate-1 mt-2">ANOTHER TEMPLATE.</span>
            </h2>

            <div className="max-w-2xl mx-auto" style={{ fontFamily: 'Tahoma, Arial, sans-serif', filter: 'drop-shadow(6px 6px 0 #000)' }}>
              <div suppressHydrationWarning style={{
                background: 'linear-gradient(to right, #0a246a, #a6c9f7)',
                padding: '3px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                userSelect: 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 14, height: 14, background: '#ffcc00', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>⚡</div>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 11, letterSpacing: 0.2 }}>impact.exe</span>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {['_','□','✕'].map((btn, i) => (
                    <div key={i} style={{
                      width: 16, height: 14,
                      background: i === 2 ? '#c03535' : '#d4d0c8',
                      border: '1px solid #000',
                      boxShadow: 'inset -1px -1px #808080, inset 1px 1px #fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 'bold', cursor: 'default', color: '#000',
                    }}>{btn}</div>
                  ))}
                </div>
              </div>
              <div style={{
                background: '#d4d0c8',
                border: '2px solid',
                borderColor: '#fff #808080 #808080 #fff',
                padding: '12px 16px 16px',
              }}>
                <div style={{
                  background: '#d4d0c8',
                  borderBottom: '1px solid #808080',
                  paddingBottom: 6,
                  marginBottom: 10,
                  display: 'flex',
                  gap: 6,
                }}>
                  {['File','Edit','View','Help'].map(m => (
                    <span key={m} style={{ fontSize: 11, cursor: 'default', padding: '1px 4px' }}>{m}</span>
                  ))}
                </div>
                <div style={{
                  background: '#fff',
                  border: '2px solid',
                  borderColor: '#808080 #fff #fff #808080',
                  padding: '12px 16px',
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: '#000',
                }}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#000' }}>
                    Design that hits first.<br/>
                    Code that ships fast.<br/>
                    Work that gets remembered.<br/>
                    <strong style={{ color: '#c03535' }}>No noise. Just signal.</strong>
                  </p>
                </div>
                <div style={{
                  marginTop: 8,
                  borderTop: '1px solid #808080',
                  paddingTop: 4,
                  display: 'flex',
                  gap: 8,
                  fontSize: 10,
                  color: '#444',
                }}>
                  <span style={{ flex: 1, border: '1px solid #808080', padding: '1px 4px', background: '#d4d0c8' }}>Ready</span>
                  <span style={{ border: '1px solid #808080', padding: '1px 4px', background: '#d4d0c8' }}>100%</span>
                  <span style={{ border: '1px solid #808080', padding: '1px 6px', background: '#d4d0c8' }}>■ Impact Mode ON</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BLOCK 3: ROADMAP / FLOW --- */}
        <div 
          ref={b3Ref}
          className="absolute inset-0 flex flex-col justify-start items-center text-left pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop will-change-[transform,opacity] opacity-0"
        >
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div ref={m1Ref} className="absolute inset-0 opacity-30">
              <div className="absolute top-[10%] left-[15%] -rotate-12 scale-75"><MarioPipe /></div>
              <div className="absolute top-[35%] right-[25%] rotate-[25deg] scale-50"><MarioCoin /></div>
              <div className="absolute top-[65%] left-[8%] -rotate-6 scale-90"><MarioBrick /></div>
              <div className="absolute top-[85%] right-[12%] rotate-12 scale-75"><MarioQuestion /></div>
            </div>
            <div ref={m2Ref} className="absolute inset-0 opacity-50">
              <div className="absolute top-[5%] left-[30%] rotate-6 scale-90"><MarioCoin /></div>
              <div className="absolute top-[45%] right-[8%] -rotate-[15deg] scale-100"><MarioPipe /></div>
              <div className="absolute top-[75%] left-[25%] rotate-[30deg] scale-75"><MarioCoin /></div>
              <div className="absolute top-[90%] right-[35%] -rotate-12 scale-90"><MarioBrick /></div>
            </div>
            <div ref={m3Ref} className="absolute inset-0 opacity-80">
              <div className="absolute top-[15%] right-[15%] rotate-12 scale-110"><MarioQuestion /></div>
              <div className="absolute top-[28%] left-[5%] -rotate-12 scale-125"><MarioBrick /></div>
              <div className="absolute top-[55%] left-[18%] rotate-6 scale-110"><MarioQuestion /></div>
              <div className="absolute top-[80%] right-[6%] -rotate-[20deg] scale-125"><MarioPipe /></div>
            </div>
          </div>

          <div ref={roadmapContainerRef} className="relative z-20 w-full max-w-6xl mx-auto">
            <h2 className="font-display-xl text-headline-lg-mobile md:text-display-xl uppercase leading-none mb-2 text-center">
              HOW I <span className="bg-primary-container text-on-background px-4 py-1 inline-block -rotate-2 border-[4px] border-on-background shadow-[4px_4px_0_0_#1b1c15] md:shadow-[8px_8px_0_0_#1b1c15]">WORK</span>
            </h2>

            <div className="w-full h-[1100px] md:h-[850px] max-w-6xl mx-auto relative mt-8 pb-8">
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path 
                  d="M 5 0 C 5 15, 85 5, 85 20 C 85 40, 5 30, 5 45 C 5 65, 90 55, 90 70 C 90 90, 30 85, 40 100" 
                  fill="none" 
                  stroke="var(--color-on-background)" 
                  strokeWidth="4" 
                  strokeDasharray="6 6" 
                  vectorEffect="non-scaling-stroke" 
                  className="opacity-20"
                />
                <path 
                  ref={roadmapSvgRef}
                  d="M 5 0 C 5 15, 85 5, 85 20 C 85 40, 5 30, 5 45 C 5 65, 90 55, 90 70 C 90 90, 30 85, 40 100" 
                  fill="none" 
                  stroke="var(--color-cobalt)" 
                  strokeWidth="8" 
                  vectorEffect="non-scaling-stroke" 
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset={100}
                  className="drop-shadow-[0_0_8px_var(--color-cobalt)]"
                />
              </svg>

              {[
                { title: "The Brain Dump", icon: <PixelIcon art={coffeeArt} color="#ccff00" className="w-8 h-8 md:w-10 md:h-10" />, bg: "bg-cobalt text-on-primary", copy: "We hop on a call and you share your vision. I take detailed notes and promise not to judge your rough sketches.", top: "5%", leftClasses: "left-[4%] md:left-1/2", rotate: "rotate-6" },
                { title: "The Workshop", icon: <PixelIcon art={hammerArt} color="#ffffff" className="w-8 h-8 md:w-10 md:h-10" />, bg: "bg-secondary text-on-secondary", copy: "I put my headphones on and get to work. Whether it's code, keyframes, or layouts, this is where the puzzle pieces start fitting together.", top: "27%", leftClasses: "left-[4%] md:left-12", rotate: "-rotate-3" },
                { title: "The Polish", icon: <PixelIcon art={starArt} color="#ffcc00" className="w-8 h-8 md:w-10 md:h-10" />, bg: "bg-primary-container text-on-background", copy: "We review the draft together. I tweak the details and fix that one tiny thing that only we will ever notice.", top: "50%", leftClasses: "left-[4%] md:left-1/2", rotate: "rotate-6" },
                { title: "The Handoff", icon: <PixelIcon art={rocketArt} color="#ccff00" className="w-8 h-8 md:w-10 md:h-10" />, bg: "bg-on-background text-background", copy: "The final product is packaged up and ready to go. You get the deliverables, and I take a very well-deserved nap.", top: "73%", leftClasses: "left-[4%] md:left-1/4", rotate: "-rotate-6" }
              ].map((step, idx) => {
                const isActive = activeStep > idx;
                return (
                  <div key={idx} 
                    className={`absolute ${step.leftClasses} w-[92%] md:w-[45%] group z-10 transition-transform duration-500 ease-out ${isActive ? step.rotate : 'rotate-0'}`}
                    style={{ top: step.top }}
                  >
                    <div className={`border-4 border-on-background p-3 md:p-6 transition-all duration-500 ease-out ${isActive ? 'bg-background neo-shadow opacity-100 scale-100' : 'bg-surface-container-high opacity-50 grayscale scale-[0.6] md:scale-75 blur-[1px] -translate-y-8'}`}>
                      <div className="flex items-center gap-3 md:gap-4 mb-2 border-b-4 border-on-background pb-2">
                        <span className={`flex-shrink-0 ${step.bg} border-4 border-on-background w-12 h-12 md:w-16 md:h-16 flex items-center justify-center neo-shadow transition-transform duration-500 ${isActive ? '-rotate-12 scale-110' : 'rotate-0 scale-100'}`}>
                          {step.icon}
                        </span>
                        <h3 className="font-headline-md text-[16px] md:text-[26px] uppercase leading-tight">{step.title}</h3>
                      </div>
                      <p className="font-label-mono text-[12px] md:text-label-mono text-on-surface-variant pt-2">
                        <span className="text-cobalt mr-2">&gt;</span> {step.copy}
                        {isActive && <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-cobalt"></span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
