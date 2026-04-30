import type { Booking, QuoteRequest } from '@/types/database'

import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getStats() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const [
    { count: totalBookings },
    { count: pendingBookings },
    { count: completedToday },
    { count: pendingQuotes },
  ] = await Promise.all([
    supabase.from('booking').select('*', { count: 'exact', head: true }),
    supabase.from('booking').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('booking').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('updated_at', today),
    supabase.from('quote_request').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  return {
    totalBookings: totalBookings ?? 0,
    pendingBookings: pendingBookings ?? 0,
    completedToday: completedToday ?? 0,
    pendingQuotes: pendingQuotes ?? 0,
  }
}

async function getRecentBookings(): Promise<Booking[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('booking')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

async function getRecentQuotes(): Promise<QuoteRequest[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('quote_request')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
    managed: 'badge-confirmed',
  }
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
    managed: 'Gestionado',
  }
  return <span className={map[status] ?? 'badge-pending'}>{labels[status] ?? status}</span>
}

export default async function AdminDashboard() {
  const [stats, bookings, quotes] = await Promise.all([
    getStats(),
    getRecentBookings(),
    getRecentQuotes(),
  ])

  const statCards = [
    { label: 'Total citas', value: stats.totalBookings, sub: 'histórico' },
    { label: 'Citas pendientes', value: stats.pendingBookings, sub: 'requieren atención', highlight: true },
    { label: 'Completadas hoy', value: stats.completedToday, sub: 'en las últimas 24h' },
    { label: 'Presupuestos', value: stats.pendingQuotes, sub: 'pendientes de gestionar', highlight: stats.pendingQuotes > 0 },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-5 h-0.5 bg-primary-theme" />
          <span className="eyebrow">Panel de control</span>
        </div>
        <h1 className="display-title text-3xl text-white">Operations Center</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-surface border p-5 relative overflow-hidden ${
              card.highlight ? 'border-primary-theme/40 top-border-glow' : 'border-white/[0.08]'
            }`}
          >
            <p className="eyebrow text-[10px] text-white/40 mb-3">{card.label}</p>
            <p className={`display-title text-4xl mb-1 ${card.highlight ? 'text-primary-theme' : 'text-white'}`}>
              {card.value}
            </p>
            <p className="text-xs text-white/30">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Citas recientes */}
      <div className="bg-surface border border-white/[0.08]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="text-primary-theme">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <span className="font-semibold text-white text-sm uppercase tracking-wider">Citas recientes</span>
          </div>
          <a href="/admin/citas" className="eyebrow text-[10px] text-primary-theme hover:text-white transition-colors">
            Ver todas →
          </a>
        </div>

        {bookings.length === 0 ? (
          <div className="px-6 py-10 text-center text-white/30 text-sm">No hay citas todavía</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Cliente', 'Teléfono', 'Fecha', 'Servicio', 'Estado'].map(h => (
                    <th key={h} className="px-6 py-3 text-left eyebrow text-[10px] text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-medium">{b.full_name}</td>
                    <td className="px-6 py-4 text-sm text-white/50">{b.phone}</td>
                    <td className="px-6 py-4 text-sm text-white/50">{b.preferred_date} {b.preferred_time}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{b.service_type}</td>
                    <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Presupuestos recientes */}
      <div className="bg-surface border border-white/[0.08]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="text-primary-theme">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            <span className="font-semibold text-white text-sm uppercase tracking-wider">Presupuestos recientes</span>
          </div>
          <a href="/admin/presupuestos" className="eyebrow text-[10px] text-primary-theme hover:text-white transition-colors">
            Ver todos →
          </a>
        </div>

        {quotes.length === 0 ? (
          <div className="px-6 py-10 text-center text-white/30 text-sm">No hay presupuestos todavía</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Cliente', 'Teléfono', 'Medida', 'Vehículo', 'Estado'].map(h => (
                    <th key={h} className="px-6 py-3 text-left eyebrow text-[10px] text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-medium">{q.full_name}</td>
                    <td className="px-6 py-4 text-sm text-white/50">{q.phone}</td>
                    <td className="px-6 py-4 text-sm text-white/70 font-mono">
                      {q.tyre_width && q.tyre_aspect_ratio && q.rim_diameter
                        ? `${q.tyre_width}/${q.tyre_aspect_ratio} R${q.rim_diameter}`
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/50">
                      {q.vehicle_make && q.vehicle_model ? `${q.vehicle_make} ${q.vehicle_model}` : '—'}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={q.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}