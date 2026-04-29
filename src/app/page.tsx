import type { Service, StoreConfig } from '@/types/database'

import { Contact } from '../components/layout/Contact'
import { Cta } from '../components/layout/Cta'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { Hero } from '../components/layout/Hero'
import { NavMobile } from '../components/layout/NavMobile'
import { Services } from '../components/layout/Services'
import { Stats } from '../components/layout/Stats'
import { Visual } from '../components/layout/Visual'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// ─── Queries ─────────────────────────────────────────────

async function getStoreConfig(): Promise<StoreConfig | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_config')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching store_config:', error.message)
    return null
  }
  return data
}

async function getServices(): Promise<Service[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('service')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error.message)
    return []
  }
  return data ?? []
}

// ─── Fallbacks ───────────────────────────────────────────

const FALLBACK_STORE: Partial<StoreConfig> = {
  name: 'Neumáticos Ramos',
  phone: '+34 958 571 753',
  whatsapp: '34600000000',
  address: 'Avenida Poniente 76, 18100 Armilla, Granada',
  google_maps_url: 'https://maps.google.com/?q=Avenida+Poniente+76+Armilla+Granada',
}

const FALLBACK_SERVICES: Service[] = [
  { id: '1', icon: 'tire_repair', title: 'Cambio de neumáticos', description: 'Sustitución rápida con equilibrado incluido.', featured: false, sort_order: 1, is_active: true, created_at: '', updated_at: '' },
  { id: '2', icon: 'build', title: 'Reparación pinchazos', description: 'Vulcanizado en frío para garantizar la integridad estructural.', featured: true, sort_order: 2, is_active: true, created_at: '', updated_at: '' },
  { id: '3', icon: 'settings_input_component', title: 'Alineación 3D', description: 'Ajuste de ángulos mediante tecnología láser de alta precisión.', featured: false, sort_order: 3, is_active: true, created_at: '', updated_at: '' },
  { id: '4', icon: 'speed', title: 'Equilibrado', description: 'Eliminación de vibraciones para un confort superior.', featured: false, sort_order: 4, is_active: true, created_at: '', updated_at: '' },
]

// ─── Página ──────────────────────────────────────────────

export default async function HomePage() {
  const [store, services] = await Promise.all([
    getStoreConfig(),
    getServices(),
  ])

  const s = store ?? FALLBACK_STORE
  const svc = services.length > 0 ? services : FALLBACK_SERVICES

  return (
    <main className="overflow-x-hidden">

      <div className="pt-[56px] md:pt-[68px] pb-20 md:pb-0">

        {/* HERO */}
        <Hero />

        {/* SERVICIOS */}
        <Services services={svc} />

        {/* STATS */}
        <Stats />

        {/* SECCIÓN VISUAL */}
        <Visual />

        {/* CTA */}
        <Cta />

        {/* CONTACTO */}
        <Contact storeConfig={s} />

      </div>

    </main>
  )
}