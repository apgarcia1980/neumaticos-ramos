'use client'

import { Footer } from './Footer'
import { Header } from './Header'
import { NavMobile } from './NavMobile'
import { usePathname } from 'next/navigation'

export function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/auth')

  return (
    <>
      {!isAdmin && <Header />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <NavMobile />}
    </>
  )
}