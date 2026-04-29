import type { Service, StoreConfig } from '@/types/database'

import Link from 'next/link'

const Props = {
  services: [] as Service[],
}

export const Services = ( { services } = Props ) => {
  return (
            <section id="servicios" className="py-14 md:py-24 px-4 sm:px-6 md:px-12 bg-[#0e0e0e]">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 md:mb-16 gap-4">
              <div>
                <h2 className="font-grotesk font-bold uppercase text-white text-2xl md:text-4xl tracking-tight">
                  Nuestros servicios
                </h2>
                <div className="w-16 h-0.5 bg-brand mt-3" />
              </div>
              <p className="font-inter text-sm md:text-base text-zinc-500 max-w-md md:text-right leading-relaxed">
                Maquinaria de última generación para garantizar la máxima seguridad en carretera.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {services.map((service) => (
                <article
                  key={service.id}
                  className={`glass-card p-5 md:p-10 flex flex-col gap-3 md:gap-4 group hover:border-brand/50 transition-colors duration-300 ${
                    service.featured ? 'border-l-2 border-l-brand' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-brand text-2xl md:text-4xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </span>
                  <h3 className="font-grotesk font-bold text-white text-sm md:text-xl uppercase leading-tight">
                    {service.title}
                  </h3>
                  <p className="hidden md:block text-zinc-500 font-inter text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <a href="#contacto" className="hidden md:flex text-brand font-grotesk text-[11px] uppercase tracking-widest items-center gap-2 group-hover:gap-4 transition-all duration-300 mt-auto">
                    Saber más
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
  )
}
