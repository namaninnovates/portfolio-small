import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'About | IAMNAMANG',
  description: 'Creative by design, editor by craft, dev by choice.',
}

const MinecraftPickaxe = () => {
  const pixels = [
    "0000000000111110",
    "0000000001333321",
    "0000000013222221",
    "0000000132211121",
    "0000001322100121",
    "0000013221014111",
    "0000132110145100",
    "0001321001451000",
    "0013210014510000",
    "0132100145100000",
    "0121001451000000",
    "0110014510000000",
    "0000145100000000",
    "0001451000000000",
    "0014510000000000",
    "0011100000000000",
  ];
  const colors = {
    '0': 'transparent',
    '1': '#212121',
    '2': '#33EBCB',
    '3': '#A1FEE3',
    '4': '#8B4513',
    '5': '#5C3A21',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gridTemplateRows: 'repeat(16, 1fr)', width: '100%', height: '100%' }}>
      {pixels.map((row, y) => 
        row.split('').map((char, x) => (
          <div key={`${x}-${y}`} style={{ backgroundColor: colors[char] }} />
        ))
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background overflow-x-hidden selection:bg-cobalt selection:text-white">
        
        {/* 1. Hero Header (Split Layout) */}
      <section className="px-margin-mobile md:px-margin-desktop pt-24 pb-20 md:pt-32 md:pb-32 border-b-8 border-on-background bg-surface-container-low relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-container rounded-full mix-blend-multiply opacity-50 blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary-container mix-blend-multiply opacity-40 blur-3xl -z-10"></div>
        
        {/* Minecraft Mining Scene */}
        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20 flex items-end gap-0 group pointer-events-none">
          <style>{`
            @keyframes mine-swing {
              0%, 100% { transform: rotate(0deg); } /* Relaxed, pointing top-right */
              20% { transform: rotate(20deg); } /* Wind up (pull back right) */
              40% { transform: rotate(-60deg); } /* Impact! (swing left) */
              50% { transform: rotate(-65deg); } /* Follow through */
              80% { transform: rotate(0deg); } /* Recover */
            }
            @keyframes block-impact {
              0%, 38%, 100% { transform: translateX(0) scale(1); filter: brightness(1); }
              40% { transform: translateX(2px) scale(0.95); filter: brightness(1.4) drop-shadow(0 0 15px #7000FF); }
              45% { transform: translateX(-2px) scale(0.98); }
              50% { transform: translateX(1px) scale(1); filter: brightness(1); }
            }
            @keyframes chip-fly-1 {
              0%, 39% { opacity: 0; transform: translate(0, 0) scale(0) rotate(0); }
              40% { opacity: 1; transform: translate(0, 0) scale(1.5) rotate(0); }
              70% { opacity: 0; transform: translate(-30px, -40px) scale(0.5) rotate(-180deg); }
              100% { opacity: 0; }
            }
            @keyframes chip-fly-2 {
              0%, 39% { opacity: 0; transform: translate(0, 0) scale(0) rotate(0); }
              40% { opacity: 1; transform: translate(0, 0) scale(1.2) rotate(0); }
              70% { opacity: 0; transform: translate(-10px, -50px) scale(0.5) rotate(90deg); }
              100% { opacity: 0; }
            }
            @keyframes chip-fly-3 {
              0%, 39% { opacity: 0; transform: translate(0, 0) scale(0) rotate(0); }
              40% { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); }
              70% { opacity: 0; transform: translate(20px, -30px) scale(0.5) rotate(180deg); }
              100% { opacity: 0; }
            }
          `}</style>
          
          <div className="relative">
            {/* The Obsidian Block */}
            <div className="w-24 h-24 md:w-36 md:h-36 bg-[#150D22] border-4 md:border-8 border-[#000] relative overflow-hidden shadow-[6px_6px_0_#000] md:shadow-[10px_10px_0_#000] animate-[block-impact_1.2s_infinite]">
              <div className="absolute top-2 left-2 w-4 h-4 bg-[#38205E]"></div>
              <div className="absolute bottom-4 right-2 w-6 h-4 bg-[#24153D]"></div>
              <div className="absolute top-10 right-6 w-3 h-3 bg-[#47297A]"></div>
              <div className="absolute bottom-2 left-6 w-8 h-3 bg-[#38205E]"></div>
              <div className="absolute top-0 left-0 w-full h-full border-[3px] md:border-[4px] border-[#38205E] mix-blend-overlay"></div>
            </div>

            {/* Flying Chips & Dust */}
            <div className="absolute top-0 right-0 w-6 h-6 bg-[#47297A] border-2 md:border-4 border-[#000] animate-[chip-fly-1_1.2s_infinite] z-30"></div>
            <div className="absolute top-4 right-4 w-4 h-4 bg-[#33EBCB] border-2 border-[#000] animate-[chip-fly-2_1.2s_infinite] z-30"></div>
            <div className="absolute top-8 right-[-15px] w-5 h-5 bg-[#38205E] border-2 md:border-4 border-[#000] animate-[chip-fly-3_1.2s_infinite] z-30"></div>
          </div>

          {/* The Diamond Pickaxe */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 origin-bottom-left ml-[-15px] animate-[mine-swing_1.2s_infinite_ease-in-out] z-30 drop-shadow-[4px_4px_0_#000] md:drop-shadow-[8px_8px_0_#000]">
            <MinecraftPickaxe />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10">
          
          {/* Left Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-primary-container border-4 border-on-background px-4 py-1 font-label-mono text-label-mono uppercase -rotate-2 mb-8 neo-shadow">
              ABOUT THE MAKER
            </div>
            <h1 className="font-display-xl text-5xl md:text-7xl uppercase leading-[1.1] md:leading-none mb-8 tracking-tighter text-on-background">
              I DON&apos;T JUST MAKE THINGS <span className="text-secondary-container drop-shadow-[4px_4px_0_#000] stroke-on-background" style={{ WebkitTextStroke: '2px #000' }}>LOOK GOOD.</span><br />
              I MAKE THEM <span className="bg-on-background text-background px-4 py-1 inline-block rotate-2">WORK.</span>
            </h1>
            <p className="font-body-lg text-lg md:text-xl max-w-2xl bg-background border-l-8 border-cobalt pl-6 py-2">
              Based in the digital trenches. I edit videos that move the needle and build websites that break the grid. Punchy, fast, and unapologetically loud.
            </p>
          </div>

          {/* Right Image Placeholder */}
          <div className="flex-1 w-full max-w-md relative group">
            <div className="absolute inset-0 bg-cobalt translate-x-4 translate-y-4 border-4 border-on-background"></div>
            <div className="relative aspect-[3/4] bg-surface-variant border-4 border-on-background overflow-hidden flex items-center justify-center bg-dots bg-opacity-20 group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-300">
              {/* Replace with an actual <img> tag when you have a photo */}
              <div className="text-center p-8">
                <span className="material-symbols-outlined text-7xl text-on-background opacity-20 mb-4 block">person</span>
                <span className="font-label-mono text-sm uppercase text-on-background opacity-50 block rotate-12">INSERT EPIC<br/>PHOTO HERE</span>
              </div>
            </div>
            {/* Decorative Brutalist Elements */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-secondary text-on-secondary rounded-full border-4 border-on-background flex items-center justify-center animate-spin-slow neo-shadow">
              <span className="font-label-mono text-[10px] uppercase text-center leading-tight">100%<br/>REAL</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Manifesto / Philosophy Block */}
      <section className="bg-on-background text-background px-margin-mobile md:px-margin-desktop py-24 md:py-32 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="material-symbols-outlined text-6xl text-primary-container mb-8">emergency</span>
          <h2 className="font-display-xl text-4xl md:text-6xl uppercase mb-12 text-primary-container">
            NO NOISE. JUST SIGNAL.
          </h2>
          <div className="font-label-mono text-lg md:text-2xl leading-relaxed text-left md:text-center space-y-8">
            <p>
              My philosophy is simple: cut the fluff. The internet is already full of boring, templated garbage. 
            </p>
            <p>
              Whether it&apos;s a fast-paced brand campaign or a full-stack Next.js web application, I believe in high-impact deliverables that grab attention and refuse to let go.
            </p>
            <p className="text-secondary-container border-t-2 border-dashed border-background/20 pt-8 mt-8">
              &gt;_ I don&apos;t build minimum viable products. I build maximum viable experiences.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Skills & Toolkit Grid */}
      <section className="px-margin-mobile md:px-margin-desktop py-24 md:py-32 bg-dots bg-opacity-10 border-b-8 border-on-background relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16 border-b-8 border-on-background pb-4">
            <h2 className="font-display-xl text-4xl md:text-6xl uppercase flex items-center gap-4">THE <span className="bg-secondary-container px-2 border-4 border-on-background -rotate-2 inline-block">TOOLKIT</span></h2>
            <span className="material-symbols-outlined text-5xl rotate-45 hidden md:block">build</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Frontend */}
            <div className="bg-background border-4 border-on-background p-8 neo-shadow neo-shadow-blue hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-cobalt text-white border-4 border-on-background rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">code</span>
              </div>
              <h3 className="font-headline-md text-2xl uppercase mb-4">Full Stack Web Dev</h3>
              <p className="font-body-md mb-6">Building lightning-fast, highly interactive web applications from front to back.</p>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind', 'REST/GraphQL'].map(skill => (
                  <span key={skill} className="border-2 border-on-background px-2 py-1 font-label-mono text-xs uppercase bg-surface-container-high">{skill}</span>
                ))}
              </div>
            </div>

            {/* Video Editing */}
            <div className="bg-background border-4 border-on-background p-8 neo-shadow neo-shadow-blue hover:-translate-y-2 transition-transform md:mt-8">
              <div className="w-16 h-16 bg-primary-container text-on-background border-4 border-on-background rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">movie</span>
              </div>
              <h3 className="font-headline-md text-2xl uppercase mb-4">Video Editing</h3>
              <p className="font-body-md mb-6">Crafting high-retention, fast-paced edits for brands and creators.</p>
              <div className="flex flex-wrap gap-2">
                {['Premiere Pro', 'After Effects', 'Gen AI', 'Motion Graphics', 'Color Grading'].map(skill => (
                  <span key={skill} className="border-2 border-on-background px-2 py-1 font-label-mono text-xs uppercase bg-surface-container-high">{skill}</span>
                ))}
              </div>
            </div>

            {/* Design */}
            <div className="bg-background border-4 border-on-background p-8 neo-shadow neo-shadow-blue hover:-translate-y-2 transition-transform md:mt-16">
              <div className="w-16 h-16 bg-secondary-container text-on-background border-4 border-on-background rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">draw</span>
              </div>
              <h3 className="font-headline-md text-2xl uppercase mb-4">UI/UX Design</h3>
              <p className="font-body-md mb-6">Designing aggressive, brutalist interfaces that stand out.</p>
              <div className="flex flex-wrap gap-2">
                {['Figma', 'Gen AI', 'Neobrutalism', 'Prototyping', 'Wireframing'].map(skill => (
                  <span key={skill} className="border-2 border-on-background px-2 py-1 font-label-mono text-xs uppercase bg-surface-container-high">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



        <Footer />
      </main>
    </>
  )
}
