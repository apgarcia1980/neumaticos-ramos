import Link from 'next/link'
import React from 'react'

export const Footer = () => {
    return (
        <footer className="bg-black border-t border-zinc-900 px-4 sm:px-6 md:px-12 py-10 md:py-14">
            <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <p className="font-grotesk font-black text-base md:text-lg text-white uppercase tracking-widest">
                        Neumáticos <span className="text-brand">Ramos</span>
                    </p>
                    <p className="font-grotesk text-[11px] text-zinc-600 uppercase tracking-widest mt-1.5">
                        © 2025 Neumáticos Ramos · Armilla, Granada
                    </p>
                </div>
                <nav className="flex flex-wrap justify-center gap-5 md:gap-8">
                    <a href="#servicios" className="font-grotesk text-[11px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Servicios</a>
                    <Link href="/cita" className="font-grotesk text-[11px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Pedir cita</Link>
                    <Link href="/presupuesto" className="font-grotesk text-[11px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Presupuesto</Link>
                    <a href="#contacto" className="font-grotesk text-[11px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Contacto</a>
                </nav>
            </div>
        </footer>
    )
}
