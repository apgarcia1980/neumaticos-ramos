import React from 'react'

export const Stats = () => {
    return (
        <section id="nosotros" className="py-14 md:py-20 px-4 sm:px-6 md:px-12 bg-black border-y border-zinc-900">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-zinc-900">
                    <div className="flex flex-col md:flex-row items-center md:justify-center gap-3 md:gap-5 md:px-8 text-center md:text-left">
                        <span className="font-grotesk font-black text-4xl md:text-5xl text-brand">+30</span>
                        <div>
                            <div className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-brand">Años de</div>
                            <div className="font-grotesk text-xs uppercase tracking-widest text-zinc-500 font-bold">Experiencia</div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-center gap-3 md:gap-5 md:px-8 text-center md:text-left">
                        <span className="material-symbols-outlined text-brand text-4xl md:text-5xl">bolt</span>
                        <div>
                            <div className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-white">Servicio</div>
                            <div className="font-grotesk text-xs uppercase tracking-widest text-zinc-500 font-bold">Rápido</div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-center gap-3 md:gap-5 md:px-8 text-center md:text-left">
                        <span className="material-symbols-outlined text-brand text-4xl md:text-5xl">verified_user</span>
                        <div>
                            <div className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-white">Garantía</div>
                            <div className="font-grotesk text-xs uppercase tracking-widest text-zinc-500 font-bold">Oficial premium</div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-center gap-3 md:gap-5 md:px-8 text-center md:text-left col-span-2 md:col-span-1">
                        <div className="flex -space-x-3">
                            {['M', 'P', 'B'].map((letter) => (
                                <div key={letter} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold font-grotesk">
                                    {letter}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-white">Mejores</div>
                            <div className="font-grotesk text-xs uppercase tracking-widest text-zinc-500 font-bold">Marcas top</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
