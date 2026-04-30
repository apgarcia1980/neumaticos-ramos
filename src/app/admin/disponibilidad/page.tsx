'use client'

import { useEffect, useState } from 'react'

import type { AvailabilityBlock } from '@/types/database'
import { createClient } from '@/lib/supabase/client'

const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
    '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30',
]

const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const DAY_NAMES = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
    return (new Date(year, month, 1).getDay() + 6) % 7
}

function formatDate(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const REASON_PRESETS = [
    'Festivo nacional',
    'Festivo local',
    'Vacaciones',
    'Cerrado',
    'Reservado',
]

export default function DisponibilidadPage() {
    const today = new Date()
    const [calMonth, setCalMonth] = useState(today.getMonth())
    const [calYear, setCalYear] = useState(today.getFullYear())
    const [blocks, setBlocks] = useState<AvailabilityBlock[]>([])
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [reason, setReason] = useState('')
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)

    const daysInMonth = getDaysInMonth(calYear, calMonth)
    const firstDay = getFirstDayOfMonth(calYear, calMonth)

    useEffect(() => {
        fetchBlocks()
    }, [calMonth, calYear])

    async function fetchBlocks() {
        setLoading(true)
        const supabase = createClient()
        const startDate = formatDate(calYear, calMonth, 1)
        const endDate = formatDate(calYear, calMonth, daysInMonth)
        const { data } = await supabase
            .from('availability_block')
            .select('*')
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: true })
        setBlocks((data as AvailabilityBlock[]) ?? [])
        setLoading(false)
    }

    function getDayBlocks(dateStr: string) {
        return blocks.filter(b => b.date === dateStr)
    }

    function isDayFullyBlocked(dateStr: string) {
        return blocks.some(b => b.date === dateStr && b.time === null)
    }

    async function blockDay(dateStr: string) {
        if (!reason.trim()) return
        setSaving(true)
        const supabase = createClient()
        // Borra bloques de horas individuales si existen y añade bloqueo total
        await supabase.from('availability_block').delete().eq('date', dateStr)
        await (supabase.from('availability_block') as any).insert({
            date: dateStr,
            time: null,
            reason: reason.trim(),
        })
        await fetchBlocks()
        setSaving(false)
    }

    async function unblockDay(dateStr: string) {
        setSaving(true)
        const supabase = createClient()
        await supabase.from('availability_block').delete().eq('date', dateStr)
        await fetchBlocks()
        setSaving(false)
    }

    async function toggleTimeBlock(dateStr: string, time: string) {
        setSaving(true)
        const supabase = createClient()
        const existing = blocks.find(b => b.date === dateStr && b.time === time)
        if (existing) {
            await supabase.from('availability_block').delete().eq('id', existing.id)
        } else {
            await (supabase.from('availability_block') as any).insert({
                date: dateStr,
                time,
                reason: reason.trim() || 'Bloqueado',
            })
        }
        await fetchBlocks()
        setSaving(false)
    }

    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
        else setCalMonth(m => m - 1)
    }
    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
        else setCalMonth(m => m + 1)
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">

            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-5 h-0.5 bg-primary-theme" />
                    <span className="eyebrow">Gestión</span>
                </div>
                <h1 className="display-title text-3xl text-white">Disponibilidad</h1>
                <p className="text-sm text-white/40 mt-1">Bloquea días completos u horas concretas para que no aparezcan disponibles en el formulario de citas.</p>
            </div>

            <div className="grid lg:grid-cols-[1fr_340px] gap-6">

                {/* Calendario */}
                <div className="bg-surface border border-white/[0.08] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/[0.08] hover:border-white/20">
                            ←
                        </button>
                        <span className="display-title text-lg text-white">
                            {MONTH_NAMES[calMonth]} {calYear}
                        </span>
                        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/[0.08] hover:border-white/20">
                            →
                        </button>
                    </div>

                    {/* Cabecera días */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAY_NAMES.map((d, i) => (
                            <div key={i} className="text-center eyebrow text-[10px] text-white/30 py-1">{d}</div>
                        ))}
                    </div>

                    {/* Días */}
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1
                            const dateStr = formatDate(calYear, calMonth, day)
                            const fullyBlocked = isDayFullyBlocked(dateStr)
                            const dayBlocks = getDayBlocks(dateStr)
                            const hasPartialBlock = dayBlocks.length > 0 && !fullyBlocked
                            const isSelected = selectedDate === dateStr
                            const isPast = new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                                    className={`
                    aspect-square flex flex-col items-center justify-center text-sm font-bold rounded transition-all relative
                    ${isSelected ? 'ring-2 ring-primary-theme' : ''}
                    ${fullyBlocked ? 'bg-primary-theme/20 text-primary-theme' : ''}
                    ${hasPartialBlock && !fullyBlocked ? 'bg-yellow-500/10 text-yellow-400' : ''}
                    ${!fullyBlocked && !hasPartialBlock ? isPast ? 'text-white/20 cursor-not-allowed' : 'text-white hover:bg-white/[0.06]' : ''}
                  `}
                                >
                                    {day}
                                    {hasPartialBlock && (
                                        <span className="w-1 h-1 rounded-full bg-yellow-400 absolute bottom-1" />
                                    )}
                                    {fullyBlocked && (
                                        <span className="w-1 h-1 rounded-full bg-primary-theme absolute bottom-1" />
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* Leyenda */}
                    <div className="flex gap-4 mt-4 pt-4 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <span className="w-3 h-3 rounded-sm bg-primary-theme/20 border border-primary-theme/40" />
                            Día bloqueado
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <span className="w-3 h-3 rounded-sm bg-yellow-500/10 border border-yellow-500/30" />
                            Horas bloqueadas
                        </div>
                    </div>
                </div>

                {/* Panel lateral */}
                <div className="space-y-4">

                    {/* Motivo */}
                    <div className="bg-surface border border-white/[0.08] p-5">
                        <p className="eyebrow text-[10px] text-white/40 mb-3">Motivo del bloqueo</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {REASON_PRESETS.map(r => (
                                <button
                                    key={r}
                                    onClick={() => setReason(r)}
                                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border ${reason === r
                                            ? 'bg-primary-theme/10 border-primary-theme/40 text-primary-theme'
                                            : 'border-white/[0.08] text-white/40 hover:text-white hover:border-white/20'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        <input
                            className="input-theme text-sm"
                            placeholder="O escribe un motivo personalizado..."
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                    </div>

                    {/* Acciones del día seleccionado */}
                    {selectedDate ? (
                        <div className="bg-surface border border-white/[0.08] p-5 space-y-4">
                            <div>
                                <p className="eyebrow text-[10px] text-white/40 mb-1">Día seleccionado</p>
                                <p className="text-white font-semibold">
                                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                            </div>

                            {isDayFullyBlocked(selectedDate) ? (
                                <div className="space-y-3">
                                    <div className="bg-primary-theme/10 border border-primary-theme/20 px-3 py-2 text-xs text-primary-theme">
                                        Día completo bloqueado: {getDayBlocks(selectedDate)[0]?.reason}
                                    </div>
                                    <button
                                        onClick={() => unblockDay(selectedDate)}
                                        disabled={saving}
                                        className="btn-secondary-theme w-full text-xs"
                                    >
                                        {saving ? 'Guardando...' : 'Desbloquear día'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => blockDay(selectedDate)}
                                        disabled={saving || !reason.trim()}
                                        className="btn-primary-theme w-full text-xs"
                                    >
                                        {saving ? 'Guardando...' : 'Bloquear día completo'}
                                    </button>

                                    <div className="border-t border-white/[0.06] pt-3">
                                        <p className="eyebrow text-[10px] text-white/40 mb-3">O bloquea horas concretas</p>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {TIME_SLOTS.map(slot => {
                                                const isBlocked = blocks.some(b => b.date === selectedDate && b.time === slot)
                                                return (
                                                    <button
                                                        key={slot}
                                                        onClick={() => toggleTimeBlock(selectedDate, slot)}
                                                        disabled={saving}
                                                        className={`py-2 text-xs font-semibold border transition-all ${isBlocked
                                                                ? 'bg-primary-theme/20 border-primary-theme/40 text-primary-theme line-through'
                                                                : 'border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white'
                                                            }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-surface border border-white/[0.06] p-5 text-center text-white/30 text-sm">
                            Selecciona un día en el calendario para gestionarlo
                        </div>
                    )}

                    {/* Bloques del mes */}
                    {blocks.length > 0 && (
                        <div className="bg-surface border border-white/[0.08] p-5">
                            <p className="eyebrow text-[10px] text-white/40 mb-3">Bloques este mes ({blocks.length})</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {blocks.map(b => (
                                    <div key={b.id} className="flex items-center justify-between text-xs">
                                        <div>
                                            <span className="text-white/60">{b.date}</span>
                                            {b.time && <span className="text-white/40 ml-2">{b.time}</span>}
                                            {b.reason && <span className="text-white/30 ml-2">— {b.reason}</span>}
                                        </div>
                                        <button
                                            onClick={async () => {
                                                const supabase = createClient()
                                                await supabase.from('availability_block').delete().eq('id', b.id)
                                                await fetchBlocks()
                                            }}
                                            className="text-white/20 hover:text-red-400 transition-colors ml-2"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}