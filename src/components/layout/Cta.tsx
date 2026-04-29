import Link from 'next/link'

export const Cta = () => {
  return (
        <section className="py-14 md:py-24 px-4 sm:px-6 md:px-12">
          <div className="max-w-[1440px] mx-auto">
            <div className="bg-[#0a0a0a] border-t border-zinc-800 p-8 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-brand/10 blur-[80px] pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="max-w-2xl text-center md:text-left">
                  <h2 className="font-grotesk font-bold uppercase text-white leading-tight text-2xl md:text-4xl">
                    ¿Necesitas cambiar tus<br />
                    <span className="text-brand">ruedas hoy mismo?</span>
                  </h2>
                  <p className="mt-4 font-inter text-sm md:text-lg text-zinc-500 leading-relaxed">
                    Disponemos de stock inmediato para las medidas más habituales. No pongas en riesgo tu seguridad.
                  </p>
                </div>
                <Link href="/cita" className="w-full md:w-auto text-center bg-brand text-white px-10 md:px-12 py-4 md:py-5 font-grotesk font-bold uppercase tracking-widest text-sm whitespace-nowrap hover:bg-brand-dim transition-colors active:scale-95">
                  Reservar ahora
                </Link>
              </div>
            </div>
          </div>
        </section>
  )
}
