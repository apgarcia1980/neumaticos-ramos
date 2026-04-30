'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

interface FormData {
  tyre_width: string
  tyre_aspect_ratio: string
  rim_diameter: string
  vehicle_make: string
  vehicle_model: string
  full_name: string
  phone: string
  email: string
  message: string
}

export default function PresupuestoPage() {
  const [form, setForm] = useState<FormData>({
    tyre_width: '',
    tyre_aspect_ratio: '',
    rim_diameter: '',
    vehicle_make: '',
    vehicle_model: '',
    full_name: '',
    phone: '',
    email: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const canSubmit = form.full_name.trim() !== '' && form.phone.trim() !== ''

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase.from('quote_request') as any).insert({
        full_name: form.full_name.trim(),
        email: form.email.trim() || 'sin-email@neumaticosramos.es',
        phone: form.phone.trim(),
        tyre_width: form.tyre_width ? Number(form.tyre_width) : null,
        tyre_aspect_ratio: form.tyre_aspect_ratio ? Number(form.tyre_aspect_ratio) : null,
        rim_diameter: form.rim_diameter ? Number(form.rim_diameter) : null,
        vehicle_make: form.vehicle_make.trim() || null,
        vehicle_model: form.vehicle_model.trim() || null,
        message: form.message.trim() || null,
        status: 'pending',
        source: 'web',
      })

      if (insertError) throw insertError
      setSubmitted(true)
    } catch (e) {
      console.error(e)
      setError('Ha ocurrido un error al enviar tu solicitud. Por favor, llámanos directamente.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-brand/15 border border-brand/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-brand text-3xl">check_circle</span>
          </div>
          <h2 className="font-grotesk font-black uppercase text-white text-2xl md:text-3xl tracking-tight mb-3">
            Solicitud enviada
          </h2>
          <p className="font-inter text-zinc-400 text-sm leading-relaxed mb-8">
            Nos pondremos en contacto contigo lo antes posible con tu presupuesto personalizado.
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

          {/* ─── PANEL IZQUIERDO desktop ─────────── */}
          <div className="hidden md:flex flex-col justify-between w-[380px] lg:w-[420px] shrink-0 relative overflow-hidden border-r border-zinc-900">
            <img
              src="/images/hero-tyre.png"
              alt="Neumático"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

            <div className="relative z-10 p-10 pt-12">
              <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-2">
                Neumáticos Ramos
              </p>
              <h1 className="font-grotesk font-black uppercase text-white text-3xl lg:text-4xl leading-tight tracking-tight">
                Solicitar<br />
                <span className="text-brand">presupuesto</span>
              </h1>
              <p className="mt-4 font-inter text-sm text-zinc-400 leading-relaxed max-w-xs">
                Dinos la medida de tu neumático y te contactamos con el mejor precio del mercado.
              </p>
            </div>

            <div className="relative z-10 p-10 pb-12 space-y-5">
              {[
                { icon: 'speed', text: 'Respuesta en menos de 2 horas' },
                { icon: 'local_shipping', text: 'Todas las marcas disponibles' },
                { icon: 'verified', text: 'Precio garantizado' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-brand text-lg">{item.icon}</span>
                  <span className="font-grotesk text-xs uppercase tracking-widest text-zinc-400 font-bold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── FORMULARIO ──────────────────────── */}
          <div className="flex-1 flex flex-col px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-12">

            <div className="mb-8">
              <p className="font-grotesk text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-2">
                Solicitud gratuita
              </p>
              <h2 className="font-grotesk font-bold uppercase text-white text-2xl md:text-3xl tracking-tight">
                ¿Qué neumáticos necesitas?
              </h2>
              <p className="font-inter text-sm text-zinc-500 mt-2">
                Encuentra la medida en el flanco del neumático o en la documentación del vehículo.
              </p>
            </div>

            <div className="max-w-2xl space-y-6">

              {/* Medida del neumático */}
              <div>
                <label className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block">
                  Medida del neumático
                </label>

                {/* Ejemplo visual */}
                <div className="glass-card px-4 py-3 mb-4 flex items-center gap-2 text-sm font-mono">
                  <span className={`font-bold transition-colors ${form.tyre_width ? 'text-brand' : 'text-zinc-600'}`}>
                    {form.tyre_width || '205'}
                  </span>
                  <span className="text-zinc-700">/</span>
                  <span className={`font-bold transition-colors ${form.tyre_aspect_ratio ? 'text-brand' : 'text-zinc-600'}`}>
                    {form.tyre_aspect_ratio || '55'}
                  </span>
                  <span className="text-zinc-700 ml-1">R</span>
                  <span className={`font-bold transition-colors ${form.rim_diameter ? 'text-brand' : 'text-zinc-600'}`}>
                    {form.rim_diameter || '16'}
                  </span>
                  <span className="ml-2 text-zinc-600 text-xs font-inter normal-case">← así se ve en el neumático</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-grotesk text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1.5 block">
                      Ancho (mm)
                    </label>
                    <input
                      type="number"
                      placeholder="205"
                      value={form.tyre_width}
                      onChange={e => set('tyre_width', e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-mono font-bold text-center transition-colors placeholder:text-zinc-700 placeholder:font-normal"
                    />
                  </div>
                  <div>
                    <label className="font-grotesk text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1.5 block">
                      Perfil (%)
                    </label>
                    <input
                      type="number"
                      placeholder="55"
                      value={form.tyre_aspect_ratio}
                      onChange={e => set('tyre_aspect_ratio', e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-mono font-bold text-center transition-colors placeholder:text-zinc-700 placeholder:font-normal"
                    />
                  </div>
                  <div>
                    <label className="font-grotesk text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1.5 block">
                      Llanta (pulgadas)
                    </label>
                    <input
                      type="number"
                      placeholder="16"
                      value={form.rim_diameter}
                      onChange={e => set('rim_diameter', e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-mono font-bold text-center transition-colors placeholder:text-zinc-700 placeholder:font-normal"
                    />
                  </div>
                </div>
              </div>

              {/* Vehículo */}
              <div>
                <label className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block">
                  Vehículo <span className="text-zinc-700 normal-case font-inter font-normal">(opcional)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Marca (ej: Seat)"
                    value={form.vehicle_make}
                    onChange={e => set('vehicle_make', e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter transition-colors placeholder:text-zinc-600"
                  />
                  <input
                    type="text"
                    placeholder="Modelo (ej: León 2019)"
                    value={form.vehicle_model}
                    onChange={e => set('vehicle_model', e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>

              {/* Datos de contacto */}
              <div>
                <label className="font-grotesk text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block">
                  Tus datos
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Nombre completo *"
                        value={form.full_name}
                        onChange={e => set('full_name', e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Teléfono *"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>
                  <input
                    type="email"
                    placeholder="Email (opcional)"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter transition-colors placeholder:text-zinc-600"
                  />
                  <textarea
                    rows={3}
                    placeholder="Comentarios adicionales (cantidad de neumáticos, urgencia, etc.)"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-brand/60 outline-none py-3 px-4 text-white text-sm font-inter transition-colors placeholder:text-zinc-600 resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 border border-red-800/40 border-l-2 border-l-brand bg-red-950/30 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="w-full sm:w-auto sm:px-12 py-4 bg-brand text-white font-grotesk font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-dim transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                    Enviando...
                  </>
                ) : (
                  <>
                    Solicitar presupuesto
                    <span className="material-symbols-outlined text-sm">send</span>
                  </>
                )}
              </button>

              <p className="font-grotesk text-[10px] uppercase tracking-widest text-zinc-600">
                * Campos obligatorios. Te contactaremos en menos de 2 horas en horario laboral.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}