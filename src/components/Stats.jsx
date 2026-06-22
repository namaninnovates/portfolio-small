export default function Stats() {
  return (
    <section className="w-full bg-background py-16 px-margin-mobile md:px-margin-desktop border-b-4 border-on-background relative z-20">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
        <div className="bg-primary-container border-4 border-on-background px-8 py-4 -rotate-3 neo-shadow font-headline-md uppercase text-center w-64">
          <span className="block text-4xl mb-2">15+</span>
          <span className="text-xl">PROJECTS SHIPPED</span>
        </div>
        <div className="bg-secondary-container text-on-secondary border-4 border-on-background px-8 py-4 rotate-2 neo-shadow font-headline-md uppercase text-center w-64">
          <span className="block text-4xl mb-2">3+</span>
          <span className="text-xl">YEARS</span>
        </div>
        <div className="bg-cobalt text-on-primary border-4 border-on-background px-8 py-4 -rotate-2 neo-shadow font-headline-md uppercase text-center w-64">
          <span className="block text-4xl mb-2">8</span>
          <span className="text-xl">TOOLS MASTERED</span>
        </div>
        <div className="bg-primary-container border-4 border-on-background px-8 py-4 rotate-3 neo-shadow font-headline-md uppercase text-center w-64">
          <span className="block text-4xl mb-2">100%</span>
          <span className="text-xl">PUNCHY</span>
        </div>
      </div>
    </section>
  );
}
