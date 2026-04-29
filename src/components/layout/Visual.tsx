import React from 'react'

export const Visual = () => {
    return (
        <section className="relative h-52 md:h-[500px] w-full overflow-hidden">
            <img src="/images/hero-competition-tyre.png" alt="Detalle de neumático de competición" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                    <h2 className="font-grotesk font-black uppercase text-white/15 select-none text-5xl md:text-9xl tracking-tight leading-none">
                        Performance
                    </h2>
                    <div className="mt-[-16px] md:mt-[-40px] relative z-10 inline-block px-6 md:px-10 py-3 md:py-4 bg-black/65 backdrop-blur-sm border border-white/10">
                        <span className="font-grotesk font-bold uppercase tracking-[0.25em] md:tracking-[0.35em] text-brand text-sm md:text-2xl">
                            Precisión absoluta
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
