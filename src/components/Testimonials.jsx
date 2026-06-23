"use client";
import React, { useRef, useEffect, useCallback } from 'react';

const testimonials = [
  {
    id: 1,
    name: "Mallika Singh",
    role: "Innovators Quest VIT AP",
    content: "The video was great and the corrections which i required were done spot on. There were no damage to brain cells in brainstorming for a good video. You delivered what you promised.",
    color: "bg-background",
    stars: 5,
  },
  {
    id: 2,
    name: "Dr. Grazelle",
    role: "Content Creator",
    content: "Great work! Follows instructions well! Service as described | Would recommend",
    color: "bg-background",
    stars: 5,
  },
  {
    id: 3,
    name: "Dr. Grazelle",
    role: "Content Creator",
    content: "Naman is very prompt with giving me updates on the progress of my video projects. He follows instructions well and revisions were very minimal. I asked him to do an editing style that he hasn't done before and he rose up to the challenge.",
    color: "bg-background",
    stars: 5,
  }
];

export default function Testimonials() {
  const carouselRef = useRef(null);
  const timerRef = useRef(null);

  const scroll = useCallback((direction) => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 320 : 420;
      
      if (direction === 'right') {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        // Loop back to start if at the end
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          return;
        }
      }
      
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      scroll('right');
    }, 4000);
  }, [scroll]);

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoScroll]);

  const handleManualScroll = (direction) => {
    scroll(direction);
    startAutoScroll(); // reset timer on manual click
  };

  return (
    <section className="px-margin-mobile md:px-margin-desktop py-32 bg-on-background text-background relative z-20 border-t-4 border-on-background overflow-hidden" id="testimonials">
      {/* Orange Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30" 
        style={{ 
          backgroundSize: '40px 40px', 
          backgroundImage: 'linear-gradient(to right, var(--color-secondary-container) 1px, transparent 1px), linear-gradient(to bottom, var(--color-secondary-container) 1px, transparent 1px)' 
        }}
      ></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 border-b-8 border-secondary-container pb-4 relative z-10 gap-6">
        <h2 className="font-display-xl text-headline-lg-mobile md:text-headline-lg uppercase flex items-center gap-4 text-background">
          CLIENT <span className="bg-secondary-container text-on-secondary-container px-4 py-1 border-4 border-background rotate-2 inline-block">LOVE</span>
        </h2>
        
        {/* Navigation Arrows */}
        <div className="flex gap-4 self-end md:self-auto relative z-20">
          <button 
            onClick={() => handleManualScroll('left')}
            className="w-14 h-14 bg-background border-4 border-background flex items-center justify-center hover:bg-secondary-container hover:border-secondary-container transition-colors group"
            aria-label="Previous Testimonial"
          >
            <span className="material-symbols-outlined text-3xl text-on-background group-hover:text-background transition-colors">arrow_back</span>
          </button>
          <button 
            onClick={() => handleManualScroll('right')}
            className="w-14 h-14 bg-background border-4 border-background flex items-center justify-center hover:bg-secondary-container hover:border-secondary-container transition-colors group"
            aria-label="Next Testimonial"
          >
            <span className="material-symbols-outlined text-3xl text-on-background group-hover:text-background transition-colors">arrow_forward</span>
          </button>
        </div>
      </div>
      
      <div className="max-w-[1300px] mx-auto relative z-10">
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-8 md:gap-12 pb-16 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 md:mx-0 md:px-0"
        >
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className={`w-[320px] md:w-[420px] aspect-square shrink-0 snap-center ${testimonial.color} text-on-background border-4 border-background neo-shadow flex flex-col relative group hover:-translate-y-2 hover:bg-primary-container transition-all duration-300 cursor-pointer`}
            >
              {/* Mac-style Window Buttons on ALL Cards */}
              <div className="border-b-4 border-on-background px-4 py-3 flex gap-2 bg-background group-hover:bg-primary-container transition-colors duration-300">
                <div className="w-3.5 h-3.5 rounded-full bg-error border-2 border-on-background"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-primary-container border-2 border-on-background"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-cobalt border-2 border-on-background"></div>
              </div>

              <div className="flex flex-col flex-grow p-8 bg-dots bg-opacity-20">
                <div className="absolute top-6 left-6 text-on-background opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-8xl">format_quote</span>
                </div>
                
                <p className="font-body-lg text-lg md:text-xl mb-6 mt-4 leading-relaxed relative z-10 font-bold flex-grow">
                  "{testimonial.content}"
                </p>

                <div className="flex justify-end gap-1 mb-6 relative z-10 w-full">
                  {[...Array(testimonial.stars || 5)].map((_, i) => (
                    <span 
                      key={i} 
                      className="text-2xl leading-none" 
                      style={{ 
                        color: '#ffcc00', 
                        WebkitTextStroke: '2px var(--color-on-background)',
                        filter: 'drop-shadow(3px 3px 0 var(--color-on-background))'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t-4 border-on-background border-dashed relative z-10 bg-inherit">
                  <div className="w-14 h-14 bg-on-background rounded-none border-4 border-on-background overflow-hidden flex items-center justify-center shrink-0">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${testimonial.name}`} alt={testimonial.name} className="w-full h-full object-cover bg-surface" />
                  </div>
                  <div>
                    <h4 className="font-headline-md text-xl uppercase leading-none mb-1">{testimonial.name}</h4>
                    <span className="font-label-mono text-[10px] uppercase bg-on-background text-background px-2 py-1 inline-block">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
