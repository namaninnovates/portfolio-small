export default function Marquee() {
  return (
    <div className="relative py-12 -mt-40 flex flex-col items-center justify-center overflow-hidden z-40">
      <div className="marquee bg-secondary-container text-on-secondary border-y-4 border-on-background py-4 flex items-center -rotate-3 origin-center scale-110 z-30 relative overflow-hidden neo-shadow w-full">
        <div className="marquee-content font-display-xl text-headline-md whitespace-nowrap tracking-wider flex items-center">
          <span className="mx-4 text-primary-container">WEB DEV</span> // 
          <span className="mx-4">VIDEO EDITING</span> // 
          <span className="mx-4 text-primary-container">MOTION GRAPHICS</span> // 
          <span className="mx-4">CONTENT STRATEGY</span> //
          <span className="mx-4 text-primary-container">WEB DEV</span> // 
          <span className="mx-4">VIDEO EDITING</span> // 
          <span className="mx-4 text-primary-container">MOTION GRAPHICS</span> // 
          <span className="mx-4">CONTENT STRATEGY</span> //
          <span className="mx-4 text-primary-container">WEB DEV</span> // 
          <span className="mx-4">VIDEO EDITING</span> // 
          <span className="mx-4 text-primary-container">MOTION GRAPHICS</span> // 
          <span className="mx-4">CONTENT STRATEGY</span> //
        </div>
      </div>
      
      <div className="marquee bg-primary-container text-on-background border-y-4 border-on-background py-4 flex items-center rotate-3 origin-center scale-110 z-20 absolute overflow-hidden neo-shadow w-full">
        <div className="marquee-content font-display-xl text-headline-md whitespace-nowrap tracking-wider flex items-center" style={{ animationDirection: 'reverse' }}>
          <span className="mx-4 text-secondary-container">BRUTALIST</span> // 
          <span className="mx-4">AESTHETICS</span> // 
          <span className="mx-4 text-secondary-container">HIGH IMPACT</span> // 
          <span className="mx-4">UI/UX DESIGN</span> //
          <span className="mx-4 text-secondary-container">BRUTALIST</span> // 
          <span className="mx-4">AESTHETICS</span> // 
          <span className="mx-4 text-secondary-container">HIGH IMPACT</span> // 
          <span className="mx-4">UI/UX DESIGN</span> //
          <span className="mx-4 text-secondary-container">BRUTALIST</span> // 
          <span className="mx-4">AESTHETICS</span> // 
          <span className="mx-4 text-secondary-container">HIGH IMPACT</span> // 
          <span className="mx-4">UI/UX DESIGN</span> //
        </div>
      </div>
    </div>
  );
}
