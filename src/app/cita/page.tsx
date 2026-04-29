'use client'

import Link from 'next/link'
import { useState } from 'react'

// ─── Tipos ───────────────────────────────────────────────

type Step = 1 | 2 | 3

interface FormData {
  service: string
  date: string
  time: string
  plate: string
  vehicle: string
  full_name: string
  phone: string
  email: string
  notes: string
}

// ─── Datos hardcodeados ───────────────────────────────────

const SERVICES = [
  {
    id: 'cambio',
    icon: 'tire_repair',
    title: 'Cambio de neumáticos',
    description: 'Montaje, equilibrado y válvulas.',
  },
  {
    id: 'alineacion',
    icon: 'settings_input_component',
    title: 'Alineación 3D',
    description: 'Optimización de pisada y dirección.',
  },
  {
    id: 'reparacion',
    icon: 'build',
    title: 'Reparación de pinchazos',
    description: 'Vulcanizado en frío profesional.',
  },
  {
    id: 'equilibrado',
    icon: 'speed',
    title: 'Equilibrado',
    description: 'Eliminación de vibraciones.',
  },
]

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
]

// ─── Helpers ─────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const DAY_NAMES = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// ─── Componente principal ─────────────────────────────────

export default function CitaPage() {
  const today = new Date()
  const [step, setStep] = useState<Step>(1)
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<FormData>({
    service: '',
    date: '',
    time: '',
    plate: '',
    vehicle: '',
    full_name: '',
    phone: '',
    email: '',
    notes: '',
  })

  const set = (key: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // ─── Calendario ──────────────────────────────────────────

  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = (getFirstDayOfMonth(calYear, calMonth) + 6) % 7 // lunes = 0

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
  }

  const isDateDisabled = (day: number) => {
    const d = new Date(calYear, calMonth, day)
    const dayOfWeek = d.getDay()
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return d < todayMidnight || dayOfWeek === 0 // sin domingos
  }

  const formatDate = (day: number) => {
    const d = new Date(calYear, calMonth, day)
    return d.toISOString().split('T')[0]
  }

  // ─── Submit ───────────────────────────────────────────────

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // TODO: conectar con Server Action cuando el diseño esté fino
      await new Promise(r => setTimeout(r, 1000)) // simulación
      setSubmitted(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // ─── Validaciones por paso ────────────────────────────────

  const canGoStep2 = form.service !== ''
  const canGoStep3 = form.date !== '' && form.time !== ''
  const canSubmit = form.full_name.trim() !== '' && form.phone.trim() !== ''

  // ─── Success ──────────────────────────────────────────────

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-brand/15 border border-brand/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-brand text-3xl">check_circle</span>
          </div>
          <h2 className="font-grotesk font-black uppercase text-white text-2xl md:text-3xl tracking-tight mb-3">
            Cita solicitada
          </h2>
          <p className="font-inter text-zinc-400 text-sm leading-relaxed mb-8">
            Nos pondremos en contacto contigo para confirmarla. Revisa tu teléfono o email.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3 font-grotesk text-xs font-bold uppercase tracking-widest hover:bg-brand-dim transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <div className="pt-[56px] md:pt-[68px] pb-24 md:pb-12">
        <div className="w-full max-w-[1440px] mx-auto min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-68px)] flex flex-col md:flex-row">

          {/* ─── PANEL IZQUIERDO (solo desktop) ─────────── */}
          <div className="hidden md:flex flex-col justify-between w-[380px] lg:w-[420px] shrink-0 relative overflow-hidden border-r border-zinc-900">
            <img
              src="/images/hero-tyre.png"
              alt="Neumático de alto rendimiento"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

            <div className="relative z-10 p-10 pt-12">
              <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-2">
                Neumáticos Ramos
              </p>
              <h1 className="font-grotesk font-black uppercase text-white text-3xl lg:text-4xl leading-tight tracking-tight">
                Reservar<br />
                <span className="text-brand">cita</span>
              </h1>
              <p className="mt-4 font-inter text-sm text-zinc-400 leading-relaxed max-w-xs">
                Reserva tu cita en Armilla, Granada. Te confirmamos por teléfono.
              </p>
            </div>

            {/* Steps indicator desktop */}
            <div className="relative z-10 p-10 pb-12 space-y-4">
              {[
                { n: 1, label: 'Selecciona servicio' },
                { n: 2, label: 'Fecha y hora' },
                { n: 3, label: 'Tus datos' },
              ].map(({ n, label }) => (
                <div key={n} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-grotesk border shrink-0 transition-colors ${
                    step > n
                      ? 'bg-brand border-brand text-white'
                      : step === n
                        ? 'bg-brand/15 border-brand text-brand'
                        : 'bg-transparent border-zinc-700 text-zinc-600'
                  }`}>
                    {step > n
                      ? <span className="material-symbols-outlined text-sm">check</span>
                      : n}
                  </div>
                  <span className={`font-grotesk text-xs uppercase tracking-widest font-bold ${
                    step >= n ? 'text-white' : 'text-zinc-600'
                  }`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── PANEL DERECHO / CONTENIDO ──────────────── */}
          <div className="flex-1 flex flex-col">

            {/* Steps indicator mobile */}
            <div className="md:hidden px-4 pt-6 pb-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-2 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-grotesk border shrink-0 transition-colors ${
                      step > n
                        ? 'bg-brand border-brand text-white'
                        : step === n
                          ? 'bg-brand/15 border-brand text-brand'
                          : 'bg-transparent border-zinc-800 text-zinc-600'
                    }`}>
                      {step > n
                        ? <span className="material-symbols-outlined text-sm">check</span>
                        : n}
                    </div>
                    {n < 3 && (
                      <div className={`h-px flex-1 transition-colors ${step > n ? 'bg-brand' : 'bg-zinc-800'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between">
                {['Servicio', 'Horario', 'Detalles'].map((label, i) => (
                  <span key={label} className={`font-grotesk text-[10px] uppercase tracking-widest font-bold ${
                    step >= i + 1 ? 'text-white' : 'text-zinc-600'
                  }`}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ─── STEP 1: SERVICIO ──────────────────────── */}
            {step === 1 && (
              <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-10 lg:px-16 py-6 md:py-12">
                <div className="mb-8">
                  <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-2">
                    Paso 1 de 3
                  </p>
                  <h2 className="font-grotesk font-bold uppercase text-white text-2xl md:text-3xl tracking-tight">
                    Selecciona el servicio
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {SERVICES.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => set('service', service.id)}
                      className={`glass-card p-5 md:p-6 flex items-start gap-4 text-left transition-all duration-200 group ${
                        form.service === service.id
                          ? 'border-brand/60 bg-brand/8'
                          : 'hover:border-zinc-700'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 transition-colors ${
                        form.service === service.id ? 'bg-brand/20' : 'bg-zinc-900'
                      }`}>
                        <span className={`material-symbols-outlined text-xl ${
                          form.service === service.id ? 'text-brand' : 'text-zinc-500 group-hover:text-zinc-300'
                        }`}>
                          {service.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-grotesk font-bold text-sm uppercase tracking-tight leading-tight ${
                          form.service === service.id ? 'text-white' : 'text-zinc-300'
                        }`}>
                          {service.title}
                        </p>
                        <p className="font-inter text-xs text-zinc-500 mt-1 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 transition-colors ${
                        form.service === service.id
                          ? 'border-brand bg-brand'
                          : 'border-zinc-700'
                      }`} />
                    </button>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!canGoStep2}
                    className="w-full md:w-auto md:px-12 py-4 bg-brand text-white font-grotesk font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-dim transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Continuar
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 2: FECHA Y HORA ──────────────────── */}
            {step === 2 && (
              <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-10 lg:px-16 py-6 md:py-12">
                <div className="mb-8">
                  <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-2">
                    Paso 2 de 3
                  </p>
                  <h2 className="font-grotesk font-bold uppercase text-white text-2xl md:text-3xl tracking-tight">
                    Fecha y hora
                  </h2>
                </div>

                {/* Calendario */}
                <div className="glass-card p-5 md:p-6 mb-6">
                  <div className="flex items-center justify-between mb-5">
                    <button
                      onClick={prevMonth}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                    <span className="font-grotesk font-bold uppercase text-white text-sm tracking-widest">
                      {MONTH_NAMES[calMonth]} {calYear}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                  </div>

                  {/* Cabecera días */}
                  <div className="grid grid-cols-7 mb-2">
                    {DAY_NAMES.map((d, i) => (
                      <div key={i} className="text-center font-grotesk text-[10px] font-bold uppercase text-zinc-600 py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Días */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1
                      const dateStr = formatDate(day)
                      const disabled = isDateDisabled(day)
                      const selected = form.date === dateStr

                      return (
                        <button
                          key={day}
                          disabled={disabled}
                          onClick={() => set('date', dateStr)}
                          className={`aspect-square flex items-center justify-center text-sm font-grotesk font-bold rounded transition-all ${
                            selected
                              ? 'bg-brand text-white'
                              : disabled
                                ? 'text-zinc-800 cursor-not-allowed'
                                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Horas */}
                <div>
                  <p className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
                    Hora disponible
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => set('time', slot)}
                        className={`py-2.5 text-center font-grotesk text-xs font-bold border transition-all ${
                          form.time === slot
                            ? 'bg-brand border-brand text-white'
                            : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-8 flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-4 border border-zinc-800 text-zinc-400 font-grotesk font-bold text-sm uppercase tracking-widest hover:border-zinc-600 hover:text-white transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!canGoStep3}
                    className="flex-1 md:flex-none md:px-12 py-4 bg-brand text-white font-grotesk font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-dim transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Continuar
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 3: DATOS ─────────────────────────── */}
            {step === 3 && (
              <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-10 lg:px-16 py-6 md:py-12">
                <div className="mb-8">
                  <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-2">
                    Paso 3 de 3
                  </p>
                  <h2 className="font-grotesk font-bold uppercase text-white text-2xl md:text-3xl tracking-tight">
                    Tus datos
                  </h2>
                </div>

                {/* Resumen */}
                <div className="glass-card p-4 md:p-5 mb-6 flex flex-wrap gap-4">
                  <div>
                    <p className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">Servicio</p>
                    <p className="font-grotesk text-sm font-bold text-white">
                      {SERVICES.find(s => s.id === form.service)?.title}
                    </p>
                  </div>
                  <div className="w-px bg-zinc-800" />
                  <div>
                    <p className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">Fecha</p>
                    <p className="font-grotesk text-sm font-bold text-white">
                      {form.date ? new Date(form.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : '—'}
                    </p>
                  </div>
                  <div className="w-px bg-zinc-800" />
                  <div>
                    <p className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">Hora</p>
                    <p className="font-grotesk text-sm font-bold text-brand">{form.time}</p>
                  </div>
                </div>

                {/* Formulario */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                        Nombre completo <span className="text-brand">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Juan García"
                        value={form.full_name}
                        onChange={e => set('full_name', e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <label className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                        Teléfono <span className="text-brand">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+34 600 000 000"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@ejemplo.com"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                        Matrícula
                      </label>
                      <input
                        type="text"
                        placeholder="1234 ABC"
                        value={form.plate}
                        onChange={e => set('plate', e.target.value.toUpperCase())}
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter font-bold tracking-widest transition-colors placeholder:text-zinc-600 placeholder:font-normal placeholder:tracking-normal"
                      />
                    </div>
                    <div>
                      <label className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                        Marca y modelo
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Seat León 2019"
                        value={form.vehicle}
                        onChange={e => set('vehicle', e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                      Notas adicionales
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Cuéntanos algo más sobre lo que necesitas..."
                      value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter transition-colors placeholder:text-zinc-600 resize-none"
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-4 border border-zinc-800 text-zinc-400 font-grotesk font-bold text-sm uppercase tracking-widest hover:border-zinc-600 hover:text-white transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || loading}
                    className="flex-1 md:flex-none md:px-12 py-4 bg-brand text-white font-grotesk font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-dim transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Confirmar cita
                        <span className="material-symbols-outlined text-sm">check</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="font-grotesk text-[10px] uppercase tracking-widest text-zinc-600 mt-4">
                  * Campos obligatorios. Te confirmaremos la cita por teléfono.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

    </main>
  )
}