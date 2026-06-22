"use client";
import { useState, useEffect, useRef } from "react";

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

export default function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowHeight, setWindowHeight] = useState(1000);
  const heroRef = useRef(null);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      let progress = 0;
      if (rect.top <= 0) {
        // max progress is 6 for a 600vh container (1 per 100vh)
        progress = Math.max(0, Math.min(6, -rect.top / window.innerHeight));
      }
      setScrollProgress(progress);
    };
    
    const handlePointerMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      // gamma is left/right (-90 to 90)
      // beta is front/back (-180 to 180, typically 0-90 when holding)
      let x = Math.max(-1, Math.min(1, e.gamma / 45));
      let y = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
      setMousePos({ x, y });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("deviceorientation", handleOrientation);
    handleScroll(); // initialize
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // ============================================================
  // PARALLAX SCROLL SYSTEM
  // Exiting section drifts up slowly (-50vh)
  // Entering section rushes up from further below (+100vh)
  // The speed difference = parallax depth illusion
  // Both fade simultaneously for clean crossfade
  // ============================================================
  const CROSS_DUR = 0.6;
  const t1 = Math.max(0, Math.min(1, (scrollProgress - 0.5) / CROSS_DUR));
  const t2 = Math.max(0, Math.min(1, (scrollProgress - 1.7) / CROSS_DUR));

  // Easing for organic feel
  const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const e1 = ease(t1);
  const e2 = ease(t2);

  // --- BLOCK 1: drifts up & fades out ---
  const b1Y = -e1 * 50;       // 0 → -50vh (slow drift, not a full push)
  const b1Opacity = 1 - e1;
  const b1Transform = `translateY(${b1Y}vh)`;

  // --- BLOCK 2: rushes up from below & fades in, then drifts away ---
  const b2YEnter = (1 - e1) * 100;   // 100vh → 0 (faster entry from deeper below)
  const b2YExit  = -e2 * 50;          // 0 → -50vh (same slow drift on exit)
  const b2Y = t1 < 1 ? b2YEnter : b2YExit;
  const b2Opacity = Math.max(0, Math.min(1, Math.min(e1, 1 - e2)));
  const b2Transform = `translateY(${b2Y}vh)`;

  // --- BLOCK 3: rushes up from below & fades in, locks ---
  const b3Y = (1 - e2) * 100;        // 100vh → 0
  const b3Opacity = e2;
  const b3Transform = `translateY(${b3Y}vh)`;

  // Roadmap scroll: starts at 2.3, shorter 2.5 screen-height duration
  const roadmapProgress = Math.max(0, Math.min(1, (scrollProgress - 2.3) / 2.5));
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const maxScroll = isMobile 
    ? Math.max(850, 1600 - windowHeight) 
    : Math.max(650, 1400 - windowHeight);
  const innerScrollY = -roadmapProgress * maxScroll;

  return (
    <section ref={heroRef} className="relative h-[600vh] w-full">
      {/* perspective-origin on the sticky viewport gives the cylinder its vanishing point */}
      <div className="sticky top-0 h-screen w-full" style={{ overflow: 'clip' }}>
        
        {/* --- BLOCK 1: INTRO --- */}
        <div 
          className="absolute inset-0 flex flex-col justify-center px-margin-mobile md:px-margin-desktop"
          style={{ 
            transform: b1Transform, 
            opacity: b1Opacity,
            transition: 'transform 0.08s ease-out, opacity 0.08s ease-out',
            pointerEvents: scrollProgress < 0.5 ? 'auto' : 'none',
            willChange: 'transform, opacity'
          }}
        >
          {/* Background Elements */}
          <div 
            className="absolute top-20 right-10 md:right-32 w-32 h-32 bg-primary-container border-4 border-on-background rounded-full mix-blend-multiply opacity-50 blur-3xl animate-pulse transition-transform duration-200 ease-out"
            style={{ transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)` }}
          ></div>
          <div 
            className="absolute bottom-20 left-10 md:left-32 w-48 h-48 bg-secondary-container border-4 border-on-background mix-blend-multiply opacity-40 blur-2xl animate-pulse delay-1000 transition-transform duration-200 ease-out"
            style={{ transform: `translate(${mousePos.x * 60}px, ${mousePos.y * 60}px)` }}
          ></div>
          
          {/* Experience Ribbon */}
          <div 
            className="absolute top-10 left-2 md:left-4 bg-secondary-container text-on-secondary border-4 border-on-background py-2 px-8 -rotate-6 neo-shadow z-10 w-auto transition-transform duration-200 ease-out"
            style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) rotate(-6deg)` }}
          >
            <span className="font-label-mono text-label-mono uppercase whitespace-nowrap">3+ YEARS OF BUILDING &amp; EDITING</span>
          </div>
          
          {/* Floating Sticker */}
          <div 
            className="absolute top-10 right-2 md:right-4 bg-background border-4 border-on-background py-3 px-6 rotate-12 neo-shadow z-10 hidden md:block transition-transform duration-200 ease-out"
            style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px) rotate(12deg)` }}
          >
            <span className="font-label-mono text-label-mono uppercase flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-fixed animate-ping"></div>
              AVAILABLE FOR HIRE
            </span>
          </div>

          {/* Main Content */}
          <div 
            className="relative z-20 max-w-5xl mx-auto text-center md:text-left transition-transform duration-200 ease-out"
            style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
          >
            <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl uppercase leading-none mb-8 tracking-tighter">
              <span className="block -ml-2 hover:ml-2 transition-all duration-300"><span className="text-cobalt">CREATIVE</span> <span className="text-primary-container drop-shadow-[4px_4px_0_#1b1c15] md:drop-shadow-[8px_8px_0_#1b1c15] stroke-on-background" style={{ WebkitTextStroke: '2px #1b1c15' }}>BY DESIGN,</span></span>
              <span className="block ml-4 hover:-ml-2 transition-all duration-300">EDITOR <span className="bg-on-background text-background px-4 inline-block -rotate-2">BY CRAFT,</span></span>
              <span className="block text-secondary-container hover:text-on-background transition-colors duration-300">DEV BY CHOICE.</span>
            </h1>
            <p className="font-body-lg text-body-lg max-w-2xl bg-background border-l-8 border-primary-container pl-6 py-2 mb-12 relative mx-auto md:mx-0">
              <span className="absolute -left-6 -top-6 text-6xl text-on-background opacity-20 font-display-xl">&quot;</span>
              I build websites that break the grid and edit videos that move the needle. Punchy, fast, and unapologetically loud.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-8 md:gap-12 relative">
              {/* CTA */}
              <button className="bg-primary-container text-on-background border-4 border-on-background px-10 py-5 font-headline-md text-headline-md uppercase neo-shadow neo-shadow-hover transition-all duration-150 rotate-2 w-full sm:w-auto relative group">
                <span className="relative z-10 flex items-center justify-center gap-4">
                  SEE MY WORK
                  <span className="material-symbols-outlined font-bold group-hover:translate-x-2 transition-transform">ads_click</span>
                </span>
                <div className="absolute inset-0 bg-dots opacity-20"></div>
              </button>
              {/* Doodle Arrow */}
              <div className="hidden md:block w-32 h-16 border-t-4 border-r-4 border-cobalt rounded-tr-full -ml-8 mt-12 opacity-80"></div>
            </div>
          </div>

          {/* Tool Chips Scattered */}
          <div 
            className="absolute inset-0 pointer-events-none overflow-hidden z-0 transition-transform duration-200 ease-out opacity-40 md:opacity-100 scale-75 md:scale-100"
            style={{ transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)` }}
          >
            <span className="absolute top-[10%] md:top-[20%] left-[5%] md:left-[20%] bg-background border-2 border-on-background px-4 py-1 font-label-mono text-label-mono rounded-full -rotate-12 neo-shadow flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">psychology</span>Claude</span>
            <span className="absolute top-[25%] md:top-[30%] right-[5%] md:right-[25%] bg-surface-container-high border-2 border-on-background px-4 py-1 font-label-mono text-label-mono rounded-full rotate-12 neo-shadow flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">design_services</span>Stitch</span>
            <span className="absolute bottom-[20%] md:bottom-[15%] left-[5%] bg-secondary-fixed-dim border-2 border-on-background px-4 py-1 font-label-mono text-label-mono rounded-full rotate-6 neo-shadow flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">flight_takeoff</span>Antigravity</span>
            <span className="absolute top-[65%] md:top-[70%] right-[5%] bg-primary-container border-2 border-on-background px-4 py-1 font-label-mono text-label-mono rounded-full -rotate-6 neo-shadow flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">code</span>HTML/CSS</span>
            <span className="absolute bottom-[10%] md:bottom-[30%] left-[30%] md:left-[45%] bg-background border-2 border-on-background px-4 py-1 font-label-mono text-label-mono rounded-full rotate-[15deg] neo-shadow flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">movie</span>Premiere Pro</span>
            <div className="absolute top-[15%] left-[50%] bg-dots w-16 h-16 rounded-full border-2 border-on-background opacity-50 hidden md:block"></div>
            <span className="absolute top-[5%] right-[30%] text-cobalt material-symbols-outlined text-4xl rotate-12 hidden md:inline-block">bolt</span>
          </div>
        </div>

        {/* --- BLOCK 2: IMPACT STATEMENT --- */}
        <div 
          className="absolute inset-0 flex flex-col justify-center items-center text-center px-margin-mobile md:px-margin-desktop"
          style={{ 
            transform: b2Transform, 
            opacity: b2Opacity,
            transition: 'transform 0.08s ease-out, opacity 0.08s ease-out',
            pointerEvents: (scrollProgress > 0.5 && scrollProgress < 1.7) ? 'auto' : 'none',
            willChange: 'transform, opacity'
          }}
        >
          {/* New Background Elements */}
          <div 
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-cobalt border-4 border-on-background rounded-full mix-blend-multiply opacity-30 blur-3xl animate-pulse transition-transform duration-200 ease-out"
            style={{ transform: `translate(${mousePos.x * 60}px, ${mousePos.y * 60}px)` }}
          ></div>
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-container border-4 border-on-background mix-blend-multiply opacity-20 blur-3xl animate-pulse delay-700 transition-transform duration-200 ease-out"
            style={{ transform: `translate(${mousePos.x * -60}px, ${mousePos.y * -60}px)` }}
          ></div>

          {/* Floating Impact Words */}
          <div 
            className="absolute inset-0 pointer-events-none transition-transform duration-200 ease-out opacity-30 md:opacity-100 scale-75 md:scale-100"
            style={{ transform: `translate(${mousePos.x * 80}px, ${mousePos.y * 80}px)` }}
          >
            <span className="absolute top-[5%] md:top-[15%] right-[5%] md:right-[15%] bg-cobalt text-on-primary border-4 border-on-background px-4 md:px-6 py-1 md:py-2 font-headline-md text-headline-md uppercase rotate-6 neo-shadow drop-shadow-[8px_8px_0_#1b1c15]">FAST</span>
            <span className="absolute bottom-[10%] md:bottom-[20%] left-[5%] md:left-[10%] bg-secondary-container text-on-secondary border-4 border-on-background px-4 md:px-6 py-1 md:py-2 font-headline-md text-headline-md uppercase -rotate-12 neo-shadow drop-shadow-[8px_8px_0_#1b1c15]">KINETIC</span>
            <span className="absolute top-[80%] md:top-[40%] left-[10%] md:left-[5%] bg-primary-container text-on-background border-4 border-on-background px-4 md:px-6 py-1 md:py-2 font-headline-md text-headline-md uppercase rotate-3 neo-shadow drop-shadow-[8px_8px_0_#1b1c15]">LOUD</span>
          </div>

          {/* Content */}
          <div 
            className="relative z-20 max-w-4xl mx-auto transition-transform duration-200 ease-out"
            style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
          >
            <h2 className="font-display-xl text-headline-lg-mobile md:text-display-xl uppercase leading-none mb-6">
              NOT JUST <br/>
              <span className="bg-on-background text-background px-4 inline-block -rotate-1 mt-2">ANOTHER TEMPLATE.</span>
            </h2>

            {/* Windows 98/XP Dialog Box */}
            <div className="max-w-2xl mx-auto" style={{ fontFamily: 'Tahoma, Arial, sans-serif', filter: 'drop-shadow(6px 6px 0 #000)' }}>
              {/* Title Bar */}
              <div style={{
                background: 'linear-gradient(to right, #0a246a, #a6c9f7)',
                padding: '3px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                userSelect: 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {/* Tiny icon */}
                  <div style={{ width: 14, height: 14, background: '#ffcc00', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>⚡</div>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 11, letterSpacing: 0.2 }}>impact.exe</span>
                </div>
                {/* Win buttons */}
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
              {/* Window body */}
              <div style={{
                background: '#d4d0c8',
                border: '2px solid',
                borderColor: '#fff #808080 #808080 #fff',
                padding: '12px 16px 16px',
              }}>
                {/* Toolbar */}
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
                {/* Content area — inset sunken panel */}
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
                {/* Status bar */}
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
          className="absolute inset-0 flex flex-col justify-start items-center text-left pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop"
          style={{ 
            transform: b3Transform, 
            opacity: b3Opacity,
            transition: 'transform 0.08s ease-out, opacity 0.08s ease-out',
            pointerEvents: scrollProgress > 2.3 ? 'auto' : 'none',
            willChange: 'transform, opacity'
          }}
        >
          {/* Scattered Retro Mario Elements (Multi-Layer Parallax) */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Layer 1 (Deepest, Slowest) */}
            <div 
              className="absolute inset-0 opacity-30 transition-transform duration-200 ease-out"
              style={{ transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px) translateY(${innerScrollY * 0.1}px)` }}
            >
              <div className="absolute top-[10%] left-[15%] -rotate-12 scale-75"><MarioPipe /></div>
              <div className="absolute top-[35%] right-[25%] rotate-[25deg] scale-50"><MarioCoin /></div>
              <div className="absolute top-[65%] left-[8%] -rotate-6 scale-90"><MarioBrick /></div>
              <div className="absolute top-[85%] right-[12%] rotate-12 scale-75"><MarioQuestion /></div>
            </div>

            {/* Layer 2 (Middle Depth) */}
            <div 
              className="absolute inset-0 opacity-50 transition-transform duration-200 ease-out"
              style={{ transform: `translate(${mousePos.x * -4}px, ${mousePos.y * -4}px) translateY(${innerScrollY * 0.25}px)` }}
            >
              <div className="absolute top-[5%] left-[30%] rotate-6 scale-90"><MarioCoin /></div>
              <div className="absolute top-[45%] right-[8%] -rotate-[15deg] scale-100"><MarioPipe /></div>
              <div className="absolute top-[75%] left-[25%] rotate-[30deg] scale-75"><MarioCoin /></div>
              <div className="absolute top-[90%] right-[35%] -rotate-12 scale-90"><MarioBrick /></div>
            </div>

            {/* Layer 3 (Closest Background, Fastest) */}
            <div 
              className="absolute inset-0 opacity-80 transition-transform duration-200 ease-out"
              style={{ transform: `translate(${mousePos.x * -7}px, ${mousePos.y * -7}px) translateY(${innerScrollY * 0.45}px)` }}
            >
              <div className="absolute top-[15%] right-[15%] rotate-12 scale-110"><MarioQuestion /></div>
              <div className="absolute top-[28%] left-[5%] -rotate-12 scale-125"><MarioBrick /></div>
              <div className="absolute top-[55%] left-[18%] rotate-6 scale-110"><MarioQuestion /></div>
              <div className="absolute top-[80%] right-[6%] -rotate-[20deg] scale-125"><MarioPipe /></div>
            </div>
          </div>

          <div className="relative z-20 w-full max-w-6xl mx-auto transition-transform duration-200 ease-out"
            style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) translateY(${innerScrollY}px)` }}>
            
            <h2 className="font-display-xl text-headline-lg-mobile md:text-display-xl uppercase leading-none mb-2 drop-shadow-[4px_4px_0_#1b1c15] text-center">
              HOW I <span className="bg-primary-container text-on-background px-4 inline-block -rotate-2">WORK</span>
            </h2>



            {/* The Animated Roadmap */}
            <div className="w-full h-[1100px] md:h-[850px] max-w-6xl mx-auto relative mt-8 pb-8">
              
              {/* Extremely Curvy Snake SVG Timeline */}
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
                  d="M 5 0 C 5 15, 85 5, 85 20 C 85 40, 5 30, 5 45 C 5 65, 90 55, 90 70 C 90 90, 30 85, 40 100" 
                  fill="none" 
                  stroke="var(--color-cobalt)" 
                  strokeWidth="8" 
                  vectorEffect="non-scaling-stroke" 
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset={100 - roadmapProgress * 100}
                  className="transition-all duration-75 drop-shadow-[0_0_8px_var(--color-cobalt)]"
                />
              </svg>

              {/* Extremely Scattered Roadmap Steps */}
              {[
                { title: "The Brain Dump", icon: "☕", copy: "We hop on a call. You talk, I frantically take notes and try to decode your startup buzzwords.", activeAt: 0, top: "5%", leftClasses: "left-0 md:left-1/2", rotate: "rotate-6" },
                { title: "Pixel Pushing", icon: "🕹️", copy: "I lock myself in a dark room with an unhealthy amount of caffeine until the grid yields to my will.", activeAt: 0.25, top: "28%", leftClasses: "left-2 md:left-12", rotate: "-rotate-3" },
                { title: "The Polish", icon: "✨", copy: "Adding enough CSS shadows and scroll effects to make other developers mildly motion-sick.", activeAt: 0.5, top: "52%", leftClasses: "left-0 md:left-1/2", rotate: "rotate-6" },
                { title: "Launch & Pray", icon: "🚀", copy: "We hit deploy. I cross my fingers, you refresh the page. The internet gets a little bit cooler.", activeAt: 0.75, top: "76%", leftClasses: "left-2 md:left-1/4", rotate: "-rotate-6" }
              ].map((step, idx) => {
                const isActive = roadmapProgress >= step.activeAt;
                return (
                  <div key={idx} 
                    className={`absolute ${step.leftClasses} w-[92%] md:w-[45%] group z-10 transition-transform duration-500 ease-out ${isActive ? step.rotate : 'rotate-0'}`}
                    style={{ top: step.top }}
                  >
                    {/* Content Box */}
                    <div className={`border-4 border-on-background p-4 md:p-6 transition-all duration-500 ease-out ${isActive ? 'bg-background neo-shadow opacity-100 scale-100' : 'bg-surface-container-high opacity-50 grayscale scale-75 blur-[1px] -translate-y-8'}`}>
                      <div className="flex items-center gap-4 mb-2 border-b-4 border-on-background pb-2">
                        <span className={`text-4xl flex-shrink-0 bg-secondary text-on-secondary border-4 border-on-background w-16 h-16 flex items-center justify-center neo-shadow transition-transform duration-500 ${isActive ? '-rotate-12 scale-110' : 'rotate-0 scale-100'}`}>{step.icon}</span>
                        <h3 className="font-headline-md text-[20px] md:text-[26px] uppercase leading-tight">{step.title}</h3>
                      </div>
                      <p className="font-label-mono text-[13px] md:text-label-mono text-on-surface-variant pt-2">
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
