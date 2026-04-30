'use client'

import type { QuoteRequest, QuoteStatus } from '@/types/database'
import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

const STATUS_LABELS: Record<QuoteStatus, string> = {
  pending: 'Pendiente',
  managed: 'Gestionado',
  cancelled: 'Cancelado',
}

const STATUS_BADGE: Record<QuoteStatus, string> = {
  pending: 'badge-pending',
  managed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
}

const STATUS_FLOW: Record<QuoteStatus, QuoteStatus[]> = {
  pending: ['managed', 'cancelled'],
  managed: [],
  cancelled: [],
}

export default function ResupuestosPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<QuoteStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchQuotes()
  }, [])

  async function fetchQuotes() {
    const supabase = createClient()
    const { data } = await supabase
      .from('quote_request')
      .select('*')
      .order('created_at', { ascending: false })
    setQuotes(data ?? [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: QuoteStatus) {
    setUpdating(id)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('quote_request') as any)
      .update({ status, managed_at: new Date().toISOString() })
      .eq('id', id)
    await fetchQuotes()
    setUpdating(null)
  }

  const filtered = quotes.filter(q => {
    const matchFilter = filter === 'all' || q.status === filter
    const matchSearch = search === '' ||
      q.full_name.toLowerCase().includes(search.toLowerCase()) ||
      q.phone.includes(search) ||
      (q.vehicle_make ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (q.vehicle_model ?? '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = quotes.reduce((acc, q) => {
    acc[q.status] = (acc[q.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-5 h-0.5 bg-primary-theme" />
            <span className="eyebrow">Gestión</span>
          </div>
          <h1 className="display-title text-3xl text-white">Presupuestos</h1>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{quotes.length}</p>
          <p className="text-xs text-white/30 uppercase tracking-wider">Total</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${filter === 'all'
              ? 'bg-primary-theme text-white'
              : 'bg-surface border border-white/[0.08] text-white/50 hover:text-white'
            }`}
        >
          Todos ({quotes.length})
        </button>
        {(Object.keys(STATUS_LABELS) as QuoteStatus[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${filter === s
                ? 'bg-primary-theme text-white'
                : 'bg-surface border border-white/[0.08] text-white/50 hover:text-white'
              }`}
          >
            {STATUS_LABELS[s]} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {/* Búsqueda */}
      <input
        className="input-theme max-w-sm"
        placeholder="Buscar por nombre, teléfono o vehículo..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Tabla */}
      <div className="bg-surface border border-white/[0.08]">
        {loading ? (
          <div className="px-6 py-16 text-center text-white/30 text-sm">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-white/30 text-sm">No hay presupuestos con estos filtros</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Cliente', 'Teléfono', 'Medida', 'Vehículo', 'Mensaje', 'Estado', 'Acciones'].map(h => (
                      <th key={h} className="px-5 py-3 text-left eyebrow text-[10px] text-white/30">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(q => (
                    <tr key={q.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm text-white font-medium">{q.full_name}</p>
                        <p className="text-xs text-white/30">{q.email}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/60">{q.phone}</td>
                      <td className="px-5 py-4 text-sm text-white/80 font-mono">
                        {q.tyre_width && q.tyre_aspect_ratio && q.rim_diameter
                          ? `${q.tyre_width}/${q.tyre_aspect_ratio} R${q.rim_diameter}`
                          : '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-white/60">
                        {q.vehicle_make && q.vehicle_model
                          ? `${q.vehicle_make} ${q.vehicle_model}`
                          : '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-white/40 max-w-[200px] truncate">
                        {q.message ?? '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={STATUS_BADGE[q.status]}>{STATUS_LABELS[q.status]}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {STATUS_FLOW[q.status].map(next => (
                            <button
                              key={next}
                              onClick={() => updateStatus(q.id, next)}
                              disabled={updating === q.id}
                              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white/[0.06] hover:bg-primary-theme/20 border border-white/[0.1] hover:border-primary-theme/40 text-white/70 hover:text-white transition-all disabled:opacity-40"
                            >
                              {updating === q.id ? '...' : STATUS_LABELS[next]}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-white/[0.06]">
              {filtered.map(q => (
                <div key={q.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{q.full_name}</p>
                      <p className="text-xs text-white/40">{q.phone}</p>
                    </div>
                    <span className={STATUS_BADGE[q.status]}>{STATUS_LABELS[q.status]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/50">
                    {q.tyre_width && (
                      <span className="font-mono">🔵 {q.tyre_width}/{q.tyre_aspect_ratio} R{q.rim_diameter}</span>
                    )}
                    {q.vehicle_make && (
                      <span>🚗 {q.vehicle_make} {q.vehicle_model}</span>
                    )}
                  </div>
                  {q.message && (
                    <p className="text-xs text-white/30 italic">{q.message}</p>
                  )}
                  <div className="flex gap-2">
                    {STATUS_FLOW[q.status].map(next => (
                      <button
                        key={next}
                        onClick={() => updateStatus(q.id, next)}
                        disabled={updating === q.id}
                        className="flex-1 py-2 text-xs font-semibold uppercase tracking-wider bg-white/[0.06] hover:bg-primary-theme/20 border border-white/[0.1] text-white/70 hover:text-white transition-all disabled:opacity-40"
                      >
                        {updating === q.id ? '...' : STATUS_LABELS[next]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}