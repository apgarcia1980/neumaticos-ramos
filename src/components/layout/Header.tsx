
'use client'

import Link from 'next/link'
import { Nav } from './Nav'
import type { StoreConfig } from '@/types/database'
import { use } from 'react'
import { usePathname } from 'next/navigation'

interface Props {
  storeConfig?: Partial<StoreConfig>
}


export const Header = ({ storeConfig }: Props) => {

    const urlIsCita = usePathname() === '/cita';

    
    return (
        <header className="fixed top-0 left-0 w-full z-[100] bg-black/85 backdrop-blur-xl border-b border-zinc-900 shadow-[0_4px_20px_rgba(225,6,0,0.08)]">
            <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-3 md:py-4">

                <Link href="/" className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand text-2xl md:text-3xl">tire_repair</span>
                    <span className="font-grotesk text-base md:text-xl font-black tracking-widest text-brand uppercase">
                        {storeConfig?.name ?? 'Neumáticos Ramos'}
                    </span>
                </Link>
                
                {/* NAV */}
                <Nav />
                
                { true && (
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/cita" className="bg-brand text-white px-5 py-2 font-grotesk text-xs font-bold uppercase tracking-widest hover:bg-brand-dim transition-colors active:scale-95">
                            Pedir cita
                        </Link>
                    </div>
                )}

                { true && (

                <div className="flex md:hidden items-center">
                    <Link href="/cita" className="bg-brand text-white px-4 py-2 font-grotesk text-[11px] font-bold uppercase tracking-wider active:scale-95">
                        Pedir cita
                    </Link>
                </div>
                )}

            </div>
        </header>
    )
}

