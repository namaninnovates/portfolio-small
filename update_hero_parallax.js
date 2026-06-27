const fs = require('fs');
const content = fs.readFileSync('src/components/Hero.jsx', 'utf8');

// Find the export default function Hero()
const splitIndex = content.indexOf('export default function Hero()');
if (splitIndex === -1) throw new Error("Could not find Hero function");

const topImportsAndComponents = content.substring(0, splitIndex);

const newHero = `export default function Hero() {
  const [isBulbHit, setIsBulbHit] = useState(false);
  const heroRef = useRef(null);
  const roadmapRef = useRef(null);

  const handleBulbHit = () => {
    if (isBulbHit) return;
    setIsBulbHit(true);
    setTimeout(() => setIsBulbHit(false), 2000);
  };

  useLenis(({ scroll }) => {
    if (!heroRef.current) return;
    
    // 1. Global Scroll Y for Depth Parallax (applied purely via CSS)
    heroRef.current.style.setProperty('--scrollY', scroll + 'px');

    // 2. Intro Fade out (fades over first 800px)
    const introOpacity = Math.max(0, 1 - (scroll / 600));
    heroRef.current.style.setProperty('--intro-opacity', introOpacity);

    // 3. Roadmap Line Draw Math
    if (roadmapRef.current) {
      const rect = roadmapRef.current.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Start drawing when it enters bottom of screen, finish when it reaches top
      const progress = (vh - rect.top) / (rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      heroRef.current.style.setProperty('--rp-pct', 100 - (clamped * 100));
    }
  });

  useEffect(() => {
    let pointerRaf;
    const handlePointerMove = (e) => {
      if (e.pointerType === "touch") return; // Keep mouse parallax for desktop
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
    
    // Initialize default CSS vars
    if (heroRef.current) {
      heroRef.current.style.setProperty('--rp-pct', 100);
      heroRef.current.style.setProperty('--intro-opacity', 1);
      heroRef.current.style.setProperty('--scrollY', '0px');
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleOrientation);
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      if (gyroRaf) cancelAnimationFrame(gyroRaf);
    };
  }, []);

  return (
    <div ref={heroRef} className="w-full flex flex-col bg-background relative overflow-hidden">
      
      {/* Universal Grid Background that stretches through the whole component */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none z-0"></div>
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none z-0"
        style={{
          backgroundSize: '80px 80px',
          backgroundPosition: \`calc(var(--mx, 0) * -20px) calc(var(--my, 0) * -20px)\`,
          WebkitMaskImage: \`radial-gradient(circle 250px at var(--cx, -1000px) var(--cy, -1000px), black 30%, transparent 100%)\`,
          maskImage: \`radial-gradient(circle 250px at var(--cx, -1000px) var(--cy, -1000px), black 30%, transparent 100%)\`,
        }}
      ></div>

      {/* --- SECTION 1: INTRO --- */}
      <section 
        className="relative min-h-[100dvh] w-full flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-24 will-change-[transform,opacity]"
        style={{ 
          opacity: 'var(--intro-opacity)',
          transform: 'translateY(calc(var(--scrollY) * 0.4))'
        }}
      >
        {/* Background Elements */}
        <div 
          className="absolute top-20 right-10 md:right-32 w-32 h-32 bg-primary-container border-4 border-on-background rounded-full mix-blend-multiply opacity-50 blur-3xl animate-pulse"
          style={{ transform: \`translate3d(calc(var(--mx, 0) * 40px), calc(var(--my, 0) * 40px), 0)\` }}
        ></div>
        <div 
          className="absolute bottom-20 left-10 md:left-32 w-48 h-48 bg-secondary-container border-4 border-on-background mix-blend-multiply opacity-40 blur-2xl animate-pulse delay-1000"
          style={{ transform: \`translate3d(calc(var(--mx, 0) * 60px), calc(var(--my, 0) * 60px), 0)\` }}
        ></div>
        
        {/* Experience Ribbon */}
        <div 
          className="absolute top-24 md:top-32 left-4 md:left-12 bg-secondary-container text-on-secondary border-4 border-on-background py-1 px-4 md:py-2 md:px-8 -rotate-6 neo-shadow z-10 w-auto"
          style={{ transform: \`translate3d(calc(var(--mx, 0) * -20px), calc(var(--my, 0) * -20px), 0) rotate(-6deg)\` }}
        >
          <span className="font-label-mono text-[10px] md:text-label-mono uppercase whitespace-nowrap">6+ YEARS OF EDITING &amp; BUILDING</span>
        </div>
        
        {/* Floating Sticker */}
        <div 
          className="absolute top-32 right-4 md:right-16 bg-background border-4 border-on-background py-3 px-6 rotate-12 neo-shadow z-10 hidden md:block"
          style={{ transform: \`translate3d(calc(var(--mx, 0) * -15px), calc(var(--my, 0) * -15px), 0) rotate(12deg)\` }}
        >
          <span className="font-label-mono text-label-mono uppercase flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-fixed animate-ping"></div>
            AVAILABLE FOR HIRE
          </span>
        </div>

        {/* Main Content */}
        <div 
          className="relative z-20 max-w-5xl mx-auto text-center md:text-left mt-16 md:mt-24"
          style={{ transform: \`translate3d(calc(var(--mx, 0) * -30px), calc(var(--my, 0) * -30px), 0)\` }}
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

        {/* Tool Logos Scattered */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-60 md:opacity-100">
          <FloatingLogo bg="bg-[#f7df1e]" color="text-black" icon={<SiJavascript className="w-8 h-8 md:w-12 md:h-12" />} rotate="-rotate-[15deg]" positionClasses="top-[10%] md:top-[15%] left-[2%] md:left-[5%]" parallaxSpeed={40} />
          <FloatingLogo bg="bg-[#282c34]" color="text-[#61dafb]" icon={<SiReact className="w-8 h-8 md:w-12 md:h-12" />} rotate="rotate-[20deg]" positionClasses="top-[20%] md:top-[25%] right-[2%] md:right-[5%]" parallaxSpeed={-60} />
          <FloatingLogo bg="bg-[#000000]" color="text-white" icon={<SiNextdotjs className="w-8 h-8 md:w-12 md:h-12" />} rotate="-rotate-6" positionClasses="bottom-[10%] md:bottom-[15%] right-[5%] md:right-[10%]" parallaxSpeed={25} />
          <FloatingLogo bg="bg-[#00005b]" color="text-[#9999ff]" text="Ae" rotate="-rotate-[20deg]" positionClasses="top-[15%] md:top-[20%] right-[25%] md:right-[35%]" parallaxSpeed={50} />
          <FloatingLogo bg="bg-[#00005b]" color="text-[#ea77ff]" text="Pr" rotate="rotate-[25deg]" positionClasses="top-[75%] md:top-[80%] right-[5%] md:right-[15%]" parallaxSpeed={-70} />
          <FloatingLogo bg="bg-white" color="text-[#38bdf8]" icon={<SiTailwindcss className="w-8 h-8 md:w-12 md:h-12" />} rotate="rotate-[15deg]" positionClasses="top-[55%] md:top-[60%] right-[2%] md:right-[5%]" parallaxSpeed={-35} />
          <FloatingLogo bg="bg-white" color="text-[#339933]" icon={<SiNodedotjs className="w-8 h-8 md:w-12 md:h-12" />} rotate="rotate-12" positionClasses="top-[40%] md:top-[50%] left-[5%] md:left-[8%]" parallaxSpeed={-20} />
          <FloatingLogo bg="bg-black" color="text-white" icon={<FigmaLogo className="w-8 h-8 md:w-12 md:h-12" />} rotate="-rotate-12" positionClasses="bottom-[15%] md:bottom-[20%] left-[3%] md:left-[8%] hidden md:block" parallaxSpeed={55} />
        </div>
      </section>

      {/* --- SECTION 2: IMPACT STATEMENT --- */}
      <section className="relative w-full flex flex-col justify-center items-center text-center px-margin-mobile md:px-margin-desktop py-24 md:py-48 z-10 overflow-hidden">
        <div 
          className="absolute top-10 left-10 md:left-1/4 w-64 h-64 bg-cobalt border-4 border-on-background rounded-full mix-blend-multiply opacity-30 blur-3xl animate-pulse"
          style={{ transform: \`translate3d(calc(var(--mx, 0) * 60px), calc(var(--my, 0) * 60px), 0)\` }}
        ></div>
        <div 
          className="absolute bottom-10 right-10 md:right-1/4 w-96 h-96 bg-primary-container border-4 border-on-background mix-blend-multiply opacity-20 blur-3xl animate-pulse delay-700"
          style={{ transform: \`translate3d(calc(var(--mx, 0) * -60px), calc(var(--my, 0) * -60px), 0)\` }}
        ></div>

        <div className="absolute top-0 left-[5%] md:left-[10%] origin-top z-40 pointer-events-none" style={{ transformOrigin: 'top center' }}>
          <div 
            className="origin-top flex flex-col items-center cursor-pointer px-8 pointer-events-auto" 
            style={{ 
              transformOrigin: 'top center',
              animation: isBulbHit ? 'bulb-hit 2s ease-in-out forwards' : 'none'
            }}
            onMouseEnter={handleBulbHit}
            onClick={handleBulbHit}
          >
            <div className="w-2 bg-on-background h-32 md:h-[250px] mx-auto shadow-[4px_0_0_0_#1b1c15]"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-on-background bg-surface-variant mx-auto -mt-1 relative z-20 shadow-[4px_4px_0_0_#1b1c15] flex flex-col justify-evenly">
              <div className="w-full h-[2px] bg-on-background opacity-40"></div>
              <div className="w-full h-[2px] bg-on-background opacity-40"></div>
            </div>
            <div className="w-10 h-10 md:w-16 md:h-16 border-4 border-on-background rounded-full mx-auto -mt-2 relative flex flex-col items-center justify-center bg-surface-container-high shadow-[4px_4px_0_0_#1b1c15] animate-[bulb-glow_0.1s_linear_2.2s_forwards] overflow-hidden">
              <div className="w-4 h-4 md:w-6 md:h-6 border-4 border-on-background rounded-t-full border-b-0 absolute bottom-1 md:bottom-2 opacity-80"></div>
            </div>
          </div>
        </div>

        <div 
          className="absolute inset-0 pointer-events-none opacity-30 md:opacity-100 scale-75 md:scale-100 will-change-transform"
          style={{ transform: \`translate3d(calc((var(--mx, 0) * 80px) + (var(--scrollY) * -0.15)), calc((var(--my, 0) * 80px) + (var(--scrollY) * -0.15)), 0)\` }}
        >
          <span className="absolute top-[15%] md:top-[25%] right-[5%] md:right-[20%] bg-cobalt text-on-primary border-4 border-on-background px-4 md:px-6 py-1 md:py-2 font-headline-md text-headline-md uppercase rotate-6 neo-shadow drop-shadow-[8px_8px_0_#1b1c15]">FAST</span>
          <span className="absolute bottom-[20%] md:bottom-[30%] left-[5%] md:left-[15%] bg-secondary-container text-on-secondary border-4 border-on-background px-4 md:px-6 py-1 md:py-2 font-headline-md text-headline-md uppercase -rotate-12 neo-shadow drop-shadow-[8px_8px_0_#1b1c15]">KINETIC</span>
          <span className="absolute top-[70%] md:top-[50%] left-[10%] md:left-[10%] bg-primary-container text-on-background border-4 border-on-background px-4 md:px-6 py-1 md:py-2 font-headline-md text-headline-md uppercase rotate-3 neo-shadow drop-shadow-[8px_8px_0_#1b1c15]">LOUD</span>
        </div>

        <div 
          className="relative z-20 max-w-4xl mx-auto"
          style={{ transform: \`translate3d(calc(var(--mx, 0) * -40px), calc(var(--my, 0) * -40px), 0)\` }}
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
                <div style={{ width: 14, height: 14, background: '#ffcc00', border: '1px solid #000', display: 'flex', alignItems: 'center', justify-center: 'center', fontSize: 9 }}>⚡</div>
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
      </section>

      {/* --- SECTION 3: ROADMAP / FLOW --- */}
      <section className="relative w-full flex flex-col justify-start items-center text-left pt-12 md:pt-24 px-margin-mobile md:px-margin-desktop pb-32 z-20 overflow-hidden">
        
        {/* Mario Depth Parallax Layers */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div 
            className="absolute inset-0 opacity-30 will-change-transform"
            style={{ transform: \`translate3d(calc(var(--mx, 0) * -2px), calc(var(--my, 0) * -2px), 0) translateY(calc(var(--scrollY) * -0.05))\` }}
          >
            <div className="absolute top-[10%] left-[15%] -rotate-12 scale-75"><MarioPipe /></div>
            <div className="absolute top-[35%] right-[25%] rotate-[25deg] scale-50"><MarioCoin /></div>
            <div className="absolute top-[65%] left-[8%] -rotate-6 scale-90"><MarioBrick /></div>
            <div className="absolute top-[85%] right-[12%] rotate-12 scale-75"><MarioQuestion /></div>
          </div>
          <div 
            className="absolute inset-0 opacity-50 will-change-transform"
            style={{ transform: \`translate3d(calc(var(--mx, 0) * -4px), calc(var(--my, 0) * -4px), 0) translateY(calc(var(--scrollY) * -0.15))\` }}
          >
            <div className="absolute top-[5%] left-[30%] rotate-6 scale-90"><MarioCoin /></div>
            <div className="absolute top-[45%] right-[8%] -rotate-[15deg] scale-100"><MarioPipe /></div>
            <div className="absolute top-[75%] left-[25%] rotate-[30deg] scale-75"><MarioCoin /></div>
            <div className="absolute top-[90%] right-[35%] -rotate-12 scale-90"><MarioBrick /></div>
          </div>
          <div 
            className="absolute inset-0 opacity-80 will-change-transform"
            style={{ transform: \`translate3d(calc(var(--mx, 0) * -7px), calc(var(--my, 0) * -7px), 0) translateY(calc(var(--scrollY) * -0.3))\` }}
          >
            <div className="absolute top-[15%] right-[15%] rotate-12 scale-110"><MarioQuestion /></div>
            <div className="absolute top-[28%] left-[5%] -rotate-12 scale-125"><MarioBrick /></div>
            <div className="absolute top-[55%] left-[18%] rotate-6 scale-110"><MarioQuestion /></div>
            <div className="absolute top-[80%] right-[6%] -rotate-[20deg] scale-125"><MarioPipe /></div>
          </div>
        </div>

        <div className="relative z-20 w-full max-w-6xl mx-auto"
          style={{ transform: \`translate3d(calc(var(--mx, 0) * -20px), calc(var(--my, 0) * -20px), 0)\` }}>
          
          <h2 className="font-display-xl text-headline-lg-mobile md:text-display-xl uppercase leading-none mb-2 text-center">
            HOW I <span className="bg-primary-container text-on-background px-4 py-1 inline-block -rotate-2 border-[4px] border-on-background shadow-[4px_4px_0_0_#1b1c15] md:shadow-[8px_8px_0_0_#1b1c15]">WORK</span>
          </h2>

          <div ref={roadmapRef} className="w-full h-auto min-h-[1100px] md:min-h-[850px] max-w-6xl mx-auto relative mt-8 pb-8">
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
                strokeDashoffset="var(--rp-pct)"
                className="drop-shadow-[0_0_8px_var(--color-cobalt)] opacity-80 transition-[stroke-dashoffset] duration-75 ease-out"
              />
            </svg>

            {[
              { title: "The Brain Dump", icon: <PixelIcon art={coffeeArt} color="#ccff00" className="w-8 h-8 md:w-10 md:h-10" />, bg: "bg-cobalt text-on-primary", copy: "We hop on a call and you share your vision. I take detailed notes and promise not to judge your rough sketches.", top: "5%", leftClasses: "left-[4%] md:left-1/2", rotate: "rotate-6" },
              { title: "The Workshop", icon: <PixelIcon art={hammerArt} color="#ffffff" className="w-8 h-8 md:w-10 md:h-10" />, bg: "bg-secondary text-on-secondary", copy: "I put my headphones on and get to work. Whether it's code, keyframes, or layouts, this is where the puzzle pieces start fitting together.", top: "27%", leftClasses: "left-[4%] md:left-12", rotate: "-rotate-3" },
              { title: "The Polish", icon: <PixelIcon art={starArt} color="#ffcc00" className="w-8 h-8 md:w-10 md:h-10" />, bg: "bg-primary-container text-on-background", copy: "We review the draft together. I tweak the details and fix that one tiny thing that only we will ever notice.", top: "50%", leftClasses: "left-[4%] md:left-1/2", rotate: "rotate-6" },
              { title: "The Handoff", icon: <PixelIcon art={rocketArt} color="#ccff00" className="w-8 h-8 md:w-10 md:h-10" />, bg: "bg-on-background text-background", copy: "The final product is packaged up and ready to go. You get the deliverables, and I take a very well-deserved nap.", top: "73%", leftClasses: "left-[4%] md:left-1/4", rotate: "-rotate-6" }
            ].map((step, idx) => (
              <div key={idx} 
                className={\`absolute \${step.leftClasses} w-[92%] md:w-[45%] group z-10 \${step.rotate}\`}
                style={{ top: step.top }}
              >
                <div className={\`border-4 border-on-background p-3 md:p-6 bg-background neo-shadow\`}>
                  <div className="flex items-center gap-3 md:gap-4 mb-2 border-b-4 border-on-background pb-2">
                    <span className={\`flex-shrink-0 \${step.bg} border-4 border-on-background w-12 h-12 md:w-16 md:h-16 flex items-center justify-center neo-shadow -rotate-12 scale-110\`}>
                      {step.icon}
                    </span>
                    <h3 className="font-headline-md text-[16px] md:text-[26px] uppercase leading-tight">{step.title}</h3>
                  </div>
                  <p className="font-label-mono text-[12px] md:text-label-mono text-on-surface-variant pt-2">
                    <span className="text-cobalt mr-2">&gt;</span> {step.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
`;

fs.writeFileSync('src/components/Hero.jsx', topImportsAndComponents + newHero);
console.log("Successfully added depth parallax back to Hero.jsx!");
