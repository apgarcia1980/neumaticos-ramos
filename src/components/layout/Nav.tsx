'use client'

import { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

const NAV_LINKS = [
    { href: '/#inicio', label: 'Inicio', section: 'inicio' },
    { href: '/#servicios', label: 'Servicios', section: 'servicios' },
    { href: '/#nosotros', label: 'Nosotros', section: 'nosotros' },
    { href: '/#contacto', label: 'Contacto', section: 'contacto' },
    { href: '/cita', label: 'Cita', section: null },
]

export const Nav = () => {
    const pathname = usePathname()
    const isHome = pathname === '/'
const [activeSection, setActiveSection] = useState<string>('inicio')
    // ─── IntersectionObserver solo en la home ────────────────
    useEffect(() => {
        if (!isHome) return

        const observers: IntersectionObserver[] = []

        NAV_LINKS.forEach(({ section }) => {
            if (!section) return
            const el = document.getElementById(section)
            if (!el) return

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(section)
                    }
                },
                {
                    // activa cuando la sección ocupa el centro del viewport
                    rootMargin: '-40% 0px -55% 0px',
                    threshold: 0,
                }
            )

            observer.observe(el)
            observers.push(observer)
        })

        return () => observers.forEach(o => o.disconnect())
    }, [isHome])

     const isActive = (href: string, section: string | null) => {
        if (!section) return pathname.startsWith(href)
        if (!isHome) return false
        return activeSection === section
    }

    return (
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map(({ href, label, section }) => (
                <a
                    key={href}
                    href={href}
                    className={`font-grotesk text-xs uppercase tracking-widest font-bold transition-colors duration-200 ${isActive(href, section) ? 'nav-link-active' : 'nav-link-inactive'
                        }`}
                >
                    {label}
                </a>
            ))}
        </nav>
    )
}