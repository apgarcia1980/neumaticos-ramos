import './globals.css'

import { Bebas_Neue } from 'next/font/google'
import { Footer } from '@/components/layout/Footer'
import { Geist } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import type { Metadata } from 'next'
import { NavMobile } from '@/components/layout/NavMobile'
import { PublicLayoutWrapper } from '@/components/layout/PublicLayoutWrapper'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas-neue',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Neumáticos Ramos | Especialistas en Granada',
  description: 'Cambio, reparación y alineación profesional de neumáticos en Armilla, Granada.',
}

const ACTIVE_THEME = undefined

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" {...(ACTIVE_THEME ? { 'data-theme': ACTIVE_THEME } : {})}>
      <head>
        <link
          rel="stylesheet"
        />
         <link
    rel="stylesheet"/>
  <link
    rel="preload"
    as="style"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
  />
      </head>
    <body className={`${geistSans.variable} ${bebasNeue.variable}`}>
        <PublicLayoutWrapper>
          {children}
        </PublicLayoutWrapper>
      </body>
    </html>
  )
}