import Link from 'next/link'

export const Hero = () => {
  return (
            <section id="inicio" className="relative w-full min-h-[100svh] flex items-end md:items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero-tyre.png"
              alt="Neumático de alto rendimiento en taller profesional"
              className="w-full h-full object-cover"
            />
            <div className="hero-overlay absolute inset-0" />
          </div>
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pb-10 md:pb-20 pt-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-3 py-1.5 bg-brand/15 border border-brand/30 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span className="font-grotesk text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                  Taller de precisión en Granada
                </span>
              </div>
              <h1 className="font-grotesk font-black uppercase leading-none text-white text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight">
                Especialistas en<br />
                <span className="text-brand">neumáticos</span> en Granada
              </h1>
              <p className="mt-4 md:mt-6 text-base md:text-lg leading-relaxed text-zinc-400 max-w-2xl">
                Precisión de competición para tu día a día. Cambio, reparación y alineación profesional
                con las mejores marcas del mercado.
              </p>
              <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link href="/cita" className="bg-brand text-white px-8 md:px-10 py-4 font-grotesk text-sm font-bold uppercase tracking-widest text-center hover:bg-brand-dim transition-colors active:scale-95">
                  Pedir cita
                </Link>
                <Link href="/presupuesto" className="border border-white/20 hover:border-brand hover:text-brand text-white px-8 md:px-10 py-4 font-grotesk text-sm font-bold uppercase tracking-widest text-center transition-all active:scale-95">
                  Solicitar presupuesto
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-zinc-500 font-grotesk uppercase tracking-widest">
                <span>Atención rápida</span>
                <span className="text-zinc-700">·</span>
                <span>Taller especializado</span>
                <span className="text-zinc-700">·</span>
                <span>+30 años de experiencia</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex absolute bottom-8 left-12 items-center gap-4 text-zinc-600 font-grotesk text-[10px] uppercase tracking-widest">
            <span>Scroll</span>
            <div className="w-12 h-px bg-zinc-800 relative">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-brand" />
            </div>
          </div>
        </section>
  )
}
