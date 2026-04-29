import type { StoreConfig } from '@/types/database'

interface Props {
  storeConfig: Partial<StoreConfig>
}

export const Contact = ({ storeConfig }: Props) => {
  const items = [
    { icon: 'call', label: 'Teléfono', value: storeConfig.phone ?? '' },
    ...(storeConfig.whatsapp
      ? [{ icon: 'chat', label: 'WhatsApp', value: storeConfig.whatsapp }]
      : []),
    { icon: 'location_on', label: 'Dirección', value: storeConfig.address ?? '' },
    {
      icon: 'schedule',
      label: 'Horario',
      value: 'Lunes – Viernes: 09:00 – 14:00 / 16:00 – 20:00\nSábados: 09:00 – 13:30',
    },
  ]

  return (
    <section id="contacto" className="py-14 md:py-24 px-4 sm:px-6 md:px-12 bg-[#0e0e0e]">
      <div className="max-w-[1440px] mx-auto">

        <h2 className="font-grotesk font-bold uppercase text-white text-2xl md:text-4xl tracking-tight mb-10 md:mb-16">
          Contacta con nosotros
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">

          <div className="space-y-5 md:space-y-8">
            {items.map((item) => (
              <div key={item.label} className="flex items-start gap-4 md:gap-6 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-brand transition-colors duration-200 shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-brand text-xl md:text-2xl">
                    {item.icon}
                  </span>
                </div>
                <div>
                  <div className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">
                    {item.label}
                  </div>
                  <div className="font-grotesk text-base md:text-xl font-bold text-white whitespace-pre-line leading-relaxed">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative h-64 md:h-[420px] border border-zinc-800 overflow-hidden">
            <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-brand text-5xl md:text-6xl">map</span>
              <span className="font-grotesk text-[10px] uppercase tracking-widest text-zinc-600">
                Mapa interactivo
              </span>
            </div>
            {storeConfig.google_maps_url && (
              <a
                href={storeConfig.google_maps_url}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 hover:border-brand text-white px-5 py-2.5 font-grotesk text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 whitespace-nowrap"
              >
                Ver en Google Maps
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}