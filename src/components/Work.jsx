export default function Work({ works = [] }) {
  // If no works passed, we can show a placeholder or empty state
  // But ideally the DB has the works
  return (
    <section className="px-margin-mobile md:px-margin-desktop pt-16 pb-48 bg-surface-container-low relative z-20 border-t-4 border-on-background" id="work">
      <div className="flex items-end justify-between mb-16 border-b-8 border-on-background pb-4 relative">
        <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase flex items-center gap-4">SELECTED <span className="bg-primary-container px-2 border-4 border-on-background -rotate-2 inline-block">WORK</span><span className="material-symbols-outlined text-cobalt text-5xl rotate-90 hidden md:block">south</span></h2>
        <div className="hidden md:block absolute -right-10 -bottom-10 w-24 h-24 bg-dots rounded-full border-4 border-on-background flex items-center justify-center"><span className="material-symbols-outlined text-4xl animate-bounce">arrow_downward</span></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20 pt-10">
        {works.map((work, index) => {
          // Dynamic rotation based on index to keep the neobrutalist staggered look
          const rotations = ['-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3']
          const rotationClass = rotations[index % rotations.length]
          
          // Different background patterns
          const bgPatterns = ['bg-grid-pattern', '', 'bg-dots bg-opacity-10']
          const patternClass = bgPatterns[index % bgPatterns.length]
          
          // Background colors for the image container
          const imageBgColors = ['bg-surface-variant', 'bg-on-background', 'bg-primary-container']
          const imgBgClass = imageBgColors[index % imageBgColors.length]
          
          return (
            <article key={work.id} className={`bg-background border-4 border-on-background neo-shadow neo-shadow-blue hover:-translate-y-2 transition-all duration-300 ${rotationClass} hover:rotate-0 flex flex-col h-full group relative z-10 hover:z-20 ${index % 2 !== 0 ? 'md:mt-12' : ''}`}>
              <div className={`aspect-video border-b-4 border-on-background overflow-hidden relative ${imgBgClass} p-6`}>
                {work.mediaType === 'video' ? (
                  <video 
                    className="w-full h-full object-cover border-2 border-on-background transition-all duration-500" 
                    src={work.imageUrl} 
                    autoPlay muted loop playsInline 
                  />
                ) : (
                  <img 
                    className="w-full h-full object-cover border-2 border-on-background transition-all duration-500" 
                    alt={work.title} 
                    src={work.imageUrl} 
                  />
                )}
                {work.liveUrl && (
                  <div className="absolute top-8 right-8 bg-primary-container border-2 border-on-background px-3 py-1 font-label-mono text-label-mono rotate-6 uppercase">
                    LIVE
                  </div>
                )}
              </div>
              <div className={`p-8 flex flex-col flex-grow ${patternClass}`}>
                <h3 className="font-headline-md text-headline-md uppercase mb-2 group-hover:text-cobalt transition-colors">{work.title}</h3>
                <p className="font-body-md text-body-md mb-8">{work.description}</p>
                <div className="mt-auto flex justify-between items-center border-t-4 border-on-background pt-6 border-dashed">
                  <div className="flex gap-2 flex-wrap max-w-[70%]">
                    {work.tools.split(',').map((tool, i) => (
                      <span key={i} className="bg-cobalt text-on-primary border-2 border-on-background px-2 py-1 font-label-mono text-[10px] uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">code</span>{tool.trim()}
                      </span>
                    ))}
                  </div>
                  {(work.projectUrl || work.liveUrl) && (
                    <a href={work.projectUrl || work.liveUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-on-background text-background flex items-center justify-center rounded-none hover:bg-cobalt hover:text-on-primary border-2 border-transparent hover:border-on-background transition-colors text-2xl">
                      <span className="material-symbols-outlined text-3xl">north_east</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  );
}
