const getToolColor = (toolName) => {
  const t = toolName.trim().toLowerCase();
  if (t.includes('react')) return { bg: '#61dafb', text: '#000' };
  if (t.includes('next')) return { bg: '#000', text: '#fff' };
  if (t.includes('tailwind')) return { bg: '#38bdf8', text: '#000' };
  if (t.includes('figma')) return { bg: '#f24e1e', text: '#fff' };
  if (t.includes('after effects') || t.includes('ae')) return { bg: '#9999ff', text: '#000' };
  if (t.includes('premiere')) return { bg: '#ea77ff', text: '#000' };
  if (t.includes('photoshop')) return { bg: '#31a8ff', text: '#000' };
  if (t.includes('illustrator')) return { bg: '#ff9a00', text: '#000' };
  if (t.includes('google')) return { bg: '#ccff00', text: '#000' };
  if (t.includes('node')) return { bg: '#339933', text: '#fff' };
  
  const colors = [
    { bg: '#ff99cc', text: '#000' },
    { bg: '#ccff99', text: '#000' },
    { bg: '#ffcc99', text: '#000' },
    { bg: '#0055ff', text: '#fff' },
    { bg: '#00e5ff', text: '#000' },
    { bg: '#ff3366', text: '#fff' },
    { bg: '#c4b5fd', text: '#000' },
    { bg: '#fcd34d', text: '#000' }
  ];
  let hash = 0;
  for (let i = 0; i < t.length; i++) hash = t.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function Work({ works = [] }) {
  // If no works passed, we can show a placeholder or empty state
  // But ideally the DB has the works
  return (
    <section className="px-margin-mobile md:px-margin-desktop pt-16 pb-48 bg-surface-container-low relative z-20 border-t-4 border-on-background" id="work">
      <div className="flex items-end justify-between mb-16 border-b-8 border-on-background pb-4 relative">
        <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase flex items-center gap-4">SELECTED <span className="bg-primary-container px-2 border-4 border-on-background -rotate-2 inline-block">WORK</span><span className="material-symbols-outlined text-cobalt text-5xl rotate-90 hidden md:block">south</span></h2>
        <div className="hidden md:block absolute -right-10 -bottom-10 w-24 h-24 bg-dots rounded-full border-4 border-on-background flex items-center justify-center"><span className="material-symbols-outlined text-4xl animate-bounce">arrow_downward</span></div>
      </div>
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 pt-10">
        {works.map((work, index) => {
          // Dynamic rotation based on index to keep the neobrutalist staggered look
          const rotations = ['-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3']
          const rotationClass = rotations[index % rotations.length]
          
          return (
            <article key={work.id} className={`bg-background border-4 border-on-background neo-shadow neo-shadow-blue hover:-translate-y-2 transition-all duration-300 ${rotationClass} hover:rotate-0 flex flex-col group relative z-10 hover:z-20 ${index % 2 !== 0 ? 'md:mt-8' : ''}`}>
              <div className={`aspect-square border-b-4 border-on-background overflow-hidden relative bg-surface-variant p-4`}>
                {(() => {
                  const urlParts = work.imageUrl.split('#pos=');
                  const src = urlParts[0];
                  const [posX, posY, scale] = urlParts[1] ? urlParts[1].split(',') : ['50', '50', '100'];
                  const objectPosition = `${posX}% ${posY}%`;
                  const S = parseInt(scale) / 100;
                  const maxShift = ((S - 1) / 2) * 100;
                  const shiftX = ((50 - parseInt(posX)) / 50) * maxShift;
                  const shiftY = ((50 - parseInt(posY)) / 50) * maxShift;
                  const transform = `scale(${S}) translate(${shiftX}%, ${shiftY}%)`;
                  
                  return (
                    <div className="w-full h-full border-2 border-on-background overflow-hidden relative bg-surface-variant flex items-center justify-center">
                      {work.mediaType === 'video' ? (
                        <video 
                          className="w-full h-full object-contain transition-all duration-500" 
                          src={src} 
                          style={{ transform }}
                          autoPlay muted loop playsInline 
                        />
                      ) : (
                        <img 
                          className="w-full h-full object-contain transition-all duration-500" 
                          alt={work.title} 
                          src={src} 
                          style={{ transform }}
                        />
                      )}
                    </div>
                  );
                })()}
                {work.liveUrl && (
                  <div className="absolute top-4 right-4 bg-primary-container border-2 border-on-background shadow-[2px_2px_0_0_#000] px-2 py-0.5 font-label-mono text-[10px] rotate-6 uppercase">
                    LIVE
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col bg-dots bg-opacity-10">
                <h3 className="font-headline-md text-lg uppercase mb-1 group-hover:text-cobalt transition-colors line-clamp-1">{work.title}</h3>
                <p className="font-body-md text-xs mb-2 line-clamp-2">{work.description}</p>
                <div className="mt-auto flex justify-between items-center border-t-2 border-on-background pt-2 border-dashed">
                  <div className="flex gap-1.5 flex-wrap max-w-[75%]">
                    {work.tools.split(',').slice(0, 3).map((tool, i) => {
                      const color = getToolColor(tool);
                      return (
                        <span key={i} style={{ backgroundColor: color.bg, color: color.text }} className="border-2 border-on-background shadow-[2px_2px_0_0_#000] px-1.5 py-0.5 font-label-mono text-[9px] uppercase flex items-center gap-1 whitespace-nowrap">
                          <span className="material-symbols-outlined text-[10px]">code</span>{tool.trim()}
                        </span>
                      );
                    })}
                    {work.tools.split(',').length > 3 && (
                       <span className="text-[9px] font-label-mono text-on-surface-variant flex items-center">+{work.tools.split(',').length - 3}</span>
                    )}
                  </div>
                  {(work.projectUrl || work.liveUrl) && (
                    <a href={work.projectUrl || work.liveUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-on-background text-background flex items-center justify-center rounded-none hover:bg-cobalt hover:text-on-primary border-2 border-transparent hover:border-on-background transition-colors text-xl shrink-0">
                      <span className="material-symbols-outlined text-2xl">north_east</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}
        </div>
      </div>
    </section>
  );
}
