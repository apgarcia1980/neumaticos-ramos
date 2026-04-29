'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MOBILE_LINKS = [
  { href: '/#inicio',    label: 'Inicio',    icon: 'home',                    section: 'inicio' },
  { href: '/#servicios', label: 'Servicios', icon: 'settings_input_component', section: 'servicios' },
  { href: '/cita',       label: 'Cita',      icon: 'tire_repair',              section: null },
  { href: '/#contacto',  label: 'Contacto',  icon: 'location_on',              section: 'contacto' },
]

export const NavMobile = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'
const [activeSection, setActiveSection] = useState<string>('inicio')

  useEffect(() => {
    if (!isHome) return

    const observers: IntersectionObserver[] = []

    MOBILE_LINKS.forEach(({ section }) => {
      if (!section) return
      const el = document.getElementById(section)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(section)
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [isHome])

  const isActive = (href: string, section: string | null) => {
    // Rutas reales
    if (!section) return pathname.startsWith(href)
    // Anclas solo en home
    if (!isHome) return false
    return activeSection === section
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-black/92 backdrop-blur-lg border-t border-zinc-800 shadow-[0_-4px_20px_rgba(0,0,0,0.9)]">
      <div className="grid grid-cols-4 px-2 py-2">
        {MOBILE_LINKS.map(({ href, label, icon, section }) => {
          const active = isActive(href, section)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 transition-colors ${
                active ? 'nav-link-active' : 'nav-link-inactive'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
              <span className="font-grotesk text-[10px] uppercase font-medium tracking-tight">
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}