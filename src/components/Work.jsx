"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const LazyVideo = ({ src, trimStart, trimEnd, transform, className }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.defaultMuted = true;
    el.muted = true;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!el.getAttribute('src')) {
                el.setAttribute('src', src);
              }
              // Add a small delay to prevent play/pause thrashing while scrolling fast
              setTimeout(() => {
                if (videoRef.current && !videoRef.current.paused === false) {
                    const playPromise = el.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {});
                    }
                }
              }, 50);
            } else {
              el.pause();
            }
          });
        },
        { rootMargin: '300px' }
      );
      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    } else {
      if (!el.getAttribute('src')) {
        el.setAttribute('src', src);
      }
      el.play().catch(()=>{});
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={{ transform }}
      muted
      loop={trimEnd === 0}
      playsInline
      preload="none"
      onTimeUpdate={(e) => {
        if (trimEnd > 0 && e.target.currentTime >= trimEnd) {
          e.target.currentTime = trimStart || 0;
          e.target.play().catch(()=>{});
        } else if (trimStart > 0 && e.target.currentTime < trimStart) {
          e.target.currentTime = trimStart;
        }
      }}
    />
  );
};

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

export default function Work({ works = [], title = "SELECTED", showViewAll = false, enableVideoPopup = false, variant = "light" }) {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className={`px-margin-mobile md:px-margin-desktop pt-16 pb-48 relative z-20 border-t-4 border-on-background ${variant === 'dark' ? 'bg-on-background bg-grid-pattern-primary' : 'bg-surface-container-low'}`} id="work">
      {/* CSS to hide Safari/Chrome default large play button on blocked autoplays */}
      <style dangerouslySetInnerHTML={{__html: `
        video::-webkit-media-controls-start-playback-button,
        video::-webkit-media-controls-play-button,
        video::-webkit-media-controls {
          display: none !important;
          -webkit-appearance: none;
        }
      `}} />
      <div className={`flex items-end justify-between mb-16 border-b-8 pb-4 relative ${variant === 'dark' ? 'border-background' : 'border-on-background'}`}>
        <h2 className={`font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase flex items-center gap-4 ${variant === 'dark' ? 'text-background' : 'text-on-background'}`}>{title} <span className={`bg-primary-container text-on-background px-2 border-4 -rotate-2 inline-block ${variant === 'dark' ? 'border-background' : 'border-on-background'}`}>WORK</span><span className="material-symbols-outlined text-cobalt text-5xl rotate-90 hidden md:block">south</span></h2>
        <div className={`hidden md:block absolute -right-10 -bottom-10 w-24 h-24 rounded-full border-4 flex items-center justify-center ${variant === 'dark' ? 'bg-primary-container text-on-background border-background' : 'bg-dots border-on-background'}`}><span className="material-symbols-outlined text-4xl animate-bounce">arrow_downward</span></div>
      </div>
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 pt-10">
        {works.map((work, index) => {
          const rotations = ['-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3']
          const rotationClass = rotations[index % rotations.length]
          
          return (
            <article key={work.id} className={`bg-background bg-dots border-4 border-on-background neo-shadow neo-shadow-blue hover:-translate-y-2 transition-all duration-300 ${rotationClass} hover:rotate-0 flex flex-col group relative z-10 hover:z-20 ${index % 2 !== 0 ? 'md:mt-8' : ''}`}>
              <div className={`aspect-square border-b-4 border-on-background overflow-hidden relative p-4`}>
                {(() => {
                  const urlParts = work.imageUrl.split('#pos=');
                  const src = urlParts[0];
                  
                  const srcUrlParts = src.split('#t=');
                  let trimStart = 0;
                  let trimEnd = 0;
                  if (srcUrlParts[1]) {
                    const times = srcUrlParts[1].split(',');
                    trimStart = parseFloat(times[0]) || 0;
                    trimEnd = parseFloat(times[1]) || 0;
                  }

                  const [posX, posY, scale] = urlParts[1] ? urlParts[1].split(',') : ['50', '50', '100'];
                  const objectPosition = `${posX}% ${posY}%`;
                  const S = parseInt(scale) / 100;
                  const maxShift = ((S - 1) / 2) * 100;
                  const shiftX = ((50 - parseInt(posX)) / 50) * maxShift;
                  const shiftY = ((50 - parseInt(posY)) / 50) * maxShift;
                  const transform = `scale(${S}) translate(${shiftX}%, ${shiftY}%)`;
                  
                  return (
                    <div className="w-full h-full border-2 border-on-background overflow-hidden relative flex items-center justify-center bg-background">
                      {work.mediaType === 'video' ? (
                        <LazyVideo
                          src={src}
                          trimStart={trimStart}
                          trimEnd={trimEnd}
                          transform={transform}
                          className="w-full h-full object-contain transition-all duration-500 pointer-events-none"
                        />
                      ) : (
                        <img 
                          className="w-full h-full object-contain transition-all duration-500 pointer-events-none" 
                          alt={work.title} 
                          src={src} 
                          loading="lazy"
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
              <div className="p-3 flex flex-col bg-transparent">
                <h3 className="font-headline-md text-lg uppercase mb-1 group-hover:text-cobalt transition-colors line-clamp-1">{work.title}</h3>
                <p className="font-body-md text-xs mb-2 line-clamp-2">{work.description}</p>
                <div className="mt-auto flex justify-between items-center border-t-2 border-on-background pt-2 border-dashed">
                  <div className="flex gap-1.5 flex-wrap max-w-[70%]">
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
                  <div className="flex gap-1">
                    {(enableVideoPopup && work.mediaType === 'video') && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveVideo(work.imageUrl.split('#pos=')[0]); }}
                        className="w-9 h-9 bg-primary-container text-on-background flex items-center justify-center border-2 border-on-background hover:bg-cobalt hover:text-white transition-colors"
                        title="Play Video"
                      >
                        <span className="material-symbols-outlined text-xl">play_arrow</span>
                      </button>
                    )}
                    {(work.projectUrl || work.liveUrl) && (
                      <a href={work.projectUrl || work.liveUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-on-background text-background flex items-center justify-center border-2 border-on-background hover:bg-cobalt hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                        <span className="material-symbols-outlined text-xl">north_east</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
        </div>
        
        {showViewAll && works.length > 0 && (
          <div className="mt-20 flex justify-center w-full">
            <Link href="/works" className="bg-primary-container border-4 border-on-background neo-shadow neo-shadow-blue hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all px-10 py-5 font-headline-md text-2xl uppercase flex items-center gap-3 group relative z-20">
              View All Works <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </Link>
          </div>
        )}
      </div>

      {/* Video Popup Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="bg-background border-4 border-on-background neo-shadow w-fit relative cursor-default flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mac-style Modal Header */}
            <div className="border-b-4 border-on-background px-4 py-3 flex justify-between items-center bg-primary-container shrink-0 w-full">
              <div className="flex gap-2 mr-8">
                <div className="w-3.5 h-3.5 rounded-full bg-error border-2 border-on-background"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-surface-variant border-2 border-on-background"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-cobalt border-2 border-on-background"></div>
              </div>
              <button 
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 bg-error border-2 border-on-background flex items-center justify-center hover:scale-110 transition-transform neo-shadow shrink-0"
              >
                <span className="material-symbols-outlined text-on-background text-sm font-bold">close</span>
              </button>
            </div>
            
            {/* Modal Video Player */}
            <div className="bg-background flex items-center justify-center overflow-hidden">
              <video 
                src={activeVideo} 
                controls 
                autoPlay 
                style={{ maxHeight: '55vh', maxWidth: '80vw' }}
                className="w-auto h-auto object-contain block"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
